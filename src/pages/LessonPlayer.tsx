import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudySession } from '@/components/learning/StudySessionProvider';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pause, Play, CheckCircle, Volume2, StopCircle, Sparkles, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockCourses } from '@/components/courses';
import { getCourseWithChapters } from '@/components/courses/courseChapters';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

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
    const textRef = useRef<HTMLDivElement>(null);

    // Selection & Explanation State
    const [selection, setSelection] = useState<{ x: number, y: number, text: string } | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [explanationLoading, setExplanationLoading] = useState(false);
    const [explanationText, setExplanationText] = useState("");

    useEffect(() => {
        if (courseId && lessonId) {
            startSession(courseId, lessonId);
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
                        Let's look at a real-world example. Imagine you are building a system that needs to scale. You would apply these principles by ensuring your architecture is modular to handle increased load without breaking.
                        
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

    useEffect(() => {
        const handleSelection = () => {
            const selectionObj = window.getSelection();
            if (!selectionObj || selectionObj.isCollapsed) {
                setSelection(null);
                return;
            }

            const text = selectionObj.toString().trim();
            if (text.length < 5) {
                setSelection(null);
                return;
            }

            // Ensure selection is within our content area
            if (textRef.current && textRef.current.contains(selectionObj.anchorNode)) {
                const range = selectionObj.getRangeAt(0);
                const rect = range.getBoundingClientRect();

                // Show popup near selection
                setSelection({
                    x: rect.left + (rect.width / 2),
                    y: rect.top - 10,
                    text: text
                });
            } else {
                setSelection(null);
            }
        };

        document.addEventListener('selectionchange', handleSelection);
        return () => document.removeEventListener('selectionchange', handleSelection);
    }, []);

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

    const handleExplain = () => {
        if (!selection) return;

        setShowExplanation(true);
        setExplanationLoading(true);

        // Emulate AI delay
        setTimeout(() => {
            setExplanationText(`Here is a simplified explanation for: "${selection.text}"\n\nThis concept refers to a core best practice in the field. When we talk about "${selection.text.substring(0, 15)}...", we essentially mean that you should rely on proven structures rather than reinventing the wheel. This ensures better reliability and maintainability in your projects.`);
            setExplanationLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card fixed top-0 left-0 right-0 z-50">
                <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/courses/${courseId}`)} className="h-8 px-2">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h1 className="font-semibold text-base sm:text-lg line-clamp-1">{lessonTitle || "Lesson Player"}</h1>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                    <div className="font-mono text-lg sm:text-xl font-medium bg-muted px-3 py-1.5 rounded-md flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        {formatTime(sessionDuration)}
                    </div>
                </div>
            </header>

            <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6 relative mt-32 sm:mt-20">
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
                <div className="lg:col-span-1 h-auto lg:h-[calc(100vh-10rem)] flex flex-col">
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
                            <ScrollArea className="flex-1 p-4 relative" >
                                <article ref={textRef} className="prose prose-sm dark:prose-invert max-w-none">
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

                {/* Explain Popup Logic */}
                {selection && (
                    <div
                        className="fixed z-50 transform -translate-x-1/2 -translate-y-full"
                        style={{ top: selection.y, left: selection.x }}
                    >
                        <Button
                            size="sm"
                            className="shadow-xl bg-primary text-primary-foreground animate-in fade-in zoom-in duration-200"
                            onClick={handleExplain}
                        >
                            <Sparkles className="w-3 h-3 mr-2" />
                            Explain Clip?
                        </Button>
                    </div>
                )}
            </main>

            {/* Explanation Dialog */}
            <Dialog open={showExplanation} onOpenChange={setShowExplanation}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            AI Explanation
                        </DialogTitle>
                        <DialogDescription>
                            Breaking down the concept for you.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <div className="bg-muted/50 p-3 rounded-md mb-4 text-xs text-muted-foreground border-l-2 border-primary italic">
                            "{selection?.text}"
                        </div>

                        {explanationLoading ? (
                            <div className="flex flex-col items-center justify-center py-8 space-y-3">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                <p className="text-sm text-foreground/80">Analyzing context...</p>
                            </div>
                        ) : (
                            <div className="text-sm leading-relaxed">
                                {explanationText.split('\n\n').map((text, i) => (
                                    <p key={i} className="mb-2">{text}</p>
                                ))}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button onClick={() => setShowExplanation(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default LessonPlayer;
