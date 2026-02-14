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
    students: number;
    status: "published" | "draft" | "under_review";
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
            students: 120,
            status: "published",
            lastUpdated: "2024-02-10"
        },
        {
            id: "2",
            title: "Advanced Marketing Strategies",
            instructor: "Prof. Mary Barra",
            department: "Business",
            students: 85,
            status: "published",
            lastUpdated: "2024-02-12"
        },
        {
            id: "3",
            title: "Thermodynamics II",
            instructor: "Dr. Elon Musk",
            department: "Engineering",
            students: 0,
            status: "under_review",
            lastUpdated: "2024-02-14"
        },
    ]);

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
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <BookOpen className="w-8 h-8 text-primary" />
                            Courses
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Oversee course catalog and curriculum standards.
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-4 bg-card p-4 rounded-lg border border-border/50 shadow-sm">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search courses..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Course Title</TableHead>
                                    <TableHead>Instructor</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Enrollment</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCourses.map((course) => (
                                    <TableRow key={course.id}>
                                        <TableCell className="font-medium">{course.title}</TableCell>
                                        <TableCell>{course.instructor}</TableCell>
                                        <TableCell>{course.department}</TableCell>
                                        <TableCell>{getStatusBadge(course.status)}</TableCell>
                                        <TableCell>{course.students} students</TableCell>
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
                                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                                    {course.status === 'under_review' && (
                                                        <>
                                                            <DropdownMenuItem
                                                                className="text-green-600"
                                                                onClick={() => handleStatusChange(course.id, 'published')}
                                                            >
                                                                <CheckCircle className="w-4 h-4 mr-2" /> Approve
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-destructive"
                                                                onClick={() => handleStatusChange(course.id, 'draft')}
                                                            >
                                                                <XCircle className="w-4 h-4 mr-2" /> Reject
                                                            </DropdownMenuItem>
                                                        </>
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
