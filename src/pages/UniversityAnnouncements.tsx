import { useState } from "react";
import { UniversityPageLayout } from "@/components/layout/UniversityPageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Megaphone, Plus, Users, BookOpen, Building2, Clock, Pin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

const audienceIcon: Record<string, React.ElementType> = { all: Users, students: Users, instructors: Users, department: Building2, course: BookOpen };
const audienceColor: Record<string, string> = {
    all: "text-primary border-primary/20 bg-primary/5",
    students: "text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20",
    instructors: "text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/20",
    department: "text-sky-600 border-sky-200 bg-sky-50 dark:bg-sky-950/20",
    course: "text-violet-600 border-violet-200 bg-violet-50 dark:bg-violet-950/20",
};

const UniversityAnnouncements = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState({ title: "", body: "", audience: "all", audienceDetail: "" });
    const { toast } = useToast();
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: announcements = [], isLoading } = useQuery({
        queryKey: ["university-announcements"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("university_announcements")
                .select("*")
                .order("pinned", { ascending: false })
                .order("created_at", { ascending: false });
            if (error) throw error;
            return data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (ann: any) => {
            const { error } = await supabase.from("university_announcements").insert(ann);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["university-announcements"] });
            setIsOpen(false);
            setForm({ title: "", body: "", audience: "all", audienceDetail: "" });
            toast({ title: "Announcement Published" });
        },
        onError: (err: any) => toast({ variant: "destructive", title: "Error", description: err.message }),
    });

    const togglePinMutation = useMutation({
        mutationFn: async ({ id, pinned }: { id: string; pinned: boolean }) => {
            const { error } = await supabase.from("university_announcements").update({ pinned: !pinned }).eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["university-announcements"] }),
    });

    const handleCreate = () => {
        if (!form.title || !form.body) { toast({ variant: "destructive", title: "Missing fields" }); return; }
        createMutation.mutate({
            title: form.title, body: form.body, audience: form.audience,
            audience_detail: form.audienceDetail || null,
            author_id: user?.id, author_name: user?.email?.split("@")[0] || "University Admin",
        });
    };

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
                            <div className="grid grid-cols-2 gap-4">
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
                                {(form.audience === "department" || form.audience === "course") && (
                                    <div className="space-y-2">
                                        <Label>{form.audience === "department" ? "Department" : "Course"} Name</Label>
                                        <Input value={form.audienceDetail} onChange={e => setForm({ ...form, audienceDetail: e.target.value })} placeholder="Enter name..." />
                                    </div>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreate} disabled={createMutation.isPending}>
                                {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Publish
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : announcements.length === 0 ? (
                <Card className="border-border/50"><CardContent className="p-12 text-center text-muted-foreground">No announcements yet. Create one to get started.</CardContent></Card>
            ) : (
                <div className="space-y-3">
                    {announcements.map((ann: any) => {
                        const AudIcon = audienceIcon[ann.audience] || Users;
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
                                                <Badge variant="outline" className={cn("text-xs gap-1", audienceColor[ann.audience] || "")}>
                                                    <AudIcon className="w-3 h-3" />
                                                    {ann.audience === "all" ? "Everyone" :
                                                     ann.audience_detail ? `${ann.audience}: ${ann.audience_detail}` :
                                                     ann.audience.charAt(0).toUpperCase() + ann.audience.slice(1)}
                                                </Badge>
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(ann.created_at).toLocaleDateString()}</span>
                                                <span>by {ann.author_name}</span>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="shrink-0" onClick={() => togglePinMutation.mutate({ id: ann.id, pinned: ann.pinned })}>
                                            <Pin className={cn("w-4 h-4", ann.pinned ? "text-primary fill-primary" : "text-muted-foreground")} />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </UniversityPageLayout>
    );
};

export default UniversityAnnouncements;
