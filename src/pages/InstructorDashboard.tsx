import { useState } from "react";
import { InstructorSidebar } from "@/components/layout/InstructorSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { MasteryHeatmap, mockStudentMastery, topics } from "@/components/mastery";
import { GraduationCap, Users, TrendingUp, AlertTriangle, BookOpen, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const InstructorDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  // Calculate some quick stats
  const avgMastery = Math.round(
    mockStudentMastery.reduce((sum, s) => sum + s.overallMastery, 0) / mockStudentMastery.length
  );
  const strugglingCount = mockStudentMastery.filter((s) => s.overallMastery < 40).length;
  const improvingCount = mockStudentMastery.filter((s) =>
    Object.values(s.topicScores).some((t) => t.trend === "improving")
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <InstructorSidebar onCollapse={setSidebarCollapsed} />
      <Header sidebarCollapsed={sidebarCollapsed} userRole="Instructor" />

      <main
        className={cn(
          "pt-20 pb-8 px-6 transition-all duration-300",
          sidebarCollapsed ? "ml-20" : "ml-64"
        )}
      >
        <div className="max-w-7xl mx-auto space-y-6">
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
                <Button variant="outline" onClick={() => navigate("/instructor/courses")}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  My Courses
                </Button>
                <Button variant="default" className="gradient-accent text-white" onClick={() => navigate("/syllabus-upload")}>
                  Create Course
                </Button>
              </div>
            </div>
          </section>

          {/* Quick Stats */}
          <section
            className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            <div className="rounded-2xl bg-card border border-border/50 shadow-soft p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockStudentMastery.length}</p>
                  <p className="text-xs text-muted-foreground">Total Students</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border/50 shadow-soft p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{avgMastery}%</p>
                  <p className="text-xs text-muted-foreground">Avg. Mastery</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border/50 shadow-soft p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-destructive">{strugglingCount}</p>
                  <p className="text-xs text-muted-foreground">Need Support</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border/50 shadow-soft p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-success">{improvingCount}</p>
                  <p className="text-xs text-muted-foreground">Improving</p>
                </div>
              </div>
            </div>
          </section>

          {/* Mastery Heatmap */}
          <section className="animate-slide-up" style={{ animationDelay: "200ms" }}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Student Mastery Heatmap</h2>
              <p className="text-sm text-muted-foreground">
                View performance across all topics at a glance
              </p>
            </div>
            <MasteryHeatmap students={mockStudentMastery} topics={topics} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default InstructorDashboard;
