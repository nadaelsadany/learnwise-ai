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
    BookOpen,
    Search,
    MoreHorizontal,
    CheckCircle,
    XCircle,
    Clock
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

interface Course {
    id: string;
    title: string;
    instructor: string;
    department: string;
    enrolledStudents: number;
    status: "active" | "pending_approval" | "archived";
    lastUpdated: string;
}

const UniversityCourses = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();

    // Mock Data
    const [courses, setCourses] = useState<Course[]>([
        {
            id: "1",
            title: "Introduction to Computer Science",
            instructor: "Dr. Alan Turing",
            department: "Computer Science",
            enrolledStudents: 120,
            status: "active",
            lastUpdated: "2024-02-10"
        },
        {
            id: "2",
            title: "Advanced Marketing Strategies",
            instructor: "Prof. Mary Barra",
            department: "Business",
            enrolledStudents: 85,
            status: "active",
            lastUpdated: "2024-02-12"
        },
        {
            id: "3",
            title: "Thermodynamics II",
            instructor: "Dr. Elon Musk",
            department: "Engineering",
            enrolledStudents: 0,
            status: "pending_approval",
            lastUpdated: "2024-02-14"
        },
    ]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
            case "pending_approval":
                return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
            case "archived":
                return "bg-muted text-muted-foreground hover:bg-muted/80";
            default:
                return "bg-secondary text-secondary-foreground";
        }
    };

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleStatusChange = (id: string, newStatus: Course['status']) => {
        setCourses(courses.map(c =>
            c.id === id ? { ...c, status: newStatus } : c
        ));
        toast({
            title: "Course Updated",
            description: `Course status changed to ${newStatus.replace('_', ' ')}.`,
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "published":
                return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20"><CheckCircle className="w-3 h-3 mr-1" /> Published</Badge>;
            case "under_review":
                return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"><Clock className="w-3 h-3 mr-1" /> Under Review</Badge>;
            case "draft":
                return <Badge variant="secondary"><MoreHorizontal className="w-3 h-3 mr-1" /> Draft</Badge>;
            default: return null;
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
                                <BookOpen className="w-8 h-8 text-primary" />
                                Course Catalog
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Oversee all courses offered across departments.
                            </p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border/50 shadow-soft animate-slide-up" style={{ animationDelay: "100ms" }}>
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search courses..."
                                className="pl-9 bg-background/50 focus-visible:ring-primary"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline">
                            Filter
                        </Button>
                    </div>

                    <div className="bg-card rounded-xl border border-border/50 shadow-soft overflow-hidden animate-slide-up" style={{ animationDelay: "200ms" }}>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30 hover:bg-muted/30">
                                    <TableHead>Course Title</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Instructor</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Students</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCourses.map((course) => (
                                    <TableRow key={course.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                                                    <BookOpen className="w-4 h-4" />
                                                </div>
                                                {course.title}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-xs font-normal">
                                                {course.department}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{course.instructor}</TableCell>
                                        <TableCell>
                                            <Badge className={cn("text-xs capitalize", getStatusColor(course.status))} variant="secondary">
                                                {course.status.replace('_', ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{course.enrolledStudents}</TableCell>
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
                                                    <DropdownMenuItem>View Syllabus</DropdownMenuItem>
                                                    {course.status === 'pending_approval' && (
                                                        <>
                                                            <DropdownMenuItem
                                                                className="text-green-600 focus:text-green-600"
                                                                onClick={() => handleStatusChange(course.id, 'active')}
                                                            >
                                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                                Approve Course
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() => handleStatusChange(course.id, 'archived')}
                                                            >
                                                                <XCircle className="w-4 h-4 mr-2" />
                                                                Reject Course
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                    {course.status === 'active' && (
                                                        <DropdownMenuItem
                                                            className="text-muted-foreground focus:text-muted-foreground"
                                                            onClick={() => handleStatusChange(course.id, 'archived')}
                                                        >
                                                            <Clock className="w-4 h-4 mr-2" />
                                                            Archive Course
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

export default UniversityCourses;
