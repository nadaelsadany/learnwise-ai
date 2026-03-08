import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UniversitySidebar, UniversitySidebarContent } from "@/components/layout/UniversitySidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Users,
    GraduationCap,
    BookOpen,
    TrendingUp,
    Building2,
    Plus,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    Zap,
    BarChart2,
    Star,
    ChevronRight,
    Brain,
    AlertTriangle,
    Lightbulb,
    Target,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const StatCard = ({
    title,
    value,
    sub,
    icon: Icon,
    trend,
    color,
}: {
    title: string;
    value: string | number;
    sub?: string;
    icon: React.ElementType;
    trend?: { value: number; positive: boolean };
    color: "primary" | "accent" | "emerald" | "amber";
}) => {
    const colorMap = {
        primary: "from-primary/20 to-primary/5 border-primary/20 text-primary",
        accent: "from-accent/20 to-accent/5 border-accent/20 text-accent",
        emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-500",
        amber: "from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-500",
    };
    const iconBg = {
        primary: "bg-primary text-primary-foreground",
        accent: "bg-accent text-white",
        emerald: "bg-emerald-500 text-white",
        amber: "bg-amber-500 text-white",
    };
    return (
        <Card className={cn("border bg-gradient-to-br relative overflow-hidden group hover:scale-[1.02] transition-all duration-300", colorMap[color])}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</p>
                        <p className="text-3xl font-black text-foreground">{typeof value === 'number' ? value.toLocaleString() : value}</p>
                        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
                    </div>
                    <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shadow-lg", iconBg[color])}>
                        <Icon className="w-5 h-5" />
                    </div>
                </div>
                {trend && (
                    <div className={cn(
                        "flex items-center gap-1 mt-4 text-xs font-semibold",
                        trend.positive ? "text-emerald-500" : "text-destructive"
                    )}>
                        {trend.positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {trend.value}% vs last month
                    </div>
                )}
            </CardContent>
            <div className={cn("absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-10 blur-xl", iconBg[color])} />
        </Card>
    );
};

const UniversityDashboard = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newDept, setNewDept] = useState({ name: "", head: "", budget: "" });

    const stats = {
        totalStudents: 1250,
        activeInstructors: 42,
        totalCourses: 156,
        avgCompletion: 74,
    };

    const [departments, setDepartments] = useState([
        { name: "Computer Science", head: "Dr. Alan Turing", courses: 45, students: 420, performance: 92, trend: 5 },
        { name: "Business Administration", head: "Prof. Mary Barra", courses: 38, students: 350, performance: 88, trend: 2 },
        { name: "Design & Arts", head: "Sarah Chen", courses: 25, students: 180, performance: 95, trend: 8 },
        { name: "Physics", head: "Dr. Richard Feynman", courses: 18, students: 120, performance: 85, trend: -3 },
        { name: "Mathematics", head: "Dr. John Nash", courses: 22, students: 180, performance: 78, trend: -1 },
    ]);

    const recentActivity = [
        { event: "New enrollment spike", dept: "Computer Science", time: "2h ago", type: "success" },
        { event: "Course published", dept: "Design & Arts", time: "4h ago", type: "info" },
        { event: "Low completion rate", dept: "Physics", time: "6h ago", type: "warn" },
        { event: "New instructor joined", dept: "Business", time: "1d ago", type: "success" },
    ];

    const handleAddDepartment = () => {
        if (!newDept.name || !newDept.head) {
            toast({ variant: "destructive", title: "Missing fields", description: "Name and head are required." });
            return;
        }
        setDepartments([...departments, {
            name: newDept.name, head: newDept.head, courses: 0, students: 0, performance: 100, trend: 0
        }]);
        setIsAddDialogOpen(false);
        setNewDept({ name: "", head: "", budget: "" });
        toast({ title: "Department Added", description: `${newDept.name} added successfully.` });
    };

    return (
        <div className="min-h-screen bg-background">
            <UniversitySidebar onCollapse={setSidebarCollapsed} />
            <Header
                sidebarCollapsed={sidebarCollapsed}
                userRole="University"
                mobileSidebar={<UniversitySidebarContent collapsed={false} />}
            />

            <main className={cn(
                "pt-20 pb-12 px-4 sm:px-6 transition-all duration-300",
                sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
            )}>
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Hero Header */}
                    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary via-primary/80 to-accent p-8 text-primary-foreground shadow-xl">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl translate-x-1/2 -translate-y-1/2" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white blur-3xl -translate-x-1/2 translate-y-1/2" />
                        </div>
                        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-xs font-semibold uppercase tracking-widest opacity-80">Live Dashboard</span>
                                </div>
                                <h1 className="text-4xl font-black tracking-tight">University Control</h1>
                                <p className="text-primary-foreground/70 mt-1 text-sm">
                                    Full campus overview · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30 border backdrop-blur-sm font-semibold">
                                        <Plus className="w-4 h-4 mr-2" /> New Department
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Add New Department</DialogTitle>
                                        <DialogDescription>Create a new department under the university.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Department Name</Label>
                                            <Input id="name" placeholder="e.g. Mathematics" value={newDept.name} onChange={(e) => setNewDept({ ...newDept, name: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="head">Head of Department</Label>
                                            <Input id="head" placeholder="e.g. Dr. John Nash" value={newDept.head} onChange={(e) => setNewDept({ ...newDept, head: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="budget">Initial Budget ($)</Label>
                                            <Input id="budget" type="number" placeholder="e.g. 50000" value={newDept.budget} onChange={(e) => setNewDept({ ...newDept, budget: e.target.value })} />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                        <Button onClick={handleAddDepartment} className="gradient-primary text-white border-0">Add Department</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* Mini stats inside hero */}
                        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
                            {[
                                { label: "Departments", val: departments.length, icon: Building2 },
                                { label: "Avg Completion", val: `${stats.avgCompletion}%`, icon: Activity },
                                { label: "Active Courses", val: stats.totalCourses, icon: BookOpen },
                                { label: "Satisfaction", val: "4.8 ★", icon: Star },
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

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard title="Total Students" value={stats.totalStudents} sub="Enrolled this semester" icon={GraduationCap} trend={{ value: 12, positive: true }} color="primary" />
                        <StatCard title="Instructors" value={stats.activeInstructors} sub="Across all departments" icon={Users} trend={{ value: 5, positive: true }} color="accent" />
                        <StatCard title="Active Courses" value={stats.totalCourses} sub="Published & running" icon={BookOpen} trend={{ value: 8, positive: true }} color="emerald" />
                        <StatCard title="Avg Completion" value={`${stats.avgCompletion}%`} sub="Student course completion" icon={TrendingUp} trend={{ value: 3, positive: true }} color="amber" />
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Department Performance - 2 cols */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    <BarChart2 className="w-5 h-5 text-primary" />
                                    Department Performance
                                </h2>
                                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary">
                                    View All <ChevronRight className="w-3 h-3 ml-1" />
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {departments.map((dept, i) => (
                                    <Card key={dept.name} className="border-border/50 hover:border-primary/30 transition-all duration-200 hover:shadow-md group cursor-pointer">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0",
                                                    i % 4 === 0 && "bg-primary/10 text-primary",
                                                    i % 4 === 1 && "bg-accent/10 text-accent",
                                                    i % 4 === 2 && "bg-emerald-500/10 text-emerald-500",
                                                    i % 4 === 3 && "bg-amber-500/10 text-amber-500",
                                                    i % 4 === 4 && "bg-rose-500/10 text-rose-500",
                                                )}>
                                                    {dept.name.slice(0, 2).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-semibold text-sm truncate">{dept.name}</p>
                                                        <div className="flex items-center gap-2 shrink-0 ml-2">
                                                            <span className={cn(
                                                                "text-xs font-bold flex items-center gap-0.5",
                                                                dept.trend > 0 ? "text-emerald-500" : "text-destructive"
                                                            )}>
                                                                {dept.trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                                                {Math.abs(dept.trend)}%
                                                            </span>
                                                            <Badge variant="outline" className={cn(
                                                                "text-xs font-bold border",
                                                                dept.performance >= 90 ? "text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20" :
                                                                    dept.performance >= 80 ? "text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/20" :
                                                                        "text-destructive border-destructive/20 bg-destructive/5"
                                                            )}>
                                                                {dept.performance}%
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mb-2">{dept.head} · {dept.courses} courses · {dept.students} students</p>
                                                    <Progress value={dept.performance} className="h-1.5" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Right column */}
                        <div className="space-y-6">
                            {/* Quick Stats */}
                            <Card className="border-border/50">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-amber-500" />
                                        Quick Insights
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {[
                                        { label: "Top Dept by Students", val: "Computer Science", sub: "420 students" },
                                        { label: "Highest Performance", val: "Design & Arts", sub: "95% score" },
                                        { label: "Most Courses", val: "Computer Science", sub: "45 courses" },
                                        { label: "New This Month", val: "+48 students", sub: "Across all depts" },
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                                            <div>
                                                <p className="text-xs text-muted-foreground">{item.label}</p>
                                                <p className="text-sm font-semibold">{item.val}</p>
                                            </div>
                                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{item.sub}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Activity Feed */}
                            <Card className="border-border/50">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-primary" />
                                        Recent Activity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {recentActivity.map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 group cursor-pointer">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full mt-1.5 shrink-0",
                                                item.type === "success" && "bg-emerald-500",
                                                item.type === "warn" && "bg-amber-500",
                                                item.type === "info" && "bg-primary",
                                            )} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium leading-tight">{item.event}</p>
                                                <p className="text-xs text-muted-foreground">{item.dept} · {item.time}</p>
                                            </div>
                                            <ChevronRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
                                        </div>
                                    ))}
                                    <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-primary mt-2" onClick={() => navigate("/university/analytics")}>
                                        View all activity
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UniversityDashboard;
