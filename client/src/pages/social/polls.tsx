import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  BarChart, 
  PieChart, 
  Users, 
  Clock, 
  Plus,
  CheckSquare as Vote,
  Check,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  Edit
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PollsPage = () => {
  const { toast } = useToast();
  const [openNewPollDialog, setOpenNewPollDialog] = useState(false);
  const [votes, setVotes] = useState<Record<string, string | null>>({
    "poll1": null,
    "poll2": null,
    "poll3": null,
    "poll4": null
  });
  
  // Demo polls data
  const polls = [
    {
      id: "poll1",
      title: "What movie should we watch on Friday?",
      creator: "Sarah",
      createdAt: "2025-04-05T10:30:00",
      expires: "2025-04-08T18:00:00",
      options: [
        { id: "option1", text: "Avengers: Endgame", votes: 3 },
        { id: "option2", text: "The Dark Knight", votes: 2 },
        { id: "option3", text: "Inception", votes: 4 },
        { id: "option4", text: "Interstellar", votes: 1 }
      ],
      totalVotes: 10,
      status: "open",
      category: "entertainment"
    },
    {
      id: "poll2",
      title: "Where should we go for lunch after exams?",
      creator: "Jack",
      createdAt: "2025-04-06T09:15:00",
      expires: "2025-04-10T12:00:00",
      options: [
        { id: "option1", text: "Pizza Place", votes: 5 },
        { id: "option2", text: "Burger Joint", votes: 3 },
        { id: "option3", text: "Sushi Bar", votes: 4 }
      ],
      totalVotes: 12,
      status: "open",
      category: "food"
    },
    {
      id: "poll3",
      title: "What topic should we study for next week's group session?",
      creator: "Emma",
      createdAt: "2025-04-04T14:20:00",
      expires: "2025-04-07T16:00:00",
      options: [
        { id: "option1", text: "Mathematics", votes: 2 },
        { id: "option2", text: "Physics", votes: 1 },
        { id: "option3", text: "Chemistry", votes: 3 },
        { id: "option4", text: "Biology", votes: 1 }
      ],
      totalVotes: 7,
      status: "open",
      category: "study"
    },
    {
      id: "poll4",
      title: "Which sport should we play during PE class?",
      creator: "Mike",
      createdAt: "2025-04-03T11:05:00",
      expires: "2025-04-05T15:00:00",
      options: [
        { id: "option1", text: "Basketball", votes: 6 },
        { id: "option2", text: "Soccer", votes: 8 },
        { id: "option3", text: "Volleyball", votes: 4 }
      ],
      totalVotes: 18,
      status: "closed",
      category: "sports",
      winner: "Soccer"
    }
  ];

  const handleCreatePoll = () => {
    setOpenNewPollDialog(false);
    
    toast({
      title: "Poll Created",
      description: "Your poll has been created and shared with friends!",
    });
  };

  const handleVote = (pollId: string, optionId: string) => {
    setVotes(prev => ({
      ...prev,
      [pollId]: optionId
    }));
    
    toast({
      title: "Vote Recorded",
      description: "Your vote has been counted!",
    });
  };

  const formatDateRelative = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(date.getTime() - now.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours < 1) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
      }
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
      });
    }
  };

  const getExpiryText = (dateString: string) => {
    const expiryDate = new Date(dateString);
    const now = new Date();
    
    if (expiryDate < now) {
      return "Expired";
    }
    
    const diffTime = Math.abs(expiryDate.getTime() - now.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours < 1) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} left`;
      }
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} left`;
    } else if (diffDays === 1) {
      return '1 day left';
    } else {
      return `${diffDays} days left`;
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case "entertainment": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "study": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "sports": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "food": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "entertainment": return <PieChart className="h-4 w-4" />;
      case "study": return <BarChart className="h-4 w-4" />;
      case "sports": return <Users className="h-4 w-4" />;
      case "food": return <Vote className="h-4 w-4" />;
      default: return <Vote className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Polls & Voting</h1>
          <p className="text-muted-foreground">
            Create polls to make decisions with your friends
          </p>
        </div>

        <Button onClick={() => setOpenNewPollDialog(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Poll
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Polls</TabsTrigger>
          <TabsTrigger value="my-polls">My Polls</TabsTrigger>
          <TabsTrigger value="closed">Closed Polls</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="pt-4">
          <div className="grid gap-6 md:grid-cols-2">
            {polls.filter(poll => poll.status === "open").map((poll) => (
              <Card key={poll.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{poll.title}</CardTitle>
                    <Badge className={getCategoryColor(poll.category)}>
                      {poll.category.charAt(0).toUpperCase() + poll.category.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center justify-between mt-1">
                    <span>Created by {poll.creator}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDateRelative(poll.createdAt)}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <RadioGroup
                    value={votes[poll.id] || ""}
                    className="space-y-2"
                  >
                    {poll.options.map((option) => (
                      <div key={option.id} className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={option.id} 
                            id={`${poll.id}-${option.id}`} 
                            onClick={() => handleVote(poll.id, option.id)} 
                          />
                          <Label 
                            htmlFor={`${poll.id}-${option.id}`}
                            className="flex-1 cursor-pointer"
                          >
                            {option.text}
                          </Label>
                          <span className="text-xs text-muted-foreground">
                            {Math.round((option.votes / poll.totalVotes) * 100)}%
                          </span>
                        </div>
                        <Progress value={(option.votes / poll.totalVotes) * 100} className="h-2" />
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-0">
                  <div className="flex items-center text-xs text-muted-foreground gap-1">
                    <Users className="h-3 w-3" />
                    <span>{poll.totalVotes} votes</span>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {getExpiryText(poll.expires)}
                  </Badge>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-polls" className="pt-4">
          <div className="grid gap-6 md:grid-cols-2">
            {polls.filter(poll => poll.creator === "Sarah").map((poll) => (
              <Card key={poll.id} className="overflow-hidden border-primary/20">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2">
                      {poll.title}
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full p-0">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full p-0 text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardTitle>
                    <Badge className={getCategoryColor(poll.category)}>
                      {poll.category.charAt(0).toUpperCase() + poll.category.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center justify-between mt-1">
                    <span className="italic">Created by you</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDateRelative(poll.createdAt)}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  {poll.options.map((option) => (
                    <div key={option.id} className="space-y-1 mb-2">
                      <div className="flex items-center space-x-2">
                        <Label className="flex-1">
                          {option.text}
                        </Label>
                        <span className="text-xs text-muted-foreground">
                          {Math.round((option.votes / poll.totalVotes) * 100)}%
                        </span>
                      </div>
                      <Progress value={(option.votes / poll.totalVotes) * 100} className="h-2" />
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-0">
                  <div className="flex items-center text-xs text-muted-foreground gap-1">
                    <Users className="h-3 w-3" />
                    <span>{poll.totalVotes} votes</span>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {getExpiryText(poll.expires)}
                  </Badge>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="closed" className="pt-4">
          <div className="grid gap-6 md:grid-cols-2">
            {polls.filter(poll => poll.status === "closed").map((poll) => (
              <Card key={poll.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{poll.title}</CardTitle>
                    <Badge className={getCategoryColor(poll.category)}>
                      {poll.category.charAt(0).toUpperCase() + poll.category.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center justify-between mt-1">
                    <span>Created by {poll.creator}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDateRelative(poll.createdAt)}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  {poll.options.map((option) => (
                    <div key={option.id} className="space-y-1 mb-2">
                      <div className="flex items-center space-x-2">
                        <Label className={`flex-1 ${poll.winner === option.text ? "font-bold" : ""}`}>
                          {option.text}
                          {poll.winner === option.text && (
                            <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              Winner
                            </Badge>
                          )}
                        </Label>
                        <span className="text-xs text-muted-foreground">
                          {Math.round((option.votes / poll.totalVotes) * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={(option.votes / poll.totalVotes) * 100} 
                        className={`h-2 ${poll.winner === option.text ? "bg-green-500" : ""}`} 
                      />
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-0">
                  <div className="flex items-center text-xs text-muted-foreground gap-1">
                    <Users className="h-3 w-3" />
                    <span>{poll.totalVotes} votes</span>
                  </div>
                  <Badge variant="outline" className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800">
                    Closed
                  </Badge>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={openNewPollDialog} onOpenChange={setOpenNewPollDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create New Poll</DialogTitle>
            <DialogDescription>
              Make a poll to gather your friends' opinions and make decisions together.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Poll Question</Label>
              <Input id="title" placeholder="What do you want to ask?" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <select 
                id="category" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="entertainment">Entertainment</option>
                <option value="food">Food</option>
                <option value="study">Study</option>
                <option value="sports">Sports</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Options</Label>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                  + Add Option
                </Button>
              </div>
              <div className="space-y-2">
                <Input placeholder="Option 1" />
                <Input placeholder="Option 2" />
                <Input placeholder="Option 3" />
                <Input placeholder="Option 4 (optional)" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="expiry">Poll Expiry</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input type="date" id="expiry-date" />
                <Input type="time" id="expiry-time" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenNewPollDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePoll}>Create Poll</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PollsPage;