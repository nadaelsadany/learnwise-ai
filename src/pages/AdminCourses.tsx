import { useState } from "react";
import { AdminSidebar, AdminSidebarContent } from "@/components/layout/AdminSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
    BookOpen, Plus, Upload, FileText, Video,
    CheckCircle2, Clock, Loader2, Sparkles, Search,
    Users, Star, MoreHorizontal,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type CourseStatus = "Draft" | "Processing" | "Active";
type Course = {
    id: number; title: string; description: string;
    audience: string; duration: string; status: CourseStatus;
    enrolled: number; completion: number; aiScore: number;
    processing?: number;
};

const initialCourses: Course[] = [
    { id: 1, title: "React Fundamentals", description: "Core concepts of React for frontend developers", audience: "Engineering", duration: "6h", status: "Active", enrolled: 48, completion: 82, aiScore: 91 },
    { id: 2, title: "Python for Data Science", description: "Python basics and data manipulation", audience: "Analytics Team", duration: "8h", status: "Active", enrolled: 36, completion: 74, aiScore: 88 },
    { id: 3, title: "Leadership Essentials", description: "Soft skills for new managers", audience: "All Managers", duration: "4h", status: "Active", enrolled: 64, completion: 91, aiScore: 94 },
    { id: 4, title: "Excel & Data Analysis", description: "Spreadsheet mastery", audience: "Finance & Ops", duration: "5h", status: "Active", enrolled: 29, completion: 65, aiScore: 79 },
    { id: 5, title: "Cybersecurity Basics", description: "Security awareness for all staff", audience: "All Employees", duration: "3h", status: "Processing", enrolled: 0, completion: 0, aiScore: 0, processing: 65 },
];

