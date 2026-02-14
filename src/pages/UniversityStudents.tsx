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
import { useToast } from "@/hooks/use-toast";
import {
    GraduationCap,
    Search,
    MoreHorizontal,
    Mail,
    Filter,
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

interface Student {
    id: string;
    name: string;
    email: string;
    department: string;
    enrolledCourses: number;
    gpa: number;
    status: "active" | "inactive" | "graduated";
}

const UniversityStudents = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();

    // Mock Data
    const [students] = useState<Student[]>([
        {
            id: "1",
            name: "Alice Smith",
            email: "alice@student.edu",
            department: "Computer Science",
            enrolledCourses: 4,
            gpa: 3.8,
            status: "active"
        },
        {
            id: "2",
            name: "Bob Johnson",
            email: "bob@student.edu",
            department: "Business",
            enrolledCourses: 5,
            gpa: 3.5,
            status: "active"
        },
        {
            id: "3",
            name: "Charlie Brown",
            email: "charlie@student.edu",
            department: "Engineering",
            enrolledCourses: 3,
            gpa: 3.9,
            status: "graduated"
        },
    ]);

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
            case "graduated": return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
            case "inactive": return "bg-muted text-muted-foreground";
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
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                <GraduationCap className="w-8 h-8 text-primary" />
                                Students
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                View and manage student enrollments and records.
                            </p>
                        </div>
                        <Button variant="outline">
                            <Mail className="w-4 h-4 mr-2" /> Email All Students
                        </Button>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-4 bg-card p-4 rounded-lg border border-border/50 shadow-sm">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search students..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline">
                            <Filter className="w-4 h-4 mr-2" /> Filter
                        </Button>
                    </div>

                    <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Academic Standing</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStudents.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${student.name}`} />
                                                    <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{student.name}</p>
                                                    <p className="text-xs text-muted-foreground">{student.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{student.department}</TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(student.status)} variant="secondary">
                                                {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <span className="font-medium">GPA: {student.gpa}</span>
                                                <span className="text-muted-foreground mx-2">•</span>
                                                <span className="text-muted-foreground">{student.enrolledCourses} Courses</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                    <DropdownMenuItem>Academic Transcript</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">Expel Student</DropdownMenuItem>
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

export default UniversityStudents;
