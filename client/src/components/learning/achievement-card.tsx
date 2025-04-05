import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, CircleDashed, Trophy, Star, BookOpen, Brain, Zap, Award } from "lucide-react";

interface AchievementCardProps {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  category: "quiz" | "streak" | "mastery" | "exploration" | "engagement";
  isCompleted: boolean;
}

const AchievementCard = ({
  id,
  title,
  description,
  progress,
  maxProgress,
  category,
  isCompleted
}: AchievementCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const getProgressPercentage = () => {
    return Math.min(100, Math.round((progress / maxProgress) * 100));
  };
  
  const getCategoryIcon = () => {
    switch (category) {
      case "quiz":
        return <Trophy className="h-5 w-5 text-amber-500" />;
      case "streak":
        return <Zap className="h-5 w-5 text-blue-500" />;
      case "mastery":
        return <Star className="h-5 w-5 text-purple-500" />;
      case "exploration":
        return <BookOpen className="h-5 w-5 text-green-500" />;
      case "engagement":
        return <Brain className="h-5 w-5 text-pink-500" />;
      default:
        return <Award className="h-5 w-5 text-primary" />;
    }
  };
  
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 ${
        isCompleted 
          ? "border-2 border-primary/30 bg-primary/5" 
          : "hover:bg-muted/50"
      }`}
      onClick={() => setShowDetails(!showDetails)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`mt-1 rounded-full p-2 ${
            isCompleted ? "bg-primary/20" : "bg-muted"
          }`}>
            {isCompleted ? (
              <CheckCircle className="h-5 w-5 text-primary" />
            ) : (
              <CircleDashed className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="font-medium">{title}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {getCategoryIcon()}
                <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
              </div>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{description}</div>
            
            {showDetails && (
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Progress:</span>
                  <span>{progress} / {maxProgress}</span>
                </div>
                <Progress value={getProgressPercentage()} className="h-2" />
                
                {isCompleted && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-primary font-medium">
                    <Trophy className="h-4 w-4" />
                    <span>Achievement completed!</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementCard;