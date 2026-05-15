import { Progress } from "@/components/ui/progress";
import { CheckCircle, Flag, HelpCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExamProgressBarProps {
    answeredCount: number;
    flaggedCount: number;
    totalQuestions: number;
    progressPercentage: number;
    isReviewMode?: boolean;
}

export function ExamProgressBar({
    answeredCount,
    flaggedCount,
    totalQuestions,
    progressPercentage,
    isReviewMode = false,
}: ExamProgressBarProps) {
    const unansweredCount = totalQuestions - answeredCount;

    return (
        <div className="rounded-2xl bg-card border border-border/50 shadow-soft p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">{isReviewMode ? "Final Result" : "Progress"}</h3>
                <span className="text-sm font-bold text-primary tabular-nums">
                    {Math.round(progressPercentage)}%
                </span>
            </div>

            <Progress value={progressPercentage} className="h-3" />

            <div className="grid grid-cols-3 gap-2">
                <div className={cn("flex flex-col items-center p-3 rounded-xl", isReviewMode ? "bg-success/10" : "bg-success/10")}>
                    <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="text-lg font-bold text-success tabular-nums">
                            {answeredCount}
                        </span>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">{isReviewMode ? "Correct" : "Answered"}</span>
                </div>

                <div className="flex flex-col items-center p-3 rounded-xl bg-warning/10">
                    <div className="flex items-center gap-1.5">
                        <Flag className="w-4 h-4 text-warning" />
                        <span className="text-lg font-bold text-warning tabular-nums">
                            {flaggedCount}
                        </span>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">Flagged</span>
                </div>

                <div className={cn("flex flex-col items-center p-3 rounded-xl", isReviewMode ? "bg-destructive/10" : "bg-muted/50")}>
                    <div className="flex items-center gap-1.5">
                        {isReviewMode ? (
                            <XCircle className="w-4 h-4 text-destructive" />
                        ) : (
                            <HelpCircle className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className={cn("text-lg font-bold tabular-nums", isReviewMode ? "text-destructive" : "text-muted-foreground")}>
                            {isReviewMode ? (totalQuestions - answeredCount) : unansweredCount}
                        </span>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">{isReviewMode ? "Incorrect" : "Remaining"}</span>
                </div>
            </div>
        </div>
    );
}
