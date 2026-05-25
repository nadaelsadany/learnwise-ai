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
    UserCheck, UserX, Building2, Shield, Edit2, Trash2, CheckCircle2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { getAdminUsers, saveAdminUsers, addAdminActivity, AdminUser as User } from "@/lib/adminData";

const previewImportUsers = [
    { name: "Alice Mercer", email: "alice@acme.com", team: "Marketing", department: "Sales & Marketing", role: "Employee", manager: "Sarah Johnson" },
    { name: "Ben Luca", email: "ben@acme.com", team: "Engineering", department: "Technology", role: "Employee", manager: "David Park" },
    { name: "Clara Hughes", email: "clara@acme.com", team: "Design", department: "Product", role: "Manager", manager: "Aisha Nwosu" }
];

const AdminUsers = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [users, setUsers] = useState<User[]>(() => getAdminUsers());
    const [search, setSearch] = useState("");
    const [filterDept, setFilterDept] = useState("all");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: "", email: "", team: "", department: "", role: "Employee" });
    
    // Upload CSV States
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null);
    const [isValidating, setIsValidating] = useState(false);
    
    // Edit User States
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

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
        const updated = [...users, { id: Date.now(), ...newUser, status: "Invited" } as User];
        setUsers(updated);
        saveAdminUsers(updated);
        addAdminActivity(`Employee ${newUser.name} added to organization`, "success");
        setIsAddOpen(false);
        setNewUser({ name: "", email: "", team: "", department: "", role: "Employee" });
        toast({ title: "User Added", description: `${newUser.name} has been added and invited.` });
    };

    const triggerFileSelect = () => {
        document.getElementById("dialog-file-upload")?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile({ name: file.name, size: file.size });
        }
    };

    const handleImportUsers = () => {
        setIsValidating(true);
        setTimeout(() => {
            const imported: User[] = previewImportUsers.map((u, i) => ({
                id: Date.now() + i,
                name: u.name,
                email: u.email,
                team: u.team,
                department: u.department,
                role: u.role,
                status: "Invited" as const
            }));
            const updated = [...users, ...imported];
            setUsers(updated);
            saveAdminUsers(updated);
            addAdminActivity(`Imported ${imported.length} new employees via CSV`, "success");
            setIsValidating(false);
            setIsUploadOpen(false);
            setUploadedFile(null);
            toast({ title: "Import Successful", description: `${imported.length} new employees have been added to the directory.` });
        }, 1500);
    };

    const handleToggleStatus = (id: number, currentStatus: "Active" | "Invited" | "Inactive") => {
        const nextStatus = currentStatus === "Active" ? "Inactive" : "Active";
        const updated = users.map(u => u.id === id ? { ...u, status: nextStatus } : u);
        setUsers(updated);
        saveAdminUsers(updated);
        const userObj = users.find(u => u.id === id);
        if (userObj) {
            addAdminActivity(`Employee ${userObj.name} status changed to ${nextStatus}`, "info");
        }
        toast({ title: "Status Updated", description: `User status changed to ${nextStatus}.` });
    };

    const handleDeleteUser = (id: number) => {
        const userToDelete = users.find(u => u.id === id);
        const updated = users.filter(u => u.id !== id);
        setUsers(updated);
        saveAdminUsers(updated);
        if (userToDelete) {
            addAdminActivity(`Employee ${userToDelete.name} removed from organization`, "warn");
        }
        toast({ title: "User Deleted", description: "User has been removed from the directory." });
    };

    const handleSaveEditUser = () => {
        if (!editingUser || !editingUser.name || !editingUser.email) {
            toast({ variant: "destructive", title: "Missing Fields" });
            return;
        }
        const updated = users.map(u => u.id === editingUser.id ? editingUser : u);
        setUsers(updated);
        saveAdminUsers(updated);
        addAdminActivity(`Profile of ${editingUser.name} updated`, "info");
        setIsEditOpen(false);
        setEditingUser(null);
        toast({ title: "User Profile Updated" });
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
                            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline">
                                        <Upload className="w-4 h-4 mr-2" /> Upload CSV / Excel
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2"><Upload className="w-5 h-5 text-rose-500" /> Upload Employee Directory</DialogTitle>
                                        <DialogDescription>
                                            Upload a CSV or Excel spreadsheet containing your employee records.
                                        </DialogDescription>
                                    </DialogHeader>
                                    
                                    {!uploadedFile ? (
                                        <div 
                                            className="border-2 border-dashed border-border/80 rounded-xl p-8 text-center bg-muted/20 hover:bg-muted/30 hover:border-rose-500/50 transition-all cursor-pointer flex flex-col items-center justify-center space-y-3"
                                            onClick={triggerFileSelect}
                                        >
                                            <Upload className="w-10 h-10 text-muted-foreground" />
                                            <div>
                                                <p className="font-semibold text-sm">Drag and drop file here, or click to browse</p>
                                                <p className="text-xs text-muted-foreground mt-1">Supports .csv, .xls, .xlsx files up to 10MB</p>
                                            </div>
                                            <input 
                                                type="file" 
                                                id="dialog-file-upload" 
                                                className="hidden" 
                                                accept=".csv,.xlsx,.xls" 
                                                onChange={handleFileChange} 
                                            />
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between bg-muted/40 p-2.5 rounded-lg border">
                                                <div className="flex items-center gap-2">
                                                    <div className="bg-rose-500/10 text-rose-500 p-1.5 rounded-md font-mono text-xs font-bold">XLSX</div>
                                                    <div>
                                                        <p className="text-xs font-bold truncate max-w-[240px]">{uploadedFile.name}</p>
                                                        <p className="text-[10px] text-muted-foreground">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                                                    </div>
                                                </div>
                                                <Button size="xs" variant="ghost" className="text-xs text-muted-foreground hover:text-rose-500" onClick={() => setUploadedFile(null)}>Remove</Button>
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-bold text-muted-foreground uppercase">File Data Preview:</Label>
                                                <div className="border rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                                                    <table className="w-full text-[11px] text-left">
                                                        <thead>
                                                            <tr className="bg-muted border-b font-bold">
                                                                <th className="p-2">Name</th>
                                                                <th className="p-2">Email</th>
                                                                <th className="p-2">Department</th>
                                                                <th className="p-2">Role</th>
                                                                <th className="p-2">Manager</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {previewImportUsers.map((p, idx) => (
                                                                <tr key={idx} className="border-b last:border-0 hover:bg-muted/10">
                                                                    <td className="p-2 font-semibold">{p.name}</td>
                                                                    <td className="p-2 font-mono">{p.email}</td>
                                                                    <td className="p-2">{p.department}</td>
                                                                    <td className="p-2">{p.role}</td>
                                                                    <td className="p-2">{p.manager}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            <div className="text-[11px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 p-2.5 rounded-lg font-medium flex items-center gap-1.5">
                                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                                All schemas validated. 3 ready to import, 0 validation errors.
                                            </div>
                                        </div>
                                    )}

                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
                                        <Button 
                                            className="bg-rose-500 hover:bg-rose-600 text-white border-0 font-semibold" 
                                            disabled={!uploadedFile || isValidating}
                                            onClick={handleImportUsers}
                                        >
                                            {isValidating ? "Importing..." : "Validate & Create"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
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
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="w-8 h-8">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-40">
                                                            <DropdownMenuItem className="text-xs flex items-center gap-2 cursor-pointer" onClick={() => {
                                                                setEditingUser(user);
                                                                setIsEditOpen(true);
                                                            }}>
                                                                <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-xs flex items-center gap-2 cursor-pointer" onClick={() => handleToggleStatus(user.id, user.status)}>
                                                                <UserCheck className="w-3.5 h-3.5" /> {user.status === "Active" ? "Deactivate" : "Activate"}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-xs flex items-center gap-2 cursor-pointer text-destructive hover:bg-destructive/10" onClick={() => handleDeleteUser(user.id)}>
                                                                <Trash2 className="w-3.5 h-3.5" /> Delete User
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
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

            {/* Edit User Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[440px]">
                    <DialogHeader>
                        <DialogTitle>Edit User Profile</DialogTitle>
                        <DialogDescription>Modify user organizational data and access role.</DialogDescription>
                    </DialogHeader>
                    {editingUser && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Full Name</Label>
                                <Input id="edit-name" value={editingUser.name} onChange={(e) => setEditingUser({...editingUser, name: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-email">Email</Label>
                                <Input id="edit-email" value={editingUser.email} onChange={(e) => setEditingUser({...editingUser, email: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-team">Team</Label>
                                <Input id="edit-team" value={editingUser.team} onChange={(e) => setEditingUser({...editingUser, team: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-dept">Department</Label>
                                <Select value={editingUser.department} onValueChange={(v) => setEditingUser({...editingUser, department: v})}>
                                    <SelectTrigger id="edit-dept"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {departments.filter(d => d !== "all").map((d) => (
                                            <SelectItem key={d} value={d}>{d}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-role">Role</Label>
                                <Select value={editingUser.role} onValueChange={(v) => setEditingUser({...editingUser, role: v})}>
                                    <SelectTrigger id="edit-role"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {["Employee", "Manager", "HR Admin"].map((r) => (
                                            <SelectItem key={r} value={r}>{r}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveEditUser} className="bg-rose-500 hover:bg-rose-600 text-white border-0">Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminUsers;
