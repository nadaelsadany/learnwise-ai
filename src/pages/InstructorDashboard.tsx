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
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--warning))"];

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const { courses, fetchInstructorCourses, loading } = useCourses();
  const { user, isMockUser } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    completionRate: 0,
    pendingAssignments: 0,
  });
  const [engagementData, setEngagementData] = useState<any[]>([]);
  const [courseDistribution, setCourseDistribution] = useState<any[]>([]);

  useEffect(() => {
    fetchInstructorCourses();
  }, []);

  useEffect(() => {
    if (isMockUser) {
      setStats({ totalStudents: 245, activeStudents: 182, completionRate: 68, pendingAssignments: 12 });
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
      return;
    }

    if (!user || courses.length === 0) return;

    const published = courses.filter(c => c.status === "published").length;
    const draft = courses.filter(c => c.status === "draft").length;
    const archived = courses.filter(c => c.status === "archived").length;
    setCourseDistribution([
      { name: "Published", value: published },
      { name: "Draft", value: draft },
      { name: "Archived", value: archived },
    ].filter(d => d.value > 0));

    const totalStudents = courses.reduce((sum, c) => sum + (c.enrollmentCount || 0), 0);
    setStats(prev => ({ ...prev, totalStudents }));
  }, [courses, isMockUser, user]);

  const aiInsights = [
    { icon: AlertTriangle, text: "3 students haven't logged in this week", color: "text-warning" },
    { icon: TrendingUp, text: "Quiz scores improved 12% after adding flashcards", color: "text-success" },
    { icon: Sparkles, text: "Consider adding practice exercises to Chapter 4", color: "text-primary" },
  ];

  return (
    <InstructorPageLayout>
      {/* Header */}
      <section className="animate-slide-up">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-glow-accent">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
            </div>
            <p className="text-muted-foreground">
              Monitor student performance and manage your courses
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="hover:scale-105 transition-transform" onClick={() => navigate("/instructor/courses")}>
              <BookOpen className="w-4 h-4 mr-2" />
              My Courses
            </Button>
            <Button variant="default" className="gradient-accent text-white hover:scale-105 transition-transform shadow-glow-accent" onClick={() => navigate("/syllabus-upload")}>
              Create Course
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
        <StatsCard
          icon={BookOpen}
          title="Total Courses"
          value={courses.length}
          variant="default"
          onClick={() => navigate("/instructor/courses")}
        />
        <StatsCard
          icon={Users}
          title="Total Students"
          value={stats.totalStudents}
          variant="primary"
          onClick={() => navigate("/instructor/students")}
        />
        <StatsCard
          icon={CheckCircle}
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          variant="success"
        />
        <StatsCard
          icon={ClipboardList}
          title="Pending Reviews"
          value={stats.pendingAssignments}
          variant="warning"
          onClick={() => navigate("/instructor/assignments")}
        />
      </section>

      {/* Charts Row */}
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
                      {courseDistribution.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
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

      {/* AI Insights */}
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
