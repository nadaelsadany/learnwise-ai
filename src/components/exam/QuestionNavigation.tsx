import { cn } from "@/lib/utils";
import { Question, QuestionStatus } from "./types";
import { Flag, Check, X } from "lucide-react";

interface QuestionNavigationProps {
    questions: Question[];
    currentIndex: number;
    getQuestionStatus: (questionId: string, index: number) => QuestionStatus;
    onQuestionClick: (index: number) => void;
}

export function QuestionNavigation({
    questions,
    currentIndex,
    getQuestionStatus,
    onQuestionClick,
}: QuestionNavigationProps) {
    const getStatusStyles = (status: QuestionStatus) => {
        switch (status) {
            case "current":
                return "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background shadow-glow-primary";
            case "correct":
                return "bg-success text-success-foreground border-success shadow-[0_0_10px_rgba(34,197,94,0.3)]";
            case "incorrect":
                return "bg-destructive text-destructive-foreground border-destructive shadow-[0_0_10px_rgba(239,68,68,0.3)]";
            case "answered":
                return "bg-success/20 text-success border-success/30 hover:bg-success/30";
            case "flagged":
                return "bg-warning/20 text-warning border-warning/30 hover:bg-warning/30";
            default:
                return "bg-muted/50 text-muted-foreground hover:bg-muted";
        }
    };

    const getStatusIcon = (status: QuestionStatus) => {
        if (status === "answered" || status === "correct") {
            return <Check className="w-3 h-3 absolute -top-1 -right-1 bg-success text-white rounded-full p-0.5 border border-white" />;
        }
        if (status === "incorrect") {
            return <X className="w-3 h-3 absolute -top-1 -right-1 bg-destructive text-white rounded-full p-0.5 border border-white" />;
        }
        if (status === "flagged") {
            return <Flag className="w-3 h-3 absolute -top-1 -right-1 bg-warning text-white rounded-full p-0.5 border border-white" />;
        }
        return null;
    };

    return (
        <div className="rounded-2xl bg-card border border-border/50 shadow-soft p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Question Navigator
            </h3>

            <div className="grid grid-cols-5 gap-2">
                {questions.map((question, index) => {
                    const status = getQuestionStatus(question.id, index);
                    return (
                        <button
                            key={question.id}
                            onClick={() => onQuestionClick(index)}
                            className={cn(
                                "relative w-10 h-10 rounded-xl border text-sm font-medium transition-all duration-200",
                                "hover:scale-105 active:scale-95",
                                getStatusStyles(status)
                            )}
                        >
                            {question.number}
                            {getStatusIcon(status)}
                        </button>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-border/50">
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-primary" />
                        <span className="text-muted-foreground">Current</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-success/20 border border-success/30" />
                        <span className="text-muted-foreground">Answered</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-success border border-success" />
                        <span className="text-muted-foreground">Correct</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-destructive border border-destructive" />
                        <span className="text-muted-foreground">Incorrect</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-muted/50" />
                        <span className="text-muted-foreground">Unanswered</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
