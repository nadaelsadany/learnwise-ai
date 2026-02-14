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
    AlertTriangle,
    BarChart3,
    ArrowRight
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

    const departmentStats = [
        { name: "Computer Science", head: "Dr. Alan Turing", courses: 45, students: 420, budget: "$50,000", performance: 92 },
        { name: "Business Administration", head: "Prof. Mary Barra", courses: 38, students: 350, budget: "$45,000", performance: 88 },
        { name: "Design & Arts", head: "Sarah Chen", courses: 25, students: 180, budget: "$30,000", performance: 95 },
        { name: "Physics", head: "Dr. Richard Feynman", courses: 18, students: 120, budget: "$35,000", performance: 85 },
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
                    <div className="animate-slide-up flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                                University Overview
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Welcome back. Here's what's happening across the campus today.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button className="shadow-glow-primary gradient-primary text-white border-0">
                                <Plus className="w-4 h-4 mr-2" /> Add Department
                            </Button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
                        <div className="shadow-soft hover:shadow-lg transition-all duration-300 rounded-xl">
                            <StatsCard
                                title="Total Students"
                                value={stats.totalStudents}
                                icon={GraduationCap}
                                variant="default"
                                trend={{ value: 12, positive: true }}
                            />
                        </div>
                        <div className="shadow-soft hover:shadow-lg transition-all duration-300 rounded-xl">
                            <StatsCard
                                title="Active Instructors"
                                value={stats.activeInstructors}
                                icon={Users}
                                variant="default"
                                trend={{ value: 5, positive: true }}
                            />
                        </div>
                        <div className="shadow-soft hover:shadow-lg transition-all duration-300 rounded-xl">
                            <StatsCard
                                title="Total Courses"
                                value={stats.totalCourses}
                                icon={BookOpen}
                                variant="default"
                                trend={{ value: 8, positive: false }}
                            />
                        </div>
                        <div className="shadow-soft hover:shadow-lg transition-all duration-300 rounded-xl">
                            <StatsCard
                                title="Total Revenue"
                                value={stats.revenue}
                                icon={DollarSign}
                                variant="accent"
                                trend={{ value: 15, positive: true }}
                            />
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
                        {/* Department Performance */}
                        <Card className="lg:col-span-2 border-border/50 shadow-soft hover:shadow-md transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-primary" />
                                    Department Performance
                                </CardTitle>
                                <CardDescription>Top performing departments by student satisfaction</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-muted/50 bg-muted/20">
                                            <TableHead>Department</TableHead>
                                            <TableHead>Head</TableHead>
                                            <TableHead className="text-right">Students</TableHead>
                                            <TableHead className="text-right">Performance</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {departmentStats.map((dept) => (
                                            <TableRow key={dept.name} className="hover:bg-muted/30 transition-colors">
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                            <Building2 className="w-4 h-4" />
                                                        </div>
                                                        {dept.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{dept.head}</TableCell>
                                                <TableCell className="text-right">{dept.students}</TableCell>
                                                <TableCell className="text-right">
                                                    <Badge variant="outline" className={cn(
                                                        "bg-green-500/10 text-green-600 border-green-200 dark:border-green-800",
                                                        dept.performance < 90 && "bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-800"
                                                    )}>
                                                        {dept.performance}%
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Recent Activity / Notifications */}
                        <Card className="border-border/50 shadow-soft hover:shadow-md transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                                    System Alerts
                                </CardTitle>
                                <CardDescription>Critical updates and notifications</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-3 items-start p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50 cursor-pointer">
                                    <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center shrink-0">
                                        <TrendingUp className="w-4 h-4 text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">High Server Load</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Server usage peaked at 85% during exam hours.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 items-start p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50 cursor-pointer">
                                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center shrink-0">
                                        <DollarSign className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Budget Approved</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Q3 budget allocation has been approved.</p>
                                    </div>
                                </div>
                                <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-primary hover:bg-primary/5">
                                    View All Logs <ArrowRight className="w-3 h-3 ml-1" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UniversityDashboard;

