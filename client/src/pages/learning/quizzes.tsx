import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, BookOpen, Clock, Award } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import type { Quiz } from "@shared/schema";

export default function QuizzesPage() {
  const { currentUser } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("all");

  const { data: quizzes, isLoading } = useQuery<Quiz[]>({
    queryKey: ["/api/quizzes"],
    enabled: !!currentUser
  });

  const filteredQuizzes = quizzes?.filter(quiz => {
    if (selectedSubject !== "all" && quiz.subject !== selectedSubject) {
      return false;
    }
    
    if (activeTab === "all") {
      return true;
    }
    
    if (activeTab === "attempted") {
      // In a real app, we would check if the current user has attempted this quiz
      return false;
    }
    
    return true;
  }) || [];

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">CBSE Quizzes</h1>
            <p className="text-muted-foreground mt-1">Test your knowledge with subject-wise MCQs</p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="social-science">Social Science</SelectItem>
                <SelectItem value="english">English</SelectItem>
              </SelectContent>
            </Select>
            <Link href="/learning">
              <Button variant="outline">Back to Learning</Button>
            </Link>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Quizzes</TabsTrigger>
            <TabsTrigger value="attempted">Attempted</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {isLoading ? (
              <div className="text-center py-10">Loading quizzes...</div>
            ) : filteredQuizzes.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* For demo purposes, we'll show mock quizzes */}
                <QuizCard
                  id={1}
                  title="Algebra Basics"
                  subject="Mathematics"
                  difficulty="easy"
                  questionsCount={10}
                  timeEstimate="10 mins"
                  description="Test your knowledge of algebraic expressions, equations, and formulas."
                />
                <QuizCard
                  id={2}
                  title="Force and Motion"
                  subject="Science"
                  difficulty="medium"
                  questionsCount={15}
                  timeEstimate="15 mins"
                  description="Questions on Newton's laws, momentum, and principles of physics."
                />
                <QuizCard
                  id={3}
                  title="Indian Freedom Movement"
                  subject="Social Science"
                  difficulty="hard"
                  questionsCount={20}
                  timeEstimate="20 mins"
                  description="Test your knowledge about key events and figures in India's struggle for independence."
                />
                <QuizCard
                  id={4}
                  title="Geometry and Mensuration"
                  subject="Mathematics"
                  difficulty="medium"
                  questionsCount={12}
                  timeEstimate="15 mins"
                  description="Questions on triangles, circles, areas, and volumes."
                />
                <QuizCard
                  id={5}
                  title="Atoms and Molecules"
                  subject="Science"
                  difficulty="medium"
                  questionsCount={15}
                  timeEstimate="15 mins"
                  description="Test your understanding of atomic structure and chemical bonding."
                />
                <QuizCard
                  id={6}
                  title="Grammar Essentials"
                  subject="English"
                  difficulty="easy"
                  questionsCount={15}
                  timeEstimate="12 mins"
                  description="Questions on parts of speech, tenses, and sentence structure."
                />
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No quizzes found for the selected filters.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

interface QuizCardProps {
  id: number;
  title: string;
  subject: string;
  difficulty: string;
  questionsCount: number;
  timeEstimate: string;
  description: string;
}

function QuizCard({ id, title, subject, difficulty, questionsCount, timeEstimate, description }: QuizCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge className={getDifficultyColor(difficulty)}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </Badge>
        </div>
        <CardDescription>{subject}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 mb-4">{description}</p>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{questionsCount} questions</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{timeEstimate}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/learning/quizzes/${id}`}>
          <Button className="w-full">Start Quiz</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}