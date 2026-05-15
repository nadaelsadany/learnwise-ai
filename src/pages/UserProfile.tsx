import { useState } from "react";
import { ApplicantSidebar, ApplicantSidebarContent } from "@/components/layout/ApplicantSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import {
  Mail, Building2, BookOpen, Clock, Flame, Target,
  Brain, TrendingUp
} from "lucide-react";

const stats = [
  { label: "Total Study Hours", value: "48.5h", icon: Clock, color: "bg-primary/10 text-primary" },
  { label: "Study Streak", value: "12 days", icon: Flame, color: "bg-warning/10 text-warning" },
  { label: "Completed Courses", value: "2", icon: BookOpen, color: "bg-success/10 text-success" },
  { label: "Quiz Success Rate", value: "78%", icon: Target, color: "bg-accent/10 text-accent" },
  { label: "Flashcard Mastery", value: "156 cards", icon: Brain, color: "bg-primary/10 text-primary" },
];

const UserProfile = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, role } = useAuth();
  const userName = user?.user_metadata?.full_name || "Alex Johnson";
  const userEmail = user?.email || "student@nafea.edu";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ApplicantSidebar onCollapse={setSidebarCollapsed} />
      <Header sidebarCollapsed={sidebarCollapsed} userRole="Student" mobileSidebar={<ApplicantSidebarContent onItemClick={() => {}} />} />

      <main className={cn("pt-20 pb-8 px-4 sm:px-6 transition-all duration-300", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64", "ml-0")}>
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-lg">
                  {userName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold">{userName}</h1>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {userEmail}</span>
                    <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> Nafea Academy</span>
                    <Badge variant="secondary" className="capitalize">{role || "Student"}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge className="bg-primary/10 text-primary border-primary/20">Level 7</Badge>
                    <span className="text-xs text-muted-foreground">2,450 / 3,000 XP</span>
                  </div>
                  <Progress value={82} className="h-2 mt-2 max-w-xs" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-center px-4 py-2 rounded-xl bg-muted">
                    <p className="text-2xl font-bold text-primary">3</p>
                    <p className="text-xs text-muted-foreground">Enrolled</p>
                  </div>
                  <div className="text-center px-4 py-2 rounded-xl bg-muted">
                    <p className="text-2xl font-bold text-success">2</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Statistics */}
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Learning Statistics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {stats.map(s => (
                <Card key={s.label}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", s.color)}>
                      <s.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-lg font-bold">{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>


        </div>
      </main>
    </div>
  );
};

export default UserProfile;
