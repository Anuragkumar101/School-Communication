import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Video, Play, Clock, BookOpen } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import type { LearningVideo } from "@shared/schema";

export default function VideosPage() {
  const { currentUser } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedVideo, setSelectedVideo] = useState<LearningVideo | null>(null);

  const { data: videos, isLoading } = useQuery<LearningVideo[]>({
    queryKey: ["/api/learning-videos", selectedSubject],
    enabled: !!currentUser
  });

  // For demonstration purposes, we'll use mock videos
  const mockVideos = [
    {
      id: 1,
      title: "Understanding Quadratic Equations",
      description: "This video explains how to solve quadratic equations using different methods including factoring, completing the square, and the quadratic formula.",
      videoUrl: "https://www.youtube.com/embed/vcn2ruTOwFo",
      subject: "mathematics",
      topic: "algebra",
      duration: "15:32",
      addedAt: new Date(),
      createdBy: null
    },
    {
      id: 2,
      title: "Newton's Laws of Motion Explained",
      description: "A comprehensive explanation of all three of Newton's laws of motion with examples and demonstrations.",
      videoUrl: "https://www.youtube.com/embed/kKKM8Y-u7ds",
      subject: "science",
      topic: "physics",
      duration: "12:45",
      addedAt: new Date(),
      createdBy: null
    },
    {
      id: 3,
      title: "Understanding Cell Structure and Function",
      description: "Learn about the basic structure of a cell, its components, and how each part functions to keep the cell alive.",
      videoUrl: "https://www.youtube.com/embed/URUJD5NEXC8",
      subject: "science",
      topic: "biology",
      duration: "18:21",
      addedAt: new Date(),
      createdBy: null
    },
    {
      id: 4,
      title: "India's Struggle for Independence",
      description: "This video covers the major events and figures in India's freedom movement from 1857 to 1947.",
      videoUrl: "https://www.youtube.com/embed/S8pGtT_BT-8",
      subject: "social-science",
      topic: "history",
      duration: "20:15",
      addedAt: new Date(),
      createdBy: null
    },
    {
      id: 5,
      title: "Understanding Grammar: Parts of Speech",
      description: "An overview of the eight parts of speech in English grammar with clear examples and explanations.",
      videoUrl: "https://www.youtube.com/embed/4p7VZB9RSg0",
      subject: "english",
      topic: "grammar",
      duration: "14:20",
      addedAt: new Date(),
      createdBy: null
    },
    {
      id: 6,
      title: "Geometry: Understanding Triangles",
      description: "Learn about the properties of triangles, including types, angles, and important theorems.",
      videoUrl: "https://www.youtube.com/embed/JvBZBfIJIRo",
      subject: "mathematics",
      topic: "geometry",
      duration: "16:45",
      addedAt: new Date(),
      createdBy: null
    }
  ];

  const filteredVideos = mockVideos.filter(video => {
    // Filter by subject
    if (selectedSubject !== "all" && video.subject !== selectedSubject) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !video.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !video.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const playVideo = (video: LearningVideo) => {
    setSelectedVideo(video);
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case "mathematics":
        return "bg-blue-100 text-blue-800";
      case "science":
        return "bg-green-100 text-green-800";
      case "social-science":
        return "bg-orange-100 text-orange-800";
      case "english":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        {selectedVideo ? (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">{selectedVideo.title}</h1>
              <Button
                variant="outline"
                onClick={() => setSelectedVideo(null)}
              >
                Back to Videos
              </Button>
            </div>
            
            <div className="aspect-video w-full">
              <iframe
                className="w-full h-full rounded-lg shadow-md"
                src={selectedVideo.videoUrl}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Clock className="h-4 w-4" />
                <span>{selectedVideo.duration}</span>
                <span className="mx-2">•</span>
                <Badge className={getSubjectColor(selectedVideo.subject)}>
                  {selectedVideo.subject.charAt(0).toUpperCase() + selectedVideo.subject.slice(1)}
                </Badge>
                <span className="mx-2">•</span>
                <span>{selectedVideo.topic.charAt(0).toUpperCase() + selectedVideo.topic.slice(1)}</span>
              </div>
              
              <p className="mt-2">{selectedVideo.description}</p>
              
              <div className="mt-6 grid gap-4 grid-cols-1 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Related Resources</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <ul className="space-y-1">
                      <li className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span>NCERT Textbook Chapter</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span>Practice Worksheet</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Related Videos</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <ul className="space-y-1">
                      {mockVideos
                        .filter(v => v.subject === selectedVideo.subject && v.id !== selectedVideo.id)
                        .slice(0, 2)
                        .map(video => (
                          <li key={video.id} className="cursor-pointer hover:text-primary" onClick={() => playVideo(video)}>
                            <div className="flex items-center gap-2">
                              <Play className="h-4 w-4 text-primary" />
                              <span>{video.title}</span>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Learning Videos</h1>
                <p className="text-muted-foreground mt-1">Watch educational videos to enhance your understanding</p>
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

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Search videos by title or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Videos</TabsTrigger>
                <TabsTrigger value="recent">Recently Added</TabsTrigger>
                <TabsTrigger value="popular">Most Viewed</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-10">Loading videos...</div>
                ) : filteredVideos.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredVideos.map((video) => (
                      <VideoCard
                        key={video.id}
                        video={video}
                        onPlay={() => playVideo(video)}
                        subjectColor={getSubjectColor(video.subject)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No videos found for the selected filters.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </MainLayout>
  );
}

interface VideoCardProps {
  video: any;
  onPlay: () => void;
  subjectColor: string;
}

function VideoCard({ video, onPlay, subjectColor }: VideoCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-video bg-black/5 cursor-pointer" onClick={onPlay}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center transition-transform hover:scale-110">
            <Play className="h-6 w-6 text-white" fill="white" />
          </div>
        </div>
        {/* Video thumbnail - in a real app, you would use an actual thumbnail */}
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
          <Video className="h-8 w-8" />
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg cursor-pointer hover:text-primary" onClick={onPlay}>
            {video.title}
          </CardTitle>
        </div>
        <CardDescription className="flex items-center gap-2">
          <Badge className={subjectColor}>
            {video.subject.charAt(0).toUpperCase() + video.subject.slice(1)}
          </Badge>
          <span className="text-xs text-muted-foreground">{video.duration}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm line-clamp-2">{video.description}</p>
      </CardContent>
      
      <CardFooter>
        <Button className="w-full" onClick={onPlay}>
          Watch Video
        </Button>
      </CardFooter>
    </Card>
  );
}