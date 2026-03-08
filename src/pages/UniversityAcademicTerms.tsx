import { useState } from "react";
import { UniversityPageLayout } from "@/components/layout/UniversityPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, Plus, Edit2, Archive, CheckCircle2, Clock, Users, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Term {
    id: string;
    name: string;
    type: "fall" | "spring" | "summer";
    year: number;
    startDate: string;
    endDate: string;
    status: "active" | "upcoming" | "archived";
    courses: number;
    students: number;
    instructors: number;
}

const initialTerms: Term[] = [
    { id: "1", name: "Fall 2025", type: "fall", year: 2025, startDate: "2025-09-01", endDate: "2025-12-20", status: "active", courses: 48, students: 620, instructors: 28 },
    { id: "2", name: "Spring 2026", type: "spring", year: 2026, startDate: "2026-01-15", endDate: "2026-05-30", status: "upcoming", courses: 42, students: 0, instructors: 25 },
    { id: "3", name: "Summer 2025", type: "summer", year: 2025, startDate: "2025-06-01", endDate: "2025-08-15", status: "archived", courses: 18, students: 210, instructors: 12 },
    { id: "4", name: "Spring 2025", type: "spring", year: 2025, startDate: "2025-01-15", endDate: "2025-05-30", status: "archived", courses: 45, students: 580, instructors: 26 },
];

const typeColors = {
    fall: "bg-amber-500/10 text-amber-600 border-amber-200",
    spring: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    summer: "bg-sky-500/10 text-sky-600 border-sky-200",
};

const statusConfig = {
    active: { label: "Active", color: "bg-emerald-500", badge: "text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20" },
    upcoming: { label: "Upcoming", color: "bg-primary", badge: "text-primary border-primary/20 bg-primary/5" },
    archived: { label: "Archived", color: "bg-muted-foreground", badge: "text-muted-foreground border-border bg-muted" },
};

const UniversityAcademicTerms = () => {
    const [terms, setTerms] = useState<Term[]>(initialTerms);
    const [isOpen, setIsOpen] = useState(false);
    const [newTerm, setNewTerm] = useState({ name: "", type: "fall", year: "2026", startDate: "", endDate: "" });
    const { toast } = useToast();

    const handleCreate = () => {
        if (!newTerm.name || !newTerm.startDate || !newTerm.endDate) {
            toast({ variant: "destructive", title: "Missing fields" });
            return;
        }
        setTerms([...terms, {
            id: Date.now().toString(), name: newTerm.name, type: newTerm.type as Term["type"],
            year: parseInt(newTerm.year), startDate: newTerm.startDate, endDate: newTerm.endDate,
            status: "upcoming", courses: 0, students: 0, instructors: 0,
        }]);
        setIsOpen(false);
        setNewTerm({ name: "", type: "fall", year: "2026", startDate: "", endDate: "" });
        toast({ title: "Term Created", description: `${newTerm.name} has been created.` });
    };

    const handleArchive = (id: string) => {
        setTerms(terms.map(t => t.id === id ? { ...t, status: "archived" as const } : t));
        toast({ title: "Term Archived" });
    };

    const handleActivate = (id: string) => {
        setTerms(terms.map(t => t.id === id ? { ...t, status: "active" as const } : t));
        toast({ title: "Term Activated" });
    };

    return (
        <UniversityPageLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        Academic Terms
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage semesters, assign courses, and track academic periods</p>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2"><Plus className="w-4 h-4" /> New Term</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Academic Term</DialogTitle>
                            <DialogDescription>Set up a new semester or term period.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Term Name</Label>
                                <Input placeholder="e.g. Fall 2026" value={newTerm.name} onChange={e => setNewTerm({ ...newTerm, name: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <Select value={newTerm.type} onValueChange={v => setNewTerm({ ...newTerm, type: v })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="fall">Fall Semester</SelectItem>
                                            <SelectItem value="spring">Spring Semester</SelectItem>
                                            <SelectItem value="summer">Summer Term</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Year</Label>
                                    <Input type="number" value={newTerm.year} onChange={e => setNewTerm({ ...newTerm, year: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Date</Label>
                                    <Input type="date" value={newTerm.startDate} onChange={e => setNewTerm({ ...newTerm, startDate: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Date</Label>
                                    <Input type="date" value={newTerm.endDate} onChange={e => setNewTerm({ ...newTerm, endDate: e.target.value })} />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreate}>Create Term</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Active Terms", value: terms.filter(t => t.status === "active").length, icon: CheckCircle2, color: "text-emerald-500" },
                    { label: "Upcoming", value: terms.filter(t => t.status === "upcoming").length, icon: Clock, color: "text-primary" },
                    { label: "Archived", value: terms.filter(t => t.status === "archived").length, icon: Archive, color: "text-muted-foreground" },
                ].map(s => (
                    <Card key={s.label} className="border-border/50">
                        <CardContent className="p-5 flex items-center gap-4">
                            <s.icon className={cn("w-8 h-8", s.color)} />
                            <div>
                                <p className="text-2xl font-black">{s.value}</p>
                                <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Term Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {terms.map(term => {
                    const sc = statusConfig[term.status];
                    return (
                        <Card key={term.id} className="border-border/50 hover:shadow-md transition-all">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className={cn("text-xs font-semibold", typeColors[term.type])}>
                                            {term.type.charAt(0).toUpperCase() + term.type.slice(1)}
                                        </Badge>
                                        <CardTitle className="text-base">{term.name}</CardTitle>
                                    </div>
                                    <Badge variant="outline" className={cn("text-xs", sc.badge)}>
                                        <div className={cn("w-1.5 h-1.5 rounded-full mr-1.5", sc.color)} />
                                        {sc.label}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    {new Date(term.startDate).toLocaleDateString()} — {new Date(term.endDate).toLocaleDateString()}
                                </p>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { icon: BookOpen, val: term.courses, label: "Courses" },
                                        { icon: Users, val: term.students, label: "Students" },
                                        { icon: Users, val: term.instructors, label: "Faculty" },
                                    ].map(m => (
                                        <div key={m.label} className="text-center p-2 rounded-lg bg-muted/50">
                                            <p className="text-lg font-bold">{m.val}</p>
                                            <p className="text-xs text-muted-foreground">{m.label}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="flex-1 gap-1.5"><Edit2 className="w-3.5 h-3.5" /> Edit</Button>
                                    {term.status === "active" ? (
                                        <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-muted-foreground" onClick={() => handleArchive(term.id)}>
                                            <Archive className="w-3.5 h-3.5" /> Archive
                                        </Button>
                                    ) : term.status === "upcoming" ? (
                                        <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-emerald-600" onClick={() => handleActivate(term.id)}>
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Activate
                                        </Button>
                                    ) : null}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </UniversityPageLayout>
    );
};

export default UniversityAcademicTerms;
