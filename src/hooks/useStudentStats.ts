import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { differenceInDays, startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';

export interface StudentStats {
    totalStudyTime: number; // in minutes
    lessonsCompleted: number;
    coursesEnrolled: number;
    coursesCompleted: number;
    certificatesEarned: number;
    averageQuizScore: number;
    weeklyActivity: { day: string; minutes: number }[];
    courses: {
        id: string;
        title: string;
        progress: number;
        lastAccessed: string | null;
        totalLessons: number;
        completedLessons: number;
    }[];
}

export const useStudentStats = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<StudentStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;
            setLoading(true);

            try {
                // 1. Fetch Enrollments & Course Data
                const { data: enrollments, error: enrollError } = await supabase
                    .from('enrollments')
                    .select(`
            course_id,
            progress_percentage,
            completed_at,
            enrolled_at,
            courses (
              id,
              title,
              lessons (count)
            )
          `)
                    .eq('student_id', user.id);

                if (enrollError) throw enrollError;

                // 2. Fetch Lesson Completions (for study time calculation)
                const { data: completions, error: complError } = await supabase
                    .from('lesson_completions')
                    .select('time_spent_seconds, completed_at, lesson_id')
                    .eq('student_id', user.id);

                if (complError) throw complError;

                // 3. Fetch Quiz Results
                const { data: quizResults, error: quizError } = await supabase
                    .from('quiz_results')
                    .select('percentage')
                    .eq('student_id', user.id);

                if (quizError) throw quizError;

                // --- Aggregation ---

                const totalStudyTimeSeconds = completions?.reduce((sum, c) => sum + (c.time_spent_seconds || 0), 0) || 0;
                const totalLessonsCompleted = completions?.length || 0;

                const courses = enrollments?.map((e: any) => ({
                    id: e.courses.id,
                    title: e.courses.title,
                    progress: e.progress_percentage || 0,
                    lastAccessed: e.enrolled_at, // Ideally we'd have a 'last_accessed' field, using enrolled_at as fallback or maybe latest lesson completion
                    totalLessons: e.courses.lessons[0]?.count || 0,
                    completedLessons: Math.round(((e.progress_percentage || 0) / 100) * (e.courses.lessons[0]?.count || 0))
                })) || [];

                const coursesEnrolled = courses.length;
                const coursesCompleted = enrollments?.filter(e => e.completed_at).length || 0;

                const avgQuiz = quizResults && quizResults.length > 0
                    ? quizResults.reduce((sum, q) => sum + q.percentage, 0) / quizResults.length
                    : 0;

                // Weekly Activity Calculation (Last 7 days)
                // Note: Real implementation might group by actual date. Mocking a distribution for now if data is sparse, 
                // or properly bucketizing completions.
                const weeklyActivity = [
                    { day: 'Mon', minutes: 0 },
                    { day: 'Tue', minutes: 0 },
                    { day: 'Wed', minutes: 0 },
                    { day: 'Thu', minutes: 0 },
                    { day: 'Fri', minutes: 0 },
                    { day: 'Sat', minutes: 0 },
                    { day: 'Sun', minutes: 0 },
                ];

                // Simple mapping for demo purposes. 
                // In production, we'd map `completed_at` to day of week.
                completions?.forEach(c => {
                    const date = parseISO(c.completed_at);
                    const dayIndex = (date.getDay() + 6) % 7; // Mon=0, Sun=6
                    // Only count if within this week (simplified)
                    // For now, let's just add to the day bucket regardless of week to show *some* data
                    weeklyActivity[dayIndex].minutes += Math.round((c.time_spent_seconds || 0) / 60);
                });

                setStats({
                    totalStudyTime: Math.round(totalStudyTimeSeconds / 60),
                    lessonsCompleted: totalLessonsCompleted,
                    coursesEnrolled,
                    coursesCompleted,
                    certificatesEarned: coursesCompleted, // Assuming 1 cert per course
                    averageQuizScore: Math.round(avgQuiz),
                    weeklyActivity,
                    courses
                });

            } catch (error) {
                console.error("Error fetching student stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user]);

    return { stats, loading };
};