const AdminCourses = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [courses, setCourses] = useState<Course[]>(initialCourses);
    const [search, setSearch] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [uploadCourseId, setUploadCourseId] = useState<number | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [newCourse, setNewCourse] = useState({ title: "", description: "", audience: "", duration: "" });
    const { toast } = useToast();

    const filtered = courses.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));

    const handleCreateCourse = () => {
        if (!newCourse.title) {
            toast({ variant: "destructive", title: "Title required" });
            return;
        }
        const created: Course = { id: Date.now(), ...newCourse, status: "Draft", enrolled: 0, completion: 0, aiScore: 0 };
        setCourses([...courses, created]);
        setIsCreateOpen(false);
        setNewCourse({ title: "", description: "", audience: "", duration: "" });
        toast({ title: "Course Created", description: `"${created.title}" added. Upload content to activate it.` });
    };

    const handleUpload = (files: FileList | null, courseId: number) => {
        if (!files?.length) return;
        toast({ title: "Upload Started", description: `Processing ${files[0].name}` });
        setCourses(prev => prev.map(c => c.id === courseId ? { ...c, status: "Processing" as CourseStatus, processing: 0 } : c));
        setUploadCourseId(null);
        let pct = 0;
        const iv = setInterval(() => {
            pct += 20;
            if (pct >= 100) {
                clearInterval(iv);
                setCourses(prev => prev.map(c => c.id === courseId ? { ...c, status: "Active" as CourseStatus, processing: 100, enrolled: 0, completion: 0, aiScore: 85 } : c));
                toast({ title: "AI Processing Complete!", description: "Content indexed. Draft questions ready." });
            } else {
                setCourses(prev => prev.map(c => c.id === courseId ? { ...c, processing: pct } : c));
            }
        }, 600);
    };

    const statusColor = (s: CourseStatus) =>
        s === "Active" ? "text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20" :
            s === "Processing" ? "text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/20" :
                "text-muted-foreground border-border bg-muted";

    return (
        <div className="min-h-screen bg-background">
            <AdminSidebar onCollapse={setSidebarCollapsed} />
            <Header sidebarCollapsed={sidebarCollapsed} userRole="Admin" mobileSidebar={<AdminSidebarContent collapsed={false} />} />
            <main className={cn("pt-20 pb-12 px-4 sm:px-6 transition-all duration-300", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64")}>
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black">Course Management</h1>
                            <p className="text-muted-foreground text-sm mt-1">Create and manage your training library</p>
                        </div>
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-rose-500 hover:bg-rose-600 text-white border-0"><Plus className="w-4 h-4 mr-2" /> Create Course</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[480px]">
                                <DialogHeader>
                                    <DialogTitle>Create New Course</DialogTitle>
                                    <DialogDescription>Set up the basic information for your training course.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2"><Label>Course Title</Label><Input placeholder="e.g. Project Management Basics" value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} /></div>
                                    <div className="space-y-2"><Label>Description</Label><Textarea placeholder="What will employees learn?" rows={3} value={newCourse.description} onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} /></div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2"><Label>Target Audience</Label><Input placeholder="e.g. All Managers" value={newCourse.audience} onChange={(e) => setNewCourse({ ...newCourse, audience: e.target.value })} /></div>
                                        <div className="space-y-2"><Label>Duration</Label><Input placeholder="e.g. 4h" value={newCourse.duration} onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })} /></div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                                    <Button onClick={handleCreateCourse} className="bg-rose-500 hover:bg-rose-600 text-white border-0">Create Course</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input className="pl-9" placeholder="Search courses…" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {filtered.map((course, i) => (
                            <Card key={course.id} className="border-border/50 hover:border-rose-300/50 transition-all duration-200 hover:shadow-lg flex flex-col">
                                <CardContent className="p-5 flex flex-col h-full">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                                            i % 4 === 0 && "bg-rose-500/10 text-rose-500",
                                            i % 4 === 1 && "bg-primary/10 text-primary",
                                            i % 4 === 2 && "bg-emerald-500/10 text-emerald-500",
                                            i % 4 === 3 && "bg-amber-500/10 text-amber-500",
                                        )}><BookOpen className="w-6 h-6" /></div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className={cn("text-xs font-semibold", statusColor(course.status))}>
                                                {course.status === "Processing" ? <><Loader2 className="w-3 h-3 mr-1 animate-spin" />Processing</> : course.status === "Active" ? <><CheckCircle2 className="w-3 h-3 mr-1" />Active</> : course.status}
                                            </Badge>
                                            <Button variant="ghost" size="icon" className="w-7 h-7"><MoreHorizontal className="w-4 h-4" /></Button>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-base mb-1">{course.title}</h3>
                                    <p className="text-sm text-muted-foreground flex-1 mb-3">{course.description}</p>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                                        {course.audience && <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{course.audience}</span>}
                                        {course.duration && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{course.duration}</span>}
                                    </div>
                                    {course.status === "Processing" && (
                                        <div className="mb-3">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-amber-600 font-medium flex items-center gap-1"><Sparkles className="w-3 h-3" />AI Indexing…</span>
                                                <span>{course.processing ?? 0}%</span>
                                            </div>
                                            <Progress value={course.processing ?? 0} className="h-1.5" />
                                        </div>
                                    )}
                                    {course.status === "Active" && (
                                        <div className="grid grid-cols-3 gap-2 mb-3">
                                            {[{ l: "Enrolled", v: course.enrolled }, { l: "Done", v: `${course.completion}%` }, { l: "Score", v: `${course.aiScore}%` }].map((s) => (
                                                <div key={s.l} className="text-center bg-muted/40 rounded-lg py-1.5"><p className="font-bold text-sm">{s.v}</p><p className="text-xs text-muted-foreground">{s.l}</p></div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex gap-2 mt-auto pt-3 border-t border-border/40">
                                        <Dialog open={uploadCourseId === course.id} onOpenChange={(o) => setUploadCourseId(o ? course.id : null)}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="flex-1"><Upload className="w-3.5 h-3.5 mr-1.5" /> Upload</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Upload Content</DialogTitle>
                                                    <DialogDescription>AI will index this material automatically for "{course.title}".</DialogDescription>
                                                </DialogHeader>
                                                <div
                                                    className={cn("border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors", dragOver ? "border-rose-400 bg-rose-50 dark:bg-rose-950/20" : "border-border/50 hover:border-rose-300")}
                                                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                                    onDragLeave={() => setDragOver(false)}
                                                    onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files, course.id); }}
                                                    onClick={() => document.getElementById(`fi-${course.id}`)?.click()}
                                                >
                                                    <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                                                    <p className="font-semibold">Drag & drop or click to browse</p>
                                                    <p className="text-sm text-muted-foreground mt-1">PDF, Slides, Videos, Documents</p>
                                                    <div className="flex justify-center gap-4 mt-3 text-xs text-muted-foreground">
                                                        {[FileText, Video].map((Icon, i) => (<span key={i} className="flex items-center gap-1"><Icon className="w-3.5 h-3.5" />{["PDF", "Video"][i]}</span>))}
                                                    </div>
                                                    <input id={`fi-${course.id}`} type="file" multiple className="hidden" onChange={(e) => handleUpload(e.target.files, course.id)} />
                                                </div>
                                                <DialogFooter><Button variant="outline" onClick={() => setUploadCourseId(null)}>Close</Button></DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                        {course.status === "Active" && (
                                            <Button variant="ghost" size="sm" className="text-amber-600 hover:bg-amber-50" onClick={() => toast({ title: "Questions Regenerated", description: "New draft questions are ready." })}>
                                                <Star className="w-3.5 h-3.5 mr-1" /> Questions
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {filtered.length === 0 && (
                            <div className="col-span-full text-center py-16 text-muted-foreground"><BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" /><p className="font-semibold">No courses found</p></div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminCourses;
