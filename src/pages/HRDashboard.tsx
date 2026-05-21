import { useState } from "react";
import { HRSidebar, HRSidebarContent } from "@/components/layout/HRSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Users, BookOpen, TrendingUp, AlertTriangle, Activity,
    ArrowUpRight, ArrowDownRight, Zap, ChevronRight, Briefcase,
    CheckCircle2, Clock, BarChart2, Award, Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const StatCard = ({
    title, value, sub, icon: Icon, trend, color,
}: {
    title: string; value: string | number; sub?: string;
    icon: React.ElementType;
    trend?: { value: number; positive: boolean };
    color: "indigo" | "violet" | "emerald" | "amber";
}) => {
    const colorMap = {
        indigo: "from-indigo-500/20 to-indigo-500/5 border-indigo-500/20 text-indigo-500",
        violet: "from-violet-500/20 to-violet-500/5 border-violet-500/20 text-violet-500",
        emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-500",
        amber: "from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-500",
    };
    const iconBg = {
        indigo: "bg-indigo-500 text-white",
        violet: "bg-violet-500 text-white",
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
                    <div className={cn("flex items-center gap-1 mt-4 text-xs font-semibold", trend.positive ? "text-emerald-500" : "text-destructive")}>
                        {trend.positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {trend.value}% vs last month
                    </div>
                )}
            </CardContent>
            <div className={cn("absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-10 blur-xl", iconBg[color])} />
        </Card>
    );
};

