import { useState } from "react";
import { Link } from "wouter";
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import {
  BookOpen,
  Calendar,
  Lightbulb,
  Trophy,
  Video,
  Sparkles,
  PlusCircle,
  Rocket
} from "lucide-react";

export default function LearningPage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Fun Learning</h1>
          <Badge variant="outline" className="px-3 py-1 text-sm bg-gradient-to-r from-primary/60 to-primary font-medium text-white">
            CBSE Class 9
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-5 gap-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
            <TabsTrigger value="facts">Daily Facts</TabsTrigger>
            <TabsTrigger value="videos">Learning Videos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Interactive Quizzes
                  </CardTitle>
                  <CardDescription>
                    Test your knowledge with subject-wise MCQs based on CBSE syllabus
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/learning/quizzes">
                    <Button className="w-full">Explore Quizzes</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Flashcards
                  </CardTitle>
                  <CardDescription>
                    Review key concepts, formulas, and definitions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/learning/flashcards">
                    <Button className="w-full">View Flashcards</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Daily Fact
                  </CardTitle>
                  <CardDescription>
                    Learn something new every day with fascinating facts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/learning/facts">
                    <Button className="w-full">Today's Fact</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-primary" />
                    Learning Videos
                  </CardTitle>
                  <CardDescription>
                    Watch educational videos to enhance your understanding
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/learning/videos">
                    <Button className="w-full">Browse Videos</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Leaderboard
                  </CardTitle>
                  <CardDescription>
                    See how you rank among your friends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/learning/leaderboard">
                    <Button className="w-full">View Leaderboard</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-primary" />
                    Challenges
                  </CardTitle>
                  <CardDescription>
                    Challenge your friends to quizzes and compare results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/learning/challenges">
                    <Button className="w-full">View Challenges</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <Card className="p-4 border-dashed border-2 bg-muted/50">
              <div className="flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="text-lg font-medium">Your Learning Stats</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete quizzes and challenges to earn points and track your progress
                  </p>
                </div>
                <div className="ml-auto">
                  <Link href="/learning/stats">
                    <Button variant="outline">View Stats</Button>
                  </Link>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Subject-wise Quizzes</CardTitle>
                <CardDescription>Test your knowledge with these interactive quizzes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <SubjectCard 
                    title="Mathematics" 
                    description="Algebra, Geometry, Mensuration, and more" 
                    href="/learning/quizzes/mathematics"
                  />
                  <SubjectCard 
                    title="Science" 
                    description="Physics, Chemistry, and Biology concepts" 
                    href="/learning/quizzes/science"
                  />
                  <SubjectCard 
                    title="Social Science" 
                    description="History, Geography, and Civics" 
                    href="/learning/quizzes/social-science"
                  />
                  <SubjectCard 
                    title="English" 
                    description="Grammar, Literature, and Comprehension" 
                    href="/learning/quizzes/english"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flashcards" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Flashcards</CardTitle>
                <CardDescription>Review key concepts, formulas, and definitions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <SubjectCard 
                    title="Mathematics" 
                    description="Formulas and key concepts" 
                    href="/learning/flashcards/mathematics"
                  />
                  <SubjectCard 
                    title="Science" 
                    description="Important definitions and diagrams" 
                    href="/learning/flashcards/science"
                  />
                  <SubjectCard 
                    title="Social Science" 
                    description="Dates, events, and key terms" 
                    href="/learning/flashcards/social-science"
                  />
                  <SubjectCard 
                    title="English" 
                    description="Vocabulary and grammar rules" 
                    href="/learning/flashcards/english"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="facts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Today's Fact
                </CardTitle>
                <CardDescription>Learn something new every day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 border rounded-lg bg-gradient-to-r from-primary/10 to-primary/5">
                  <h3 className="text-xl font-medium mb-2">Did you know?</h3>
                  <p className="text-base">
                    Mathematics is not just about numbers - it's a language that describes patterns, relationships, and structures in our world!
                  </p>
                  <div className="mt-4 text-sm text-muted-foreground">
                    April 5, 2025
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full">View Previous Facts</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="videos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Learning Videos</CardTitle>
                <CardDescription>Watch educational videos to enhance your understanding</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <SubjectCard 
                    title="Mathematics" 
                    description="Video tutorials for complex topics" 
                    href="/learning/videos/mathematics"
                  />
                  <SubjectCard 
                    title="Science" 
                    description="Experiments and visual explanations" 
                    href="/learning/videos/science"
                  />
                  <SubjectCard 
                    title="Social Science" 
                    description="Historical and geographical visual content" 
                    href="/learning/videos/social-science"
                  />
                  <SubjectCard 
                    title="English" 
                    description="Literature analysis and grammar lessons" 
                    href="/learning/videos/english"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

function SubjectCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={href}>
          <Button variant="outline" className="w-full">Explore</Button>
        </Link>
      </CardContent>
    </Card>
  );
}