import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Gamepad2 as GameController, 
  Users, 
  Crown, 
  Send,
  MessageSquare,
  Share2,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// Simple mini-games to play with friends
const GamesPage = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  // Demo games list
  const games = [
    {
      id: "word-chain",
      name: "Word Chain",
      description: "Take turns continuing a word chain using the last letter",
      players: "2-8 players",
      difficulty: "Easy",
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      popular: true
    },
    {
      id: "trivia",
      name: "Trivia Challenge",
      description: "Test your knowledge against your friends",
      players: "2-10 players",
      difficulty: "Medium",
      icon: <Crown className="h-8 w-8 text-primary" />,
      popular: true
    },
    {
      id: "draw-guess",
      name: "Draw & Guess",
      description: "Draw a picture and let your friends guess what it is",
      players: "3-12 players",
      difficulty: "Easy",
      icon: <Share2 className="h-8 w-8 text-primary" />,
      popular: false
    },
    {
      id: "fastest-answer",
      name: "Fastest Answer",
      description: "Race to be the first to answer correctly",
      players: "2-6 players",
      difficulty: "Hard",
      icon: <Send className="h-8 w-8 text-primary" />,
      popular: false
    }
  ];

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(gameId);
    
    // This would normally start or join a game, for now just show a toast
    toast({
      title: "Game selected",
      description: "This feature is coming soon!",
    });
  };

  const handleInviteFriends = () => {
    toast({
      title: "Invite sent",
      description: "Your friends will receive an invite to join the game!",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Games with Friends</h1>
          <p className="text-muted-foreground">
            Have fun and connect with your friends through interactive games
          </p>
        </div>

        <Button onClick={handleInviteFriends} className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Invite Friends
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Games</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="active">Active Games</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="pt-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <Card 
                key={game.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedGame === game.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => handleGameSelect(game.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="bg-primary/10 p-2 rounded-lg mb-3">
                      {game.icon}
                    </div>
                    <div className="text-xs px-2 py-1 bg-primary/10 rounded-full">
                      {game.difficulty}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{game.name}</CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      {game.players}
                    </div>
                    <Button size="sm" variant="ghost" className="flex items-center gap-1">
                      Play <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="popular" className="pt-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {games
              .filter((game) => game.popular)
              .map((game) => (
                <Card 
                  key={game.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedGame === game.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => handleGameSelect(game.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="bg-primary/10 p-2 rounded-lg mb-3">
                        {game.icon}
                      </div>
                      <div className="text-xs px-2 py-1 bg-primary/10 rounded-full">
                        {game.difficulty}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{game.name}</CardTitle>
                    <CardDescription>{game.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        {game.players}
                      </div>
                      <Button size="sm" variant="ghost" className="flex items-center gap-1">
                        Play <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="pt-4">
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <GameController className="h-12 w-12 mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No Active Games</h3>
            <p className="text-muted-foreground max-w-md">
              You aren't participating in any active games at the moment. Start a new game or join a friend's game to play together!
            </p>
            <Button variant="outline" className="mt-4" onClick={() => handleGameSelect("word-chain")}>
              Start a New Game
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Friends Activity
          </CardTitle>
          <CardDescription>See what games your friends are playing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  S
                </div>
                <div>
                  <div className="font-medium">Sarah</div>
                  <div className="text-xs text-muted-foreground">Playing Trivia Challenge</div>
                </div>
              </div>
              <Button size="sm" variant="secondary">Join</Button>
            </div>

            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  J
                </div>
                <div>
                  <div className="font-medium">Jack</div>
                  <div className="text-xs text-muted-foreground">Playing Word Chain</div>
                </div>
              </div>
              <Button size="sm" variant="secondary">Join</Button>
            </div>

            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  M
                </div>
                <div>
                  <div className="font-medium">Mike</div>
                  <div className="text-xs text-muted-foreground">Created a Draw & Guess room</div>
                </div>
              </div>
              <Button size="sm" variant="secondary">Join</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamesPage;