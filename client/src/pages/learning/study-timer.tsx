import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Timer, 
  Calendar, 
  BarChart, 
  Clock, 
  BookOpen, 
  CheckCircle,
  BellIcon,
  VolumeIcon
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

type TimerMode = "pomodoro" | "short-break" | "long-break";
type TimerStatus = "idle" | "running" | "paused" | "completed";

interface StudySession {
  id: string;
  date: Date;
  subject: string;
  durationMinutes: number;
  completedIntervals: number;
}

export default function StudyTimerPage() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  // Timer state
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // Default 25 minutes
  const [sessions, setSessions] = useState<number>(0);
  const [currentSubject, setCurrentSubject] = useState<string>("general");
  
  // Settings
  const [pomodoroMinutes, setPomodoroMinutes] = useState<number>(25);
  const [shortBreakMinutes, setShortBreakMinutes] = useState<number>(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState<number>(15);
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState<number>(4);
  
  // Timer ref for cleanup
  const timerRef = useRef<number | null>(null);
  
  // Mock session history
  const [sessionHistory, setSessionHistory] = useState<StudySession[]>([
    {
      id: "1",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      subject: "Mathematics",
      durationMinutes: 75,
      completedIntervals: 3
    },
    {
      id: "2",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      subject: "Science",
      durationMinutes: 50,
      completedIntervals: 2
    },
    {
      id: "3",
      date: new Date(),
      subject: "English",
      durationMinutes: 25,
      completedIntervals: 1
    },
    {
      id: "4",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      subject: "Social Studies",
      durationMinutes: 100,
      completedIntervals: 4
    }
  ]);
  
  // Stats
  const [statsTab, setStatsTab] = useState<string>("week");
  
  // Set initial timer based on mode
  useEffect(() => {
    resetTimer();
  }, [mode, pomodoroMinutes, shortBreakMinutes, longBreakMinutes]);
  
  // Timer logic
  useEffect(() => {
    if (status === "running") {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer completed
            clearInterval(timerRef.current as number);
            setStatus("completed");
            
            // Play sound notification
            const audio = new Audio("/notification.mp3");
            audio.play().catch(e => console.log("Audio playback failed", e));
            
            // Show notification
            toast({
              title: mode === "pomodoro" ? "Pomodoro completed!" : "Break time over!",
              description: mode === "pomodoro" ? "Time for a break." : "Time to focus again!",
              duration: 5000
            });
            
            // Add session to history if it was a pomodoro
            if (mode === "pomodoro") {
              setSessions(prev => prev + 1);
              
              // Add to session history
              setSessionHistory(prev => [
                {
                  id: Date.now().toString(),
                  date: new Date(),
                  subject: currentSubject,
                  durationMinutes: pomodoroMinutes,
                  completedIntervals: 1
                },
                ...prev
              ]);
              
              // Auto transition to break
              if (sessions + 1 >= sessionsBeforeLongBreak) {
                // Time for long break
                setMode("long-break");
                setSessions(0);
              } else {
                // Short break
                setMode("short-break");
              }
            } else {
              // After break, go back to pomodoro
              setMode("pomodoro");
            }
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [status, mode]);
  
  const startTimer = () => {
    setStatus("running");
  };
  
  const pauseTimer = () => {
    setStatus("paused");
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };
  
  const resetTimer = () => {
    setStatus("idle");
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Set time based on selected mode
    if (mode === "pomodoro") {
      setTimeLeft(pomodoroMinutes * 60);
    } else if (mode === "short-break") {
      setTimeLeft(shortBreakMinutes * 60);
    } else {
      setTimeLeft(longBreakMinutes * 60);
    }
  };
  
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };
  
  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      "Mathematics": "bg-blue-100 text-blue-800",
      "Science": "bg-green-100 text-green-800",
      "Social Studies": "bg-amber-100 text-amber-800",
      "English": "bg-purple-100 text-purple-800",
      "Languages": "bg-pink-100 text-pink-800",
      "general": "bg-gray-100 text-gray-800"
    };
    
    return colors[subject] || colors.general;
  };
  
  const getTotalStudyTime = () => {
    // Calculate minutes studied based on selected time frame
    let filtered = sessionHistory;
    
    if (statsTab === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = sessionHistory.filter(s => s.date >= weekAgo);
    } else if (statsTab === "month") {
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      filtered = sessionHistory.filter(s => s.date >= monthAgo);
    }
    
    const totalMinutes = filtered.reduce((acc, session) => acc + session.durationMinutes, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return { hours, minutes, totalMinutes, completedIntervals: filtered.reduce((acc, s) => acc + s.completedIntervals, 0) };
  };
  
  const getSubjectDistribution = () => {
    // Get distribution of study time by subject
    const distribution: Record<string, number> = {};
    
    sessionHistory.forEach(session => {
      if (distribution[session.subject]) {
        distribution[session.subject] += session.durationMinutes;
      } else {
        distribution[session.subject] = session.durationMinutes;
      }
    });
    
    return distribution;
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Study Timer</h1>
            <p className="text-muted-foreground mt-1">Focus using the Pomodoro technique</p>
          </div>
          <div className="flex gap-2">
            <Link href="/learning">
              <Button variant="outline">Back to Learning</Button>
            </Link>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card className="relative overflow-hidden">
              <div className={`absolute inset-0 w-full h-full opacity-5 ${
                mode === "pomodoro" 
                  ? "bg-red-500" 
                  : mode === "short-break" 
                    ? "bg-green-500" 
                    : "bg-blue-500"
              }`}></div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    {mode === "pomodoro" 
                      ? "Focus Time" 
                      : mode === "short-break" 
                        ? "Short Break" 
                        : "Long Break"}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-muted-foreground">
                      Session: {sessions + 1}/{sessionsBeforeLongBreak}
                    </div>
                    <Select value={currentSubject} onValueChange={setCurrentSubject}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Science">Science</SelectItem>
                        <SelectItem value="Social Studies">Social Studies</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Languages">Languages</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="text-7xl font-bold mb-6 font-mono">
                    {formatTime(timeLeft)}
                  </div>
                  
                  <div className="flex gap-3 mb-8">
                    <Button 
                      variant="outline" 
                      className={mode === "pomodoro" ? "bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-800" : ""}
                      onClick={() => {
                        setMode("pomodoro");
                        setStatus("idle");
                      }}
                    >
                      Pomodoro
                    </Button>
                    <Button 
                      variant="outline"
                      className={mode === "short-break" ? "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-800" : ""}
                      onClick={() => {
                        setMode("short-break");
                        setStatus("idle");
                      }}
                    >
                      Short Break
                    </Button>
                    <Button 
                      variant="outline"
                      className={mode === "long-break" ? "bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-800" : ""}
                      onClick={() => {
                        setMode("long-break");
                        setStatus("idle");
                      }}
                    >
                      Long Break
                    </Button>
                  </div>
                  
                  <div className="flex gap-4">
                    {status === "idle" || status === "paused" || status === "completed" ? (
                      <Button 
                        onClick={startTimer}
                        className="w-32"
                        size="lg"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Start
                      </Button>
                    ) : (
                      <Button 
                        onClick={pauseTimer}
                        className="w-32"
                        size="lg"
                        variant="outline"
                      >
                        <Pause className="mr-2 h-4 w-4" />
                        Pause
                      </Button>
                    )}
                    
                    <Button 
                      onClick={resetTimer}
                      variant="outline"
                      className="w-32"
                      size="lg"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Session History</CardTitle>
                <CardDescription>Your recent study sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sessionHistory.slice(0, 5).map(session => (
                    <div key={session.id} className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center border">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium">{session.subject}</div>
                          <div className="text-xs text-muted-foreground">
                            {session.date.toLocaleDateString()} • {session.completedIntervals} intervals
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{session.durationMinutes} mins</div>
                        <div className="text-xs text-muted-foreground">
                          {Math.floor(session.durationMinutes / 60) > 0
                            ? `${Math.floor(session.durationMinutes / 60)}h ${session.durationMinutes % 60}m`
                            : `${session.durationMinutes}m`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Timer Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Focus Time (minutes)</label>
                  <Input 
                    type="number" 
                    min="1" 
                    max="60" 
                    value={pomodoroMinutes} 
                    onChange={(e) => setPomodoroMinutes(parseInt(e.target.value) || 25)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Short Break (minutes)</label>
                  <Input 
                    type="number" 
                    min="1" 
                    max="30" 
                    value={shortBreakMinutes} 
                    onChange={(e) => setShortBreakMinutes(parseInt(e.target.value) || 5)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Long Break (minutes)</label>
                  <Input 
                    type="number" 
                    min="1" 
                    max="60" 
                    value={longBreakMinutes} 
                    onChange={(e) => setLongBreakMinutes(parseInt(e.target.value) || 15)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Sessions Before Long Break</label>
                  <Input 
                    type="number" 
                    min="1" 
                    max="10" 
                    value={sessionsBeforeLongBreak} 
                    onChange={(e) => setSessionsBeforeLongBreak(parseInt(e.target.value) || 4)}
                  />
                </div>
                
                <div className="flex items-center gap-2 bg-muted/50 p-2 rounded text-sm">
                  <VolumeIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Sound notifications will play when timers end</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Study Stats</CardTitle>
                <Tabs value={statsTab} onValueChange={setStatsTab} className="mt-2">
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
                    <TabsTrigger value="all">All Time</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="border rounded-lg p-3 text-center">
                    <div className="text-sm text-muted-foreground mb-1">Total Time</div>
                    <div className="text-2xl font-bold">
                      {getTotalStudyTime().hours}h {getTotalStudyTime().minutes}m
                    </div>
                  </div>
                  <div className="border rounded-lg p-3 text-center">
                    <div className="text-sm text-muted-foreground mb-1">Completed</div>
                    <div className="text-2xl font-bold">
                      {getTotalStudyTime().completedIntervals}
                    </div>
                    <div className="text-xs text-muted-foreground">intervals</div>
                  </div>
                </div>
                
                <h4 className="font-medium mb-2 text-sm">Subject Distribution</h4>
                <div className="space-y-2">
                  {Object.entries(getSubjectDistribution()).sort((a, b) => b[1] - a[1]).map(([subject, minutes]) => (
                    <div key={subject} className="flex items-center gap-3">
                      <div className={`px-2 py-1 rounded text-xs ${getSubjectColor(subject)}`}>
                        {subject}
                      </div>
                      <div className="flex-1 text-sm">
                        {Math.floor(minutes / 60) > 0
                          ? `${Math.floor(minutes / 60)}h ${minutes % 60}m`
                          : `${minutes}m`}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round((minutes / getTotalStudyTime().totalMinutes) * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Focus on one task during a Pomodoro interval</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Take short breaks away from the screen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Use long breaks for physical activity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Try to complete at least 4 Pomodoros each day</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}