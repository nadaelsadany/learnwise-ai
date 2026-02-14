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
import {
    Users,
    Mail,
    Star,
    BookOpen,
    Ban,
    CheckCircle2,
    MoreHorizontal,
    Search,
    GraduationCap
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

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
    const { toast } = useToast();
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");

    // Mock Data
    const [instructors, setInstructors] = useState<Instructor[]>([
        {
            id: "1",
            name: "Dr. Alan Turing",
            email: "alan@university.edu",
            department: "Computer Science",
            courses: 5,
            rating: 4.9,
            status: "active",
            joinedDate: "2023-01-15"
        },
        {
            id: "2",
            name: "Prof. Mary Barra",
            email: "mary@university.edu",
            department: "Business",
            courses: 3,
            rating: 4.7,
            status: "active",
            joinedDate: "2023-03-20"
        },
        {
            id: "3",
            name: "New Instructor",
            email: "new@university.edu",
            department: "Engineering",
            courses: 0,
            rating: 0,
            status: "pending",
            joinedDate: "2024-02-14"
        },
    ]);

    const filteredInstructors = instructors.filter(instructor =>
        instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInvite = () => {
        if (!inviteEmail || !selectedDepartment) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please provide an email and select a department.",
            });
            return;
        }

        const newInstructor: Instructor = {
            id: Math.random().toString(36).substr(2, 9),
            name: "Pending Invitation",
            email: inviteEmail,
            department: selectedDepartment,
            courses: 0,
            rating: 0,
            status: "pending",
            joinedDate: new Date().toISOString().split('T')[0]
        };

        setInstructors([...instructors, newInstructor]);
        setIsInviteDialogOpen(false);
        setInviteEmail("");
        setSelectedDepartment("");
        toast({
            title: "Invitation Sent",
            description: `An invitation has been sent to ${inviteEmail}.`,
        });
    };

    const handleStatusChange = (id: string, newStatus: Instructor['status']) => {
        setInstructors(instructors.map(inst =>
            inst.id === id ? { ...inst, status: newStatus } : inst
        ));
        toast({
            title: "Status Updated",
            description: "Instructor status has been updated.",
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
            case "pending": return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
            case "suspended": return "bg-destructive/10 text-destructive hover:bg-destructive/20";
            default: return "bg-muted text-muted-foreground";
        }
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
                                <Users className="w-8 h-8 text-primary" />
                                Instructors
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Manage faculty members and teaching staff.
                            </p>
                        </div>
                        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="shadow-glow-primary gradient-primary text-white border-0">
                                    <Mail className="w-4 h-4 mr-2" /> Invite Instructor
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Invite New Instructor</DialogTitle>
                                    <DialogDescription>
                                        Send an invitation email to add a new instructor to your university.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="instructor@university.edu"
                                            value={inviteEmail}
                                            onChange={(e) => setInviteEmail(e.target.value)}
                                            className="focus-visible:ring-primary bg-background/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="department">Department</Label>
                                        <Input
                                            id="department"
                                            placeholder="e.g. Computer Science"
                                            value={selectedDepartment}
                                            onChange={(e) => setSelectedDepartment(e.target.value)}
                                            className="focus-visible:ring-primary bg-background/50"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>Cancel</Button>
                                    <Button onClick={handleInvite} className="gradient-primary text-white shadow-glow-primary border-0">Send Invitation</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
                        <Card className="border-border/50 shadow-soft hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Instructors</p>
                                    <h3 className="text-2xl font-bold text-foreground">{instructors.length}</h3>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-border/50 shadow-soft hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-green-500/10 text-green-500">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Active Faculty</p>
                                    <h3 className="text-2xl font-bold text-foreground">
                                        {instructors.filter(i => i.status === 'active').length}
                                    </h3>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-border/50 shadow-soft hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
                                    <Star className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                                    <h3 className="text-2xl font-bold text-foreground">
                                        {(instructors.reduce((acc, curr) => acc + curr.rating, 0) / instructors.filter(i => i.rating > 0).length || 0).toFixed(1)}
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
                                placeholder="Search instructors..."
                                className="pl-9 bg-background/50 focus-visible:ring-primary"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="bg-card rounded-xl border border-border/50 shadow-soft overflow-hidden animate-slide-up" style={{ animationDelay: "300ms" }}>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30 hover:bg-muted/30">
                                    <TableHead>Instructor</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Performance</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredInstructors.map((instructor) => (
                                    <TableRow key={instructor.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-10 h-10 border-2 border-background shadow-sm">
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${instructor.name}`} />
                                                    <AvatarFallback>{instructor.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{instructor.name}</p>
                                                    <p className="text-xs text-muted-foreground">{instructor.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-xs font-normal">
                                                {instructor.department}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={cn("text-xs capitalize", getStatusColor(instructor.status))} variant="secondary">
                                                {instructor.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md">
                                                    <BookOpen className="w-3 h-3" /> {instructor.courses} Courses
                                                </span>
                                                {instructor.rating > 0 && (
                                                    <span className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-md">
                                                        <Star className="w-3 h-3 fill-current" /> {instructor.rating}
                                                    </span>
                                                )}
                                            </div>
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
                                                    {instructor.status === 'active' ? (
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive"
                                                            onClick={() => handleStatusChange(instructor.id, 'suspended')}
                                                        >
                                                            <Ban className="w-4 h-4 mr-2" />
                                                            Suspend Account
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem
                                                            className="text-green-600 focus:text-green-600"
                                                            onClick={() => handleStatusChange(instructor.id, 'active')}
                                                        >
                                                            <CheckCircle2 className="w-4 h-4 mr-2" />
                                                            Activate Account
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UniversityInstructors;
