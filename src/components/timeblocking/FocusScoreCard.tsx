import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Target } from "lucide-react";

interface FocusScoreCardProps {
  completedPomodoros: number;
  totalStudyMinutes: number;
  totalBlocks: number;
}

export function FocusScoreCard({ completedPomodoros, totalStudyMinutes, totalBlocks }: FocusScoreCardProps) {
  // Focus score: weighted calculation based on pomodoros, study time, and block completion
  const pomodoroScore = Math.min(completedPomodoros * 15, 40); // max 40 from pomodoros
  const timeScore = Math.min(Math.round(totalStudyMinutes / 6), 35); // max 35 from time (3.5h = max)
  const planningScore = Math.min(totalBlocks * 5, 25); // max 25 from planning
  const focusScore = Math.min(pomodoroScore + timeScore + planningScore, 100);

  const getScoreColor = () => {
    if (focusScore >= 80) return "text-success";
    if (focusScore >= 50) return "text-primary";
    if (focusScore >= 25) return "text-warning-foreground";
    return "text-muted-foreground";
  };

  const getScoreLabel = () => {
    if (focusScore >= 80) return "Excellent";
    if (focusScore >= 50) return "Good";
    if (focusScore >= 25) return "Building Up";
    return "Getting Started";
  };

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - focusScore / 100);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5" /> Today's Focus Score
        </p>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="6" opacity="0.3" />
              <circle
                cx="50" cy="50" r={radius} fill="none"
                stroke={focusScore >= 80 ? "hsl(var(--success))" : focusScore >= 50 ? "hsl(var(--primary))" : "hsl(var(--warning))"}
                strokeWidth="6" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn("text-lg font-bold", getScoreColor())}>{focusScore}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className={cn("text-sm font-semibold", getScoreColor())}>{getScoreLabel()}</p>
            <div className="space-y-0.5">
              <p className="text-[10px] text-muted-foreground">🍅 {completedPomodoros} pomodoros</p>
              <p className="text-[10px] text-muted-foreground">📖 {Math.round(totalStudyMinutes)}min studied</p>
              <p className="text-[10px] text-muted-foreground">📋 {totalBlocks} blocks planned</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
