import { useState } from "react";
import { UniversitySidebar, UniversitySidebarContent } from "@/components/layout/UniversitySidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
import { Building2, Plus, Search, MoreHorizontal, Users, BookOpen, Trash2, Edit, DollarSign } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";

interface Department {
    id: string;
    name: string;
    head: string;
    studentCount: number;
    courseCount: number;
    budget: number;
}

const UniversityDepartments = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Mock Data
    const [departments, setDepartments] = useState<Department[]>([
        { id: "1", name: "Computer Science", head: "Dr. Alan Turing", studentCount: 450, courseCount: 24, budget: 500000 },
        { id: "2", name: "Business Administration", head: "Prof. Mary Barra", studentCount: 380, courseCount: 18, budget: 420000 },
        { id: "3", name: "Engineering", head: "Dr. Elon Musk", studentCount: 520, courseCount: 30, budget: 650000 },
        { id: "4", name: "Arts & Design", head: "Sarah Chen", studentCount: 210, courseCount: 12, budget: 180000 },
        { id: "5", name: "Physics", head: "Dr. Richard Feynman", studentCount: 150, courseCount: 10, budget: 220000 },
    ]);

    const [newDept, setNewDept] = useState({ name: "", head: "", budget: "" });

    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.head.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddDepartment = () => {
        if (!newDept.name || !newDept.head) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please fill in all required fields.",
            });
            return;
        }

        const dept: Department = {
            id: Math.random().toString(36).substr(2, 9),
            name: newDept.name,
            head: newDept.head,
            studentCount: 0,
            courseCount: 0,
            budget: Number(newDept.budget) || 0,
        };

        setDepartments([...departments, dept]);
        setIsAddDialogOpen(false);
        setNewDept({ name: "", head: "", budget: "" });
        toast({
            title: "Department Added",
            description: `${dept.name} has been successfully created.`,
        });
    };

    const handleDelete = (id: string) => {
        setDepartments(departments.filter(d => d.id !== id));
        toast({
            title: "Department Deleted",
            description: "The department has been removed.",
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <UniversitySidebar onCollapse={setSidebarCollapsed} />
            <Header
                sidebarCollapsed={sidebarCollapsed}
                userRole="University"
                mobileSidebar={<UniversitySidebarContent collapsed={false} />}
            />

            <main className={cn(
                "pt-20 pb-8 px-4 sm:px-6 transition-all duration-300",
                sidebarCollapsed ? "lg:ml-20" : "lg:ml-64",
                "ml-0"
            )}>
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-slide-up">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                                <Building2 className="w-8 h-8 text-primary" />
                                Departments
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Manage university departments and faculties.
                            </p>
                        </div>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="shadow-glow-primary gradient-primary text-white border-0">
                                    <Plus className="w-4 h-4 mr-2" /> Add Department
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add New Department</DialogTitle>
                                    <DialogDescription>
                                        Create a new department to organize courses and instructors.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Department Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="e.g. Computer Science"
                                            value={newDept.name}
                                            onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                                            className="focus-visible:ring-primary bg-background/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="head">Head of Department</Label>
                                        <Input
                                            id="head"
                                            placeholder="e.g. Dr. Jane Doe"
                                            value={newDept.head}
                                            onChange={(e) => setNewDept({ ...newDept, head: e.target.value })}
                                            className="focus-visible:ring-primary bg-background/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="budget">Annual Budget ($)</Label>
                                        <Input
                                            id="budget"
                                            type="number"
                                            placeholder="e.g. 500000"
                                            value={newDept.budget}
                                            onChange={(e) => setNewDept({ ...newDept, budget: e.target.value })}
                                            className="focus-visible:ring-primary bg-background/50"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                    <Button onClick={handleAddDepartment} className="gradient-primary text-white shadow-glow-primary border-0">Create Department</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
                        <Card className="border-border/50 shadow-soft hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Departments</p>
                                    <h3 className="text-2xl font-bold text-foreground">{departments.length}</h3>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-border/50 shadow-soft hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                                    <h3 className="text-2xl font-bold text-foreground">
                                        {departments.reduce((acc, curr) => acc + curr.studentCount, 0).toLocaleString()}
                                    </h3>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-border/50 shadow-soft hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-green-500/10 text-green-500">
                                    <DollarSign className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                                    <h3 className="text-2xl font-bold text-foreground">
                                        ${(departments.reduce((acc, curr) => acc + curr.budget, 0) / 1000000).toFixed(1)}M
                                    </h3>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border/50 shadow-soft animate-slide-up" style={{ animationDelay: "200ms" }}>
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search departments..."
                                className="pl-9 bg-background/50 focus-visible:ring-primary"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-card rounded-xl border border-border/50 shadow-soft overflow-hidden animate-slide-up" style={{ animationDelay: "300ms" }}>
                        {filteredDepartments.length === 0 ? (
                            <div className="text-center py-12">
                                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium">No departments found</h3>
                                <p className="text-muted-foreground mt-2">
                                    Try adjusting your search or add a new department.
                                </p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                                        <TableHead>Department Name</TableHead>
                                        <TableHead>Head</TableHead>
                                        <TableHead>Stats</TableHead>
                                        <TableHead>Budget</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDepartments.map((dept) => (
                                        <TableRow key={dept.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                        <Building2 className="w-5 h-5" />
                                                    </div>
                                                    {dept.name}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm font-medium">{dept.head}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md">
                                                        <Users className="w-3 h-3" /> {dept.studentCount}
                                                    </span>
                                                    <span className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md">
                                                        <BookOpen className="w-3 h-3" /> {dept.courseCount}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-medium text-green-600 dark:text-green-400">
                                                    ${dept.budget.toLocaleString()}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem>
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Edit Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive"
                                                            onClick={() => handleDelete(dept.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UniversityDepartments;
