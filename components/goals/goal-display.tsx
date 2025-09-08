'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Goal {
  id: string;
  target_weight: number;
  current_weight?: number;
  deadline: string;
  created_at: string;
}

interface GoalDisplayProps {
  goal?: Goal | null;
  onSetGoal: () => void;
  onEditGoal: () => void;
}

export function GoalDisplay({ goal, onSetGoal, onEditGoal }: GoalDisplayProps) {
  if (!goal) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Active Goal</CardTitle>
          <CardDescription>
            Set a weight goal to start tracking your progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Click &quot;Set Goal&quot; to create your first weight target with a deadline.
          </p>
          <Button onClick={onSetGoal}>Set Goal</Button>
        </CardContent>
      </Card>
    );
  }

  const deadline = new Date(goal.deadline);
  const today = new Date();
  const daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysRemaining < 0;

  // Calculate required progress (if current weight is available)
  const weightToLose = goal.current_weight ? goal.current_weight - goal.target_weight : null;
  const dailyRequired = weightToLose && daysRemaining > 0 ? weightToLose / daysRemaining : null;
  const weeklyRequired = dailyRequired ? dailyRequired * 7 : null;
  const monthlyRequired = dailyRequired ? dailyRequired * 30 : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              🎯 Weight Goal
              <Badge variant={isOverdue ? "destructive" : "default"}>
                {isOverdue ? 'Overdue' : 'Active'}
              </Badge>
            </CardTitle>
            <CardDescription>
              Target: {goal.target_weight} kg by {deadline.toLocaleDateString()}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onEditGoal}>
            Edit Goal
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* D-Day Countdown */}
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold text-primary">
            {isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days remaining`}
          </div>
          <div className="text-sm text-muted-foreground">
            until {deadline.toLocaleDateString()}
          </div>
        </div>

        {/* Progress Requirements */}
        {goal.current_weight && weightToLose && dailyRequired && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2">Required Progress</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-lg">
                    {dailyRequired.toFixed(2)} kg
                  </div>
                  <div className="text-muted-foreground">per day</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg">
                    {weeklyRequired?.toFixed(2)} kg
                  </div>
                  <div className="text-muted-foreground">per week</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg">
                    {monthlyRequired?.toFixed(2)} kg
                  </div>
                  <div className="text-muted-foreground">per month</div>
                </div>
              </div>
            </div>
          </>
        )}

        {!goal.current_weight && (
          <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded">
            💡 Add your first weight entry to see progress requirements
          </div>
        )}
      </CardContent>
    </Card>
  );
}