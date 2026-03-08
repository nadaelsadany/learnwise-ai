import { useState, useEffect } from "react";
import { InstructorPageLayout } from "@/components/instructor/InstructorPageLayout";
import { FileQuestion, Plus, Sparkles, Clock, Users, BarChart3, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCourses } from "@/hooks/useCourses";
import { supabase } from "@/integrations/supabase/client";

interface GeneratedQuestion {
  question_text: string;
  question_type: string;
  options: string[];
  correct_answer: string;
  points: number;
}

interface QuizWithMeta {
  id: string;
  title: string;
  course_id: string;
  course_title?: string;
  question_count: number;
  passing_score: number | null;
  time_limit_minutes: number | null;
}

const InstructorQuizzes = () => {
  const [quizzes, setQuizzes] = useState<QuizWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [material, setMaterial] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<GeneratedQuestion[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user, isMockUser } = useAuth();
  const { courses, fetchInstructorCourses } = useCourses();

  useEffect(() => { fetchInstructorCourses(); }, []);

  useEffect(() => {
    if (isMockUser || !user) { setLoading(false); return; }
    const fetchQuizzes = async () => {
      const { data, error } = await supabase
        .from("quizzes")
        .select("id, title, course_id, passing_score, time_limit_minutes, quiz_questions(id)")
        .order("created_at", { ascending: false });
      if (error) { console.error(error); setLoading(false); return; }
      const mapped = (data || []).map((q: any) => ({
        id: q.id,
        title: q.title,
        course_id: q.course_id,
        course_title: courses.find((c) => c.id === q.course_id)?.title,
        question_count: q.quiz_questions?.length || 0,
        passing_score: q.passing_score,
        time_limit_minutes: q.time_limit_minutes,
      }));
      setQuizzes(mapped);
      setLoading(false);
    };
    fetchQuizzes();
  }, [user, isMockUser, courses]);

  const handleGenerate = async () => {
    if (!material.trim()) { toast({ title: "Provide course material", variant: "destructive" }); return; }
    setGenerating(true);
    setGenerated([]);
    try {
      const { data, error } = await supabase.functions.invoke("generate-quiz", {
        body: { courseMaterial: material, numQuestions, questionTypes: ["multiple_choice", "true_false"] },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setGenerated(data.questions || []);
      toast({ title: "Questions Generated!", description: `${(data.questions || []).length} questions ready.` });
    } catch (e: any) {
      toast({ title: "Generation Failed", description: e.message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveQuiz = async () => {
    if (!selectedCourseId || !quizTitle || generated.length === 0) {
      toast({ title: "Fill all fields", description: "Select course, title, and generate questions first.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const { data: quiz, error: qErr } = await supabase
        .from("quizzes")
        .insert({ course_id: selectedCourseId, title: quizTitle, passing_score: 70 })
        .select()
        .single();
      if (qErr) throw qErr;

      const questionsToInsert = generated.map((q, i) => ({
        quiz_id: quiz.id,
        question_text: q.question_text,
        options: q.options,
        correct_answer: q.correct_answer,
        points: q.points,
        order_index: i,
      }));
      const { error: qqErr } = await supabase.from("quiz_questions").insert(questionsToInsert);
      if (qqErr) throw qqErr;

      toast({ title: "Quiz Saved!", description: `"${quizTitle}" with ${generated.length} questions.` });
      setAiDialogOpen(false);
      setGenerated([]);
      setMaterial("");
      setQuizTitle("");
      // Refresh
      setQuizzes((prev) => [{ id: quiz.id, title: quizTitle, course_id: selectedCourseId, course_title: courses.find((c) => c.id === selectedCourseId)?.title, question_count: generated.length, passing_score: 70, time_limit_minutes: null }, ...prev]);
    } catch (e: any) {
      toast({ title: "Save Failed", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

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
            <Button variant="outline" onClick={() => setAiDialogOpen(true)}>
              <Sparkles className="w-4 h-4 mr-2" /> AI Generate Quiz
            </Button>
            <Button className="gradient-accent text-white shadow-glow-accent">
              <Plus className="w-4 h-4 mr-2" /> Create Quiz
            </Button>
          </div>
        </div>
      </section>

      {/* Quiz list */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
        {loading ? (
          <div className="col-span-full flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : quizzes.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <FileQuestion className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No quizzes yet. Create one or use AI to generate.</p>
          </div>
        ) : (
          quizzes.map((q) => (
            <Card key={q.id} className="shadow-soft border-border/50 hover:shadow-elevated transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">Quiz</Badge>
                  {q.time_limit_minutes && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" /> {q.time_limit_minutes}m
                    </div>
                  )}
                </div>
                <CardTitle className="text-sm mt-2">{q.title}</CardTitle>
                <CardDescription className="text-xs">{q.course_title || "—"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{q.question_count} questions</span>
                  {q.passing_score && <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" /> Pass: {q.passing_score}%</span>}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </section>

      {/* AI Generate Dialog */}
      <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> AI Quiz Generator</DialogTitle>
            <DialogDescription>Paste course material and let AI create quiz questions automatically.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Select Course</label>
              <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                <SelectTrigger><SelectValue placeholder="Choose a course" /></SelectTrigger>
                <SelectContent>
                  {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Quiz Title</label>
              <Input value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} placeholder="e.g. Chapter 3 Quiz" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Course Material</label>
              <Textarea value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="Paste lecture notes, textbook content, or lesson summaries here…" rows={6} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Number of Questions</label>
              <Select value={String(numQuestions)} onValueChange={(v) => setNumQuestions(Number(v))}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[3, 5, 10, 15, 20].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleGenerate} disabled={generating} className="w-full gradient-accent text-white">
              {generating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              {generating ? "Generating…" : "Generate Questions"}
            </Button>

            {generated.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-semibold">Generated Questions ({generated.length})</h3>
                {generated.map((q, i) => (
                  <Card key={i} className="border-border/50">
                    <CardContent className="pt-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium">Q{i + 1}. {q.question_text}</p>
                        <Badge variant="secondary" className="text-xs ml-2 capitalize">{q.question_type.replace("_", " ")}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {q.options.map((opt, j) => (
                          <div key={j} className={`text-xs px-2 py-1 rounded ${opt === q.correct_answer ? "bg-primary/10 text-primary font-medium" : "bg-muted text-muted-foreground"}`}>
                            {opt}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">Points: {q.points} | Correct: {q.correct_answer}</p>
                    </CardContent>
                  </Card>
                ))}
                <Button onClick={handleSaveQuiz} disabled={saving} className="w-full">
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                  Save Quiz to Course
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </InstructorPageLayout>
  );
};

export default InstructorQuizzes;
