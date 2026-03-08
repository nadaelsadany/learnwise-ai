import { InstructorPageLayout } from "@/components/instructor/InstructorPageLayout";
import { FileQuestion, Plus, Sparkles, Clock, Users, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockQuizzes = [
  { id: 1, title: "Midterm: Machine Learning Basics", course: "ML 101", questions: 25, avgScore: 78, attempts: 22, scheduled: "Mar 12, 2026", type: "exam" },
  { id: 2, title: "Chapter 3 Quiz", course: "ML 101", questions: 10, avgScore: 85, attempts: 24, scheduled: null, type: "quiz" },
  { id: 3, title: "Statistics Final Exam", course: "Statistics", questions: 40, avgScore: 0, attempts: 0, scheduled: "Mar 22, 2026", type: "exam" },
  { id: 4, title: "Quick Check: Regression", course: "ML 101", questions: 5, avgScore: 92, attempts: 20, scheduled: null, type: "quiz" },
];

const InstructorQuizzes = () => {
  return (
    <InstructorPageLayout>
      <section className="animate-slide-up">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-glow-accent">
                <FileQuestion className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Quizzes & Exams</h1>
            </div>
            <p className="text-muted-foreground">Create, schedule, and review assessments</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Sparkles className="w-4 h-4 mr-2" /> AI Generate Quiz
            </Button>
            <Button className="gradient-accent text-white shadow-glow-accent">
              <Plus className="w-4 h-4 mr-2" /> Create Quiz
            </Button>
          </div>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
        {mockQuizzes.map((q) => (
          <Card key={q.id} className="shadow-soft border-border/50 hover:shadow-elevated transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs capitalize">{q.type}</Badge>
                {q.scheduled && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" /> {q.scheduled}
                  </div>
                )}
              </div>
              <CardTitle className="text-sm mt-2">{q.title}</CardTitle>
              <CardDescription className="text-xs">{q.course}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{q.questions} questions</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{q.attempts}</span>
                  {q.avgScore > 0 && (
                    <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" />{q.avgScore}%</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </InstructorPageLayout>
  );
};

export default InstructorQuizzes;
