import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface EnrolledStudent {
  id: string;
  student_id: string;
  course_id: string;
  enrolled_at: string;
  completed_at: string | null;
  progress_percentage: number;
  profile?: {
    full_name: string | null;
    avatar_url: string | null;
    email?: string;
  };
}

export interface StudentProgress {
  lessonsCompleted: number;
  quizzesTaken: number;
  averageScore: number;
  totalStudyTime: number;
}

export const useEnrolledStudents = (courseId?: string) => {
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const { role } = useAuth();

  const fetchEnrolledStudents = useCallback(async (targetCourseId?: string) => {
    const id = targetCourseId || courseId;
    if (!id || role !== 'instructor') return;

    setLoading(true);
    try {
      const { data: enrollments, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('course_id', id)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;

      // Fetch profiles for each student
      const studentsWithProfiles = await Promise.all(
        (enrollments || []).map(async (enrollment) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('user_id', enrollment.student_id)
            .maybeSingle();

          return {
            ...enrollment,
            profile: profile || undefined,
          };
        })
      );

      setStudents(studentsWithProfiles);
    } catch (error) {
      console.error('Error fetching enrolled students:', error);
    } finally {
      setLoading(false);
    }
  }, [courseId, role]);

  const getStudentProgress = useCallback(async (studentId: string): Promise<StudentProgress> => {
    try {
      const [completions, results, sessions] = await Promise.all([
        supabase
          .from('lesson_completions')
          .select('*', { count: 'exact', head: true })
          .eq('student_id', studentId),
        supabase
          .from('quiz_results')
          .select('percentage')
          .eq('student_id', studentId),
        supabase
          .from('study_sessions')
          .select('duration_seconds')
          .eq('student_id', studentId),
      ]);

      const quizScores = results.data?.map((r) => Number(r.percentage)) || [];
      const averageScore = quizScores.length > 0
        ? quizScores.reduce((a, b) => a + b, 0) / quizScores.length
        : 0;

      const totalStudyTime = (sessions.data?.reduce((sum, s) => sum + s.duration_seconds, 0) || 0) / 60;

      return {
        lessonsCompleted: completions.count || 0,
        quizzesTaken: quizScores.length,
        averageScore,
        totalStudyTime,
      };
    } catch (error) {
      console.error('Error fetching student progress:', error);
      return {
        lessonsCompleted: 0,
        quizzesTaken: 0,
        averageScore: 0,
        totalStudyTime: 0,
      };
    }
  }, []);

  return {
    students,
    loading,
    fetchEnrolledStudents,
    getStudentProgress,
  };
};
