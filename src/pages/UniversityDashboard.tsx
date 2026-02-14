import { useState } from "react";
import { UniversitySidebar, UniversitySidebarContent } from "@/components/layout/UniversitySidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/StatsCard";
import {
    Users,
    GraduationCap,
    BookOpen,
    DollarSign,
    TrendingUp,
    Building2,
    Plus,
    MoreHorizontal
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const UniversityDashboard = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Mock Data
    const stats = {
        totalStudents: 1250,
        activeInstructors: 42,
        totalCourses: 156,
        revenue: 250000
    };

    const recentDepts = [
        { name: "Computer Science", head: "Dr. Alan Turing", courses: 45, students: 420, budget: "$50,000" },
        { name: "Business Administration", head: "Prof. Mary Barra", courses: 38, students: 350, budget: "$45,000" },
        { name: "Design & Arts", head: "Sarah Chen", courses: 25, students: 180, budget: "$30,000" },
        { name: "Physics", head: "Dr. Richard Feynman", courses: 18, students: 120, budget: "$35,000" },
    ];

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
                    {/* Welcome Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                <Building2 className="w-8 h-8 text-primary" />
                                University Overview
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Welcome back, Administrator. Here's what's happening today.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" /> Add Department
                            </Button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatsCard
                            title="Total Students"
                            value={stats.totalStudents}
                            icon={GraduationCap}
                            variant="primary"
                            trend={{ value: 12, positive: true }}
                        />
                        <StatsCard
                            title="Active Instructors"
                            value={stats.activeInstructors}
                            icon={Users}
                            variant="default"
                            trend={{ value: 5, positive: true }}
                        />
                        <StatsCard
                            title="Total Courses"
                            value={stats.totalCourses}
                            icon={BookOpen}
                            variant="accent"
                            trend={{ value: 8, positive: true }}
                        />
                        <StatsCard
                            title="Revenue (YTD)"
                            value={`$${stats.revenue.toLocaleString()}`}
                            icon={DollarSign}
                            variant="success"
                            trend={{ value: 15, positive: true }}
                        />
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Department Performance */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Department Performance</CardTitle>
                                <CardDescription>Overview of key metrics by department.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Department</TableHead>
                                            <TableHead>Head</TableHead>
                                            <TableHead>Courses</TableHead>
                                            <TableHead>Students</TableHead>
                                            <TableHead className="text-right">Budget</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentDepts.map((dept) => (
                                            <TableRow key={dept.name}>
                                                <TableCell className="font-medium">{dept.name}</TableCell>
                                                <TableCell>{dept.head}</TableCell>
                                                <TableCell>{dept.courses}</TableCell>
                                                <TableCell>{dept.students}</TableCell>
                                                <TableCell className="text-right">{dept.budget}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Recent Activity / Notifications */}
                        <Card>
                            <CardHeader>
                                <CardTitle>System Alerts</CardTitle>
                                <CardDescription>Recent system-wide notifications.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-3 items-start p-3 bg-muted/50 rounded-lg">
                                    <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center shrink-0">
                                        <TrendingUp className="w-4 h-4 text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">High Server Load</p>
                                        <p className="text-xs text-muted-foreground">Server usage peaked at 85% during exam hours.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 items-start p-3 bg-muted/50 rounded-lg">
                                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center shrink-0">
                                        <DollarSign className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Budget Approved</p>
                                        <p className="text-xs text-muted-foreground">Q3 budget allocation has been approved.</p>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full text-xs">View All Logs</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UniversityDashboard;
