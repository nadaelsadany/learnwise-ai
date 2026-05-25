import { useState } from "react";
import { AdminSidebar, AdminSidebarContent } from "@/components/layout/AdminSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Building2, Plus, Search, Network, Briefcase, Trash2, Edit2, ShieldAlert, Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Department = {
    id: string;
    name: string;
    parent: string | null;
    head: string;
    employeesCount: number;
};

type Role = {
    id: string;
    title: string;
    department: string;
    skills: string[];
};

const initialDepartments: Department[] = [
    { id: "1", name: "Acme Corporation", parent: null, head: "CEO Office", employeesCount: 248 },
    { id: "2", name: "Technology", parent: "1", head: "David Park", employeesCount: 62 },
    { id: "3", name: "Sales & Marketing", parent: "1", head: "Sarah Johnson", employeesCount: 65 },
    { id: "4", name: "Finance & Ops", parent: "1", head: "Aisha Nwosu", employeesCount: 93 },
    { id: "5", name: "Human Resources", parent: "1", head: "Elena Müller", employeesCount: 28 },
    { id: "6", name: "Engineering", parent: "2", head: "Tom Chen", employeesCount: 45 },
    { id: "7", name: "QA", parent: "2", head: "David Park", employeesCount: 17 },
];

const initialRoles: Role[] = [
    { id: "r1", title: "Software Engineer", department: "Engineering", skills: ["React", "TypeScript", "Node.js", "System Design"] },
    { id: "r2", title: "QA Specialist", department: "QA", skills: ["Test Planning", "Automation", "ISTQB", "Selenium"] },
    { id: "r3", title: "Sales Executive", department: "Sales & Marketing", skills: ["Negotiation", "B2B Sales", "CRM", "Communication"] },
    { id: "r4", title: "HR Generalist", department: "Human Resources", skills: ["Onboarding", "Compliance", "Conflict Resolution", "Recruiting"] },
    { id: "r5", title: "Financial Analyst", department: "Finance & Ops", skills: ["Excel Pivot Tables", "Forecasting", "Budgeting"] },
];

