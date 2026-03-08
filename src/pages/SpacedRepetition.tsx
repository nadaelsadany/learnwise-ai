import { useState, useEffect } from "react";
import { ApplicantSidebar, ApplicantSidebarContent } from "@/components/layout/ApplicantSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Brain, RotateCcw, CheckCircle2, XCircle, Clock, Layers, TrendingUp, Zap, Plus, Loader2, Sparkles, BookOpen, Target } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ReviewCard {
  id: string;
  question: string;
  answer: string;
  topic: string;
  interval: number;
  easeFactor: number;
  repetitions: number;
  nextReview: Date;
  lastReviewed: Date | null;
}

type Difficulty = "again" | "hard" | "good" | "easy";

const isValidUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const defaultCards: ReviewCard[] = [
  { id: "d1", question: "What is equivalence partitioning?", answer: "A black-box test technique that divides input data into valid and invalid partitions, then selects representative values from each partition for test cases.", topic: "Test Design", interval: 1, easeFactor: 2.5, repetitions: 0, nextReview: new Date(), lastReviewed: null },
  { id: "d2", question: "What are the four test levels in the V-model?", answer: "Component testing, Integration testing, System testing, and Acceptance testing.", topic: "Fundamentals", interval: 1, easeFactor: 2.5, repetitions: 0, nextReview: new Date(), lastReviewed: null },
  { id: "d3", question: "Define boundary value analysis.", answer: "A technique that tests values at the exact boundaries of equivalence partitions (min, min+1, max-1, max) where defects often cluster.", topic: "Test Design", interval: 1, easeFactor: 2.5, repetitions: 0, nextReview: new Date(), lastReviewed: null },
  { id: "d4", question: "What is the difference between verification and validation?", answer: "Verification: Are we building the product right? Validation: Are we building the right product?", topic: "Fundamentals", interval: 1, easeFactor: 2.5, repetitions: 0, nextReview: new Date(), lastReviewed: null },
  { id: "d5", question: "What is regression testing?", answer: "Testing performed after code changes to confirm that existing functionality still works correctly.", topic: "Test Management", interval: 1, easeFactor: 2.5, repetitions: 0, nextReview: new Date(), lastReviewed: null },
  { id: "d6", question: "What is a test oracle?", answer: "A source to determine expected results to compare with the actual result of the software under test.", topic: "Fundamentals", interval: 1, easeFactor: 2.5, repetitions: 0, nextReview: new Date(), lastReviewed: null },
];

const difficultyConfig = {
  again: { label: "Again", icon: XCircle, color: "border-destructive/30 text-destructive hover:bg-destructive/10", interval: "1d" },
  hard: { label: "Hard", icon: RotateCcw, color: "border-warning/30 text-warning-foreground hover:bg-warning/10", interval: "" },
  good: { label: "Good", icon: CheckCircle2, color: "border-success/30 text-success hover:bg-success/10", interval: "" },
  easy: { label: "Easy", icon: Zap, color: "border-primary/30 text-primary hover:bg-primary/10", interval: "" },
};

