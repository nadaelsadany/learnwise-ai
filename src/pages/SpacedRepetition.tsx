import { useState } from "react";
import { ApplicantSidebar, ApplicantSidebarContent } from "@/components/layout/ApplicantSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, RotateCcw, CheckCircle2, XCircle, Clock, Layers, TrendingUp, Zap } from "lucide-react";
import { toast } from "sonner";

interface ReviewCard {
  id: string;
  question: string;
  answer: string;
  topic: string;
  interval: number; // days until next review
  easeFactor: number;
  repetitions: number;
  nextReview: Date;
  lastReviewed: Date | null;
}

type Difficulty = "again" | "hard" | "good" | "easy";

const initialCards: ReviewCard[] = [
  { id: "1", question: "What is equivalence partitioning?", answer: "A black-box test technique that divides input data into valid and invalid partitions, then selects representative values from each partition for test cases.", topic: "Test Design", interval: 1, easeFactor: 2.5, repetitions: 0, nextReview: new Date(), lastReviewed: null },
  { id: "2", question: "What are the four test levels in the V-model?", answer: "Component testing, Integration testing, System testing, and Acceptance testing.", topic: "Fundamentals", interval: 1, easeFactor: 2.5, repetitions: 0, nextReview: new Date(), lastReviewed: null },
  { id: "3", question: "Define boundary value analysis.", answer: "A technique that tests values at the exact boundaries of equivalence partitions (min, min+1, max-1, max) where defects often cluster.", topic: "Test Design", interval: 1, easeFactor: 2.5, repetitions: 0, nextReview: new Date(), lastReviewed: null },
  { id: "4", question: "What is the difference between verification and validation?", answer: "Verification: Are we building the product right? (checking work products). Validation: Are we building the right product? (checking against user needs).", topic: "Fundamentals", interval: 1, easeFactor: 2.5, repetitions: 0, nextReview: new Date(), lastReviewed: null },
  { id: "5", question: "What is decision table testing?", answer: "A technique using tables to show combinations of conditions and their resulting actions, useful for testing complex business logic with multiple inputs.", topic: "Test Design", interval: 4, easeFactor: 2.5, repetitions: 1, nextReview: new Date(Date.now() + 3 * 86400000), lastReviewed: new Date(Date.now() - 86400000) },
  { id: "6", question: "Explain state transition testing.", answer: "A technique modeling a system as finite states with transitions triggered by events/conditions. Tests valid/invalid transitions and state sequences.", topic: "Test Design", interval: 7, easeFactor: 2.6, repetitions: 2, nextReview: new Date(Date.now() + 5 * 86400000), lastReviewed: new Date(Date.now() - 2 * 86400000) },
  { id: "7", question: "What is regression testing?", answer: "Testing performed after code changes to confirm that existing functionality still works correctly and no new defects were introduced.", topic: "Test Management", interval: 1, easeFactor: 2.5, repetitions: 0, nextReview: new Date(), lastReviewed: null },
  { id: "8", question: "What is a test oracle?", answer: "A source to determine expected results to compare with the actual result of the software under test.", topic: "Fundamentals", interval: 1, easeFactor: 2.5, repetitions: 0, nextReview: new Date(), lastReviewed: null },
];

