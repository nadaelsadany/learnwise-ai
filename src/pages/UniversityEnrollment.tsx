import { useState } from "react";
import { UniversityPageLayout } from "@/components/layout/UniversityPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCheck, Search, CheckCircle2, XCircle, Clock, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface EnrollmentRequest {
    id: string;
    studentName: string;
    studentEmail: string;
    courseName: string;
    requestDate: string;
    status: "pending" | "approved" | "rejected";
}

const mockRequests: EnrollmentRequest[] = [
    { id: "1", studentName: "Fatima Al-Zahra", studentEmail: "fatima@univ.edu", courseName: "Machine Learning", requestDate: "2026-03-06", status: "pending" },
    { id: "2", studentName: "Omar bin Khalid", studentEmail: "omar@univ.edu", courseName: "UI Design", requestDate: "2026-03-05", status: "pending" },
    { id: "3", studentName: "Maryam Noor", studentEmail: "maryam@univ.edu", courseName: "Data Structures", requestDate: "2026-03-05", status: "pending" },
    { id: "4", studentName: "Youssef Ahmed", studentEmail: "youssef@univ.edu", courseName: "Business Ethics", requestDate: "2026-03-04", status: "approved" },
    { id: "5", studentName: "Layla Hassan", studentEmail: "layla@univ.edu", courseName: "Machine Learning", requestDate: "2026-03-03", status: "rejected" },
    { id: "6", studentName: "Ahmad Tariq", studentEmail: "ahmad@univ.edu", courseName: "UI Design", requestDate: "2026-03-02", status: "approved" },
];

const statusBadge = {
    pending: "text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/20",
    approved: "text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20",
    rejected: "text-destructive border-destructive/20 bg-destructive/5",
};

const UniversityEnrollment = () => {
    const [requests, setRequests] = useState(mockRequests);
    const [search, setSearch] = useState("");
    const { toast } = useToast();

    const handleAction = (id: string, action: "approved" | "rejected") => {
        setRequests(requests.map(r => r.id === id ? { ...r, status: action } : r));
        toast({ title: action === "approved" ? "Enrollment Approved" : "Enrollment Rejected" });
    };

    const filtered = (status?: string) => requests.filter(r =>
        (!status || r.status === status) &&
        (r.studentName.toLowerCase().includes(search.toLowerCase()) || r.courseName.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <UniversityPageLayout>
            <div>
                <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-primary" />
                    </div>
                    Enrollment Management
                </h1>
                <p className="text-muted-foreground mt-1">Approve, reject, and track course enrollment requests</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                    { label: "Total Enrollments", value: requests.length, icon: Users, color: "text-primary" },
                    { label: "Pending", value: requests.filter(r => r.status === "pending").length, icon: Clock, color: "text-amber-500" },
                    { label: "Approved", value: requests.filter(r => r.status === "approved").length, icon: CheckCircle2, color: "text-emerald-500" },
                    { label: "Rejected", value: requests.filter(r => r.status === "rejected").length, icon: XCircle, color: "text-destructive" },
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

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search by student or course..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <Tabs defaultValue="pending">
                <TabsList>
                    <TabsTrigger value="pending">Pending ({filtered("pending").length})</TabsTrigger>
                    <TabsTrigger value="approved">Approved ({filtered("approved").length})</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected ({filtered("rejected").length})</TabsTrigger>
                    <TabsTrigger value="all">All ({filtered().length})</TabsTrigger>
                </TabsList>

                {["pending", "approved", "rejected", "all"].map(tab => (
                    <TabsContent key={tab} value={tab} className="space-y-3 mt-4">
                        {filtered(tab === "all" ? undefined : tab).map(req => (
                            <Card key={req.id} className="border-border/50">
                                <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">{req.studentName}</p>
                                        <p className="text-xs text-muted-foreground">{req.studentEmail}</p>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <Badge variant="outline" className="text-xs">{req.courseName}</Badge>
                                            <span className="text-xs text-muted-foreground">{new Date(req.requestDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className={cn("text-xs", statusBadge[req.status])}>
                                            {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                        </Badge>
                                        {req.status === "pending" && (
                                            <>
                                                <Button size="sm" variant="outline" className="text-emerald-600 hover:bg-emerald-50" onClick={() => handleAction(req.id, "approved")}>
                                                    <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
                                                </Button>
                                                <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/5" onClick={() => handleAction(req.id, "rejected")}>
                                                    <XCircle className="w-4 h-4 mr-1" /> Reject
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {filtered(tab === "all" ? undefined : tab).length === 0 && (
                            <p className="text-center text-muted-foreground py-8">No requests found.</p>
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </UniversityPageLayout>
    );
};

export default UniversityEnrollment;
