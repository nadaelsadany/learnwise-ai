import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  requirement: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  category: 'streak' | 'study' | 'mastery' | 'productivity';
  xp: number;
}

interface AchievementStats {
  streak: number;
  totalStudyHours: number;
  lessonsCompleted: number;
  quizzesPassed: number;
  cardsReviewed: number;
  perfectQuizzes: number;
  studySessions: number;
  coursesEnrolled: number;
  avgQuizScore: number;
  timeBlocksCreated: number;
  totalCards: number;
}

export interface LevelInfo {
  level: number;
  title: string;
  currentXP: number;
  xpForNext: number;
  totalXP: number;
}

const isValidUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const MOCK_STATS: AchievementStats = {
  streak: 12,
  totalStudyHours: 47.5,
  lessonsCompleted: 24,
  quizzesPassed: 8,
  cardsReviewed: 85,
  perfectQuizzes: 2,
  studySessions: 7,
  coursesEnrolled: 3,
  avgQuizScore: 76,
  timeBlocksCreated: 15,
  totalCards: 85,
};

const XP_PER_TIER = { bronze: 50, silver: 100, gold: 200, platinum: 500 };

const LEVELS = [
  { level: 1, title: 'Beginner', xpThreshold: 0 },
  { level: 2, title: 'Learner', xpThreshold: 100 },
  { level: 3, title: 'Active Student', xpThreshold: 250 },
  { level: 5, title: 'Focused Student', xpThreshold: 500 },
  { level: 7, title: 'Dedicated Scholar', xpThreshold: 900 },
  { level: 10, title: 'Knowledge Seeker', xpThreshold: 1500 },
  { level: 15, title: 'Expert Learner', xpThreshold: 2500 },
  { level: 20, title: 'Study Master', xpThreshold: 4000 },
];

