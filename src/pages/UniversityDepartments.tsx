import { useState } from "react";
import { UniversitySidebar, UniversitySidebarContent } from "@/components/layout/UniversitySidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
    Building2, Plus, Search, Users, BookOpen, Trash2, Edit,
    DollarSign, ArrowUpRight, TrendingUp, MoreHorizontal,
} from "lucide-react";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Department {
    id: string;
    name: string;
    head: string;
    studentCount: number;
    courseCount: number;
    budget: number;
    performance: number;
    color: string;
}

const DEPT_COLORS = [
    { bg: "bg-primary/10", text: "text-primary", dot: "bg-primary", bar: "bg-primary" },
    { bg: "bg-accent/10", text: "text-accent", dot: "bg-accent", bar: "bg-accent" },
    { bg: "bg-emerald-500/10", text: "text-emerald-500", dot: "bg-emerald-500", bar: "bg-emerald-500" },
    { bg: "bg-amber-500/10", text: "text-amber-500", dot: "bg-amber-500", bar: "bg-amber-500" },
    { bg: "bg-rose-500/10", text: "text-rose-500", dot: "bg-rose-500", bar: "bg-rose-500" },
];

const UniversityDepartments = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newDept, setNewDept] = useState({ name: "", head: "", budget: "" });

    // Edit state
    const [editingDept, setEditingDept] = useState<Department | null>(null);
    const [editForm, setEditForm] = useState({ name: "", head: "", budget: "" });

    const [departments, setDepartments] = useState<Department[]>([
        { id: "1", name: "Computer Science", head: "Dr. Alan Turing", studentCount: 450, courseCount: 24, budget: 500000, performance: 92, color: "0" },
        { id: "2", name: "Business Administration", head: "Prof. Mary Barra", studentCount: 380, courseCount: 18, budget: 420000, performance: 88, color: "1" },
        { id: "3", name: "Engineering", head: "Dr. Elon Musk", studentCount: 520, courseCount: 30, budget: 650000, performance: 95, color: "2" },
        { id: "4", name: "Arts & Design", head: "Sarah Chen", studentCount: 210, courseCount: 12, budget: 180000, performance: 79, color: "3" },
        { id: "5", name: "Physics", head: "Dr. Richard Feynman", studentCount: 150, courseCount: 10, budget: 220000, performance: 83, color: "4" },
    ]);

    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.head.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddDepartment = () => {
        if (!newDept.name || !newDept.head) {
            toast({ variant: "destructive", title: "Missing fields", description: "Name and head are required." });
            return;
        }
        const dept: Department = {
            id: Math.random().toString(36).substr(2, 9),
            name: newDept.name,
            head: newDept.head,
            studentCount: 0,
            courseCount: 0,
            budget: Number(newDept.budget) || 0,
            performance: 100,
            color: String(departments.length % 5),
        };
        setDepartments([...departments, dept]);
        setIsAddDialogOpen(false);
        setNewDept({ name: "", head: "", budget: "" });
        toast({ title: "Department Created", description: `${dept.name} has been added.` });
    };

    const handleDelete = (id: string) => {
        setDepartments(departments.filter(d => d.id !== id));
        toast({ title: "Department Removed", description: "The department has been deleted." });
    };

    const handleOpenEdit = (dept: Department) => {
        setEditingDept(dept);
        setEditForm({ name: dept.name, head: dept.head, budget: String(dept.budget) });
    };

    const handleSaveEdit = () => {
        if (!editingDept || !editForm.name || !editForm.head) {
            toast({ variant: "destructive", title: "Missing fields", description: "Name and head are required." });
            return;
        }
        setDepartments(departments.map(d =>
            d.id === editingDept.id
                ? { ...d, name: editForm.name, head: editForm.head, budget: Number(editForm.budget) || d.budget }
                : d
        ));
        setEditingDept(null);
        toast({ title: "Department Updated", description: `${editForm.name} has been updated.` });
    };

    const totalStudents = departments.reduce((a, d) => a + d.studentCount, 0);
    const totalBudget = departments.reduce((a, d) => a + d.budget, 0);

    return (
        <div className="min-h-screen bg-background">
            <UniversitySidebar onCollapse={setSidebarCollapsed} />
            <Header sidebarCollapsed={sidebarCollapsed} userRole="University" mobileSidebar={<UniversitySidebarContent collapsed={false} />} />

            <main className={cn("pt-20 pb-12 px-4 sm:px-6 transition-all duration-300", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64")}>
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Hero Header */}
                    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary via-primary/80 to-accent p-8 text-primary-foreground shadow-xl">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white blur-3xl translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Building2 className="w-5 h-5 opacity-70" />
                                    <span className="text-xs font-semibold uppercase tracking-widest opacity-70">Management</span>
                                </div>
                                <h1 className="text-4xl font-black tracking-tight">Departments</h1>
                                <p className="text-primary-foreground/70 mt-1 text-sm">Organize and manage all university faculties</p>
                            </div>
                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30 border backdrop-blur-sm font-semibold">
                                        <Plus className="w-4 h-4 mr-2" /> New Department
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Add New Department</DialogTitle>
                                        <DialogDescription>Create a new department to organize courses and instructors.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Department Name</Label>
                                            <Input id="name" placeholder="e.g. Computer Science" value={newDept.name} onChange={(e) => setNewDept({ ...newDept, name: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="head">Head of Department</Label>
                                            <Input id="head" placeholder="e.g. Dr. Jane Doe" value={newDept.head} onChange={(e) => setNewDept({ ...newDept, head: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="budget">Annual Budget ($)</Label>
                                            <Input id="budget" type="number" placeholder="e.g. 500000" value={newDept.budget} onChange={(e) => setNewDept({ ...newDept, budget: e.target.value })} />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                        <Button onClick={handleAddDepartment} className="gradient-primary text-white border-0">Create Department</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                        {/* Inline stats */}
                        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
                            {[
                                { label: "Total Departments", val: departments.length, icon: Building2 },
                                { label: "Total Students", val: totalStudents.toLocaleString(), icon: Users },
                                { label: "Total Courses", val: departments.reduce((a, d) => a + d.courseCount, 0), icon: BookOpen },
                                { label: "Total Budget", val: `$${(totalBudget / 1000000).toFixed(1)}M`, icon: DollarSign },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center gap-3">
                                    <item.icon className="w-4 h-4 opacity-60 shrink-0" />
                                    <div>
                                        <p className="text-xs opacity-60 font-medium">{item.label}</p>
                                        <p className="font-bold text-sm">{item.val}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search departments..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Department Cards Grid */}
                    {filteredDepartments.length === 0 ? (
                        <div className="text-center py-20 border border-dashed border-border rounded-2xl">
                            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold">No departments found</h3>
                            <p className="text-muted-foreground mt-1 text-sm">Try a different search or add a new department.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {filteredDepartments.map((dept) => {
                                const colorIdx = parseInt(dept.color) % 5;
                                const colors = DEPT_COLORS[colorIdx];
                                const initials = dept.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
                                return (
                                    <Card key={dept.id} className="border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group overflow-hidden">
                                        <CardContent className="p-0">
                                            {/* Card top accent */}
                                            <div className={cn("h-1.5 w-full", colors.bar)} />
                                            <div className="p-5 space-y-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black shrink-0", colors.bg, colors.text)}>
                                                            {initials}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-base leading-tight">{dept.name}</h3>
                                                            <p className="text-xs text-muted-foreground mt-0.5">{dept.head}</p>
                                                        </div>
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => handleOpenEdit(dept)}>
                                                                <Edit className="w-4 h-4 mr-2" /> Edit Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(dept.id)}>
                                                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>

                                                {/* Performance */}
                                                <div>
                                                    <div className="flex justify-between items-center mb-1.5">
                                                        <span className="text-xs text-muted-foreground font-medium">Performance Score</span>
                                                        <span className={cn("text-xs font-bold", colors.text)}>{dept.performance}%</span>
                                                    </div>
                                                    <Progress value={dept.performance} className="h-1.5" />
                                                </div>

                                                {/* Stats row */}
                                                <div className="grid grid-cols-3 gap-2 pt-1">
                                                    <div className="text-center p-2 rounded-lg bg-muted/40">
                                                        <p className="text-lg font-black">{dept.studentCount}</p>
                                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Students</p>
                                                    </div>
                                                    <div className="text-center p-2 rounded-lg bg-muted/40">
                                                        <p className="text-lg font-black">{dept.courseCount}</p>
                                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Courses</p>
                                                    </div>
                                                    <div className="text-center p-2 rounded-lg bg-muted/40">
                                                        <p className="text-lg font-black">${(dept.budget / 1000).toFixed(0)}k</p>
                                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Budget</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}

                            {/* Add Department Card */}
                            <button
                                onClick={() => setIsAddDialogOpen(true)}
                                className="border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-5 flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-primary transition-all duration-200 min-h-[220px]"
                            >
                                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                                    <Plus className="w-6 h-6" />
                                </div>
                                <div className="text-center">
                                    <p className="font-semibold text-sm">Add Department</p>
                                    <p className="text-xs opacity-60 mt-0.5">Expand your university</p>
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Edit Department Dialog */}
            <Dialog open={!!editingDept} onOpenChange={(open) => !open && setEditingDept(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Department</DialogTitle>
                        <DialogDescription>Update department details below.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Department Name</Label>
                            <Input id="edit-name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-head">Head of Department</Label>
                            <Input id="edit-head" value={editForm.head} onChange={(e) => setEditForm({ ...editForm, head: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-budget">Annual Budget ($)</Label>
                            <Input id="edit-budget" type="number" value={editForm.budget} onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingDept(null)}>Cancel</Button>
                        <Button onClick={handleSaveEdit} className="gradient-primary text-white border-0">Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UniversityDepartments;