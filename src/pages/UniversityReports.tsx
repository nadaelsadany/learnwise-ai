import { UniversityPageLayout } from "@/components/layout/UniversityPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileBarChart, Download, Users, BookOpen, Building2, GraduationCap, TrendingUp, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const deptPerformance = [
    { name: "CS", students: 420, completion: 88, avgGrade: 82 },
    { name: "Business", students: 350, completion: 91, avgGrade: 86 },
    { name: "Design", students: 180, completion: 95, avgGrade: 90 },
    { name: "Physics", students: 120, completion: 72, avgGrade: 74 },
    { name: "Math", students: 180, completion: 68, avgGrade: 71 },
];

const enrollmentByDept = [
    { name: "Computer Science", value: 420 },
    { name: "Business", value: 350 },
    { name: "Design & Arts", value: 180 },
    { name: "Physics", value: 120 },
    { name: "Mathematics", value: 180 },
];

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "#10b981", "#f59e0b", "#ef4444"];

const reportCards = [
    { title: "Student Performance Report", description: "Detailed grade distribution, pass/fail rates, and student progress across all courses", icon: GraduationCap, color: "text-primary bg-primary/10" },
    { title: "Course Completion Statistics", description: "Completion rates, dropout analysis, and time-to-completion metrics by course", icon: BookOpen, color: "text-emerald-500 bg-emerald-500/10" },
    { title: "Department Analytics", description: "Cross-department performance comparison, resource utilization, and growth trends", icon: Building2, color: "text-amber-500 bg-amber-500/10" },
    { title: "Instructor Activity Report", description: "Teaching hours, student engagement scores, course ratings, and content uploads", icon: Users, color: "text-violet-500 bg-violet-500/10" },
];

const UniversityReports = () => {
    return (
        <UniversityPageLayout>
            <div>
                <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <FileBarChart className="w-5 h-5 text-primary" />
                    </div>
                    Reports
                </h1>
                <p className="text-muted-foreground mt-1">Generate and download detailed academic performance reports</p>
            </div>

            {/* Report Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportCards.map(r => (
                    <Card key={r.title} className="border-border/50 hover:shadow-md transition-all group cursor-pointer">
                        <CardContent className="p-5 flex items-start gap-4">
                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", r.color)}>
                                <r.icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-sm mb-1">{r.title}</p>
                                <p className="text-xs text-muted-foreground mb-3">{r.description}</p>
                                <Button variant="outline" size="sm" className="gap-1.5">
                                    <Download className="w-3.5 h-3.5" /> Generate Report
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <BarChart2 className="w-4 h-4 text-primary" /> Department Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={deptPerformance}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                <XAxis dataKey="name" className="text-xs" />
                                <YAxis className="text-xs" />
                                <Tooltip />
                                <Bar dataKey="completion" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Completion %" />
                                <Bar dataKey="avgGrade" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Avg Grade" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary" /> Enrollment Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie data={enrollmentByDept} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                                    {enrollmentByDept.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Department Table */}
            <Card className="border-border/50">
                <CardHeader>
                    <CardTitle className="text-sm font-bold">Department Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {deptPerformance.map((dept, i) => (
                            <div key={dept.name} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0",
                                    i % 5 === 0 && "bg-primary/10 text-primary",
                                    i % 5 === 1 && "bg-accent/10 text-accent",
                                    i % 5 === 2 && "bg-emerald-500/10 text-emerald-500",
                                    i % 5 === 3 && "bg-amber-500/10 text-amber-500",
                                    i % 5 === 4 && "bg-destructive/10 text-destructive",
                                )}>
                                    {dept.name.slice(0, 2)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-semibold">{dept.name}</span>
                                        <span className="text-xs text-muted-foreground">{dept.students} students</span>
                                    </div>
                                    <Progress value={dept.completion} className="h-1.5" />
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-sm font-bold">{dept.avgGrade}%</p>
                                    <p className="text-xs text-muted-foreground">avg grade</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </UniversityPageLayout>
    );
};

export default UniversityReports;
