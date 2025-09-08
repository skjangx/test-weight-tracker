'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Goal {
  id: string;
  target_weight: number;
  deadline: string;
  created_at: string;
}

interface GoalSettingModalProps {
  goal?: Goal | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (goalData: { target_weight: number; deadline: string }) => void;
  trigger?: React.ReactNode;
}

export function GoalSettingModal({ 
  goal, 
  isOpen, 
  onClose, 
  onSave, 
  trigger 
}: GoalSettingModalProps) {
  const [targetWeight, setTargetWeight] = useState(goal?.target_weight.toString() || '');
  const [deadline, setDeadline] = useState(
    goal?.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : ''
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setError('');
    
    // Validation
    if (!targetWeight || !deadline) {
      setError('Please fill in all fields');
      return;
    }

    const weight = parseFloat(targetWeight);
    if (isNaN(weight) || weight <= 0) {
      setError('Please enter a valid weight');
      return;
    }

    const deadlineDate = new Date(deadline);
    if (deadlineDate <= new Date()) {
      setError('Deadline must be in the future');
      return;
    }

    setIsLoading(true);
    try {
      await onSave({
        target_weight: weight,
        deadline: deadlineDate.toISOString()
      });
      onClose();
      setTargetWeight('');
      setDeadline('');
    } catch (err) {
      setError('Failed to save goal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const modalContent = (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>{goal ? 'Edit Goal' : 'Set New Goal'}</SheetTitle>
        <SheetDescription>
          {goal 
            ? 'Update your weight target and deadline'
            : 'Set your target weight and deadline to start tracking progress'
          }
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-6 mt-6">
        <div className="space-y-2">
          <Label htmlFor="target-weight">Target Weight (kg)</Label>
          <Input
            id="target-weight"
            type="number"
            step="0.1"
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
            placeholder="e.g., 70.5"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="deadline">Deadline</Label>
          <Input
            id="deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            disabled={isLoading}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={isLoading} className="flex-1">
            {isLoading ? 'Saving...' : (goal ? 'Update Goal' : 'Set Goal')}
          </Button>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </div>
    </SheetContent>
  );

  if (trigger) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetTrigger asChild>
          {trigger}
        </SheetTrigger>
        {modalContent}
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {modalContent}
    </Sheet>
  );
}