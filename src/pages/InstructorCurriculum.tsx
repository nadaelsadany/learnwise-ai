import { useState, useEffect } from "react";
import { InstructorPageLayout } from "@/components/instructor/InstructorPageLayout";
import { ListTree, BookOpen, GripVertical, Plus, ChevronDown, ChevronRight, Video, FileText, HelpCircle, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCourses } from "@/hooks/useCourses";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const mockCurriculum = [
  {
    id: "s1", title: "Introduction to the Course", expanded: true,
    lessons: [
      { id: "l1", title: "Welcome & Overview", type: "video", duration: "5 min" },
      { id: "l2", title: "Course Prerequisites", type: "reading", duration: "10 min" },
      { id: "l3", title: "Knowledge Check", type: "quiz", duration: "5 min" },
    ],
  },
  {
    id: "s2", title: "Core Concepts", expanded: false,
    lessons: [
      { id: "l4", title: "Fundamental Principles", type: "video", duration: "15 min" },
      { id: "l5", title: "Deep Dive: Key Topics", type: "reading", duration: "20 min" },
      { id: "l6", title: "Hands-on Exercise", type: "assignment", duration: "30 min" },
    ],
  },
  {
    id: "s3", title: "Advanced Topics", expanded: false,
    lessons: [
      { id: "l7", title: "Advanced Techniques", type: "video", duration: "20 min" },
      { id: "l8", title: "Case Study Analysis", type: "reading", duration: "15 min" },
    ],
  },
];

const typeIcons: Record<string, React.ElementType> = {
  video: Video,
  reading: FileText,
  quiz: HelpCircle,
  assignment: Pencil,
};

const InstructorCurriculum = () => {
  const { courses, fetchInstructorCourses } = useCourses();
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [sections, setSections] = useState(mockCurriculum);

  useEffect(() => { fetchInstructorCourses(); }, []);

  const toggleSection = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, expanded: !s.expanded } : s));
  };

  return (
    <InstructorPageLayout>
      <section className="animate-slide-up">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-glow-accent">
                <ListTree className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Curriculum Manager</h1>
            </div>
            <p className="text-muted-foreground">Organize course content with sections, lessons, and resources</p>
          </div>
          <div className="flex gap-3 items-center">
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                ))}
                {courses.length === 0 && <SelectItem value="none" disabled>No courses</SelectItem>}
              </SelectContent>
            </Select>
            <Button className="gradient-accent text-white shadow-glow-accent">
              <Plus className="w-4 h-4 mr-2" /> Add Section
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-3 animate-slide-up" style={{ animationDelay: "100ms" }}>
        {sections.map((section) => (
          <Card key={section.id} className="shadow-soft border-border/50">
            <CardHeader className="py-3 px-4 cursor-pointer" onClick={() => toggleSection(section.id)}>
              <div className="flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                {section.expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <CardTitle className="text-sm font-semibold flex-1">{section.title}</CardTitle>
                <Badge variant="secondary" className="text-xs">{section.lessons.length} lessons</Badge>
              </div>
            </CardHeader>
            {section.expanded && (
              <CardContent className="pt-0 pb-3 px-4">
                <div className="space-y-2 ml-8">
                  {section.lessons.map((lesson) => {
                    const TypeIcon = typeIcons[lesson.type] || FileText;
                    return (
                      <div key={lesson.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <GripVertical className="w-3.5 h-3.5 text-muted-foreground cursor-grab" />
                        <TypeIcon className="w-4 h-4 text-primary" />
                        <span className="text-sm flex-1">{lesson.title}</span>
                        <Badge variant="outline" className="text-xs capitalize">{lesson.type}</Badge>
                        <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                      </div>
                    );
                  })}
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                    <Plus className="w-3 h-3 mr-1" /> Add Lesson
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </section>
    </InstructorPageLayout>
  );
};

export default InstructorCurriculum;