const achievementDefs = [
  // Streak
  { id: 'streak-3', icon: '🔥', title: 'Getting Started', desc: '3-day study streak', req: '3 days', tier: 'bronze' as const, cat: 'streak' as const, check: (s: AchievementStats) => s.streak >= 3, progress: (s: AchievementStats) => Math.min(100, (s.streak / 3) * 100) },
  { id: 'streak-7', icon: '🔥', title: '7-Day Streak', desc: 'Study 7 days in a row', req: '7 days', tier: 'silver' as const, cat: 'streak' as const, check: (s: AchievementStats) => s.streak >= 7, progress: (s: AchievementStats) => Math.min(100, (s.streak / 7) * 100) },
  { id: 'streak-14', icon: '💪', title: 'Consistency Champion', desc: '14-day study streak', req: '14 days', tier: 'gold' as const, cat: 'streak' as const, check: (s: AchievementStats) => s.streak >= 14, progress: (s: AchievementStats) => Math.min(100, (s.streak / 14) * 100) },
  { id: 'streak-30', icon: '👑', title: 'Unstoppable', desc: '30-day study streak', req: '30 days', tier: 'platinum' as const, cat: 'streak' as const, check: (s: AchievementStats) => s.streak >= 30, progress: (s: AchievementStats) => Math.min(100, (s.streak / 30) * 100) },
  // Study hours
  { id: 'hours-10', icon: '📚', title: 'Dedicated Learner', desc: 'Study for 10 hours total', req: '10 hours', tier: 'bronze' as const, cat: 'study' as const, check: (s: AchievementStats) => s.totalStudyHours >= 10, progress: (s: AchievementStats) => Math.min(100, (s.totalStudyHours / 10) * 100) },
  { id: 'hours-30', icon: '📖', title: '30 Hours Studied', desc: 'Accumulate 30 study hours', req: '30 hours', tier: 'silver' as const, cat: 'study' as const, check: (s: AchievementStats) => s.totalStudyHours >= 30, progress: (s: AchievementStats) => Math.min(100, (s.totalStudyHours / 30) * 100) },
  { id: 'hours-100', icon: '🏆', title: 'Century Club', desc: '100 hours of studying', req: '100 hours', tier: 'gold' as const, cat: 'study' as const, check: (s: AchievementStats) => s.totalStudyHours >= 100, progress: (s: AchievementStats) => Math.min(100, (s.totalStudyHours / 100) * 100) },
  // Mastery
  { id: 'lessons-10', icon: '✅', title: 'Quick Learner', desc: 'Complete 10 lessons', req: '10 lessons', tier: 'bronze' as const, cat: 'mastery' as const, check: (s: AchievementStats) => s.lessonsCompleted >= 10, progress: (s: AchievementStats) => Math.min(100, (s.lessonsCompleted / 10) * 100) },
  { id: 'lessons-50', icon: '🎓', title: 'Knowledge Seeker', desc: 'Complete 50 lessons', req: '50 lessons', tier: 'silver' as const, cat: 'mastery' as const, check: (s: AchievementStats) => s.lessonsCompleted >= 50, progress: (s: AchievementStats) => Math.min(100, (s.lessonsCompleted / 50) * 100) },
  { id: 'cards-50', icon: '🧠', title: 'Card Collector', desc: 'Create 50 flashcards', req: '50 cards', tier: 'bronze' as const, cat: 'mastery' as const, check: (s: AchievementStats) => s.totalCards >= 50, progress: (s: AchievementStats) => Math.min(100, (s.totalCards / 50) * 100) },
  { id: 'cards-100', icon: '🧠', title: 'Memory Master', desc: 'Review 100 flashcards', req: '100 reviews', tier: 'silver' as const, cat: 'mastery' as const, check: (s: AchievementStats) => s.cardsReviewed >= 100, progress: (s: AchievementStats) => Math.min(100, (s.cardsReviewed / 100) * 100) },
  { id: 'quiz-ace', icon: '💯', title: 'Quiz Ace', desc: 'Score 100% on a quiz', req: 'Perfect score', tier: 'gold' as const, cat: 'mastery' as const, check: (s: AchievementStats) => s.perfectQuizzes >= 1, progress: (s: AchievementStats) => s.perfectQuizzes >= 1 ? 100 : Math.min(99, s.avgQuizScore) },
  // Productivity
  { id: 'deep-work', icon: '🎯', title: 'Deep Work Master', desc: '5 sessions of 45+ min', req: '5 deep sessions', tier: 'gold' as const, cat: 'productivity' as const, check: (s: AchievementStats) => s.studySessions >= 5, progress: (s: AchievementStats) => Math.min(100, (s.studySessions / 5) * 100) },
  { id: 'multi-course', icon: '🌟', title: 'Renaissance Student', desc: 'Enroll in 3+ courses', req: '3 courses', tier: 'silver' as const, cat: 'productivity' as const, check: (s: AchievementStats) => s.coursesEnrolled >= 3, progress: (s: AchievementStats) => Math.min(100, (s.coursesEnrolled / 3) * 100) },
  { id: 'planner', icon: '📅', title: 'Master Planner', desc: 'Create 10 time blocks', req: '10 blocks', tier: 'bronze' as const, cat: 'productivity' as const, check: (s: AchievementStats) => s.timeBlocksCreated >= 10, progress: (s: AchievementStats) => Math.min(100, (s.timeBlocksCreated / 10) * 100) },
  { id: 'planner-pro', icon: '🗓️', title: 'Scheduling Pro', desc: 'Create 50 time blocks', req: '50 blocks', tier: 'silver' as const, cat: 'productivity' as const, check: (s: AchievementStats) => s.timeBlocksCreated >= 50, progress: (s: AchievementStats) => Math.min(100, (s.timeBlocksCreated / 50) * 100) },
];