const SpacedRepetition = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [cards, setCards] = useState<ReviewCard[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [sessionStats, setSessionStats] = useState({ reviewed: 0, again: 0, hard: 0, good: 0, easy: 0 });

  const dueCards = cards.filter((c) => c.nextReview <= new Date());
  const reviewQueue = dueCards;

  const currentCard = isReviewing ? reviewQueue[currentIndex] : null;

  const calculateNextInterval = (card: ReviewCard, difficulty: Difficulty): Partial<ReviewCard> => {
    let { interval, easeFactor, repetitions } = card;

    switch (difficulty) {
      case "again":
        interval = 1;
        easeFactor = Math.max(1.3, easeFactor - 0.2);
        repetitions = 0;
        break;
      case "hard":
        interval = Math.max(1, Math.round(interval * 1.2));
        easeFactor = Math.max(1.3, easeFactor - 0.15);
        repetitions += 1;
        break;
      case "good":
        interval = repetitions === 0 ? 1 : repetitions === 1 ? 4 : Math.round(interval * easeFactor);
        repetitions += 1;
        break;
      case "easy":
        interval = repetitions === 0 ? 4 : Math.round(interval * easeFactor * 1.3);
        easeFactor += 0.15;
        repetitions += 1;
        break;
    }

    return {
      interval,
      easeFactor,
      repetitions,
      nextReview: new Date(Date.now() + interval * 86400000),
      lastReviewed: new Date(),
    };
  };

  const handleRate = (difficulty: Difficulty) => {
    if (!currentCard) return;

    const updates = calculateNextInterval(currentCard, difficulty);
    setCards((prev) =>
      prev.map((c) => (c.id === currentCard.id ? { ...c, ...updates } : c))
    );
    setSessionStats((prev) => ({ ...prev, reviewed: prev.reviewed + 1, [difficulty]: prev[difficulty] + 1 }));
    setShowAnswer(false);

    if (currentIndex + 1 >= reviewQueue.length) {
      setIsReviewing(false);
      toast.success(`Session complete! Reviewed ${sessionStats.reviewed + 1} cards.`);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const startSession = () => {
    if (dueCards.length === 0) {
      toast.info("No cards due for review right now!");
      return;
    }
    setCurrentIndex(0);
    setShowAnswer(false);
    setSessionStats({ reviewed: 0, again: 0, hard: 0, good: 0, easy: 0 });
    setIsReviewing(true);
  };

  const masteredCards = cards.filter((c) => c.repetitions >= 3);
  const learningCards = cards.filter((c) => c.repetitions > 0 && c.repetitions < 3);
  const newCards = cards.filter((c) => c.repetitions === 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ApplicantSidebar onCollapse={setSidebarCollapsed} />
      <Header
        sidebarCollapsed={sidebarCollapsed}
        userRole="Student"
        mobileSidebar={<ApplicantSidebarContent onItemClick={() => {}} />}
      />

      <main
        className={cn(
          "pt-20 pb-10 px-4 sm:px-6 transition-all duration-300",
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-64",
          "ml-0"
        )}
      >
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Brain className="w-7 h-7 text-accent" />
                Spaced Repetition
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Review cards at optimal intervals to maximize long-term retention.
              </p>
            </div>
            <Button onClick={startSession} className="gap-2" disabled={isReviewing}>
              <Zap className="w-4 h-4" />
              Start Review ({dueCards.length} due)
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <Layers className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Total Cards</p>
              <p className="text-2xl font-bold">{cards.length}</p>
            </Card>
            <Card className="p-4 text-center">
              <Clock className="w-5 h-5 mx-auto mb-1 text-warning-foreground" />
              <p className="text-xs text-muted-foreground">Due Today</p>
              <p className="text-2xl font-bold text-primary">{dueCards.length}</p>
            </Card>
            <Card className="p-4 text-center">
              <TrendingUp className="w-5 h-5 mx-auto mb-1 text-success" />
              <p className="text-xs text-muted-foreground">Learning</p>
              <p className="text-2xl font-bold text-success">{learningCards.length}</p>
            </Card>
            <Card className="p-4 text-center">
              <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-accent" />
              <p className="text-xs text-muted-foreground">Mastered</p>
              <p className="text-2xl font-bold text-accent">{masteredCards.length}</p>
            </Card>
          </div>

          {/* Review Card */}
          {isReviewing && currentCard ? (
            <Card className="p-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline">{currentCard.topic}</Badge>
                <span className="text-xs text-muted-foreground">
                  {currentIndex + 1} / {reviewQueue.length}
                </span>
              </div>
              <Progress value={((currentIndex + 1) / reviewQueue.length) * 100} className="mb-6 h-1.5" />

              <div className="text-center space-y-6">
                <p className="text-lg font-medium leading-relaxed">{currentCard.question}</p>

                {showAnswer ? (
                  <>
                    <div className="border-t border-border pt-6">
                      <p className="text-muted-foreground leading-relaxed">{currentCard.answer}</p>
                    </div>
                    <div className="grid grid-cols-4 gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => handleRate("again")}
                        className="flex flex-col gap-0.5 h-auto py-3 border-destructive/30 text-destructive hover:bg-destructive/10"
                      >
                        <XCircle className="w-4 h-4" />
                        <span className="text-xs">Again</span>
                        <span className="text-[10px] opacity-60">1d</span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleRate("hard")}
                        className="flex flex-col gap-0.5 h-auto py-3 border-warning/30 text-warning-foreground hover:bg-warning/10"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span className="text-xs">Hard</span>
                        <span className="text-[10px] opacity-60">{Math.max(1, Math.round(currentCard.interval * 1.2))}d</span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleRate("good")}
                        className="flex flex-col gap-0.5 h-auto py-3 border-success/30 text-success hover:bg-success/10"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs">Good</span>
                        <span className="text-[10px] opacity-60">
                          {currentCard.repetitions === 0 ? 1 : currentCard.repetitions === 1 ? 4 : Math.round(currentCard.interval * currentCard.easeFactor)}d
                        </span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleRate("easy")}
                        className="flex flex-col gap-0.5 h-auto py-3 border-primary/30 text-primary hover:bg-primary/10"
                      >
                        <Zap className="w-4 h-4" />
                        <span className="text-xs">Easy</span>
                        <span className="text-[10px] opacity-60">
                          {currentCard.repetitions === 0 ? 4 : Math.round(currentCard.interval * currentCard.easeFactor * 1.3)}d
                        </span>
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button onClick={() => setShowAnswer(true)} size="lg" className="mt-4">
                    Show Answer
                  </Button>
                )}
              </div>
            </Card>
          ) : sessionStats.reviewed > 0 ? (
            <Card className="p-8 max-w-2xl mx-auto text-center">
              <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
              <h2 className="text-xl font-bold mb-2">Session Complete!</h2>
              <p className="text-muted-foreground mb-4">You reviewed {sessionStats.reviewed} cards</p>
              <div className="flex justify-center gap-4 text-sm">
                <span className="text-destructive">Again: {sessionStats.again}</span>
                <span className="text-warning-foreground">Hard: {sessionStats.hard}</span>
                <span className="text-success">Good: {sessionStats.good}</span>
                <span className="text-primary">Easy: {sessionStats.easy}</span>
              </div>
              <Button onClick={startSession} className="mt-6 gap-2" disabled={dueCards.length === 0}>
                <RotateCcw className="w-4 h-4" /> Review Again ({dueCards.length} due)
              </Button>
            </Card>
          ) : null}

          {/* Card Overview */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">All Cards</h2>
            <div className="space-y-2">
              {cards.map((card) => {
                const isDue = card.nextReview <= new Date();
                return (
                  <div key={card.id} className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{card.question}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px]">{card.topic}</Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {card.repetitions === 0 ? "New" : `${card.repetitions} reviews`}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                      {isDue ? (
                        <Badge className="bg-primary/15 text-primary border-primary/30 text-[10px]">Due</Badge>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">
                          Next: {Math.ceil((card.nextReview.getTime() - Date.now()) / 86400000)}d
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Info */}
          <Card className="p-5 border-accent/20 bg-accent/5">
            <h3 className="font-semibold text-sm mb-2">🧠 How Spaced Repetition Works</h3>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li>• Cards you find <strong>easy</strong> appear less frequently (longer intervals).</li>
              <li>• Cards you struggle with (<strong>again/hard</strong>) reset to shorter intervals.</li>
              <li>• The algorithm adapts to your performance using the <strong>SM-2 method</strong>.</li>
              <li>• Review daily for best results – consistency beats volume.</li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SpacedRepetition;
