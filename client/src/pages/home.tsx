import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatWidget from "@/components/chat/chat-widget";
import HomeworkBoard from "@/components/homework/homework-board";
import TimetableWidget from "@/components/timetable/timetable-widget";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Home = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {currentUser ? `Welcome, ${currentUser.displayName || 'Friend'}!` : 'Welcome to SchoolConnect'}
        </h1>
        <p className="text-muted-foreground">
          Stay connected with your school friends and keep track of your homework and schedule.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Quick Chat</CardTitle>
            <CardDescription>
              Connect with your classmates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 overflow-y-auto bg-gray-50 dark:bg-gray-800 rounded-md p-2">
              <ChatWidget />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Upcoming Homework</CardTitle>
            <CardDescription>
              Your latest assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 overflow-y-auto">
              <HomeworkBoard />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>
              Your timetable for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 overflow-y-auto">
              <TimetableWidget />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">Class Chat</TabsTrigger>
          <TabsTrigger value="homework">Homework</TabsTrigger>
          <TabsTrigger value="timetable">Timetable</TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="pt-4">
          <ChatWidget />
        </TabsContent>
        <TabsContent value="homework" className="pt-4">
          <HomeworkBoard />
        </TabsContent>
        <TabsContent value="timetable" className="pt-4">
          <TimetableWidget />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Home;
