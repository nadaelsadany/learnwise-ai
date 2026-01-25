import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Course {
  id: string;
  instructor_id: string;
  title: string;
  description: string | null;
  category: string | null;
  level: string;
  duration_hours: number;
  image_url: string | null;
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  enrolled_at: string;
  completed_at: string | null;
  progress_percentage: number;
}

export interface CourseWithEnrollment extends Course {
  enrollment?: Enrollment;
  enrollmentCount?: number;
}

export const useCourses = () => {
  const [courses, setCourses] = useState<CourseWithEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, role } = useAuth();
  const { toast } = useToast();

  const fetchPublishedCourses = async () => {
    setLoading(true);
    try {
      const { data: coursesData, error } = await supabase
        .from('courses')
        .select('*')
        .eq('status', 'published');

      if (error) throw error;

      // If applicant, also fetch their enrollments
      if (role === 'applicant' && user) {
        const { data: enrollments } = await supabase
          .from('enrollments')
          .select('*')
          .eq('student_id', user.id);

        const coursesWithEnrollment = (coursesData || []).map((course) => ({
          ...course,
          enrollment: enrollments?.find((e) => e.course_id === course.id),
        }));

        setCourses(coursesWithEnrollment);
      } else {
        setCourses(coursesData || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: 'Error',
        description: 'Failed to load courses',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructorCourses = async () => {
    if (!user || role !== 'instructor') return;

    setLoading(true);
    try {
      const { data: coursesData, error } = await supabase
        .from('courses')
        .select('*')
        .eq('instructor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch enrollment counts for each course
      const coursesWithCounts = await Promise.all(
        (coursesData || []).map(async (course) => {
          const { count } = await supabase
            .from('enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', course.id);

          return { ...course, enrollmentCount: count || 0 };
        })
      );

      setCourses(coursesWithCounts);
    } catch (error) {
      console.error('Error fetching instructor courses:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your courses',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    if (!user || role !== 'applicant') return;

    setLoading(true);
    try {
      const { data: enrollments, error: enrollError } = await supabase
        .from('enrollments')
        .select('*, courses(*)')
        .eq('student_id', user.id);

      if (enrollError) throw enrollError;

      const enrolledCourses = (enrollments || []).map((e) => ({
        ...(e.courses as Course),
        enrollment: {
          id: e.id,
          student_id: e.student_id,
          course_id: e.course_id,
          enrolled_at: e.enrolled_at,
          completed_at: e.completed_at,
          progress_percentage: e.progress_percentage,
        },
      }));

      setCourses(enrolledCourses);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      toast({
        title: 'Error',
        description: 'Failed to load enrolled courses',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const enrollInCourse = async (courseId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase.from('enrollments').insert({
        student_id: user.id,
        course_id: courseId,
      });

      if (error) throw error;

      toast({
        title: 'Enrolled!',
        description: 'You have successfully enrolled in this course',
      });

      // Refresh courses
      await fetchPublishedCourses();

      return { error: null };
    } catch (error) {
      toast({
        title: 'Enrollment Failed',
        description: (error as Error).message,
        variant: 'destructive',
      });
      return { error: error as Error };
    }
  };

  const createCourse = async (courseData: Partial<Course>) => {
    if (!user || role !== 'instructor') {
      return { error: new Error('Not authorized'), data: null };
    }

    try {
      const { data, error } = await supabase
        .from('courses')
        .insert({
          instructor_id: user.id,
          title: courseData.title || 'Untitled Course',
          description: courseData.description,
          category: courseData.category,
          level: courseData.level || 'beginner',
          duration_hours: courseData.duration_hours || 0,
          image_url: courseData.image_url,
          status: 'draft',
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Course Created',
        description: 'Your new course has been created as a draft',
      });

      return { error: null, data };
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create course',
        variant: 'destructive',
      });
      return { error: error as Error, data: null };
    }
  };

  const updateCourse = async (courseId: string, updates: Partial<Course>) => {
    if (!user || role !== 'instructor') {
      return { error: new Error('Not authorized') };
    }

    try {
      const { error } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', courseId)
        .eq('instructor_id', user.id);

      if (error) throw error;

      toast({
        title: 'Course Updated',
        description: 'Your changes have been saved',
      });

      await fetchInstructorCourses();

      return { error: null };
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update course',
        variant: 'destructive',
      });
      return { error: error as Error };
    }
  };

  const publishCourse = async (courseId: string) => {
    return updateCourse(courseId, { status: 'published' });
  };

  const archiveCourse = async (courseId: string) => {
    return updateCourse(courseId, { status: 'archived' });
  };

  const deleteCourse = async (courseId: string) => {
    if (!user || role !== 'instructor') {
      return { error: new Error('Not authorized') };
    }

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId)
        .eq('instructor_id', user.id);

      if (error) throw error;

      toast({
        title: 'Course Deleted',
        description: 'The course has been permanently deleted',
      });

      await fetchInstructorCourses();

      return { error: null };
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete course',
        variant: 'destructive',
      });
      return { error: error as Error };
    }
  };

  return {
    courses,
    loading,
    fetchPublishedCourses,
    fetchInstructorCourses,
    fetchEnrolledCourses,
    enrollInCourse,
    createCourse,
    updateCourse,
    publishCourse,
    archiveCourse,
    deleteCourse,
  };
};
