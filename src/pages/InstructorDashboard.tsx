import { useState, useEffect } from "react";
import { InstructorPageLayout } from "@/components/instructor/InstructorPageLayout";
import { 
  GraduationCap, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  BookOpen, 
  BarChart3, 
  CheckCircle, 
  Sparkles, 
  Plus, 
  Clock 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { useCourses } from "@/hooks/useCourses";
import { useAuth } from "@/hooks/useAuth";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { getInstructorCourses, getLearners } from "@/lib/instructorData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--warning))"];

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const { fetchInstructorCourses, createCourse, loading: coursesLoading } = useCourses();
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalStudents: 0, completionRate: 0, avgQuizScore: 0, draftCount: 0 });
  const [engagementData, setEngagementData] = useState<any[]>([]);
  const [courseDistribution, setCourseDistribution] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<{ icon: any; text: string; color: string; action?: () => void }[]>([]);
  const [alerts, setAlerts] = useState<{ text: string; type: "warning" | "danger" | "info"; actionText?: string; onAction?: () => void }[]>([]);

  // Course Creation Dialog State
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    category: "",
    level: "beginner",
  });

  const loadDashboardData = async () => {
    const localCourses = getInstructorCourses();
    const localLearners = getLearners();

    setCourses(localCourses);

    // Calculate dynamic stats
    const totalStudents = localLearners.length;
    const avgProgress = totalStudents > 0 
      ? Math.round(localLearners.reduce((acc, l) => acc + l.totalProgress, 0) / totalStudents)
      : 0;
    const avgScore = totalStudents > 0
      ? Math.round(localLearners.reduce((acc, l) => acc + l.averageScore, 0) / totalStudents)
      : 0;
    const draftCount = localCourses.filter(c => c.status === "draft").length;

    setStats({
      totalStudents,
      completionRate: avgProgress,
      avgQuizScore: avgScore,
      draftCount
    });

    // Mock engagement weekly graph
    setEngagementData([
      { week: "W1", students: 120, completions: 45 },
      { week: "W2", students: 135, completions: 52 },
      { week: "W3", students: 150, completions: 60 },
      { week: "W4", students: 142, completions: 58 },
      { week: "W5", students: 168, completions: 72 },
      { week: "W6", students: totalStudents * 30 + 30, completions: Math.round(avgProgress * 1.1) },
    ]);

    // Status breakdown
    const published = localCourses.filter((c) => c.status === "published").length;
    const draft = localCourses.filter((c) => c.status === "draft").length;
    const archived = localCourses.filter((c) => c.status === "archived").length;
    setCourseDistribution([
      { name: "Published", value: published },
      { name: "Draft", value: draft },
      { name: "Archived", value: archived },
    ].filter((d) => d.value > 0));

    // Dynamic alerts
    const tempAlerts: any[] = [];
    localLearners.forEach(learner => {
      if (learner.totalProgress < 40 && !learner.isFlagged) {
        tempAlerts.push({
          text: `${learner.full_name} is struggling with low progress (${learner.totalProgress}%).`,
          type: "warning",
          actionText: "Intervene / Flag",
          onAction: () => navigate("/instructor/students")
        });
      }
    });

    if (draft > 0) {
      tempAlerts.push({
        text: `You have ${draft} course draft${draft > 1 ? "s" : ""} waiting to be published.`,
        type: "info",
        actionText: "Manage Courses",
        onAction: () => navigate("/instructor/courses")
      });
    }
    setAlerts(tempAlerts);

    // AI Insights
    const insights: any[] = [];
    if (avgProgress < 50) {
      insights.push({
        icon: AlertTriangle,
        text: "Average course completion is under 50%. Try adding interactive video micro-lessons to boost engagement.",
        color: "text-warning"
      });
    } else {
      insights.push({
        icon: CheckCircle,
        text: "Course completion and engagement trends are strong. Keep it up!",
        color: "text-success"
      });
    }

    insights.push({
      icon: TrendingUp,
      text: "Adding assessments and quizzes has proven to increase student retention by 15%.",
      color: "text-accent"
    });

    insights.push({
      icon: Sparkles,
      text: "AI Suggestion: ISTQB Foundation Chapter 2 contains high student drop-off. Consider breaking down sub-topics.",
      color: "text-primary",
      action: () => navigate("/instructor/analytics")
    });

    setAiInsights(insights);
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const handleCreateCourse = async () => {
    setCreating(true);
    const { data } = await createCourse(newCourse);
    setCreating(false);

    if (data) {
      setIsCreateDialogOpen(false);
      setNewCourse({ title: "", description: "", category: "", level: "beginner" });
      navigate(`/instructor/courses/${data.id}`);
    }
  };

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
              <h1 className="text-2xl font-bold">Learning Manager Dashboard</h1>
            </div>
            <p className="text-muted-foreground">Monitor learner progress, create content, and manage assessments</p>
          </div>
          <div className="flex gap-3">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-accent text-white shadow-glow-accent">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Course
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create New Course</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title</Label>
                    <Input
                      id="title"
                      value={newCourse.title}
                      onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                      placeholder="e.g., ISTQB Foundation Level"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newCourse.description}
                      onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                      placeholder="What will students learn?"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={newCourse.category}
                        onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                        placeholder="e.g., Certification"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="level">Level</Label>
                      <Select
                        value={newCourse.level}
                        onValueChange={(value) => setNewCourse({ ...newCourse, level: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    onClick={handleCreateCourse}
                    disabled={!newCourse.title || creating}
                    className="w-full"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Course"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={() => navigate("/instructor/quizzes")}>
              <Plus className="w-4 h-4 mr-2" />
              Create Assessment
            </Button>
          </div>
        </div>
      </section>

      {/* Alerts */}
      {alerts.length > 0 && (
        <section className="space-y-2 animate-slide-up" style={{ animationDelay: "50ms" }}>
          {alerts.map((alert, i) => (
            <div 
              key={i} 
              className={`flex items-center justify-between p-4 rounded-xl border ${
                alert.type === "warning" 
                  ? "bg-warning/10 border-warning/30 text-warning" 
                  : alert.type === "danger" 
                  ? "bg-destructive/10 border-destructive/30 text-destructive"
                  : "bg-info/10 border-info/30 text-primary"
              }`}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{alert.text}</span>
              </div>
              {alert.actionText && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="hover:bg-muted text-xs" 
                  onClick={alert.onAction}
                >
                  {alert.actionText}
                </Button>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Metrics */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
        <StatsCard icon={BookOpen} title="Total Courses" value={courses.length} variant="default" onClick={() => navigate("/instructor/courses")} />
        <StatsCard icon={Users} title="Total Learners" value={stats.totalStudents} variant="primary" onClick={() => navigate("/instructor/students")} />
        <StatsCard icon={CheckCircle} title="Average Progress" value={`${stats.completionRate}%`} variant="success" onClick={() => navigate("/instructor/analytics")} />
        <StatsCard icon={BarChart3} title="Avg Assessment Score" value={`${stats.avgQuizScore}%`} variant="warning" onClick={() => navigate("/instructor/quizzes")} />
      </section>

      {/* Charts */}
      <section className="grid md:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
        <Card className="shadow-soft border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Learner Engagement</CardTitle>
            <CardDescription>Weekly active learners & course completions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                  <XAxis dataKey="week" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))" }} />
                  <Bar dataKey="students" name="Active Learners" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
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

      {/* AI insights */}
      <section className="animate-slide-up" style={{ animationDelay: "300ms" }}>
        <Card className="shadow-soft border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <CardTitle className="text-base">AI Content Optimization Insights</CardTitle>
            </div>
            <CardDescription>Recommendations to improve course effectiveness and learner success rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiInsights.map((insight, i) => (
                <div 
                  key={i} 
                  className={`flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors ${insight.action ? "cursor-pointer" : ""}`}
                  onClick={insight.action}
                >
                  <div className="flex items-center gap-3">
                    <insight.icon className={`w-5 h-5 ${insight.color} flex-shrink-0`} />
                    <span className="text-sm">{insight.text}</span>
                  </div>
                  {insight.action && (
                    <Button variant="ghost" size="sm" className="text-xs text-accent hover:text-accent/80">
                      Optimize Content
                    </Button>
                  )}
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
