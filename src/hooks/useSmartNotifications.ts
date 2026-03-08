import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface SmartNotification {
  id: string;
  type: 'flashcards_due' | 'goal_unmet' | 'focus_drop' | 'streak_risk' | 'achievement' | 'study_reminder' | 'weekly_report';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  actionLabel?: string;
}

const isValidUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const MOCK_NOTIFICATIONS: SmartNotification[] = [
  { id: 'mock-flash', type: 'flashcards_due', title: '8 Flashcards Due', message: 'You have 8 flashcards waiting for review. Reviewing now prevents forgetting!', priority: 'medium', read: false, createdAt: new Date().toISOString(), actionUrl: '/spaced-repetition', actionLabel: 'Review Now' },
  { id: 'mock-streak', type: 'streak_risk', title: '🔥 12-Day Streak Active!', message: 'Complete one session today to keep your streak going!', priority: 'high', read: false, createdAt: new Date().toISOString(), actionUrl: '/courses', actionLabel: 'Continue Learning' },
  { id: 'mock-plan', type: 'study_reminder', title: 'Good Morning! Plan Your Day', message: 'Start your day right — create a study schedule to maximize productivity.', priority: 'low', read: false, createdAt: new Date().toISOString(), actionUrl: '/time-blocking', actionLabel: 'Plan Day' },
];

export const useSmartNotifications = () => {
  const { user, isMockUser } = useAuth();
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPushEnabled(Notification.permission === 'granted');
    }
  }, []);

  const requestPushPermission = useCallback(async () => {
    if (!('Notification' in window)) return false;
    const permission = await Notification.requestPermission();
    const granted = permission === 'granted';
    setPushEnabled(granted);
    return granted;
  }, []);

  const sendPushNotification = useCallback((title: string, body: string) => {
    if (pushEnabled && 'Notification' in window && document.hidden) {
      new Notification(title, { body, icon: '/favicon.ico', badge: '/favicon.ico' });
    }
  }, [pushEnabled]);

  useEffect(() => {
    if (!user) return;

    // Mock users get instant mock notifications
    if (isMockUser || !isValidUuid(user.id)) {
      setNotifications(MOCK_NOTIFICATIONS);
      setLoading(false);
      return;
    }

    const generateNotifications = async () => {
      setLoading(true);
      const generated: SmartNotification[] = [];
      const now = new Date();
      const today = now.toISOString().split('T')[0];

      try {
        const [cardsRes, sessionsRes, blocksRes, lessonsRes, quizRes] = await Promise.all([
          supabase.from('sr_cards').select('*').eq('student_id', user.id),
          supabase.from('study_sessions').select('*').eq('student_id', user.id).gte('started_at', new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()),
          supabase.from('time_blocks').select('*').eq('student_id', user.id).eq('block_date', today),
          supabase.from('lesson_completions').select('*').eq('student_id', user.id),
          supabase.from('quiz_results').select('*').eq('student_id', user.id).order('completed_at', { ascending: false }).limit(5),
        ]);

        const cards = cardsRes.data || [];
        const sessions = sessionsRes.data || [];
        const todayBlocks = blocksRes.data || [];
        const lessons = lessonsRes.data || [];
        const recentQuizzes = quizRes.data || [];

        // 1. Flashcards due
        const dueCards = cards.filter(c => new Date(c.next_review) <= now);
        if (dueCards.length > 0) {
          const n: SmartNotification = {
            id: 'flashcards-due', type: 'flashcards_due',
            title: `${dueCards.length} Flashcards Due`,
            message: dueCards.length > 5 ? `You have ${dueCards.length} flashcards waiting for review. Reviewing now prevents forgetting!` : `${dueCards.length} cards are ready for review. A quick session will strengthen your memory.`,
            priority: dueCards.length > 10 ? 'high' : 'medium', read: false, createdAt: now.toISOString(), actionUrl: '/spaced-repetition', actionLabel: 'Review Now',
          };
          generated.push(n);
          if (dueCards.length > 10) sendPushNotification(n.title, n.message);
        }

        // 2. Goal check
        if (sessions.length < 3 && now.getDay() >= 3) {
          generated.push({ id: 'goal-unmet', type: 'goal_unmet', title: 'Weekly Study Goal at Risk', message: `Only ${sessions.length} study sessions this week. Try to fit in ${5 - sessions.length} more to stay on track.`, priority: 'high', read: false, createdAt: now.toISOString(), actionUrl: '/time-blocking', actionLabel: 'Plan Session' });
        }

        // 3. Focus drop
        const recentSessions = sessions.slice(-5);
        const avgDuration = recentSessions.length > 0 ? recentSessions.reduce((s, sess) => s + (sess.duration_seconds || 0), 0) / recentSessions.length : 0;
        if (recentSessions.length >= 3 && avgDuration < 900) {
          generated.push({ id: 'focus-drop', type: 'focus_drop', title: 'Focus Score Dropping', message: 'Your recent study sessions have been short. Try the Pomodoro technique for longer, deeper focus.', priority: 'medium', read: false, createdAt: now.toISOString(), actionUrl: '/time-blocking', actionLabel: 'Start Pomodoro' });
        }

        // 4. Streak risk
        const completionDates = new Set(lessons.map(l => l.completed_at.split('T')[0]));
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        if (completionDates.has(yesterday) && !completionDates.has(today) && now.getHours() >= 18) {
          const n: SmartNotification = { id: 'streak-risk', type: 'streak_risk', title: '🔥 Streak at Risk!', message: "Complete one lesson or review session today to keep your streak alive!", priority: 'high', read: false, createdAt: now.toISOString(), actionUrl: '/courses', actionLabel: 'Continue Learning' };
          generated.push(n);
          sendPushNotification(n.title, n.message);
        }

        // 5. Morning planning
        if (now.getHours() < 10 && todayBlocks.length === 0) {
          generated.push({ id: 'morning-plan', type: 'study_reminder', title: 'Good Morning! Plan Your Day', message: "Start your day right — create a study schedule to maximize productivity.", priority: 'low', read: false, createdAt: now.toISOString(), actionUrl: '/time-blocking', actionLabel: 'Plan Day' });
        }

        // 6. Quiz performance
        if (recentQuizzes.length >= 2) {
          const avgScore = recentQuizzes.reduce((s, q) => s + Number(q.percentage), 0) / recentQuizzes.length;
          if (avgScore < 60) {
            generated.push({ id: 'quiz-drop', type: 'focus_drop', title: 'Quiz Scores Need Attention', message: `Your recent quiz average is ${Math.round(avgScore)}%. Consider reviewing weak topics with the AI Coach.`, priority: 'medium', read: false, createdAt: now.toISOString(), actionUrl: '/ai-coach', actionLabel: 'Get Help' });
          }
        }

        setNotifications(generated);
      } catch (e) {
        console.error('Failed to generate notifications', e);
      } finally {
        setLoading(false);
      }
    };

    generateNotifications();
    const interval = setInterval(generateNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user, isMockUser, sendPushNotification]);

  const markRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, loading, unreadCount, markRead, markAllRead, pushEnabled, requestPushPermission };
};
