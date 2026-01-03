import { useState } from "react";
import { ArrowLeft, FileText, Sparkles, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { FileDropzone } from "@/components/syllabus/FileDropzone";
import { ParsingProgress } from "@/components/syllabus/ParsingProgress";
import { CourseOutlinePreview } from "@/components/syllabus/CourseOutlinePreview";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type UploadState = "idle" | "parsing" | "preview";

const SyllabusUpload = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  // Mock course outline data
  const mockCourseOutline = {
    courseName: "ISTQB Foundation Level - Complete Course",
    chapters: [
      {
        id: "ch1",
        title: "Fundamentals of Testing",
        estimatedTime: "3 hours",
        topics: [
          { id: "t1", title: "What is Testing?", duration: "25 min", hasQuiz: true, hasFlashcards: true },
          { id: "t2", title: "Why is Testing Necessary?", duration: "30 min", hasQuiz: true, hasFlashcards: true },
          { id: "t3", title: "Testing Principles", duration: "35 min", hasQuiz: true, hasFlashcards: true },
          { id: "t4", title: "Test Process", duration: "40 min", hasQuiz: true, hasFlashcards: false },
          { id: "t5", title: "Psychology of Testing", duration: "20 min", hasQuiz: false, hasFlashcards: true },
        ],
      },
      {
        id: "ch2",
        title: "Testing Throughout the Software Lifecycle",
        estimatedTime: "4 hours",
        topics: [
          { id: "t6", title: "Software Development Models", duration: "45 min", hasQuiz: true, hasFlashcards: true },
          { id: "t7", title: "Test Levels", duration: "50 min", hasQuiz: true, hasFlashcards: true },
          { id: "t8", title: "Test Types", duration: "40 min", hasQuiz: true, hasFlashcards: true },
          { id: "t9", title: "Maintenance Testing", duration: "25 min", hasQuiz: true, hasFlashcards: false },
        ],
      },
      {
        id: "ch3",
        title: "Static Testing",
        estimatedTime: "2.5 hours",
        topics: [
          { id: "t10", title: "Static Testing Basics", duration: "30 min", hasQuiz: true, hasFlashcards: true },
          { id: "t11", title: "Review Process", duration: "45 min", hasQuiz: true, hasFlashcards: true },
          { id: "t12", title: "Review Types", duration: "35 min", hasQuiz: true, hasFlashcards: false },
        ],
      },
      {
        id: "ch4",
        title: "Test Design Techniques",
        estimatedTime: "5 hours",
        topics: [
          { id: "t13", title: "Categories of Test Techniques", duration: "20 min", hasQuiz: false, hasFlashcards: true },
          { id: "t14", title: "Black-box Test Techniques", duration: "60 min", hasQuiz: true, hasFlashcards: true },
          { id: "t15", title: "White-box Test Techniques", duration: "45 min", hasQuiz: true, hasFlashcards: true },
          { id: "t16", title: "Experience-based Techniques", duration: "30 min", hasQuiz: true, hasFlashcards: true },
        ],
      },
      {
        id: "ch5",
        title: "Test Management",
        estimatedTime: "4 hours",
        topics: [
          { id: "t17", title: "Test Organization", duration: "35 min", hasQuiz: true, hasFlashcards: true },
          { id: "t18", title: "Test Planning and Estimation", duration: "50 min", hasQuiz: true, hasFlashcards: true },
          { id: "t19", title: "Test Monitoring and Control", duration: "40 min", hasQuiz: true, hasFlashcards: false },
          { id: "t20", title: "Configuration Management", duration: "25 min", hasQuiz: false, hasFlashcards: true },
          { id: "t21", title: "Risk and Testing", duration: "45 min", hasQuiz: true, hasFlashcards: true },
        ],
      },
    ],
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setUploadState("parsing");
  };

  const handleParsingComplete = () => {
    setUploadState("preview");
  };

  const handleConfirm = () => {
    toast({
      title: "Course created successfully!",
      description: "Your ISTQB course has been generated and is ready for review.",
    });
  };

  const handleEdit = () => {
    toast({
      title: "Edit mode",
      description: "You can now modify the course outline.",
    });
  };

  const handleReset = () => {
    setUploadState("idle");
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar onCollapse={setSidebarCollapsed} />
      <Header sidebarCollapsed={sidebarCollapsed} />

      <main className={cn(
        "pt-20 pb-12 px-6 transition-all duration-300",
        sidebarCollapsed ? "ml-20" : "ml-64"
      )}>
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          {/* Page Header */}
          <div className="mb-8 animate-slide-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-glow-primary">
                <FileText className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Upload Syllabus</h1>
                <p className="text-muted-foreground">
                  Let AI transform your syllabus into an interactive course
                </p>
              </div>
            </div>
          </div>

          {/* Content based on state */}
          <div className="space-y-6">
            {uploadState === "idle" && (
              <>
                {/* Upload Area */}
                <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
                  <FileDropzone onFileSelect={handleFileSelect} />
                </div>

                {/* Info Cards */}
                <div className="grid md:grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
                  <div className="rounded-2xl bg-card border border-border/50 shadow-card p-5">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-accent/10">
                        <Sparkles className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">AI-Powered Analysis</h3>
                        <p className="text-sm text-muted-foreground">
                          Our AI analyzes your syllabus structure and automatically generates chapters, topics, quizzes, and flashcards.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-card border border-border/50 shadow-card p-5">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <HelpCircle className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Supported Formats</h3>
                        <p className="text-sm text-muted-foreground">
                          Upload PDF, Word documents (.docx, .doc), or plain text files. We handle the rest!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {uploadState === "parsing" && (
              <ParsingProgress 
                isActive={true} 
                onComplete={handleParsingComplete}
              />
            )}

            {uploadState === "preview" && (
              <>
                <CourseOutlinePreview
                  courseName={mockCourseOutline.courseName}
                  chapters={mockCourseOutline.chapters}
                  onConfirm={handleConfirm}
                  onEdit={handleEdit}
                />
                
                {/* Reset Button */}
                <div className="flex justify-center">
                  <Button 
                    variant="ghost" 
                    onClick={handleReset}
                    className="text-muted-foreground"
                  >
                    Upload a different file
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SyllabusUpload;
