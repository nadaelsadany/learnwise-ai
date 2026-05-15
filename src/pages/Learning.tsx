import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ApplicantSidebar, ApplicantSidebarContent } from "@/components/layout/ApplicantSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { CourseCardEnhanced, mockCourses, Course } from "@/components/courses";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCourses } from "@/hooks/useCourses";
import { 
  BookOpen, 
  Sparkles, 
  GraduationCap, 
  Upload, 
  ChevronRight, 
  Target, 
  Briefcase,
  FileText,
  Clock,
  CheckCircle2
} from "lucide-react";
import { PathGraph } from "@/components/learning/PathGraph";

const Learning = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { courses: dbCourses, loading, fetchPublishedCourses } = useCourses();

  useEffect(() => {
    fetchPublishedCourses();
  }, []);

  const careerPaths = [
    {
      id: "path-1",
      name: "Junior QA Engineer Path",
      objective: "Core certification and fundamental testing skills for your current role.",
      progress: 65,
      skills: ["Manual Testing", "Test Case Design", "Defect Management"],
      color: "bg-primary/10 border-primary/20"
    },
    {
      id: "path-2",
      name: "Automated Testing Specialist",
      objective: "Advanced track for your next career milestone in Q3.",
      progress: 15,
      skills: ["Selenium", "JavaScript", "CI/CD Basics"],
      color: "bg-accent/10 border-accent/20"
    }
  ];

  const [selectedPath, setSelectedPath] = useState<any>(null);

  const pathCourses = {
    "path-1": [
      { id: "c1", title: "ISTQB Foundation Level", level: "Beginner", duration: "12h", status: "completed", prerequisites: [] },
      { id: "c2", title: "Test Design Techniques", level: "Intermediate", duration: "8h", status: "in-progress", isRecommended: true, prerequisites: ["c1"] },
      { id: "c3", title: "Defect Management", level: "Beginner", duration: "4h", status: "available", prerequisites: ["c1"] },
      { id: "c4", title: "Mobile Testing Basics", level: "Intermediate", duration: "6h", status: "available", prerequisites: ["c2"] },
      { id: "c5", title: "API Testing Foundations", level: "Intermediate", duration: "10h", status: "locked", prerequisites: ["c2", "c3"] },
      { id: "c6", title: "QA Career Portfolio", level: "Advanced", duration: "4h", status: "locked", prerequisites: ["c5"] },
    ],
    "path-2": [
      { id: "a1", title: "JavaScript for QA", level: "Beginner", duration: "10h", status: "in-progress", isRecommended: true, prerequisites: [] },
      { id: "a2", title: "Selenium WebDriver", level: "Advanced", duration: "15h", status: "locked", prerequisites: ["a1"] },
      { id: "a3", title: "Cypress Essentials", level: "Advanced", duration: "12h", status: "locked", prerequisites: ["a1"] },
    ]
  };

  const exploreCourses = useMemo(() => {
    return dbCourses.slice(0, 3); // Just show a few for explore
  }, [dbCourses]);

  return (
    <div className="min-h-screen bg-background">
      <ApplicantSidebar onCollapse={setSidebarCollapsed} />
      <Header 
        sidebarCollapsed={sidebarCollapsed} 
        userRole="Student" 
        mobileSidebar={<ApplicantSidebarContent onItemClick={() => {}} />} 
      />

      <main className={cn(
        "pt-20 pb-24 px-4 sm:px-6 transition-all duration-300",
        sidebarCollapsed ? "lg:ml-20" : "lg:ml-64",
        "ml-0"
      )}>
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          {!selectedPath && (
            <header className="animate-fade-in">
              <h1 className="text-3xl font-bold mb-2">Learning Hub</h1>
              <p className="text-muted-foreground">Focused growth paths and personalized learning for your career.</p>
            </header>
          )}

          {selectedPath ? (
            <section className="animate-fade-in space-y-12">
              <PathGraph 
                pathName={selectedPath.name}
                courses={pathCourses[selectedPath.id as keyof typeof pathCourses]}
                onBack={() => setSelectedPath(null)}
                onCourseClick={(id: string) => navigate(`/courses/${id}`)}
              />

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-bold">Courses in this Path</h2>
                  </div>
                  <p className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-border/50">
                    {pathCourses[selectedPath.id as keyof typeof pathCourses].filter(c => c.status === 'completed').length} / {pathCourses[selectedPath.id as keyof typeof pathCourses].length} Completed
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pathCourses[selectedPath.id as keyof typeof pathCourses]
                    .sort((a: any, b: any) => (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0))
                    .map((course: any) => {
                      const missingPrereqId = course.prerequisites?.find(
                        (pId: string) => pathCourses[selectedPath.id as keyof typeof pathCourses].find(c => c.id === pId)?.status !== 'completed'
                      );
                      const missingPrereqTitle = missingPrereqId 
                        ? pathCourses[selectedPath.id as keyof typeof pathCourses].find(c => c.id === missingPrereqId)?.title 
                        : "";

                      return (
                        <div key={course.id} className={cn(course.isRecommended && "md:col-span-2 lg:col-span-2")}>
                          <CourseCardEnhanced 
                            course={{
                              ...course,
                              description: `Comprehensive training for ${course.title}. Learn industry-standard practices and gain hands-on experience.`,
                              lessons: 12,
                              rating: 4.9,
                              studentsEnrolled: 1540,
                              tags: [course.level],
                              category: "certification",
                              progress: course.status === 'completed' ? 100 : course.status === 'in-progress' ? 35 : 0
                            } as any}
                            isLocked={course.status === 'locked'}
                            lockMessage={missingPrereqTitle ? `Complete ${missingPrereqTitle} to unlock` : ""}
                            variant={course.isRecommended ? "featured" : "default"}
                            onClick={() => navigate(`/courses/${course.id}`)}
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            </section>
          ) : (
            <>
              {/* SECTION 1: My Career Paths */}
          <section className="space-y-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow-primary">
                  <Briefcase className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">My Career Paths</h2>
                  <p className="text-sm text-muted-foreground">Organization-assigned development tracks</p>
                </div>
              </div>

            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {careerPaths.map((path) => (
                <div 
                  key={path.id} 
                  className={cn(
                    "relative group overflow-hidden rounded-2xl border p-6 transition-all hover:shadow-lg",
                    path.color
                  )}
                >
                  <div className="flex flex-col h-full gap-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="font-bold text-lg leading-tight">{path.name}</h3>
                        <p className="text-[11px] font-medium text-muted-foreground/80">Assigned by Nafea</p>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-1">{path.objective}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-primary">{path.progress}%</p>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Completed</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Progress value={path.progress} className="h-2 bg-background/50" />
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {path.skills.map(skill => (
                        <span key={skill} className="px-2 py-1 rounded-md bg-background/50 text-[10px] font-medium border border-border/50">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <Button className="mt-4 w-full gradient-primary text-white group" onClick={() => setSelectedPath(path)}>
                      View Path Map <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
          {/* SECTION 2: Personal Learning (AI-assisted) */}
          <section className="space-y-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Personal Learning</h2>
                <p className="text-sm text-muted-foreground">Self-driven study with AI-powered support</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 shadow-soft border-dashed border-2 border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors group cursor-pointer">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-bold mb-2 text-lg">Upload Study Material</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mb-6">
                    Upload documents, paste links, or add notes. Our AI will generate a personalized learning plan just for you.
                  </p>
                  <Button variant="outline" className="gap-2">
                    <FileText className="w-4 h-4" /> Start AI-Assisted Study
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-soft border-border/50 bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="w-4 h-4 text-warning" />
                    Recent AI Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                    <p className="text-sm font-bold mb-1 line-clamp-1">Testing Modern Web Apps</p>
                    <p className="text-[10px] text-muted-foreground mb-3 italic">Generated from \"Testing.pdf\"</p>
                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <span className="text-muted-foreground">3 / 8 modules</span>
                      <span className="font-bold text-accent">38%</span>
                    </div>
                    <Progress value={38} className="h-1.5 bg-background" />
                    <Button variant="ghost" size="sm" className="w-full mt-3 text-xs text-accent hover:text-accent hover:bg-accent/5">
                      Continue Learning
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-success/5 border border-success/10 text-success">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-medium">AI Coach is ready to quiz you!</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* SECTION 3: Explore Courses (Optional / Free) */}
          <section className="space-y-6 animate-slide-up" style={{ animationDelay: "300ms" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center border border-border/50">
                  <Target className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Explore Courses</h2>
                  <p className="text-sm text-muted-foreground">Optional resources for extra-curricular growth</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-primary gap-1" onClick={() => navigate('/catalog')}>
                View Catalog <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {dbCourses.length > 0 ? (
                dbCourses.slice(0, 3).map((course) => (
                  <CourseCardEnhanced
                    key={course.id}
                    course={{
                      id: course.id,
                      title: course.title,
                      description: course.description || "",
                      progress: 0,
                      duration: `${course.duration_hours || 0}h`,
                      category: (course.category as any) || "certification",
                      level: (course.level as any) || "beginner",
                      instructor: "Staff",
                      rating: 4.8,
                      studentsEnrolled: 124,
                      tags: [],
                      image_url: course.image_url || undefined
                    } as any}
                    onClick={() => navigate(`/courses/${course.id}`)}
                  />
                ))
              ) : (
                <div className="col-span-3 py-12 text-center bg-muted/20 rounded-2xl border border-dashed border-border/50">
                  <p className="text-muted-foreground">More courses coming soon.</p>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  </main>
</div>
);
};

// Internal Badge component if not exported
const Badge = ({ children, variant, className }: any) => (
  <span className={cn(
    "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
    variant === 'outline' ? "border" : "bg-primary text-primary-foreground",
    className
  )}>
    {children}
  </span>
);

const Card = ({ children, className }: any) => (
  <div className={cn("rounded-2xl border bg-card shadow-soft overflow-hidden", className)}>
    {children}
  </div>
);

const CardHeader = ({ children, className }: any) => (
  <div className={cn("p-6 pb-2", className)}>{children}</div>
);

const CardTitle = ({ children, className }: any) => (
  <h3 className={cn("text-lg font-bold", className)}>{children}</h3>
);

const CardContent = ({ children, className }: any) => (
  <div className={cn("p-6 pt-0", className)}>{children}</div>
);

export default Learning;
