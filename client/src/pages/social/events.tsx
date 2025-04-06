import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Plus,
  ThumbsUp,
  CalendarClock,
  Trash2,
  Edit
} from "lucide-react";

const EventsPage = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [openNewEventDialog, setOpenNewEventDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  
  // Demo data for events
  const events = [
    {
      id: "event1",
      title: "Study Group: Math Final",
      description: "Let's prepare together for the upcoming math final exam. We'll focus on calculus and algebra.",
      location: "School Library, Room B12",
      date: "2025-04-15",
      time: "16:00 - 18:00",
      creator: "Sarah",
      attendees: ["Sarah", "Jack", "Emma", "Michael"],
      category: "study",
      status: "upcoming"
    },
    {
      id: "event2",
      title: "Pizza Party",
      description: "End of semester celebration! Let's relax and have some fun after all the hard work.",
      location: "Mario's Pizza, Downtown",
      date: "2025-04-25",
      time: "19:00 - 22:00",
      creator: "Jack",
      attendees: ["Jack", "Sarah", "Emma", "Michael", "Lisa", "Tom"],
      category: "social",
      status: "upcoming"
    },
    {
      id: "event3",
      title: "Basketball Game",
      description: "Friendly basketball match with the other class. Let's show them what we've got!",
      location: "School Gym",
      date: "2025-04-12",
      time: "15:30 - 17:00",
      creator: "Michael",
      attendees: ["Michael", "Jack", "Tom", "David"],
      category: "sports",
      status: "upcoming"
    },
    {
      id: "event4",
      title: "Movie Night: Sci-Fi Marathon",
      description: "Let's watch the latest sci-fi blockbusters together. Popcorn included!",
      location: "Sarah's Home",
      date: "2025-04-10",
      time: "18:00 - 23:00",
      creator: "Sarah",
      attendees: ["Sarah", "Emma", "Michael", "Lisa"],
      category: "entertainment",
      status: "past"
    }
  ];

  const handleCreateEvent = () => {
    setOpenNewEventDialog(false);
    
    toast({
      title: "Event Created",
      description: "Your event has been created and shared with friends!",
    });
  };

  const handleAttend = (eventId: string) => {
    toast({
      title: "RSVP Confirmed",
      description: "You're attending this event!",
    });
    
    setSelectedEvent(eventId);
  };

  const handleCancelAttendance = (eventId: string) => {
    toast({
      title: "Attendance Canceled",
      description: "You're no longer attending this event",
    });
    
    setSelectedEvent(null);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const isUpcoming = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    return eventDate >= today;
  };

  const daysUntil = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(eventDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Tomorrow";
    } else {
      return `In ${diffDays} days`;
    }
  };
  
  const getCategoryBadge = (category: string) => {
    switch(category) {
      case "study":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Study</Badge>;
      case "social":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Social</Badge>;
      case "sports":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Sports</Badge>;
      case "entertainment":
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">Entertainment</Badge>;
      default:
        return <Badge>Other</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">
            Plan activities and organize gatherings with your friends
          </p>
        </div>

        <Button onClick={() => setOpenNewEventDialog(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Event
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="my-events">My Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="pt-4">
          <div className="grid gap-6 md:grid-cols-2">
            {events
              .filter(event => event.status === "upcoming")
              .map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{event.title}</CardTitle>
                      {getCategoryBadge(event.category)}
                    </div>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {daysUntil(event.date)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm">{event.description}</p>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center pt-0">
                    <div className="flex items-center text-xs text-muted-foreground gap-1">
                      <Users className="h-4 w-4" />
                      <span>{event.attendees.length} attending</span>
                    </div>
                    {selectedEvent === event.id ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleCancelAttendance(event.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                      >
                        Cancel
                      </Button>
                    ) : (
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => handleAttend(event.id)}
                        className="flex items-center gap-1"
                      >
                        <ThumbsUp className="h-3 w-3" />
                        Attend
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="my-events" className="pt-4">
          <div className="grid gap-6 md:grid-cols-2">
            {events
              .filter(event => event.creator === "Sarah")
              .map((event) => (
                <Card key={event.id} className="overflow-hidden border-primary/20">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="flex items-center gap-2">
                        {event.title}
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full p-0">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full p-0 text-destructive">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardTitle>
                      {getCategoryBadge(event.category)}
                    </div>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {isUpcoming(event.date) ? daysUntil(event.date) : "Past event"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm">{event.description}</p>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center pt-0">
                    <div className="flex items-center text-xs text-muted-foreground gap-1">
                      <Users className="h-4 w-4" />
                      <span>{event.attendees.length} attending</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      Manage
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="past" className="pt-4">
          <div className="grid gap-6 md:grid-cols-2">
            {events
              .filter(event => event.status === "past")
              .map((event) => (
                <Card key={event.id} className="overflow-hidden opacity-80">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{event.title}</CardTitle>
                      {getCategoryBadge(event.category)}
                    </div>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <CalendarClock className="h-3 w-3" />
                      {formatDate(event.date)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm">{event.description}</p>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center pt-0">
                    <div className="flex items-center text-xs text-muted-foreground gap-1">
                      <Users className="h-4 w-4" />
                      <span>{event.attendees.length} attended</span>
                    </div>
                    <Badge variant="outline">Completed</Badge>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={openNewEventDialog} onOpenChange={setOpenNewEventDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Plan an event and invite your friends to join.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Event Title</Label>
              <Input id="title" placeholder="Enter a descriptive title" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="What is this event about? Add any important details." 
                rows={3} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="Where will it take place?" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <select 
                id="category" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="study">Study</option>
                <option value="social">Social</option>
                <option value="sports">Sports</option>
                <option value="entertainment">Entertainment</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenNewEventDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateEvent}>Create Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsPage;