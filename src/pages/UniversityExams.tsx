import { useState } from "react";
import { UniversityPageLayout } from "@/components/layout/UniversityPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { ClipboardList, Plus, Calendar, TrendingUp, Users, CheckCircle2, AlertTriangle, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Exam {
    id: string;
    title: string;
    course: string;
    type: "midterm" | "final" | "quiz";
    date: string;
    duration: string;
    students: number;
    avgGrade: number;
    passRate: number;
    status: "scheduled" | "completed" | "grading";
}

const mockExams: Exam[] = [
    { id: "1", title: "Midterm - Data Structures", course: "Data Structures", type: "midterm", date: "2026-03-15", duration: "2h", students: 90, avgGrade: 78, passRate: 85, status: "scheduled" },
    { id: "2", title: "Final - UI Design", course: "UI Design", type: "final", date: "2026-04-20", duration: "3h", students: 70, avgGrade: 0, passRate: 0, status: "scheduled" },
    { id: "3", title: "Midterm - Machine Learning", course: "Machine Learning", type: "midterm", date: "2026-03-10", duration: "2h", students: 30, avgGrade: 82, passRate: 90, status: "completed" },
    { id: "4", title: "Quiz 3 - Business Ethics", course: "Business Ethics", type: "quiz", date: "2026-03-08", duration: "30m", students: 45, avgGrade: 88, passRate: 95, status: "completed" },
    { id: "5", title: "Final - Data Structures", course: "Data Structures", type: "final", date: "2026-05-10", duration: "3h", students: 90, avgGrade: 0, passRate: 0, status: "scheduled" },
    { id: "6", title: "Midterm - Business Ethics", course: "Business Ethics", type: "midterm", date: "2026-03-12", duration: "1.5h", students: 45, avgGrade: 74, passRate: 80, status: "grading" },
];

const typeColor = {
    midterm: "text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/20",
    final: "text-destructive border-destructive/20 bg-destructive/5",
    quiz: "text-primary border-primary/20 bg-primary/5",
};
const statusColor = {
    scheduled: "text-primary border-primary/20 bg-primary/5",
    completed: "text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20",
    grading: "text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/20",
};

const UniversityExams = () => {
    const [exams] = useState(mockExams);
    const { toast } = useToast();

    const completed = exams.filter(e => e.status === "completed");
    const overallAvg = completed.length > 0 ? Math.round(completed.reduce((s, e) => s + e.avgGrade, 0) / completed.length) : 0;
    const overallPass = completed.length > 0 ? Math.round(completed.reduce((s, e) => s + e.passRate, 0) / completed.length) : 0;

    return (
        <UniversityPageLayout>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <ClipboardList className="w-5 h-5 text-primary" />
                        </div>
                        Exams Management
                    </h1>
                    <p className="text-muted-foreground mt-1">Schedule exams, track grades and pass rates</p>
                </div>
                <Button className="gap-2"><Plus className="w-4 h-4" /> Schedule Exam</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                    { label: "Total Exams", value: exams.length, icon: ClipboardList, color: "text-primary" },
                    { label: "Upcoming", value: exams.filter(e => e.status === "scheduled").length, icon: Calendar, color: "text-amber-500" },
                    { label: "Avg Grade", value: `${overallAvg}%`, icon: BarChart2, color: "text-emerald-500" },
                    { label: "Pass Rate", value: `${overallPass}%`, icon: TrendingUp, color: "text-primary" },
                ].map(s => (
                    <Card key={s.label} className="border-border/50">
                        <CardContent className="p-4 flex items-center gap-3">
                            <s.icon className={cn("w-7 h-7", s.color)} />
                            <div>
                                <p className="text-xl font-black">{s.value}</p>
                                <p className="text-xs text-muted-foreground">{s.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="space-y-3">
                {exams.map(exam => (
                    <Card key={exam.id} className="border-border/50 hover:shadow-md transition-all">
                        <CardContent className="p-5">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-bold text-sm">{exam.title}</p>
                                        <Badge variant="outline" className={cn("text-xs", typeColor[exam.type])}>
                                            {exam.type.charAt(0).toUpperCase() + exam.type.slice(1)}
                                        </Badge>
                                        <Badge variant="outline" className={cn("text-xs", statusColor[exam.status])}>
                                            {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(exam.date).toLocaleDateString()}</span>
                                        <span>{exam.duration}</span>
                                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{exam.students} students</span>
                                    </div>
                                </div>
                                {exam.status === "completed" && (
                                    <div className="flex items-center gap-6">
                                        <div className="text-center">
                                            <p className="text-lg font-black">{exam.avgGrade}%</p>
                                            <p className="text-xs text-muted-foreground">Avg Grade</p>
                                        </div>
                                        <div className="text-center">
                                            <p className={cn("text-lg font-black", exam.passRate >= 80 ? "text-emerald-500" : "text-amber-500")}>{exam.passRate}%</p>
                                            <p className="text-xs text-muted-foreground">Pass Rate</p>
                                        </div>
                                    </div>
                                )}
                                {exam.status === "grading" && (
                                    <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/20 gap-1">
                                        <AlertTriangle className="w-3.5 h-3.5" /> Grading in Progress
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </UniversityPageLayout>
    );
};

export default UniversityExams;
