import { useState } from "react";
import { InstructorSidebar, InstructorSidebarContent } from "@/components/layout/InstructorSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { MasteryHeatmap, mockStudentMastery, topics } from "@/components/mastery";
import { GraduationCap, Users, TrendingUp, AlertTriangle, BookOpen, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { StatsCard } from "@/components/dashboard/StatsCard";

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
    <div className="min-h-screen bg-background text-foreground">
      <InstructorSidebar onCollapse={setSidebarCollapsed} />
      <Header
        sidebarCollapsed={sidebarCollapsed}
        userRole="Instructor"
        mobileSidebar={<InstructorSidebarContent />}
      />

      <main
        className={cn(
          "pt-20 pb-8 px-4 sm:px-6 transition-all duration-300",
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-64",
          "ml-0"
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
          <section
            className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            <StatsCard
              icon={Users}
              title="Total Students"
              value={mockStudentMastery.length}
              variant="default"
              onClick={() => navigate("/instructor/students")}
            />
            <StatsCard
              icon={BarChart3}
              title="Avg. Mastery"
              value={`${avgMastery}%`}
              variant="success"
              onClick={() => console.log('Mastery clicked')}
            />
            <StatsCard
              icon={AlertTriangle}
              title="Need Support"
              value={strugglingCount}
              variant="warning"
              onClick={() => console.log('Support clicked')}
            />
            <StatsCard
              icon={TrendingUp}
              title="Improving"
              value={improvingCount}
              variant="primary"
              onClick={() => console.log('Improving clicked')}
            />
          </section>

          {/* Mastery Heatmap */}
          <section className="animate-slide-up" style={{ animationDelay: "200ms" }}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Student Mastery Heatmap</h2>
              <p className="text-sm text-muted-foreground">
                View performance across all topics at a glance
              </p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-card p-4 overflow-x-auto shadow-soft">
              <MasteryHeatmap students={mockStudentMastery} topics={topics} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default InstructorDashboard;
