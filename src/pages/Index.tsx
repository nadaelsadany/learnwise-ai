import { useState } from "react";
import { 
  Target, 
  Flame, 
  Trophy,
  Clock
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ReadinessGauge } from "@/components/dashboard/ReadinessGauge";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { ExamCountdown } from "@/components/dashboard/ExamCountdown";
import { TodaysPlan } from "@/components/dashboard/TodaysPlan";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { WeaknessAnalysis } from "@/components/dashboard/WeaknessAnalysis";
import { AIChatBar } from "@/components/dashboard/AIChatBar";
import { cn } from "@/lib/utils";

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const todaysPlanItems = [
    { id: "1", title: "Review Test Design Techniques", type: "lesson" as const, duration: "20 min", completed: true },
    { id: "2", title: "Practice Equivalence Partitioning", type: "flashcard" as const, duration: "15 min", completed: true },
    { id: "3", title: "Chapter 4 Quiz", type: "quiz" as const, duration: "30 min", completed: false },
    { id: "4", title: "AI Review: Weak Topics", type: "ai-review" as const, duration: "10 min", completed: false },
  ];

  const courses = [
    {
      title: "ISTQB Foundation Level",
      description: "Complete preparation for the ISTQB FL certification exam with comprehensive modules.",
      progress: 67,
      duration: "24 hours",
      lessons: 48,
    },
    {
      title: "Test Design Techniques",
      description: "Master black-box and white-box testing techniques.",
      progress: 45,
      duration: "8 hours",
      lessons: 16,
    },
    {
      title: "Agile Testing Essentials",
      description: "Learn testing practices in agile development environments.",
      progress: 23,
      duration: "6 hours",
      lessons: 12,
    },
  ];

  const weaknesses = [
    { topic: "Decision Table Testing", score: 42, questionsAttempted: 28 },
    { topic: "State Transition Testing", score: 55, questionsAttempted: 22 },
    { topic: "Use Case Testing", score: 61, questionsAttempted: 18 },
  ];

  const examDate = new Date();
  examDate.setDate(examDate.getDate() + 18);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar onCollapse={setSidebarCollapsed} />
      <Header sidebarCollapsed={sidebarCollapsed} />
      
      <main className={cn(
        "pt-20 pb-32 px-6 transition-all duration-300",
        sidebarCollapsed ? "ml-20" : "ml-64"
      )}>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome Section */}
          <section className="animate-slide-up">
            <h1 className="text-2xl font-bold mb-1">Welcome back, Alex! 👋</h1>
            <p className="text-muted-foreground">Continue your learning journey. You're making great progress!</p>
          </section>

          {/* Stats Overview */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
            <StatsCard
              title="Study Streak"
              value="12 days"
              icon={Flame}
              trend={{ value: 20, positive: true }}
              variant="warning"
            />
            <StatsCard
              title="Questions Solved"
              value="342"
              subtitle="This week"
              icon={Target}
              variant="primary"
            />
            <StatsCard
              title="Time Studied"
              value="18.5h"
              subtitle="This week"
              icon={Clock}
              variant="success"
            />
            <StatsCard
              title="Achievements"
              value="8"
              subtitle="2 new this week"
              icon={Trophy}
              variant="accent"
            />
          </section>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Exam Countdown & Readiness */}
              <section className="grid md:grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
                <ExamCountdown 
                  examName="ISTQB Foundation Level"
                  date={examDate}
                />
                <div className="rounded-2xl bg-card border border-border/50 shadow-card p-5 flex flex-col items-center justify-center">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Exam Readiness</h3>
                  <ReadinessGauge percentage={72} size="lg" />
                </div>
              </section>

              {/* Courses */}
              <section className="animate-slide-up" style={{ animationDelay: "300ms" }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Continue Learning</h2>
                  <button className="text-sm text-primary font-medium hover:underline">
                    View all courses
                  </button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {courses.map((course, index) => (
                    <CourseCard key={course.title} {...course} />
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="animate-slide-up" style={{ animationDelay: "250ms" }}>
                <TodaysPlan items={todaysPlanItems} />
              </div>
              <div className="animate-slide-up" style={{ animationDelay: "350ms" }}>
                <WeaknessAnalysis weaknesses={weaknesses} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* AI Chat Bar */}
      <AIChatBar />
    </div>
  );
};

export default Index;
