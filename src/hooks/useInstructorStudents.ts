import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useCourses } from './useCourses';
import { supabase } from '@/integrations/supabase/client';

export interface AggregatedStudent {
    id: string; // student_id
    full_name: string;
    avatar_url: string | null;
    email?: string; // Not always available in profile, but useful if we had it
    enrolledCoursesCount: number;
    totalProgress: number;
    averageScore: number;
    lastActive: string | null;
    courses: {
        id: string;
        title: string;
        progress: number;
    }[];
}

export const useInstructorStudents = () => {
    const { user } = useAuth();
    const { courses: instructorCourses, loading: coursesLoading } = useCourses(); // Assumes this returns all courses for instructor
    const [students, setStudents] = useState<AggregatedStudent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllStudents = async () => {
            if (!user || instructorCourses.length === 0) {
                if (!coursesLoading) setLoading(false);
                return;
            }

            setLoading(true);
            const studentMap = new Map<string, AggregatedStudent>();

            try {
                // Fetch enrollments for all instructor courses
                const courseIds = instructorCourses.map(c => c.id);
                const { data: enrollments, error } = await supabase
                    .from('enrollments')
                    .select(`
            sys_id: id,
            student_id,
            course_id,
            progress_percentage,
            enrolled_at,
            profiles:student_id (
              full_name,
              avatar_url
            )
          `)
                    .in('course_id', courseIds);

                if (error) throw error;

                // Process enrollments
                enrollments?.forEach((enrollment: any) => {
                    const studentId = enrollment.student_id;
                    const profile = enrollment.profiles;

                    if (!studentMap.has(studentId)) {
                        studentMap.set(studentId, {
                            id: studentId,
                            full_name: profile?.full_name || 'Unknown',
                            avatar_url: profile?.avatar_url || null,
                            enrolledCoursesCount: 0,
                            totalProgress: 0,
                            averageScore: 0, // Placeholder
                            lastActive: enrollment.enrolled_at, // Approximate
                            courses: []
                        });
                    }

                    const student = studentMap.get(studentId)!;
                    const course = instructorCourses.find(c => c.id === enrollment.course_id);

                    student.enrolledCoursesCount += 1;
                    student.totalProgress += enrollment.progress_percentage || 0;
                    student.courses.push({
                        id: enrollment.course_id,
                        title: course?.title || 'Unknown Course',
                        progress: enrollment.progress_percentage || 0
                    });

                    // Update last active if newer
                    if (new Date(enrollment.enrolled_at) > new Date(student.lastActive || 0)) {
                        student.lastActive = enrollment.enrolled_at;
                    }
                });

                // Calculate averages
                const aggregated = Array.from(studentMap.values()).map(s => ({
                    ...s,
                    totalProgress: Math.round(s.totalProgress / s.enrolledCoursesCount)
                }));

                setStudents(aggregated);
            } catch (err) {
                console.error("Error fetching all students:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllStudents();
    }, [instructorCourses, user, coursesLoading]);

    return { students, loading };
};
