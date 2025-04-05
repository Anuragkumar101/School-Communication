import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Circle, 
  LockIcon, 
  ChevronRight, 
  Book, 
  Calculator, 
  Beaker, 
  Globe, 
  PenTool,
  AlertCircle,
  ArrowRightIcon
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

type SubjectType = "math" | "science" | "social" | "english" | "languages";
type TopicStatus = "completed" | "in-progress" | "locked" | "available";

interface Topic {
  id: string;
  title: string;
  description: string;
  status: TopicStatus;
  subject: SubjectType;
  progress: number;
  quizCount: number;
  videoCount: number;
  flashcardCount: number;
  unlockRequirements?: string[];
}

export default function JourneyMapPage() {
  const { currentUser } = useAuth();
  const [activeSubject, setActiveSubject] = useState<SubjectType>("math");
  
  const { data: journeyData, isLoading } = useQuery({
    queryKey: ["/api/journey-map", currentUser?.uid],
    enabled: !!currentUser
  });
  
  // Mock journey data for display purposes
  const mockJourneyData: Record<SubjectType, Topic[]> = {
    math: [
      {
        id: "m1",
        title: "Number Systems",
        description: "Learn about natural numbers, integers, rational and irrational numbers",
        status: "completed",
        subject: "math",
        progress: 100,
        quizCount: 2,
        videoCount: 3,
        flashcardCount: 15,
      },
      {
        id: "m2",
        title: "Algebra Basics",
        description: "Expressions, equations, and algebraic formulations",
        status: "completed",
        subject: "math",
        progress: 100,
        quizCount: 3,
        videoCount: 4,
        flashcardCount: 20,
      },
      {
        id: "m3",
        title: "Linear Equations",
        description: "Solving and graphing linear equations and inequalities",
        status: "in-progress",
        subject: "math",
        progress: 65,
        quizCount: 2,
        videoCount: 3,
        flashcardCount: 12,
      },
      {
        id: "m4",
        title: "Geometry and Mensuration",
        description: "Lines, angles, triangles, and calculating area and volume",
        status: "available",
        subject: "math",
        progress: 0,
        quizCount: 4,
        videoCount: 5,
        flashcardCount: 25,
      },
      {
        id: "m5",
        title: "Coordinate Geometry",
        description: "Working with cartesian coordinates and plotting",
        status: "locked",
        subject: "math",
        progress: 0,
        quizCount: 2,
        videoCount: 4,
        flashcardCount: 18,
        unlockRequirements: ["Complete 'Linear Equations' and 'Geometry and Mensuration'"]
      }
    ],
    science: [
      {
        id: "s1",
        title: "Matter in Our Surroundings",
        description: "States of matter and their properties",
        status: "completed",
        subject: "science",
        progress: 100,
        quizCount: 2,
        videoCount: 4,
        flashcardCount: 15,
      },
      {
        id: "s2",
        title: "Is Matter Around Us Pure?",
        description: "Mixtures, solutions, and separation techniques",
        status: "in-progress",
        subject: "science",
        progress: 40,
        quizCount: 3,
        videoCount: 3,
        flashcardCount: 18,
      },
      {
        id: "s3",
        title: "Atoms and Molecules",
        description: "Atomic structure and molecular compositions",
        status: "available",
        subject: "science",
        progress: 0,
        quizCount: 3,
        videoCount: 5,
        flashcardCount: 20,
      },
      {
        id: "s4",
        title: "Structure of the Atom",
        description: "Subatomic particles and electronic configuration",
        status: "locked",
        subject: "science",
        progress: 0,
        quizCount: 2,
        videoCount: 4,
        flashcardCount: 16,
        unlockRequirements: ["Complete 'Atoms and Molecules'"]
      }
    ],
    social: [
      {
        id: "ss1",
        title: "French Revolution",
        description: "Causes, events, and impact of the French Revolution",
        status: "completed",
        subject: "social",
        progress: 100,
        quizCount: 2,
        videoCount: 4,
        flashcardCount: 18
      },
      {
        id: "ss2",
        title: "Indian Freedom Movement",
        description: "India's struggle for independence",
        status: "in-progress",
        subject: "social",
        progress: 75,
        quizCount: 3,
        videoCount: 5,
        flashcardCount: 25
      },
      {
        id: "ss3",
        title: "Democratic Politics",
        description: "Understanding democracy and political systems",
        status: "available",
        subject: "social",
        progress: 0,
        quizCount: 2,
        videoCount: 3,
        flashcardCount: 15
      }
    ],
    english: [
      {
        id: "e1",
        title: "Grammar Essentials",
        description: "Parts of speech, tenses, and sentence structures",
        status: "in-progress",
        subject: "english",
        progress: 60,
        quizCount: 4,
        videoCount: 3,
        flashcardCount: 30
      },
      {
        id: "e2",
        title: "Reading Comprehension",
        description: "Understanding and analyzing written texts",
        status: "available",
        subject: "english",
        progress: 0,
        quizCount: 3,
        videoCount: 2,
        flashcardCount: 15
      }
    ],
    languages: [
      {
        id: "l1",
        title: "Hindi Grammar",
        description: "Basic Hindi grammar and vocabulary",
        status: "available",
        subject: "languages",
        progress: 0,
        quizCount: 2,
        videoCount: 3,
        flashcardCount: 20
      }
    ]
  };
  
  const getSubjectIcon = (subject: SubjectType) => {
    switch (subject) {
      case "math":
        return <Calculator className="h-5 w-5" />;
      case "science":
        return <Beaker className="h-5 w-5" />;
      case "social":
        return <Globe className="h-5 w-5" />;
      case "english":
        return <Book className="h-5 w-5" />;
      case "languages":
        return <PenTool className="h-5 w-5" />;
    }
  };
  
  const getStatusIcon = (status: TopicStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Circle className="h-5 w-5 text-blue-500 fill-blue-100" />;
      case "available":
        return <Circle className="h-5 w-5 text-muted-foreground" />;
      case "locked":
        return <LockIcon className="h-5 w-5 text-muted-foreground" />;
    }
  };
  
  const getStatusBadge = (status: TopicStatus) => {
    switch (status) {
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>;
      case "available":
        return <Badge variant="outline" className="bg-gray-100 hover:bg-gray-100">Available</Badge>;
      case "locked":
        return <Badge variant="outline" className="bg-gray-100 text-gray-500 hover:bg-gray-100">Locked</Badge>;
    }
  };
  
  const getSubjectCompletion = (subject: SubjectType) => {
    const topics = mockJourneyData[subject];
    const completed = topics.filter(t => t.status === "completed").length;
    return {
      completed,
      total: topics.length,
      percentage: Math.round((completed / topics.length) * 100)
    };
  };
  
  const getOverallCompletion = () => {
    let completed = 0;
    let total = 0;
    
    Object.values(mockJourneyData).forEach(topics => {
      completed += topics.filter(t => t.status === "completed").length;
      total += topics.length;
    });
    
    return {
      completed,
      total,
      percentage: Math.round((completed / total) * 100)
    };
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Learning Journey</h1>
            <p className="text-muted-foreground mt-1">Track your progress through subjects and topics</p>
          </div>
          <div className="flex gap-2">
            <Link href="/learning">
              <Button variant="outline">Back to Learning</Button>
            </Link>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Tabs value={activeSubject} onValueChange={(value) => setActiveSubject(value as SubjectType)}>
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="math" className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  <span className="hidden sm:inline">Mathematics</span>
                  <span className="sm:hidden">Math</span>
                </TabsTrigger>
                <TabsTrigger value="science" className="flex items-center gap-2">
                  <Beaker className="h-4 w-4" />
                  <span className="hidden sm:inline">Science</span>
                  <span className="sm:hidden">Sci</span>
                </TabsTrigger>
                <TabsTrigger value="social" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">Social Studies</span>
                  <span className="sm:hidden">Social</span>
                </TabsTrigger>
                <TabsTrigger value="english" className="flex items-center gap-2">
                  <Book className="h-4 w-4" />
                  <span>English</span>
                </TabsTrigger>
                <TabsTrigger value="languages" className="flex items-center gap-2">
                  <PenTool className="h-4 w-4" />
                  <span className="hidden sm:inline">Languages</span>
                  <span className="sm:hidden">Lang</span>
                </TabsTrigger>
              </TabsList>
              
              {Object.entries(mockJourneyData).map(([subject, topics]) => (
                <TabsContent key={subject} value={subject} className="mt-6">
                  <div className="space-y-6">
                    {topics.map((topic, index) => (
                      <div key={topic.id} className="relative">
                        {index < topics.length - 1 && (
                          <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-muted z-0"></div>
                        )}
                        
                        <Card className={`relative z-10 ${topic.status === 'locked' ? 'opacity-70' : ''}`}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center border">
                                  {getStatusIcon(topic.status)}
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{topic.title}</CardTitle>
                                  <CardDescription>{topic.description}</CardDescription>
                                </div>
                              </div>
                              <div>
                                {getStatusBadge(topic.status)}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Book className="h-4 w-4 text-muted-foreground" />
                                <span>{topic.quizCount} Quizzes</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <PenTool className="h-4 w-4 text-muted-foreground" />
                                <span>{topic.flashcardCount} Flashcards</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <span>{topic.videoCount} Videos</span>
                              </div>
                            </div>
                            
                            {topic.status === "locked" && topic.unlockRequirements && (
                              <div className="mt-3 flex items-start gap-2 text-sm text-muted-foreground bg-muted p-2 rounded">
                                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <div>
                                  <strong>Requirements to unlock:</strong>
                                  <ul className="mt-1 list-disc pl-4">
                                    {topic.unlockRequirements.map((req, i) => (
                                      <li key={i}>{req}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="pt-0">
                            <Button 
                              variant={topic.status === "locked" ? "outline" : "default"} 
                              className="w-full"
                              disabled={topic.status === "locked"}
                            >
                              {topic.status === "completed" ? (
                                "Review Topic"
                              ) : topic.status === "in-progress" ? (
                                "Continue Learning"
                              ) : topic.status === "available" ? (
                                "Start Learning"
                              ) : (
                                "Locked"
                              )}
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                          </CardFooter>
                        </Card>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Overall Progress</CardTitle>
                <CardDescription>Your learning journey across all subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">{getOverallCompletion().percentage}%</div>
                  <p className="text-sm text-muted-foreground">Topics completed</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{getOverallCompletion().completed} of {getOverallCompletion().total} topics</span>
                  </div>
                </div>
                
                <div className="mt-6 space-y-4">
                  {(["math", "science", "social", "english", "languages"] as SubjectType[]).map((subject) => {
                    const completion = getSubjectCompletion(subject);
                    return (
                      <div key={subject} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          {getSubjectIcon(subject)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">
                              {subject.charAt(0).toUpperCase() + subject.slice(1)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {completion.completed}/{completion.total}
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full" 
                              style={{ width: `${completion.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recommended Next</CardTitle>
                <CardDescription>Topics to continue your journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.values(mockJourneyData)
                  .flat()
                  .filter(topic => topic.status === "in-progress")
                  .slice(0, 2)
                  .map(topic => (
                    <div key={topic.id} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="w-10 h-10 rounded-full flex-shrink-0 bg-blue-100 flex items-center justify-center">
                        {getSubjectIcon(topic.subject)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{topic.title}</div>
                        <div className="text-xs text-muted-foreground mb-2">
                          {topic.progress}% completed
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${topic.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="flex-shrink-0">
                        <ArrowRightIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                
                {Object.values(mockJourneyData)
                  .flat()
                  .filter(topic => topic.status === "available")
                  .slice(0, 1)
                  .map(topic => (
                    <div key={topic.id} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="w-10 h-10 rounded-full flex-shrink-0 bg-muted flex items-center justify-center">
                        {getSubjectIcon(topic.subject)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{topic.title}</div>
                        <div className="text-xs text-muted-foreground">
                          Ready to start
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="flex-shrink-0">
                        <ArrowRightIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}