import { useState, useEffect } from "react";
import { InstructorPageLayout } from "@/components/instructor/InstructorPageLayout";
import { GraduationCap, Users, TrendingUp, AlertTriangle, BookOpen, BarChart3, ClipboardList, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { useCourses } from "@/hooks/useCourses";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--warning))"];

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const { courses, fetchInstructorCourses, loading } = useCourses();
  const { user, isMockUser } = useAuth();
  const [stats, setStats] = useState({ totalStudents: 0, completionRate: 0, pendingQuizzes: 0, avgQuizScore: 0 });
  const [engagementData, setEngagementData] = useState<any[]>([]);
  const [courseDistribution, setCourseDistribution] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<{ icon: any; text: string; color: string }[]>([]);

  useEffect(() => { fetchInstructorCourses(); }, []);

  useEffect(() => {
    if (isMockUser) {
      setStats({ totalStudents: 245, completionRate: 68, pendingQuizzes: 4, avgQuizScore: 78 });
      setEngagementData([
        { week: "W1", students: 120, completions: 45 },
        { week: "W2", students: 135, completions: 52 },
        { week: "W3", students: 150, completions: 60 },
        { week: "W4", students: 142, completions: 58 },
        { week: "W5", students: 168, completions: 72 },
        { week: "W6", students: 180, completions: 85 },
      ]);
      setCourseDistribution([
        { name: "Published", value: 5 },
        { name: "Draft", value: 3 },
        { name: "Archived", value: 1 },
      ]);
      setAiInsights([
        { icon: AlertTriangle, text: "3 students haven't logged in this week", color: "text-warning" },
        { icon: TrendingUp, text: "Quiz scores improved 12% after adding flashcards", color: "text-success" },
        { icon: Sparkles, text: "Consider adding practice exercises to Chapter 4", color: "text-primary" },
      ]);
      return;
    }
    if (!user || courses.length === 0) {
      setAiInsights([{ icon: Sparkles, text: "Create your first course to see AI-powered insights", color: "text-primary" }]);
      return;
    }

    // Real data queries
    const fetchRealStats = async () => {
      const courseIds = courses.map((c) => c.id);

      // Total students across all courses
      const { count: totalStudents } = await supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .in("course_id", courseIds);

      // Completion rate: enrollments with completed_at / total
      const { count: completedCount } = await supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .in("course_id", courseIds)
        .not("completed_at", "is", null);

      const completionRate = totalStudents ? Math.round(((completedCount || 0) / totalStudents) * 100) : 0;

      // Quiz stats
      const { data: quizResults } = await supabase
        .from("quiz_results")
        .select("percentage, quiz_id, quizzes!inner(course_id)")
        .in("quizzes.course_id", courseIds);

      const avgQuizScore = quizResults && quizResults.length > 0
        ? Math.round(quizResults.reduce((sum, r) => sum + Number(r.percentage), 0) / quizResults.length)
        : 0;

      // Pending quizzes (quizzes with no results yet)
      const { data: allQuizzes } = await supabase.from("quizzes").select("id").in("course_id", courseIds);
      const quizIdsWithResults = new Set((quizResults || []).map((r) => r.quiz_id));
      const pendingQuizzes = (allQuizzes || []).filter((q) => !quizIdsWithResults.has(q.id)).length;

      setStats({ totalStudents: totalStudents || 0, completionRate, pendingQuizzes, avgQuizScore });

      // Course distribution
      const published = courses.filter((c) => c.status === "published").length;
      const draft = courses.filter((c) => c.status === "draft").length;
      const archived = courses.filter((c) => c.status === "archived").length;
      setCourseDistribution([
        { name: "Published", value: published },
        { name: "Draft", value: draft },
        { name: "Archived", value: archived },
      ].filter((d) => d.value > 0));

      // Build AI insights from real data
      const insights: { icon: any; text: string; color: string }[] = [];
      if (completionRate < 30) insights.push({ icon: AlertTriangle, text: `Course completion rate is ${completionRate}% — consider adding more engaging content`, color: "text-warning" });
      if (avgQuizScore > 0 && avgQuizScore < 60) insights.push({ icon: AlertTriangle, text: `Average quiz score is ${avgQuizScore}% — students may need more preparation material`, color: "text-warning" });
      if (avgQuizScore >= 80) insights.push({ icon: TrendingUp, text: `Great quiz performance! Average score is ${avgQuizScore}%`, color: "text-success" });
      if (draft > 0) insights.push({ icon: Sparkles, text: `You have ${draft} draft course${draft > 1 ? "s" : ""} ready to publish`, color: "text-primary" });
      if (insights.length === 0) insights.push({ icon: Sparkles, text: "Your courses are performing well. Keep it up!", color: "text-primary" });
      setAiInsights(insights);
    };

    fetchRealStats();
  }, [courses, isMockUser, user]);

  return (
    <InstructorPageLayout>
      <section className="animate-slide-up">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-glow-accent">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
            </div>
            <p className="text-muted-foreground">Monitor student performance and manage your courses</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/instructor/courses")}><BookOpen className="w-4 h-4 mr-2" /> My Courses</Button>
            <Button className="gradient-accent text-white shadow-glow-accent" onClick={() => navigate("/instructor/create-course")}>Create Course</Button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
        <StatsCard icon={BookOpen} title="Total Courses" value={courses.length} variant="default" onClick={() => navigate("/instructor/courses")} />
        <StatsCard icon={Users} title="Total Students" value={stats.totalStudents} variant="primary" onClick={() => navigate("/instructor/students")} />
        <StatsCard icon={CheckCircle} title="Completion Rate" value={`${stats.completionRate}%`} variant="success" onClick={() => navigate("/instructor/analytics")} />
        <StatsCard icon={BarChart3} title="Avg Quiz Score" value={`${stats.avgQuizScore}%`} variant="warning" onClick={() => navigate("/instructor/quizzes")} />
      </section>

      <section className="grid md:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
        <Card className="shadow-soft border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Student Engagement</CardTitle>
            <CardDescription>Weekly active students & lesson completions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                  <XAxis dataKey="week" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))" }} />
                  <Bar dataKey="students" name="Active Students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completions" name="Completions" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Course Status Distribution</CardTitle>
            <CardDescription>Breakdown of your courses by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] flex items-center justify-center">
              {courseDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={courseDistribution} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {courseDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground text-sm">No courses yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="animate-slide-up" style={{ animationDelay: "300ms" }}>
        <Card className="shadow-soft border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <CardTitle className="text-base">AI Insights</CardTitle>
            </div>
            <CardDescription>Smart observations about your courses and students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiInsights.map((insight, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <insight.icon className={`w-5 h-5 ${insight.color} flex-shrink-0`} />
                  <span className="text-sm">{insight.text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </InstructorPageLayout>
  );
};

export default InstructorDashboard;
