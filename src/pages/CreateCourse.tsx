import { useState } from "react";
import { InstructorPageLayout } from "@/components/instructor/InstructorPageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useCourses } from "@/hooks/useCourses";
import { useCourseEditor, Chapter } from "@/hooks/useCourseEditor";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  BookOpen, Sparkles, Upload, FileQuestion, CheckCircle, ArrowRight, ArrowLeft, Plus, Trash2, Loader2, GripVertical,
  Video, FileText, HelpCircle
} from "lucide-react";

const STEPS = [
  { label: "Course Info", icon: BookOpen },
  { label: "Curriculum", icon: GripVertical },
  { label: "Materials", icon: Upload },
  { label: "Quizzes", icon: FileQuestion },
  { label: "Publish", icon: CheckCircle },
];

const LESSON_TYPE_ICON: Record<string, typeof Video> = { video: Video, reading: FileText, text: FileText, quiz: HelpCircle };

const CreateCourse = () => {
  const [step, setStep] = useState(0);
  const [courseInfo, setCourseInfo] = useState({ title: "", description: "", category: "", level: "beginner", duration_hours: 0 });
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [createdCourseId, setCreatedCourseId] = useState<string | null>(null);
  const { toast } = useToast();
  const { createCourse, publishCourse } = useCourses();
  const { saveCurriculum } = useCourseEditor();
  const navigate = useNavigate();

  const generateOutline = async () => {
    if (!courseInfo.title) { toast({ title: "Title required", variant: "destructive" }); return; }
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-course-outline", {
        body: { title: courseInfo.title, description: courseInfo.description, level: courseInfo.level, category: courseInfo.category },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const generated: Chapter[] = (data.chapters || []).map((ch: any, i: number) => ({
        id: `gen-${i}`,
        title: ch.title,
        lessons: (ch.lessons || []).map((l: any, j: number) => ({
          id: `gen-${i}-${j}`,
          title: l.title,
          type: l.type === "reading" ? "text" : l.type,
          duration: l.duration_minutes,
        })),
      }));
      setChapters(generated);
      toast({ title: "AI Outline Generated", description: `${generated.length} chapters created.` });
    } catch (e: any) {
      toast({ title: "Generation Failed", description: e.message, variant: "destructive" });
    } finally {
      setAiLoading(false);
    }
  };

  const handleNext = async () => {
    if (step === 0 && !courseInfo.title) { toast({ title: "Course title is required", variant: "destructive" }); return; }
    if (step === 0 && !createdCourseId) {
      const { data, error } = await createCourse(courseInfo);
      if (error || !data) return;
      setCreatedCourseId(data.id);
    }
    if (step === 1 && createdCourseId && chapters.length > 0) {
      await saveCurriculum(createdCourseId, chapters);
    }
    setStep((s) => Math.min(s + 1, 4));
  };

  const handlePublish = async () => {
    if (!createdCourseId) return;
    await publishCourse(createdCourseId);
    toast({ title: "Course Published!", description: "Your course is now live." });
    navigate("/instructor/courses");
  };

  const addChapter = () => setChapters((c) => [...c, { id: `ch-${Date.now()}`, title: "New Chapter", lessons: [] }]);
  const addLesson = (chIdx: number) => {
    setChapters((prev) => prev.map((ch, i) => i === chIdx ? { ...ch, lessons: [...ch.lessons, { id: `l-${Date.now()}`, title: "New Lesson", type: "text" }] } : ch));
  };
  const removeChapter = (idx: number) => setChapters((c) => c.filter((_, i) => i !== idx));
  const removeLesson = (chIdx: number, lIdx: number) => {
    setChapters((prev) => prev.map((ch, i) => i === chIdx ? { ...ch, lessons: ch.lessons.filter((_, j) => j !== lIdx) } : ch));
  };
  const updateChapterTitle = (idx: number, title: string) => setChapters((c) => c.map((ch, i) => i === idx ? { ...ch, title } : ch));
  const updateLessonTitle = (chIdx: number, lIdx: number, title: string) => {
    setChapters((prev) => prev.map((ch, i) => i === chIdx ? { ...ch, lessons: ch.lessons.map((l, j) => j === lIdx ? { ...l, title } : l) } : ch));
  };

  return (
    <InstructorPageLayout>
      {/* Step indicators */}
      <section className="animate-slide-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-glow-accent">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Create Course</h1>
            <p className="text-muted-foreground text-sm">Step {step + 1} of 5 — {STEPS[step].label}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-6">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs hidden sm:inline ${i <= step ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s.label}</span>
              {i < 4 && <div className={`w-8 h-0.5 ${i < step ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>
        <Progress value={((step + 1) / 5) * 100} className="h-1.5 mb-6" />
      </section>

      {/* Step 0: Course Info */}
      {step === 0 && (
        <Card className="shadow-soft border-border/50 animate-slide-up">
          <CardHeader>
            <CardTitle>Course Information</CardTitle>
            <CardDescription>Basic details about your course</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Title *</label>
              <Input value={courseInfo.title} onChange={(e) => setCourseInfo({ ...courseInfo, title: e.target.value })} placeholder="e.g. Introduction to Machine Learning" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <Textarea value={courseInfo.description} onChange={(e) => setCourseInfo({ ...courseInfo, description: e.target.value })} placeholder="What will students learn?" rows={4} />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Category</label>
                <Input value={courseInfo.category} onChange={(e) => setCourseInfo({ ...courseInfo, category: e.target.value })} placeholder="e.g. Computer Science" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Level</label>
                <Select value={courseInfo.level} onValueChange={(v) => setCourseInfo({ ...courseInfo, level: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Duration (hours)</label>
                <Input type="number" value={courseInfo.duration_hours} onChange={(e) => setCourseInfo({ ...courseInfo, duration_hours: Number(e.target.value) })} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Curriculum */}
      {step === 1 && (
        <div className="space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Course Curriculum</h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={generateOutline} disabled={aiLoading}>
                {aiLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                AI Generate Outline
              </Button>
              <Button variant="outline" onClick={addChapter}><Plus className="w-4 h-4 mr-2" /> Add Chapter</Button>
            </div>
          </div>
          {chapters.length === 0 && (
            <Card className="shadow-soft border-border/50 p-8 text-center">
              <Sparkles className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No chapters yet. Click "AI Generate Outline" or add manually.</p>
            </Card>
          )}
          {chapters.map((ch, chIdx) => (
            <Card key={ch.id} className="shadow-soft border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">Ch {chIdx + 1}</Badge>
                  <Input value={ch.title} onChange={(e) => updateChapterTitle(chIdx, e.target.value)} className="font-semibold text-sm h-8" />
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeChapter(chIdx)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {ch.lessons.map((lesson, lIdx) => {
                  const LIcon = LESSON_TYPE_ICON[lesson.type] || FileText;
                  return (
                    <div key={lesson.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <LIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <Input value={lesson.title} onChange={(e) => updateLessonTitle(chIdx, lIdx, e.target.value)} className="h-7 text-sm" />
                      <Badge variant="secondary" className="text-xs capitalize">{lesson.type}</Badge>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeLesson(chIdx, lIdx)}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  );
                })}
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => addLesson(chIdx)}><Plus className="w-3 h-3 mr-1" /> Add Lesson</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Step 2: Materials */}
      {step === 2 && (
        <Card className="shadow-soft border-border/50 animate-slide-up">
          <CardHeader>
            <CardTitle>Upload Materials</CardTitle>
            <CardDescription>Add videos, PDFs, and resources to your lessons</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-xl p-12 text-center">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">Drag and drop files here, or click to browse</p>
              <p className="text-xs text-muted-foreground">Supports PDF, MP4, DOCX (max 20MB)</p>
              <Button variant="outline" className="mt-4">Browse Files</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Quizzes */}
      {step === 3 && (
        <Card className="shadow-soft border-border/50 animate-slide-up">
          <CardHeader>
            <CardTitle>Quizzes & Assessments</CardTitle>
            <CardDescription>Create quizzes or let AI generate them from your course content</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <FileQuestion className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">You can create quizzes from the Quizzes & Exams page after publishing.</p>
            <Button variant="outline" onClick={() => navigate("/instructor/quizzes")}>
              <Sparkles className="w-4 h-4 mr-2" /> Go to Quiz Builder
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Publish */}
      {step === 4 && (
        <Card className="shadow-soft border-border/50 animate-slide-up">
          <CardHeader>
            <CardTitle>Review & Publish</CardTitle>
            <CardDescription>Review your course and make it live</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Title</p>
                <p className="font-medium">{courseInfo.title || "—"}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Level</p>
                <p className="font-medium capitalize">{courseInfo.level}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Chapters</p>
                <p className="font-medium">{chapters.length}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Lessons</p>
                <p className="font-medium">{chapters.reduce((sum, ch) => sum + ch.lessons.length, 0)}</p>
              </div>
            </div>
            <div className="flex justify-center pt-4">
              <Button onClick={handlePublish} className="gradient-accent text-white shadow-glow-accent px-8">
                <CheckCircle className="w-4 h-4 mr-2" /> Publish Course
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={() => setStep((s) => Math.max(s - 1, 0))} disabled={step === 0}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        {step < 4 && (
          <Button onClick={handleNext} className="gradient-accent text-white shadow-glow-accent">
            Next <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </InstructorPageLayout>
  );
};

export default CreateCourse;
