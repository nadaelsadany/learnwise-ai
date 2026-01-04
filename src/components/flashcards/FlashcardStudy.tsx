import { useState } from "react";
import { cn } from "@/lib/utils";
import { Flashcard, StudyRating } from "./types";
import { Button } from "@/components/ui/button";
import {
    RotateCcw,
    Lightbulb,
    ChevronLeft,
    ChevronRight,
    X,
    Check,
    Zap,
    Star
} from "lucide-react";

interface FlashcardStudyProps {
    cards: Flashcard[];
    deckName: string;
    onComplete: (results: { correct: number; total: number }) => void;
    onExit: () => void;
}

export function FlashcardStudy({ cards, deckName, onComplete, onExit }: FlashcardStudyProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [results, setResults] = useState<Record<string, StudyRating>>({});

    const currentCard = cards[currentIndex];
    const progress = ((currentIndex + 1) / cards.length) * 100;
    const answeredCount = Object.keys(results).length;

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
        setShowHint(false);
    };

    const handleRating = (rating: StudyRating) => {
        setResults(prev => ({ ...prev, [currentCard.id]: rating }));

        if (currentIndex < cards.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsFlipped(false);
            setShowHint(false);
        } else {
            // Calculate results
            const correct = Object.values({ ...results, [currentCard.id]: rating })
                .filter(r => r === "good" || r === "easy").length;
            onComplete({ correct, total: cards.length });
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setIsFlipped(false);
            setShowHint(false);
        }
    };

    const handleNext = () => {
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsFlipped(false);
            setShowHint(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-10rem)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold">{deckName}</h2>
                    <p className="text-sm text-muted-foreground">
                        Card {currentIndex + 1} of {cards.length}
                    </p>
                </div>
                <Button variant="ghost" size="sm" onClick={onExit}>
                    <X className="w-4 h-4 mr-2" />
                    Exit
                </Button>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-muted rounded-full mb-8 overflow-hidden">
                <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Flashcard */}
            <div className="flex-1 flex items-center justify-center">
                <div
                    onClick={handleFlip}
                    className={cn(
                        "w-full max-w-2xl aspect-[3/2] rounded-3xl cursor-pointer transition-all duration-500 transform-gpu perspective-1000",
                        "shadow-elevated hover:shadow-lg"
                    )}
                    style={{ transformStyle: "preserve-3d" }}
                >
                    <div
                        className={cn(
                            "relative w-full h-full transition-transform duration-500",
                            isFlipped && "[transform:rotateY(180deg)]"
                        )}
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        {/* Front */}
                        <div
                            className={cn(
                                "absolute inset-0 rounded-3xl p-8 flex flex-col items-center justify-center text-center",
                                "bg-card border border-border/50 backface-hidden"
                            )}
                        >
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
                                Question
                            </p>
                            <p className="text-xl font-medium leading-relaxed">
                                {currentCard.front}
                            </p>

                            {currentCard.hint && !showHint && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mt-6 gap-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowHint(true);
                                    }}
                                >
                                    <Lightbulb className="w-4 h-4" />
                                    Show Hint
                                </Button>
                            )}

                            {showHint && currentCard.hint && (
                                <div className="mt-6 px-4 py-2 rounded-lg bg-warning/10 text-warning text-sm">
                                    💡 {currentCard.hint}
                                </div>
                            )}

                            <p className="absolute bottom-6 text-xs text-muted-foreground">
                                Click to flip
                            </p>
                        </div>

                        {/* Back */}
                        <div
                            className={cn(
                                "absolute inset-0 rounded-3xl p-8 flex flex-col items-center justify-center text-center",
                                "bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 backface-hidden",
                                "[transform:rotateY(180deg)]"
                            )}
                        >
                            <p className="text-xs text-primary uppercase tracking-wider mb-4">
                                Answer
                            </p>
                            <p className="text-lg leading-relaxed whitespace-pre-line">
                                {currentCard.back}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="mt-8">
                {!isFlipped ? (
                    <div className="flex items-center justify-center gap-4">
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <Button size="lg" onClick={handleFlip} className="px-8">
                            <RotateCcw className="w-5 h-5 mr-2" />
                            Flip Card
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handleNext}
                            disabled={currentIndex === cards.length - 1}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-center text-sm text-muted-foreground">
                            How well did you know this?
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <Button
                                variant="outline"
                                className="flex-1 max-w-[140px] h-14 flex-col gap-1 border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => handleRating("again")}
                            >
                                <X className="w-5 h-5" />
                                <span className="text-xs">Again</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1 max-w-[140px] h-14 flex-col gap-1 border-warning/50 hover:bg-warning/10 hover:text-warning"
                                onClick={() => handleRating("hard")}
                            >
                                <Zap className="w-5 h-5" />
                                <span className="text-xs">Hard</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1 max-w-[140px] h-14 flex-col gap-1 border-success/50 hover:bg-success/10 hover:text-success"
                                onClick={() => handleRating("good")}
                            >
                                <Check className="w-5 h-5" />
                                <span className="text-xs">Good</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1 max-w-[140px] h-14 flex-col gap-1 border-primary/50 hover:bg-primary/10 hover:text-primary"
                                onClick={() => handleRating("easy")}
                            >
                                <Star className="w-5 h-5" />
                                <span className="text-xs">Easy</span>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
