import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudySession } from '@/components/learning/StudySessionProvider';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pause, Play, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
        activeLessonId
    } = useStudySession();

    useEffect(() => {
        if (courseId && lessonId) {
            startSession(courseId, lessonId);
        }
        return () => {
            // Optional: Pause on unmount instead of end?
            // For now let's not auto-end so navigation doesn't kill session immediately if accidental
        };
    }, [courseId, lessonId]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleComplete = async () => {
        await endSession();
        navigate(`/courses/${courseId}`);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b px-6 py-4 flex items-center justify-between bg-card">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate(`/courses/${courseId}`)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Course
                    </Button>
                    <h1 className="font-semibold text-lg">Lesson Player</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="font-mono text-xl font-medium bg-muted px-4 py-2 rounded-md">
                        {formatTime(sessionDuration)}
                    </div>
                </div>
            </header>

            <main className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-6">
                <Card className="aspect-video bg-black flex items-center justify-center text-white">
                    <p>Video Player Placeholder</p>
                </Card>

                <div className="flex items-center justify-center gap-4">
                    {isTracking ? (
                        <Button variant="outline" size="lg" onClick={pauseSession}>
                            <Pause className="w-5 h-5 mr-2" />
                            Pause Session
                        </Button>
                    ) : (
                        <Button variant="outline" size="lg" onClick={resumeSession}>
                            <Play className="w-5 h-5 mr-2" />
                            Resume Session
                        </Button>
                    )}

                    <Button variant="default" size="lg" onClick={handleComplete}>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Complete Lesson
                    </Button>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <h2 className="text-xl font-semibold mb-4">Lesson Content</h2>
                        <p className="text-muted-foreground">
                            This is where the text content or additional resources for lesson {lessonId} would go.
                        </p>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default LessonPlayer;
