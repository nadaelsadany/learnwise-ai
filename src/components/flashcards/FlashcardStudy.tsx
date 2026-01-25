import { useState, useRef, useEffect } from "react";
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
    Star,
    Repeat
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

    // Add audio for flip effect
    const flipSound = useRef<HTMLAudioElement | null>(null);

    const currentCard = cards[currentIndex];
    const progress = ((currentIndex + 1) / cards.length) * 100;

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
        setShowHint(false);
    };

    const handleRating = (rating: StudyRating) => {
        setResults(prev => ({ ...prev, [currentCard.id]: rating }));

        if (currentIndex < cards.length - 1) {
            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
                setIsFlipped(false);
                setShowHint(false);
            }, 300); // Small delay for better UX
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
        <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center">
            {/* Header */}
            <div className="w-full flex items-center justify-between mb-8 max-w-3xl">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{deckName}</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Card {currentIndex + 1} of {cards.length}
                    </p>
                </div>
                <Button variant="ghost" size="sm" onClick={onExit} className="hover:bg-destructive/10 hover:text-destructive">
                    <X className="w-4 h-4 mr-2" />
                    Exit Session
                </Button>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-3xl h-1.5 bg-secondary rounded-full mb-10 overflow-hidden">
                <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Flashcard Area */}
            <div className="flex-1 w-full max-w-3xl flex items-center justify-center relative" style={{ perspective: "1000px" }}>
                <div
                    className={cn(
                        "relative w-full aspect-[1.6/1] cursor-pointer transition-all duration-700 transform-gpu group",
                    )}
                    onClick={handleFlip}
                    style={{
                        transformStyle: "preserve-3d",
                        transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
                    }}
                >
                    {/* Front Face */}
                    <div
                        className="absolute inset-0"
                        style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                    >
                        <div className={cn(
                            "w-full h-full rounded-[2rem] bg-card border border-border shadow-xl p-12 flex flex-col items-center justify-center text-center",
                            "hover:shadow-2xl hover:border-primary/20 transition-all duration-300",
                            "bg-gradient-to-br from-card to-secondary/10"
                        )}>
                            <div className="absolute top-8 left-8">
                                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium tracking-wider uppercase">
                                    Question
                                </span>
                            </div>

                            <h3 className="text-3xl font-medium leading-tight text-foreground/90">
                                {currentCard.front}
                            </h3>

                            {currentCard.hint && !showHint && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute bottom-8 right-8 text-muted-foreground hover:text-primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowHint(true);
                                    }}
                                >
                                    <Lightbulb className="w-4 h-4 mr-2" />
                                    Hint
                                </Button>
                            )}

                            {showHint && currentCard.hint && (
                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-3/4 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-4 py-2 rounded-lg text-sm border border-yellow-500/20">
                                        💡 {currentCard.hint}
                                    </div>
                                </div>
                            )}

                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground/30 text-sm font-medium flex items-center gap-2 group-hover:text-muted-foreground/50 transition-colors">
                                <Repeat className="w-3 h-3" />
                                Click to flip
                            </div>
                        </div>
                    </div>

                    {/* Back Face */}
                    <div
                        className="absolute inset-0"
                        style={{
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            transform: "rotateY(180deg)"
                        }}
                    >
                        <div className={cn(
                            "w-full h-full rounded-[2rem] bg-card border border-primary/20 shadow-xl p-12 flex flex-col items-center justify-center text-center",
                            "bg-gradient-to-br from-primary/5 via-card to-accent/5",
                            "relative overflow-hidden"
                        )}>
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />

                            <div className="absolute top-8 left-8">
                                <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium tracking-wider uppercase shadow-sm">
                                    Answer
                                </span>
                            </div>

                            <div className="prose prose-lg dark:prose-invert max-w-none">
                                <p className="text-2xl leading-relaxed font-medium text-foreground/90 whitespace-pre-wrap">
                                    {currentCard.back}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="mt-12 w-full max-w-2xl">
                {!isFlipped ? (
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-12 w-12 rounded-full border-2"
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </Button>

                        <Button
                            size="lg"
                            onClick={handleFlip}
                            className="h-12 px-8 rounded-full shadow-lg hover:shadow-primary/25 hover:scale-105 transition-all"
                        >
                            <RotateCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform" />
                            Reveal Answer
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            className="h-12 w-12 rounded-full border-2"
                            onClick={handleNext}
                            disabled={currentIndex === cards.length - 1}
                        >
                            <ChevronRight className="w-6 h-6" />
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <p className="text-center text-muted-foreground font-medium">
                            How well did you know this?
                        </p>
                        <div className="grid grid-cols-4 gap-4">
                            {[
                                { id: 'again', label: 'Again', icon: X, color: 'text-destructive', border: 'border-destructive/20', bg: 'hover:bg-destructive/10' },
                                { id: 'hard', label: 'Hard', icon: Zap, color: 'text-orange-500', border: 'border-orange-500/20', bg: 'hover:bg-orange-500/10' },
                                { id: 'good', label: 'Good', icon: Check, color: 'text-primary', border: 'border-primary/20', bg: 'hover:bg-primary/10' },
                                { id: 'easy', label: 'Easy', icon: Star, color: 'text-green-500', border: 'border-green-500/20', bg: 'hover:bg-green-500/10' }
                            ].map((btn) => (
                                <Button
                                    key={btn.id}
                                    variant="outline"
                                    className={cn(
                                        "h-24 flex-col gap-3 rounded-2xl border-2 transition-all hover:scale-105 hover:shadow-lg",
                                        btn.border,
                                        btn.bg
                                    )}
                                    onClick={() => handleRating(btn.id as StudyRating)}
                                >
                                    <btn.icon className={cn("w-6 h-6", btn.color)} />
                                    <span className={cn("font-medium", btn.color)}>{btn.label}</span>
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
