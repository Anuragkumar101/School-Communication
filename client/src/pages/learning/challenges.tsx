import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format } from "date-fns";
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Clock, Flag, Sword, Shield, X, ExternalLink, UserPlus, Trophy } from "lucide-react";
import UserAvatar from "@/components/profile/user-avatar";
import { useAuth } from "@/hooks/use-auth";
import type { Challenge } from "@shared/schema";

export default function ChallengesPage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("active");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<string>("algebra");
  const [friendUsername, setFriendUsername] = useState<string>("");

  const { data: challenges, isLoading } = useQuery<Challenge[]>({
    queryKey: ["/api/challenges", currentUser?.uid, activeTab],
    enabled: !!currentUser
  });

  // For demonstration purposes, we'll use mock data
  const mockChallenges = [
    {
      id: 1,
      quizId: 1,
      quizTitle: "Algebra Basics",
      challengerId: 1,
      challengerName: "Aditya Sharma",
      challengedId: 2,
      challengedName: "Priya Mehta",
      status: "active",
      creatorScore: 85,
      receiverScore: null,
      createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
      expiresAt: new Date(new Date().setDate(new Date().getDate() + 2)),
    },
    {
      id: 2,
      quizId: 3,
      quizTitle: "Indian Freedom Movement",
      challengerId: 3,
      challengerName: "Rahul Joshi",
      challengedId: 1,
      challengedName: "Aditya Sharma",
      status: "active",
      creatorScore: 90,
      receiverScore: null,
      createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
      expiresAt: new Date(new Date().setDate(new Date().getDate() + 1)),
    },
    {
      id: 3,
      quizId: 2,
      quizTitle: "Force and Motion",
      challengerId: 1,
      challengerName: "Aditya Sharma",
      challengedId: 5,
      challengedName: "Vikas Singh",
      status: "completed",
      creatorScore: 75,
      receiverScore: 85,
      createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
      expiresAt: new Date(new Date().setDate(new Date().getDate() - 2)),
    },
    {
      id: 4,
      quizId: 4,
      quizTitle: "Geometry and Mensuration",
      challengerId: 4,
      challengerName: "Neha Gupta",
      challengedId: 1,
      challengedName: "Aditya Sharma",
      status: "completed",
      creatorScore: 80,
      receiverScore: 90,
      createdAt: new Date(new Date().setDate(new Date().getDate() - 6)),
      expiresAt: new Date(new Date().setDate(new Date().getDate() - 3)),
    },
    {
      id: 5,
      quizId: 5,
      quizTitle: "Atoms and Molecules",
      challengerId: 1,
      challengerName: "Aditya Sharma",
      challengedId: 6,
      challengedName: "Ananya Reddy",
      status: "expired",
      creatorScore: 95,
      receiverScore: null,
      createdAt: new Date(new Date().setDate(new Date().getDate() - 8)),
      expiresAt: new Date(new Date().setDate(new Date().getDate() - 5)),
    }
  ];

  // Filter challenges based on active tab and current user
  const filteredChallenges = mockChallenges.filter(challenge => {
    // Filter by status
    if (activeTab !== "all" && challenge.status !== activeTab) {
      return false;
    }
    
    // Only show challenges related to the current user
    return (
      challenge.challengerId === 1 || // assuming current user has ID 1
      challenge.challengedId === 1
    );
  });

  const handleCreateChallenge = () => {
    console.log("Creating challenge with quiz:", selectedQuiz, "for friend:", friendUsername);
    setCreateDialogOpen(false);
    setFriendUsername("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-blue-600 bg-blue-100";
      case "completed":
        return "text-green-600 bg-green-100";
      case "expired":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "expired":
        return <X className="h-4 w-4" />;
      default:
        return <Flag className="h-4 w-4" />;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Friend Challenges</h1>
            <p className="text-muted-foreground mt-1">Challenge your friends to quizzes and compare results</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <UserPlus className="h-4 w-4" />
                  New Challenge
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Challenge a Friend</DialogTitle>
                  <DialogDescription>
                    Invite a friend to compete with you on a quiz. They'll have 72 hours to accept and complete the challenge.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="quiz">Select Quiz</Label>
                    <Select value={selectedQuiz} onValueChange={setSelectedQuiz}>
                      <SelectTrigger id="quiz">
                        <SelectValue placeholder="Select a quiz" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="algebra">Algebra Basics</SelectItem>
                        <SelectItem value="force">Force and Motion</SelectItem>
                        <SelectItem value="freedom">Indian Freedom Movement</SelectItem>
                        <SelectItem value="geometry">Geometry and Mensuration</SelectItem>
                        <SelectItem value="atoms">Atoms and Molecules</SelectItem>
                        <SelectItem value="grammar">Grammar Essentials</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Friend's Username</Label>
                    <Input
                      id="username"
                      placeholder="Enter username"
                      value={friendUsername}
                      onChange={(e) => setFriendUsername(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateChallenge}>Create Challenge</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Link href="/learning">
              <Button variant="outline">Back to Learning</Button>
            </Link>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
            <TabsTrigger value="all">All Challenges</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {isLoading ? (
              <div className="text-center py-10">Loading challenges...</div>
            ) : filteredChallenges.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredChallenges.map((challenge) => (
                  <Card key={challenge.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{challenge.quizTitle}</CardTitle>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(challenge.status)}`}>
                          {getStatusIcon(challenge.status)}
                          <span>{challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}</span>
                        </div>
                      </div>
                      <CardDescription>
                        {challenge.challengerId === 1 
                          ? `You challenged ${challenge.challengedName}` 
                          : `${challenge.challengerName} challenged you`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between my-3">
                        <div className="flex flex-col items-center">
                          <div className="text-sm text-muted-foreground mb-1">
                            {challenge.challengerId === 1 ? "You" : challenge.challengerName}
                          </div>
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <Sword className="h-6 w-6 text-primary" />
                          </div>
                          <div className="mt-1 font-bold text-lg">
                            {challenge.creatorScore !== null ? challenge.creatorScore : "-"}
                          </div>
                        </div>
                        
                        <div className="text-muted-foreground font-medium">VS</div>
                        
                        <div className="flex flex-col items-center">
                          <div className="text-sm text-muted-foreground mb-1">
                            {challenge.challengedId === 1 ? "You" : challenge.challengedName}
                          </div>
                          <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                            <Shield className="h-6 w-6 text-secondary-foreground" />
                          </div>
                          <div className="mt-1 font-bold text-lg">
                            {challenge.receiverScore !== null ? challenge.receiverScore : "-"}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Created:</span>
                          <span>{format(new Date(challenge.createdAt), "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expires:</span>
                          <span>{format(new Date(challenge.expiresAt), "MMM d, yyyy")}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      {challenge.status === "active" && challenge.challengedId === 1 && challenge.receiverScore === null && (
                        <Link href={`/learning/quizzes/${challenge.quizId}?challenge=${challenge.id}`}>
                          <Button className="w-full">Accept Challenge</Button>
                        </Link>
                      )}
                      {challenge.status === "active" && challenge.challengerId === 1 && (
                        <Button variant="outline" className="w-full">Remind Friend</Button>
                      )}
                      {challenge.status === "completed" && (
                        <Button variant="outline" className="w-full flex items-center gap-1">
                          <Trophy className="h-4 w-4" />
                          {challenge.creatorScore && challenge.receiverScore && challenge.creatorScore > challenge.receiverScore
                            ? (challenge.challengerId === 1 ? "You won!" : `${challenge.challengerName} won!`)
                            : (challenge.challengedId === 1 ? "You won!" : `${challenge.challengedName} won!`)}
                        </Button>
                      )}
                      {challenge.status === "expired" && (
                        <Button variant="outline" className="w-full">Create Again</Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No {activeTab} challenges found.</p>
                <Button className="mt-4" onClick={() => setCreateDialogOpen(true)}>Create a Challenge</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}