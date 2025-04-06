import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Trophy, Award, Filter, CircleDashed } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import AchievementCard from "@/components/learning/achievement-card";
import { useAuth } from "@/hooks/use-auth";

export default function AchievementsPage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const { data: achievements, isLoading } = useQuery({
    queryKey: ["/api/achievements", currentUser?.uid],
    enabled: !!currentUser
  });
  
  // Mock achievements data for display purposes
  const mockAchievements = [
    {
      id: "1",
      title: "Quiz Master",
      description: "Complete 10 quizzes with a score of 80% or higher",
      progress: 7,
      maxProgress: 10,
      category: "quiz",
      isCompleted: false
    },
    {
      id: "2",
      title: "Science Whiz",
      description: "Answer 50 science questions correctly",
      progress: 50,
      maxProgress: 50,
      category: "mastery",
      isCompleted: true
    },
    {
      id: "3",
      title: "Math Explorer",
      description: "Complete all math quizzes in the platform",
      progress: 3,
      maxProgress: 5,
      category: "exploration",
      isCompleted: false
    },
    {
      id: "4",
      title: "Daily Learner",
      description: "Log in and complete at least one activity for 7 consecutive days",
      progress: 4,
      maxProgress: 7,
      category: "streak",
      isCompleted: false
    },
    {
      id: "5",
      title: "Challenge Champion",
      description: "Win 5 challenges against your friends",
      progress: 3,
      maxProgress: 5,
      category: "engagement",
      isCompleted: false
    },
    {
      id: "6",
      title: "Flashcard Fanatic",
      description: "Study 100 flashcards",
      progress: 100,
      maxProgress: 100,
      category: "mastery",
      isCompleted: true
    },
    {
      id: "7",
      title: "Perfect Score",
      description: "Get a perfect score on any quiz",
      progress: 1,
      maxProgress: 1,
      category: "quiz",
      isCompleted: true
    },
    {
      id: "8",
      title: "Video Scholar",
      description: "Watch 20 educational videos",
      progress: 12,
      maxProgress: 20,
      category: "exploration",
      isCompleted: false
    },
    {
      id: "9",
      title: "Fact Finder",
      description: "Discover 30 daily facts",
      progress: 30,
      maxProgress: 30,
      category: "exploration",
      isCompleted: true
    },
    {
      id: "10",
      title: "Social Butterfly",
      description: "Challenge 10 different friends",
      progress: 4,
      maxProgress: 10,
      category: "engagement",
      isCompleted: false
    }
  ];
  
  const filteredAchievements = mockAchievements.filter(achievement => {
    // Filter by tab
    if (activeTab !== "all" && achievement.category !== activeTab) {
      return false;
    }
    
    // Filter by search
    if (searchQuery && !achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !achievement.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const getCompletedCount = () => {
    return mockAchievements.filter(a => a.isCompleted).length;
  };
  
  const getTotalAchievements = () => {
    return mockAchievements.length;
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
            <p className="text-muted-foreground mt-1">Track your progress and earn rewards</p>
          </div>
          <div className="flex gap-2">
            <Link href="/learning">
              <Button variant="outline">Back to Learning</Button>
            </Link>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search achievements..." 
                  className="pl-8" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-[400px]">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="quiz">Quiz</TabsTrigger>
                  <TabsTrigger value="streak">Streak</TabsTrigger>
                  <TabsTrigger value="mastery">Mastery</TabsTrigger>
                  <TabsTrigger value="exploration">Explore</TabsTrigger>
                  <TabsTrigger value="engagement">Social</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <TabsContent value={activeTab} className="mt-0">
              {isLoading ? (
                <div className="text-center py-10">Loading achievements...</div>
              ) : filteredAchievements.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {filteredAchievements.map((achievement) => (
                    <AchievementCard 
                      key={achievement.id}
                      id={achievement.id}
                      title={achievement.title}
                      description={achievement.description}
                      progress={achievement.progress}
                      maxProgress={achievement.maxProgress}
                      category={achievement.category as any}
                      isCompleted={achievement.isCompleted}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No achievements found.</p>
                </div>
              )}
            </TabsContent>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-primary/20 to-transparent p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Your Progress</h3>
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              
              <div className="text-4xl font-bold">{getCompletedCount()}/{getTotalAchievements()}</div>
              <p className="text-sm text-muted-foreground mt-1">achievements unlocked</p>
              
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>{Math.round((getCompletedCount() / getTotalAchievements()) * 100)}%</span>
                </div>
                <Progress value={(getCompletedCount() / getTotalAchievements()) * 100} className="h-2" />
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">Recently Earned</h3>
              
              <div className="space-y-3">
                {mockAchievements
                  .filter(a => a.isCompleted)
                  .slice(0, 3)
                  .map(achievement => (
                    <div key={achievement.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{achievement.title}</div>
                        <div className="text-xs text-muted-foreground">{achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1)}</div>
                      </div>
                    </div>
                  ))}
                
                {mockAchievements.filter(a => a.isCompleted).length === 0 && (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    Complete achievements to see them here
                  </div>
                )}
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">Next Achievements</h3>
              
              <div className="space-y-3">
                {mockAchievements
                  .filter(a => !a.isCompleted)
                  .sort((a, b) => (b.progress / b.maxProgress) - (a.progress / a.maxProgress))
                  .slice(0, 3)
                  .map(achievement => (
                    <div key={achievement.id} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <CircleDashed className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{achievement.title}</div>
                        <div className="text-xs text-muted-foreground mb-1">{achievement.progress} / {achievement.maxProgress} completed</div>
                        <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-1.5" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}