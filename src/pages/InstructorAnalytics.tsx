import { useState, useEffect } from "react";
import { InstructorPageLayout } from "@/components/instructor/InstructorPageLayout";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, Users, BookOpen, AlertTriangle, HelpCircle, FileText, ArrowUpRight, Sparkles } from "lucide-react";
import { getDropOffs, getHardQuestions, getInstructorCourses, getLearners } from "@/lib/instructorData";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const InstructorAnalytics = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [dropOffs, setDropOffs] = useState<any[]>([]);
    const [hardQuestions, setHardQuestions] = useState<any[]>([]);
    const [totalCourses, setTotalCourses] = useState(0);
    const [totalLearners, setTotalLearners] = useState(0);
    const [overallProgress, setOverallProgress] = useState(0);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        setDropOffs(getDropOffs());
        setHardQuestions(getHardQuestions());
        
        const courses = getInstructorCourses();
        const learners = getLearners();
        setTotalCourses(courses.length);
        setTotalLearners(learners.length);
        
        const progress = learners.length > 0 
            ? Math.round(learners.reduce((acc, l) => acc + l.totalProgress, 0) / learners.length)
            : 0;
        setOverallProgress(progress);
    }, []);

    // Mock weekly trend data
    const trendData = [
        { name: "Week 1", active: 110, rate: 45 },
        { name: "Week 2", active: 130, rate: 52 },
        { name: "Week 3", active: 145, rate: 58 },
        { name: "Week 4", active: 140, rate: 64 },
        { name: "Week 5", active: 160, rate: 70 },
        { name: "Week 6", active: totalLearners * 30 + 10, rate: overallProgress },
    ];

    const handleOptimizeContent = (courseTitle: string) => {
        toast({
            title: "Content Optimization Triggered",
            description: `Redirecting to editor for "${courseTitle}" to improve material.`,
        });
        const courses = getInstructorCourses();
        const targetCourse = courses.find(c => c.title.toLowerCase().includes(courseTitle.toLowerCase().substring(0, 10)));
        if (targetCourse) {
            navigate(`/instructor/courses/${targetCourse.id}`);
        } else {
            navigate("/instructor/courses");
        }
    };

    const handleFixQuestion = (quizTitle: string) => {
        toast({
            title: "Assessment Editing",
            description: `Opening quiz editor for "${quizTitle}" to adjust question difficulty.`,
        });
        navigate("/instructor/quizzes");
    };

    return (
        <InstructorPageLayout>
            <div className="space-y-6">
                <div className="animate-slide-up">
                    <h1 className="text-2xl font-bold">Insights & Analytics</h1>
                    <p className="text-muted-foreground mt-1">
                        AI-powered course drop-off analysis, question success rates, and engagement optimizations.
                    </p>
                </div>

                {/* Key Stats */}
                <div className="grid gap-4 md:grid-cols-3 animate-slide-up" style={{ animationDelay: "50ms" }}>
                    <Card className="bg-card border-border/50 shadow-soft">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Learners</CardTitle>
                            <Users className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+{totalLearners}</div>
                            <p className="text-xs text-muted-foreground">+3 new this week</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border/50 shadow-soft">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Completion Rate</CardTitle>
                            <TrendingUp className="h-4 w-4 text-success" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{overallProgress}%</div>
                            <p className="text-xs text-muted-foreground">+4.2% from last month</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border/50 shadow-soft">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                            <BookOpen className="h-4 w-4 text-accent" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalCourses}</div>
                            <p className="text-xs text-muted-foreground">Courses with learners actively progressing</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Drop-offs & Growth charts */}
                <div className="grid gap-6 md:grid-cols-2 animate-slide-up" style={{ animationDelay: "100ms" }}>
                    <Card className="border-border/50 bg-card shadow-soft">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Course Module Drop-off Rates</CardTitle>
                            <CardDescription>Percentage of enrolled learners completing each module</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dropOffs}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                                        <XAxis dataKey="moduleName" className="text-xs" tickFormatter={(v) => v.length > 20 ? `${v.substring(0, 17)}...` : v} />
                                        <YAxis className="text-xs" unit="%" />
                                        <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))" }} />
                                        <Bar dataKey="completionRate" name="Completion Rate" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}>
                                            {dropOffs.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={entry.completionRate < 50 ? "hsl(var(--destructive))" : "hsl(var(--primary))"} 
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card shadow-soft">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Learner Weekly Retention Trend</CardTitle>
                            <CardDescription>Cohort completion percentage over a 6-week window</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trendData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                                        <XAxis dataKey="name" className="text-xs" />
                                        <YAxis className="text-xs" unit="%" />
                                        <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))" }} />
                                        <Area type="monotone" dataKey="rate" name="Completion rate" stroke="hsl(var(--accent))" fill="hsl(var(--accent)/0.1)" strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Drop-off points intervention table */}
                <div className="grid gap-6 md:grid-cols-2 animate-slide-up" style={{ animationDelay: "150ms" }}>
                    <Card className="border-border/50 bg-card shadow-soft">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-warning" />
                                <CardTitle className="text-base font-semibold">Detected Course Drop-Off Points</CardTitle>
                            </div>
                            <CardDescription>Modules where learner completion rates decline sharply</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {dropOffs.map((point, index) => (
                                <div key={index} className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/40 text-sm">
                                    <div className="space-y-1">
                                        <p className="font-semibold text-sm line-clamp-1">{point.moduleName}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>{point.courseTitle}</span>
                                            <span>•</span>
                                            <span>Difficulty: <span className={cn(
                                                "font-semibold", 
                                                point.difficulty === "Hard" ? "text-destructive" : point.difficulty === "Medium" ? "text-warning" : "text-success"
                                            )}>{point.difficulty}</span></span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="font-bold text-sm text-destructive">{point.completionRate}% Done</p>
                                            <p className="text-xs text-muted-foreground">Avg: {point.avgTimeSpent}m</p>
                                        </div>
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="h-8 hover:bg-muted text-xs"
                                            onClick={() => handleOptimizeContent(point.courseTitle)}
                                        >
                                            Optimize
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Hard questions list */}
                    <Card className="border-border/50 bg-card shadow-soft">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-primary" />
                                <CardTitle className="text-base font-semibold">Hard Assessment Questions</CardTitle>
                            </div>
                            <CardDescription>Questions with the lowest pass/success rates on quizzes</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {hardQuestions.map((q, index) => (
                                <div key={index} className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/40 text-sm">
                                    <div className="space-y-1 flex-1 pr-3">
                                        <p className="font-semibold text-sm line-clamp-1">"{q.questionText}"</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>{q.quizTitle}</span>
                                            <span>•</span>
                                            <span>{q.courseTitle}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="font-bold text-sm text-destructive">{q.successRate}% Success</p>
                                            <p className="text-[10px] text-muted-foreground font-medium">Difficulty Level: High</p>
                                        </div>
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="h-8 hover:bg-muted text-xs"
                                            onClick={() => handleFixQuestion(q.quizTitle)}
                                        >
                                            Edit Quiz
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </InstructorAnalytics>
    );
};

export default InstructorAnalytics;
