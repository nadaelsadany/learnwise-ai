import { useState } from "react";
import { UniversityPageLayout } from "@/components/layout/UniversityPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Megaphone, Plus, Users, BookOpen, Building2, Clock, Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Announcement {
    id: string;
    title: string;
    body: string;
    audience: "all" | "students" | "instructors" | "department" | "course";
    audienceDetail?: string;
    author: string;
    createdAt: string;
    pinned: boolean;
}

const mockAnnouncements: Announcement[] = [
    { id: "1", title: "Spring 2026 Registration Open", body: "Registration for Spring 2026 semester courses is now open. Please visit the enrollment portal to secure your spot.", audience: "all", author: "University Admin", createdAt: "2026-03-07", pinned: true },
    { id: "2", title: "Midterm Exam Schedule Published", body: "The midterm exam schedule for Fall 2025 has been published. Please check your course pages for specific dates and times.", audience: "students", author: "Academic Affairs", createdAt: "2026-03-06", pinned: true },
    { id: "3", title: "Faculty Meeting – March 15", body: "All instructors are required to attend the monthly faculty meeting on March 15 at 2:00 PM in the main auditorium.", audience: "instructors", author: "Dean's Office", createdAt: "2026-03-05", pinned: false },
    { id: "4", title: "CS Department Hackathon", body: "The Computer Science department is hosting a 48-hour hackathon on March 22-24. Registration is now open!", audience: "department", audienceDetail: "Computer Science", author: "CS Department", createdAt: "2026-03-04", pinned: false },
    { id: "5", title: "UI Design — Guest Lecture", body: "A guest lecture by a senior designer from Google will be held on March 18. All UI Design students are encouraged to attend.", audience: "course", audienceDetail: "UI Design", author: "Prof. Sara Khalil", createdAt: "2026-03-03", pinned: false },
];

const audienceIcon = { all: Users, students: Users, instructors: Users, department: Building2, course: BookOpen };
const audienceColor = {
    all: "text-primary border-primary/20 bg-primary/5",
    students: "text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20",
    instructors: "text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/20",
    department: "text-sky-600 border-sky-200 bg-sky-50 dark:bg-sky-950/20",
    course: "text-violet-600 border-violet-200 bg-violet-50 dark:bg-violet-950/20",
};

const UniversityAnnouncements = () => {
    const [announcements, setAnnouncements] = useState(mockAnnouncements);
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState({ title: "", body: "", audience: "all" });
    const { toast } = useToast();

    const handleCreate = () => {
        if (!form.title || !form.body) { toast({ variant: "destructive", title: "Missing fields" }); return; }
        setAnnouncements([{
            id: Date.now().toString(), title: form.title, body: form.body, audience: form.audience as Announcement["audience"],
            author: "University Admin", createdAt: new Date().toISOString().split("T")[0], pinned: false,
        }, ...announcements]);
        setIsOpen(false);
        setForm({ title: "", body: "", audience: "all" });
        toast({ title: "Announcement Published" });
    };

    const togglePin = (id: string) => {
        setAnnouncements(announcements.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a));
    };

    const sorted = [...announcements].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

    return (
        <UniversityPageLayout>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Megaphone className="w-5 h-5 text-primary" />
                        </div>
                        Announcements
                    </h1>
                    <p className="text-muted-foreground mt-1">Broadcast announcements to students, instructors, and departments</p>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2"><Plus className="w-4 h-4" /> New Announcement</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader><DialogTitle>Create Announcement</DialogTitle></DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Announcement title..." />
                            </div>
                            <div className="space-y-2">
                                <Label>Message</Label>
                                <Textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} placeholder="Write your announcement..." rows={4} />
                            </div>
                            <div className="space-y-2">
                                <Label>Audience</Label>
                                <Select value={form.audience} onValueChange={v => setForm({ ...form, audience: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Users</SelectItem>
                                        <SelectItem value="students">All Students</SelectItem>
                                        <SelectItem value="instructors">All Instructors</SelectItem>
                                        <SelectItem value="department">Specific Department</SelectItem>
                                        <SelectItem value="course">Specific Course</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreate}>Publish</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-3">
                {sorted.map(ann => {
                    const AudIcon = audienceIcon[ann.audience];
                    return (
                        <Card key={ann.id} className={cn("border-border/50 transition-all", ann.pinned && "border-primary/30 bg-primary/[0.02]")}>
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            {ann.pinned && <Pin className="w-3.5 h-3.5 text-primary" />}
                                            <p className="font-bold text-sm">{ann.title}</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{ann.body}</p>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <Badge variant="outline" className={cn("text-xs gap-1", audienceColor[ann.audience])}>
                                                <AudIcon className="w-3 h-3" />
                                                {ann.audience === "all" ? "Everyone" :
                                                 ann.audienceDetail ? `${ann.audience}: ${ann.audienceDetail}` :
                                                 ann.audience.charAt(0).toUpperCase() + ann.audience.slice(1)}
                                            </Badge>
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(ann.createdAt).toLocaleDateString()}</span>
                                            <span>by {ann.author}</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="shrink-0" onClick={() => togglePin(ann.id)}>
                                        <Pin className={cn("w-4 h-4", ann.pinned ? "text-primary fill-primary" : "text-muted-foreground")} />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </UniversityPageLayout>
    );
};

export default UniversityAnnouncements;
