import { useState } from "react";
import { UniversitySidebar, UniversitySidebarContent } from "@/components/layout/UniversitySidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const data = [
    { name: 'Jan', students: 400, revenue: 24000 },
    { name: 'Feb', students: 300, revenue: 13980 },
    { name: 'Mar', students: 200, revenue: 9800 },
    { name: 'Apr', students: 278, revenue: 39080 },
    { name: 'May', students: 189, revenue: 4800 },
    { name: 'Jun', students: 239, revenue: 38000 },
    { name: 'Jul', students: 349, revenue: 43000 },
];

const pieData = [
    { name: 'Freshman', value: 400 },
    { name: 'Sophomore', value: 300 },
    { name: 'Junior', value: 300 },
    { name: 'Senior', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
                    <div className="animate-slide-up">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                            Analytics & Reports
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            In-depth insights into university performance, student enrollment, and financial data.
                        </p>
                    </div>

                    <Tabs defaultValue="enrollment" className="animate-slide-up" style={{ animationDelay: "100ms" }}>
                        <TabsList className="bg-card border border-border/50 shadow-sm p-1 rounded-xl mb-6">
                            <TabsTrigger value="enrollment" className="rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Enrollment</TabsTrigger>
                            <TabsTrigger value="academic" className="rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Academic Performance</TabsTrigger>
                            <TabsTrigger value="financial" className="rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Financials</TabsTrigger>
                        </TabsList>

                        <TabsContent value="enrollment" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="border-border/50 shadow-soft hover:shadow-lg transition-all">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Enrollment</CardTitle>
                                        <CardTitle className="text-3xl font-bold text-primary">2,450</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-sm text-green-600 flex items-center gap-1">
                                            <TrendingUp className="w-4 h-4" /> +12% from last semester
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-border/50 shadow-soft hover:shadow-lg transition-all">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">New Applications</CardTitle>
                                        <CardTitle className="text-3xl font-bold text-accent">850</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-sm text-green-600 flex items-center gap-1">
                                            <TrendingUp className="w-4 h-4" /> +5% from last year
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-border/50 shadow-soft hover:shadow-lg transition-all">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">Course Completion Rate</CardTitle>
                                        <CardTitle className="text-3xl font-bold text-blue-500">94%</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-sm text-green-600 flex items-center gap-1">
                                            <TrendingUp className="w-4 h-4" /> +2% improvement
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card className="border-border/50 shadow-soft">
                                <CardHeader>
                                    <CardTitle>Enrollment Trends</CardTitle>
                                    <CardDescription>Monthly student enrollment numbers over the academic year.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={data}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                            <Tooltip
                                                cursor={{ fill: '#f3f4f6' }}
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            />
                                            <Bar dataKey="students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="academic" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card className="border-border/50 shadow-soft">
                                    <CardHeader>
                                        <CardTitle>Department GPA Average</CardTitle>
                                        <CardDescription>Average GPA across major departments.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-[350px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={[
                                                { name: 'CS', gpa: 3.5, color: '#3b82f6' },
                                                { name: 'Business', gpa: 3.2, color: '#10b981' },
                                                { name: 'Eng', gpa: 3.4, color: '#f59e0b' },
                                                { name: 'Arts', gpa: 3.6, color: '#8b5cf6' },
                                                { name: 'Physics', gpa: 3.8, color: '#ef4444' },
                                            ]}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                                <YAxis domain={[0, 4]} axisLine={false} tickLine={false} />
                                                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px' }} />
                                                <Bar dataKey="gpa" radius={[4, 4, 0, 0]}>
                                                    {
                                                        [
                                                            { name: 'CS', gpa: 3.5, color: '#3b82f6' },
                                                            { name: 'Business', gpa: 3.2, color: '#10b981' },
                                                            { name: 'Eng', gpa: 3.4, color: '#8b5cf6' }, // Used accent color
                                                            { name: 'Arts', gpa: 3.6, color: '#f59e0b' },
                                                            { name: 'Physics', gpa: 3.8, color: '#ec4899' },
                                                        ].map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))
                                                    }
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                <Card className="border-border/50 shadow-soft">
                                    <CardHeader>
                                        <CardTitle>Student Distribution</CardTitle>
                                        <CardDescription>Students by year level.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-[350px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={pieData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={80}
                                                    outerRadius={110}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {pieData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="flex justify-center gap-4 mt-4">
                                            {pieData.map((entry, index) => (
                                                <div key={entry.name} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                                    {entry.name}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="financial" className="space-y-6">
                            <Card className="border-border/50 shadow-soft">
                                <CardHeader>
                                    <CardTitle>Revenue Overview</CardTitle>
                                    <CardDescription>Monthly revenue from tuition and grants.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={data}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                            <YAxis axisLine={false} tickLine={false} />
                                            <Tooltip contentStyle={{ borderRadius: '8px' }} />
                                            <Line
                                                type="monotone"
                                                dataKey="revenue"
                                                stroke="hsl(var(--primary))"
                                                strokeWidth={3}
                                                dot={{ r: 4, fill: "hsl(var(--primary))" }}
                                                activeDot={{ r: 6 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
};

export default UniversityAnalytics;
