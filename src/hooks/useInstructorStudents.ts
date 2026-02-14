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

    const dummyStudents: AggregatedStudent[] = [
        {
            id: "1",
            full_name: "Alice Johnson",
            avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
            enrolledCoursesCount: 2,
            totalProgress: 75,
            averageScore: 88,
            lastActive: new Date().toISOString(),
            courses: [
                { id: "c1", title: "Introduction to React", progress: 80 },
                { id: "c2", title: "Advanced TypeScript", progress: 70 }
            ]
        },
        {
            id: "2",
            full_name: "Bob Smith",
            avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
            enrolledCoursesCount: 1,
            totalProgress: 30,
            averageScore: 65,
            lastActive: new Date(Date.now() - 86400000 * 2).toISOString(),
            courses: [
                { id: "c1", title: "Introduction to React", progress: 30 }
            ]
        },
        {
            id: "3",
            full_name: "Charlie Brown",
            avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
            enrolledCoursesCount: 3,
            totalProgress: 95,
            averageScore: 92,
            lastActive: new Date(Date.now() - 3600000).toISOString(),
            courses: [
                { id: "c1", title: "Introduction to React", progress: 100 },
                { id: "c3", title: "UI/UX Design Fundamentals", progress: 90 },
                { id: "c4", title: "Web Accessibility", progress: 95 }
            ]
        },
        {
            id: "4",
            full_name: "Diana Prince",
            avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana",
            enrolledCoursesCount: 2,
            totalProgress: 45,
            averageScore: 78,
            lastActive: new Date(Date.now() - 86400000 * 5).toISOString(),
            courses: [
                { id: "c2", title: "Advanced TypeScript", progress: 50 },
                { id: "c3", title: "UI/UX Design Fundamentals", progress: 40 }
            ]
        },
        {
            id: "5",
            full_name: "Evan Wright",
            avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Evan",
            enrolledCoursesCount: 1,
            totalProgress: 10,
            averageScore: 0,
            lastActive: null,
            courses: [
                { id: "c1", title: "Introduction to React", progress: 10 }
            ]
        }
    ];

    useEffect(() => {
        const fetchAllStudents = async () => {
            // Simulate loading
            setLoading(true);
            setTimeout(() => {
                setStudents(dummyStudents);
                setLoading(false);
            }, 800);

            /* 
            // Original Real Data Fetching Logic (Commented out for now to show dummy data)
            if (!user || instructorCourses.length === 0) {
                if (!coursesLoading) setLoading(false);
                return;
            }

            setLoading(true);
            const studentMap = new Map<string, AggregatedStudent>();

            try {
                // ... (existing logic)
            } catch (err) {
                console.error("Error fetching all students:", err);
            } finally {
                setLoading(false);
            }
            */
        };

        fetchAllStudents();
    }, [instructorCourses, user, coursesLoading]);

    return { students, loading };
};
