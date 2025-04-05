import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format } from "date-fns";
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Share2, ThumbsUp, Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import type { DailyFact } from "@shared/schema";

export default function FactsPage() {
  const { currentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<"today" | "calendar">("today");

  const { data: fact, isLoading } = useQuery<DailyFact | undefined>({
    queryKey: ["/api/daily-fact", selectedDate ? format(selectedDate, "yyyy-MM-dd") : null],
    enabled: !!currentUser
  });

  // For demonstration purposes, we'll show mock facts
  const mockFacts = [
    {
      id: 1,
      content: "The concept of zero as a number was first developed in India by mathematician Brahmagupta around 628 AD.",
      category: "mathematics",
      date: new Date(),
      createdBy: null
    },
    {
      id: 2,
      content: "The human body has enough iron in it to make a nail that is 3 inches long.",
      category: "science",
      date: new Date(new Date().setDate(new Date().getDate() - 1)),
      createdBy: null
    },
    {
      id: 3,
      content: "The Himalayas are still growing by about 5 millimeters per year as the Indian tectonic plate continues to move northward into the Eurasian plate.",
      category: "social-science",
      date: new Date(new Date().setDate(new Date().getDate() - 2)),
      createdBy: null
    },
    {
      id: 4,
      content: "There are more possible iterations of a game of chess than there are atoms in the known universe.",
      category: "mathematics",
      date: new Date(new Date().setDate(new Date().getDate() - 3)),
      createdBy: null
    },
    {
      id: 5,
      content: "The word 'robot' comes from the Czech word 'robota', which means 'forced labor' or 'work'.",
      category: "english",
      date: new Date(new Date().setDate(new Date().getDate() - 4)),
      createdBy: null
    }
  ];

  // Find the fact for the selected date or the closest date before it
  const findFactForDate = (date: Date): DailyFact | undefined => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    // Sort facts by date (newest first)
    const sortedFacts = [...mockFacts].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    // Find exact match for the selected date
    const exactMatch = sortedFacts.find(fact => {
      const factDate = new Date(fact.date);
      factDate.setHours(0, 0, 0, 0);
      return factDate.getTime() === targetDate.getTime();
    });
    
    if (exactMatch) return exactMatch;
    
    // Find the most recent fact before the selected date
    return sortedFacts.find(fact => {
      const factDate = new Date(fact.date);
      factDate.setHours(0, 0, 0, 0);
      return factDate.getTime() < targetDate.getTime();
    });
  };

  const currentFact = findFactForDate(selectedDate || new Date());
  
  const goToPreviousFact = () => {
    // Find the date of the fact before the current one
    const currentDate = selectedDate || new Date();
    const currentFactIndex = mockFacts.findIndex(fact => {
      const factDate = new Date(fact.date);
      factDate.setHours(0, 0, 0, 0);
      const targetDate = new Date(currentDate);
      targetDate.setHours(0, 0, 0, 0);
      return factDate.getTime() === targetDate.getTime();
    });
    
    if (currentFactIndex < mockFacts.length - 1) {
      setSelectedDate(new Date(mockFacts[currentFactIndex + 1].date));
    }
  };
  
  const goToNextFact = () => {
    // Find the date of the fact after the current one
    const currentDate = selectedDate || new Date();
    const currentFactIndex = mockFacts.findIndex(fact => {
      const factDate = new Date(fact.date);
      factDate.setHours(0, 0, 0, 0);
      const targetDate = new Date(currentDate);
      targetDate.setHours(0, 0, 0, 0);
      return factDate.getTime() === targetDate.getTime();
    });
    
    if (currentFactIndex > 0) {
      setSelectedDate(new Date(mockFacts[currentFactIndex - 1].date));
    }
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const hasFact = (date: Date): boolean => {
    return mockFacts.some(fact => {
      const factDate = new Date(fact.date);
      return (
        factDate.getDate() === date.getDate() &&
        factDate.getMonth() === date.getMonth() &&
        factDate.getFullYear() === date.getFullYear()
      );
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Daily Facts</h1>
            <p className="text-muted-foreground mt-1">Learn something new every day</p>
          </div>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date > new Date() || !hasFact(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Link href="/learning">
              <Button variant="outline">Back to Learning</Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-10">Loading fact...</div>
        ) : currentFact ? (
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 shadow-sm bg-gradient-to-br from-primary/10 to-primary/5">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <CardTitle>Did you know?</CardTitle>
                  </div>
                  <CardDescription>
                    {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Today"}
                    {isToday(selectedDate || new Date()) && " (Today)"}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed">{currentFact.content}</p>
                <div className="mt-4 text-sm text-muted-foreground">
                  Category: {currentFact.category?.charAt(0).toUpperCase() + currentFact.category?.slice(1) || "General"}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    Helpful
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={goToPreviousFact}
                    disabled={currentFactIndex === mockFacts.length - 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={goToNextFact}
                    disabled={currentFactIndex === 0}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <div className="mt-6 grid gap-4 grid-cols-1 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Previous Facts</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {mockFacts.slice(1, 4).map((fact) => (
                      <li key={fact.id} className="cursor-pointer hover:text-primary" onClick={() => setSelectedDate(new Date(fact.date))}>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                          <span>{format(new Date(fact.date), "MMM d, yyyy")}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="col-span-1 md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Did this help you learn?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    These daily facts are designed to help you remember important concepts. Let us know if they're helpful!
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline">Yes, very helpful!</Button>
                    <Button variant="outline">I want different facts</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No fact found for the selected date.</p>
            <Button className="mt-4" onClick={() => setSelectedDate(new Date())}>
              See Today's Fact
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}