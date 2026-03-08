import { UniversityPageLayout } from "@/components/layout/UniversityPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, AlertTriangle, TrendingUp, TrendingDown, Lightbulb, Target, Users, BookOpen, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Insight {
    id: string;
    title: string;
    description: string;
    type: "warning" | "success" | "info" | "action";
    impact: "high" | "medium" | "low";
    category: string;
}

const aiInsights: Insight[] = [
    { id: "1", title: "High Drop-off in Physics 201", description: "42% of students drop off after Week 4. Consider adding supplementary materials or review sessions for thermodynamics topics.", type: "warning", impact: "high", category: "Retention" },
    { id: "2", title: "Machine Learning Course Excelling", description: "95% pass rate with average grade of 88%. This course's structure could be a model for other technical courses.", type: "success", impact: "medium", category: "Performance" },
    { id: "3", title: "Low Engagement in Evening Sections", description: "Sections scheduled after 5 PM show 35% lower engagement rates compared to morning sections. Consider schedule adjustments.", type: "warning", impact: "high", category: "Engagement" },
    { id: "4", title: "Business Ethics — Top Rated Course", description: "Consistently rated 4.9/5.0 by students. The interactive case study approach is driving strong outcomes.", type: "success", impact: "low", category: "Satisfaction" },
    { id: "5", title: "Struggling Student Cluster Detected", description: "A group of 18 students across 3 departments shows declining grades over the past 4 weeks. Early intervention recommended.", type: "action", impact: "high", category: "At-Risk" },
    { id: "6", title: "Quiz Difficulty Spike in Data Structures", description: "Quiz 5 had a 45% pass rate vs 85% average for other quizzes. The difficulty level may need adjustment.", type: "warning", impact: "medium", category: "Assessment" },
    { id: "7", title: "Instructor Content Upload Trend", description: "Content uploads increased 40% this month. Computer Science and Design departments are most active.", type: "info", impact: "low", category: "Content" },
    { id: "8", title: "Optimal Study Time Pattern", description: "AI analysis shows students who study between 9-11 AM perform 23% better on quizzes. Share this insight with students.", type: "info", impact: "medium", category: "Patterns" },
];

const typeConfig = {
    warning: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-200", badge: "text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/20" },
    success: { icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-200", badge: "text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20" },
    info: { icon: Lightbulb, color: "text-primary", bg: "bg-primary/10 border-primary/20", badge: "text-primary border-primary/20 bg-primary/5" },
    action: { icon: Target, color: "text-destructive", bg: "bg-destructive/10 border-destructive/20", badge: "text-destructive border-destructive/20 bg-destructive/5" },
};
const impactBadge = {
    high: "text-destructive border-destructive/20 bg-destructive/5",
    medium: "text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/20",
    low: "text-muted-foreground border-border bg-muted",
};

const platformHealth = [
    { label: "Overall Performance", value: 82, color: "bg-primary" },
    { label: "Student Engagement", value: 74, color: "bg-emerald-500" },
    { label: "Course Quality", value: 91, color: "bg-amber-500" },
    { label: "Instructor Activity", value: 88, color: "bg-violet-500" },
];

const UniversityAIInsights = () => {
    return (
        <UniversityPageLayout>
            <div>
                <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Brain className="w-5 h-5 text-primary" />
                    </div>
                    AI Academic Insights
                </h1>
                <p className="text-muted-foreground mt-1">AI-powered analysis of academic performance patterns across the platform</p>
            </div>

            {/* Health Scores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {platformHealth.map(h => (
                    <Card key={h.label} className="border-border/50">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h.label}</p>
                                <span className="text-lg font-black">{h.value}%</span>
                            </div>
                            <Progress value={h.value} className="h-2" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "Warnings", value: aiInsights.filter(i => i.type === "warning").length, icon: AlertTriangle, color: "text-amber-500" },
                    { label: "Positive", value: aiInsights.filter(i => i.type === "success").length, icon: TrendingUp, color: "text-emerald-500" },
                    { label: "Actions Needed", value: aiInsights.filter(i => i.type === "action").length, icon: Target, color: "text-destructive" },
                    { label: "Observations", value: aiInsights.filter(i => i.type === "info").length, icon: Lightbulb, color: "text-primary" },
                ].map(s => (
                    <Card key={s.label} className="border-border/50">
                        <CardContent className="p-4 flex items-center gap-3">
                            <s.icon className={cn("w-6 h-6", s.color)} />
                            <div>
                                <p className="text-xl font-black">{s.value}</p>
                                <p className="text-xs text-muted-foreground">{s.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Insights */}
            <div className="space-y-3">
                {aiInsights.map(insight => {
                    const tc = typeConfig[insight.type];
                    const Icon = tc.icon;
                    return (
                        <Card key={insight.id} className={cn("border transition-all hover:shadow-md", tc.bg)}>
                            <CardContent className="p-5">
                                <div className="flex items-start gap-4">
                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", tc.bg)}>
                                        <Icon className={cn("w-5 h-5", tc.color)} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <p className="font-bold text-sm">{insight.title}</p>
                                            <Badge variant="outline" className={cn("text-xs", impactBadge[insight.impact])}>
                                                {insight.impact} impact
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">{insight.category}</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </UniversityPageLayout>
    );
};

export default UniversityAIInsights;
