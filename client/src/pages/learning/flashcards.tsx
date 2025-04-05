import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, ChevronLeft, Bookmark, RotateCw } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import type { Flashcard } from "@shared/schema";

export default function FlashcardsPage() {
  const { currentUser } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<string>("mathematics");
  const [activeTab, setActiveTab] = useState<string>("study");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const { data: flashcards, isLoading } = useQuery<Flashcard[]>({
    queryKey: ["/api/flashcards", selectedSubject],
    enabled: !!currentUser
  });

  // For demonstration purposes, we'll use mock flashcards
  const mockFlashcards = [
    {
      id: 1,
      front: "Pythagoras Theorem",
      back: "In a right-angled triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides. a² + b² = c²",
      subject: "mathematics"
    },
    {
      id: 2,
      front: "Area of a Circle",
      back: "A = πr², where r is the radius of the circle.",
      subject: "mathematics"
    },
    {
      id: 3,
      front: "Quadratic Formula",
      back: "For a quadratic equation ax² + bx + c = 0, the solutions are given by x = (-b ± √(b² - 4ac)) / 2a",
      subject: "mathematics"
    },
    {
      id: 4,
      front: "Newton's First Law of Motion",
      back: "An object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.",
      subject: "science"
    },
    {
      id: 5,
      front: "Photosynthesis",
      back: "6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂",
      subject: "science"
    }
  ];

  const filteredFlashcards = selectedSubject === "all" 
    ? mockFlashcards 
    : mockFlashcards.filter(card => card.subject === selectedSubject);

  const currentCard = filteredFlashcards[currentCardIndex] || null;

  const nextCard = () => {
    if (currentCardIndex < filteredFlashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const shuffleCards = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Flashcards</h1>
            <p className="text-muted-foreground mt-1">Review key concepts, formulas, and definitions</p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="social-science">Social Science</SelectItem>
                <SelectItem value="english">English</SelectItem>
              </SelectContent>
            </Select>
            <Link href="/learning">
              <Button variant="outline">Back to Learning</Button>
            </Link>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="study">Study Mode</TabsTrigger>
            <TabsTrigger value="all">Browse All</TabsTrigger>
          </TabsList>

          <TabsContent value="study" className="space-y-6">
            {isLoading ? (
              <div className="text-center py-10">Loading flashcards...</div>
            ) : filteredFlashcards.length > 0 ? (
              <>
                <div className="w-full max-w-2xl mx-auto">
                  <div 
                    className="relative w-full h-64 md:h-80 cursor-pointer perspective-1000"
                    onClick={flipCard}
                  >
                    <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                      {/* Front of card */}
                      <div className={`absolute w-full h-full backface-hidden ${isFlipped ? 'invisible' : ''} bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-6 flex flex-col justify-center items-center shadow-md border`}>
                        <h3 className="text-2xl font-bold text-center mb-4">{currentCard?.front}</h3>
                        <p className="text-center text-sm text-muted-foreground mt-4">Click to flip</p>
                      </div>

                      {/* Back of card */}
                      <div className={`absolute w-full h-full backface-hidden ${!isFlipped ? 'invisible' : ''} rotate-y-180 bg-white rounded-lg p-6 flex flex-col justify-center items-center shadow-md border`}>
                        <p className="text-lg text-center">{currentCard?.back}</p>
                        <p className="text-center text-sm text-muted-foreground mt-4">Click to flip back</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={prevCard}
                      disabled={currentCardIndex === 0}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      Card {currentCardIndex + 1} of {filteredFlashcards.length}
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={nextCard}
                      disabled={currentCardIndex === filteredFlashcards.length - 1}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex justify-center gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={shuffleCards}
                    >
                      <RotateCw className="h-4 w-4" />
                      Shuffle
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                    >
                      <Bookmark className="h-4 w-4" />
                      Save for Later
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No flashcards found for the selected subject.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-10">Loading flashcards...</div>
            ) : filteredFlashcards.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredFlashcards.map((card) => (
                  <Card key={card.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{card.front}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{card.back}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No flashcards found for the selected subject.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}