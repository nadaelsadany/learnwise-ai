import { useState } from "react";
import { AdminSidebar, AdminSidebarContent } from "@/components/layout/AdminSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    TrendingUp, TrendingDown, BarChart2, AlertTriangle,
    Download, Users, ArrowUpRight, Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const topicData = [
    { topic: "React Hooks", avgScore: 62, struggling: 34, dept: "Engineering" },
    { topic: "Python Data Structures", avgScore: 71, struggling: 22, dept: "Analytics" },
    { topic: "Conflict Resolution", avgScore: 88, struggling: 8, dept: "All" },
    { topic: "Excel Pivot Tables", avgScore: 55, struggling: 48, dept: "Finance" },
    { topic: "Security Protocols", avgScore: 79, struggling: 15, dept: "IT" },
];

const deptData = [
    { name: "Engineering", completion: 82, avgScore: 88, employees: 62, atRisk: 4 },
    { name: "Finance", completion: 68, avgScore: 74, employees: 38, atRisk: 6 },
    { name: "Operations", completion: 75, avgScore: 80, employees: 55, atRisk: 2 },
    { name: "Design & Product", completion: 91, avgScore: 93, employees: 28, atRisk: 0 },
    { name: "Sales & Marketing", completion: 60, avgScore: 70, employees: 65, atRisk: 8 },
];

const atRiskEmployees = [
    { name: "Tom Chen", dept: "Engineering", course: "React Fundamentals", score: 32, completion: 10 },
    { name: "Carlos Rivera", dept: "Operations", course: "Leadership Essentials", score: 45, completion: 28 },
    { name: "Alice Mercer", dept: "Sales", course: "Excel & Data Analysis", score: 38, completion: 15 },
];

const AdminAnalytics = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { toast } = useToast();

    const handleExport = () => {
        const csv = [
            ["Department", "Completion %", "Avg Score", "Employees", "At Risk"],
            ...deptData.map(d => [d.name, d.completion, d.avgScore, d.employees, d.atRisk]),
        ].map(r => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = "training_report.csv"; a.click();
        URL.revokeObjectURL(url);
        toast({ title: "Report Exported", description: "training_report.csv downloaded." });
    };

    return (
        <div className="min-h-screen bg-background">
            <AdminSidebar onCollapse={setSidebarCollapsed} />
            <Header sidebarCollapsed={sidebarCollapsed} userRole="Admin" mobileSidebar={<AdminSidebarContent collapsed={false} />} />
            <main className={cn("pt-20 pb-12 px-4 sm:px-6 transition-all duration-300", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64")}>
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black">Analytics & Insights</h1>
                            <p className="text-muted-foreground text-sm mt-1">Performance trends, skill gaps, and decision data</p>
                        </div>
                        <Button variant="outline" onClick={handleExport}><Download className="w-4 h-4 mr-2" /> Export Report</Button>
                    </div>

                    {/* KPI bar */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: "Org Completion Rate", val: "76%", trend: "+5%", up: true, icon: TrendingUp, color: "text-emerald-500 bg-emerald-500/10" },
                            { label: "Avg Assessment Score", val: "83%", trend: "+3%", up: true, icon: BarChart2, color: "text-primary bg-primary/10" },
                            { label: "Pre→Post Improvement", val: "+18%", trend: "+2%", up: true, icon: ArrowUpRight, color: "text-rose-500 bg-rose-500/10" },
                            { label: "At-Risk Employees", val: "12", trend: "+2", up: false, icon: AlertTriangle, color: "text-amber-500 bg-amber-500/10" },
                        ].map((k) => (
                            <Card key={k.label} className="border-border/50">
                                <CardContent className="p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{k.label}</p>
                                        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", k.color)}>
                                            <k.icon className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <p className="text-3xl font-black">{k.val}</p>
                                    <p className={cn("text-xs font-semibold mt-1 flex items-center gap-0.5", k.up ? "text-emerald-500" : "text-destructive")}>
                                        {k.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {k.trend} vs last month
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Topic Difficulty */}
                        <Card className="border-border/50">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-amber-500" /> Topic Difficulty Trends
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {topicData.map((t) => (
                                    <div key={t.topic}>
                                        <div className="flex items-center justify-between mb-1">
                                            <div>
                                                <span className="text-sm font-semibold">{t.topic}</span>
                                                <span className="text-xs text-muted-foreground ml-2">· {t.dept}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className={cn("text-xs font-semibold",
                                                    t.avgScore >= 80 ? "text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20" :
                                                        t.avgScore >= 65 ? "text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/20" :
                                                            "text-destructive border-destructive/20 bg-destructive/5"
                                                )}>{t.avgScore}% avg</Badge>
                                                <span className="text-xs text-muted-foreground">{t.struggling}% struggling</span>
                                            </div>
                                        </div>
                                        <Progress value={t.avgScore} className="h-1.5" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Department Comparison */}
                        <Card className="border-border/50">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <BarChart2 className="w-4 h-4 text-primary" /> Department Comparison
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {deptData.map((d) => (
                                    <div key={d.name}>
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold">{d.name}</span>
                                                {d.atRisk > 0 && (
                                                    <Badge variant="outline" className="text-xs text-destructive border-destructive/20 bg-destructive/5">
                                                        {d.atRisk} at risk
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="text-xs text-muted-foreground text-right">
                                                <span className="font-semibold text-foreground">{d.completion}%</span> done · {d.avgScore}% score
                                            </div>
                                        </div>
                                        {/* Visual bar */}
                                        <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={cn("h-full rounded-full transition-all duration-700",
                                                    d.completion >= 85 ? "bg-emerald-500" :
                                                        d.completion >= 70 ? "bg-primary" :
                                                            "bg-amber-500"
                                                )}
                                                style={{ width: `${d.completion}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* At-Risk Employees */}
                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-destructive" /> Employees Flagged for Low Performance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border/50 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                                            <th className="text-left pb-3">Employee</th>
                                            <th className="text-left pb-3 hidden sm:table-cell">Course</th>
                                            <th className="text-left pb-3">Score</th>
                                            <th className="text-left pb-3">Completion</th>
                                            <th className="text-left pb-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {atRiskEmployees.map((e) => (
                                            <tr key={e.name} className="border-b border-border/30 last:border-0">
                                                <td className="py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center font-bold text-xs">
                                                            {e.name.split(" ").map(n => n[0]).join("")}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold">{e.name}</p>
                                                            <p className="text-xs text-muted-foreground">{e.dept}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-muted-foreground hidden sm:table-cell">{e.course}</td>
                                                <td className="py-3">
                                                    <Badge variant="outline" className="text-destructive border-destructive/20 bg-destructive/5 text-xs font-semibold">{e.score}%</Badge>
                                                </td>
                                                <td className="py-3">
                                                    <div className="flex items-center gap-2">
                                                        <Progress value={e.completion} className="h-1.5 w-16" />
                                                        <span className="text-xs text-muted-foreground">{e.completion}%</span>
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    <Button size="sm" variant="outline" className="text-xs" onClick={() => toast({ title: "Session Planned", description: `Follow-up session scheduled for ${e.name}.` })}>
                                                        <Users className="w-3 h-3 mr-1" /> Follow Up
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default AdminAnalytics;
