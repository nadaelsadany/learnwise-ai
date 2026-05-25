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

import { getHREmployees, getHRCertifications, getHRActivityLog } from "@/lib/hrData";

const HRDashboard = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const navigate = useNavigate();

    const employees = getHREmployees();
    const certs = getHRCertifications();
    const rawActivities = getHRActivityLog();

    const totalEmployees = employees.length;
    const activeLearners = employees.filter(e => e.progress > 0 && e.courses > 0).length;
    const avgCompletion = totalEmployees > 0 
        ? Math.round(employees.reduce((sum, e) => sum + e.progress, 0) / totalEmployees) 
        : 0;
    
    const approvedCerts = certs.filter(c => c.status === "Approved").length;
    const certRate = certs.length > 0 
        ? Math.round((approvedCerts / certs.length) * 100) 
        : 0;

    const atRiskEmployees = employees
        .filter(e => e.status === "At Risk")
        .map(e => ({
            name: e.name,
            dept: e.dept,
            progress: e.progress,
            reason: e.performanceScore < 40 ? "Low Perf Score" : "Needs support"
        }));

    const depts = Array.from(new Set(employees.map(e => e.dept)));
    const teamPerformance = depts.map(deptName => {
        const deptEmps = employees.filter(e => e.dept === deptName);
        const activeCount = deptEmps.filter(e => e.progress > 0).length;
        const avgComp = deptEmps.length > 0 ? Math.round(deptEmps.reduce((sum, e) => sum + e.progress, 0) / deptEmps.length) : 0;
        const certCount = certs.filter(c => c.status === "Approved" && deptEmps.some(e => e.name === c.employee)).length;
        return {
            name: deptName,
            completion: avgComp,
            active: activeCount,
            certs: certCount
        };
    });

    const certStatus = certs.slice(0, 3).map(c => ({
        name: c.name,
        employee: c.employee,
        status: c.status,
        date: c.date
    }));

    return (
        <div className="min-h-screen bg-background">
            <HRSidebar onCollapse={setSidebarCollapsed} />
            <Header
                sidebarCollapsed={sidebarCollapsed}
                userRole="Talent Manager"
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
                                <p className="text-indigo-100 mt-2 text-sm max-w-xl font-medium">
                                    Manage employees, assign learning, and track performance
                                </p>
                                <p className="text-indigo-200/80 mt-1 text-xs">
                                    Managing the growth of {depts.length} departments · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
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
                        <StatCard title="Total Employees" value={totalEmployees} sub="Managed accounts" icon={Users} trend={{ value: 12, positive: true }} color="indigo" />
                        <StatCard title="Active Learners" value={activeLearners} sub="Enrolled in courses" icon={Zap} trend={{ value: 5, positive: true }} color="violet" />
                        <StatCard title="Completion Rate" value={`${avgCompletion}%`} sub="Course completion avg" icon={CheckCircle2} trend={{ value: 3, positive: true }} color="emerald" />
                        <StatCard title="Certification Rate" value={`${certRate}%`} sub="Employees certified" icon={Award} trend={{ value: 8, positive: true }} color="amber" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* 1. Team Performance */}
                        <div className="lg:col-span-2 space-y-4">
                            <Card className="border-border/50 shadow-soft">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-indigo-500" /> Team Performance
                                    </CardTitle>
                                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-indigo-600" onClick={() => navigate("/hr/performance")}>
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
                                        {atRiskEmployees.length === 0 ? (
                                            <p className="text-sm text-muted-foreground text-center py-6">No at-risk employees currently detected. Good job!</p>
                                        ) : (
                                            atRiskEmployees.map((emp) => (
                                                <div key={emp.name} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors group cursor-pointer" onClick={() => navigate("/hr/employees")}>
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
                                            ))
                                        )}
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
                                        <Award className="w-4 h-4 text-violet-500" /> Certification Approvals
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
                                                <Badge variant={cert.status === "Approved" ? "default" : cert.status === "Rejected" ? "destructive" : "secondary"} className="text-[8px] h-4 uppercase tracking-tighter">
                                                    {cert.status}
                                                </Badge>
                                            </div>
                                            <p className="text-[9px] text-muted-foreground flex items-center gap-1">
                                                <Clock className="w-2.5 h-2.5" /> {cert.date}
                                            </p>
                                        </div>
                                    ))}
                                    <Button variant="outline" className="w-full text-xs h-9 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600" onClick={() => navigate("/hr/certifications")}>
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
                                    {rawActivities.length === 0 ? (
                                        <p className="text-xs text-muted-foreground text-center py-4">No recent activity logged.</p>
                                    ) : (
                                        rawActivities.slice(0, 3).map((activity, i) => {
                                            let Icon = activity.type === "success" ? CheckCircle2 : activity.type === "warn" ? AlertTriangle : Zap;
                                            return (
                                                <div key={i} className="flex gap-3">
                                                    <div className={cn("mt-0.5 shrink-0", 
                                                        activity.type === "success" ? "text-emerald-500" : 
                                                        activity.type === "warn" ? "text-amber-500" : "text-indigo-500"
                                                    )}>
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold leading-tight truncate">{activity.title}</p>
                                                        <p className="text-[10px] text-muted-foreground line-clamp-2">{activity.desc}</p>
                                                        <p className="text-[9px] text-muted-foreground/60 mt-1">{activity.time}</p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
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
                                        Performance drops and skill gaps detected in <span className="font-bold underline italic">Sales Team</span>.
                                        Suggested training modules are ready for review.
                                    </p>
                                    <Button className="w-full bg-white text-indigo-600 hover:bg-white/90 text-xs h-8 font-bold animate-pulse" onClick={() => navigate("/hr/ai-insights")}>
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
