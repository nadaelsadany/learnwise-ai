import { useState } from "react";
import { UniversitySidebar, UniversitySidebarContent } from "@/components/layout/UniversitySidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    GraduationCap, Search, MoreHorizontal, Mail, BookOpen,
    TrendingUp, Users, Award, User, FileText, Send, UserX,
} from "lucide-react";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Student {
    id: string;
    name: string;
    email: string;
    department: string;
    enrolledCourses: number;
    gpa: number;
    completionRate: number;
    status: "active" | "inactive" | "graduated";
}

const UniversityStudents = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const { toast } = useToast();

    // Action dialogs
    const [viewProfileStudent, setViewProfileStudent] = useState<Student | null>(null);
    const [transcriptStudent, setTranscriptStudent] = useState<Student | null>(null);
    const [messageStudent, setMessageStudent] = useState<Student | null>(null);
    const [expelStudent, setExpelStudent] = useState<Student | null>(null);
    const [messageText, setMessageText] = useState("");

    const [students, setStudents] = useState<Student[]>([
        { id: "1", name: "Alice Smith", email: "alice@student.edu", department: "Computer Science", enrolledCourses: 4, gpa: 3.8, completionRate: 87, status: "active" },
        { id: "2", name: "Bob Johnson", email: "bob@student.edu", department: "Business", enrolledCourses: 5, gpa: 3.5, completionRate: 72, status: "active" },
        { id: "3", name: "Charlie Brown", email: "charlie@student.edu", department: "Engineering", enrolledCourses: 3, gpa: 3.9, completionRate: 100, status: "graduated" },
        { id: "4", name: "Diana Prince", email: "diana@student.edu", department: "Arts & Design", enrolledCourses: 6, gpa: 3.7, completionRate: 65, status: "active" },
        { id: "5", name: "Ethan Hunt", email: "ethan@student.edu", department: "Physics", enrolledCourses: 2, gpa: 2.8, completionRate: 40, status: "inactive" },
        { id: "6", name: "Fiona Green", email: "fiona@student.edu", department: "Computer Science", enrolledCourses: 4, gpa: 4.0, completionRate: 95, status: "active" },
    ]);

    const filtered = students.filter(s =>
        (filterStatus === "all" || s.status === filterStatus) &&
        (s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.department.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const statusConfig = {
        active: { label: "Active", cls: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800" },
        graduated: { label: "Graduated", cls: "bg-primary/10 text-primary border-primary/20" },
        inactive: { label: "Inactive", cls: "bg-muted text-muted-foreground border-border" },
    };

    const avgGpa = (students.reduce((a, s) => a + s.gpa, 0) / students.length).toFixed(2);
    const avgCompletion = Math.round(students.reduce((a, s) => a + s.completionRate, 0) / students.length);

    const gpaColor = (gpa: number) => {
        if (gpa >= 3.7) return "text-emerald-600";
        if (gpa >= 3.0) return "text-amber-600";
        return "text-destructive";
    };

    const handleSendMessage = () => {
        if (!messageStudent || !messageText.trim()) return;
        toast({ title: "Message Sent", description: `Message sent to ${messageStudent.name}.` });
        setMessageStudent(null);
        setMessageText("");
    };

    const handleExpel = () => {
        if (!expelStudent) return;
        setStudents(students.filter(s => s.id !== expelStudent.id));
        toast({ variant: "destructive", title: "Student Expelled", description: `${expelStudent.name} has been expelled.` });
        setExpelStudent(null);
    };

    // Mock transcript data
    const mockTranscript = [
        { course: "Introduction to CS", grade: "A", credits: 3 },
        { course: "Data Structures", grade: "A-", credits: 3 },
        { course: "Calculus I", grade: "B+", credits: 4 },
        { course: "English Composition", grade: "A", credits: 3 },
        { course: "Physics I", grade: "B", credits: 4 },
    ];

    return (
        <div className="min-h-screen bg-background">
            <UniversitySidebar onCollapse={setSidebarCollapsed} />
            <Header sidebarCollapsed={sidebarCollapsed} userRole="University" mobileSidebar={<UniversitySidebarContent collapsed={false} />} />

            <main className={cn("pt-20 pb-12 px-4 sm:px-6 transition-all duration-300", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64")}>
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Hero Header */}
                    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-500 to-primary p-8 text-white shadow-xl">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white blur-3xl translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <GraduationCap className="w-5 h-5 opacity-70" />
                                    <span className="text-xs font-semibold uppercase tracking-widest opacity-70">Enrollment</span>
                                </div>
                                <h1 className="text-4xl font-black tracking-tight">Students</h1>
                                <p className="opacity-70 mt-1 text-sm">View and manage student enrollments and records</p>
                            </div>
                            <Button
                                variant="secondary"
                                className="bg-white/20 hover:bg-white/30 text-white border-white/30 border backdrop-blur-sm font-semibold"
                                onClick={() => toast({ title: "Email sent", description: "Broadcast sent to all students." })}
                            >
                                <Mail className="w-4 h-4 mr-2" /> Email All Students
                            </Button>
                        </div>
                        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
                            {[
                                { label: "Total Students", val: students.length, icon: Users },
                                { label: "Active", val: students.filter(s => s.status === 'active').length, icon: TrendingUp },
                                { label: "Avg GPA", val: avgGpa, icon: Award },
                                { label: "Avg Completion", val: `${avgCompletion}%`, icon: BookOpen },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center gap-3">
                                    <item.icon className="w-4 h-4 opacity-60 shrink-0" />
                                    <div>
                                        <p className="text-xs opacity-60 font-medium">{item.label}</p>
                                        <p className="font-bold text-sm">{item.val}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Search students..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="flex gap-2">
                            {["all", "active", "graduated", "inactive"].map((s) => (
                                <Button
                                    key={s}
                                    size="sm"
                                    variant={filterStatus === s ? "default" : "outline"}
                                    onClick={() => setFilterStatus(s)}
                                    className={cn("capitalize text-xs", filterStatus === s && "gradient-primary text-white border-0")}
                                >
                                    {s}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Student Cards */}
                    {filtered.length === 0 ? (
                        <div className="text-center py-20 border border-dashed border-border rounded-2xl">
                            <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold">No students found</h3>
                            <p className="text-muted-foreground mt-1 text-sm">Try adjusting your search or filters.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {filtered.map((student) => {
                                const cfg = statusConfig[student.status];
                                return (
                                    <Card key={student.id} className="border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
                                        <CardContent className="p-5 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-12 h-12 border-2 border-background shadow-md">
                                                        <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${student.name}`} />
                                                        <AvatarFallback className="font-bold text-sm">{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-bold text-sm leading-tight">{student.name}</p>
                                                        <p className="text-xs text-muted-foreground">{student.email}</p>
                                                    </div>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => setViewProfileStudent(student)}>
                                                            <User className="w-4 h-4 mr-2" /> View Profile
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => setTranscriptStudent(student)}>
                                                            <FileText className="w-4 h-4 mr-2" /> Academic Transcript
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => { setMessageStudent(student); setMessageText(""); }}>
                                                            <Send className="w-4 h-4 mr-2" /> Send Message
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setExpelStudent(student)}>
                                                            <UserX className="w-4 h-4 mr-2" /> Expel Student
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            <Badge variant="outline" className="text-xs font-medium">{student.department}</Badge>

                                            <div className="grid grid-cols-3 gap-2">
                                                <div className="text-center p-2 rounded-lg bg-muted/40">
                                                    <p className={cn("text-base font-black", gpaColor(student.gpa))}>{student.gpa}</p>
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">GPA</p>
                                                </div>
                                                <div className="text-center p-2 rounded-lg bg-muted/40">
                                                    <p className="text-base font-black">{student.enrolledCourses}</p>
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Courses</p>
                                                </div>
                                                <div className="text-center p-2 rounded-lg bg-muted/40">
                                                    <p className="text-base font-black">{student.completionRate}%</p>
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Done</p>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs text-muted-foreground">Course Completion</span>
                                                    <span className="text-xs font-semibold">{student.completionRate}%</span>
                                                </div>
                                                <Progress value={student.completionRate} className="h-1.5" />
                                            </div>

                                            <div className="flex items-center justify-between pt-1 border-t border-border/40">
                                                <Badge variant="outline" className={cn("text-xs font-semibold border", cfg.cls)}>
                                                    {cfg.label}
                                                </Badge>
                                                <Button variant="ghost" size="sm" className="text-xs h-7 text-muted-foreground hover:text-primary" onClick={() => { setMessageStudent(student); setMessageText(""); }}>
                                                    <Mail className="w-3 h-3 mr-1" /> Message
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            {/* View Profile Dialog */}
            <Dialog open={!!viewProfileStudent} onOpenChange={(open) => !open && setViewProfileStudent(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Student Profile</DialogTitle>
                        <DialogDescription>Detailed information about the student.</DialogDescription>
                    </DialogHeader>
                    {viewProfileStudent && (
                        <div className="space-y-4 py-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-16 h-16 border-2 border-background shadow-md">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${viewProfileStudent.name}`} />
                                    <AvatarFallback className="font-bold">{viewProfileStudent.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-bold text-lg">{viewProfileStudent.name}</h3>
                                    <p className="text-sm text-muted-foreground">{viewProfileStudent.email}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-lg bg-muted/40">
                                    <p className="text-xs text-muted-foreground">Department</p>
                                    <p className="font-semibold text-sm">{viewProfileStudent.department}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/40">
                                    <p className="text-xs text-muted-foreground">Status</p>
                                    <p className="font-semibold text-sm capitalize">{viewProfileStudent.status}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/40">
                                    <p className="text-xs text-muted-foreground">GPA</p>
                                    <p className={cn("font-bold text-lg", gpaColor(viewProfileStudent.gpa))}>{viewProfileStudent.gpa}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/40">
                                    <p className="text-xs text-muted-foreground">Enrolled Courses</p>
                                    <p className="font-bold text-lg">{viewProfileStudent.enrolledCourses}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Completion Rate</p>
                                <Progress value={viewProfileStudent.completionRate} className="h-2" />
                                <p className="text-xs font-semibold mt-1">{viewProfileStudent.completionRate}%</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Academic Transcript Dialog */}
            <Dialog open={!!transcriptStudent} onOpenChange={(open) => !open && setTranscriptStudent(null)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Academic Transcript</DialogTitle>
                        <DialogDescription>{transcriptStudent?.name} — {transcriptStudent?.department}</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="border rounded-lg overflow-hidden">
                            <div className="grid grid-cols-3 bg-muted/50 p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                <span>Course</span>
                                <span className="text-center">Grade</span>
                                <span className="text-right">Credits</span>
                            </div>
                            {mockTranscript.map((item, i) => (
                                <div key={i} className="grid grid-cols-3 p-3 border-t border-border/40 text-sm">
                                    <span className="font-medium">{item.course}</span>
                                    <span className="text-center font-bold">{item.grade}</span>
                                    <span className="text-right text-muted-foreground">{item.credits}</span>
                                </div>
                            ))}
                            <div className="grid grid-cols-3 p-3 border-t border-border bg-muted/30 text-sm font-bold">
                                <span>Total</span>
                                <span className="text-center">GPA: {transcriptStudent?.gpa}</span>
                                <span className="text-right">{mockTranscript.reduce((a, c) => a + c.credits, 0)} credits</span>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Send Message Dialog */}
            <Dialog open={!!messageStudent} onOpenChange={(open) => !open && setMessageStudent(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Send Message</DialogTitle>
                        <DialogDescription>Send a message to {messageStudent?.name}.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="msg-to">To</Label>
                            <Input id="msg-to" value={messageStudent?.email || ""} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="msg-body">Message</Label>
                            <Textarea id="msg-body" rows={4} placeholder="Type your message..." value={messageText} onChange={(e) => setMessageText(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setMessageStudent(null)}>Cancel</Button>
                        <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                            <Send className="w-4 h-4 mr-2" /> Send
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Expel Student Confirmation */}
            <AlertDialog open={!!expelStudent} onOpenChange={(open) => !open && setExpelStudent(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Expel Student?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently remove {expelStudent?.name} from the university. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleExpel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Expel
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default UniversityStudents;