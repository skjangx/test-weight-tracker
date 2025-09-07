// Re-export database types for consistency
export type { User, Goal, WeightEntry } from '@/lib/supabase';

// Auth types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupData {
  username: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
}

export interface JWTPayload {
  userId: string;
  username: string;
  iat?: number;
  exp?: number;
}

// Goal management types
export interface GoalFormData {
  target_weight: number;
  deadline: string;
}

export interface GoalProgress {
  current_weight?: number;
  days_remaining: number;
  daily_required: number;
  weekly_required: number;
  monthly_required: number;
}

// Weight entry types
export interface WeightEntryFormData {
  weight: number;
  memo?: string;
  date?: string;
}

export interface WeightStats {
  daily_change: number;
  daily_change_percent: number;
  moving_avg_change: number;
  moving_avg_change_percent: number;
  remaining_to_goal?: number;
}