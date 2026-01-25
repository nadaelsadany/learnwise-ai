import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudySession } from '@/components/learning/StudySessionProvider';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pause, Play, CheckCircle, Volume2, StopCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockCourses } from '@/components/courses';
import { getCourseWithChapters } from '@/components/courses/courseChapters';

const LessonPlayer = () => {
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();
    const {
        startSession,
        endSession,
        pauseSession,
        resumeSession,
        isTracking,
        sessionDuration,
    } = useStudySession();

    const [isSpeaking, setIsSpeaking] = useState(false);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const [lessonContent, setLessonContent] = useState<string>("");
    const [lessonTitle, setLessonTitle] = useState("");
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (courseId && lessonId) {
            startSession(courseId, lessonId);

            // Fetch mock lesson data
            const course = getCourseWithChapters(courseId, mockCourses);
            if (course) {
                let foundLesson = null;
                for (const chapter of course.chapters) {
                    const l = chapter.lessons.find((l: any) => l.id === lessonId);
                    if (l) {
                        foundLesson = l;
                        break;
                    }
                }

                if (foundLesson) {
                    setLessonTitle(foundLesson.title);
                    setLessonContent(`
                        In this lesson, we will cover the fundamental concepts of ${foundLesson.title}.
                        
                        1. Introduction
                        Understanding the basics is crucial. We will start by defining the core terminology and exploring the history of this topic.
                        
                        2. Key Principles
                        There are three main principles you need to remember:
                        - Principle 1: Consistency is key.
                        - Principle 2: Use established patterns.
                        - Principle 3: Always test your assumptions.
                        
                        3. Practical Application
                        Let's look at a real-world example. Imagine you are building a system that needs to scale. You would apply these principles by ensuring your architecture is modular...
                        
                        4. Conclusion
                        To wrap up, remember that mastery comes with practice. Review the materials and try the exercises.
                    `);
                }
            }
        }
        return () => {
            window.speechSynthesis.cancel();
        };
    }, [courseId, lessonId]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleComplete = async () => {
        window.speechSynthesis.cancel();
        await endSession();
        navigate(`/courses/${courseId}`);
    };

    const toggleSpeech = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        } else {
            const utterance = new SpeechSynthesisUtterance(lessonContent);
            utterance.onend = () => setIsSpeaking(false);
            utteranceRef.current = utterance;
            window.speechSynthesis.speak(utterance);
            setIsSpeaking(true);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b px-6 py-4 flex items-center justify-between bg-card">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate(`/courses/${courseId}`)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Course
                    </Button>
                    <h1 className="font-semibold text-lg">{lessonTitle || "Lesson Player"}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="font-mono text-xl font-medium bg-muted px-4 py-2 rounded-md flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        {formatTime(sessionDuration)}
                    </div>
                </div>
            </header>

            <main className="flex-1 p-6 max-w-7xl mx-auto w-full grid lg:grid-cols-3 gap-6">
                {/* Video Player Section */}
                <div className="lg:col-span-2 space-y-4">
                    <Card className="overflow-hidden bg-black aspect-video relative group">
                        <video
                            ref={videoRef}
                            className="w-full h-full object-cover"
                            controls
                            poster="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1000"
                        >
                            <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </Card>

                    <div className="flex items-center justify-between gap-4">
                        <div className="flex gap-2">
                            {isTracking ? (
                                <Button variant="outline" onClick={pauseSession}>
                                    <Pause className="w-4 h-4 mr-2" /> Pause Session
                                </Button>
                            ) : (
                                <Button variant="outline" onClick={resumeSession}>
                                    <Play className="w-4 h-4 mr-2" /> Resume Session
                                </Button>
                            )}
                        </div>

                        <Button variant="default" onClick={handleComplete}>
                            <CheckCircle className="w-4 h-4 mr-2" /> Complete Lesson
                        </Button>
                    </div>
                </div>

                {/* Text Content / Transcript Section */}
                <div className="lg:col-span-1 h-[calc(100vh-10rem)] flex flex-col">
                    <Card className="flex-1 flex flex-col">
                        <CardContent className="p-0 flex flex-col h-full">
                            <div className="p-4 border-b flex items-center justify-between bg-muted/20">
                                <h3 className="font-semibold">Transcript & Notes</h3>
                                <Button
                                    variant={isSpeaking ? "destructive" : "secondary"}
                                    size="sm"
                                    onClick={toggleSpeech}
                                >
                                    {isSpeaking ? (
                                        <>
                                            <StopCircle className="w-4 h-4 mr-2" /> Stop Reading
                                        </>
                                    ) : (
                                        <>
                                            <Volume2 className="w-4 h-4 mr-2" /> Read Aloud
                                        </>
                                    )}
                                </Button>
                            </div>
                            <ScrollArea className="flex-1 p-4">
                                <article className="prose prose-sm dark:prose-invert max-w-none">
                                    {lessonContent.split('\n').map((paragraph, idx) => (
                                        <p key={idx} className="mb-4 leading-relaxed text-muted-foreground">
                                            {paragraph}
                                        </p>
                                    ))}
                                </article>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default LessonPlayer;
