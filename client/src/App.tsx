import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import MainLayout from "@/components/layout/main-layout";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ChatPage from "@/pages/chat";
import HomeworkPage from "@/pages/homework";
import TimetablePage from "@/pages/timetable";
import ProfilePage from "@/pages/profile";
import SettingsPage from "@/pages/settings";
import LearningPage from "@/pages/learning";
import QuizzesPage from "@/pages/learning/quizzes";
import FlashcardsPage from "@/pages/learning/flashcards";
import FactsPage from "@/pages/learning/facts";
import VideosPage from "@/pages/learning/videos";
import LeaderboardPage from "@/pages/learning/leaderboard";
import ChallengesPage from "@/pages/learning/challenges";
import AchievementsPage from "@/pages/learning/achievements";
import JourneyMapPage from "@/pages/learning/journey-map";
import StudyTimerPage from "@/pages/learning/study-timer";
import RecommendationsPage from "@/pages/learning/recommendations";
import ConversationsPage from "@/pages/conversations";
import ConversationDetailPage from "@/pages/conversations/[id]";
import NewConversationPage from "@/pages/conversations/new";
import { AuthProvider } from "@/context/auth-context";
import { AdminProvider } from "@/context/admin-context";

function Router() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/chat" component={ChatPage} />
        <Route path="/homework" component={HomeworkPage} />
        <Route path="/timetable" component={TimetablePage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/settings" component={SettingsPage} />
        
        {/* Learning Routes */}
        <Route path="/learning" component={LearningPage} />
        <Route path="/learning/quizzes" component={QuizzesPage} />
        <Route path="/learning/flashcards" component={FlashcardsPage} />
        <Route path="/learning/facts" component={FactsPage} />
        <Route path="/learning/videos" component={VideosPage} />
        <Route path="/learning/leaderboard" component={LeaderboardPage} />
        <Route path="/learning/challenges" component={ChallengesPage} />
        <Route path="/learning/achievements" component={AchievementsPage} />
        <Route path="/learning/journey-map" component={JourneyMapPage} />
        <Route path="/learning/study-timer" component={StudyTimerPage} />
        <Route path="/learning/recommendations" component={RecommendationsPage} />
        
        {/* Conversation Routes */}
        <Route path="/conversations" component={ConversationsPage} />
        <Route path="/conversations/new" component={NewConversationPage} />
        <Route path="/conversations/:id" component={ConversationDetailPage} />
        
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AdminProvider>
          <Router />
          <Toaster />
        </AdminProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
