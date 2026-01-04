import { Progress } from "@/components/ui/progress";
import { CheckCircle, Flag, HelpCircle } from "lucide-react";

interface ExamProgressBarProps {
    answeredCount: number;
    flaggedCount: number;
    totalQuestions: number;
    progressPercentage: number;
}

export function ExamProgressBar({
    answeredCount,
    flaggedCount,
    totalQuestions,
    progressPercentage,
}: ExamProgressBarProps) {
    const unansweredCount = totalQuestions - answeredCount;

    return (
        <div className="rounded-2xl bg-card border border-border/50 shadow-soft p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Progress</h3>
                <span className="text-sm font-bold text-primary tabular-nums">
                    {Math.round(progressPercentage)}%
                </span>
            </div>

            <Progress value={progressPercentage} className="h-3" />

            <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center p-3 rounded-xl bg-success/10">
                    <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="text-lg font-bold text-success tabular-nums">
                            {answeredCount}
                        </span>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">Answered</span>
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

                <div className="flex flex-col items-center p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                        <span className="text-lg font-bold text-muted-foreground tabular-nums">
                            {unansweredCount}
                        </span>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">Remaining</span>
                </div>
            </div>
        </div>
    );
}
