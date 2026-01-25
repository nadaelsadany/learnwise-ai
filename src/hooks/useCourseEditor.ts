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

    return {
        loading,
        analyzing,
        uploading,
        analyzeSyllabus,
        uploadMedia
    };
};
