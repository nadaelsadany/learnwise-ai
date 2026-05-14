import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ApplicantSidebar } from "@/components/layout/ApplicantSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { mockCourses } from "@/components/courses";
import { getCourseWithChapters } from "@/components/courses/courseChapters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCourses } from "@/hooks/useCourses";
import { Loader2, ArrowLeft, MessageSquare, Send, Search } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const CourseDiscussions = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [courseName, setCourseName] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedThread, setSelectedThread] = useState<any>(null);
    const [isAskModalOpen, setIsAskModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const { getCourseById } = useCourses();

    useEffect(() => {
        const loadCourse = async () => {
            if (!courseId) return;
            setLoading(true);
            const mock = getCourseWithChapters(courseId, mockCourses);
            if (mock) {
                setCourseName(mock.title);
            } else {
                const { course } = await getCourseById(courseId);
                if (course) setCourseName(course.title);
            }
            setLoading(false);
        };
        loadCourse();
    }, [courseId]);

    const threads = [
        { 
            id: 1, 
            title: "Best practices for Playwright selectors?", 
            author: "Sarah Connor", 
            replies: [
                { id: 101, user: "Alex Thompson", content: "I recommend using data-testid attributes whenever possible for stability.", role: "Instructor", time: "2h ago" },
                { id: 102, user: "John Smith", content: "Thanks! What about CSS selectors?", role: "Student", time: "1h ago" }
            ], 
            instructorReplied: true 
        },
        { 
            id: 2, 
            title: "How to handle multi-tab testing?", 
            author: "John Smith", 
            replies: [
                { id: 201, user: "Sarah Mitchell", content: "Use the browserContext.waitForEvent('page') method.", role: "Instructor", time: "5h ago" }
            ], 
            instructorReplied: true 
        },
        { 
            id: 3, 
            title: "CI/CD integration with GitHub Actions", 
            author: "Kyle Reese", 
            replies: [], 
            instructorReplied: false 
        }
    ];

    const filteredThreads = threads.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <ApplicantSidebar onCollapse={setSidebarCollapsed} />
            <Header sidebarCollapsed={sidebarCollapsed} userRole="Student" />

            <main className={cn(
                "pt-20 pb-12 px-6 transition-all duration-300",
                sidebarCollapsed ? "ml-20" : "ml-64"
            )}>
                <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
                    {/* Header */}
                    <div className="space-y-4">
                        <Button variant="ghost" onClick={() => navigate(`/courses/${courseId}`)} className="gap-2 -ml-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Course
                        </Button>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Community Discussion</h1>
                                <p className="text-muted-foreground mt-1">{courseName}</p>
                            </div>
                            <Button onClick={() => setIsAskModalOpen(true)} className="gradient-primary shadow-glow-primary gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Ask a Question
                            </Button>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search questions..." 
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Thread List */}
                    <div className="space-y-3">
                        {filteredThreads.length > 0 ? (
                            filteredThreads.map((thread) => (
                                <div 
                                    key={thread.id} 
                                    onClick={() => setSelectedThread(thread)}
                                    className="p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all cursor-pointer group shadow-soft"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{thread.title}</h3>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    <Avatar className="h-5 w-5">
                                                        <AvatarFallback className="text-[10px]">{thread.author[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <span>{thread.author}</span>
                                                </div>
                                                <span>•</span>
                                                <span>{thread.replies.length} replies</span>
                                            </div>
                                        </div>
                                        {thread.instructorReplied && (
                                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                                Instructor Replied
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 border-2 border-dashed border-border/50 rounded-2xl">
                                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                                <h3 className="text-lg font-medium">No questions found</h3>
                                <p className="text-muted-foreground">Be the first to start a conversation for this course!</p>
                            </div>
                        )}
                    </div>

                    {/* Thread Detail Dialog */}
                    <Dialog open={!!selectedThread} onOpenChange={(open) => !open && setSelectedThread(null)}>
                        <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col p-0">
                            {selectedThread && (
                                <>
                                    <div className="p-6 border-b border-border/50">
                                        <DialogTitle className="text-2xl">{selectedThread.title}</DialogTitle>
                                        <p className="text-sm text-muted-foreground mt-1">Started by {selectedThread.author}</p>
                                    </div>
                                    
                                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                        {selectedThread.replies.length > 0 ? (
                                            selectedThread.replies.map((reply: any) => (
                                                <div key={reply.id} className={cn(
                                                    "flex gap-4 p-5 rounded-2xl",
                                                    reply.role === "Instructor" ? "bg-primary/5 border border-primary/10 shadow-sm" : "bg-muted/30"
                                                )}>
                                                    <Avatar className="h-10 w-10 shrink-0">
                                                        <AvatarFallback className={reply.role === "Instructor" ? "bg-primary text-white font-bold" : ""}>
                                                            {reply.user[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="space-y-1.5 flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-sm">{reply.user}</span>
                                                                {reply.role === "Instructor" && (
                                                                    <Badge className="bg-primary text-white text-[10px] h-4.5 px-1.5">Instructor</Badge>
                                                                )}
                                                            </div>
                                                            <span className="text-[10px] text-muted-foreground font-medium uppercase">{reply.time}</span>
                                                        </div>
                                                        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12 text-muted-foreground italic">
                                                No replies yet.
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6 border-t border-border/50 bg-muted/10">
                                        <div className="flex gap-3">
                                            <Textarea 
                                                placeholder="Write a helpful response..." 
                                                className="min-h-[100px] bg-background shadow-inner resize-none"
                                            />
                                            <Button size="icon" className="shrink-0 h-[100px] w-12 gradient-primary shadow-glow-primary">
                                                <Send className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </DialogContent>
                    </Dialog>

                    {/* Ask Modal */}
                    <Dialog open={isAskModalOpen} onOpenChange={setIsAskModalOpen}>
                        <DialogContent className="sm:max-w-[550px]">
                            <DialogHeader>
                                <DialogTitle className="text-2xl">Ask a Question</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-5 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1">Question Title</label>
                                    <Input placeholder="e.g., How do I configure parallel execution?" className="h-11" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1">Context / Details</label>
                                    <Textarea placeholder="Explain what you're trying to achieve..." rows={6} className="resize-none" />
                                </div>
                            </div>
                            <DialogFooter className="gap-3">
                                <Button variant="ghost" onClick={() => setIsAskModalOpen(false)}>Cancel</Button>
                                <Button onClick={() => setIsAskModalOpen(false)} className="gradient-primary px-8">Post Question</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </main>
        </div>
    );
};

export default CourseDiscussions;
