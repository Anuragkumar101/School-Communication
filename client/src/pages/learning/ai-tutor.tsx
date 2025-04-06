import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { askAI, getLearningProfile, updateLearningProfile, recordMistake } from "@/lib/api/ai-learning";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CircularProgress } from "@/components/ui/circular-progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Lightbulb, MessageSquare, Settings, Sparkles, ThumbsUp, ThumbsDown, SendHorizonal } from "lucide-react";
import { User as FirebaseUser } from "firebase/auth";

// Extended Firebase user with database ID
interface ExtendedUser extends FirebaseUser {
  id?: number;
}

const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology", 
  "History",
  "Geography",
  "English",
  "Computer Science",
  "General Knowledge",
];

export default function AITutorPage() {
  const { currentUser: fbUser } = useAuth();
  const currentUser = fbUser as unknown as ExtendedUser;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conversations, setConversations] = useState<Array<{role: string, content: string}>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Profile fields
  const [learningStyle, setLearningStyle] = useState("");
  const [strengths, setStrengths] = useState("");
  const [weaknesses, setWeaknesses] = useState("");
  const [interests, setInterests] = useState("");
  
  // Mistake recording fields
  const [mistakeSubject, setMistakeSubject] = useState("");
  const [mistakeTopic, setMistakeTopic] = useState("");
  const [mistakeDetails, setMistakeDetails] = useState("");

  // Fetch the user's learning profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/ai/learning-profile', currentUser?.id],
    queryFn: () => currentUser?.id ? getLearningProfile(currentUser.id) : null,
    enabled: !!currentUser?.id,
  });

  // Update profile values when fetched
  useEffect(() => {
    if (profile) {
      setLearningStyle(profile.learningStyle || "");
      setStrengths(profile.strengths.join(", "));
      setWeaknesses(profile.weaknesses.join(", "));
      setInterests(profile.interests.join(", "));
    }
  }, [profile]);

  // Ask AI mutation
  const askAIMutation = useMutation({
    mutationFn: (data: { userId: number; query: string; subject?: string }) => 
      askAI(data.userId, data.query, undefined, data.subject),
    onSuccess: (data) => {
      setConversations(prev => [
        ...prev, 
        { role: "assistant", content: data.response }
      ]);
      setIsSubmitting(false);
      setQuery("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to get a response from the tutor. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: { 
      userId: number; 
      learningStyle?: string; 
      strengths?: string[]; 
      weaknesses?: string[]; 
      interests?: string[];
    }) => updateLearningProfile(
      data.userId, 
      {
        learningStyle: data.learningStyle,
        strengths: data.strengths,
        weaknesses: data.weaknesses,
        interests: data.interests,
      }
    ),
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your learning profile has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ai/learning-profile', currentUser?.id] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update your learning profile. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Record mistake mutation
  const recordMistakeMutation = useMutation({
    mutationFn: (data: { 
      userId: number; 
      subject: string; 
      topic: string; 
      details: string;
    }) => recordMistake(data.userId, data.subject, data.topic, data.details),
    onSuccess: () => {
      toast({
        title: "Mistake Recorded",
        description: "The mistake has been recorded to personalize your learning experience.",
      });
      setMistakeSubject("");
      setMistakeTopic("");
      setMistakeDetails("");
      queryClient.invalidateQueries({ queryKey: ['/api/ai/learning-profile', currentUser?.id] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to record the mistake. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations]);

  const handleSendMessage = () => {
    if (!query.trim() || !currentUser?.id) return;
    
    // Add user message to conversation
    setConversations(prev => [...prev, { role: "user", content: query }]);
    setIsSubmitting(true);
    
    // Send query to AI
    askAIMutation.mutate({
      userId: currentUser.id,
      query,
      subject: selectedSubject || undefined,
    });
  };

  const handleUpdateProfile = () => {
    if (!currentUser?.id) return;
    
    updateProfileMutation.mutate({
      userId: currentUser.id,
      learningStyle: learningStyle,
      strengths: strengths.split(",").map(s => s.trim()).filter(Boolean),
      weaknesses: weaknesses.split(",").map(s => s.trim()).filter(Boolean),
      interests: interests.split(",").map(s => s.trim()).filter(Boolean),
    });
  };

  const handleRecordMistake = () => {
    if (!currentUser?.id || !mistakeSubject || !mistakeTopic || !mistakeDetails) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields to record your mistake.",
        variant: "destructive",
      });
      return;
    }
    
    recordMistakeMutation.mutate({
      userId: currentUser.id,
      subject: mistakeSubject,
      topic: mistakeTopic,
      details: mistakeDetails,
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="h-7 w-7 text-primary" />
            AI Tutor
          </h1>
          {profile && (
            <Badge variant="outline" className="px-3 py-1 text-sm bg-gradient-to-r from-primary/60 to-primary font-medium text-white">
              {profile.learningStyle || "Learning Style Not Set"}
            </Badge>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 gap-2">
            <TabsTrigger value="chat" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>AI Chat</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              <span>Learning Profile</span>
            </TabsTrigger>
            <TabsTrigger value="mistakes" className="flex items-center gap-1">
              <Lightbulb className="h-4 w-4" />
              <span>Record Mistakes</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Card className="h-[65vh] flex flex-col">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-primary" />
                          Personal Learning Assistant
                        </CardTitle>
                        <CardDescription>
                          Ask questions or get help with homework and learning concepts
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow overflow-hidden">
                        <ScrollArea className="h-[calc(65vh-150px)] pr-4">
                          {conversations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                              <Brain className="h-16 w-16 text-muted-foreground mb-4" />
                              <h3 className="text-xl font-medium mb-2">Your AI Tutor is Ready!</h3>
                              <p className="text-muted-foreground">
                                Ask any question about your studies. The more you interact, the more personalized the responses will be.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {conversations.map((msg, index) => (
                                <div
                                  key={index}
                                  className={`flex ${
                                    msg.role === "user" ? "justify-end" : "justify-start"
                                  }`}
                                >
                                  <div
                                    className={`max-w-[80%] p-3 rounded-lg ${
                                      msg.role === "user"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted"
                                    }`}
                                  >
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                  </div>
                                </div>
                              ))}
                              <div ref={messagesEndRef} />
                            </div>
                          )}
                        </ScrollArea>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <div className="flex w-full gap-2 items-center">
                          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Subjects</SelectItem>
                              {subjects.map((subject) => (
                                <SelectItem key={subject} value={subject}>
                                  {subject}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex-grow flex gap-2">
                            <Textarea
                              value={query}
                              onChange={(e) => setQuery(e.target.value)}
                              placeholder="Ask anything about your studies..."
                              className="resize-none flex-grow"
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSendMessage();
                                }
                              }}
                            />
                            <Button 
                              onClick={handleSendMessage} 
                              disabled={isSubmitting || !query.trim()}
                              size="icon"
                            >
                              {isSubmitting ? (
                                <CircularProgress size={24} />
                              ) : (
                                <SendHorizonal className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                  
                  <div className="md:col-span-1">
                    <Card className="h-[65vh]">
                      <CardHeader>
                        <CardTitle>Learning Profile</CardTitle>
                        <CardDescription>
                          Your personalized learning information
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {profileLoading ? (
                          <div className="flex justify-center py-8">
                            <CircularProgress />
                          </div>
                        ) : profile ? (
                          <div className="space-y-6">
                            <div>
                              <h3 className="font-medium mb-2">Learning Style</h3>
                              <Badge variant="outline" className="text-base py-1 px-3">
                                {profile.learningStyle || "Not Set"}
                              </Badge>
                            </div>
                            
                            <div>
                              <h3 className="font-medium mb-2">Strengths</h3>
                              <div className="flex flex-wrap gap-1">
                                {profile.strengths.length > 0 ? (
                                  profile.strengths.map((strength, index) => (
                                    <Badge key={index} className="bg-green-100 text-green-800 hover:bg-green-200">
                                      {strength}
                                    </Badge>
                                  ))
                                ) : (
                                  <p className="text-sm text-muted-foreground">No strengths set</p>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="font-medium mb-2">Focus Areas</h3>
                              <div className="flex flex-wrap gap-1">
                                {profile.weaknesses.length > 0 ? (
                                  profile.weaknesses.map((weakness, index) => (
                                    <Badge key={index} className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                                      {weakness}
                                    </Badge>
                                  ))
                                ) : (
                                  <p className="text-sm text-muted-foreground">No focus areas set</p>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="font-medium mb-2">Recent Mistakes</h3>
                              <div className="text-sm">
                                {profile.recentMistakes.length > 0 ? (
                                  <ul className="space-y-2">
                                    {profile.recentMistakes.slice(0, 3).map((mistake, index) => (
                                      <li key={index} className="bg-muted p-2 rounded">
                                        <strong>{mistake.subject}:</strong> {mistake.topic}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-muted-foreground">No recorded mistakes</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">
                              Learning profile not found.
                            </p>
                            <Button
                              variant="outline"
                              className="mt-4"
                              onClick={() => setActiveTab("profile")}
                            >
                              Create Profile
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Learning Profile Settings
                </CardTitle>
                <CardDescription>
                  Customize your learning profile to get more personalized AI responses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="learning-style">Your Learning Style</Label>
                  <Select value={learningStyle} onValueChange={setLearningStyle}>
                    <SelectTrigger id="learning-style">
                      <SelectValue placeholder="Select your learning style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Visual">Visual - Learn best through images, diagrams</SelectItem>
                      <SelectItem value="Auditory">Auditory - Learn best through listening and speaking</SelectItem>
                      <SelectItem value="Reading/Writing">Reading/Writing - Learn best through text</SelectItem>
                      <SelectItem value="Kinesthetic">Kinesthetic - Learn best through doing and practice</SelectItem>
                      <SelectItem value="Logical">Logical - Learn best through reasoning and systems</SelectItem>
                      <SelectItem value="Social">Social - Learn best in groups, with discussion</SelectItem>
                      <SelectItem value="Solitary">Solitary - Learn best alone, with self-study</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="strengths">Your Academic Strengths</Label>
                  <Textarea 
                    id="strengths" 
                    placeholder="Algebra, critical thinking, essay writing, etc. (comma separated)"
                    value={strengths}
                    onChange={(e) => setStrengths(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    List subjects, topics, or skills you're good at (separate with commas)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weaknesses">Areas to Improve</Label>
                  <Textarea 
                    id="weaknesses" 
                    placeholder="Geometry, chemical equations, time management, etc. (comma separated)"
                    value={weaknesses}
                    onChange={(e) => setWeaknesses(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    List subjects, topics, or skills you want to improve (separate with commas)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="interests">Learning Interests</Label>
                  <Textarea 
                    id="interests" 
                    placeholder="Robotics, ancient history, environmental science, etc. (comma separated)"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    List subjects or topics you find especially interesting (separate with commas)
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("chat")}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdateProfile} 
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? (
                    <CircularProgress size={16} className="mr-2" />
                  ) : null}
                  Save Profile
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="mistakes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Record Learning Mistakes
                </CardTitle>
                <CardDescription>
                  Track concepts you struggled with to get more targeted help
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="mistake-subject">Subject</Label>
                  <Select 
                    value={mistakeSubject} 
                    onValueChange={setMistakeSubject}
                  >
                    <SelectTrigger id="mistake-subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mistake-topic">Topic</Label>
                  <Input 
                    id="mistake-topic" 
                    placeholder="e.g. Quadratic Equations, Newton's Laws, etc."
                    value={mistakeTopic}
                    onChange={(e) => setMistakeTopic(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mistake-details">What was difficult?</Label>
                  <Textarea 
                    id="mistake-details" 
                    placeholder="Describe what you found challenging or confusing about this topic..."
                    value={mistakeDetails}
                    onChange={(e) => setMistakeDetails(e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("chat")}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleRecordMistake} 
                  disabled={
                    recordMistakeMutation.isPending || 
                    !mistakeSubject || 
                    !mistakeTopic || 
                    !mistakeDetails
                  }
                >
                  {recordMistakeMutation.isPending ? (
                    <CircularProgress size={16} className="mr-2" />
                  ) : null}
                  Record Mistake
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}