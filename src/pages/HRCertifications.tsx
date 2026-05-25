import { useState } from "react";
import { HRSidebar, HRSidebarContent } from "@/components/layout/HRSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
    Award, CheckCircle2, XCircle, Search, Filter, 
    BookOpen, Hourglass, TrendingUp, Clock, UserCheck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
    getHRCertifications, saveHRCertifications, 
    getHREmployees, addHRActivity, HRCertification 
} from "@/lib/hrData";
import { Input } from "@/components/ui/input";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const HRCertifications = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [certs, setCerts] = useState<HRCertification[]>(() => getHRCertifications());
    const [employees] = useState(() => getHREmployees());
    const [search, setSearch] = useState("");
    const [filterDept, setFilterDept] = useState("all");
    const { toast } = useToast();

    const handleApprove = (id: number, name: string, employeeName: string) => {
        const updated = certs.map(c => c.id === id ? { ...c, status: "Approved" as const } : c);
        setCerts(updated);
        saveHRCertifications(updated);
        
        // Log activity
        addHRActivity("Certificate Approved", `Approved "${name}" certificate for ${employeeName}`, "success");
        
        toast({
            title: "Certificate Approved",
            description: `${employeeName}'s certificate for "${name}" has been approved.`,
        });
    };

    const handleReject = (id: number, name: string, employeeName: string) => {
        const updated = certs.map(c => c.id === id ? { ...c, status: "Rejected" as const } : c);
        setCerts(updated);
        saveHRCertifications(updated);

        addHRActivity("Certificate Rejected", `Rejected "${name}" certificate for ${employeeName}`, "warn");
        toast({
            title: "Certificate Rejected",
            description: `Certification submission has been returned to ${employeeName}.`,
            variant: "destructive"
        });
    };

    // Calculate dynamic completions
    const totalCerts = certs.length;
    const pendingCerts = certs.filter(c => c.status === "Pending Approval").length;
    const completedCerts = certs.filter(c => c.status === "Approved").length;

    // Filter employees for progress tracking
    const departments = ["all", ...Array.from(new Set(employees.map(e => e.dept)))];
    const filteredEmployees = employees.filter(e => {
        const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
        const matchDept = filterDept === "all" || e.dept === filterDept;
        return matchSearch && matchDept;
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
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Progress & Certifications</h1>
                        <p className="text-muted-foreground text-sm">Monitor course completions, tracking progress, and approve employee certification uploads.</p>
                    </div>

                    {/* Summary Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Card className="border-border/50 shadow-soft">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center shrink-0">
                                    <Award className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black">{totalCerts}</p>
                                    <p className="text-xs text-muted-foreground">Total Certificates Submitted</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-border/50 shadow-soft">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                                    <Hourglass className="w-5 h-5 animate-pulse" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black">{pendingCerts}</p>
                                    <p className="text-xs text-muted-foreground">Pending Approval</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-border/50 shadow-soft">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black">{completedCerts}</p>
                                    <p className="text-xs text-muted-foreground">Approved Credentials</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Certification Approvals Panel */}
                        <Card className="lg:col-span-1 border-border/50 shadow-soft h-fit">
                            <CardHeader>
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <Award className="w-4 h-4 text-violet-500" /> Pending Approvals
                                </CardTitle>
                                <CardDescription>Review and certify employee course accomplishments.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {certs.filter(c => c.status === "Pending Approval").length === 0 ? (
                                    <p className="text-xs text-muted-foreground text-center py-6">No certification approvals pending.</p>
                                ) : (
                                    certs.filter(c => c.status === "Pending Approval").map((cert) => (
                                        <div key={cert.id} className="p-3.5 border border-border/60 rounded-xl bg-muted/20 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-bold leading-tight">{cert.name}</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">{cert.employee}</p>
                                                </div>
                                                <Badge className="bg-amber-500/10 text-amber-600 border-0 text-[8px] h-4 uppercase">Pending</Badge>
                                            </div>
                                            <div className="flex gap-2 justify-end pt-1">
                                                <Button 
                                                    variant="ghost" 
                                                    size="xs" 
                                                    className="text-xs text-destructive hover:bg-destructive/10 h-7"
                                                    onClick={() => handleReject(cert.id, cert.name, cert.employee)}
                                                >
                                                    <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                                                </Button>
                                                <Button 
                                                    size="xs" 
                                                    className="bg-indigo-600 hover:bg-indigo-700 text-white h-7 text-xs"
                                                    onClick={() => handleApprove(cert.id, cert.name, cert.employee)}
                                                >
                                                    <UserCheck className="w-3.5 h-3.5 mr-1" /> Approve
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>

                        {/* Progress Drill-down Panel */}
                        <Card className="lg:col-span-2 border-border/50 shadow-soft">
                            <CardHeader className="border-b border-border/50 p-4 bg-muted/20">
                                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                                    <div>
                                        <CardTitle className="text-base font-bold flex items-center gap-2">
                                            <BookOpen className="w-4 h-4 text-indigo-500" /> Employee Progress Tracking
                                        </CardTitle>
                                    </div>
                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <div className="relative flex-1 sm:w-48">
                                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                            <Input 
                                                placeholder="Search name..." 
                                                className="pl-8 bg-background border-border/50 rounded-xl text-xs h-8"
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                        </div>
                                        <Select value={filterDept} onValueChange={setFilterDept}>
                                            <SelectTrigger className="rounded-xl border-border/50 bg-background text-[11px] h-8 w-28">
                                                <SelectValue placeholder="Dept" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departments.map(d => (
                                                    <SelectItem key={d} value={d} className="text-xs">{d === "all" ? "All Depts" : d}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 p-5">
                                {filteredEmployees.length === 0 ? (
                                    <p className="text-xs text-muted-foreground text-center py-6">No matching records found.</p>
                                ) : (
                                    filteredEmployees.map((emp) => (
                                        <div key={emp.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-xl border border-border/50 hover:bg-muted/10 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center">
                                                    {emp.name.split(' ').map(n=>n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold">{emp.name}</p>
                                                    <p className="text-[10px] text-muted-foreground">{emp.dept} · {emp.role}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-36 text-right sm:text-left">
                                                    <div className="flex justify-between text-[9px] mb-1 font-bold">
                                                        <span>Completion %</span>
                                                        <span className="text-indigo-600">{emp.progress}%</span>
                                                    </div>
                                                    <Progress value={emp.progress} className="h-1" />
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-bold text-indigo-600">{emp.courses} courses</p>
                                                    <p className="text-[9px] text-muted-foreground">Assigned training</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HRCertifications;
