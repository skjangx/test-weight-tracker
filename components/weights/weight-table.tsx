'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  TableIcon,
  EditIcon,
  TrashIcon 
} from 'lucide-react';
import { WeightModal } from './weight-modal';

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  memo?: string;
  created_at: string;
  updated_at: string;
}

interface WeightTableProps {
  refreshKey?: number;
  currentGoal?: { target_weight: number } | null;
}

export function WeightTable({ refreshKey = 0, currentGoal }: WeightTableProps) {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<WeightEntry | null>(null);
  
  // Inline editing state
  const [editingCell, setEditingCell] = useState<{entryId: string; field: 'weight' | 'memo'} | null>(null);
  const [editValues, setEditValues] = useState<{weight: string; memo: string}>({weight: '', memo: ''});
  const editInputRef = useRef<HTMLInputElement>(null);

  // Calculate current month/year for pagination
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthName = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  useEffect(() => {
    fetchWeightEntries();
  }, [refreshKey, currentMonth, currentYear]);

  const fetchWeightEntries = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/weights?limit=100', {
        credentials: 'include',
      });
      
      const result = await response.json();
      if (result.success) {
        // Filter entries for current month
        const monthEntries = result.data.filter((entry: WeightEntry) => {
          const entryDate = new Date(entry.date);
          return entryDate.getMonth() === currentMonth && 
                 entryDate.getFullYear() === currentYear;
        });
        setEntries(monthEntries.sort((a: WeightEntry, b: WeightEntry) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ));
      }
    } catch (error) {
      console.error('Error fetching weight entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDailyChange = (current: number, previous?: number): number => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  const calculateMovingAverage = (entries: WeightEntry[], index: number, days: number = 7): number => {
    const startIndex = Math.max(0, index - days + 1);
    const subset = entries.slice(startIndex, index + 1);
    const sum = subset.reduce((acc, entry) => acc + entry.weight, 0);
    return sum / subset.length;
  };

  const getRemainingToGoal = (weight: number): { text: string; achieved: boolean } => {
    if (!currentGoal) return { text: '--', achieved: false };
    const remaining = weight - currentGoal.target_weight;
    const achieved = remaining <= 0;
    return {
      text: achieved ? 'Goal reached!' : `${remaining.toFixed(1)} kg`,
      achieved
    };
  };

  const getGoalAchievementEmoji = (weight: number): string => {
    if (!currentGoal) return '';
    const remaining = weight - currentGoal.target_weight;
    if (remaining <= 0) return '🎉'; // Goal reached or exceeded
    return '';
  };

  const formatPercentage = (value: number): string => {
    if (value === 0) return '0.0%';
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getChangeColor = (value: number): string => {
    if (value === 0) return 'text-muted-foreground';
    return value < 0 ? 'text-green-600' : 'text-red-600';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    setCurrentDate(newDate);
  };

  const handleEdit = (entry: WeightEntry) => {
    setEditingEntry(entry);
    setEditModalOpen(true);
  };

  const handleDelete = async (entryId: string) => {
    if (!confirm('Are you sure you want to delete this weight entry?')) return;

    try {
      const response = await fetch(`/api/weights?id=${entryId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const result = await response.json();
      if (result.success) {
        fetchWeightEntries(); // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting weight entry:', error);
    }
  };

  // Inline editing functions
  const startInlineEdit = (entry: WeightEntry, field: 'weight' | 'memo') => {
    setEditingCell({ entryId: entry.id, field });
    setEditValues({
      weight: entry.weight.toString(),
      memo: entry.memo || ''
    });
    
    // Focus the input after the next render
    setTimeout(() => {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }, 0);
  };

  const cancelInlineEdit = () => {
    setEditingCell(null);
    setEditValues({ weight: '', memo: '' });
  };

  const saveInlineEdit = async () => {
    if (!editingCell) return;

    const entry = entries.find(e => e.id === editingCell.entryId);
    if (!entry) return;

    const updatedWeight = editingCell.field === 'weight' ? parseFloat(editValues.weight) : entry.weight;
    const updatedMemo = editingCell.field === 'memo' ? editValues.memo : entry.memo;

    // Validate weight
    if (editingCell.field === 'weight' && (isNaN(updatedWeight) || updatedWeight <= 0)) {
      alert('Please enter a valid weight');
      return;
    }

    try {
      const response = await fetch('/api/weights', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          entryId: entry.id,
          weight: updatedWeight,
          memo: updatedMemo || null
        })
      });

      const result = await response.json();
      if (result.success) {
        await fetchWeightEntries(); // Refresh the list
        cancelInlineEdit();
      } else {
        alert(result.error || 'Failed to update entry');
      }
    } catch (error) {
      console.error('Error updating weight entry:', error);
      alert('Failed to update entry');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveInlineEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelInlineEdit();
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Calculate monthly average
  const monthlyAverage = entries.length > 0 
    ? entries.reduce((sum, entry) => sum + entry.weight, 0) / entries.length 
    : 0;

  // Calculate weekly averages for the month
  const getWeeklyAverages = (): Array<{ week: number; average: number; count: number }> => {
    if (entries.length === 0) return [];

    const weeks: { [key: number]: { weights: number[]; dates: Date[] } } = {};
    
    entries.forEach(entry => {
      const date = new Date(entry.date);
      const startOfMonth = new Date(currentYear, currentMonth, 1);
      const dayOfMonth = date.getDate();
      const weekNumber = Math.ceil(dayOfMonth / 7);
      
      if (!weeks[weekNumber]) {
        weeks[weekNumber] = { weights: [], dates: [] };
      }
      weeks[weekNumber].weights.push(entry.weight);
      weeks[weekNumber].dates.push(date);
    });

    return Object.keys(weeks).map(weekStr => {
      const week = parseInt(weekStr);
      const weekData = weeks[week];
      const average = weekData.weights.reduce((sum, w) => sum + w, 0) / weekData.weights.length;
      return {
        week,
        average,
        count: weekData.weights.length
      };
    }).sort((a, b) => a.week - b.week);
  };

  const weeklyAverages = getWeeklyAverages();
  const weeklyAveragesText = weeklyAverages.length > 0 
    ? weeklyAverages.map(w => `W${w.week}: ${w.average.toFixed(1)}kg (${w.count})`).join(' • ')
    : 'No weekly data';

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TableIcon className="w-5 h-5" />
              Weight Entries
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium min-w-[120px] text-center">
                {monthName}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigateMonth('next')}
                disabled={currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()}
              >
                <ChevronRightIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {entries.length > 0 && (
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">
                Monthly Average: <span className="font-medium">{monthlyAverage.toFixed(1)} kg</span>
                {' • '}
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
              </div>
              {weeklyAverages.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  Weekly Averages: {weeklyAveragesText}
                </div>
              )}
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading entries...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <TableIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Entries This Month</h3>
              <p className="text-muted-foreground">
                Start logging your weight to see your progress data.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <div className="rounded-md border overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-3 font-medium w-[140px]">Date</th>
                        <th className="text-left p-3 font-medium w-[90px]">Weight</th>
                        <th className="text-left p-3 font-medium w-[110px]">Daily Change</th>
                        <th className="text-left p-3 font-medium w-[130px]">7-Day Avg Change</th>
                        <th className="text-left p-3 font-medium w-[90px]">To Goal</th>
                        <th className="text-left p-3 font-medium w-[200px]">Memo</th>
                        <th className="text-right p-3 font-medium w-[90px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((entry, index) => {
                        const previousEntry = entries[index + 1];
                        const dailyChange = calculateDailyChange(entry.weight, previousEntry?.weight);
                        const movingAvg = calculateMovingAverage(entries, index);
                        const prevMovingAvg = index < entries.length - 1 
                          ? calculateMovingAverage(entries, index + 1) 
                          : movingAvg;
                        const movingAvgChange = calculateDailyChange(movingAvg, prevMovingAvg);

                        return (
                          <tr key={entry.id} className="border-b hover:bg-muted/25">
                            <td className="p-3 w-[140px]">
                              <div className="flex flex-col">
                                <span className="font-medium text-sm">{formatDate(entry.date)}</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(entry.created_at)}
                                </span>
                              </div>
                            </td>
                            <td 
                              className="p-3 font-medium w-[90px] text-sm cursor-pointer hover:bg-muted/50 rounded"
                              onDoubleClick={() => startInlineEdit(entry, 'weight')}
                              title="Double-click to edit"
                            >
                              {editingCell?.entryId === entry.id && editingCell.field === 'weight' ? (
                                <Input
                                  ref={editInputRef}
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  value={editValues.weight}
                                  onChange={(e) => setEditValues(prev => ({ ...prev, weight: e.target.value }))}
                                  onKeyDown={handleKeyDown}
                                  onBlur={saveInlineEdit}
                                  className="h-6 text-sm w-16 p-1 border-primary"
                                />
                              ) : (
                                <span>{entry.weight.toFixed(1)} kg</span>
                              )}
                            </td>
                            <td className={`p-3 w-[110px] text-sm ${getChangeColor(dailyChange)}`}>
                              {formatPercentage(dailyChange)}
                            </td>
                            <td className={`p-3 w-[130px] text-sm ${getChangeColor(movingAvgChange)}`}>
                              {formatPercentage(movingAvgChange)}
                            </td>
                            <td className="p-3 w-[90px] text-sm">
                              <div className="flex items-center gap-1">
                                <span>{getRemainingToGoal(entry.weight).text}</span>
                                {getGoalAchievementEmoji(entry.weight) && (
                                  <span className="text-base" title="Goal achieved!">🎉</span>
                                )}
                              </div>
                            </td>
                            <td 
                              className="p-3 w-[200px] cursor-pointer hover:bg-muted/50 rounded"
                              onDoubleClick={() => startInlineEdit(entry, 'memo')}
                              title="Double-click to edit"
                            >
                              {editingCell?.entryId === entry.id && editingCell.field === 'memo' ? (
                                <Input
                                  ref={editInputRef}
                                  type="text"
                                  value={editValues.memo}
                                  onChange={(e) => setEditValues(prev => ({ ...prev, memo: e.target.value }))}
                                  onKeyDown={handleKeyDown}
                                  onBlur={saveInlineEdit}
                                  className="h-6 text-sm w-full p-1 border-primary"
                                  placeholder="Add a memo..."
                                />
                              ) : (
                                <>
                                  {entry.memo ? (
                                    <div className="text-sm leading-tight" title={entry.memo}>
                                      <span className="break-words">
                                        {entry.memo.length > 40 
                                          ? `${entry.memo.substring(0, 40)}...` 
                                          : entry.memo
                                        }
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground text-sm">--</span>
                                  )}
                                </>
                              )}
                            </td>
                            <td className="p-3 w-[90px]">
                              <div className="flex items-center justify-end gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleEdit(entry)}
                                  className="h-8 w-8 p-0"
                                >
                                  <EditIcon className="w-3 h-3" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleDelete(entry.id)}
                                  className="text-destructive hover:text-destructive h-8 w-8 p-0"
                                >
                                  <TrashIcon className="w-3 h-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-2">
                {entries.map((entry, index) => {
                  const movingAvg = calculateMovingAverage(entries, index);
                  const prevMovingAvg = index < entries.length - 1 
                    ? calculateMovingAverage(entries, index + 1) 
                    : movingAvg;
                  const movingAvgChange = calculateDailyChange(movingAvg, prevMovingAvg);

                  return (
                    <Card key={entry.id} className="p-3">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{formatDate(entry.date)}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatTime(entry.created_at)}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEdit(entry)}
                            className="h-7 w-7 p-0"
                          >
                            <EditIcon className="w-3 h-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(entry.id)}
                            className="text-destructive hover:text-destructive h-7 w-7 p-0"
                          >
                            <TrashIcon className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Weight</div>
                          <div 
                            className="font-semibold text-sm cursor-pointer hover:bg-muted/50 rounded p-1 -m-1"
                            onDoubleClick={() => startInlineEdit(entry, 'weight')}
                            title="Double-click to edit"
                          >
                            {editingCell?.entryId === entry.id && editingCell.field === 'weight' ? (
                              <Input
                                ref={editInputRef}
                                type="number"
                                step="0.1"
                                min="0"
                                value={editValues.weight}
                                onChange={(e) => setEditValues(prev => ({ ...prev, weight: e.target.value }))}
                                onKeyDown={handleKeyDown}
                                onBlur={saveInlineEdit}
                                className="h-6 text-sm w-20 p-1 border-primary"
                              />
                            ) : (
                              <span>{entry.weight.toFixed(1)} kg</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">7-Day Avg Change</div>
                          <div className={`font-semibold text-sm ${getChangeColor(movingAvgChange)}`}>
                            {formatPercentage(movingAvgChange)}
                          </div>
                        </div>
                      </div>

                      {currentGoal && (
                        <div className="mb-3">
                          <div className="text-xs text-muted-foreground mb-1">To Goal</div>
                          <div className="flex items-center gap-1 text-sm font-medium">
                            <span>{getRemainingToGoal(entry.weight).text}</span>
                            {getGoalAchievementEmoji(entry.weight) && (
                              <span className="text-base" title="Goal achieved!">🎉</span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="pt-3 border-t">
                        <div className="text-xs text-muted-foreground mb-1">Memo</div>
                        <div 
                          className="text-sm leading-relaxed break-words cursor-pointer hover:bg-muted/50 rounded p-1 -m-1 min-h-[24px]"
                          onDoubleClick={() => startInlineEdit(entry, 'memo')}
                          title="Double-click to edit"
                        >
                          {editingCell?.entryId === entry.id && editingCell.field === 'memo' ? (
                            <Input
                              ref={editInputRef}
                              type="text"
                              value={editValues.memo}
                              onChange={(e) => setEditValues(prev => ({ ...prev, memo: e.target.value }))}
                              onKeyDown={handleKeyDown}
                              onBlur={saveInlineEdit}
                              className="h-6 text-sm w-full p-1 border-primary"
                              placeholder="Add a memo..."
                            />
                          ) : (
                            <span className={entry.memo ? "" : "text-muted-foreground"}>
                              {entry.memo || "--"}
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <WeightModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingEntry(null);
        }}
        onEntryCreated={fetchWeightEntries}
        onEntryUpdated={fetchWeightEntries}
        entry={editingEntry}
        mode="edit"
      />
    </>
  );
}