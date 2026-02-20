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
    GraduationCap, Search, MoreHorizontal, Mail, BookOpen,
    TrendingUp, Users, Award,
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

    const [students] = useState<Student[]>([
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
                                                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                        <DropdownMenuItem>Academic Transcript</DropdownMenuItem>
                                                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive focus:text-destructive">Expel Student</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            {/* Department */}
                                            <Badge variant="outline" className="text-xs font-medium">{student.department}</Badge>

                                            {/* GPA + courses stats */}
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

                                            {/* Completion progress bar */}
                                            <div>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs text-muted-foreground">Course Completion</span>
                                                    <span className="text-xs font-semibold">{student.completionRate}%</span>
                                                </div>
                                                <Progress value={student.completionRate} className="h-1.5" />
                                            </div>

                                            {/* Status */}
                                            <div className="flex items-center justify-between pt-1 border-t border-border/40">
                                                <Badge variant="outline" className={cn("text-xs font-semibold border", cfg.cls)}>
                                                    {cfg.label}
                                                </Badge>
                                                <Button variant="ghost" size="sm" className="text-xs h-7 text-muted-foreground hover:text-primary">
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
        </div>
    );
};

export default UniversityStudents;
