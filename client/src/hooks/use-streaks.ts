import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from './use-auth';
import { toast } from './use-toast';

// Types extended from Firebase User
interface ExtendedUser {
  id?: number;
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

interface UserStreak {
  id: number;
  userId: number;
  currentStreak: number;
  longestStreak: number;
  lastActivity: string;
  totalXp: number;
  level: number;
}

interface XpActivity {
  id: number;
  userId: number;
  activity: string;
  description: string;
  xpEarned: number;
  createdAt: string;
}

interface XpLeaderboardEntry {
  user: {
    id: number;
    displayName: string;
    photoURL?: string;
  };
  totalXp: number;
  level: number;
}

export function useStreaks() {
  const { currentUser: authUser } = useAuth();
  const queryClient = useQueryClient();
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [activities, setActivities] = useState<XpActivity[]>([]);
  const [leaderboard, setLeaderboard] = useState<XpLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState({
    streak: false,
    activities: false,
    leaderboard: false
  });
  
  // Treat the currentUser as our ExtendedUser type
  const currentUser = authUser as unknown as ExtendedUser;

  // Function to record a login (used when the user opens the app)
  const recordLogin = async () => {
    if (!currentUser) return null;
    
    try {
      setLoading(prev => ({ ...prev, streak: true }));
      const response = await apiRequest({
        url: `/api/users/${currentUser.id}/login`,
        method: 'POST'
      });
      
      // Type assertion with a cast to unknown first
      const typedResponse = response as unknown as {
        streak: number;
        longestStreak: number;
        xpEarned: number;
        level: number;
        levelUp: boolean;
      };
      
      // Invalidate streak data to trigger a refetch
      queryClient.invalidateQueries({ queryKey: [`/api/users/${currentUser.id}/streak`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${currentUser.id}/xp-activities`] });
      
      // Show toast notification if there's a level up
      if (typedResponse.levelUp) {
        toast({
          title: '🎉 Level Up!',
          description: `Congratulations! You've reached level ${typedResponse.level}!`,
        });
      }
      
      return typedResponse;
    } catch (error) {
      console.error('Error recording login:', error);
      return null;
    } finally {
      setLoading(prev => ({ ...prev, streak: false }));
    }
  };

  // Function to fetch user streak
  const fetchStreak = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(prev => ({ ...prev, streak: true }));
      const response = await apiRequest({
        url: `/api/users/${currentUser.id}/streak`,
        method: 'GET'
      });
      // Type assertion with a cast to unknown first
      const typedStreak = response as unknown as UserStreak;
      setStreak(typedStreak);
    } catch (error) {
      console.error('Error fetching streak:', error);
    } finally {
      setLoading(prev => ({ ...prev, streak: false }));
    }
  };

  // Function to fetch XP activities
  const fetchActivities = async (limit?: number) => {
    if (!currentUser) return;
    
    try {
      setLoading(prev => ({ ...prev, activities: true }));
      const url = `/api/users/${currentUser.id}/xp-activities${limit ? `?limit=${limit}` : ''}`;
      const response = await apiRequest({
        url,
        method: 'GET'
      });
      // Type assertion with a cast to unknown first
      const typedActivities = response as unknown as XpActivity[];
      setActivities(typedActivities);
    } catch (error) {
      console.error('Error fetching XP activities:', error);
    } finally {
      setLoading(prev => ({ ...prev, activities: false }));
    }
  };

  // Function to fetch leaderboard
  const fetchLeaderboard = async (limit?: number) => {
    try {
      setLoading(prev => ({ ...prev, leaderboard: true }));
      const url = `/api/xp-leaderboard${limit ? `?limit=${limit}` : ''}`;
      const response = await apiRequest({
        url,
        method: 'GET'
      });
      // Type assertion with a cast to unknown first
      const typedLeaderboard = response as unknown as XpLeaderboardEntry[];
      setLeaderboard(typedLeaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(prev => ({ ...prev, leaderboard: false }));
    }
  };

  // Initialize everything when the user changes
  useEffect(() => {
    if (currentUser) {
      fetchStreak();
      fetchActivities(10); // Fetch last 10 activities by default
      fetchLeaderboard(10); // Fetch top 10 users by default
    } else {
      setStreak(null);
      setActivities([]);
      setLeaderboard([]);
    }
  }, [currentUser]);

  return {
    streak,
    activities,
    leaderboard,
    loading,
    recordLogin,
    fetchStreak,
    fetchActivities,
    fetchLeaderboard
  };
}