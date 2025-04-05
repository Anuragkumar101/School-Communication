import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  ClipboardCheck, 
  LightbulbIcon, 
  TrendingUp, 
  Video, 
  Brain,
  ListChecks,
  ArrowRight,
  Clock,
  BarChart2
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

type MediaType = "quiz" | "flashcard" | "video";
type DifficultyLevel = "beginner" | "intermediate" | "advanced";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  subject: string;
  topic: string;
  type: MediaType;
  difficulty: DifficultyLevel;
  estimatedTimeMinutes: number;
  reason: string;
}

export default function RecommendationsPage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ["/api/recommendations", currentUser?.uid],
    enabled: !!currentUser
  });
  
  // Mock recommendations data
  const mockRecommendations: Recommendation[] = [
    {
      id: "r1",
      title: "Linear Equations Quiz",
      description: "Practice solving one and two-variable linear equations",
      subject: "Mathematics",
      topic: "Algebra",
      type: "quiz",
      difficulty: "intermediate",
      estimatedTimeMinutes: 15,
      reason: "You've been struggling with linear equations in recent quizzes"
    },
    {
      id: "r2",
      title: "Chemical Reactions Flashcards",
      description: "Review key chemical reactions and their properties",
      subject: "Science",
      topic: "Chemistry",
      type: "flashcard",
      difficulty: "intermediate",
      estimatedTimeMinutes: 10,
      reason: "You haven't practiced Chemistry in over a week"
    },
    {
      id: "r3",
      title: "Indian Constitution Video Lesson",
      description: "Learn about the key features of the Indian Constitution",
      subject: "Social Studies",
      topic: "Civics",
      type: "video",
      difficulty: "beginner",
      estimatedTimeMinutes: 12,
      reason: "Based on your interests in democratic politics"
    },
    {
      id: "r4",
      title: "Geometry Formulas Flashcards",
      description: "Practice area and volume formulas for various shapes",
      subject: "Mathematics",
      topic: "Geometry",
      type: "flashcard",
      difficulty: "beginner",
      estimatedTimeMinutes: 8,
      reason: "To help you prepare for your upcoming geometry unit"
    },
    {
      id: "r5",
      title: "Force and Laws of Motion Quiz",
      description: "Test your understanding of Newton's laws and their applications",
      subject: "Science",
      topic: "Physics",
      type: "quiz",
      difficulty: "advanced",
      estimatedTimeMinutes: 20,
      reason: "You're showing strong progress in Physics - try this challenge!"
    },
    {
      id: "r6",
      title: "Grammar Essentials Video",
      description: "Comprehensive overview of parts of speech and their usage",
      subject: "English",
      topic: "Grammar",
      type: "video",
      difficulty: "intermediate",
      estimatedTimeMinutes: 15,
      reason: "This complements your recent work on sentence structures"
    },
    {
      id: "r7",
      title: "Statistics and Probability Quiz",
      description: "Practice with mean, median, mode, and basic probability",
      subject: "Mathematics",
      topic: "Statistics",
      type: "quiz",
      difficulty: "intermediate",
      estimatedTimeMinutes: 18,
      reason: "You haven't practiced statistics recently"
    },
    {
      id: "r8",
      title: "Cell Structure and Functions Video",
      description: "Detailed explanation of cell organelles and their functions",
      subject: "Science",
      topic: "Biology",
      type: "video",
      difficulty: "intermediate",
      estimatedTimeMinutes: 12,
      reason: "This aligns with your current Biology curriculum"
    }
  ];
  
  const filteredRecommendations = mockRecommendations.filter(rec => {
    if (activeTab === "all") return true;
    return rec.type === activeTab;
  });
  
  const getTypeIcon = (type: MediaType) => {
    switch (type) {
      case "quiz":
        return <ClipboardCheck className="h-5 w-5 text-blue-600" />;
      case "flashcard":
        return <Brain className="h-5 w-5 text-purple-600" />;
      case "video":
        return <Video className="h-5 w-5 text-red-600" />;
    }
  };
  
  const getTypeColor = (type: MediaType) => {
    switch (type) {
      case "quiz":
        return "bg-blue-100 text-blue-800";
      case "flashcard":
        return "bg-purple-100 text-purple-800";
      case "video":
        return "bg-red-100 text-red-800";
    }
  };
  
  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-amber-100 text-amber-800";
      case "advanced":
        return "bg-red-100 text-red-800";
    }
  };
  
  // Calculate subject percentages for recommendations
  const getSubjectPercentages = () => {
    const subjects: Record<string, number> = {};
    
    mockRecommendations.forEach(rec => {
      if (subjects[rec.subject]) {
        subjects[rec.subject]++;
      } else {
        subjects[rec.subject] = 1;
      }
    });
    
    return Object.entries(subjects).map(([subject, count]) => ({
      subject,
      percentage: Math.round((count / mockRecommendations.length) * 100)
    }));
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Recommendations</h1>
            <p className="text-muted-foreground mt-1">Personalized learning content based on your performance</p>
          </div>
          <div className="flex gap-2">
            <Link href="/learning">
              <Button variant="outline">Back to Learning</Button>
            </Link>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>All</span>
                </TabsTrigger>
                <TabsTrigger value="quiz" className="flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4" />
                  <span>Quizzes</span>
                </TabsTrigger>
                <TabsTrigger value="flashcard" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span>Flashcards</span>
                </TabsTrigger>
                <TabsTrigger value="video" className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  <span>Videos</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="grid gap-4 md:grid-cols-2">
              {isLoading ? (
                <div className="md:col-span-2 text-center py-10">Loading recommendations...</div>
              ) : filteredRecommendations.length > 0 ? (
                filteredRecommendations.map(recommendation => (
                  <Card key={recommendation.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center border">
                          {getTypeIcon(recommendation.type)}
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getTypeColor(recommendation.type)}>
                            {recommendation.type.charAt(0).toUpperCase() + recommendation.type.slice(1)}
                          </Badge>
                          <Badge className={getDifficultyColor(recommendation.difficulty)}>
                            {recommendation.difficulty.charAt(0).toUpperCase() + recommendation.difficulty.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="text-lg mt-2">{recommendation.title}</CardTitle>
                      <CardDescription>{recommendation.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="h-4 w-4" />
                          <span>{recommendation.subject}</span>
                          <span className="px-1">•</span>
                          <span>{recommendation.topic}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Clock className="h-4 w-4" />
                          <span>Approx. {recommendation.estimatedTimeMinutes} minutes</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-sm bg-muted/50 p-2 rounded-md">
                        <div className="flex gap-2 items-start">
                          <LightbulbIcon className="h-4 w-4 text-amber-500 mt-0.5" />
                          <span>{recommendation.reason}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        Start Learning
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="md:col-span-2 text-center py-10">
                  <p className="text-muted-foreground">No recommendations found for this category.</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Learning Profile</CardTitle>
                <CardDescription>Based on your learning history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Strengths</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 rounded-md bg-green-100">
                      <TrendingUp className="h-4 w-4 text-green-700" />
                      <span className="text-sm text-green-700">Mathematics - Algebra</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-md bg-green-100">
                      <TrendingUp className="h-4 w-4 text-green-700" />
                      <span className="text-sm text-green-700">Science - Physics</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Areas for Improvement</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 rounded-md bg-amber-100">
                      <BookOpen className="h-4 w-4 text-amber-700" />
                      <span className="text-sm text-amber-700">Mathematics - Geometry</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-md bg-amber-100">
                      <BookOpen className="h-4 w-4 text-amber-700" />
                      <span className="text-sm text-amber-700">Science - Chemistry</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Learning Preferences</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Videos</span>
                      </div>
                      <div className="text-sm font-medium">High</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Quizzes</span>
                      </div>
                      <div className="text-sm font-medium">Medium</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Flashcards</span>
                      </div>
                      <div className="text-sm font-medium">Low</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Subject Distribution</CardTitle>
                <CardDescription>Your recommended content by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getSubjectPercentages().map(({ subject, percentage }) => (
                    <div key={subject}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm font-medium">{subject}</div>
                        <div className="text-sm text-muted-foreground">{percentage}%</div>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            subject === "Mathematics" 
                              ? "bg-blue-500" 
                              : subject === "Science" 
                                ? "bg-green-500" 
                                : subject === "Social Studies"
                                  ? "bg-amber-500"
                                  : "bg-purple-500"
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Learning Streaks</CardTitle>
                <CardDescription>Keep your momentum going</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold mb-1">3</div>
                  <div className="text-sm text-muted-foreground">day streak</div>
                </div>
                
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {Array.from({ length: 7 }).map((_, index) => (
                    <div 
                      key={index} 
                      className={`h-8 rounded-md flex items-center justify-center text-xs ${
                        index < 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {["M", "T", "W", "T", "F", "S", "S"][index]}
                    </div>
                  ))}
                </div>
                
                <div className="text-sm text-center">
                  Complete an activity today to continue your streak!
                </div>
                
                <Button className="w-full mt-4" variant="outline">
                  View Activity History
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}