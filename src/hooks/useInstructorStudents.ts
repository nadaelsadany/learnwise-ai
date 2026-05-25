import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useCourses } from './useCourses';
import { getLearners, Learner } from '@/lib/instructorData';

export interface AggregatedStudent {
    id: string; // student_id
    full_name: string;
    avatar_url: string | null;
    email?: string;
    enrolledCoursesCount: number;
    totalProgress: number;
    averageScore: number;
    lastActive: string | null;
    courses: {
        id: string;
        title: string;
        progress: number;
    }[];
    feedback?: any[];
    isFlagged?: boolean;
}

export const useInstructorStudents = () => {
    const { user } = useAuth();
    const [students, setStudents] = useState<AggregatedStudent[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAllStudents = () => {
        setLoading(true);
        const learners = getLearners();
        // Map Learner to AggregatedStudent
        const mapped: AggregatedStudent[] = learners.map(l => ({
            id: l.id,
            full_name: l.full_name,
            avatar_url: l.avatar_url,
            email: l.email,
            enrolledCoursesCount: l.enrolledCoursesCount,
            totalProgress: l.totalProgress,
            averageScore: l.averageScore,
            lastActive: l.lastActive,
            courses: l.courses.map(c => ({
                id: c.id,
                title: c.title,
                progress: c.progress
            })),
            feedback: l.feedback,
            isFlagged: l.isFlagged
        }));
        setStudents(mapped);
        setLoading(false);
    };

    useEffect(() => {
        fetchAllStudents();
    }, [user]);

    return { students, loading, refreshStudents: fetchAllStudents };
};
