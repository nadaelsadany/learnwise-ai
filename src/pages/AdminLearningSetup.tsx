import { useState } from "react";
import { AdminSidebar, AdminSidebarContent } from "@/components/layout/AdminSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    GraduationCap, Plus, Search, BookOpen, Compass, ShieldAlert, Trash2, Edit2, Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type PathTemplate = {
    id: string;
    name: string;
    description: string;
    coursesCount: number;
    estimatedTime: string;
};

type RoleMapping = {
    id: string;
    roleName: string;
    pathName: string;
    timelineDays: number;
    requiredScore: number;
};

const initialTemplates: PathTemplate[] = [
    { id: "tp1", name: "Sales Excellence Path", description: "Advanced communication, negotiation skills, and pipeline management tools.", coursesCount: 3, estimatedTime: "12 hours" },
    { id: "tp2", name: "Engineering Core Essentials", description: "Solid programming practices, framework fundamentals, and testing workflows.", coursesCount: 4, estimatedTime: "18 hours" },
    { id: "tp3", name: "Leadership Bootcamp", description: "Effective management coaching, team leading and resolution frameworks.", coursesCount: 2, estimatedTime: "8 hours" },
    { id: "tp4", name: "Corporate Onboarding", description: "Acme company policies, core values, system guidelines and workspace setup.", coursesCount: 2, estimatedTime: "4 hours" },
];

const initialMappings: RoleMapping[] = [
    { id: "m1", roleName: "Sales Executive", pathName: "Sales Excellence Path", timelineDays: 30, requiredScore: 80 },
    { id: "m2", roleName: "Software Engineer", pathName: "Engineering Core Essentials", timelineDays: 45, requiredScore: 85 },
    { id: "m3", roleName: "QA Specialist", pathName: "Engineering Core Essentials", timelineDays: 30, requiredScore: 80 },
    { id: "m4", roleName: "HR Generalist", pathName: "Leadership Bootcamp", timelineDays: 60, requiredScore: 75 },
];

