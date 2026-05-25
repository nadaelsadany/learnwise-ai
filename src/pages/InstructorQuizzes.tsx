import { useState, useEffect } from "react";
import { InstructorPageLayout } from "@/components/instructor/InstructorPageLayout";
import { FileQuestion, Plus, Sparkles, Clock, Users, BarChart3, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCourses } from "@/hooks/useCourses";
import { supabase } from "@/integrations/supabase/client";
import { getAssessments, addAssessment, Assessment, AssessmentQuestion } from "@/lib/instructorData";

const InstructorQuizzes = () => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, isMockUser } = useAuth();
  const { courses, fetchInstructorCourses } = useCourses();

  // Dialog states
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [manualDialogOpen, setManualDialogOpen] = useState(false);

  // AI Gen state
  const [material, setMaterial] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [assessmentType, setAssessmentType] = useState<"Quiz" | "Exam" | "Assignment">("Quiz");
  const [passingScore, setPassingScore] = useState(70);
  const [timeLimit, setTimeLimit] = useState(15);
  const [saving, setSaving] = useState(false);

  // Manual Creation state
  const [manualTitle, setManualTitle] = useState("");
  const [manualCourseId, setManualCourseId] = useState("");
  const [manualType, setManualType] = useState<"Quiz" | "Exam" | "Assignment">("Quiz");
  const [manualPassingScore, setManualPassingScore] = useState(70);
  const [manualTimeLimit, setManualTimeLimit] = useState(15);
  const [manualQuestions, setManualQuestions] = useState<Omit<AssessmentQuestion, "id">[]>([
    { question_text: "", question_type: "multiple_choice", options: ["", "", "", ""], correct_answer: "", points: 10 }
  ]);

  const loadData = () => {
    setLoading(true);
    fetchInstructorCourses();
    const data = getAssessments();
    setQuizzes(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleGenerate = async () => {
    if (!material.trim()) { 
      toast({ title: "Provide course material", description: "Please enter some topic text or lesson summaries first.", variant: "destructive" }); 
      return; 
    }
    setGenerating(true);
    setGenerated([]);

    // Fallback Mock generator for demo/offline/mock mode
    if (isMockUser || !user) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockQuestions = Array.from({ length: numQuestions }).map((_, idx) => ({
        question_text: `Mock Question ${idx + 1}: How does "${material.substring(0, 15)}..." relate to testing best practices?`,
        question_type: idx % 2 === 0 ? "multiple_choice" : "open_ended",
        options: idx % 2 === 0 ? ["Correct Option", "Alternative B", "Alternative C", "Alternative D"] : [],
        correct_answer: idx % 2 === 0 ? "Correct Option" : "Detailed open text explanation here.",
        points: idx % 2 === 0 ? 10 : 20
      }));

      setGenerated(mockQuestions);
      toast({ title: "Questions Generated (Demo)", description: `${numQuestions} questions successfully crafted.` });
      setGenerating(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("generate-quiz", {
        body: { courseMaterial: material, numQuestions, questionTypes: ["multiple_choice", "true_false"] },
      });
      if (error) throw error;
      setGenerated(data.questions || []);
      toast({ title: "Questions Generated!", description: `${(data.questions || []).length} questions ready.` });
    } catch (e: any) {
      toast({ title: "AI Gen Failed", description: e.message || "Checking server status. Working offline fallback.", variant: "destructive" });
      
      // Fallback
      const mockQuestions = Array.from({ length: numQuestions }).map((_, idx) => ({
        question_text: `Question ${idx + 1}: Analyze the components of the syllabus topic: ${material.split("\n")[0] || "Software Engineering"}.`,
        question_type: idx % 2 === 0 ? "multiple_choice" : "open_ended",
        options: idx % 2 === 0 ? ["Option A (Correct)", "Option B", "Option C", "Option D"] : [],
        correct_answer: idx % 2 === 0 ? "Option A (Correct)" : "Open response detailing standard V-model implementation.",
        points: 10
      }));
      setGenerated(mockQuestions);
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
    const selectedCourse = courses.find((c) => c.id === selectedCourseId);
    
    // Save to local storage
    const formattedQuestions: AssessmentQuestion[] = generated.map((q, idx) => ({
      id: `q-${Date.now()}-${idx}`,
      ...q
    }));

    addAssessment({
      title: quizTitle,
      type: assessmentType,
      course_id: selectedCourseId,
      course_title: selectedCourse?.title || "Custom Course",
      passing_score: passingScore,
      time_limit_minutes: timeLimit || null,
      question_count: formattedQuestions.length,
      questions: formattedQuestions
    });

    toast({ title: "Assessment Saved!", description: `"${quizTitle}" with ${generated.length} questions is now active.` });
    setAiDialogOpen(false);
    setGenerated([]);
    setMaterial("");
    setQuizTitle("");
    setSaving(false);
    loadData();
  };

  const addManualQuestionField = () => {
    setManualQuestions([
      ...manualQuestions,
      { question_text: "", question_type: "multiple_choice", options: ["", "", "", ""], correct_answer: "", points: 10 }
    ]);
  };

  const updateManualQuestion = (index: number, field: string, value: any) => {
    const updated = [...manualQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setManualQuestions(updated);
  };

  const updateManualOption = (qIdx: number, oIdx: number, val: string) => {
    const updated = [...manualQuestions];
    const opts = [...updated[qIdx].options];
    opts[oIdx] = val;
    updated[qIdx].options = opts;
    setManualQuestions(updated);
  };

  const handleSaveManualQuiz = () => {
    if (!manualTitle || !manualCourseId) {
      toast({ title: "Error", description: "Please provide a title and select a course.", variant: "destructive" });
      return;
    }

    const course = courses.find(c => c.id === manualCourseId);
    const formattedQuestions: AssessmentQuestion[] = manualQuestions.map((q, idx) => ({
      id: `q-manual-${Date.now()}-${idx}`,
      ...q
    })) as AssessmentQuestion[];

    addAssessment({
      title: manualTitle,
      type: manualType,
      course_id: manualCourseId,
      course_title: course?.title || "Custom Course",
      passing_score: manualPassingScore,
      time_limit_minutes: manualTimeLimit || null,
      question_count: formattedQuestions.length,
      questions: formattedQuestions
    });

    toast({ title: "Assessment Created", description: `"${manualTitle}" has been added successfully.` });
    setManualDialogOpen(false);
    setManualTitle("");
    setManualCourseId("");
    setManualQuestions([{ question_text: "", question_type: "multiple_choice", options: ["", "", "", ""], correct_answer: "", points: 10 }]);
    loadData();
  };

  return (
    <InstructorPageLayout>
      {/* Header */}
      <section className="animate-slide-up">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-glow-accent">
                <FileQuestion className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Assessments</h1>
            </div>
            <p className="text-muted-foreground">Create quizzes, exams, and assignments to test and verify skills</p>
          </div>
          <div className="flex gap-3">
            <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Sparkles className="w-4 h-4 mr-2" /> AI Generate Quiz
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card border-border/50">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> AI Quiz Generator</DialogTitle>
                  <DialogDescription>Input lesson topics or textbook material, and our AI will draft high-quality questions.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-1 block">Select Course</Label>
                      <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                        <SelectTrigger><SelectValue placeholder="Choose a course" /></SelectTrigger>
                        <SelectContent>
                          {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="mb-1 block">Assessment Type</Label>
                      <Select value={assessmentType} onValueChange={(val: any) => setAssessmentType(val)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Quiz">Quiz</SelectItem>
                          <SelectItem value="Exam">Exam</SelectItem>
                          <SelectItem value="Assignment">Assignment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Label className="mb-1 block">Quiz Title</Label>
                      <Input value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} placeholder="e.g. Chapter 3 Quiz" />
                    </div>
                    <div>
                      <Label className="mb-1 block">Number of Questions</Label>
                      <Select value={String(numQuestions)} onValueChange={(v) => setNumQuestions(Number(v))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {[3, 5, 10, 15].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-1 block">Passing Score (%)</Label>
                      <Input type="number" value={passingScore} onChange={(e) => setPassingScore(Number(e.target.value))} />
                    </div>
                    <div>
                      <Label className="mb-1 block">Time Limit (mins)</Label>
                      <Input type="number" value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))} />
                    </div>
                  </div>

                  <div>
                    <Label className="mb-1 block">Course Material / Topic Context</Label>
                    <Textarea value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="Paste lecture notes, syllabus concepts, or specific guidelines here..." rows={4} />
                  </div>

                  <Button onClick={handleGenerate} disabled={generating} className="w-full gradient-accent text-white">
                    {generating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    {generating ? "Generating…" : "Generate Questions"}
                  </Button>

                  {generated.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h3 className="text-sm font-semibold border-b pb-1">Review Generated Questions ({generated.length})</h3>
                      {generated.map((q, i) => (
                        <Card key={i} className="border-border/50 bg-card">
                          <CardContent className="pt-4 space-y-2">
                            <div className="flex items-start justify-between">
                              <p className="text-sm font-medium">Q{i + 1}. {q.question_text}</p>
                              <Badge variant="secondary" className="text-xs ml-2 capitalize">{q.question_type.replace("_", " ")}</Badge>
                            </div>
                            {q.question_type === "multiple_choice" && (
                              <div className="grid grid-cols-2 gap-1.5 pt-1">
                                {q.options.map((opt: string, j: number) => (
                                  <div key={j} className={`text-xs px-2 py-1.5 rounded ${opt === q.correct_answer ? "bg-primary/10 text-primary font-medium border border-primary/20" : "bg-muted text-muted-foreground"}`}>
                                    {opt}
                                  </div>
                                ))}
                              </div>
                            )}
                            <p className="text-xs text-muted-foreground pt-1">Answer Key: {q.correct_answer}</p>
                          </CardContent>
                        </Card>
                      ))}
                      <Button onClick={handleSaveQuiz} disabled={saving} className="w-full">
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                        Save Assessment to Course
                      </Button>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={manualDialogOpen} onOpenChange={setManualDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-accent text-white shadow-glow-accent">
                  <Plus className="w-4 h-4 mr-2" /> Create Assessment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card border-border/50">
                <DialogHeader>
                  <DialogTitle>Create New Assessment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Course</Label>
                      <Select value={manualCourseId} onValueChange={setManualCourseId}>
                        <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                        <SelectContent>
                          {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Select value={manualType} onValueChange={(v: any) => setManualType(v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Quiz">Quiz</SelectItem>
                          <SelectItem value="Exam">Exam</SelectItem>
                          <SelectItem value="Assignment">Assignment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Label>Assessment Title</Label>
                      <Input value={manualTitle} onChange={e => setManualTitle(e.target.value)} placeholder="e.g. Midterm Examination" />
                    </div>
                    <div>
                      <Label>Passing Score (%)</Label>
                      <Input type="number" value={manualPassingScore} onChange={e => setManualPassingScore(Number(e.target.value))} />
                    </div>
                  </div>

                  <div>
                    <Label>Time Limit (minutes)</Label>
                    <Input type="number" value={manualTimeLimit} onChange={e => setManualTimeLimit(Number(e.target.value))} />
                  </div>

                  <div className="space-y-4 border-t pt-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-semibold">Questions Checklist</h3>
                      <Button variant="outline" size="sm" onClick={addManualQuestionField}>
                        <Plus className="w-3 h-3 mr-1" /> Add Question
                      </Button>
                    </div>

                    {manualQuestions.map((q, idx) => (
                      <Card key={idx} className="border-border/50 bg-card p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold">Question {idx + 1}</span>
                          <Select 
                            value={q.question_type} 
                            onValueChange={(val: any) => updateManualQuestion(idx, "question_type", val)}
                          >
                            <SelectTrigger className="w-36 h-7 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                              <SelectItem value="open_ended">Open Ended</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-xs">Question Text</Label>
                          <Input value={q.question_text} onChange={e => updateManualQuestion(idx, "question_text", e.target.value)} placeholder="Enter question..." />
                        </div>

                        {q.question_type === "multiple_choice" ? (
                          <div className="space-y-2">
                            <Label className="text-xs">Options</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {q.options.map((opt, oIdx) => (
                                <Input key={oIdx} value={opt} onChange={e => updateManualOption(idx, oIdx, e.target.value)} placeholder={`Option ${oIdx + 1}`} className="h-8 text-xs" />
                              ))}
                            </div>
                            <div>
                              <Label className="text-xs">Correct Option Text</Label>
                              <Input value={q.correct_answer} onChange={e => updateManualQuestion(idx, "correct_answer", e.target.value)} placeholder="Must match one of the option texts exactly" className="h-8 text-xs" />
                            </div>
                          </div>
                        ) : (
                          <div>
                            <Label className="text-xs">Sample / Rubric Correct Explanation</Label>
                            <Textarea value={q.correct_answer} onChange={e => updateManualQuestion(idx, "correct_answer", e.target.value)} placeholder="Guidelines for marking answers..." className="text-xs" rows={2} />
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>

                  <Button onClick={handleSaveManualQuiz} className="w-full">
                    Save Assessment
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
            <p className="text-muted-foreground">No assessments created yet. Click "Create Assessment" to start.</p>
          </div>
        ) : (
          quizzes.map((q) => (
            <Card key={q.id} className="shadow-soft border-border/50 hover:shadow-elevated transition-shadow bg-card flex flex-col justify-between">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant={q.type === "Exam" ? "destructive" : q.type === "Assignment" ? "outline" : "secondary"} className="text-xs">
                    {q.type}
                  </Badge>
                  {q.time_limit_minutes && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" /> {q.time_limit_minutes} mins
                    </div>
                  )}
                </div>
                <CardTitle className="text-base mt-2">{q.title}</CardTitle>
                <CardDescription className="text-xs line-clamp-1">{q.course_title}</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3 border-border/50">
                  <span>{q.question_count} questions</span>
                  {q.passing_score && <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" /> Pass: {q.passing_score}%</span>}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </section>
    </InstructorPageLayout>
  );
};

export default InstructorQuizzes;
