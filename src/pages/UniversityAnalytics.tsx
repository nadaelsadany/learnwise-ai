import { useState } from "react";
import { UniversitySidebar, UniversitySidebarContent } from "@/components/layout/UniversitySidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, DollarSign, BookOpen } from "lucide-react";

// Mock Data
const enrollmentData = [
    { name: 'Jan', students: 400 },
    { name: 'Feb', students: 300 },
    { name: 'Mar', students: 550 },
    { name: 'Apr', students: 450 },
    { name: 'May', students: 600 },
    { name: 'Jun', students: 750 },
];

const departmentPerformance = [
    { name: 'CS', score: 85 },
    { name: 'Business', score: 78 },
    { name: 'Eng', score: 82 },
    { name: 'Arts', score: 75 },
    { name: 'Physics', score: 88 },
];

const revenueDistribution = [
    { name: 'Tuition', value: 400000, color: '#8884d8' },
    { name: 'Grants', value: 300000, color: '#82ca9d' },
    { name: 'Donations', value: 100000, color: '#ffc658' },
    { name: 'Other', value: 50000, color: '#ff8042' },
];

const UniversityAnalytics = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
                            <TrendingUp className="w-8 h-8 text-primary" />
                            Analytics
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Insights and reports on university performance.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {/* Enrollment Trends */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Enrollment Trends</CardTitle>
                                <CardDescription>Monthly student enrollment growth</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={enrollmentData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="students" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Department Performance */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Department Satisfaction</CardTitle>
                                <CardDescription>Average student satisfaction scores</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={departmentPerformance}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="score" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Revenue Distribution */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Revenue Sources</CardTitle>
                                <CardDescription>Annual revenue breakdown</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={revenueDistribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {revenueDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="mt-4 flex flex-wrap gap-4 justify-center">
                                    {revenueDistribution.map((entry) => (
                                        <div key={entry.name} className="flex items-center gap-2 text-sm">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                                            <span>{entry.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Key Metrics */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Key Performance Indicators</CardTitle>
                                <CardDescription>Year-to-date metrics</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                                <div className="bg-primary/5 p-4 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2 text-primary">
                                        <Users className="w-5 h-5" />
                                        <span className="font-medium">Retention</span>
                                    </div>
                                    <p className="text-2xl font-bold">94%</p>
                                    <p className="text-xs text-muted-foreground">+2.5% vs last year</p>
                                </div>
                                <div className="bg-accent/5 p-4 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2 text-accent">
                                        <BookOpen className="w-5 h-5" />
                                        <span className="font-medium">Course Completion</span>
                                    </div>
                                    <p className="text-2xl font-bold">87%</p>
                                    <p className="text-xs text-muted-foreground">+5.1% vs last year</p>
                                </div>
                                <div className="bg-green-500/5 p-4 rounded-xl col-span-2">
                                    <div className="flex items-center gap-2 mb-2 text-green-600">
                                        <DollarSign className="w-5 h-5" />
                                        <span className="font-medium">Total Grants</span>
                                    </div>
                                    <p className="text-2xl font-bold">$2.4M</p>
                                    <p className="text-xs text-muted-foreground">12 active grants</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UniversityAnalytics;
