import { useState } from "react";
import { AdminSidebar, AdminSidebarContent } from "@/components/layout/AdminSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    ListChecks, Users, BookOpen, Calendar, ToggleLeft,
    ToggleRight, CheckCircle2, Clock, Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

import { getAdminUsers, getEnrollableCourses, saveEnrollableCourses, addAdminActivity, EnrollableCourse } from "@/lib/adminData";

const AdminEnrollments = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [courses, setCourses] = useState<EnrollableCourse[]>(() => getEnrollableCourses());
    const { toast } = useToast();

    const allUsers = getAdminUsers().map(u => u.name);
    const allCourseNames = courses.map((c) => c.title);

    const [selectedCourse, setSelectedCourse] = useState<string>(allCourseNames[0] || "");
    const [selectedUser, setSelectedUser] = useState<string>("");
    const [deadline, setDeadline] = useState<string>("");
    const [search, setSearch] = useState("");

    const activeCourse = courses.find((c) => c.title === selectedCourse);

    const handleDirectAssign = () => {
        if (!selectedUser) { toast({ variant: "destructive", title: "Select a user first" }); return; }
        const updated = courses.map(c => c.title !== selectedCourse ? c : {
            ...c, enrolled: c.enrolled + 1,
            users: [...c.users, { id: Date.now(), name: selectedUser, team: "Unknown", progress: 0, dueDate: deadline || undefined }],
        });
        setCourses(updated);
        saveEnrollableCourses(updated);
        addAdminActivity(`Assigned course "${selectedCourse}" to ${selectedUser}`, "success");
        toast({ title: "Enrolled!", description: `${selectedUser} assigned to "${selectedCourse}".` });
        setSelectedUser("");
        setDeadline("");
    };

    const toggleOpenEnroll = (courseId: number) => {
        const updated = courses.map(c => c.id === courseId ? { ...c, openEnroll: !c.openEnroll } : c);
        setCourses(updated);
        saveEnrollableCourses(updated);
        const c = courses.find(c => c.id === courseId);
        if (c) {
            addAdminActivity(`Toggled open enrollment for "${c.title}" to ${!c.openEnroll ? "Enabled" : "Disabled"}`, "info");
        }
        toast({ title: `Open Enrollment ${c?.openEnroll ? "Disabled" : "Enabled"}`, description: `"${c?.title}" updated.` });
    };

    const filteredUsers = (activeCourse?.users ?? []).filter(u => u.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="min-h-screen bg-background">
            <AdminSidebar onCollapse={setSidebarCollapsed} />
            <Header sidebarCollapsed={sidebarCollapsed} userRole="Admin" mobileSidebar={<AdminSidebarContent collapsed={false} />} />
            <main className={cn("pt-20 pb-12 px-4 sm:px-6 transition-all duration-300", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64")}>
                <div className="max-w-7xl mx-auto space-y-6">
                    <div>
                        <h1 className="text-3xl font-black">Enrollment Management</h1>
                        <p className="text-muted-foreground text-sm mt-1">Assign courses directly or enable open enrollment</p>
                    </div>

                    <Tabs defaultValue="direct">
                        <TabsList className="mb-6">
                            <TabsTrigger value="direct" className="gap-2"><ListChecks className="w-4 h-4" />Direct Assignment</TabsTrigger>
                            <TabsTrigger value="open" className="gap-2"><ToggleRight className="w-4 h-4" />Open Enrollment</TabsTrigger>
                        </TabsList>

                        {/* Direct Assignment */}
                        <TabsContent value="direct" className="space-y-6">
                            <Card className="border-border/50">
                                <CardHeader><CardTitle className="text-base">Assign a Course</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Select User</label>
                                            <Select value={selectedUser} onValueChange={setSelectedUser}>
                                                <SelectTrigger><SelectValue placeholder="Choose employee…" /></SelectTrigger>
                                                <SelectContent>{allUsers.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Select Course</label>
                                            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>{allCourseNames.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Deadline (optional)</label>
                                            <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                                        </div>
                                    </div>
                                    <Button className="bg-rose-500 hover:bg-rose-600 text-white border-0" onClick={handleDirectAssign}>
                                        <CheckCircle2 className="w-4 h-4 mr-2" /> Assign Course
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Enrolled users for selected course */}
                            <Card className="border-border/50">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <Users className="w-4 h-4 text-rose-500" /> Enrolled in "{selectedCourse}"
                                        </CardTitle>
                                        <Badge variant="secondary">{activeCourse?.enrolled ?? 0} enrolled</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input className="pl-9" placeholder="Search enrolled users…" value={search} onChange={(e) => setSearch(e.target.value)} />
                                    </div>
                                    {filteredUsers.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No enrolled users yet.</p>}
                                    {filteredUsers.map((u) => (
                                        <div key={u.id} className="flex items-center gap-4">
                                            <div className="w-9 h-9 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold text-xs shrink-0">
                                                {u.name.split(" ").map(n => n[0]).join("")}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="font-medium text-sm">{u.name}</p>
                                                    <span className="text-xs font-semibold text-muted-foreground">{u.progress}%</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Progress value={u.progress} className="h-1.5 flex-1" />
                                                    {u.dueDate && (
                                                        <span className="text-xs text-muted-foreground flex items-center gap-0.5 shrink-0">
                                                            <Calendar className="w-3 h-3" />{u.dueDate}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Open Enrollment */}
                        <TabsContent value="open" className="space-y-4">
                            <p className="text-sm text-muted-foreground">Toggle open enrollment so employees can self-enroll in visible courses.</p>
                            {courses.map((course) => (
                                <Card key={course.id} className="border-border/50 hover:border-rose-300/40 transition-colors">
                                    <CardContent className="p-5 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                                            <BookOpen className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold">{course.title}</p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Users className="w-3 h-3" />{course.enrolled} enrolled
                                                {course.deadline && <><Clock className="w-3 h-3 ml-2" />Deadline: {course.deadline}</>}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={cn("text-xs font-semibold", course.openEnroll ? "text-emerald-600" : "text-muted-foreground")}>
                                                {course.openEnroll ? "Open" : "Closed"}
                                            </span>
                                            <Button variant="ghost" size="icon" className={cn("w-9 h-9", course.openEnroll ? "text-emerald-500 hover:text-emerald-600" : "text-muted-foreground hover:text-foreground")} onClick={() => toggleOpenEnroll(course.id)}>
                                                {course.openEnroll ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
};

export default AdminEnrollments;