export default function AdminLearningSetup() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [templates, setTemplates] = useState<PathTemplate[]>(initialTemplates);
    const [mappings, setMappings] = useState<RoleMapping[]>(initialMappings);

    // Dialog states
    const [isPathOpen, setIsPathOpen] = useState(false);
    const [isMapOpen, setIsMapOpen] = useState(false);

    // Form inputs
    const [newPath, setNewPath] = useState({ name: "", description: "", coursesCount: 2, estimatedTime: "6 hours" });
    const [newMap, setNewMap] = useState({ roleName: "Software Engineer", pathName: "Engineering Core Essentials", timelineDays: 30, requiredScore: 80 });

    const { toast } = useToast();

    const handleCreatePath = () => {
        if (!newPath.name || !newPath.description) {
            toast({ variant: "destructive", title: "Missing fields" });
            return;
        }
        const created: PathTemplate = {
            id: Date.now().toString(),
            name: newPath.name,
            description: newPath.description,
            coursesCount: Number(newPath.coursesCount),
            estimatedTime: newPath.estimatedTime
        };
        setTemplates([...templates, created]);
        setIsPathOpen(false);
        setNewPath({ name: "", description: "", coursesCount: 2, estimatedTime: "6 hours" });
        toast({ title: "Template Created", description: `"${created.name}" template is ready for role assignment.` });
    };

    const handleCreateMapping = () => {
        const created: RoleMapping = {
            id: Date.now().toString(),
            roleName: newMap.roleName,
            pathName: newMap.pathName,
            timelineDays: Number(newMap.timelineDays),
            requiredScore: Number(newMap.requiredScore)
        };
        setMappings([...mappings, created]);
        setIsMapOpen(false);
        toast({ title: "Role Mapped Successfully", description: `Linked "${newMap.roleName}" to "${newMap.pathName}".` });
    };

    const handleDeletePath = (id: string) => {
        setTemplates(prev => prev.filter(t => t.id !== id));
        toast({ title: "Template Removed" });
    };

    const handleDeleteMapping = (id: string) => {
        setMappings(prev => prev.filter(m => m.id !== id));
        toast({ title: "Role Mapping Cleared" });
    };

    return (
        <div className="min-h-screen bg-background">
            <AdminSidebar onCollapse={setSidebarCollapsed} />
            <Header sidebarCollapsed={sidebarCollapsed} userRole="Admin" mobileSidebar={<AdminSidebarContent collapsed={false} />} />

            <main className={cn("pt-20 pb-12 px-4 sm:px-6 transition-all duration-300", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64")}>
                <div className="max-w-7xl mx-auto space-y-6">
                    <div>
                        <h1 className="text-3xl font-black">Learning Configuration</h1>
                        <p className="text-muted-foreground text-sm mt-1">Design learning paths and automate course mapping for company job roles</p>
                    </div>

                    <Tabs defaultValue="paths" className="w-full">
                        <TabsList className="grid w-full sm:w-[360px] grid-cols-2 mb-6 bg-muted/60 p-1 rounded-xl">
                            <TabsTrigger value="paths" className="rounded-lg flex items-center gap-2"><Compass className="w-4 h-4" /> Career Paths</TabsTrigger>
                            <TabsTrigger value="mappings" className="rounded-lg flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Role Assignments</TabsTrigger>
                        </TabsList>

                        {/* CAREER PATH TEMPLATES */}
                        <TabsContent value="paths" className="space-y-6 animate-in fade-in duration-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-foreground">Standard Training Templates</h3>
                                <Dialog open={isPathOpen} onOpenChange={setIsPathOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-rose-500 hover:bg-rose-600 text-white border-0">
                                            <Plus className="w-4 h-4 mr-2" /> New Career Path
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Create Career Path Template</DialogTitle>
                                            <DialogDescription>Define a curriculum standard for roles to complete.</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label>Path Name</Label>
                                                <Input placeholder="e.g. QA Automation Expert" value={newPath.name} onChange={(e) => setNewPath({...newPath, name: e.target.value})} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Description</Label>
                                                <Input placeholder="What skills will this path cover?" value={newPath.description} onChange={(e) => setNewPath({...newPath, description: e.target.value})} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Courses Count</Label>
                                                    <Input type="number" value={newPath.coursesCount} onChange={(e) => setNewPath({...newPath, coursesCount: Number(e.target.value)})} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Est. Duration</Label>
                                                    <Input placeholder="e.g. 10 hours" value={newPath.estimatedTime} onChange={(e) => setNewPath({...newPath, estimatedTime: e.target.value})} />
                                                </div>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsPathOpen(false)}>Cancel</Button>
                                            <Button onClick={handleCreatePath} className="bg-rose-500 hover:bg-rose-600 text-white border-0">Save Path</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {templates.map((tpl) => (
                                    <Card key={tpl.id} className="border-border/50 hover:border-rose-300/30 transition-all flex flex-col justify-between">
                                        <CardHeader className="pb-2">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                                                        <BookOpen className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-base font-bold">{tpl.name}</CardTitle>
                                                        <CardDescription className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                                                            <Calendar className="w-3.5 h-3.5" /> Est. {tpl.estimatedTime} · {tpl.coursesCount} courses
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive w-8 h-8" onClick={() => handleDeletePath(tpl.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-2">
                                            <p className="text-sm text-muted-foreground">{tpl.description}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {/* ROLE MAPPINGS */}
                        <TabsContent value="mappings" className="space-y-6 animate-in fade-in duration-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-foreground">Active Role assignments</h3>
                                <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-rose-500 hover:bg-rose-600 text-white border-0">
                                            <Plus className="w-4 h-4 mr-2" /> Map Role to Path
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Map Role to Career Path</DialogTitle>
                                            <DialogDescription>Assign a career template to an organization job role automatically.</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label>Target Job Role</Label>
                                                <Select value={newMap.roleName} onValueChange={(val) => setNewMap({...newMap, roleName: val})}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {["Software Engineer", "QA Specialist", "Sales Executive", "HR Generalist", "Financial Analyst"].map((role) => (
                                                            <SelectItem key={role} value={role}>{role}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Target Career Path</Label>
                                                <Select value={newMap.pathName} onValueChange={(val) => setNewMap({...newMap, pathName: val})}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {templates.map((tpl) => (
                                                            <SelectItem key={tpl.id} value={tpl.name}>{tpl.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Completion Timeline (Days)</Label>
                                                    <Input type="number" value={newMap.timelineDays} onChange={(e) => setNewMap({...newMap, timelineDays: Number(e.target.value)})} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Min Required Assessment Score %</Label>
                                                    <Input type="number" value={newMap.requiredScore} onChange={(e) => setNewMap({...newMap, requiredScore: Number(e.target.value)})} />
                                                </div>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsMapOpen(false)}>Cancel</Button>
                                            <Button onClick={handleCreateMapping} className="bg-rose-500 hover:bg-rose-600 text-white border-0">Map Assignment</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <Card className="border-border/50">
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border/50 bg-muted/30">
                                                    <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Job Role</th>
                                                    <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Assigned Career Path</th>
                                                    <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Target Timeline</th>
                                                    <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Req. Score</th>
                                                    <th className="px-5 py-3" />
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {mappings.map((m) => (
                                                    <tr key={m.id} className="border-b border-border/30 hover:bg-muted/10 transition-colors">
                                                        <td className="px-5 py-3.5 font-bold">{m.roleName}</td>
                                                        <td className="px-5 py-3.5 text-muted-foreground">
                                                            <Badge className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border-0">{m.pathName}</Badge>
                                                        </td>
                                                        <td className="px-5 py-3.5 font-medium">{m.timelineDays} Days</td>
                                                        <td className="px-5 py-3.5 font-mono text-emerald-600 font-semibold">{m.requiredScore}%</td>
                                                        <td className="px-5 py-3.5 text-right">
                                                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive w-8 h-8" onClick={() => handleDeleteMapping(m.id)}>
                                                                    <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}