const SpacedRepetition = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [cards, setCards] = useState<ReviewCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [sessionStats, setSessionStats] = useState({ reviewed: 0, again: 0, hard: 0, good: 0, easy: 0 });
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newCard, setNewCard] = useState({ question: "", answer: "", topic: "General" });
  const { user } = useAuth();
  const isMock = !user?.id || !isValidUuid(user.id);

  useEffect(() => {
    const load = async () => {
      if (isMock) { setCards(defaultCards); setLoading(false); return; }
      const { data, error } = await supabase.from("sr_cards").select("*").eq("student_id", user!.id).order("next_review");
      if (error) { console.error(error); setCards(defaultCards); }
      else if (data.length === 0) { setCards(defaultCards); }
      else {
        setCards(data.map((r: any) => ({
          id: r.id, question: r.question, answer: r.answer, topic: r.topic,
          interval: r.interval_days, easeFactor: Number(r.ease_factor), repetitions: r.repetitions,
          nextReview: new Date(r.next_review), lastReviewed: r.last_reviewed ? new Date(r.last_reviewed) : null,
        })));
      }
      setLoading(false);
    };
    load();
  }, [user, isMock]);

  const dueCards = cards.filter((c) => c.nextReview <= new Date());
  const currentCard = isReviewing ? dueCards[currentIndex] : null;

  const calculateNextInterval = (card: ReviewCard, difficulty: Difficulty) => {
    let { interval, easeFactor, repetitions } = card;
    switch (difficulty) {
      case "again": interval = 1; easeFactor = Math.max(1.3, easeFactor - 0.2); repetitions = 0; break;
      case "hard": interval = Math.max(1, Math.round(interval * 1.2)); easeFactor = Math.max(1.3, easeFactor - 0.15); repetitions += 1; break;
      case "good": interval = repetitions === 0 ? 1 : repetitions === 1 ? 4 : Math.round(interval * easeFactor); repetitions += 1; break;
      case "easy": interval = repetitions === 0 ? 4 : Math.round(interval * easeFactor * 1.3); easeFactor += 0.15; repetitions += 1; break;
    }
    return { interval, easeFactor, repetitions, nextReview: new Date(Date.now() + interval * 86400000), lastReviewed: new Date() };
  };

  const getIntervalLabel = (card: ReviewCard, difficulty: Difficulty) => {
    const result = calculateNextInterval({ ...card }, difficulty);
    return `${result.interval}d`;
  };

  const handleRate = async (difficulty: Difficulty) => {
    if (!currentCard) return;
    const updates = calculateNextInterval(currentCard, difficulty);
    setCards((prev) => prev.map((c) => (c.id === currentCard.id ? { ...c, ...updates } : c)));
    setSessionStats((prev) => ({ ...prev, reviewed: prev.reviewed + 1, [difficulty]: prev[difficulty] + 1 }));
    setShowAnswer(false);
    if (!isMock && isValidUuid(currentCard.id)) {
      await supabase.from("sr_cards").update({
        interval_days: updates.interval, ease_factor: updates.easeFactor, repetitions: updates.repetitions,
        next_review: updates.nextReview.toISOString(), last_reviewed: updates.lastReviewed!.toISOString(),
      }).eq("id", currentCard.id);
    }
    if (currentIndex + 1 >= dueCards.length) {
      setIsReviewing(false);
      toast.success(`Session complete! Reviewed ${sessionStats.reviewed + 1} cards.`);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const startSession = () => {
    if (dueCards.length === 0) { toast.info("No cards due for review!"); return; }
    setCurrentIndex(0); setShowAnswer(false);
    setSessionStats({ reviewed: 0, again: 0, hard: 0, good: 0, easy: 0 });
    setIsReviewing(true);
  };

  const addCard = async () => {
    if (!newCard.question || !newCard.answer) { toast.error("Fill question and answer"); return; }
    if (isMock) {
      setCards((p) => [...p, { id: Date.now().toString(), ...newCard, interval: 1, easeFactor: 2.5, repetitions: 0, nextReview: new Date(), lastReviewed: null }]);
    } else {
      const { data, error } = await supabase.from("sr_cards").insert({
        student_id: user!.id, question: newCard.question, answer: newCard.answer, topic: newCard.topic || "General",
      }).select().single();
      if (error) { toast.error("Failed to save card"); return; }
      setCards((p) => [...p, {
        id: data.id, question: data.question, answer: data.answer, topic: data.topic,
        interval: data.interval_days, easeFactor: Number(data.ease_factor), repetitions: data.repetitions,
        nextReview: new Date(data.next_review), lastReviewed: null,
      }]);
    }
    setNewCard({ question: "", answer: "", topic: "General" });
    setAddDialogOpen(false);
    toast.success("Card added!");
  };

  const masteredCards = cards.filter((c) => c.repetitions >= 3);
  const learningCards = cards.filter((c) => c.repetitions > 0 && c.repetitions < 3);
  const newCards = cards.filter((c) => c.repetitions === 0);
  const retentionRate = cards.length > 0 ? Math.round((masteredCards.length / cards.length) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ApplicantSidebar onCollapse={setSidebarCollapsed} />
      <Header sidebarCollapsed={sidebarCollapsed} userRole="Student" mobileSidebar={<ApplicantSidebarContent onItemClick={() => {}} />} />

      <main className={cn("pt-20 pb-10 px-4 sm:px-6 transition-all duration-300", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64", "ml-0")}>
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Hero Header */}
          <div className="rounded-2xl bg-gradient-to-br from-accent/10 via-primary/5 to-background border border-accent/10 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-accent/15">
                    <Brain className="w-6 h-6 text-accent" />
                  </div>
                  Spaced Repetition
                </h1>
                <p className="text-muted-foreground text-sm mt-2 max-w-md">Master your knowledge with scientifically-proven interval-based review.</p>
              </div>
              <div className="flex gap-2">
                <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2"><Plus className="w-4 h-4" /> Add Card</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Add Review Card</DialogTitle></DialogHeader>
                    <div className="space-y-4 pt-2">
                      <Input placeholder="Topic (e.g. Test Design)" value={newCard.topic} onChange={(e) => setNewCard({ ...newCard, topic: e.target.value })} />
                      <Textarea placeholder="Question" value={newCard.question} onChange={(e) => setNewCard({ ...newCard, question: e.target.value })} rows={3} />
                      <Textarea placeholder="Answer" value={newCard.answer} onChange={(e) => setNewCard({ ...newCard, answer: e.target.value })} rows={3} />
                      <Button onClick={addCard} className="w-full">Add Card</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button onClick={startSession} className="gap-2 shadow-md" disabled={isReviewing}>
                  <Zap className="w-4 h-4" /> Start Review ({dueCards.length} due)
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { icon: Layers, label: "Total Cards", value: cards.length, color: "text-foreground", iconColor: "text-muted-foreground" },
              { icon: Clock, label: "Due Today", value: dueCards.length, color: "text-primary", iconColor: "text-primary" },
              { icon: BookOpen, label: "New", value: newCards.length, color: "text-warning-foreground", iconColor: "text-warning" },
              { icon: TrendingUp, label: "Learning", value: learningCards.length, color: "text-success", iconColor: "text-success" },
              { icon: Target, label: "Mastered", value: masteredCards.length, color: "text-accent", iconColor: "text-accent" },
            ].map((stat) => (
              <Card key={stat.label} className="overflow-hidden">
                <CardContent className="p-4 text-center">
                  <stat.icon className={cn("w-5 h-5 mx-auto mb-1.5", stat.iconColor)} />
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</p>
                  <p className={cn("text-2xl font-bold mt-0.5", stat.color)}>{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Retention Progress */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" /> Retention Rate
                </span>
                <span className="text-sm font-bold text-accent">{retentionRate}%</span>
              </div>
              <Progress value={retentionRate} className="h-2" />
              <p className="text-[11px] text-muted-foreground mt-1.5">{masteredCards.length} of {cards.length} cards mastered (3+ successful reviews)</p>
            </CardContent>
          </Card>

          {/* Review Session */}
          {isReviewing && currentCard ? (
            <Card className="overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-primary via-accent to-success" style={{ width: `${((currentIndex + 1) / dueCards.length) * 100}%`, transition: "width 0.3s ease" }} />
              <CardContent className="p-6 sm:p-8 max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <Badge variant="outline" className="text-xs border-accent/30 text-accent">{currentCard.topic}</Badge>
                  <span className="text-xs text-muted-foreground font-medium">{currentIndex + 1} / {dueCards.length}</span>
                </div>
                <div className="text-center space-y-6">
                  <div className="py-4">
                    <p className="text-lg sm:text-xl font-semibold leading-relaxed">{currentCard.question}</p>
                  </div>
                  {showAnswer ? (
                    <>
                      <div className="border-t border-border pt-6 pb-2">
                        <p className="text-muted-foreground leading-relaxed">{currentCard.answer}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">How well did you remember?</p>
                      <div className="grid grid-cols-4 gap-2">
                        {(["again", "hard", "good", "easy"] as Difficulty[]).map((d) => {
                          const cfg = difficultyConfig[d];
                          const Icon = cfg.icon;
                          return (
                            <Button key={d} variant="outline" onClick={() => handleRate(d)} className={cn("flex flex-col gap-1 h-auto py-3", cfg.color)}>
                              <Icon className="w-4 h-4" />
                              <span className="text-xs font-semibold">{cfg.label}</span>
                              <span className="text-[10px] opacity-60">{getIntervalLabel(currentCard, d)}</span>
                            </Button>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <Button onClick={() => setShowAnswer(true)} size="lg" className="mt-4 shadow-md gap-2">
                      <BookOpen className="w-4 h-4" /> Show Answer
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : sessionStats.reviewed > 0 ? (
            <Card className="overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-success to-primary w-full" />
              <CardContent className="p-8 max-w-2xl mx-auto text-center">
                <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-success" />
                </div>
                <h2 className="text-xl font-bold mb-2">Session Complete!</h2>
                <p className="text-muted-foreground mb-6">You reviewed {sessionStats.reviewed} cards</p>
                <div className="flex justify-center gap-6 text-sm mb-6">
                  <div className="text-center"><p className="text-lg font-bold text-destructive">{sessionStats.again}</p><p className="text-[11px] text-muted-foreground">Again</p></div>
                  <div className="text-center"><p className="text-lg font-bold text-warning-foreground">{sessionStats.hard}</p><p className="text-[11px] text-muted-foreground">Hard</p></div>
                  <div className="text-center"><p className="text-lg font-bold text-success">{sessionStats.good}</p><p className="text-[11px] text-muted-foreground">Good</p></div>
                  <div className="text-center"><p className="text-lg font-bold text-primary">{sessionStats.easy}</p><p className="text-[11px] text-muted-foreground">Easy</p></div>
                </div>
                <Button onClick={startSession} className="gap-2" disabled={dueCards.length === 0}>
                  <RotateCcw className="w-4 h-4" /> Review Again ({dueCards.length} due)
                </Button>
              </CardContent>
            </Card>
          ) : null}

          {/* All Cards */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-muted-foreground" /> All Cards
                <Badge variant="secondary" className="ml-auto text-[11px]">{cards.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-2">
                {cards.map((card) => {
                  const isDue = card.nextReview <= new Date();
                  const statusColor = card.repetitions >= 3 ? "bg-accent" : card.repetitions > 0 ? "bg-success" : "bg-muted-foreground";
                  return (
                    <div key={card.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors group">
                      <span className={cn("w-2 h-2 rounded-full flex-shrink-0", statusColor)} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{card.question}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">{card.topic}</Badge>
                          <span className="text-[10px] text-muted-foreground">
                            {card.repetitions === 0 ? "New" : card.repetitions >= 3 ? "Mastered" : `${card.repetitions} reviews`}
                          </span>
                        </div>
                      </div>
                      {isDue ? (
                        <Badge className="bg-primary/15 text-primary border-primary/30 text-[10px] flex-shrink-0">Due</Badge>
                      ) : (
                        <span className="text-[10px] text-muted-foreground flex-shrink-0">
                          Next: {Math.ceil((card.nextReview.getTime() - Date.now()) / 86400000)}d
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="border-accent/15 bg-gradient-to-r from-accent/5 to-primary/5">
            <CardContent className="p-5">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">🧠 How Spaced Repetition Works</h3>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li>• Cards you find <strong>easy</strong> appear less frequently (longer intervals).</li>
                <li>• Cards you struggle with (<strong>again/hard</strong>) reset to shorter intervals.</li>
                <li>• The algorithm adapts to your performance using the <strong>SM-2 method</strong>.</li>
                <li>• Review daily for best results – consistency beats volume.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SpacedRepetition;