export default function AdminOrganization() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [departments, setDepartments] = useState<Department[]>(initialDepartments);
    const [roles, setRoles] = useState<Role[]>(initialRoles);
    
    // Search states
    const [deptSearch, setDeptSearch] = useState("");
    const [roleSearch, setRoleSearch] = useState("");

    // Create Department Dialog States
    const [isDeptOpen, setIsDeptOpen] = useState(false);
    const [newDept, setNewDept] = useState({ name: "", parent: "1", head: "" });

    // Create Role Dialog States
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const [newRole, setNewRole] = useState({ title: "", department: "Engineering", skillsString: "" });

    const { toast } = useToast();

    const handleCreateDept = () => {
        if (!newDept.name || !newDept.head) {
            toast({ variant: "destructive", title: "Missing fields", description: "Name and Head are required." });
            return;
        }
        const created: Department = {
            id: Date.now().toString(),
            name: newDept.name,
            parent: newDept.parent === "none" ? null : newDept.parent,
            head: newDept.head,
            employeesCount: 0
        };
        setDepartments([...departments, created]);
        setIsDeptOpen(false);
        setNewDept({ name: "", parent: "1", head: "" });
        toast({ title: "Department Created", description: `"${created.name}" department has been added.` });
    };

    const handleCreateRole = () => {
        if (!newRole.title) {
            toast({ variant: "destructive", title: "Title required" });
            return;
        }
        const skills = newRole.skillsString
            .split(",")
            .map(s => s.trim())
            .filter(Boolean);

        const created: Role = {
            id: Date.now().toString(),
            title: newRole.title,
            department: newRole.department,
            skills
        };
        setRoles([...roles, created]);
        setIsRoleOpen(false);
        setNewRole({ title: "", department: "Engineering", skillsString: "" });
        toast({ title: "Role Created", description: `"${created.title}" job title has been created.` });
    };

    const handleDeleteDept = (id: string) => {
        setDepartments(prev => prev.filter(d => d.id !== id));
        toast({ title: "Department Removed" });
    };

    const handleDeleteRole = (id: string) => {
        setRoles(prev => prev.filter(r => r.id !== id));
        toast({ title: "Role Removed" });
    };

    // Filter lists
    const filteredDepts = departments.filter(d => d.name.toLowerCase().includes(deptSearch.toLowerCase()));
    const filteredRoles = roles.filter(r => r.title.toLowerCase().includes(roleSearch.toLowerCase()) || r.department.toLowerCase().includes(roleSearch.toLowerCase()));

    return (
        <div className="min-h-screen bg-background">
            <AdminSidebar onCollapse={setSidebarCollapsed} />
            <Header sidebarCollapsed={sidebarCollapsed} userRole="Admin" mobileSidebar={<AdminSidebarContent collapsed={false} />} />
            
            <main className={cn("pt-20 pb-12 px-4 sm:px-6 transition-all duration-300", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64")}>
                <div className="max-w-7xl mx-auto space-y-6">
                    <div>
                        <h1 className="text-3xl font-black">Organization Structure</h1>
                        <p className="text-muted-foreground text-sm mt-1">Configure company structure, departments, roles, and job skills</p>
                    </div>

                    <Tabs defaultValue="departments" className="w-full">
                        <TabsList className="grid w-full sm:w-[480px] grid-cols-3 mb-6 bg-muted/60 p-1 rounded-xl">
                            <TabsTrigger value="departments" className="rounded-lg flex items-center gap-2"><Building2 className="w-4 h-4" /> Departments</TabsTrigger>
                            <TabsTrigger value="roles" className="rounded-lg flex items-center gap-2"><Briefcase className="w-4 h-4" /> Roles & Skills</TabsTrigger>
                            <TabsTrigger value="chart" className="rounded-lg flex items-center gap-2"><Network className="w-4 h-4" /> Org Chart</TabsTrigger>
                        </TabsList>

                        {/* DEPARTMENTS TAB */}
                        <TabsContent value="departments" className="space-y-6 animate-in fade-in duration-200">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="relative w-full sm:max-w-sm">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input className="pl-9" placeholder="Search departments..." value={deptSearch} onChange={(e) => setDeptSearch(e.target.value)} />
                                </div>
                                
                                <Dialog open={isDeptOpen} onOpenChange={setIsDeptOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-rose-500 hover:bg-rose-600 text-white border-0 w-full sm:w-auto">
                                            <Plus className="w-4 h-4 mr-2" /> Add Department
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Add New Department</DialogTitle>
                                            <DialogDescription>Define a department and position it in the hierarchy.</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label>Department Name</Label>
                                                <Input placeholder="e.g. Cyber Security" value={newDept.name} onChange={(e) => setNewDept({...newDept, name: e.target.value})} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Parent Department</Label>
                                                <Select value={newDept.parent} onValueChange={(val) => setNewDept({...newDept, parent: val})}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="none">None (Root Level)</SelectItem>
                                                        {departments.map((d) => (
                                                            <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Department Head</Label>
                                                <Input placeholder="e.g. Jane Foster" value={newDept.head} onChange={(e) => setNewDept({...newDept, head: e.target.value})} />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsDeptOpen(false)}>Cancel</Button>
                                            <Button onClick={handleCreateDept} className="bg-rose-500 hover:bg-rose-600 text-white border-0">Create Department</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <Card className="border-border/50">
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border/50 bg-muted/30">
                                                    <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Department Name</th>
                                                    <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Parent Department</th>
                                                    <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Department Head</th>
                                                    <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Employees</th>
                                                    <th className="px-5 py-3" />
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredDepts.map((d) => {
                                                    const parentDept = departments.find(p => p.id === d.parent);
                                                    return (
                                                        <tr key={d.id} className="border-b border-border/30 hover:bg-muted/10 transition-colors">
                                                            <td className="px-5 py-3.5 font-bold flex items-center gap-2">
                                                                <Building2 className="w-4 h-4 text-rose-500" />
                                                                {d.name}
                                                            </td>
                                                            <td className="px-5 py-3.5 text-muted-foreground">
                                                                {parentDept ? parentDept.name : <Badge variant="outline">Root Entity</Badge>}
                                                            </td>
                                                            <td className="px-5 py-3.5 font-medium">{d.head}</td>
                                                            <td className="px-5 py-3.5 text-muted-foreground font-mono">{d.employeesCount}</td>
                                                            <td className="px-5 py-3.5 text-right">
                                                                {d.id !== "1" && (
                                                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive w-8 h-8" onClick={() => handleDeleteDept(d.id)}>
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* ROLES & SKILLS TAB */}
                        <TabsContent value="roles" className="space-y-6 animate-in fade-in duration-200">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="relative w-full sm:max-w-sm">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input className="pl-9" placeholder="Search roles by title or dept..." value={roleSearch} onChange={(e) => setRoleSearch(e.target.value)} />
                                </div>

                                <Dialog open={isRoleOpen} onOpenChange={setIsRoleOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-rose-500 hover:bg-rose-600 text-white border-0 w-full sm:w-auto">
                                            <Plus className="w-4 h-4 mr-2" /> Add Role Requirement
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Add New Role & Skills</DialogTitle>
                                            <DialogDescription>Define what skills are required for a specific job title.</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label>Job Title</Label>
                                                <Input placeholder="e.g. Sales Specialist" value={newRole.title} onChange={(e) => setNewRole({...newRole, title: e.target.value})} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Department</Label>
                                                <Select value={newRole.department} onValueChange={(val) => setNewRole({...newRole, department: val})}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {departments.map((d) => (
                                                            <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Skills Required (comma separated)</Label>
                                                <Input placeholder="e.g. Communication, Negotiation, Lead Gen" value={newRole.skillsString} onChange={(e) => setNewRole({...newRole, skillsString: e.target.value})} />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsRoleOpen(false)}>Cancel</Button>
                                            <Button onClick={handleCreateRole} className="bg-rose-500 hover:bg-rose-600 text-white border-0">Save Role</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredRoles.map((role) => (
                                    <Card key={role.id} className="border-border/50 hover:shadow-sm transition-all">
                                        <CardHeader className="pb-2">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <CardTitle className="text-base font-bold">{role.title}</CardTitle>
                                                    <CardDescription>{role.department}</CardDescription>
                                                </div>
                                                <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteRole(role.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Required Skills:</Label>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {role.skills.map((skill) => (
                                                        <Badge key={skill} className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border-0">{skill}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {/* VISUAL ORG CHART TAB */}
                        <TabsContent value="chart" className="animate-in fade-in duration-200">
                            <Card className="border-border/50 bg-muted/10 p-6 md:p-10 flex flex-col items-center">
                                <div className="text-center mb-10 max-w-md">
                                    <h3 className="font-bold text-lg mb-1">Company Hierarchy</h3>
                                    <p className="text-sm text-muted-foreground">Automatic dynamic mapping of departments, child nodes, and team heads.</p>
                                </div>

                                {/* Tree Diagram Structure using CSS flexboxes and border gridlines */}
                                <div className="w-full flex flex-col items-center space-y-8">
                                    {/* CEO / Root Node */}
                                    <div className="flex flex-col items-center">
                                        <div className="p-4 rounded-xl border border-rose-300 bg-rose-50 dark:bg-rose-950/20 text-center shadow-md w-52 relative">
                                            <p className="font-bold text-sm text-rose-700">Acme Corporation</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">CEO Office</p>
                                            <Badge className="bg-rose-500 text-white border-0 text-[10px] mt-1">248 Employees</Badge>
                                        </div>
                                    </div>

                                    {/* Link line to next level */}
                                    <div className="w-0.5 h-8 bg-border" />

                                    {/* Level 2 Nodes (Horizontal Grid) */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative w-full max-w-5xl">
                                        {/* Technology Branch */}
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="p-4 rounded-xl border border-border/80 bg-background text-center shadow-sm w-44">
                                                <p className="font-bold text-sm">Technology</p>
                                                <p className="text-xs text-muted-foreground">Head: David Park</p>
                                                <Badge variant="secondary" className="text-[10px] mt-1 font-mono">62 Ees</Badge>
                                            </div>
                                            {/* Sub branch line */}
                                            <div className="w-0.5 h-6 bg-border" />
                                            <div className="flex flex-col gap-2">
                                                <div className="p-2.5 rounded-lg border border-border/40 bg-muted/30 text-center w-36 text-xs">
                                                    <p className="font-semibold">Engineering</p>
                                                    <p className="text-[10px] text-muted-foreground">Head: Tom Chen</p>
                                                </div>
                                                <div className="p-2.5 rounded-lg border border-border/40 bg-muted/30 text-center w-36 text-xs">
                                                    <p className="font-semibold">QA</p>
                                                    <p className="text-[10px] text-muted-foreground">Head: David Park</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Sales & Marketing Branch */}
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="p-4 rounded-xl border border-border/80 bg-background text-center shadow-sm w-44">
                                                <p className="font-bold text-sm">Sales & Marketing</p>
                                                <p className="text-xs text-muted-foreground">Head: Sarah Johnson</p>
                                                <Badge variant="secondary" className="text-[10px] mt-1 font-mono">65 Ees</Badge>
                                            </div>
                                            <div className="w-0.5 h-6 bg-border" />
                                            <div className="p-2.5 rounded-lg border border-border/40 bg-muted/30 text-center w-36 text-xs">
                                                <p className="font-semibold">Sales Teams</p>
                                                <p className="text-[10px] text-muted-foreground">B2B & Enterprise</p>
                                            </div>
                                        </div>

                                        {/* Finance & Ops Branch */}
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="p-4 rounded-xl border border-border/80 bg-background text-center shadow-sm w-44">
                                                <p className="font-bold text-sm">Finance & Ops</p>
                                                <p className="text-xs text-muted-foreground">Head: Aisha Nwosu</p>
                                                <Badge variant="secondary" className="text-[10px] mt-1 font-mono">93 Ees</Badge>
                                            </div>
                                            <div className="w-0.5 h-6 bg-border" />
                                            <div className="p-2.5 rounded-lg border border-border/40 bg-muted/30 text-center w-36 text-xs">
                                                <p className="font-semibold">Operations</p>
                                                <p className="text-[10px] text-muted-foreground">Systems & Supply</p>
                                            </div>
                                        </div>

                                        {/* Human Resources Branch */}
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="p-4 rounded-xl border border-border/80 bg-background text-center shadow-sm w-44">
                                                <p className="font-bold text-sm">Human Resources</p>
                                                <p className="text-xs text-muted-foreground">Head: Elena Müller</p>
                                                <Badge variant="secondary" className="text-[10px] mt-1 font-mono">28 Ees</Badge>
                                            </div>
                                            <div className="w-0.5 h-6 bg-border" />
                                            <div className="p-2.5 rounded-lg border border-border/40 bg-muted/30 text-center w-36 text-xs">
                                                <p className="font-semibold">Talent Acquisition</p>
                                                <p className="text-[10px] text-muted-foreground">Recruiting & Perks</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}
