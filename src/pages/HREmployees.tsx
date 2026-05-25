import { useState } from "react";
import { HRSidebar, HRSidebarContent } from "@/components/layout/HRSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    Users, Search, Filter, Mail, MoreHorizontal, 
    ChevronRight, Plus, Building2, Shield, UserCheck, 
    Trash2, Edit3, Award, Sparkles, Brain
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
    Dialog, DialogContent, DialogDescription, DialogFooter, 
    DialogHeader, DialogTitle 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { getHREmployees, saveHREmployees, addHRActivity, HREmployee } from "@/lib/hrData";

const HREmployees = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [employees, setEmployees] = useState<HREmployee[]>(() => getHREmployees());
    const [search, setSearch] = useState("");
    const [filterDept, setFilterDept] = useState("all");
    const [filterRole, setFilterRole] = useState("all");
    const [filterPerf, setFilterPerf] = useState("all");
    const { toast } = useToast();

    // Dialog states
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedEmp, setSelectedEmp] = useState<HREmployee | null>(null);

    // New employee state
    const [newEmp, setNewEmp] = useState({
        name: "",
        role: "",
        dept: "Engineering",
        manager: "",
        skills: ""
    });

    const departments = ["all", ...Array.from(new Set(employees.map(e => e.dept)))];
    const roles = ["all", ...Array.from(new Set(employees.map(e => e.role)))];

    const filteredEmployees = employees.filter((emp) => {
        const matchSearch = emp.name.toLowerCase().includes(search.toLowerCase()) || 
                            emp.role.toLowerCase().includes(search.toLowerCase());
        const matchDept = filterDept === "all" || emp.dept === filterDept;
        const matchRole = filterRole === "all" || emp.role === filterRole;
        const matchPerf = filterPerf === "all" || emp.performanceLevel === filterPerf;
        return matchSearch && matchDept && matchRole && matchPerf;
    });

    const handleAddEmployee = () => {
        if (!newEmp.name || !newEmp.role) {
            toast({ variant: "destructive", title: "Name and Role are required." });
            return;
        }
        const created: HREmployee = {
            id: Date.now(),
            name: newEmp.name,
            role: newEmp.role,
            dept: newEmp.dept,
            courses: 0,
            progress: 0,
            performanceLevel: "Mid",
            performanceScore: 70,
            manager: newEmp.manager || "Unassigned",
            skills: newEmp.skills ? newEmp.skills.split(",").map(s => s.trim()) : [],
            status: "Active"
        };
        const updated = [...employees, created];
        setEmployees(updated);
        saveHREmployees(updated);
        addHRActivity("Employee Added", `${created.name} added to ${created.dept}`, "success");
        setIsAddOpen(false);
        setNewEmp({ name: "", role: "", dept: "Engineering", manager: "", skills: "" });
        toast({ title: "Employee Added", description: `${created.name} has been successfully registered.` });
    };

    const handleSaveEdit = () => {
        if (!selectedEmp) return;
        const updated = employees.map(e => e.id === selectedEmp.id ? selectedEmp : e);
        setEmployees(updated);
        saveHREmployees(updated);
        addHRActivity("Employee Details Updated", `Profile of ${selectedEmp.name} modified`, "info");
        setIsEditOpen(false);
        setSelectedEmp(null);
        toast({ title: "Profile Updated", description: "Changes have been successfully saved." });
    };

    const handleDeleteEmployee = (id: number, name: string) => {
        const updated = employees.filter(e => e.id !== id);
        setEmployees(updated);
        saveHREmployees(updated);
        addHRActivity("Employee Removed", `${name} removed from organization`, "warn");
        toast({ title: "Employee Deleted", description: `${name} has been removed.` });
    };

    const getPerfBadgeColor = (lvl: string) => {
        if (lvl === "High") return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
        if (lvl === "Low") return "bg-rose-500/10 text-rose-500 border-rose-500/20";
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
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight">Employee Directory</h1>
                            <p className="text-muted-foreground text-sm">Manage, filter, and assign career development metrics for your workforce.</p>
                        </div>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/20" onClick={() => setIsAddOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" /> Add Employee
                        </Button>
                    </div>

                    {/* Filter card */}
                    <Card className="border-border/50 shadow-soft">
                        <CardHeader className="p-4 border-b border-border/50 bg-muted/20">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input 
                                        placeholder="Search name or role..." 
                                        className="pl-9 bg-background border-border/50 rounded-xl"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Select value={filterDept} onValueChange={setFilterDept}>
                                        <SelectTrigger className="rounded-xl border-border/50 bg-background text-xs">
                                            <Building2 className="w-3.5 h-3.5 mr-2 text-indigo-500" />
                                            <SelectValue placeholder="Department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments.map(d => (
                                                <SelectItem key={d} value={d} className="text-xs">{d === "all" ? "All Departments" : d}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Select value={filterRole} onValueChange={setFilterRole}>
                                        <SelectTrigger className="rounded-xl border-border/50 bg-background text-xs">
                                            <Shield className="w-3.5 h-3.5 mr-2 text-indigo-500" />
                                            <SelectValue placeholder="Role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map(r => (
                                                <SelectItem key={r} value={r} className="text-xs">{r === "all" ? "All Roles" : r}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Select value={filterPerf} onValueChange={setFilterPerf}>
                                        <SelectTrigger className="rounded-xl border-border/50 bg-background text-xs">
                                            <Brain className="w-3.5 h-3.5 mr-2 text-indigo-500" />
                                            <SelectValue placeholder="Performance Level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all" className="text-xs">All Performance Levels</SelectItem>
                                            <SelectItem value="High" className="text-xs">High Performers</SelectItem>
                                            <SelectItem value="Mid" className="text-xs">Medium Performers</SelectItem>
                                            <SelectItem value="Low" className="text-xs">Low / At Risk</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-muted/10 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/50">
                                            <th className="px-6 py-4">Employee</th>
                                            <th className="px-6 py-4">Department & Role</th>
                                            <th className="px-6 py-4">Learning Progress</th>
                                            <th className="px-6 py-4">Performance Rating</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredEmployees.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="text-center py-12 text-sm text-muted-foreground">No employees match the specified filters.</td>
                                            </tr>
                                        ) : (
                                            filteredEmployees.map((emp) => (
                                                <tr key={emp.id} className="group hover:bg-muted/30 transition-colors border-b border-border/50">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="w-10 h-10 border border-border/50 shadow-soft">
                                                                <AvatarFallback className="bg-indigo-50 text-indigo-600 font-extrabold">{emp.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="text-sm font-bold">{emp.name}</p>
                                                                <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">Manager: <span className="font-semibold text-foreground">{emp.manager}</span></p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="space-y-1">
                                                            <Badge variant="outline" className="text-[9px] font-bold border-indigo-200 text-indigo-600 bg-indigo-50/50">
                                                                {emp.dept}
                                                            </Badge>
                                                            <p className="text-xs text-muted-foreground pl-1">{emp.role}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="w-48">
                                                            <div className="flex items-center justify-between text-[10px] mb-1 font-bold">
                                                                <span>{emp.courses} Courses</span>
                                                                <span className="text-indigo-600">{emp.progress}%</span>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${emp.progress}%` }} />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="outline" className={cn("text-[9px] font-black border", getPerfBadgeColor(emp.performanceLevel))}>
                                                                {emp.performanceLevel} ({emp.performanceScore}%)
                                                            </Badge>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge variant={emp.status === "At Risk" ? "destructive" : "default"} className="text-[10px] rounded-lg">
                                                            {emp.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                className="w-8 h-8 rounded-lg text-indigo-600 hover:bg-indigo-50"
                                                                onClick={() => {
                                                                    setSelectedEmp(emp);
                                                                    setIsEditOpen(true);
                                                                }}
                                                            >
                                                                <Edit3 className="w-4 h-4" />
                                                            </Button>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                className="w-8 h-8 rounded-lg text-destructive hover:bg-destructive/10"
                                                                onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* Add Employee Dialog */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="rounded-2xl max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-indigo-600"><Users className="w-5 h-5" /> Add New Employee</DialogTitle>
                        <DialogDescription>Create a new employee profile in the Talent directory.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="add-name" className="text-xs font-bold text-muted-foreground uppercase">Full Name</Label>
                            <Input id="add-name" placeholder="John Doe" value={newEmp.name} onChange={(e) => setNewEmp({...newEmp, name: e.target.value})} className="rounded-xl border-border/60" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="add-role" className="text-xs font-bold text-muted-foreground uppercase">Role Designation</Label>
                            <Input id="add-role" placeholder="Senior Backend Developer" value={newEmp.role} onChange={(e) => setNewEmp({...newEmp, role: e.target.value})} className="rounded-xl border-border/60" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="add-dept" className="text-xs font-bold text-muted-foreground uppercase">Department</Label>
                                <Select value={newEmp.dept} onValueChange={(v) => setNewEmp({...newEmp, dept: v})}>
                                    <SelectTrigger id="add-dept" className="rounded-xl border-border/60">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {["Engineering", "Product", "Sales", "Human Resources", "Finance"].map(d => (
                                            <SelectItem key={d} value={d}>{d}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="add-manager" className="text-xs font-bold text-muted-foreground uppercase">Manager Name</Label>
                                <Input id="add-manager" placeholder="David Park" value={newEmp.manager} onChange={(e) => setNewEmp({...newEmp, manager: e.target.value})} className="rounded-xl border-border/60" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="add-skills" className="text-xs font-bold text-muted-foreground uppercase font-semibold">Skills (comma-separated)</Label>
                            <Input id="add-skills" placeholder="React, Node.js, Excel" value={newEmp.skills} onChange={(e) => setNewEmp({...newEmp, skills: e.target.value})} className="rounded-xl border-border/60" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="rounded-xl" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl" onClick={handleAddEmployee}>Create Profile</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Employee Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="rounded-2xl max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-indigo-600"><Edit3 className="w-5 h-5" /> Edit Employee Profile</DialogTitle>
                        <DialogDescription>Modify organizational alignment and performance values.</DialogDescription>
                    </DialogHeader>
                    {selectedEmp && (
                        <div className="space-y-4 py-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-muted-foreground uppercase">Name</Label>
                                    <Input value={selectedEmp.name} disabled className="rounded-xl bg-muted border-border/60" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-muted-foreground uppercase">Status</Label>
                                    <Select value={selectedEmp.status} onValueChange={(v: "Active" | "At Risk") => setSelectedEmp({...selectedEmp, status: v})}>
                                        <SelectTrigger className="rounded-xl border-border/60">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="At Risk">At Risk</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="edit-role" className="text-xs font-bold text-muted-foreground uppercase">Role</Label>
                                <Input id="edit-role" value={selectedEmp.role} onChange={(e) => setSelectedEmp({...selectedEmp, role: e.target.value})} className="rounded-xl border-border/60" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-dept" className="text-xs font-bold text-muted-foreground uppercase">Department</Label>
                                    <Select value={selectedEmp.dept} onValueChange={(v) => setSelectedEmp({...selectedEmp, dept: v})}>
                                        <SelectTrigger id="edit-dept" className="rounded-xl border-border/60">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {["Engineering", "Product", "Sales", "Human Resources", "Finance"].map(d => (
                                                <SelectItem key={d} value={d}>{d}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-manager" className="text-xs font-bold text-muted-foreground uppercase">Manager</Label>
                                    <Input id="edit-manager" value={selectedEmp.manager} onChange={(e) => setSelectedEmp({...selectedEmp, manager: e.target.value})} className="rounded-xl border-border/60" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-muted-foreground uppercase">Perf Score (0-100)</Label>
                                    <Input 
                                        type="number" 
                                        value={selectedEmp.performanceScore} 
                                        onChange={(e) => {
                                            const score = Number(e.target.value);
                                            let lvl: "High" | "Mid" | "Low" = "Mid";
                                            if (score >= 85) lvl = "High";
                                            else if (score < 60) lvl = "Low";
                                            setSelectedEmp({
                                                ...selectedEmp, 
                                                performanceScore: score,
                                                performanceLevel: lvl
                                            });
                                        }} 
                                        className="rounded-xl border-border/60" 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-muted-foreground uppercase">Perf Level</Label>
                                    <Input value={selectedEmp.performanceLevel} disabled className="rounded-xl bg-muted border-border/60" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Active Skills</Label>
                                <div className="flex flex-wrap gap-1.5 p-2.5 border border-border/60 rounded-xl bg-muted/20 min-h-[40px]">
                                    {selectedEmp.skills.map((s, idx) => (
                                        <Badge key={idx} variant="outline" className="text-[10px] bg-background">{s}</Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" className="rounded-xl" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl" onClick={handleSaveEdit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default HREmployees;