export const useAchievements = () => {
  const { user, isMockUser } = useAuth();
  const [stats, setStats] = useState<AchievementStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;

    if (isMockUser || !isValidUuid(user.id)) {
      setStats(MOCK_STATS);
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      setLoading(true);
      try {
        const [sessionsRes, cardsRes, enrollRes, lessonsRes, quizRes, blocksRes] = await Promise.all([
          supabase.from('study_sessions').select('*').eq('student_id', user.id),
          supabase.from('sr_cards').select('*').eq('student_id', user.id),
          supabase.from('enrollments').select('*').eq('student_id', user.id),
          supabase.from('lesson_completions').select('*').eq('student_id', user.id),
          supabase.from('quiz_results').select('*').eq('student_id', user.id),
          supabase.from('time_blocks').select('*').eq('student_id', user.id),
        ]);

        const sessions = sessionsRes.data || [];
        const cards = cardsRes.data || [];
        const enrollments = enrollRes.data || [];
        const lessons = lessonsRes.data || [];
        const quizzes = quizRes.data || [];
        const blocks = blocksRes.data || [];

        const totalSeconds = sessions.reduce((s, sess) => s + (sess.duration_seconds || 0), 0);
        const reviewedCards = cards.filter(c => c.last_reviewed).length;
        const perfectQuizzes = quizzes.filter(q => Number(q.percentage) === 100).length;
        const avgQuizScore = quizzes.length > 0 ? quizzes.reduce((s, q) => s + Number(q.percentage), 0) / quizzes.length : 0;
        const deepSessions = sessions.filter(s => (s.duration_seconds || 0) >= 2700).length;

        // Streak
        const now = new Date();
        const completionDates = new Set(lessons.map(l => l.completed_at.split('T')[0]));
        let streak = 0;
        const d = new Date(now.toISOString().split('T')[0]);
        while (completionDates.has(d.toISOString().split('T')[0])) {
          streak++;
          d.setDate(d.getDate() - 1);
        }

        setStats({
          streak,
          totalStudyHours: Math.round(totalSeconds / 3600 * 10) / 10,
          lessonsCompleted: lessons.length,
          quizzesPassed: quizzes.filter(q => q.passed).length,
          cardsReviewed: reviewedCards,
          perfectQuizzes,
          studySessions: deepSessions,
          coursesEnrolled: enrollments.length,
          avgQuizScore: Math.round(avgQuizScore),
          timeBlocksCreated: blocks.length,
          totalCards: cards.length,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user, isMockUser]);

  const achievements: Achievement[] = useMemo(() => {
    if (!stats) return [];
    return achievementDefs.map(def => ({
      id: def.id,
      icon: def.icon,
      title: def.title,
      description: def.desc,
      requirement: def.req,
      tier: def.tier,
      unlocked: def.check(stats),
      progress: Math.round(def.progress(stats)),
      category: def.cat,
      xp: XP_PER_TIER[def.tier],
    }));
  }, [stats]);

  // XP & Level system
  const { totalXP, levelInfo } = useMemo(() => {
    const earned = achievements.filter(a => a.unlocked);
    const totalXP = earned.reduce((sum, a) => sum + a.xp, 0);

    let currentLevel = LEVELS[0];
    let nextLevel = LEVELS[1];
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (totalXP >= LEVELS[i].xpThreshold) {
        currentLevel = LEVELS[i];
        nextLevel = LEVELS[i + 1] || { ...LEVELS[i], xpThreshold: LEVELS[i].xpThreshold + 1000 };
        break;
      }
    }

    const levelInfo: LevelInfo = {
      level: currentLevel.level,
      title: currentLevel.title,
      currentXP: totalXP - currentLevel.xpThreshold,
      xpForNext: nextLevel.xpThreshold - currentLevel.xpThreshold,
      totalXP,
    };

    return { totalXP, levelInfo };
  }, [achievements]);

  // Track newly unlocked
  useEffect(() => {
    if (!user) return;
    const key = `achievements_${user.id}`;
    const prev = JSON.parse(localStorage.getItem(key) || '[]') as string[];
    const currentUnlocked = achievements.filter(a => a.unlocked).map(a => a.id);
    const newOnes = currentUnlocked.filter(id => !prev.includes(id));
    if (newOnes.length > 0) {
      setNewlyUnlocked(newOnes);
      localStorage.setItem(key, JSON.stringify(currentUnlocked));
    }
  }, [achievements, user]);

  const dismissNewlyUnlocked = useCallback(() => setNewlyUnlocked([]), []);

  const earned = achievements.filter(a => a.unlocked);
  const locked = achievements.filter(a => !a.unlocked);

  return { achievements, earned, locked, loading, stats, newlyUnlocked, dismissNewlyUnlocked, totalXP, levelInfo };
};
