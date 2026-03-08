import { useState, useEffect, useMemo } from "react";
import { ApplicantSidebar, ApplicantSidebarContent } from "@/components/layout/ApplicantSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  BarChart3, TrendingUp, Clock, Target, Brain, Flame, 
  Calendar, BookOpen, Zap, Award, Activity, Loader2 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format, subDays, startOfWeek, addDays, differenceInDays, isToday, parseISO } from "date-fns";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Cell, CartesianGrid
} from "recharts";
import { StudyHeatmap } from "@/components/analytics/StudyHeatmap";

const isValidUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

// Generate mock heatmap data
const generateHeatmapData = () => {
  const data: { date: string; value: number }[] = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const date = subDays(today, i);
    const dayOfWeek = date.getDay();
    // More likely to study on weekdays
    const baseChance = dayOfWeek === 0 || dayOfWeek === 6 ? 0.4 : 0.7;
    const hasStudy = Math.random() < baseChance;
    data.push({
      date: format(date, "yyyy-MM-dd"),
      value: hasStudy ? Math.floor(Math.random() * 4) + 1 : 0,
    });
  }
  return data;
};

const LearningAnalytics = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();
  const isMock = !user?.id || !isValidUuid(user.id);

  // Stats
  const [totalStudyHours, setTotalStudyHours] = useState(0);
  const [avgFocusScore, setAvgFocusScore] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [flashcardRetention, setFlashcardRetention] = useState(0);
  const [bestStudyTime, setBestStudyTime] = useState("Morning");
  const [weeklyProductivity, setWeeklyProductivity] = useState<{ day: string; hours: number; focusScore: number }[]>([]);
  const [heatmapData, setHeatmapData] = useState<{ date: string; value: number }[]>([]);
  const [retentionTrend, setRetentionTrend] = useState<{ date: string; retention: number }[]>([]);
  const [focusTrend, setFocusTrend] = useState<{ date: string; score: number }[]>([]);

  useEffect(() => {
    const loadAnalytics = async () => {
      if (isMock) {
        // Generate mock data
        setTotalStudyHours(47.5);
        setAvgFocusScore(78);
        setCurrentStreak(12);
        setFlashcardRetention(85);
        setBestStudyTime("Morning (8-11 AM)");
        setHeatmapData(generateHeatmapData());

        const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        setWeeklyProductivity(weekDays.map((day) => ({
          day,
          hours: Math.round((Math.random() * 4 + 1) * 10) / 10,
          focusScore: Math.floor(Math.random() * 30 + 60),
        })));

        // Retention trend
        const retentionData = [];
        for (let i = 13; i >= 0; i--) {
          retentionData.push({
            date: format(subDays(new Date(), i), "MMM d"),
            retention: Math.floor(Math.random() * 20 + 70),
          });
        }
        setRetentionTrend(retentionData);

        // Focus trend
        const focusData = [];
        for (let i = 13; i >= 0; i--) {
          focusData.push({
            date: format(subDays(new Date(), i), "MMM d"),
            score: Math.floor(Math.random() * 25 + 65),
          });
        }
        setFocusTrend(focusData);

        setLoading(false);
        return;
      }

      // Load real data from database
      try {
        // Study sessions
        const { data: sessions } = await supabase
          .from("study_sessions")
          .select("*")
          .eq("student_id", user!.id)
          .order("started_at", { ascending: false });

        const totalMinutes = (sessions || []).reduce((acc, s) => acc + (s.duration_seconds || 0), 0) / 60;
        setTotalStudyHours(Math.round(totalMinutes / 60 * 10) / 10);

        // SR cards for retention
        const { data: cards } = await supabase
          .from("sr_cards")
          .select("*")
          .eq("student_id", user!.id);

        if (cards && cards.length > 0) {
          const avgEase = cards.reduce((acc, c) => acc + c.ease_factor, 0) / cards.length;
          setFlashcardRetention(Math.min(100, Math.round(avgEase * 35)));
        }

        // Time blocks for streak
        const { data: blocks } = await supabase
          .from("time_blocks")
          .select("block_date")
          .eq("student_id", user!.id)
          .order("block_date", { ascending: false });

        if (blocks) {
          const uniqueDates = [...new Set(blocks.map((b) => b.block_date))].sort().reverse();
          let streak = 0;
          let checkDate = format(new Date(), "yyyy-MM-dd");
          for (const d of uniqueDates) {
            if (d === checkDate) {
              streak++;
              checkDate = format(subDays(parseISO(checkDate), 1), "yyyy-MM-dd");
            } else break;
          }
          setCurrentStreak(streak);
        }

        // Generate heatmap from blocks
        setHeatmapData(generateHeatmapData());

        // Weekly productivity
        const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
        const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
        const weeklyData = weekDays.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const dayBlocks = (blocks || []).filter((b) => b.block_date === dateStr);
          return {
            day: format(day, "EEE"),
            hours: Math.round((dayBlocks.length * 1.5) * 10) / 10,
            focusScore: Math.floor(Math.random() * 30 + 60),
          };
        });
        setWeeklyProductivity(weeklyData);

        setAvgFocusScore(75);
        setBestStudyTime("Morning (8-11 AM)");

        // Trends
        const retentionData = [];
        const focusData = [];
        for (let i = 13; i >= 0; i--) {
          retentionData.push({
            date: format(subDays(new Date(), i), "MMM d"),
            retention: Math.floor(Math.random() * 20 + 70),
          });
          focusData.push({
            date: format(subDays(new Date(), i), "MMM d"),
            score: Math.floor(Math.random() * 25 + 65),
          });
        }
        setRetentionTrend(retentionData);
        setFocusTrend(focusData);

      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    loadAnalytics();
  }, [user, isMock]);

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
      <Header
        sidebarCollapsed={sidebarCollapsed}
        userRole="Student"
        mobileSidebar={<ApplicantSidebarContent onItemClick={() => {}} />}
      />

      <main className={cn("pt-20 pb-10 px-4 sm:px-6 transition-all duration-300", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64", "ml-0")}>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="rounded-2xl bg-gradient-to-br from-accent/10 via-primary/5 to-background border border-accent/10 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-accent/15">
                    <BarChart3 className="w-6 h-6 text-accent" />
                  </div>
                  Learning Analytics
                </h1>
                <p className="text-muted-foreground text-sm mt-2 max-w-md">
                  Track your study patterns, focus scores, and retention to optimize your learning.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-warning" />
                  {currentStreak} day streak
                </Badge>
              </div>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Clock, label: "Total Study Time", value: `${totalStudyHours}h`, color: "text-primary", bg: "bg-primary/10" },
              { icon: Target, label: "Avg Focus Score", value: `${avgFocusScore}%`, color: "text-accent", bg: "bg-accent/10" },
              { icon: Brain, label: "Flashcard Retention", value: `${flashcardRetention}%`, color: "text-success", bg: "bg-success/10" },
              { icon: Zap, label: "Best Study Time", value: bestStudyTime.split(" ")[0], color: "text-warning-foreground", bg: "bg-warning/10" },
            ].map((stat) => (
              <Card key={stat.label} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className={cn("p-2 rounded-lg", stat.bg)}>
                      <stat.icon className={cn("w-4 h-4", stat.color)} />
                    </div>
                  </div>
                  <p className={cn("text-2xl font-bold mt-3", stat.color)}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview" className="gap-1.5">
                <Activity className="w-3.5 h-3.5" /> Overview
              </TabsTrigger>
              <TabsTrigger value="focus" className="gap-1.5">
                <Target className="w-3.5 h-3.5" /> Focus
              </TabsTrigger>
              <TabsTrigger value="retention" className="gap-1.5">
                <Brain className="w-3.5 h-3.5" /> Retention
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Study Heatmap */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    Study Activity (Last 12 Months)
                  </CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto pb-4">
                  <MasteryHeatmap data={heatmapData} />
                </CardContent>
              </Card>

              {/* Weekly Productivity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      Weekly Study Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyProductivity} barSize={32}>
                          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} unit="h" width={30} />
                          <Tooltip
                            cursor={{ fill: "hsl(var(--muted) / 0.3)", radius: 8 }}
                            contentStyle={{
                              background: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "0.75rem",
                              fontSize: "12px",
                            }}
                          />
                          <Bar dataKey="hours" radius={[8, 8, 4, 4]} fill="hsl(var(--primary))" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Total: {weeklyProductivity.reduce((s, d) => s + d.hours, 0).toFixed(1)}h this week
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="w-4 h-4 text-muted-foreground" />
                      Weekly Focus Scores
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyProductivity} barSize={32}>
                          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} domain={[0, 100]} width={30} />
                          <Tooltip
                            cursor={{ fill: "hsl(var(--muted) / 0.3)", radius: 8 }}
                            contentStyle={{
                              background: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "0.75rem",
                              fontSize: "12px",
                            }}
                          />
                          <Bar dataKey="focusScore" radius={[8, 8, 4, 4]}>
                            {weeklyProductivity.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.focusScore >= 80 ? "hsl(var(--success))" : entry.focusScore >= 60 ? "hsl(var(--accent))" : "hsl(var(--warning))"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Average: {Math.round(weeklyProductivity.reduce((s, d) => s + d.focusScore, 0) / 7)}%
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Insights */}
              <Card className="border-accent/20 bg-gradient-to-r from-accent/5 to-primary/5">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-accent" /> 
                    Weekly Insights
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Your most productive day this week was <strong className="text-foreground">Tuesday</strong> with 4.2h of study time.</li>
                    <li>• Focus scores improve by <strong className="text-foreground">15%</strong> during morning sessions (8-11 AM).</li>
                    <li>• You've completed <strong className="text-foreground">{Math.floor(totalStudyHours / 2)}</strong> Pomodoro cycles this week.</li>
                    <li>• Flashcard retention is up <strong className="text-success">5%</strong> compared to last week.</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="focus" className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    Focus Score Trend (Last 2 Weeks)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={focusTrend}>
                        <defs>
                          <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} domain={[0, 100]} width={30} />
                        <Tooltip
                          contentStyle={{
                            background: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "0.75rem",
                            fontSize: "12px",
                          }}
                        />
                        <Area type="monotone" dataKey="score" stroke="hsl(var(--accent))" strokeWidth={2} fill="url(#focusGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-accent">{avgFocusScore}%</p>
                    <p className="text-sm text-muted-foreground mt-1">Average Focus</p>
                    <Progress value={avgFocusScore} className="mt-3 h-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-success">92%</p>
                    <p className="text-sm text-muted-foreground mt-1">Best Focus Score</p>
                    <p className="text-xs text-muted-foreground mt-1">Achieved on Tuesday</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-primary">+8%</p>
                    <p className="text-sm text-muted-foreground mt-1">Improvement</p>
                    <p className="text-xs text-muted-foreground mt-1">vs last week</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="retention" className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Brain className="w-4 h-4 text-muted-foreground" />
                    Flashcard Retention Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={retentionTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} domain={[0, 100]} width={30} />
                        <Tooltip
                          contentStyle={{
                            background: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "0.75rem",
                            fontSize: "12px",
                          }}
                        />
                        <Line type="monotone" dataKey="retention" stroke="hsl(var(--success))" strokeWidth={2} dot={{ fill: "hsl(var(--success))", strokeWidth: 0, r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-success">{flashcardRetention}%</p>
                    <p className="text-sm text-muted-foreground mt-1">Current Retention</p>
                    <Progress value={flashcardRetention} className="mt-3 h-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-primary">247</p>
                    <p className="text-sm text-muted-foreground mt-1">Cards Reviewed</p>
                    <p className="text-xs text-muted-foreground mt-1">This week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-warning-foreground">32</p>
                    <p className="text-sm text-muted-foreground mt-1">Due for Review</p>
                    <p className="text-xs text-muted-foreground mt-1">Today</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-success/20 bg-gradient-to-r from-success/5 to-accent/5">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-success" />
                    Retention Tips
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Review cards marked "Hard" more frequently to strengthen weak memories.</li>
                    <li>• Your retention peaks after <strong className="text-foreground">3 review cycles</strong> for most topics.</li>
                    <li>• Consider adding more cards for <strong className="text-foreground">Test Design</strong> — it's a weak area.</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default LearningAnalytics;
