import { useState } from "react";
import { HRSidebar, HRSidebarContent } from "@/components/layout/HRSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
    BookOpen, Calendar, CheckCircle2, ListChecks, 
    Sparkles, User, Users, Clock, ArrowRight 
} from "lucide-react";
import { 
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getHREmployees, saveHREmployees, getHRPaths, addHRActivity, HREmployee } from "@/lib/hrData";

interface AssignmentLog {
    id: string;
    targetName: string;
    targetType: "Individual" | "Department";
    pathTitle: string;
    pathCategory: string;
    deadline: string;
    priority: "High" | "Medium" | "Low";
    assignedAt: string;
}

const HRAssignments = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [employees, setEmployees] = useState<HREmployee[]>(() => getHREmployees());
    const paths = getHRPaths();
    const { toast } = useToast();

    // Assignment Form State
    const [assignMode, setAssignMode] = useState<"individual" | "department">("individual");
    const [selectedEmpId, setSelectedEmpId] = useState<string>("");
    const [selectedDept, setSelectedDept] = useState<string>("");
    const [selectedPathId, setSelectedPathId] = useState<string>("");
    const [deadline, setDeadline] = useState<string>("");
    const [priority, setPriority] = useState<"High" | "Medium" | "Low">("Medium");

    // Local assignment records
    const [assignmentsLog, setAssignmentsLog] = useState<AssignmentLog[]>([
        { id: "a-1", targetName: "Emma Wilson", targetType: "Individual", pathTitle: "Modern Leadership Path", pathCategory: "Learning Path", deadline: "2026-06-30", priority: "High", assignedAt: "10m ago" },
        { id: "a-2", targetName: "Engineering", targetType: "Department", pathTitle: "React Fundamentals", pathCategory: "Course", deadline: "2026-07-15", priority: "Medium", assignedAt: "1h ago" },
    ]);

    const departments = Array.from(new Set(employees.map(e => e.dept)));

    const handleAssign = () => {
        const path = paths.find(p => p.id === selectedPathId);
        if (!path) {
            toast({ variant: "destructive", title: "Select a path", description: "Please select a course, path, or career track." });
            return;
        }
        if (assignMode === "individual" && !selectedEmpId) {
            toast({ variant: "destructive", title: "Select employee", description: "Please select an employee to assign." });
            return;
        }
        if (assignMode === "department" && !selectedDept) {
            toast({ variant: "destructive", title: "Select department", description: "Please select a target department." });
            return;
        }

        let targetLabel = "";
        let targetType: "Individual" | "Department" = "Individual";

        if (assignMode === "individual") {
            const empId = Number(selectedEmpId);
            const emp = employees.find(e => e.id === empId);
            if (emp) {
                targetLabel = emp.name;
                targetType = "Individual";
                const updated = employees.map(e => e.id === empId ? {
                    ...e,
                    courses: e.courses + 1,
                    // Slightly adjust progress average
                    progress: Math.max(5, Math.round((e.progress * e.courses) / (e.courses + 1)))
                } : e);
                setEmployees(updated);
                saveHREmployees(updated);
                addHRActivity("Course Assigned", `${path.title} assigned to ${emp.name}`, "success");
            }
        } else {
            targetLabel = selectedDept;
            targetType = "Department";
            const deptEmps = employees.filter(e => e.dept === selectedDept);
            if (deptEmps.length > 0) {
                const updated = employees.map(e => e.dept === selectedDept ? {
                    ...e,
                    courses: e.courses + 1,
                    progress: Math.max(5, Math.round((e.progress * e.courses) / (e.courses + 1)))
                } : e);
                setEmployees(updated);
                saveHREmployees(updated);
                addHRActivity("Bulk Path Assigned", `${path.title} assigned to ${selectedDept} department`, "success");
            }
        }

        const newLog: AssignmentLog = {
            id: `a-${Date.now()}`,
            targetName: targetLabel,
            targetType,
            pathTitle: path.title,
            pathCategory: path.category,
            deadline: deadline || "No deadline",
            priority,
            assignedAt: "Just now"
        };

        setAssignmentsLog([newLog, ...assignmentsLog]);
        toast({
            title: "Path Assigned Successfully",
            description: `"${path.title}" assigned to ${targetLabel}.`,
        });

        // Reset fields
        setSelectedEmpId("");
        setSelectedDept("");
        setSelectedPathId("");
        setDeadline("");
        setPriority("Medium");
    };

    const getPriorityBadge = (p: string) => {
        if (p === "High") return "bg-rose-500/10 text-rose-500 border-rose-500/20";
        if (p === "Low") return "bg-slate-500/10 text-slate-500 border-slate-500/20";
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    };

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
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Learning & Career Paths</h1>
                        <p className="text-muted-foreground text-sm">Assign specific courses, skills pathways, or career paths to employees and departments.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Assignment Panel */}
                        <Card className="lg:col-span-1 border-border/50 shadow-soft h-fit">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <ListChecks className="w-5 h-5 text-indigo-500" /> Assign Development Path
                                </CardTitle>
                                <CardDescription>Select individual or bulk audience and assign training.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Mode Selection */}
                                <div className="grid grid-cols-2 gap-2 p-1 bg-muted/50 rounded-xl">
                                    <Button 
                                        variant={assignMode === "individual" ? "secondary" : "ghost"}
                                        className={cn("rounded-lg text-xs font-semibold h-8", assignMode === "individual" && "bg-white text-indigo-600 shadow-soft")}
                                        onClick={() => setAssignMode("individual")}
                                    >
                                        <User className="w-3.5 h-3.5 mr-1.5" /> Individual
                                    </Button>
                                    <Button 
                                        variant={assignMode === "department" ? "secondary" : "ghost"}
                                        className={cn("rounded-lg text-xs font-semibold h-8", assignMode === "department" && "bg-white text-indigo-600 shadow-soft")}
                                        onClick={() => setAssignMode("department")}
                                    >
                                        <Users className="w-3.5 h-3.5 mr-1.5" /> Department
                                    </Button>
                                </div>

                                {/* Target Selection */}
                                {assignMode === "individual" ? (
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-muted-foreground uppercase">Select Employee</Label>
                                        <Select value={selectedEmpId} onValueChange={setSelectedEmpId}>
                                            <SelectTrigger className="rounded-xl border-border/60">
                                                <SelectValue placeholder="Choose employee..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {employees.map(e => (
                                                    <SelectItem key={e.id} value={e.id.toString()}>{e.name} ({e.role})</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ) : (
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-muted-foreground uppercase">Select Department</Label>
                                        <Select value={selectedDept} onValueChange={setSelectedDept}>
                                            <SelectTrigger className="rounded-xl border-border/60">
                                                <SelectValue placeholder="Choose department..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departments.map(d => (
                                                    <SelectItem key={d} value={d}>{d}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {/* Path Selection */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-muted-foreground uppercase">Path / Course</Label>
                                    <Select value={selectedPathId} onValueChange={setSelectedPathId}>
                                        <SelectTrigger className="rounded-xl border-border/60">
                                            <SelectValue placeholder="Select course or path..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {paths.map(p => (
                                                <SelectItem key={p.id} value={p.id}>
                                                    <span className="font-semibold text-foreground">{p.title}</span> 
                                                    <span className="text-[10px] text-muted-foreground ml-1.5">({p.category})</span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Deadline and Priority */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-muted-foreground uppercase">Deadline</Label>
                                        <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="rounded-xl border-border/60 text-xs" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-muted-foreground uppercase">Priority</Label>
                                        <Select value={priority} onValueChange={(v: "High" | "Medium" | "Low") => setPriority(v)}>
                                            <SelectTrigger className="rounded-xl border-border/60 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="High">High</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="Low">Low</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-5 shadow-lg shadow-indigo-500/20" onClick={handleAssign}>
                                    Assign Development Path <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Recent Assignments Log */}
                        <Card className="lg:col-span-2 border-border/50 shadow-soft">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-indigo-500" /> Recent Assignment Logs
                                </CardTitle>
                                <CardDescription>Track recently assigned training templates and compliance deadlines.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-muted/10 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/50">
                                                <th className="px-6 py-4">Assigned To</th>
                                                <th className="px-6 py-4">Learning Course / Path</th>
                                                <th className="px-6 py-4">Deadline</th>
                                                <th className="px-6 py-4">Priority</th>
                                                <th className="px-6 py-4 text-right">Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {assignmentsLog.map((log) => (
                                                <tr key={log.id} className="border-b border-border/50 hover:bg-muted/15 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            {log.targetType === "Individual" ? (
                                                                <User className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                                            ) : (
                                                                <Users className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                                            )}
                                                            <div>
                                                                <p className="text-sm font-bold">{log.targetName}</p>
                                                                <p className="text-[9px] text-muted-foreground uppercase font-black">{log.targetType}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <p className="text-sm font-semibold">{log.pathTitle}</p>
                                                            <p className="text-[10px] text-muted-foreground">{log.pathCategory}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-xs font-semibold flex items-center gap-1.5 mt-2.5">
                                                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" /> {log.deadline}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge variant="outline" className={cn("text-[9px] font-black border rounded-lg", getPriorityBadge(log.priority))}>
                                                            {log.priority}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-xs text-muted-foreground flex items-center justify-end gap-1 mt-2.5">
                                                        <Clock className="w-3 h-3" /> {log.assignedAt}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HRAssignments;
