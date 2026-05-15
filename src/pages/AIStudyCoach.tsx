import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ApplicantSidebar, ApplicantSidebarContent } from "@/components/layout/ApplicantSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain, Send, User, Lightbulb, Target, CalendarDays, AlertTriangle,
  Sparkles, TrendingUp, Clock, Flame, BookOpen, RotateCcw, Loader2, Trash2, Zap
} from "lucide-react";
import { useStudyCoach } from "@/hooks/useStudyCoach";
import { useAchievements } from "@/hooks/useAchievements";
import ReactMarkdown from "react-markdown";

const AIStudyCoach = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const { messages, isLoading, studentData, dataLoading, sendMessage, generateInsights, clearMessages } = useStudyCoach();
  const { levelInfo, totalXP } = useAchievements();
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputMessage.trim() || isLoading) return;
    sendMessage(inputMessage, "chat");
    setInputMessage("");
  };

  const quickActions = [
    { label: "Daily Insights", icon: Lightbulb, mode: "insights", color: "text-amber-500" },
    { label: "Recommendations", icon: Target, mode: "recommendations", color: "text-emerald-500" },
    { label: "Weekly Plan", icon: CalendarDays, mode: "weekly_plan", color: "text-blue-500" },
    { label: "Weak Topics", icon: AlertTriangle, mode: "weak_topics", color: "text-rose-500" },
    { label: "Motivate Me", icon: Flame, mode: "motivation", color: "text-orange-500" },
  ];

  const statCards = studentData ? [
    { label: "Study Hours", value: `${studentData.totalStudyHours}h`, icon: Clock, color: "text-primary" },
    { label: "Streak", value: `${studentData.streak} days`, icon: Flame, color: "text-orange-500" },
    { label: "Cards Due", value: `${studentData.flashcardsDue}`, icon: RotateCcw, color: "text-rose-500" },
    { label: "Quiz Avg", value: `${studentData.quizAverage}%`, icon: TrendingUp, color: "text-emerald-500" },
    { label: "Retention", value: `${studentData.retentionRate}%`, icon: Brain, color: "text-violet-500" },
    { label: "Focus", value: `${studentData.avgFocusScore}%`, icon: Target, color: "text-blue-500" },
  ] : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ApplicantSidebar onCollapse={setSidebarCollapsed} />
      <Header sidebarCollapsed={sidebarCollapsed} userRole="Student" mobileSidebar={<ApplicantSidebarContent onItemClick={() => {}} />} />

      <main className={cn("pt-20 pb-8 px-4 sm:px-6 transition-all duration-300", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64", "ml-0")}>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header with Level */}
          <section className="animate-slide-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow-primary">
                  <Brain className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">AI Study Coach</h1>
                  <p className="text-muted-foreground text-sm">Your personal learning mentor — powered by AI</p>
                </div>
              </div>
              {levelInfo && (
                <div className="hidden sm:flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Level {levelInfo.level}</p>
                    <p className="text-sm font-semibold">{levelInfo.title}</p>
                  </div>
                  <div className="w-24">
                    <Progress value={(levelInfo.currentXP / levelInfo.xpForNext) * 100} className="h-2" />
                    <p className="text-[10px] text-muted-foreground text-center mt-0.5">{totalXP} XP</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Stats Overview */}
          {dataLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading your learning data...</span>
            </div>
          ) : (
            <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 animate-slide-up" style={{ animationDelay: "100ms" }}>
              {statCards.map((s) => (
                <Card key={s.label} className="border-border/50">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <s.icon className={cn("w-5 h-5 mb-1", s.color)} />
                    <p className="text-lg font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </CardContent>
                </Card>
              ))}
            </section>
          )}



          <div className="space-y-10">
            {/* Coach Insights Section */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <section className="animate-slide-up" style={{ animationDelay: "200ms" }}>
                <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {quickActions.map((action) => (
                    <Button
                      key={action.mode}
                      variant="outline"
                      className="h-auto py-4 flex flex-col items-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all"
                      onClick={() => generateInsights(action.mode)}
                      disabled={isLoading}
                    >
                      <action.icon className={cn("w-6 h-6", action.color)} />
                      <span className="text-xs font-medium">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </section>

              {/* Smart Alerts */}
              <section className="animate-slide-up" style={{ animationDelay: "300ms" }}>
                <h2 className="text-lg font-semibold mb-3">Smart Alerts</h2>
                <div className="space-y-3">
                  {studentData && studentData.flashcardsDue > 0 && (
                    <Card className="border-rose-500/30 bg-rose-500/5">
                      <CardContent className="p-4 flex items-center gap-3">
                        <RotateCcw className="w-5 h-5 text-rose-500 shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{studentData.flashcardsDue} flashcards due for review</p>
                          <p className="text-xs text-muted-foreground">Reviewing now will strengthen your memory retention</p>
                        </div>
                        <Button size="sm" variant="outline" className="shrink-0" onClick={() => navigate('/spaced-repetition')}>Review Now</Button>
                      </CardContent>
                    </Card>
                  )}
                  {studentData && studentData.streak > 0 && (
                    <Card className="border-orange-500/30 bg-orange-500/5">
                      <CardContent className="p-4 flex items-center gap-3">
                        <Flame className="w-5 h-5 text-orange-500 shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">🔥 {studentData.streak}-day study streak!</p>
                          <p className="text-xs text-muted-foreground">Complete one session today to keep it going</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {studentData && studentData.weakTopics.length > 0 && (
                    <Card className="border-amber-500/30 bg-amber-500/5">
                      <CardContent className="p-4 flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Weak topics: {studentData.weakTopics.slice(0, 2).join(', ')}</p>
                          <p className="text-xs text-muted-foreground">Extra review recommended for better retention</p>
                        </div>
                        <Button size="sm" variant="outline" className="shrink-0" onClick={() => generateInsights("weak_topics")}>Get Help</Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </section>

              {/* Suggested Questions */}
              <section className="animate-slide-up" style={{ animationDelay: "400ms" }}>
                <h2 className="text-lg font-semibold mb-3">Ask Your Coach</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    "What should I study today?",
                    "Why is my retention rate low?",
                    "Create a study plan for my exam next week",
                    "How can I improve my focus score?",
                    "Which flashcards need the most attention?",
                    "Am I on track to pass my exam?",
                  ].map((q) => (
                    <Button key={q} variant="ghost" className="justify-start text-left h-auto py-3 px-4 text-sm text-muted-foreground hover:text-foreground hover:bg-muted" onClick={() => sendMessage(q, "chat")} disabled={isLoading}>
                      <Sparkles className="w-4 h-4 mr-2 text-primary shrink-0" />
                      {q}
                    </Button>
                  ))}
                </div>
              </section>
            </div>

            {/* Chat Section */}
            <Card className="h-[600px] flex flex-col animate-slide-up" style={{ animationDelay: "500ms" }}>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-lg">Coach Chat</CardTitle>
                  <CardDescription>Ask anything about your study progress</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={clearMessages} className="text-muted-foreground">
                  <Trash2 className="w-4 h-4 mr-1" /> Clear
                </Button>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full px-4 pb-4" ref={scrollRef as any}>
                  <div className="space-y-4 py-2">
                    {messages.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        <Brain className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">Start a conversation with your AI Study Coach.</p>
                        <p className="text-xs mt-1">Use the Quick Actions or type a question below.</p>
                      </div>
                    )}
                    {messages.map((msg) => (
                      <div key={msg.id} className={cn("flex gap-3 max-w-[85%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto")}>
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", msg.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted")}>
                          {msg.role === 'user' ? <User className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
                        </div>
                        <div className={cn("rounded-2xl px-4 py-3 text-sm", msg.role === 'user' ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted border border-border/50 rounded-tl-none")}>
                          {msg.role === 'assistant' ? (
                            <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2 [&>ul]:mb-2 [&>ol]:mb-2 [&>h1]:text-base [&>h2]:text-sm [&>h3]:text-sm">
                              <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                          ) : (
                            <span className="whitespace-pre-wrap">{msg.content}</span>
                          )}
                        </div>
                      </div>
                    ))}
                    {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                      <div className="flex gap-3 mr-auto">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <Brain className="w-4 h-4" />
                        </div>
                        <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
                          <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
              <div className="p-4 border-t">
                <form className="flex gap-2" onSubmit={handleSend}>
                  <Input placeholder="Ask your AI Coach..." value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} disabled={isLoading} className="rounded-xl" />
                  <Button type="submit" size="icon" disabled={isLoading || !inputMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIStudyCoach;
