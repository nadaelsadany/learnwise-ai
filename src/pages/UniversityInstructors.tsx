import { useState } from "react";
import { UniversitySidebar, UniversitySidebarContent } from "@/components/layout/UniversitySidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
    Users, Mail, Star, BookOpen, Ban, CheckCircle2, MoreHorizontal,
    Search, UserPlus, Activity,
} from "lucide-react";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Instructor {
    id: string;
    name: string;
    email: string;
    department: string;
    courses: number;
    rating: number;
    status: "active" | "pending" | "suspended";
    joinedDate: string;
}

const UniversityInstructors = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const { toast } = useToast();
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");

    const [instructors, setInstructors] = useState<Instructor[]>([
        { id: "1", name: "Dr. Alan Turing", email: "alan@university.edu", department: "Computer Science", courses: 5, rating: 4.9, status: "active", joinedDate: "2023-01-15" },
        { id: "2", name: "Prof. Mary Barra", email: "mary@university.edu", department: "Business", courses: 3, rating: 4.7, status: "active", joinedDate: "2023-03-20" },
        { id: "3", name: "Dr. Sarah Chen", email: "sarah@university.edu", department: "Arts & Design", courses: 4, rating: 4.8, status: "active", joinedDate: "2023-06-01" },
        { id: "4", name: "Prof. John Nash", email: "john@university.edu", department: "Mathematics", courses: 2, rating: 4.5, status: "active", joinedDate: "2023-08-10" },
        { id: "5", name: "New Instructor", email: "new@university.edu", department: "Engineering", courses: 0, rating: 0, status: "pending", joinedDate: "2024-02-14" },
    ]);

    const filtered = instructors.filter(i =>
        (filterStatus === "all" || i.status === filterStatus) &&
        (i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            i.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            i.department.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleInvite = () => {
        if (!inviteEmail || !selectedDepartment) {
            toast({ variant: "destructive", title: "Missing fields", description: "Email and department are required." });
            return;
        }
        setInstructors([...instructors, {
            id: Math.random().toString(36).substr(2, 9),
            name: "Pending Invitation",
            email: inviteEmail,
            department: selectedDepartment,
            courses: 0,
            rating: 0,
            status: "pending",
            joinedDate: new Date().toISOString().split('T')[0]
        }]);
        setIsInviteDialogOpen(false);
        setInviteEmail("");
        setSelectedDepartment("");
        toast({ title: "Invitation Sent", description: `Invitation sent to ${inviteEmail}.` });
    };

    const handleStatusChange = (id: string, newStatus: Instructor['status']) => {
        setInstructors(instructors.map(i => i.id === id ? { ...i, status: newStatus } : i));
        toast({ title: "Status Updated", description: "Instructor status has been updated." });
    };

    const statusConfig = {
        active: { label: "Active", cls: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800" },
        pending: { label: "Pending", cls: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800" },
        suspended: { label: "Suspended", cls: "bg-destructive/10 text-destructive border-destructive/20" },
    };

    const avgRating = instructors.filter(i => i.rating > 0).reduce((a, i) => a + i.rating, 0) /
        (instructors.filter(i => i.rating > 0).length || 1);

    return (
        <div className="min-h-screen bg-background">
            <UniversitySidebar onCollapse={setSidebarCollapsed} />
            <Header sidebarCollapsed={sidebarCollapsed} userRole="University" mobileSidebar={<UniversitySidebarContent collapsed={false} />} />

            <main className={cn("pt-20 pb-12 px-4 sm:px-6 transition-all duration-300", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64")}>
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Hero Header */}
                    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-accent via-accent/80 to-primary p-8 text-white shadow-xl">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white blur-3xl translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className="w-5 h-5 opacity-70" />
                                    <span className="text-xs font-semibold uppercase tracking-widest opacity-70">Faculty</span>
                                </div>
                                <h1 className="text-4xl font-black tracking-tight">Instructors</h1>
                                <p className="opacity-70 mt-1 text-sm">Manage faculty members and teaching staff</p>
                            </div>
                            <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30 border backdrop-blur-sm font-semibold">
                                        <UserPlus className="w-4 h-4 mr-2" /> Invite Instructor
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Invite New Instructor</DialogTitle>
                                        <DialogDescription>Send an invitation to add a new faculty member.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input id="email" type="email" placeholder="instructor@university.edu" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="department">Department</Label>
                                            <Input id="department" placeholder="e.g. Computer Science" value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>Cancel</Button>
                                        <Button onClick={handleInvite} className="gradient-primary text-white border-0">Send Invitation</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
                            {[
                                { label: "Total Faculty", val: instructors.length, icon: Users },
                                { label: "Active", val: instructors.filter(i => i.status === 'active').length, icon: CheckCircle2 },
                                { label: "Pending", val: instructors.filter(i => i.status === 'pending').length, icon: Activity },
                                { label: "Avg Rating", val: `${avgRating.toFixed(1)} ★`, icon: Star },
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

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Search instructors..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="flex gap-2">
                            {["all", "active", "pending", "suspended"].map((s) => (
                                <Button
                                    key={s}
                                    size="sm"
                                    variant={filterStatus === s ? "default" : "outline"}
                                    onClick={() => setFilterStatus(s)}
                                    className={cn("capitalize text-xs", filterStatus === s && "gradient-primary text-white border-0")}
                                >
                                    {s}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Instructor Cards */}
                    {filtered.length === 0 ? (
                        <div className="text-center py-20 border border-dashed border-border rounded-2xl">
                            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold">No instructors found</h3>
                            <p className="text-muted-foreground mt-1 text-sm">Try adjusting your search or filters.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {filtered.map((instructor) => {
                                const cfg = statusConfig[instructor.status];
                                return (
                                    <Card key={instructor.id} className="border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
                                        <CardContent className="p-5 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-12 h-12 border-2 border-background shadow-md">
                                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${instructor.name}`} />
                                                        <AvatarFallback className="font-bold text-sm">{instructor.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-bold text-sm leading-tight">{instructor.name}</p>
                                                        <p className="text-xs text-muted-foreground">{instructor.email}</p>
                                                    </div>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        {instructor.status === 'active' ? (
                                                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleStatusChange(instructor.id, 'suspended')}>
                                                                <Ban className="w-4 h-4 mr-2" /> Suspend
                                                            </DropdownMenuItem>
                                                        ) : instructor.status === 'suspended' ? (
                                                            <DropdownMenuItem className="text-emerald-600 focus:text-emerald-600" onClick={() => handleStatusChange(instructor.id, 'active')}>
                                                                <CheckCircle2 className="w-4 h-4 mr-2" /> Reactivate
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem className="text-emerald-600 focus:text-emerald-600" onClick={() => handleStatusChange(instructor.id, 'active')}>
                                                                <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            {/* Department badge */}
                                            <Badge variant="outline" className="text-xs font-medium">{instructor.department}</Badge>

                                            {/* Stats */}
                                            <div className="grid grid-cols-3 gap-2">
                                                <div className="text-center p-2 rounded-lg bg-muted/40">
                                                    <p className="text-base font-black">{instructor.courses}</p>
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Courses</p>
                                                </div>
                                                <div className="text-center p-2 rounded-lg bg-muted/40">
                                                    <p className="text-base font-black">{instructor.rating > 0 ? instructor.rating : "—"}</p>
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Rating</p>
                                                </div>
                                                <div className="text-center p-2 rounded-lg bg-muted/40">
                                                    <p className="text-base font-black">{new Date(instructor.joinedDate).getFullYear()}</p>
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Joined</p>
                                                </div>
                                            </div>

                                            {/* Status + rating stars */}
                                            <div className="flex items-center justify-between pt-1 border-t border-border/40">
                                                <Badge variant="outline" className={cn("text-xs font-semibold border", cfg.cls)}>
                                                    {cfg.label}
                                                </Badge>
                                                {instructor.rating > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        {[1, 2, 3, 4, 5].map((s) => (
                                                            <Star
                                                                key={s}
                                                                className={cn("w-3 h-3", s <= Math.round(instructor.rating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30")}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default UniversityInstructors;
