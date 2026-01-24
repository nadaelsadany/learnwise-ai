import { useState } from "react";
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
import { Flame, Target, Clock, Trophy } from "lucide-react";

const ApplicantDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
              value="7 days"
              trend={{ value: 2, positive: true }}
              variant="warning"
            />
            <StatsCard
              icon={Target}
              title="Questions Solved"
              value="234"
              trend={{ value: 12, positive: true }}
              variant="success"
            />
            <StatsCard
              icon={Clock}
              title="Time Studied"
              value="48h"
              subtitle="This week"
              variant="primary"
            />
            <StatsCard
              icon={Trophy}
              title="Achievements"
              value="12"
              subtitle="3 new"
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
                  <ReadinessGauge percentage={72} />
                  <p className="text-sm text-muted-foreground mt-2">ISTQB Foundation</p>
                </div>
                <ExamCountdown
                  examName="ISTQB Foundation Level"
                  date={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)}
                />
              </div>

              {/* Enrolled Courses */}
              <div>
                <h2 className="text-lg font-semibold mb-4">My Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CourseCard
                    title="ISTQB Foundation Level"
                    description="Software Testing Fundamentals"
                    progress={72}
                    lessons={24}
                    duration="12 hours"
                  />
                  <CourseCard
                    title="Agile Testing"
                    description="Testing in Agile Projects"
                    progress={45}
                    lessons={18}
                    duration="8 hours"
                  />
                </div>
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
