import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Gamepad2 as GameController, 
  Calendar, 
  BarChart, 
  Users, 
  Camera,
  MessageCircle,
  ChevronRight
} from "lucide-react";

const SocialPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Social Hub</h1>
        <p className="text-muted-foreground">
          Connect, have fun, and share moments with your friends
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="bg-primary/10 w-fit p-2 rounded-lg mb-2">
              <GameController className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Games</CardTitle>
            <CardDescription>
              Play multiplayer games with friends
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-sm text-muted-foreground mb-4">
              Challenge your friends to quick, fun games and see who comes out on top!
            </p>
            <Link href="/social/games">
              <Button className="w-full justify-between">
                View Games
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="bg-primary/10 w-fit p-2 rounded-lg mb-2">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Events</CardTitle>
            <CardDescription>
              Plan activities with your friends
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-sm text-muted-foreground mb-4">
              Create and join events, whether it's a study session, movie night, or just hanging out.
            </p>
            <Link href="/social/events">
              <Button className="w-full justify-between">
                View Events
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="bg-primary/10 w-fit p-2 rounded-lg mb-2">
              <BarChart className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Polls</CardTitle>
            <CardDescription>
              Make decisions with your friends
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-sm text-muted-foreground mb-4">
              Create polls to decide what to do, where to go, or whatever you need input on.
            </p>
            <Link href="/social/polls">
              <Button className="w-full justify-between">
                View Polls
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="bg-primary/10 w-fit p-2 rounded-lg mb-2">
              <Camera className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Photo Sharing</CardTitle>
            <CardDescription>
              Share photos with your friends
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-sm text-muted-foreground mb-4">
              Upload and share photos of fun moments, trips, and activities with your friends.
            </p>
            <Button disabled className="w-full justify-between opacity-70">
              Coming Soon
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="bg-primary/10 w-fit p-2 rounded-lg mb-2">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Group Chat</CardTitle>
            <CardDescription>
              Chat with all your friends
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-sm text-muted-foreground mb-4">
              Create group chats for different topics, activities, or just to stay in touch.
            </p>
            <Link href="/conversations">
              <Button className="w-full justify-between">
                Go to Chats
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="bg-primary/10 w-fit p-2 rounded-lg mb-2">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Friend Circle</CardTitle>
            <CardDescription>
              Manage your connections
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-sm text-muted-foreground mb-4">
              Add new friends, see your friend list, and manage your social connections.
            </p>
            <Button disabled className="w-full justify-between opacity-70">
              Coming Soon
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Friend Activity</CardTitle>
          <CardDescription>
            See what your friends are up to
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                S
              </div>
              <div>
                <div className="font-medium">Sarah</div>
                <div className="text-sm text-muted-foreground">Created a new poll: "What movie should we watch?"</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                J
              </div>
              <div>
                <div className="font-medium">Jack</div>
                <div className="text-sm text-muted-foreground">Is attending "Pizza Party" event</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                M
              </div>
              <div>
                <div className="font-medium">Mike</div>
                <div className="text-sm text-muted-foreground">Started a game of "Word Chain"</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialPage;