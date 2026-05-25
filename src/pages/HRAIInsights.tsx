import { useState } from "react";
import { HRSidebar, HRSidebarContent } from "@/components/layout/HRSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    Sparkles, CheckCircle2, XCircle, BrainCircuit, 
    ArrowUpRight, Target, AlertTriangle, ShieldAlert
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
    getAIRecommendations, saveAIRecommendations, 
    getHREmployees, saveHREmployees, addHRActivity, HRAIRecommendation 
} from "@/lib/hrData";

const HRAIInsights = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [recommendations, setRecommendations] = useState<HRAIRecommendation[]>(() => getAIRecommendations());
    const { toast } = useToast();

    const handleAccept = (rec: HRAIRecommendation) => {
        // Apply the recommendation to employees list
        const employees = getHREmployees();
        
        let msg = "";
        if (rec.targetGroup === "Sales" || rec.targetGroup === "Engineering" || rec.targetGroup === "Finance") {
            // Bulk assignment
            const updated = employees.map(e => e.dept === rec.targetGroup ? {
                ...e,
                courses: e.courses + 1,
                progress: Math.max(10, Math.round((e.progress * e.courses) / (e.courses + 1)))
            } : e);
            saveHREmployees(updated);
            msg = `Bulk assigned "${rec.suggestedAction}" to ${rec.targetGroup} department.`;
        } else {
            // Individual assignment
            const updated = employees.map(e => e.name === rec.targetGroup ? {
                ...e,
                courses: e.courses + 1,
                progress: Math.max(10, Math.round((e.progress * e.courses) / (e.courses + 1))),
                status: "Active" as const // Clear at risk
            } : e);
            saveHREmployees(updated);
            msg = `Assigned "${rec.suggestedAction}" to ${rec.targetGroup}.`;
        }

        // Save recommendation status
        const updatedRecs = recommendations.map(r => r.id === rec.id ? { ...r, status: "Accepted" as const } : r);
        setRecommendations(updatedRecs);
        saveAIRecommendations(updatedRecs);

        // Add activity log
        addHRActivity("AI Insight Accepted", `Approved: ${rec.title}`, "success");

        toast({
            title: "Recommendation Accepted",
            description: msg,
        });
    };

    const handleReject = (id: string, title: string) => {
        const updatedRecs = recommendations.map(r => r.id === id ? { ...r, status: "Rejected" as const } : r);
        setRecommendations(updatedRecs);
        saveAIRecommendations(updatedRecs);

        addHRActivity("AI Insight Dismissed", `Rejected recommendation: "${title}"`, "info");
        toast({
            title: "Recommendation Ignored",
            description: "The recommendation has been dismissed from dashboard alerts.",
        });
    };

    const activeRecs = recommendations.filter(r => r.status === "Pending");

    return (
        <div className="min-h-screen bg-background">
            <HRSidebar onCollapse={setSidebarCollapsed} />
            <Header
                sidebarCollapsed={sidebarCollapsed}
                userRole="Talent Manager"
                mobileSidebar={<HRSidebarContent collapsed={false} />}
            />
            <main className={cn("pt-20 pb-12 px-4 sm:px-6 transition-all duration-300", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64")}>
                <div className="max-w-5xl mx-auto space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center">
                            <BrainCircuit className="w-6 h-6 animate-pulse" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight">AI Insights & Recommendations</h1>
                            <p className="text-muted-foreground text-sm">Automate talent optimization and close skill gaps using machine intelligence.</p>
                        </div>
                    </div>

                    {/* Quick Insight Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-indigo-500/10 bg-indigo-500/5 text-indigo-950 dark:text-indigo-100 shadow-soft">
                            <CardContent className="p-5 flex items-start gap-3.5">
                                <Sparkles className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-bold text-sm">Skill Gap Automation</h3>
                                    <p className="text-xs text-muted-foreground mt-1">AI monitors low performers and flags appropriate coaching programs instantly.</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-emerald-500/10 bg-emerald-500/5 text-emerald-950 dark:text-emerald-100 shadow-soft">
                            <CardContent className="p-5 flex items-start gap-3.5">
                                <Target className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-bold text-sm">Successor Planning</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Identifies manager readiness to bridge organizational leadership vacuums.</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-amber-500/10 bg-amber-500/5 text-amber-950 dark:text-amber-100 shadow-soft">
                            <CardContent className="p-5 flex items-start gap-3.5">
                                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-bold text-sm">At-Risk Interventions</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Monitors inactive trainees and triggers support before KPIs decline.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-indigo-500" /> Pending AI Recommendations ({activeRecs.length})
                        </h2>

                        {activeRecs.length === 0 ? (
                            <Card className="border-border/50 shadow-soft">
                                <CardContent className="p-12 text-center text-muted-foreground space-y-2">
                                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto opacity-80" />
                                    <p className="font-bold text-base">You are fully up to date!</p>
                                    <p className="text-xs">No pending recommendations or skill gaps flagged by the AI engine.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {activeRecs.map((rec) => (
                                    <Card key={rec.id} className="border-border hover:border-indigo-300 transition-all duration-300 shadow-soft overflow-hidden group">
                                        <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                            <div className="space-y-2.5 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <Badge className="bg-indigo-600/10 text-indigo-600 hover:bg-indigo-600/15 border-0 font-bold text-[9px] uppercase tracking-wider">AI Suggestion</Badge>
                                                    <Badge variant="outline" className="text-[10px] border-indigo-200 bg-indigo-50/20">Target: {rec.targetGroup}</Badge>
                                                </div>
                                                <h3 className="text-lg font-bold group-hover:text-indigo-600 transition-colors">{rec.title}</h3>
                                                <p className="text-sm text-muted-foreground">{rec.description}</p>
                                                <div className="p-3 bg-muted/40 rounded-xl border border-border/50 text-xs flex items-center gap-2">
                                                    <BrainCircuit className="w-4 h-4 text-indigo-500 shrink-0" />
                                                    <span>Recommendation: <span className="font-bold text-indigo-600">Assign "{rec.suggestedAction}"</span></span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-4 md:pt-0">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="flex-1 md:flex-none rounded-xl hover:bg-rose-50 hover:text-rose-600"
                                                    onClick={() => handleReject(rec.id, rec.title)}
                                                >
                                                    <XCircle className="w-4 h-4 mr-2" /> Ignore
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-500/20"
                                                    onClick={() => handleAccept(rec)}
                                                >
                                                    <CheckCircle2 className="w-4 h-4 mr-2" /> Approve & Assign
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HRAIInsights;
