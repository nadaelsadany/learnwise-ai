import { useState } from "react";
import { AdminSidebar, AdminSidebarContent } from "@/components/layout/AdminSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Users, Plus, Upload, Mail, Search, Filter, MoreHorizontal,
    UserCheck, UserX, Building2, Shield,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type User = {
    id: number; name: string; email: string;
    team: string; department: string; role: string; status: "Active" | "Invited" | "Inactive";
};

const initialUsers: User[] = [
    { id: 1, name: "Sarah Johnson", email: "sarah@acme.com", team: "Marketing", department: "Sales & Marketing", role: "Employee", status: "Active" },
    { id: 2, name: "David Park", email: "david@acme.com", team: "Engineering", department: "Technology", role: "Manager", status: "Active" },
    { id: 3, name: "Lena Müller", email: "lena@acme.com", team: "Design", department: "Product", role: "Employee", status: "Active" },
    { id: 4, name: "Carlos Rivera", email: "carlos@acme.com", team: "Operations", department: "Operations", role: "Employee", status: "Invited" },
    { id: 5, name: "Aisha Nwosu", email: "aisha@acme.com", team: "Finance", department: "Finance", role: "Manager", status: "Active" },
    { id: 6, name: "Tom Chen", email: "tom@acme.com", team: "Engineering", department: "Technology", role: "Employee", status: "Inactive" },
];

