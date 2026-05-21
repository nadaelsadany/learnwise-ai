import { useState } from "react";
import { HRSidebar, HRSidebarContent } from "@/components/layout/HRSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search, Filter, Mail, MoreHorizontal, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const HREmployees = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    
    const employees = [
        { id: 1, name: "Alex Johnson", role: "Frontend Dev", dept: "Engineering", courses: 4, progress: 85, status: "Active" },
        { id: 2, name: "Sarah Miller", role: "UI Designer", dept: "Product", courses: 2, progress: 45, status: "At Risk" },
        { id: 3, name: "Michael Chen", role: "Backend Lead", dept: "Engineering", courses: 6, progress: 92, status: "Active" },
        { id: 4, name: "Emma Wilson", role: "HR Coordinator", dept: "Human Resources", courses: 3, progress: 60, status: "Active" },
    ];

    return (
        <div className="min-h-screen bg-background">
            <HRSidebar onCollapse={setSidebarCollapsed} />
            <Header
                sidebarCollapsed={sidebarCollapsed}
                userRole="HR Manager"
                mobileSidebar={<HRSidebarContent collapsed={false} />}
            />
            <main className={cn("pt-20 pb-12 px-4 sm:px-6 transition-all duration-300", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64")}>
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-black tracking-tight">Employee Directory</h1>
                            <p className="text-muted-foreground text-sm">Manage and track learning progress for your entire workforce.</p>
                        </div>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            <Users className="w-4 h-4 mr-2" /> Add New Employee
                        </Button>
                    </div>

                    <Card className="border-border/50 shadow-soft overflow-hidden">
                        <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
                            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                                <div className="relative w-full sm:w-96">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input placeholder="Search by name, role or department..." className="pl-9 bg-background border-border/50 rounded-xl" />
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <Button variant="outline" size="sm" className="rounded-xl gap-2">
                                        <Filter className="w-4 h-4" /> Filters
                                    </Button>
                                    <Badge variant="secondary" className="rounded-lg px-2 py-1 font-bold">{employees.length} Total</Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-muted/10 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/50">
                                            <th className="px-6 py-4">Employee</th>
                                            <th className="px-6 py-4">Department</th>
                                            <th className="px-6 py-4">Learning Progress</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employees.map((emp) => (
                                            <tr key={emp.id} className="group hover:bg-muted/30 transition-colors border-b border-border/50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="w-9 h-9 border border-border/50">
                                                            <AvatarFallback className="bg-indigo-50 text-indigo-600 font-bold">{emp.name[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="text-sm font-bold">{emp.name}</p>
                                                            <p className="text-[10px] text-muted-foreground">{emp.role}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="outline" className="text-[10px] font-bold border-indigo-200 text-indigo-600 bg-indigo-50/50">
                                                        {emp.dept}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="w-48">
                                                        <div className="flex items-center justify-between text-[10px] mb-1 font-bold">
                                                            <span>{emp.courses} Courses</span>
                                                            <span className="text-indigo-600">{emp.progress}%</span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${emp.progress}%` }} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant={emp.status === "At Risk" ? "destructive" : "default"} className="text-[10px]">
                                                        {emp.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg"><Mail className="w-4 h-4" /></Button>
                                                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg"><MoreHorizontal className="w-4 h-4" /></Button>
                                                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-indigo-600"><ChevronRight className="w-4 h-4" /></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default HREmployees;
