import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pause, Play, Send, Flag } from "lucide-react";

interface ExamControlsProps {
    isPaused: boolean;
    answeredCount: number;
    flaggedCount: number;
    totalQuestions: number;
    onPause: () => void;
    onResume: () => void;
    onSubmit: () => void;
    onReviewFlagged: () => void;
}

export function ExamControls({
    isPaused,
    answeredCount,
    flaggedCount,
    totalQuestions,
    onPause,
    onResume,
    onSubmit,
    onReviewFlagged,
}: ExamControlsProps) {
    const unansweredCount = totalQuestions - answeredCount;

    return (
        <div className="rounded-2xl bg-card border border-border/50 shadow-soft p-4 space-y-3">
            <h3 className="text-sm font-semibold mb-3">Exam Controls</h3>

            {/* Pause/Resume Button */}
            <Button
                variant="outline"
                className="w-full gap-2"
                onClick={isPaused ? onResume : onPause}
            >
                {isPaused ? (
                    <>
                        <Play className="w-4 h-4" />
                        Resume Exam
                    </>
                ) : (
                    <>
                        <Pause className="w-4 h-4" />
                        Pause Exam
                    </>
                )}
            </Button>

            {/* Review Flagged Button */}
            {flaggedCount > 0 && (
                <Button
                    variant="outline"
                    className="w-full gap-2 border-warning/50 text-warning hover:bg-warning/10"
                    onClick={onReviewFlagged}
                >
                    <Flag className="w-4 h-4" />
                    Review Flagged ({flaggedCount})
                </Button>
            )}

            {/* Submit Button with Confirmation */}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="gradient" className="w-full gap-2">
                        <Send className="w-4 h-4" />
                        Submit Exam
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-3">
                            <p>Are you sure you want to submit your exam?</p>
                            <div className="rounded-lg bg-muted p-3 space-y-1">
                                <p className="text-sm">
                                    <span className="font-medium text-success">Answered:</span>{" "}
                                    {answeredCount} / {totalQuestions}
                                </p>
                                {unansweredCount > 0 && (
                                    <p className="text-sm text-warning">
                                        ⚠️ You have {unansweredCount} unanswered question(s)
                                    </p>
                                )}
                                {flaggedCount > 0 && (
                                    <p className="text-sm text-muted-foreground">
                                        📌 {flaggedCount} question(s) flagged for review
                                    </p>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                This action cannot be undone.
                            </p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Continue Exam</AlertDialogCancel>
                        <AlertDialogAction onClick={onSubmit} className="bg-primary">
                            Submit Exam
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
