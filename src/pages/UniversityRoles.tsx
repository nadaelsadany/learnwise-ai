import { useState } from "react";
import { UniversityPageLayout } from "@/components/layout/UniversityPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ShieldCheck, Users, Plus, Edit2, Crown, GraduationCap, BookOpen, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Role {
    id: string;
    name: string;
    description: string;
    icon: React.ElementType;
    color: string;
    userCount: number;
    permissions: { name: string; enabled: boolean }[];
}

const mockRoles: Role[] = [
    {
        id: "1", name: "University Admin", description: "Full access to all platform features and administrative tools",
        icon: Crown, color: "text-amber-500 bg-amber-500/10", userCount: 3,
        permissions: [
            { name: "Manage Users", enabled: true }, { name: "Manage Courses", enabled: true },
            { name: "View Analytics", enabled: true }, { name: "Manage Departments", enabled: true },
            { name: "Manage Enrollment", enabled: true }, { name: "System Settings", enabled: true },
        ],
    },
    {
        id: "2", name: "Department Admin", description: "Manage courses, instructors, and students within a department",
        icon: ShieldCheck, color: "text-primary bg-primary/10", userCount: 8,
        permissions: [
            { name: "Manage Users", enabled: false }, { name: "Manage Courses", enabled: true },
            { name: "View Analytics", enabled: true }, { name: "Manage Departments", enabled: false },
            { name: "Manage Enrollment", enabled: true }, { name: "System Settings", enabled: false },
        ],
    },
    {
        id: "3", name: "Instructor", description: "Create and manage courses, grade assignments, and track student progress",
        icon: BookOpen, color: "text-emerald-500 bg-emerald-500/10", userCount: 42,
        permissions: [
            { name: "Manage Users", enabled: false }, { name: "Manage Courses", enabled: true },
            { name: "View Analytics", enabled: true }, { name: "Manage Departments", enabled: false },
            { name: "Manage Enrollment", enabled: false }, { name: "System Settings", enabled: false },
        ],
    },
    {
        id: "4", name: "Teaching Assistant", description: "Assist instructors with grading, discussions, and content management",
        icon: UserCheck, color: "text-violet-500 bg-violet-500/10", userCount: 15,
        permissions: [
            { name: "Manage Users", enabled: false }, { name: "Manage Courses", enabled: false },
            { name: "View Analytics", enabled: true }, { name: "Manage Departments", enabled: false },
            { name: "Manage Enrollment", enabled: false }, { name: "System Settings", enabled: false },
        ],
    },
    {
        id: "5", name: "Student", description: "Access courses, submit assignments, take quizzes, and track learning progress",
        icon: GraduationCap, color: "text-sky-500 bg-sky-500/10", userCount: 1250,
        permissions: [
            { name: "Manage Users", enabled: false }, { name: "Manage Courses", enabled: false },
            { name: "View Analytics", enabled: false }, { name: "Manage Departments", enabled: false },
            { name: "Manage Enrollment", enabled: false }, { name: "System Settings", enabled: false },
        ],
    },
];

const UniversityRoles = () => {
    const [roles, setRoles] = useState(mockRoles);

    const togglePermission = (roleId: string, permName: string) => {
        setRoles(roles.map(r => r.id === roleId ? {
            ...r, permissions: r.permissions.map(p => p.name === permName ? { ...p, enabled: !p.enabled } : p)
        } : r));
    };

    return (
        <UniversityPageLayout>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                        </div>
                        Roles & Permissions
                    </h1>
                    <p className="text-muted-foreground mt-1">Define user roles and control access levels across the platform</p>
                </div>
                <Button className="gap-2"><Plus className="w-4 h-4" /> New Role</Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {roles.map(r => {
                    const Icon = r.icon;
                    return (
                        <Card key={r.id} className="border-border/50 text-center">
                            <CardContent className="p-4">
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2", r.color)}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <p className="text-sm font-bold">{r.name}</p>
                                <p className="text-xs text-muted-foreground">{r.userCount} users</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="space-y-4">
                {roles.map(role => {
                    const Icon = role.icon;
                    return (
                        <Card key={role.id} className="border-border/50">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", role.color)}>
                                            <Icon className="w-4.5 h-4.5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-sm">{role.name}</CardTitle>
                                            <p className="text-xs text-muted-foreground">{role.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">{role.userCount} users</Badge>
                                        <Button variant="ghost" size="icon"><Edit2 className="w-4 h-4" /></Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {role.permissions.map(perm => (
                                        <div key={perm.name} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30">
                                            <span className="text-xs font-medium">{perm.name}</span>
                                            <Switch checked={perm.enabled} onCheckedChange={() => togglePermission(role.id, perm.name)} />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </UniversityPageLayout>
    );
};

export default UniversityRoles;