const AdminUsers = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [search, setSearch] = useState("");
    const [filterDept, setFilterDept] = useState("all");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: "", email: "", team: "", department: "", role: "Employee" });
    const { toast } = useToast();

    const departments = ["all", "Sales & Marketing", "Technology", "Product", "Operations", "Finance"];

    const filtered = users.filter((u) => {
        const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
        const matchDept = filterDept === "all" || u.department === filterDept;
        return matchSearch && matchDept;
    });

    const handleAddUser = () => {
        if (!newUser.name || !newUser.email) {
            toast({ variant: "destructive", title: "Missing fields", description: "Name and email are required." });
            return;
        }
        setUsers([...users, { id: Date.now(), ...newUser, status: "Invited" } as User]);
        setIsAddOpen(false);
        setNewUser({ name: "", email: "", team: "", department: "", role: "Employee" });
        toast({ title: "User Added", description: `${newUser.name} has been added and invited.` });
    };

    const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        toast({ title: "CSV Imported", description: `${file.name} uploaded. Processing users…` });
        // Mock: add 3 fake users
        setUsers(prev => [
            ...prev,
            { id: Date.now() + 1, name: "Alice Mercer", email: "alice@acme.com", team: "Marketing", department: "Sales & Marketing", role: "Employee", status: "Invited" },
            { id: Date.now() + 2, name: "Ben Luca", email: "ben@acme.com", team: "Engineering", department: "Technology", role: "Employee", status: "Invited" },
        ]);
    };

    const handleSendInvite = () => {
        const link = `${window.location.origin}/auth?invite=acme-corp`;
        navigator.clipboard.writeText(link);
        toast({ title: "Invite Link Copied!", description: "Share it with your employees to join." });
    };

    const statusColor = (s: string) =>
        s === "Active" ? "text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20" :
            s === "Invited" ? "text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/20" :
                "text-muted-foreground border-border bg-muted";

    return (
        <div className="min-h-screen bg-background">
            <AdminSidebar onCollapse={setSidebarCollapsed} />
            <Header sidebarCollapsed={sidebarCollapsed} userRole="Admin" mobileSidebar={<AdminSidebarContent collapsed={false} />} />
            <main className={cn("pt-20 pb-12 px-4 sm:px-6 transition-all duration-300", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64")}>
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black">User Management</h1>
                            <p className="text-muted-foreground text-sm mt-1">Add, invite, and organise your employees</p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <label htmlFor="csv-upload">
                                <Button variant="outline" className="cursor-pointer" asChild>
                                    <span><Upload className="w-4 h-4 mr-2" /> Upload CSV</span>
                                </Button>
                            </label>
                            <input id="csv-upload" type="file" accept=".csv,.xlsx" className="hidden" onChange={handleCSVUpload} />
                            <Button variant="outline" onClick={handleSendInvite}>
                                <Mail className="w-4 h-4 mr-2" /> Send Invite Link
                            </Button>
                            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-rose-500 hover:bg-rose-600 text-white border-0">
                                        <Plus className="w-4 h-4 mr-2" /> Add User
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[440px]">
                                    <DialogHeader>
                                        <DialogTitle>Add New User</DialogTitle>
                                        <DialogDescription>Manually add an employee to your organisation.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        {[
                                            { id: "name", label: "Full Name", placeholder: "Jane Smith", key: "name" },
                                            { id: "email", label: "Email", placeholder: "jane@company.com", key: "email" },
                                            { id: "team", label: "Team", placeholder: "e.g. Engineering", key: "team" },
                                            { id: "department", label: "Department", placeholder: "e.g. Technology", key: "department" },
                                        ].map((f) => (
                                            <div key={f.id} className="space-y-2">
                                                <Label htmlFor={f.id}>{f.label}</Label>
                                                <Input id={f.id} placeholder={f.placeholder}
                                                    value={newUser[f.key as keyof typeof newUser]}
                                                    onChange={(e) => setNewUser({ ...newUser, [f.key]: e.target.value })} />
                                            </div>
                                        ))}
                                        <div className="space-y-2">
                                            <Label>Role</Label>
                                            <Select value={newUser.role} onValueChange={(v) => setNewUser({ ...newUser, role: v })}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {["Employee", "Manager", "HR Admin"].map((r) => (
                                                        <SelectItem key={r} value={r}>{r}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                                        <Button onClick={handleAddUser} className="bg-rose-500 hover:bg-rose-600 text-white border-0">Add User</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { label: "Total Users", val: users.length, icon: Users, color: "bg-primary/10 text-primary" },
                            { label: "Active", val: users.filter(u => u.status === "Active").length, icon: UserCheck, color: "bg-emerald-500/10 text-emerald-500" },
                            { label: "Invited", val: users.filter(u => u.status === "Invited").length, icon: Mail, color: "bg-amber-500/10 text-amber-500" },
                            { label: "Inactive", val: users.filter(u => u.status === "Inactive").length, icon: UserX, color: "bg-rose-500/10 text-rose-500" },
                        ].map((s) => (
                            <Card key={s.label} className="border-border/50">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", s.color)}>
                                        <s.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black">{s.val}</p>
                                        <p className="text-xs text-muted-foreground">{s.label}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input className="pl-9" placeholder="Search by name or email…" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <Select value={filterDept} onValueChange={setFilterDept}>
                            <SelectTrigger className="w-full sm:w-52">
                                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                                <SelectValue placeholder="All Departments" />
                            </SelectTrigger>
                            <SelectContent>
                                {departments.map((d) => (
                                    <SelectItem key={d} value={d}>{d === "all" ? "All Departments" : d}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Table */}
                    <Card className="border-border/50">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border/50 bg-muted/30">
                                            <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Name</th>
                                            <th className="text-left px-5 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Team</th>
                                            <th className="text-left px-5 py-3 font-semibold text-muted-foreground hidden md:table-cell">Department</th>
                                            <th className="text-left px-5 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Role</th>
                                            <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Status</th>
                                            <th className="px-5 py-3" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((user) => (
                                            <tr key={user.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold text-xs shrink-0">
                                                            {user.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold">{user.name}</p>
                                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 text-muted-foreground hidden sm:table-cell">{user.team}</td>
                                                <td className="px-5 py-3.5 hidden md:table-cell">
                                                    <span className="flex items-center gap-1.5 text-muted-foreground">
                                                        <Building2 className="w-3.5 h-3.5" /> {user.department}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5 hidden lg:table-cell">
                                                    <span className="flex items-center gap-1.5 text-muted-foreground">
                                                        <Shield className="w-3.5 h-3.5" /> {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <Badge variant="outline" className={cn("text-xs font-semibold", statusColor(user.status))}>
                                                        {user.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-5 py-3.5 text-right">
                                                    <Button variant="ghost" size="icon" className="w-8 h-8">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {filtered.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="text-center py-12 text-muted-foreground">No users match your search.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default AdminUsers;
