import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface LessonCompletion {
  id: string;
  student_id: string;
  lesson_id: string;
  completed_at: string;
  time_spent_seconds: number;
}

export interface QuizResult {
  id: string;
  student_id: string;
  quiz_id: string;
  score: number;
  total_points: number;
  percentage: number;
  passed: boolean;
  answers: unknown;
  time_taken_seconds: number | null;
  completed_at: string;
}

export interface StudySession {
  id: string;
  student_id: string;
  course_id: string | null;
  lesson_id: string | null;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number;
}

export interface ProgressStats {
  totalLessonsCompleted: number;
  totalQuizzesTaken: number;
  averageQuizScore: number;
  totalStudyTimeMinutes: number;
  currentStreak: number;
}

export const useProgress = () => {
  const [lessonCompletions, setLessonCompletions] = useState<LessonCompletion[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isMockUser } = useAuth();
  const { toast } = useToast();
  const activeSessionRef = useRef<string | null>(null);

  const isValidUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  const fetchProgressData = useCallback(async () => {
    if (!user) return;

    // Mock users can't query DB with non-UUID ids
    if (isMockUser || !isValidUuid(user.id)) {
      setStats({
        totalLessonsCompleted: 12,
        totalQuizzesTaken: 5,
        averageQuizScore: 78,
        totalStudyTimeMinutes: 320,
        currentStreak: 3,
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [completionsRes, resultsRes, sessionsRes] = await Promise.all([
        supabase
          .from('lesson_completions')
          .select('*')
          .eq('student_id', user.id),
        supabase
          .from('quiz_results')
          .select('*')
          .eq('student_id', user.id)
          .order('completed_at', { ascending: false }),
        supabase
          .from('study_sessions')
          .select('*')
          .eq('student_id', user.id)
          .order('started_at', { ascending: false }),
      ]);

      if (completionsRes.data) setLessonCompletions(completionsRes.data);
      if (resultsRes.data) setQuizResults(resultsRes.data);
      if (sessionsRes.data) setStudySessions(sessionsRes.data);

      // Calculate stats
      const totalLessonsCompleted = completionsRes.data?.length || 0;
      const totalQuizzesTaken = resultsRes.data?.length || 0;
      const averageQuizScore =
        totalQuizzesTaken > 0
          ? (resultsRes.data?.reduce((sum, r) => sum + Number(r.percentage), 0) || 0) /
            totalQuizzesTaken
          : 0;
      const totalStudyTimeMinutes = Math.round(
        (sessionsRes.data?.reduce((sum, s) => sum + s.duration_seconds, 0) || 0) / 60
      );

      // Calculate streak (simplified - days with activity)
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const hasActivityToday = sessionsRes.data?.some(
        (s) => new Date(s.started_at).toDateString() === today
      );
      const hasActivityYesterday = sessionsRes.data?.some(
        (s) => new Date(s.started_at).toDateString() === yesterday
      );
      const currentStreak = hasActivityToday ? (hasActivityYesterday ? 2 : 1) : 0;

      setStats({
        totalLessonsCompleted,
        totalQuizzesTaken,
        averageQuizScore,
        totalStudyTimeMinutes,
        currentStreak,
      });
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  }, [user, isMockUser]);

  useEffect(() => {
    if (user) {
      fetchProgressData();
    }
  }, [user, fetchProgressData]);

  const completeLesson = async (lessonId: string, timeSpentSeconds: number = 0) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase.from('lesson_completions').upsert(
        {
          student_id: user.id,
          lesson_id: lessonId,
          time_spent_seconds: timeSpentSeconds,
        },
        { onConflict: 'student_id,lesson_id' }
      );

      if (error) throw error;

      await fetchProgressData();
      return { error: null };
    } catch (error) {
      console.error('Error completing lesson:', error);
      return { error: error as Error };
    }
  };

  const submitQuizResult = async (
    quizId: string,
    score: number,
    totalPoints: number,
    answers: Record<string, string>,
    timeTakenSeconds?: number
  ) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;

      const { error } = await supabase.from('quiz_results').insert({
        student_id: user.id,
        quiz_id: quizId,
        score,
        total_points: totalPoints,
        percentage,
        passed: percentage >= 70,
        answers,
        time_taken_seconds: timeTakenSeconds,
      });

      if (error) throw error;

      toast({
        title: percentage >= 70 ? 'Quiz Passed!' : 'Quiz Completed',
        description: `You scored ${Math.round(percentage)}%`,
        variant: percentage >= 70 ? 'default' : 'destructive',
      });

      await fetchProgressData();
      return { error: null };
    } catch (error) {
      console.error('Error submitting quiz:', error);
      return { error: error as Error };
    }
  };

  const startStudySession = async (courseId?: string, lessonId?: string) => {
    if (!user || isMockUser || !isValidUuid(user.id)) return { error: new Error('Mock user'), sessionId: null };

    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .insert({
          student_id: user.id,
          course_id: courseId,
          lesson_id: lessonId,
        })
        .select()
        .single();

      if (error) throw error;

      activeSessionRef.current = data.id;
      return { error: null, sessionId: data.id };
    } catch (error) {
      console.error('Error starting session:', error);
      return { error: error as Error, sessionId: null };
    }
  };

  const endStudySession = async (sessionId?: string) => {
    const id = sessionId || activeSessionRef.current;
    if (!user || !id) return { error: new Error('No active session') };

    try {
      // Get the session start time
      const { data: session } = await supabase
        .from('study_sessions')
        .select('started_at')
        .eq('id', id)
        .single();

      if (!session) throw new Error('Session not found');

      const startTime = new Date(session.started_at).getTime();
      const endTime = Date.now();
      const durationSeconds = Math.round((endTime - startTime) / 1000);

      const { error } = await supabase
        .from('study_sessions')
        .update({
          ended_at: new Date().toISOString(),
          duration_seconds: durationSeconds,
        })
        .eq('id', id);

      if (error) throw error;

      activeSessionRef.current = null;
      await fetchProgressData();
      return { error: null };
    } catch (error) {
      console.error('Error ending session:', error);
      return { error: error as Error };
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return lessonCompletions.some((c) => c.lesson_id === lessonId);
  };

  return {
    lessonCompletions,
    quizResults,
    studySessions,
    stats,
    loading,
    completeLesson,
    submitQuizResult,
    startStudySession,
    endStudySession,
    isLessonCompleted,
    fetchProgressData,
  };
};
