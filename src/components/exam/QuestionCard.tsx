import { Question } from "./types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Flag, CheckCircle2, XCircle, Info } from "lucide-react";

interface QuestionCardProps {
    question: Question;
    selectedAnswer: string | undefined;
    isFlagged: boolean;
    onSelectAnswer: (optionId: string) => void;
    onToggleFlag: () => void;
    onPrevious: () => void;
    onNext: () => void;
    isFirst: boolean;
    isLast: boolean;
    totalQuestions: number;
    showCorrection?: boolean;
}

export function QuestionCard({
    question,
    selectedAnswer,
    isFlagged,
    onSelectAnswer,
    onToggleFlag,
    onPrevious,
    onNext,
    isFirst,
    isLast,
    totalQuestions,
    showCorrection = false,
}: QuestionCardProps) {
    return (
        <div className="rounded-2xl bg-card border border-border/50 shadow-soft overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="p-4 border-b border-border/50 bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-sm font-semibold">
                        Question {question.number} of {totalQuestions}
                    </span>
                    <span className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs">
                        {question.topic}
                    </span>
                </div>
                <Button
                    variant={isFlagged ? "default" : "outline"}
                    size="sm"
                    onClick={onToggleFlag}
                    className={cn(
                        "gap-2 transition-all",
                        isFlagged && "bg-warning hover:bg-warning/90 text-warning-foreground"
                    )}
                >
                    <Flag className="w-4 h-4" />
                    {isFlagged ? "Flagged" : "Flag for Review"}
                </Button>
            </div>

            {/* Question Text */}
            <div className="p-6">
                <p className="text-lg font-medium leading-relaxed mb-6">
                    {question.text}
                </p>

                {/* Options */}
                <RadioGroup
                    value={selectedAnswer}
                    onValueChange={onSelectAnswer}
                    className="space-y-3"
                    disabled={showCorrection}
                >
                    {question.options.map((option) => {
                        const isCorrect = option.id === question.correctAnswer;
                        const isSelected = selectedAnswer === option.id;
                        const isWrong = isSelected && !isCorrect;

                        return (
                            <div key={option.id} className="relative">
                                <Label
                                    htmlFor={option.id}
                                    className={cn(
                                        "flex items-start gap-4 p-4 rounded-xl border-2 transition-all",
                                        !showCorrection && "cursor-pointer hover:bg-muted/50 hover:border-primary/30",
                                        isSelected && !showCorrection && "border-primary bg-primary/5 shadow-soft",
                                        !isSelected && !showCorrection && "border-border/50",
                                        showCorrection && isCorrect && "border-success bg-success/5",
                                        showCorrection && isWrong && "border-destructive bg-destructive/5",
                                        showCorrection && !isCorrect && !isWrong && "border-border/50 opacity-60"
                                    )}
                                >
                                    <RadioGroupItem 
                                        value={option.id} 
                                        id={option.id} 
                                        className={cn(
                                            "mt-0.5",
                                            showCorrection && "hidden"
                                        )} 
                                    />
                                    <div className="flex items-start gap-3 flex-1">
                                        <span
                                            className={cn(
                                                "w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold shrink-0",
                                                isSelected && !showCorrection && "bg-primary text-primary-foreground",
                                                !isSelected && !showCorrection && "bg-muted text-muted-foreground",
                                                showCorrection && isCorrect && "bg-success text-success-foreground",
                                                showCorrection && isWrong && "bg-destructive text-destructive-foreground",
                                                showCorrection && !isCorrect && !isWrong && "bg-muted text-muted-foreground"
                                            )}
                                        >
                                            {option.label}
                                        </span>
                                        <span className="text-sm leading-relaxed pt-1">{option.text}</span>
                                    </div>
                                    
                                    {showCorrection && isCorrect && (
                                        <CheckCircle2 className="w-5 h-5 text-success shrink-0 ml-auto" />
                                    )}
                                    {showCorrection && isWrong && (
                                        <XCircle className="w-5 h-5 text-destructive shrink-0 ml-auto" />
                                    )}
                                </Label>
                            </div>
                        );
                    })}
                </RadioGroup>

                {showCorrection && question.explanation && (
                    <div className="mt-8 p-5 rounded-2xl bg-primary/5 border border-primary/10 animate-slide-up">
                        <div className="flex items-center gap-2 mb-3 text-primary">
                            <Info className="w-4 h-4" />
                            <h4 className="text-sm font-bold uppercase tracking-wider">Explanation</h4>
                        </div>
                        <p className="text-sm leading-relaxed text-foreground/80">
                            {question.explanation}
                        </p>
                    </div>
                )}
            </div>

            {/* Navigation Footer */}
            <div className="p-4 border-t border-border/50 bg-muted/30 flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={onPrevious}
                    disabled={isFirst}
                    className="gap-2"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                </Button>
                <Button
                    variant={isLast ? "gradient" : "default"}
                    onClick={onNext}
                    className="gap-2"
                >
                    {isLast ? "Review Answers" : "Next"}
                    {!isLast && <ChevronRight className="w-4 h-4" />}
                </Button>
            </div>
        </div>
    );
}
