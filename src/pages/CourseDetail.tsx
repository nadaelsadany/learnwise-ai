import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { mockCourses, categoryLabels, levelLabels } from "@/components/courses";
import { getCourseWithChapters } from "@/components/courses/courseChapters";
import { ChapterAccordion } from "@/components/courses/ChapterAccordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
    Upload
} from "lucide-react";

const CourseDetail = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [openChapterId, setOpenChapterId] = useState<string | null>(null);

    const courseWithChapters = useMemo(() => {
        if (!courseId) return null;
        return getCourseWithChapters(courseId, mockCourses);
    }, [courseId]);

    if (!courseWithChapters) {
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

    const course = courseWithChapters;
    const totalLessons = course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
    const completedLessons = course.chapters.reduce(
        (sum, ch) => sum + ch.lessons.filter(l => l.isCompleted).length,
        0
    );
    const completedChapters = course.chapters.filter(ch => ch.isCompleted).length;

    const handleChapterToggle = (chapterId: string) => {
        setOpenChapterId(prev => prev === chapterId ? null : chapterId);
    };

    const handleLessonClick = (lessonId: string) => {
        // In a real app, this would navigate to the lesson viewer
        console.log("Opening lesson:", lessonId);
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
        for (const chapter of course.chapters) {
            if (chapter.isLocked) continue;
            const nextLesson = chapter.lessons.find(l => !l.isCompleted && !l.isLocked);
            if (nextLesson) return { chapter, lesson: nextLesson };
        }
        return null;
    };

    const nextLesson = getNextLesson();

    return (
        <div className="min-h-screen bg-background">
            <Sidebar onCollapse={setSidebarCollapsed} />
            <Header sidebarCollapsed={sidebarCollapsed} />

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
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        {completedChapters} of {course.chapters.length} chapters done
                                    </span>
                                    <span className="font-semibold text-primary">{course.progress}%</span>
                                </div>
                            </div>

                            {/* Continue Button */}
                            {nextLesson && (
                                <div className="flex items-center gap-4">
                                    <Button
                                        size="lg"
                                        className="gap-2"
                                        onClick={() => {
                                            setOpenChapterId(nextLesson.chapter.id);
                                            handleLessonClick(nextLesson.lesson.id);
                                        }}
                                    >
                                        <Play className="w-5 h-5" />
                                        Continue: {nextLesson.lesson.title}
                                    </Button>
                                    <span className="text-sm text-muted-foreground">
                                        Chapter {nextLesson.chapter.number} • {nextLesson.lesson.duration}
                                    </span>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Two Column Layout */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Main Content - Chapters */}
                        <div className="lg:col-span-2 space-y-4">
                            <h2 className="text-xl font-semibold">Course Content</h2>
                            <div className="space-y-3">
                                {course.chapters.map((chapter) => (
                                    <ChapterAccordion
                                        key={chapter.id}
                                        chapter={chapter}
                                        isOpen={openChapterId === chapter.id}
                                        onToggle={() => handleChapterToggle(chapter.id)}
                                        onLessonClick={handleLessonClick}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-4">
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

                            {/* Instructor */}
                            <div className="rounded-2xl bg-card border border-border/50 shadow-soft p-5">
                                <h3 className="font-semibold mb-4">Instructor</h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                                        {course.instructor.split(" ").map(n => n[0]).join("")}
                                    </div>
                                    <div>
                                        <p className="font-medium">{course.instructor}</p>
                                        <p className="text-sm text-muted-foreground">Course Instructor</p>
                                    </div>
                                </div>
                            </div>

                            {/* Upload Syllabus CTA */}
                            <div className="rounded-2xl bg-primary/5 border border-primary/20 p-5">
                                <h3 className="font-semibold flex items-center gap-2 mb-2">
                                    <Upload className="w-5 h-5 text-primary" />
                                    Add Your Own Course
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Upload a syllabus to create a personalized study plan.
                                </p>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => navigate("/syllabus-upload")}
                                >
                                    Upload Syllabus
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CourseDetail;
