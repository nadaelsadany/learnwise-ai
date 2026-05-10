import { BookOpen, Clock, Star, Users, Sparkles, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Course, levelLabels } from "./types";

interface CourseCardEnhancedProps {
    course: Course;
    variant?: "default" | "featured" | "compact";
    isLocked?: boolean;
    lockMessage?: string;
    onClick?: () => void;
}

export function CourseCardEnhanced({
    course,
    variant = "default",
    isLocked,
    lockMessage,
    onClick,
}: CourseCardEnhancedProps) {
    const getLevelColor = (level: string) => {
        switch (level) {
            case "beginner": return "bg-success/10 text-success border-success/20";
            case "intermediate": return "bg-warning/10 text-warning border-warning/20";
            case "advanced": return "bg-destructive/10 text-destructive border-destructive/20";
            default: return "bg-muted text-muted-foreground";
        }
    };

    return (
        <div
            onClick={() => !isLocked && onClick?.()}
            className={cn(
                "group relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-soft transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 cursor-pointer",
                variant === "featured" && "md:col-span-2 lg:col-span-2",
                isLocked && "cursor-not-allowed hover:translate-y-0"
            )}
        >
            {/* Locked Overlay */}
            {isLocked && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-[2px] text-center p-6 animate-fade-in">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3 shadow-inner">
                        <Lock className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-bold text-foreground mb-1">Course Locked</p>
                    <p className="text-xs text-muted-foreground max-w-[200px]">
                        {lockMessage || "Complete prerequisites to unlock this course."}
                    </p>
                </div>
            )}
            {/* Image/Gradient Header */}
            <div className={cn(
                "relative h-36 overflow-hidden",
                variant === "featured" && "h-48"
            )}>
                {course.image ? (
                    <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className={cn(
                        "w-full h-full",
                        course.category === "certification" && "gradient-primary",
                        course.category === "automation" && "gradient-accent",
                        course.category === "agile" && "gradient-success",
                        course.category === "testing-techniques" && "bg-gradient-to-br from-amber-500 to-orange-600",
                        course.category === "tools" && "bg-gradient-to-br from-cyan-500 to-blue-600",
                        course.category === "soft-skills" && "bg-gradient-to-br from-pink-500 to-rose-600",
                    )} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    {course.isNew && (
                        <Badge className="bg-success text-white border-0 gap-1">
                            <Sparkles className="w-3 h-3" />
                            New
                        </Badge>
                    )}
                    {course.isFeatured && (
                        <Badge className="bg-primary text-white border-0">Featured</Badge>
                    )}
                </div>

                {/* Progress Badge */}
                {course.progress > 0 && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full glass text-xs font-medium">
                        {course.progress}% complete
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Level & Rating */}
                <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className={cn("text-xs", getLevelColor(course.level))}>
                        {levelLabels[course.level]}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs">
                        <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                        <span className="font-medium">{course.rating}</span>
                        <span className="text-muted-foreground">({course.studentsEnrolled.toLocaleString()})</span>
                    </div>
                </div>

                <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                    {course.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {course.description}
                </p>

                {/* Progress Bar */}
                {course.progress > 0 && (
                    <div className="mb-4">
                        <Progress value={course.progress} className="h-2" />
                    </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {course.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 text-xs rounded-md bg-muted text-muted-foreground">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>{course.lessons} lessons</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{course.duration}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        <span>{course.studentsEnrolled.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
