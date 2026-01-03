import { BookOpen, Clock, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface CourseCardProps {
  title: string;
  description: string;
  progress: number;
  duration: string;
  lessons: number;
  image?: string;
  variant?: "default" | "featured";
}

export const CourseCard = ({
  title,
  description,
  progress,
  duration,
  lessons,
  image,
  variant = "default",
}: CourseCardProps) => {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-1",
        variant === "featured" && "md:col-span-2"
      )}
    >
      {/* Image/Gradient Header */}
      <div className={cn(
        "relative h-32 overflow-hidden",
        variant === "featured" && "h-40"
      )}>
        {image ? (
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full gradient-primary" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        
        {/* Progress Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full glass text-xs font-medium">
          <BarChart3 className="w-3.5 h-3.5" />
          {progress}%
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-1">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>

        {/* Progress Bar */}
        <div className="mb-4">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lessons} lessons</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