const HRDashboard = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const navigate = useNavigate();

    const atRiskEmployees = [
        { name: "Michael Chen", dept: "Engineering", progress: 24, reason: "Low Exam Score" },
        { name: "Sarah Miller", dept: "Marketing", progress: 38, reason: "Inactive > 2 weeks" },
        { name: "David Wilson", dept: "Sales", progress: 15, reason: "Failed Certification" },
    ];

    const teamPerformance = [
        { name: "Engineering", completion: 82, active: 45, certs: 12 },
        { name: "Marketing", completion: 64, active: 28, certs: 5 },
        { name: "Sales", completion: 71, active: 32, certs: 8 },
        { name: "Product", completion: 91, active: 18, certs: 14 },
    ];

    const certStatus = [
        { name: "ISTQB Foundation", employee: "Emma Thompson", status: "Pending Approval", date: "2h ago" },
        { name: "AWS Cloud Practitioner", employee: "James Rodriguez", status: "Completed", date: "5h ago" },
        { name: "React Professional", employee: "Lisa Wang", status: "Pending Approval", date: "Yesterday" },
    ];

    return (
        <div className="min-h-screen bg-background">
            <HRSidebar onCollapse={setSidebarCollapsed} />
            <Header
                sidebarCollapsed={sidebarCollapsed}
                userRole="HR Manager"
                mobileSidebar={<HRSidebarContent collapsed={false} />}
            />
            <main className={cn("pt-20 pb-12 px-4 sm:px-6 transition-all duration-300", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64")}>
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Hero Section */}
                    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 p-8 text-white shadow-xl shadow-indigo-500/20">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl translate-x-1/2 -translate-y-1/2" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white blur-3xl -translate-x-1/2 translate-y-1/2" />
                        </div>
                        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-indigo-300 animate-pulse" />
                                    <span className="text-xs font-semibold uppercase tracking-widest opacity-80">HR Intelligence</span>
                                </div>
                                <h1 className="text-4xl font-black tracking-tight">Talent Development Center</h1>
                                <p className="text-indigo-100 mt-1 text-sm">
                                    Managing the growth of {teamPerformance.length} departments · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    onClick={() => navigate("/hr/assignments")}
                                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 border backdrop-blur-sm font-semibold rounded-xl"
                                    variant="secondary"
                                >
                                    <BookOpen className="w-4 h-4 mr-2" /> Assign Learning
                                </Button>
                                <Button
                                    onClick={() => navigate("/hr/reports")}
                                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 border backdrop-blur-sm font-semibold rounded-xl"
                                    variant="secondary"
                                >
                                    <BarChart2 className="w-4 h-4 mr-2" /> Export Reports
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* TOP OVERVIEW Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard title="Total Employees" value={184} sub="Managed accounts" icon={Users} trend={{ value: 12, positive: true }} color="indigo" />
                        <StatCard title="Active Learners" value={142} sub="Enrolled in courses" icon={Zap} trend={{ value: 5, positive: true }} color="violet" />
                        <StatCard title="Completion Rate" value="78%" sub="Course completion avg" icon={CheckCircle2} trend={{ value: 3, positive: true }} color="emerald" />
                        <StatCard title="Certification Rate" value="64%" sub="Employees certified" icon={Award} trend={{ value: 8, positive: true }} color="amber" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* 1. Team Performance */}
                        <div className="lg:col-span-2 space-y-4">
                            <Card className="border-border/50 shadow-soft">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-indigo-500" /> Team Performance
                                    </CardTitle>
                                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-indigo-600">
                                        View Details <ChevronRight className="w-3 h-3 ml-1" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {teamPerformance.map((dept) => (
                                        <div key={dept.name} className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold">{dept.name}</span>
                                                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">({dept.active} Active)</span>
                                                </div>
                                                <span className="font-bold text-indigo-600">{dept.completion}%</span>
                                            </div>
                                            <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                                                <div 
                                                    className="absolute left-0 top-0 h-full bg-indigo-500 rounded-full transition-all duration-1000"
                                                    style={{ width: `${dept.completion}%` }}
                                                />
                                            </div>
                                            <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                                                <span className="flex items-center gap-1"><Award className="w-3 h-3" /> {dept.certs} Certifications</span>
                                                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {Math.round(dept.active * (dept.completion/100))} Graduated</span>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* 2. At-Risk Employees */}
                            <Card className="border-border/50 shadow-soft">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-amber-500" /> At-Risk Employees
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {atRiskEmployees.map((emp) => (
                                            <div key={emp.name} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors group cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-xs">
                                                        {emp.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold">{emp.name}</p>
                                                        <p className="text-[10px] text-muted-foreground">{emp.dept}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <Badge variant="outline" className="text-[10px] bg-amber-500/5 text-amber-600 border-amber-500/20 mb-1">
                                                        {emp.reason}
                                                    </Badge>
                                                    <div className="flex items-center gap-2 justify-end">
                                                        <span className="text-[10px] font-bold">{emp.progress}%</span>
                                                        <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                                                            <div className="h-full bg-amber-500" style={{ width: `${emp.progress}%` }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right column */}
                        <div className="space-y-6">
                            {/* 3. Certification Status */}
                            <Card className="border-border/50 shadow-soft">
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                                        <Award className="w-4 h-4 text-violet-500" /> Certification Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {certStatus.map((cert, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-xs font-bold leading-none">{cert.name}</p>
                                                    <p className="text-[10px] text-muted-foreground mt-1">{cert.employee}</p>
                                                </div>
                                                <Badge variant={cert.status === "Completed" ? "default" : "secondary"} className="text-[8px] h-4 uppercase tracking-tighter">
                                                    {cert.status}
                                                </Badge>
                                            </div>
                                            <p className="text-[9px] text-muted-foreground flex items-center gap-1">
                                                <Clock className="w-2.5 h-2.5" /> Uploaded {cert.date}
                                            </p>
                                        </div>
                                    ))}
                                    <Button variant="outline" className="w-full text-xs h-9 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600">
                                        Review All Certificates
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* 4. Recent Activity */}
                            <Card className="border-border/50 shadow-soft">
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-indigo-500" /> Recent Activity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {[
                                        { title: "Course Assigned", desc: "React Basics to Dev Team", time: "10m ago", icon: Zap, color: "text-indigo-500" },
                                        { title: "Certificate Approved", desc: "ISTQB for Emma Thompson", time: "1h ago", icon: CheckCircle2, color: "text-emerald-500" },
                                        { title: "Learning Path Update", desc: "Cloud Security path modified", time: "3h ago", icon: Sparkles, color: "text-violet-500" },
                                    ].map((activity, i) => (
                                        <div key={i} className="flex gap-3">
                                            <div className={cn("mt-0.5", activity.color)}>
                                                <activity.icon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-bold leading-tight">{activity.title}</p>
                                                <p className="text-[10px] text-muted-foreground">{activity.desc}</p>
                                                <p className="text-[9px] text-muted-foreground/60 mt-1">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* AI Insight Teaser */}
                            <Card className="bg-indigo-600 text-white overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-4 opacity-20">
                                    <Sparkles className="w-12 h-12" />
                                </div>
                                <CardContent className="p-5 space-y-3">
                                    <h4 className="text-sm font-bold flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" /> AI Talent Insight
                                    </h4>
                                    <p className="text-xs text-indigo-100 leading-relaxed">
                                        Skill gaps detected in <span className="font-bold underline italic">Data Engineering</span> across 3 teams. 
                                        Suggested learning programs are ready for review.
                                    </p>
                                    <Button className="w-full bg-white text-indigo-600 hover:bg-white/90 text-xs h-8 font-bold">
                                        Review Insights
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

export default HRDashboard;
