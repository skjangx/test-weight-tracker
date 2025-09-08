'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GoalDisplay } from '@/components/goals/goal-display';
import { GoalSettingModal } from '@/components/goals/goal-setting-modal';

export default function DashboardPage() {
  const [currentGoal, setCurrentGoal] = useState(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  const handleSetGoal = () => {
    setIsGoalModalOpen(true);
  };

  const handleEditGoal = () => {
    setIsGoalModalOpen(true);
  };

  const handleSaveGoal = async (goalData: { target_weight: number; deadline: string }) => {
    // TODO: Implement API call to save goal
    console.log('Saving goal:', goalData);
    
    // For now, just simulate saving by updating local state
    const newGoal = {
      id: 'temp-id',
      target_weight: goalData.target_weight,
      deadline: goalData.deadline,
      created_at: new Date().toISOString(),
      current_weight: 75 // TODO: Get from actual weight entries
    };
    
    setCurrentGoal(newGoal);
    setIsGoalModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Goal Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold tracking-tight">Your Goal</h2>
        </div>
        
        <GoalDisplay 
          goal={currentGoal}
          onSetGoal={handleSetGoal}
          onEditGoal={handleEditGoal}
        />
        
        <GoalSettingModal
          goal={currentGoal}
          isOpen={isGoalModalOpen}
          onClose={() => setIsGoalModalOpen(false)}
          onSave={handleSaveGoal}
        />
      </section>

      {/* Weight Entry Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold tracking-tight">Weight Log</h2>
          <Button>Add Entry</Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
            <CardDescription>
              Your latest weight measurements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              No weight entries yet. Add your first measurement to get started!
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Progress Chart Section */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Progress Chart</CardTitle>
            <CardDescription>
              Visual representation of your weight journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Chart will appear here once you have weight entries
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}