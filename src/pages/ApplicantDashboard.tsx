import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ApplicantSidebar } from "@/components/layout/ApplicantSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ReadinessGauge } from "@/components/dashboard/ReadinessGauge";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { ExamCountdown } from "@/components/dashboard/ExamCountdown";
import { TodaysPlan } from "@/components/dashboard/TodaysPlan";
import { WeaknessAnalysis } from "@/components/dashboard/WeaknessAnalysis";
import { AIChatBar } from "@/components/dashboard/AIChatBar";
import { useCourses } from "@/hooks/useCourses";
import { useProgress } from "@/hooks/useProgress";
import { Flame, Target, Clock, Trophy, Loader2 } from "lucide-react";

const ApplicantDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const { courses, loading: coursesLoading, fetchEnrolledCourses } = useCourses();
  const { stats, loading: progressLoading } = useProgress();

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const loading = coursesLoading || progressLoading;

  // Calculate readiness based on progress data
  const readinessPercentage = stats
    ? Math.min(
        100,
        Math.round(
          (stats.totalLessonsCompleted * 5 +
            stats.totalQuizzesTaken * 10 +
            stats.averageQuizScore * 0.5) /
            2
        )
      )
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <ApplicantSidebar onCollapse={setSidebarCollapsed} />
      <Header sidebarCollapsed={sidebarCollapsed} userRole="Student" />

      <main
        className={cn(
          "pt-20 pb-24 px-6 transition-all duration-300",
          sidebarCollapsed ? "ml-20" : "ml-64"
        )}
      >
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome Section */}
          <section className="animate-slide-up">
            <h1 className="text-2xl font-bold mb-1">
              Welcome back! 👋
            </h1>
            <p className="text-muted-foreground">
              Ready to continue your learning journey?
            </p>
          </section>

          {/* Stats Grid */}
          <section
            className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            <StatsCard
              icon={Flame}
              title="Study Streak"
              value={`${stats?.currentStreak || 0} days`}
              trend={stats?.currentStreak ? { value: stats.currentStreak, positive: true } : undefined}
              variant="warning"
            />
            <StatsCard
              icon={Target}
              title="Questions Solved"
              value={stats?.totalQuizzesTaken ? `${stats.totalQuizzesTaken * 10}` : "0"}
              trend={{ value: 12, positive: true }}
              variant="success"
            />
            <StatsCard
              icon={Clock}
              title="Time Studied"
              value={`${stats?.totalStudyTimeMinutes || 0}m`}
              subtitle="Total"
              variant="primary"
            />
            <StatsCard
              icon={Trophy}
              title="Lessons Done"
              value={`${stats?.totalLessonsCompleted || 0}`}
              subtitle="Completed"
              variant="accent"
            />
          </section>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Readiness & Courses */}
            <div
              className="lg:col-span-2 space-y-6 animate-slide-up"
              style={{ animationDelay: "200ms" }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-card border border-border/50 shadow-card p-6 flex flex-col items-center justify-center">
                  <p className="text-sm text-muted-foreground mb-2">Exam Readiness</p>
                  <ReadinessGauge percentage={readinessPercentage} />
                  <p className="text-sm text-muted-foreground mt-2">Overall Progress</p>
                </div>
                <ExamCountdown
                  examName="ISTQB Foundation Level"
                  date={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)}
                />
              </div>

              {/* Enrolled Courses */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">My Courses</h2>
                  <button
                    onClick={() => navigate("/catalog")}
                    className="text-sm text-primary hover:underline"
                  >
                    Browse All
                  </button>
                </div>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : courses.length === 0 ? (
                  <div className="rounded-2xl bg-card border border-border/50 shadow-card p-8 text-center">
                    <p className="text-muted-foreground mb-4">
                      You haven't enrolled in any courses yet
                    </p>
                    <button
                      onClick={() => navigate("/catalog")}
                      className="text-primary font-medium hover:underline"
                    >
                      Browse Course Catalog →
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courses.slice(0, 4).map((course) => (
                      <CourseCard
                        key={course.id}
                        title={course.title}
                        description={course.description || ""}
                        progress={course.enrollment?.progress_percentage || 0}
                        lessons={0}
                        duration={`${course.duration_hours || 0}h`}
                        onClick={() => navigate(`/courses/${course.id}`)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Plan & Analysis */}
            <div
              className="space-y-6 animate-slide-up"
              style={{ animationDelay: "300ms" }}
            >
              <TodaysPlan
                items={[
                  {
                    id: "1",
                    title: "Review Test Design",
                    duration: "25 min",
                    type: "lesson",
                    completed: true,
                  },
                  {
                    id: "2",
                    title: "Practice: Black-box",
                    duration: "15 min",
                    type: "quiz",
                    completed: true,
                  },
                  {
                    id: "3",
                    title: "Flashcard Review",
                    duration: "10 min",
                    type: "flashcard",
                    completed: false,
                  },
                  {
                    id: "4",
                    title: "AI Review Session",
                    duration: "30 min",
                    type: "ai-review",
                    completed: false,
                  },
                ]}
              />

              <WeaknessAnalysis
                weaknesses={[
                  { topic: "Test Design Techniques", score: 45, questionsAttempted: 32 },
                  { topic: "Static Testing", score: 52, questionsAttempted: 28 },
                  { topic: "Test Management", score: 58, questionsAttempted: 24 },
                ]}
              />
            </div>
          </div>
        </div>
      </main>

      <AIChatBar />
    </div>
  );
};

export default ApplicantDashboard;
