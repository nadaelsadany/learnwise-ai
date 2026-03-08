import { useState } from "react";
import { UniversityPageLayout } from "@/components/layout/UniversityPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Layers, Plus, Users, Clock, BarChart2, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const UniversitySections = () => {
    const [search, setSearch] = useState("");

    const { data: sections = [], isLoading } = useQuery({
        queryKey: ["course-sections"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("course_sections")
                .select("*, courses(title)")
                .order("created_at", { ascending: false });
            if (error) throw error;
            return data;
        },
    });

    const filtered = sections.filter((s: any) => {
        const courseName = s.courses?.title || "";
        return courseName.toLowerCase().includes(search.toLowerCase()) ||
            (s.section_label || "").toLowerCase().includes(search.toLowerCase());
    });

    const grouped = filtered.reduce<Record<string, any[]>>((acc, s: any) => {
        const name = s.courses?.title || "Unknown Course";
        if (!acc[name]) acc[name] = [];
        acc[name].push(s);
        return acc;
    }, {});

    return (
        <UniversityPageLayout>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Layers className="w-5 h-5 text-primary" />
                        </div>
                        Sections & Classes
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage course sections, instructors, and class schedules</p>
                </div>
                <Button className="gap-2"><Plus className="w-4 h-4" /> New Section</Button>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search by course or section..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Total Sections", value: sections.length, color: "text-primary" },
                    { label: "Total Enrolled", value: sections.reduce((s: number, c: any) => s + (c.enrolled || 0), 0), color: "text-emerald-500" },
                    { label: "Avg Capacity Used", value: sections.length > 0 ? `${Math.round(sections.reduce((s: number, c: any) => s + ((c.enrolled || 0) / (c.capacity || 1)) * 100, 0) / sections.length)}%` : "0%", color: "text-amber-500" },
                ].map(s => (
                    <Card key={s.label} className="border-border/50">
                        <CardContent className="p-5">
                            <p className={cn("text-2xl font-black", s.color)}>{s.value}</p>
                            <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : Object.keys(grouped).length === 0 ? (
                <Card className="border-border/50"><CardContent className="p-12 text-center text-muted-foreground">No sections yet. Create one to get started.</CardContent></Card>
            ) : (
                Object.entries(grouped).map(([course, secs]) => (
                    <div key={course} className="space-y-3">
                        <h2 className="text-lg font-bold">{course}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {secs.map((sec: any) => {
                                const fillPct = sec.capacity > 0 ? Math.round((sec.enrolled / sec.capacity) * 100) : 0;
                                return (
                                    <Card key={sec.id} className="border-border/50 hover:shadow-md transition-all">
                                        <CardHeader className="pb-2">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-sm font-bold">{sec.section_label}</CardTitle>
                                                <Badge variant="outline" className={cn("text-xs",
                                                    fillPct >= 95 ? "text-destructive border-destructive/20 bg-destructive/5" :
                                                    fillPct >= 75 ? "text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/20" :
                                                    "text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20"
                                                )}>
                                                    {fillPct}% full
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                {sec.schedule && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{sec.schedule}</span>}
                                                {sec.room && <span>Room {sec.room}</span>}
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{sec.enrolled}/{sec.capacity}</span>
                                            </div>
                                            <Progress value={fillPct} className="h-1.5" />
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                ))
            )}
        </UniversityPageLayout>
    );
};

export default UniversitySections;
