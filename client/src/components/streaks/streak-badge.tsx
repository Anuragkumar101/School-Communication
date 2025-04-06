import React from 'react';
import { Flame, Trophy, Star, Medal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakBadgeProps {
  streak: number;
  longestStreak: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function StreakBadge({ 
  streak, 
  longestStreak, 
  size = 'md', 
  showText = true,
  className
}: StreakBadgeProps) {
  // Determine the icon based on streak length
  const BadgeIcon = () => {
    if (streak >= 30) return <Trophy className="text-yellow-500" />;
    if (streak >= 14) return <Medal className="text-blue-500" />;
    if (streak >= 7) return <Star className="text-purple-500" />;
    return <Flame className={streak > 0 ? "text-orange-500" : "text-gray-400"} />;
  };
  
  // Determine sizes based on the size prop
  const sizeClasses = {
    sm: {
      container: "p-1 text-xs",
      icon: "w-3 h-3",
      number: "text-xs font-bold",
      text: "text-xs"
    },
    md: {
      container: "p-1.5 text-sm",
      icon: "w-4 h-4",
      number: "text-sm font-bold",
      text: "text-xs"
    },
    lg: {
      container: "p-2 text-base",
      icon: "w-5 h-5",
      number: "text-base font-bold",
      text: "text-sm"
    }
  };
  
  const sizes = sizeClasses[size];
  
  // Determine color based on streak length
  const getColorClass = () => {
    if (streak >= 30) return "bg-yellow-100 border-yellow-300";
    if (streak >= 14) return "bg-blue-100 border-blue-300";
    if (streak >= 7) return "bg-purple-100 border-purple-300";
    if (streak > 0) return "bg-orange-100 border-orange-300";
    return "bg-gray-100 border-gray-300";
  };
  
  return (
    <div className={cn(
      "flex items-center gap-1 border rounded-full", 
      getColorClass(),
      sizes.container,
      className
    )}>
      <div className="flex items-center justify-center">
        <BadgeIcon />
      </div>
      
      {showText && (
        <>
          <span className={sizes.number}>{streak}</span>
          <span className={cn(sizes.text, "text-gray-700")}>
            day{streak !== 1 ? 's' : ''}
          </span>
        </>
      )}
    </div>
  );
}