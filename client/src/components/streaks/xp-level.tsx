import React from 'react';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface XpLevelProps {
  level: number;
  totalXp: number;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function XpLevel({
  level,
  totalXp,
  showProgress = true,
  size = 'md',
  className
}: XpLevelProps) {
  // Calculate progress to next level
  // The formula is: level = 1 + Math.floor(totalXp / 1000)
  // So the next level requires (level) * 1000 XP
  const xpForCurrentLevel = (level - 1) * 1000;
  const xpForNextLevel = level * 1000;
  const currentLevelXp = totalXp - xpForCurrentLevel;
  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
  const progressPercent = Math.min(100, Math.round((currentLevelXp / xpNeededForNextLevel) * 100));
  
  // Size styles
  const sizeClasses = {
    sm: {
      badge: "h-5 w-5 text-xs",
      text: "text-xs",
      container: "space-y-1"
    },
    md: {
      badge: "h-6 w-6 text-sm",
      text: "text-sm",
      container: "space-y-1.5"
    },
    lg: {
      badge: "h-8 w-8 text-base",
      text: "text-base",
      container: "space-y-2"
    }
  };
  
  const sizes = sizeClasses[size];
  
  // Function to get level badge color
  const getLevelBadgeColor = () => {
    if (level >= 50) return "bg-purple-500 text-white";
    if (level >= 30) return "bg-blue-500 text-white";
    if (level >= 20) return "bg-green-500 text-white";
    if (level >= 10) return "bg-yellow-500 text-white";
    return "bg-gray-500 text-white";
  };
  
  // Function to get progress bar color
  const getProgressColor = () => {
    if (level >= 50) return "bg-purple-500";
    if (level >= 30) return "bg-blue-500";
    if (level >= 20) return "bg-green-500";
    if (level >= 10) return "bg-yellow-500";
    return "bg-gray-500";
  };
  
  return (
    <div className={cn(sizes.container, className)}>
      <div className="flex items-center gap-2">
        <div className={cn(
          "flex items-center justify-center rounded-full",
          getLevelBadgeColor(),
          sizes.badge
        )}>
          <Star className="w-3 h-3" />
        </div>
        <div className="flex flex-col">
          <span className={cn("font-medium", sizes.text)}>Level {level}</span>
          {showProgress && (
            <span className="text-xs text-gray-500">
              {currentLevelXp} / {xpNeededForNextLevel} XP to level {level + 1}
            </span>
          )}
        </div>
      </div>
      
      {showProgress && (
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={cn("h-full flex-1 transition-all", getProgressColor())}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
}