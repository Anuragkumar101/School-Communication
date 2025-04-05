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
import { AuthProvider } from "@/context/auth-context";

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
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
