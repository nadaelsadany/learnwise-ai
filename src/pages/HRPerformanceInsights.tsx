import { useState } from "react";
import { HRSidebar, HRSidebarContent } from "@/components/layout/HRSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
    BarChart3, Cable, TrendingUp, Zap, Sparkles, 
    ArrowUpRight, Target, Award, ArrowUp
} from "lucide-react";
import { getHREmployees } from "@/lib/hrData";

const HRPerformanceInsights = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const employees = getHREmployees();

    // Group department averages
    const depts = Array.from(new Set(employees.map(e => e.dept)));
    const deptPerformance = depts.map(deptName => {
        const deptEmps = employees.filter(e => e.dept === deptName);
        const avgComp = deptEmps.length > 0 ? Math.round(deptEmps.reduce((sum, e) => sum + e.progress, 0) / deptEmps.length) : 0;
        const avgPerf = deptEmps.length > 0 ? Math.round(deptEmps.reduce((sum, e) => sum + e.performanceScore, 0) / deptEmps.length) : 0;
        
        // Hypothetical ROI calculation: Performance contribution based on courses completed
        const roi = Math.min(98, Math.round(avgComp * 0.7 + avgPerf * 0.3));
        
        return {
            name: deptName,
            completion: avgComp,
            performance: avgPerf,
            roiContribution: roi,
            employeeCount: deptEmps.length
        };
    });

    return (
        <div className="min-h-screen bg-background">
            <HRSidebar onCollapse={setSidebarCollapsed} />
            <Header
                sidebarCollapsed={sidebarCollapsed}
                userRole="Talent Manager"
                mobileSidebar={<HRSidebarContent collapsed={false} />}
            />
            <main className={cn("pt-20 pb-12 px-4 sm:px-6 transition-all duration-300", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64")}>
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight">Performance Insights</h1>
                            <p className="text-muted-foreground text-sm">Measure the impact of skill development programs on overall business KPIs.</p>
                        </div>
                        <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-1 px-3 border-0 flex items-center gap-1.5 shadow-md shadow-indigo-500/20">
                            <Cable className="w-3.5 h-3.5" /> SAP Elevate Path Sync Active
                        </Badge>
                    </div>

                    {/* Performance Overview KPI Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-border/50 shadow-soft bg-gradient-to-br from-indigo-500/10 to-indigo-500/5">
                            <CardContent className="p-6 space-y-3">
                                <div className="flex justify-between items-start">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Average Talent ROI</p>
                                    <Badge className="bg-indigo-500 text-white border-0 font-bold text-[9px] flex items-center gap-0.5"><ArrowUp className="w-2.5 h-2.5" /> 18% ROI</Badge>
                                </div>
                                <h2 className="text-4xl font-black">84%</h2>
                                <p className="text-xs text-muted-foreground">Calculated correlation between training completion and business KPI improvement.</p>
                            </CardContent>
                        </Card>
                        <Card className="border-border/50 shadow-soft bg-gradient-to-br from-violet-500/10 to-violet-500/5">
                            <CardContent className="p-6 space-y-3">
                                <div className="flex justify-between items-start">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Performance Average</p>
                                    <Badge className="bg-violet-500 text-white border-0 font-bold text-[9px] flex items-center gap-0.5"><ArrowUp className="w-2.5 h-2.5" /> 4% growth</Badge>
                                </div>
                                <h2 className="text-4xl font-black">
                                    {Math.round(employees.reduce((sum, e) => sum + e.performanceScore, 0) / employees.length)}%
                                </h2>
                                <p className="text-xs text-muted-foreground">Direct feed average score retrieved from SuccessFactors integration.</p>
                            </CardContent>
                        </Card>
                        <Card className="border-border/50 shadow-soft bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
                            <CardContent className="p-6 space-y-3">
                                <div className="flex justify-between items-start">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Skill Certifications</p>
                                    <Badge className="bg-emerald-500 text-white border-0 font-bold text-[9px] flex items-center gap-0.5"><ArrowUp className="w-2.5 h-2.5" /> 8 Approved</Badge>
                                </div>
                                <h2 className="text-4xl font-black">64%</h2>
                                <p className="text-xs text-muted-foreground">Compliance percentage of employees carrying fully certified job qualifications.</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Department ROI Breakdown */}
                        <Card className="lg:col-span-2 border-border/50 shadow-soft">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-indigo-500" /> Department Alignment Matrix
                                </CardTitle>
                                <CardDescription>Correlates training completion metrics with integrated performance KPIs.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {deptPerformance.map((dept) => (
                                    <div key={dept.name} className="p-4 rounded-2xl border border-border/50 bg-muted/15 space-y-4 hover:border-indigo-300 transition-all duration-300">
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                                            <div>
                                                <h3 className="font-bold text-sm text-foreground">{dept.name} Department</h3>
                                                <p className="text-xs text-muted-foreground">{dept.employeeCount} active accounts</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="text-center sm:text-right">
                                                    <p className="text-xs font-black text-indigo-600">{dept.completion}%</p>
                                                    <p className="text-[9px] text-muted-foreground uppercase font-semibold">Trained</p>
                                                </div>
                                                <div className="text-center sm:text-right">
                                                    <p className="text-xs font-black text-violet-600">{dept.performance}%</p>
                                                    <p className="text-[9px] text-muted-foreground uppercase font-semibold">Performance</p>
                                                </div>
                                                <div className="text-center sm:text-right">
                                                    <p className="text-xs font-black text-emerald-600">{dept.roiContribution}%</p>
                                                    <p className="text-[9px] text-muted-foreground uppercase font-semibold">ROI Impact</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-[10px] font-bold">
                                                <span className="text-muted-foreground">ROI Target Level</span>
                                                <span className="text-emerald-500">Optimized</span>
                                            </div>
                                            <Progress value={dept.roiContribution} className="h-1.5 bg-muted" />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Integration Status Panel */}
                        <div className="space-y-6 lg:col-span-1">
                            <Card className="border-border/50 shadow-soft">
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                                        <Cable className="w-4 h-4 text-indigo-500" /> Connected Sync Channels
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-indigo-500/5">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">EP</div>
                                            <div>
                                                <p className="text-xs font-bold leading-none">Elevate Path API</p>
                                                <p className="text-[10px] text-emerald-500 mt-1">Live Connected</p>
                                            </div>
                                        </div>
                                        <Badge className="bg-emerald-500 text-white text-[8px] h-4 uppercase">Sync Ok</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-violet-500/5">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-600 flex items-center justify-center font-bold text-xs shrink-0">SF</div>
                                            <div>
                                                <p className="text-xs font-bold leading-none">SAP SuccessFactors</p>
                                                <p className="text-[10px] text-emerald-500 mt-1">Live Connected</p>
                                            </div>
                                        </div>
                                        <Badge className="bg-emerald-500 text-white text-[8px] h-4 uppercase">Sync Ok</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/40 opacity-70">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-muted border flex items-center justify-center font-bold text-xs shrink-0">WD</div>
                                            <div>
                                                <p className="text-xs font-bold leading-none">Workday HCM</p>
                                                <p className="text-[10px] text-muted-foreground mt-1">Ready to configure</p>
                                            </div>
                                        </div>
                                        <Badge variant="secondary" className="text-[8px] h-4 uppercase">Offline</Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* AI Alignment Insight Card */}
                            <Card className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white overflow-hidden relative shadow-lg">
                                <div className="absolute top-0 right-0 p-4 opacity-20">
                                    <Sparkles className="w-12 h-12" />
                                </div>
                                <CardContent className="p-5 space-y-3">
                                    <h4 className="text-sm font-bold flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" /> Predictive Alignment
                                    </h4>
                                    <p className="text-xs text-indigo-100 leading-relaxed">
                                        Departments passing **75% completed training** show a corresponding **12-14% performance index raise** in direct correlation audits.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HRPerformanceInsights;
