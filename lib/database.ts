import { supabase } from './supabase';
import type { User, Goal, WeightEntry } from './supabase';

// Database helper functions for Weight Tracker

// User operations
export async function createUser(username: string, passwordHash: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .insert({ username, password_hash: passwordHash })
    .select()
    .single();

  if (error) {
    console.error('Error creating user:', error);
    return null;
  }
  return data;
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error) {
    console.error('Error getting user by username:', error);
    return null;
  }
  return data;
}

export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error getting user by id:', error);
    return null;
  }
  return data;
}

// Goal operations
export async function createGoal(userId: string, targetWeight: number, deadline: string): Promise<Goal | null> {
  // First, deactivate any existing active goals
  await supabase
    .from('goals')
    .update({ is_active: false })
    .eq('user_id', userId)
    .eq('is_active', true);

  // Then create the new goal
  const { data, error } = await supabase
    .from('goals')
    .insert({
      user_id: userId,
      target_weight: targetWeight,
      deadline,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating goal:', error);
    return null;
  }
  return data;
}

export async function getActiveGoal(userId: string): Promise<Goal | null> {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error getting active goal:', error);
    return null;
  }
  return data;
}

export async function getGoalHistory(userId: string): Promise<Goal[]> {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error getting goal history:', error);
    return [];
  }
  return data || [];
}

export async function updateGoal(goalId: string, updates: Partial<Pick<Goal, 'target_weight' | 'deadline'>>): Promise<Goal | null> {
  const { data, error } = await supabase
    .from('goals')
    .update(updates)
    .eq('id', goalId)
    .select()
    .single();

  if (error) {
    console.error('Error updating goal:', error);
    return null;
  }
  return data;
}

export async function deleteGoal(goalId: string): Promise<boolean> {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', goalId);

  if (error) {
    console.error('Error deleting goal:', error);
    return false;
  }
  return true;
}

// Weight entry operations
export async function createWeightEntry(userId: string, weight: number, date: string, memo?: string): Promise<WeightEntry | null> {
  const { data, error } = await supabase
    .from('weight_entries')
    .insert({
      user_id: userId,
      weight,
      date,
      memo,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating weight entry:', error);
    return null;
  }
  return data;
}

export async function getWeightEntriesForUser(userId: string, limit?: number): Promise<WeightEntry[]> {
  let query = supabase
    .from('weight_entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error getting weight entries:', error);
    return [];
  }
  return data || [];
}

export async function getWeightEntriesForMonth(userId: string, year: number, month: number): Promise<WeightEntry[]> {
  const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
  const endDate = new Date(year, month, 0).toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('weight_entries')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error getting weight entries for month:', error);
    return [];
  }
  return data || [];
}

export async function updateWeightEntry(entryId: string, updates: Partial<Pick<WeightEntry, 'weight' | 'memo'>>): Promise<WeightEntry | null> {
  const { data, error } = await supabase
    .from('weight_entries')
    .update(updates)
    .eq('id', entryId)
    .select()
    .single();

  if (error) {
    console.error('Error updating weight entry:', error);
    return null;
  }
  return data;
}

export async function deleteWeightEntry(entryId: string): Promise<boolean> {
  const { error } = await supabase
    .from('weight_entries')
    .delete()
    .eq('id', entryId);

  if (error) {
    console.error('Error deleting weight entry:', error);
    return false;
  }
  return true;
}

// Utility functions
export async function getAveragedWeightEntriesForUser(userId: string): Promise<Array<{ date: string; weight: number; memo?: string }>> {
  const entries = await getWeightEntriesForUser(userId);
  
  // Group entries by date and average weights
  const dateGroups: Record<string, { weights: number[]; memos: string[] }> = {};
  
  entries.forEach(entry => {
    if (!dateGroups[entry.date]) {
      dateGroups[entry.date] = { weights: [], memos: [] };
    }
    dateGroups[entry.date].weights.push(entry.weight);
    if (entry.memo) {
      dateGroups[entry.date].memos.push(entry.memo);
    }
  });

  // Average the weights for each date
  return Object.entries(dateGroups).map(([date, { weights, memos }]) => ({
    date,
    weight: Number((weights.reduce((sum, w) => sum + w, 0) / weights.length).toFixed(2)),
    memo: memos.length > 0 ? memos[0] : undefined, // Use first memo if multiple
  })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}