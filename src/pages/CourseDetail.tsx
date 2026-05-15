import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ApplicantSidebar } from "@/components/layout/ApplicantSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { mockCourses, categoryLabels, levelLabels } from "@/components/courses";
import { getCourseWithChapters, CourseWithChapters } from "@/components/courses/courseChapters";
import { ChapterAccordion } from "@/components/courses/ChapterAccordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useCourses } from "@/hooks/useCourses";
import { useCourseEditor } from "@/hooks/useCourseEditor";
import { Loader2 } from "lucide-react";
import {
    ArrowLeft,
    Clock,
    BookOpen,
    Star,
    Users,
    CheckCircle,
    Play,
    Target,
    AlertCircle,
    CalendarDays,
    Paperclip,
    GraduationCap,
    MessageSquare,
    Send,
    Reply,
    Sparkles,
    Brain,
    FileQuestion,
    X,
    Shield,
    Camera,
    Upload,
    FileText,
    ExternalLink,
    Timer
} from "lucide-react";
import { GenerationModal } from "@/components/courses/GenerationModal";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CourseDetail = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    
    const isMockCourse = courseId ? !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(courseId) : false;

    const [openChapterId, setOpenChapterId] = useState<string | null>(null);
    const [courseData, setCourseData] = useState<CourseWithChapters | null>(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);

    const { getCourseById, enrollInCourse } = useCourses();
    const { fetchCurriculum } = useCourseEditor();
    
    const [selectedThread, setSelectedThread] = useState<any>(null);
    const [isAskModalOpen, setIsAskModalOpen] = useState(false);
    const [newQuestion, setNewQuestion] = useState({ title: "", content: "" });

    // AI Generation States
    const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>([]);
    const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
    const [generationType, setGenerationType] = useState<"quiz" | "mock">("quiz");
    
    // Certification & Exam States
    const [certificationMode, setCertificationMode] = useState<"internal" | "external" | "none">("internal");
    const [examStatus, setExamStatus] = useState<"not_started" | "pending" | "approved" | "rejected">("not_started");
    const [isExamModalOpen, setIsExamModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [externalExamDate, setExternalExamDate] = useState("May 29, 2024");

    const toggleChapterSelection = (chapterId: string, selected: boolean) => {
        setSelectedChapterIds(prev => 
            selected ? [...prev, chapterId] : prev.filter(id => id !== chapterId)
        );
    };

    const handleIndividualGenerate = (chapterId: string, type: "quiz" | "mock") => {
        setSelectedChapterIds([chapterId]);
        setGenerationType(type);
        setIsGenerationModalOpen(true);
    };

    const selectedChaptersData = useMemo(() => {
        if (!courseData) return [];
        return courseData.chapters
            .filter(ch => selectedChapterIds.includes(ch.id))
            .map(ch => ({ id: ch.id, title: ch.title }));
    }, [selectedChapterIds, courseData]);

    const pathName = useMemo(() => {
        if (['c1', 'c2', 'c3', 'c4', 'c5', 'c6'].includes(courseId || "")) return "Junior QA Engineer Path";
        if (['a1', 'a2', 'a3'].includes(courseId || "")) return "Automated Testing Specialist";
        return null;
    }, [courseId]);

    useEffect(() => {
        const loadCourse = async () => {
            if (!courseId) return;
            setLoading(true);

            // 1. Try mock data first (for legacy compatibility)
            const mock = getCourseWithChapters(courseId, mockCourses);
            if (mock) {
                setCourseData({
                    ...mock,
                    instructors: [
                        { id: "inst-1", name: "Alex Thompson", role: "Lead Instructor" },
                        { id: "inst-2", name: "Sarah Mitchell", role: "QA Expert" },
                        { id: "inst-3", name: "James Wilson", role: "Automation Specialist" }
                    ],
                    communicationEnabled: true
                } as any);
                setLoading(false);
                return;
            }

            // 2. Try Supabase
            const { course, error } = await getCourseById(courseId);
            if (course) {
                const curriculum = await fetchCurriculum(courseId);

                // Map DB structure to CourseWithChapters format
                const mappedChapters = (curriculum || []).map((ch, idx) => ({
                    id: ch.id,
                    courseId: courseId,
                    number: idx + 1,
                    title: ch.title,
                    description: "", // Not in DB
                    duration: "45 min", // Mock
                    isCompleted: false, // Need enrollment data for this
                    isLocked: false,
                    lessons: ch.lessons.map((l, lIdx) => ({
                        id: l.id,
                        chapterId: ch.id,
                        number: lIdx + 1,
                        title: l.title,
                        type: l.type,
                        duration: "10 min",
                        isCompleted: false,
                        isLocked: false,
                        content: l.content
                    }))
                }));

                setCourseData({
                    id: course.id,
                    title: course.title,
                    description: course.description || "",
                    category: (course.category || "certification") as any,
                    level: (course.level || "beginner") as any,
                    duration: `${course.duration_hours || 10} hours`,
                    lessons: mappedChapters.reduce((sum, ch) => sum + ch.lessons.length, 0),
                    instructors: [
                        { id: "inst-1", name: "Alex Thompson", role: "Lead Instructor" },
                        { id: "inst-2", name: "Sarah Mitchell", role: "QA Expert" },
                        { id: "inst-3", name: "James Wilson", role: "Automation Specialist" }
                    ],
                    communicationEnabled: true,
                    objectives: ["Master the course content", "Complete all practical exercises"],
                    prerequisites: ["None required"],
                    attachmentUrl: course.attachment_url || undefined,
                    chapters: mappedChapters,
                    studentsEnrolled: 0, // Default for new DB courses
                    rating: 0, // Default
                    progress: 0, // Default
                    enrolled: false // Default
                });
            }
            setLoading(false);
        };

        loadCourse();

        // Simulate random certification mode for mock courses
        if (isMockCourse) {
            if (courseId === 'c1') setCertificationMode("external");
            else if (courseId === 'c2') setCertificationMode("none");
            else setCertificationMode("internal");
        }
    }, [courseId, isMockCourse]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!courseData) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Course Not Found</h2>
                    <p className="text-muted-foreground mb-4">This course doesn't exist or has been removed.</p>
                    <Button onClick={() => navigate("/courses")}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Courses
                    </Button>
                </div>
            </div>
        );
    }

    const course = courseData;
    const totalLessons = (course.chapters || []).reduce((sum, ch) => sum + (ch.lessons || []).length, 0);
    const completedLessons = (course.chapters || []).reduce(
        (sum, ch) => sum + (ch.lessons || []).filter(l => l.isCompleted).length,
        0
    );
    const completedChapters = (course.chapters || []).filter(ch => ch.isCompleted).length;

    const handleChapterToggle = (chapterId: string) => {
        setOpenChapterId(prev => prev === chapterId ? null : chapterId);
    };

    const handleLessonClick = (lessonId: string) => {
        navigate(`/courses/${courseId}/lessons/${lessonId}`);
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case "beginner": return "bg-success/10 text-success border-success/20";
            case "intermediate": return "bg-warning/10 text-warning border-warning/20";
            case "advanced": return "bg-destructive/10 text-destructive border-destructive/20";
            default: return "bg-muted text-muted-foreground";
        }
    };

    // Find the next incomplete lesson
    const getNextLesson = () => {
        if (!course.chapters) return null;
        for (const chapter of course.chapters) {
            if (chapter.isLocked) continue;
            const nextLesson = (chapter.lessons || []).find(l => !l.isCompleted && !l.isLocked);
            if (nextLesson) return { chapter, lesson: nextLesson };
        }
        return null;
    };

    const nextLesson = getNextLesson();



    const handleEnroll = async () => {
        if (!courseId) return;
        if (isMockCourse) {
            // For mock courses, just update local state
            setCourseData(prev => prev ? { ...prev, enrolled: true, progress: 0 } : null);
            return;
        }
        setEnrolling(true);
        const { error } = await enrollInCourse(courseId);
        if (!error) {
            const { course } = await getCourseById(courseId);
            if (course) {
                setCourseData(prev => prev ? {
                    ...prev,
                    enrolled: true,
                    progress: (course as any).enrollment?.progress_percentage || 0
                } : null);
            }
        }
        setEnrolling(false);
    };

    return (
        <div className="min-h-screen bg-background">
            <ApplicantSidebar onCollapse={setSidebarCollapsed} />
            <Header sidebarCollapsed={sidebarCollapsed} userRole="Student" />

            <main
                className={cn(
                    "pt-20 pb-8 px-6 transition-all duration-300",
                    sidebarCollapsed ? "ml-20" : "ml-64"
                )}
            >
                <div className="max-w-5xl mx-auto space-y-6">
                    {/* Back Button */}
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/courses")}
                        className="gap-2 -ml-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Courses
                    </Button>

                    {/* Course Header Card */}
                    <section className="rounded-2xl overflow-hidden bg-card border border-border/50 shadow-soft animate-slide-up">
                        {/* Banner */}
                        <div className={cn(
                            "h-48 relative",
                            course.category === "certification" && "gradient-primary",
                            course.category === "automation" && "gradient-accent",
                            course.category === "agile" && "gradient-success",
                            course.category === "testing-techniques" && "bg-gradient-to-br from-amber-500 to-orange-600",
                            course.category === "tools" && "bg-gradient-to-br from-cyan-500 to-blue-600",
                            course.category === "soft-skills" && "bg-gradient-to-br from-pink-500 to-rose-600",
                        )}>
                            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-6 right-6">
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <Badge className="bg-white/20 text-white border-0">
                                        {categoryLabels[course.category]}
                                    </Badge>
                                    <Badge variant="outline" className={cn("border-white/30 text-white", getLevelColor(course.level))}>
                                        {levelLabels[course.level]}
                                    </Badge>
                                </div>
                                <h1 className="text-3xl font-bold text-white">{course.title}</h1>
                                {pathName && (
                                    <div className="mt-2 space-y-1 animate-fade-in">
                                        <p className="text-white/90 text-sm font-medium">Part of: {pathName}</p>
                                        <p className="text-white/60 text-[11px] font-medium uppercase tracking-wider">Assigned by Nafea</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Course Info */}
                        <div className="p-6">
                            <p className="text-muted-foreground mb-6">{course.description}</p>

                            {/* Stats Row */}
                            <div className="flex flex-wrap items-center gap-6 mb-6">
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 fill-warning text-warning" />
                                    <span className="font-semibold">{course.rating}</span>
                                    <span className="text-muted-foreground text-sm">rating</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Users className="w-5 h-5" />
                                    <span>{course.studentsEnrolled.toLocaleString()} students</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="w-5 h-5" />
                                    <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <BookOpen className="w-5 h-5" />
                                    <span>{totalLessons} lessons</span>
                                </div>
                                {course.startDate && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <CalendarDays className="w-5 h-5" />
                                        <span>
                                            {new Date(course.startDate).toLocaleDateString()}
                                            {course.endDate ? ` - ${new Date(course.endDate).toLocaleDateString()}` : ''}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Progress Section */}
                            <div className="p-4 rounded-xl bg-muted/30 mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">Your Progress</span>
                                    <span className="text-sm text-muted-foreground">
                                        {completedLessons} of {totalLessons} lessons completed
                                    </span>
                                </div>
                                <Progress value={course.progress} className="h-3 mb-2" />
                                <div className="flex items-center justify-between text-sm mb-4">
                                    <span className="text-muted-foreground">
                                        {completedChapters} of {course.chapters?.length || 0} chapters done
                                    </span>
                                    <span className="font-semibold text-primary">{course.progress}%</span>
                                </div>

                                {/* Task 2: Completion Checklist */}
                                <div className="pt-4 border-t border-border/20 space-y-3">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">To complete this course:</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            {course.progress === 100 ? (
                                                <CheckCircle className="w-4 h-4 text-success" />
                                            ) : (
                                                <div className="w-4 h-4 rounded-full border-2 border-muted" />
                                            )}
                                            <span className={cn(course.progress === 100 ? "text-foreground" : "text-muted-foreground")}>
                                                Complete all {totalLessons} lessons
                                            </span>
                                        </div>
                                        
                                        {certificationMode !== "none" && (
                                            <div className="flex items-center gap-2 text-sm">
                                                {examStatus === "approved" ? (
                                                    <CheckCircle className="w-4 h-4 text-success" />
                                                ) : (
                                                    <div className="w-4 h-4 rounded-full border-2 border-muted" />
                                                )}
                                                <span className={cn(examStatus === "approved" ? "text-foreground" : "text-muted-foreground")}>
                                                    {certificationMode === "internal" ? "Pass final course exam" : "Submit external certificate"}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-4">
                                <Button
                                    size="lg"
                                    className="gap-2 px-8 shadow-glow-primary"
                                    onClick={() => {
                                        if (!course.enrolled) {
                                            handleEnroll();
                                        } else if (nextLesson) {
                                            navigate(`/courses/${course.id}/lessons/${nextLesson.lesson.id}`);
                                        }
                                    }}
                                    disabled={enrolling}
                                >
                                    {enrolling ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Play className="w-5 h-5" />
                                    )}
                                    {course.progress > 0 ? "Continue Learning" : "Start Course"}
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    {nextLesson ? `Chapter ${nextLesson.chapter.number} • ${nextLesson.lesson.duration}` : "Course completed"}
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Two Column Layout */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Main Content - Chapters */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Course Content */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Course Content</h2>
                                <div className="space-y-3">
                                    {course.chapters.map((chapter) => (
                                        <ChapterAccordion
                                            key={chapter.id}
                                            chapter={chapter}
                                            isOpen={openChapterId === chapter.id}
                                            onToggle={() => handleChapterToggle(chapter.id)}
                                            onLessonClick={handleLessonClick}
                                            isSelected={selectedChapterIds.includes(chapter.id)}
                                            onSelect={(selected) => toggleChapterSelection(chapter.id, selected)}
                                            onGenerate={(type) => handleIndividualGenerate(chapter.id, type)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Floating Action Bar */}
                            {selectedChapterIds.length > 0 && (
                                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <div className="bg-card/80 backdrop-blur-md border border-primary/20 shadow-glow-primary rounded-2xl px-6 py-4 flex items-center gap-6 min-w-[400px]">
                                        <div className="flex items-center gap-3 pr-6 border-r border-border/50">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {selectedChapterIds.length}
                                            </div>
                                            <div className="text-sm">
                                                <p className="font-semibold leading-none">Chapters</p>
                                                <p className="text-xs text-muted-foreground mt-1">selected for AI</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Button 
                                                size="sm" 
                                                className="gradient-primary shadow-glow-primary gap-2"
                                                onClick={() => {
                                                    setGenerationType("quiz");
                                                    setIsGenerationModalOpen(true);
                                                }}
                                            >
                                                <Sparkles className="w-4 h-4" />
                                                Generate Practice
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                                                onClick={() => setSelectedChapterIds([])}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Generation Modal */}
                            <GenerationModal 
                                isOpen={isGenerationModalOpen}
                                onClose={() => setIsGenerationModalOpen(false)}
                                selectedChapters={selectedChaptersData}
                                initialType={generationType}
                            />

                            {/* Community Section */}
                            <div className="space-y-4 pt-6 border-t border-border/50">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5 text-primary" />
                                        Community Discussion
                                    </h2>
                                    
                                    <Dialog open={isAskModalOpen} onOpenChange={setIsAskModalOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="text-primary border-primary/20">
                                                Ask a question
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[500px]">
                                            <DialogHeader>
                                                <DialogTitle>Ask a Question</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Question Title</label>
                                                    <Input 
                                                        placeholder="What is your question about?" 
                                                        value={newQuestion.title}
                                                        onChange={(e) => setNewQuestion({...newQuestion, title: e.target.value})}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Details</label>
                                                    <Textarea 
                                                        placeholder="Provide more context..." 
                                                        rows={4}
                                                        value={newQuestion.content}
                                                        onChange={(e) => setNewQuestion({...newQuestion, content: e.target.value})}
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setIsAskModalOpen(false)}>Cancel</Button>
                                                <Button onClick={() => setIsAskModalOpen(false)}>Post Question</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                <div className="space-y-3">
                                    {[
                                        { 
                                            id: 1, 
                                            title: "Best practices for Playwright selectors?", 
                                            author: "Sarah Connor", 
                                            replies: [
                                                { id: 101, user: "Alex Thompson", content: "I recommend using data-testid attributes whenever possible for stability.", role: "Instructor", time: "2h ago" },
                                                { id: 102, user: "John Smith", content: "Thanks! What about CSS selectors?", role: "Student", time: "1h ago" }
                                            ], 
                                            instructorReplied: true 
                                        },
                                        { 
                                            id: 2, 
                                            title: "How to handle multi-tab testing?", 
                                            author: "John Smith", 
                                            replies: [
                                                { id: 201, user: "Sarah Mitchell", content: "Use the browserContext.waitForEvent('page') method.", role: "Instructor", time: "5h ago" }
                                            ], 
                                            instructorReplied: true 
                                        },
                                        { 
                                            id: 3, 
                                            title: "CI/CD integration with GitHub Actions", 
                                            author: "Kyle Reese", 
                                            replies: [], 
                                            instructorReplied: false 
                                        }
                                    ].map((thread) => (
                                        <div 
                                            key={thread.id} 
                                            onClick={() => setSelectedThread(thread)}
                                            className="p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="space-y-1">
                                                    <h3 className="font-medium group-hover:text-primary transition-colors">{thread.title}</h3>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                        <span>By {thread.author}</span>
                                                        <span>•</span>
                                                        <span>{thread.replies.length} replies</span>
                                                    </div>
                                                </div>
                                                {thread.instructorReplied && (
                                                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] py-0">
                                                        Instructor Replied
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Thread Detail Dialog */}
                                <Dialog open={!!selectedThread} onOpenChange={(open) => !open && setSelectedThread(null)}>
                                    <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
                                        {selectedThread && (
                                            <>
                                                <DialogHeader>
                                                    <DialogTitle>{selectedThread.title}</DialogTitle>
                                                    <p className="text-xs text-muted-foreground">Started by {selectedThread.author}</p>
                                                </DialogHeader>
                                                
                                                <div className="flex-1 overflow-y-auto py-6 space-y-6">
                                                    {selectedThread.replies.length > 0 ? (
                                                        selectedThread.replies.map((reply: any) => (
                                                            <div key={reply.id} className={cn(
                                                                "flex gap-4 p-4 rounded-xl",
                                                                reply.role === "Instructor" ? "bg-primary/5 border border-primary/10" : "bg-muted/30"
                                                            )}>
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarFallback className={reply.role === "Instructor" ? "bg-primary text-white" : ""}>
                                                                        {reply.user[0]}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="space-y-1 flex-1">
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-sm font-semibold">{reply.user}</span>
                                                                            {reply.role === "Instructor" && (
                                                                                <Badge className="bg-primary text-white text-[9px] h-4 px-1">Instructor</Badge>
                                                                            )}
                                                                        </div>
                                                                        <span className="text-[10px] text-muted-foreground">{reply.time}</span>
                                                                    </div>
                                                                    <p className="text-sm text-foreground/80">{reply.content}</p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-center py-8 text-muted-foreground italic text-sm">
                                                            No replies yet. Be the first to help!
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="pt-4 border-t border-border/50">
                                                    <div className="flex gap-3">
                                                        <Textarea 
                                                            placeholder="Write a reply..." 
                                                            className="min-h-[80px] text-sm"
                                                        />
                                                        <Button size="icon" className="shrink-0 h-[80px] gradient-primary">
                                                            <Send className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </DialogContent>
                                </Dialog>
                                <Button 
                                    variant="ghost" 
                                    className="w-full text-muted-foreground text-sm hover:text-primary mt-2" 
                                    onClick={() => navigate(`/courses/${courseId}/discussions`)}
                                >
                                    View all questions
                                </Button>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-4">
                            {/* Task 1: Certification Requirement Section */}
                            <Card className="rounded-2xl bg-card border border-border/50 shadow-soft overflow-hidden">
                                <div className="p-5 border-b border-border/50 bg-muted/30">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <GraduationCap className="w-5 h-5 text-primary" />
                                        Certification Requirement
                                    </h3>
                                </div>
                                <div className="p-5 space-y-4">
                                    {certificationMode === "internal" && (
                                        <>
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-3 text-sm">
                                                    <CheckCircle className={cn("w-4 h-4 shrink-0 mt-0.5", course.progress === 100 ? "text-success" : "text-muted-foreground/30")} />
                                                    <span className={cn(course.progress === 100 ? "text-foreground" : "text-muted-foreground")}>Complete course modules</span>
                                                </div>
                                                <div className="flex items-start gap-3 text-sm">
                                                    <CheckCircle className={cn("w-4 h-4 shrink-0 mt-0.5", examStatus === "approved" ? "text-success" : "text-muted-foreground/30")} />
                                                    <span className={cn(examStatus === "approved" ? "text-foreground" : "text-muted-foreground")}>Pass final exam</span>
                                                </div>
                                            </div>
                                            <Button 
                                                className="w-full gap-2 gradient-primary shadow-glow-primary" 
                                                disabled={course.progress < 100 || examStatus === "approved"}
                                                onClick={() => setIsExamModalOpen(true)}
                                            >
                                                <FileQuestion className="w-4 h-4" />
                                                {examStatus === "approved" ? "Exam Passed" : "Start Exam"}
                                            </Button>
                                            {course.progress < 100 && (
                                                <p className="text-[10px] text-center text-muted-foreground">Complete all lessons to unlock the exam</p>
                                            )}
                                        </>
                                    )}

                                    {certificationMode === "external" && (
                                        <>
                                            <div className="p-3 rounded-xl bg-muted/30 space-y-2 border border-border/50">
                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Target Certification</p>
                                                <p className="text-sm font-bold">ISTQB Foundation Level</p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <CalendarDays className="w-3.5 h-3.5" />
                                                    Exam Date: {externalExamDate}
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-muted-foreground">Submission Status</span>
                                                    <Badge variant="outline" className={cn(
                                                        "text-[10px] px-1.5 py-0",
                                                        examStatus === "not_started" && "text-muted-foreground",
                                                        examStatus === "pending" && "text-warning border-warning/30 bg-warning/5",
                                                        examStatus === "approved" && "text-success border-success/30 bg-success/5",
                                                        examStatus === "rejected" && "text-destructive border-destructive/30 bg-destructive/5"
                                                    )}>
                                                        {examStatus.replace("_", " ").toUpperCase()}
                                                    </Badge>
                                                </div>
                                                <Button 
                                                    variant="outline" 
                                                    className="w-full gap-2 border-primary/20 text-primary hover:bg-primary/5"
                                                    onClick={() => setIsUploadModalOpen(true)}
                                                    disabled={examStatus === "approved" || examStatus === "pending"}
                                                >
                                                    <Upload className="w-4 h-4" />
                                                    Upload Result
                                                </Button>
                                            </div>
                                        </>
                                    )}

                                    {certificationMode === "none" && (
                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-success/5 border border-success/20">
                                            <CheckCircle className="w-5 h-5 text-success shrink-0" />
                                            <p className="text-xs text-success font-medium">Complete all lessons to receive your certificate automatically.</p>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {/* Task 3: Internal Exam Instruction Modal */}
                            <Dialog open={isExamModalOpen} onOpenChange={setIsExamModalOpen}>
                                <DialogContent className="sm:max-w-[500px]">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2">
                                            <Shield className="w-5 h-5 text-primary" />
                                            Exam Instructions
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className="py-6 space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 text-center">
                                                <Timer className="w-6 h-6 mx-auto mb-2 text-primary" />
                                                <p className="text-xs text-muted-foreground">Duration</p>
                                                <p className="text-lg font-bold">60 Mins</p>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 text-center">
                                                <Target className="w-6 h-6 mx-auto mb-2 text-success" />
                                                <p className="text-xs text-muted-foreground">Passing Score</p>
                                                <p className="text-lg font-bold">75%</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3 p-4 rounded-xl bg-warning/5 border border-warning/20">
                                                <Camera className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                                                <div className="space-y-1">
                                                    <p className="text-sm font-semibold text-warning-foreground">Camera Requirement</p>
                                                    <p className="text-xs text-warning-foreground/80">Active webcam monitoring is required throughout the exam duration.</p>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Anti-Cheating Rules:</p>
                                                <ul className="space-y-2">
                                                    {[
                                                        "Do not switch tabs or minimize the browser window.",
                                                        "No secondary devices are allowed in the room.",
                                                        "Ensure your face is clearly visible at all times.",
                                                        "The exam session is recorded for review."
                                                    ].map((rule, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                                            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-destructive/60" />
                                                            {rule}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="ghost" onClick={() => setIsExamModalOpen(false)}>Cancel</Button>
                                        <Button className="gradient-primary px-8" onClick={() => {
                                            setIsExamModalOpen(false);
                                            // Mock passing the exam
                                            setExamStatus("approved");
                                        }}>
                                            I Understand, Start Exam
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            {/* Task 4: External Exam Upload Modal */}
                            <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
                                <DialogContent className="sm:max-w-[450px]">
                                    <DialogHeader>
                                        <DialogTitle>Upload Certification Result</DialogTitle>
                                    </DialogHeader>
                                    <div className="py-8 space-y-6">
                                        <div className="border-2 border-dashed border-border/50 rounded-2xl p-10 text-center hover:border-primary/30 transition-colors cursor-pointer group">
                                            <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                <Upload className="w-6 h-6 text-primary" />
                                            </div>
                                            <p className="text-sm font-medium mb-1">Click to upload or drag & drop</p>
                                            <p className="text-xs text-muted-foreground">PDF, JPG or PNG (max. 5MB)</p>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50">
                                                <FileText className="w-5 h-5 text-muted-foreground" />
                                                <div className="flex-1">
                                                    <p className="text-xs font-medium">istqb_foundation_certificate.pdf</p>
                                                    <Progress value={100} className="h-1 mt-1.5" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="ghost" onClick={() => setIsUploadModalOpen(false)}>Cancel</Button>
                                        <Button className="gradient-primary" onClick={() => {
                                            setIsUploadModalOpen(false);
                                            setExamStatus("pending");
                                            setTimeout(() => {
                                                setExamStatus("approved");
                                            }, 3000);
                                        }}>
                                            Submit for Verification
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            {/* Objectives */}
                            <div className="rounded-2xl bg-card border border-border/50 shadow-soft p-5">
                                <h3 className="font-semibold flex items-center gap-2 mb-4">
                                    <Target className="w-5 h-5 text-primary" />
                                    Learning Objectives
                                </h3>
                                <ul className="space-y-3">
                                    {course.objectives.map((objective, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm">
                                            <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground">{objective}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Prerequisites */}
                            <div className="rounded-2xl bg-card border border-border/50 shadow-soft p-5">
                                <h3 className="font-semibold flex items-center gap-2 mb-4">
                                    <AlertCircle className="w-5 h-5 text-warning" />
                                    Prerequisites
                                </h3>
                                <ul className="space-y-2">
                                    {course.prerequisites.map((prereq, i) => (
                                        <li key={i} className="text-sm text-muted-foreground">
                                            • {prereq}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Instructors */}
                            <div className="rounded-2xl bg-card border border-border/50 shadow-soft p-5">
                                <h3 className="font-semibold mb-4">Instructors</h3>
                                <div className="space-y-4">
                                    <div className="flex -space-x-3 overflow-hidden">
                                        {(course as any).instructors?.slice(0, 3).map((inst: any, i: number) => (
                                            <div 
                                                key={inst.id}
                                                className="inline-block h-12 w-12 rounded-full ring-2 ring-card bg-card cursor-pointer hover:ring-primary transition-all"
                                                title={inst.name}
                                                onClick={() => navigate(`/instructor-profile/${inst.id}`)}
                                            >
                                                <div className="h-full w-full rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm">
                                                    {inst.name.split(" ").map((n: any) => n[0]).join("")}
                                                </div>
                                            </div>
                                        ))}
                                        {(course as any).instructors?.length > 3 && (
                                            <div className="flex items-center justify-center h-12 w-12 rounded-full ring-2 ring-card bg-muted text-xs font-bold text-muted-foreground">
                                                +{(course as any).instructors.length - 3}
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        {(course as any).instructors?.slice(0, 3).map((inst: any) => (
                                            <button 
                                                key={inst.id}
                                                onClick={() => navigate(`/instructor-profile/${inst.id}`)}
                                                className="block text-sm font-medium hover:text-primary transition-colors text-left"
                                            >
                                                {inst.name}
                                                <span className="text-[10px] text-muted-foreground ml-2 px-1.5 py-0.5 rounded bg-muted">
                                                    {inst.role}
                                                </span>
                                            </button>
                                        ))}
                                    </div>

                                </div>
                            </div>

                            {course.attachmentUrl && (
                                <div className="rounded-2xl bg-card border border-border/50 shadow-soft p-5">
                                    <h3 className="font-semibold flex items-center gap-2 mb-4">
                                        <Paperclip className="w-5 h-5 text-primary" />
                                        Course Material
                                    </h3>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => window.open(course.attachmentUrl, '_blank')}
                                    >
                                        Download Attachment
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main >
        </div >
    );
};

export default CourseDetail;
