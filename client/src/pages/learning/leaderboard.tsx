import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronUp, Trophy, Medal, Award, Star, Flag, Share2 } from "lucide-react";
import UserAvatar from "@/components/profile/user-avatar";
import { useAuth } from "@/hooks/use-auth";
import type { User } from "@shared/schema";

interface LeaderboardEntry {
  user: User;
  score: number;
  attempts: number;
}

export default function LeaderboardPage() {
  const { currentUser } = useAuth();
  const [timeFrame, setTimeFrame] = useState<string>("weekly");

  const { data: leaderboard, isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard", timeFrame],
    enabled: !!currentUser
  });

  // For demonstration purposes, we'll show mock data
  const mockLeaderboard: LeaderboardEntry[] = [
    {
      user: {
        id: 1,
        username: "aditya2023",
        email: "aditya@example.com",
        createdAt: new Date(),
        displayName: "Aditya Sharma",
        photoURL: null,
        status: "online",
        uid: "uid1"
      },
      score: 850,
      attempts: 15
    },
    {
      user: {
        id: 2,
        username: "priya_m",
        email: "priya@example.com",
        createdAt: new Date(),
        displayName: "Priya Mehta",
        photoURL: null,
        status: "offline",
        uid: "uid2"
      },
      score: 720,
      attempts: 12
    },
    {
      user: {
        id: 3,
        username: "rahul_j",
        email: "rahul@example.com",
        createdAt: new Date(),
        displayName: "Rahul Joshi",
        photoURL: null,
        status: "online",
        uid: "uid3"
      },
      score: 680,
      attempts: 10
    },
    {
      user: {
        id: 4,
        username: "neha2000",
        email: "neha@example.com",
        createdAt: new Date(),
        displayName: "Neha Gupta",
        photoURL: null,
        status: "offline",
        uid: "uid4"
      },
      score: 650,
      attempts: 14
    },
    {
      user: {
        id: 5,
        username: "vikas_s",
        email: "vikas@example.com",
        createdAt: new Date(),
        displayName: "Vikas Singh",
        photoURL: null,
        status: "online",
        uid: "uid5"
      },
      score: 620,
      attempts: 11
    },
    {
      user: {
        id: 6,
        username: "ananya_r",
        email: "ananya@example.com",
        createdAt: new Date(),
        displayName: "Ananya Reddy",
        photoURL: null,
        status: "offline",
        uid: "uid6"
      },
      score: 590,
      attempts: 9
    },
    {
      user: {
        id: 7,
        username: "arjun2023",
        email: "arjun@example.com",
        createdAt: new Date(),
        displayName: "Arjun Kumar",
        photoURL: null,
        status: "online",
        uid: "uid7"
      },
      score: 550,
      attempts: 8
    },
    {
      user: {
        id: 8,
        username: "divya_p",
        email: "divya@example.com",
        createdAt: new Date(),
        displayName: "Divya Patel",
        photoURL: null,
        status: "offline",
        uid: "uid8"
      },
      score: 530,
      attempts: 7
    },
    {
      user: {
        id: 9,
        username: "rohit_m",
        email: "rohit@example.com",
        createdAt: new Date(),
        displayName: "Rohit Mishra",
        photoURL: null,
        status: "online",
        uid: "uid9"
      },
      score: 510,
      attempts: 6
    },
    {
      user: {
        id: 10,
        username: "sanya_g",
        email: "sanya@example.com",
        createdAt: new Date(),
        displayName: "Sanya Gupta",
        photoURL: null,
        status: "offline",
        uid: "uid10"
      },
      score: 490,
      attempts: 5
    }
  ];

  // Find the current user's position in the leaderboard
  const getCurrentUserRank = () => {
    if (!currentUser) return null;
    
    const rank = mockLeaderboard.findIndex(
      entry => entry.user.uid === currentUser.uid
    );
    
    if (rank === -1) return null;
    
    return {
      rank: rank + 1,
      score: mockLeaderboard[rank].score,
      attempts: mockLeaderboard[rank].attempts
    };
  };

  const userRank = getCurrentUserRank();

  // Get the appropriate icon for the top 3 ranks
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <Star className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
            <p className="text-muted-foreground mt-1">See how you rank among your peers</p>
          </div>
          <div className="flex gap-2">
            <Tabs value={timeFrame} onValueChange={setTimeFrame} className="w-[400px]">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="alltime">All Time</TabsTrigger>
              </TabsList>
            </Tabs>
            <Link href="/learning">
              <Button variant="outline">Back to Learning</Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>
                  {timeFrame === "weekly" ? "This week's" : timeFrame === "monthly" ? "This month's" : "All-time"} quiz champions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-10">Loading leaderboard...</div>
                ) : (
                  <div className="space-y-4">
                    {/* Top 3 */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
                      {mockLeaderboard.slice(0, 3).map((entry, index) => (
                        <Card key={entry.user.id} className="flex-1 bg-gradient-to-br from-primary/10 to-transparent">
                          <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center">
                              <div className="relative">
                                <UserAvatar 
                                  user={entry.user} 
                                  className="h-16 w-16 border-4 border-white shadow-md" 
                                />
                                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                                  {index + 1}
                                </div>
                              </div>
                              <h3 className="mt-2 font-semibold text-base">{entry.user.displayName}</h3>
                              <div className="mt-1 text-sm text-muted-foreground">@{entry.user.username}</div>
                              <div className="mt-3 font-bold text-2xl">{entry.score}</div>
                              <div className="text-xs text-muted-foreground">points</div>
                              <div className="mt-2 text-sm">
                                {entry.attempts} quiz{entry.attempts !== 1 ? "zes" : ""} completed
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Rest of the leaderboard */}
                    <div className="border rounded-lg divide-y">
                      {mockLeaderboard.slice(3).map((entry, index) => (
                        <div 
                          key={entry.user.id} 
                          className={`flex items-center justify-between p-3 hover:bg-muted/50 ${
                            currentUser && entry.user.uid === currentUser.uid 
                              ? "bg-primary/10"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 text-center font-medium text-muted-foreground">
                              {index + 4}
                            </div>
                            <UserAvatar user={entry.user} className="h-8 w-8" />
                            <div>
                              <div className="font-medium">{entry.user.displayName}</div>
                              <div className="text-xs text-muted-foreground">@{entry.user.username}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="font-semibold">{entry.score}</div>
                              <div className="text-xs text-muted-foreground">
                                {entry.attempts} quiz{entry.attempts !== 1 ? "zes" : ""}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {userRank ? (
              <Card className="border-2 border-primary/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Your Ranking</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-lg font-bold">#{userRank.rank}</div>
                        <div className="text-sm text-muted-foreground">
                          {userRank.rank === 1 
                            ? "You're at the top!" 
                            : userRank.rank <= 3 
                              ? "Almost there!" 
                              : userRank.rank <= 10 
                                ? "Great job!" 
                                : "Keep going!"}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{userRank.score}</div>
                      <div className="text-sm text-muted-foreground">points</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Your Ranking</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">Complete quizzes to appear on the leaderboard!</p>
                    <Link href="/learning/quizzes">
                      <Button>Take a Quiz</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Your Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <Star className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-medium">Perfect Score</div>
                      <div className="text-sm text-muted-foreground">Complete a quiz with 100% accuracy</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Flag className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">Quiz Streak</div>
                      <div className="text-sm text-muted-foreground">Complete a quiz every day for 5 days</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Award className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium">Subject Master</div>
                      <div className="text-sm text-muted-foreground">Score over 90% in all quizzes of a subject</div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">View All Achievements</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Challenge a Friend</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Challenge your friends to beat your score in quizzes and climb the leaderboard together!
                </p>
                <Link href="/learning/challenges">
                  <Button className="w-full">Start a Challenge</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}