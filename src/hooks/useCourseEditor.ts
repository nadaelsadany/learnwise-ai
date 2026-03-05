import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Course } from '@/components/courses/types';

export interface Chapter {
    id: string;
    title: string;
    lessons: Lesson[];
}

export interface Lesson {
    id: string;
    title: string;
    type: 'video' | 'text' | 'quiz';
    content?: string;
    videoUrl?: string; // Can be a URL or a path in storage
    duration?: number;
}

export const useCourseEditor = (courseId?: string) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Mock AI Analysis of PDF
    const analyzeSyllabus = async (file: File) => {
        setAnalyzing(true);
        try {
            // simulate delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log("Analyzing file:", file.name);

            // Mock result
            const suggestedStructure = [
                {
                    title: "Introduction",
                    lessons: [
                        { title: "Course Overview", type: "video" },
                        { title: "Key Concepts", type: "text" }
                    ]
                },
                {
                    title: "Core Fundamentals",
                    lessons: [
                        { title: "Deep Dive", type: "video" }
                    ]
                }
            ];

            toast({
                title: "Analysis Complete",
                description: "AI has generated a suggested course structure.",
            });

            return suggestedStructure;
        } catch (error) {
            toast({
                title: "Analysis Failed",
                description: "Could not analyze the PDF.",
                variant: "destructive"
            });
            return null;
        } finally {
            setAnalyzing(false);
        }
    };

    const uploadMedia = async (file: File, path: string) => {
        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${path}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('course-content')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('course-content')
                .getPublicUrl(filePath);

            return data.publicUrl;
        } catch (error) {
            console.error('Upload error:', error);
            toast({
                title: "Upload Failed",
                description: (error as Error).message,
                variant: "destructive"
            });
            return null;
        } finally {
            setUploading(false);
        }
    };

    const saveCurriculum = async (courseId: string, chapters: Chapter[]) => {
        setLoading(true);
        try {
            // 1. Delete existing chapters and lessons for this course to replace them
            // In a real app, you might want a more sophisticated sync, but this is a common "full save" pattern
            const { data: existingChapters } = await supabase
                .from('chapters')
                .select('id')
                .eq('course_id', courseId);

            if (existingChapters && existingChapters.length > 0) {
                const chapterIds = existingChapters.map(c => c.id);
                // Delete lessons first (foreign key)
                await supabase.from('lessons').delete().in('chapter_id', chapterIds);
                // Delete chapters
                await supabase.from('chapters').delete().eq('course_id', courseId);
            }

            // 2. Insert new chapters and lessons
            for (let i = 0; i < chapters.length; i++) {
                const chapter = chapters[i];
                const { data: newChapter, error: chapterError } = await supabase
                    .from('chapters')
                    .insert({
                        course_id: courseId,
                        title: chapter.title,
                        order_index: i
                    })
                    .select()
                    .single();

                if (chapterError) throw chapterError;

                if (chapter.lessons.length > 0) {
                    const lessonsToInsert = chapter.lessons.map((lesson, j) => ({
                        chapter_id: newChapter.id,
                        title: lesson.title,
                        lesson_type: (lesson.type === 'video' ? 'video' : (lesson.type === 'text' ? 'reading' : 'quiz')) as any,
                        content: lesson.content,
                        video_url: lesson.videoUrl,
                        order_index: j
                    }));

                    const { error: lessonsError } = await supabase
                        .from('lessons')
                        .insert(lessonsToInsert);

                    if (lessonsError) throw lessonsError;
                }
            }

            toast({
                title: "Curriculum Saved",
                description: "Your course structure has been updated successfully.",
            });
            return true;
        } catch (error) {
            console.error('Save curriculum error:', error);
            toast({
                title: "Save Failed",
                description: (error as Error).message,
                variant: "destructive"
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    const isValidUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    const fetchCurriculum = async (courseId: string) => {
        if (!isValidUuid(courseId)) {
            return [];
        }
        setLoading(true);
        try {
            const { data: chaptersData, error: chaptersError } = await supabase
                .from('chapters')
                .select('*')
                .eq('course_id', courseId)
                .order('order_index');

            if (chaptersError) throw chaptersError;

            const chaptersWithLessons = await Promise.all(
                (chaptersData || []).map(async (chapter) => {
                    const { data: lessonsData, error: lessonsError } = await supabase
                        .from('lessons')
                        .select('*')
                        .eq('chapter_id', chapter.id)
                        .order('order_index');

                    if (lessonsError) throw lessonsError;

                    return {
                        id: chapter.id,
                        title: chapter.title,
                        lessons: (lessonsData || []).map(l => ({
                            id: l.id,
                            title: l.title,
                            type: (l.lesson_type === 'reading' ? 'text' : (l.lesson_type === 'video' ? 'video' : 'quiz')) as any,
                            content: l.content || "",
                            videoUrl: l.video_url || ""
                        }))
                    };
                })
            );

            return chaptersWithLessons;
        } catch (error) {
            console.error('Fetch curriculum error:', error);
            toast({
                title: "Fetch Failed",
                description: "Could not load course curriculum.",
                variant: "destructive"
            });
            return [];
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        analyzing,
        uploading,
        analyzeSyllabus,
        uploadMedia,
        saveCurriculum,
        fetchCurriculum
    };
};
