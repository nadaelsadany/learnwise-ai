import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ApplicantSidebar } from "@/components/layout/ApplicantSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Search,
    Filter,
    Calendar,
    Clock,
    Target,
    ArrowRight,
    RotateCcw,
    Eye,
    Play,
    Sparkles,
    BarChart3,
    ChevronRight,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Mock data for exams
const mockExams = [
    {
        id: "exam-1",
        title: "ISTQB Foundation Level - Full Mock",
        source: "Chapters 1-6 • All Topics",
        date: "2024-05-10",
        duration: "60 min",
        difficulty: "Hard",
        questions: 40,
        lastScore: 78,
        status: "completed",
        type: "official"
    },
    {
        id: "exam-2",
        title: "AI Generated: Test Design Techniques",
        source: "Chapter 4: Black-box & White-box",
        date: "2024-05-14",
        duration: "30 min",
        difficulty: "Medium",
        questions: 15,
        lastScore: null,
        status: "new",
        type: "ai"
    },
    {
        id: "exam-3",
        title: "Regression Testing Sprint 12",
        source: "Custom Selection • Automation Topics",
        date: "2024-05-12",
        duration: "45 min",
        difficulty: "Medium",
        questions: 25,
        lastScore: 65,
        status: "in-progress",
        type: "ai"
    },
    {
        id: "exam-4",
        title: "Security Testing Fundamentals",
        source: "Chapter 6: Tool Support",
        date: "2024-05-08",
        duration: "20 min",
        difficulty: "Easy",
        questions: 10,
        lastScore: 90,
        status: "completed",
        type: "official"
    }
];

const MockExamList = () => {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("newest");

    const filteredExams = useMemo(() => {
        let filtered = mockExams.filter(exam => 
            exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exam.source.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (sortBy === "newest") {
            filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } else if (sortBy === "oldest") {
            filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        } else if (sortBy === "score") {
            filtered.sort((a, b) => (b.lastScore || 0) - (a.lastScore || 0));
        }

        return filtered;
    }, [searchQuery, sortBy]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "completed": return <Badge className="bg-success/10 text-success border-success/20">Completed</Badge>;
            case "in-progress": return <Badge className="bg-warning/10 text-warning border-warning/20">In Progress</Badge>;
            case "new": return <Badge className="bg-primary/10 text-primary border-primary/20">New</Badge>;
            default: return null;
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case "easy": return "text-success";
            case "medium": return "text-warning";
            case "hard": return "text-destructive";
            default: return "";
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <ApplicantSidebar onCollapse={setSidebarCollapsed} />
            <Header sidebarCollapsed={sidebarCollapsed} userRole="Student" />

            <main
                className={cn(
                    "pt-20 pb-8 px-6 transition-all duration-300",
                    sidebarCollapsed ? "ml-20" : "ml-64"
                )}
            >
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">Mock Exams</h1>
                            <p className="text-muted-foreground max-w-lg">
                                Practice with official syllabus exams or AI-generated sessions tailored to your weak points.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search exams..." 
                                    className="pl-9 w-[250px] bg-card"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[160px] bg-card">
                                    <div className="flex items-center gap-2">
                                        <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                                        <SelectValue placeholder="Sort by" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Newest First</SelectItem>
                                    <SelectItem value="oldest">Oldest First</SelectItem>
                                    <SelectItem value="score">Highest Score</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-2xl bg-card border border-border/50 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <Target className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium uppercase">Avg. Score</p>
                                <p className="text-xl font-bold">82%</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-card border border-border/50 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-success">
                                <Play className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium uppercase">Exams Taken</p>
                                <p className="text-xl font-bold">12</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-card border border-border/50 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium uppercase">Streaks</p>
                                <p className="text-xl font-bold">5 Days</p>
                            </div>
                        </div>
                    </div>

                    {/* Exam List */}
                    <div className="grid gap-4">
                        {filteredExams.map((exam) => (
                            <div 
                                key={exam.id}
                                className="group bg-card hover:bg-muted/30 border border-border/50 rounded-2xl p-5 transition-all duration-300 animate-slide-up"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                    {/* Main Info */}
                                    <div className="flex-1 space-y-3">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                                                {exam.title}
                                            </h3>
                                            {getStatusBadge(exam.status)}
                                            {exam.type === "ai" && (
                                                <Badge variant="outline" className="gap-1.5 bg-primary/5 text-primary border-primary/10">
                                                    <Sparkles className="w-3 h-3" />
                                                    AI Generated
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(exam.date).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                {exam.duration}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <Target className="w-4 h-4" />
                                                {exam.questions} Questions
                                            </span>
                                            <span className={cn("font-medium", getDifficultyColor(exam.difficulty))}>
                                                {exam.difficulty}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground italic">
                                            Source: {exam.source}
                                        </p>
                                    </div>

                                    {/* Score & Actions */}
                                    <div className="flex items-center justify-between lg:justify-end gap-8 border-t lg:border-t-0 pt-4 lg:pt-0">
                                        {exam.lastScore !== null && (
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground font-medium uppercase mb-1">Last Score</p>
                                                <div className="flex items-end gap-1">
                                                    <span className={cn(
                                                        "text-2xl font-bold",
                                                        exam.lastScore >= 70 ? "text-success" : "text-warning"
                                                    )}>
                                                        {exam.lastScore}%
                                                    </span>
                                                    <span className="text-muted-foreground text-sm mb-1">/ 100</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3">
                                            {exam.status === "completed" ? (
                                                <>
                                                    <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate(`/mock-exam/${exam.id}?mode=review`)}>
                                                        <Eye className="w-4 h-4" />
                                                        Review
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="gap-2 border-primary/20 text-primary hover:bg-primary/5" onClick={() => navigate(`/mock-exam/${exam.id}`)}>
                                                        <RotateCcw className="w-4 h-4" />
                                                        Retake
                                                    </Button>
                                                </>
                                            ) : exam.status === "in-progress" ? (
                                                <Button className="gradient-primary shadow-glow-primary gap-2" onClick={() => navigate(`/mock-exam/${exam.id}`)}>
                                                    <Play className="w-4 h-4" />
                                                    Resume
                                                </Button>
                                            ) : (
                                                <Button className="gradient-primary shadow-glow-primary gap-2" onClick={() => navigate(`/mock-exam/${exam.id}`)}>
                                                    Start Exam
                                                    <ChevronRight className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredExams.length === 0 && (
                        <div className="text-center py-20 bg-card border border-dashed border-border rounded-3xl">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold">No exams found</h3>
                            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default MockExamList;
