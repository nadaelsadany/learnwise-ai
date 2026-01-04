import { ExamResult } from "./types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Trophy, XCircle, Clock, CheckCircle, AlertCircle, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ExamResultsDialogProps {
    isOpen: boolean;
    result: ExamResult | null;
    onReviewAnswers: () => void;
    onRetake: () => void;
}

export function ExamResultsDialog({
    isOpen,
    result,
    onReviewAnswers,
    onRetake,
}: ExamResultsDialogProps) {
    const navigate = useNavigate();

    if (!result) return null;

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    return (
        <Dialog open={isOpen}>
            <DialogContent className="sm:max-w-lg" onPointerDownOutside={(e) => e.preventDefault()}>
                <DialogHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div
                            className={cn(
                                "w-20 h-20 rounded-full flex items-center justify-center",
                                result.passed
                                    ? "bg-success/20 text-success"
                                    : "bg-destructive/20 text-destructive"
                            )}
                        >
                            {result.passed ? (
                                <Trophy className="w-10 h-10" />
                            ) : (
                                <XCircle className="w-10 h-10" />
                            )}
                        </div>
                    </div>
                    <DialogTitle className="text-2xl">
                        {result.passed ? "Congratulations! 🎉" : "Keep Practicing!"}
                    </DialogTitle>
                    <DialogDescription>
                        {result.passed
                            ? "You passed the mock exam!"
                            : "You didn't pass this time, but don't give up!"}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Score Display */}
                    <div className="text-center">
                        <div
                            className={cn(
                                "text-5xl font-bold",
                                result.passed ? "text-success" : "text-destructive"
                            )}
                        >
                            {Math.round(result.percentage)}%
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            {result.correctCount} of {result.correctCount + result.incorrectCount + result.unansweredCount} correct
                        </p>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Score Progress</span>
                            <span className="font-medium">
                                Passing: 65%
                            </span>
                        </div>
                        <div className="relative">
                            <Progress value={result.percentage} className="h-4" />
                            <div
                                className="absolute top-0 bottom-0 w-0.5 bg-foreground"
                                style={{ left: "65%" }}
                            />
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col items-center p-3 rounded-xl bg-muted/50">
                            <Clock className="w-5 h-5 text-muted-foreground mb-1" />
                            <span className="text-lg font-bold">{formatTime(result.timeTaken)}</span>
                            <span className="text-xs text-muted-foreground">Time Taken</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-xl bg-success/10">
                            <CheckCircle className="w-5 h-5 text-success mb-1" />
                            <span className="text-lg font-bold text-success">{result.correctCount}</span>
                            <span className="text-xs text-muted-foreground">Correct</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-xl bg-destructive/10">
                            <AlertCircle className="w-5 h-5 text-destructive mb-1" />
                            <span className="text-lg font-bold text-destructive">{result.incorrectCount}</span>
                            <span className="text-xs text-muted-foreground">Incorrect</span>
                        </div>
                    </div>

                    {/* Topic Breakdown */}
                    {result.topicBreakdown.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold">Topic Breakdown</h4>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {result.topicBreakdown.map((topic) => (
                                    <div
                                        key={topic.topic}
                                        className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                                    >
                                        <span className="text-sm truncate flex-1">{topic.topic}</span>
                                        <span
                                            className={cn(
                                                "text-sm font-semibold ml-2",
                                                topic.percentage >= 65 ? "text-success" : "text-destructive"
                                            )}
                                        >
                                            {topic.correct}/{topic.total}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={() => navigate("/")} className="w-full sm:w-auto">
                        Back to Dashboard
                    </Button>
                    <Button variant="outline" onClick={onReviewAnswers} className="w-full sm:w-auto">
                        Review Answers
                    </Button>
                    <Button onClick={onRetake} className="w-full sm:w-auto gap-2">
                        <RotateCcw className="w-4 h-4" />
                        Retake Exam
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
