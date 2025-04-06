import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, BookOpen, Award, Trophy, Check, Calendar, 
  Brain, MessageSquare, PlusCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface XpActivity {
  id: number;
  activity: string;
  description: string;
  xpEarned: number;
  createdAt: string | Date;
}

interface XpActivityListProps {
  activities: XpActivity[];
  className?: string;
}

export function XpActivityList({ activities, className }: XpActivityListProps) {
  // Function to format date
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  // Function to get icon based on activity type
  const getActivityIcon = (activity: string) => {
    switch (activity) {
      case 'daily_login':
        return <Calendar className="w-4 h-4" />;
      case 'quiz_completion':
        return <BookOpen className="w-4 h-4" />;
      case 'perfect_score':
        return <Trophy className="w-4 h-4" />;
      case 'homework_help':
        return <MessageSquare className="w-4 h-4" />;
      case 'streak_milestone':
        return <Award className="w-4 h-4" />;
      case 'challenge_complete':
        return <Check className="w-4 h-4" />;
      case 'learning_video':
        return <Brain className="w-4 h-4" />;
      default:
        return <PlusCircle className="w-4 h-4" />;
    }
  };
  
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <Zap className="w-12 h-12 text-gray-300 mb-2" />
        <h3 className="text-lg font-medium">No XP activities yet</h3>
        <p className="text-sm text-gray-500">
          Complete tasks to earn XP and see your activity here
        </p>
      </div>
    );
  }
  
  return (
    <div className={cn("space-y-3", className)}>
      {activities.map((activity) => (
        <Card key={activity.id} className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary-50 p-2 rounded-full">
              {getActivityIcon(activity.activity)}
            </div>
            <div>
              <p className="font-medium">{activity.description}</p>
              <p className="text-xs text-gray-500">{formatDate(activity.createdAt)}</p>
            </div>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            <span>+{activity.xpEarned} XP</span>
          </Badge>
        </Card>
      ))}
    </div>
  );
}