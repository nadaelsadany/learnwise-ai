import { useState } from "react";
import { UniversityPageLayout } from "@/components/layout/UniversityPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Layers, Plus, Users, Clock, BarChart2, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Section {
    id: string;
    courseName: string;
    sectionLabel: string;
    instructor: string;
    capacity: number;
    enrolled: number;
    schedule: string;
    room: string;
    avgGrade: number;
}

const mockSections: Section[] = [
    { id: "1", courseName: "UI Design", sectionLabel: "Section A", instructor: "Ahmed Al-Rashid", capacity: 40, enrolled: 38, schedule: "Mon/Wed 9:00-10:30", room: "B204", avgGrade: 88 },
    { id: "2", courseName: "UI Design", sectionLabel: "Section B", instructor: "Sara Khalil", capacity: 35, enrolled: 32, schedule: "Tue/Thu 11:00-12:30", room: "A112", avgGrade: 91 },
    { id: "3", courseName: "Data Structures", sectionLabel: "Section A", instructor: "Dr. Omar Farouk", capacity: 50, enrolled: 48, schedule: "Mon/Wed 14:00-15:30", room: "C301", avgGrade: 76 },
    { id: "4", courseName: "Data Structures", sectionLabel: "Section B", instructor: "Dr. Layla Hassan", capacity: 50, enrolled: 42, schedule: "Tue/Thu 9:00-10:30", room: "C302", avgGrade: 82 },
    { id: "5", courseName: "Machine Learning", sectionLabel: "Section A", instructor: "Prof. Noor Ahmed", capacity: 30, enrolled: 30, schedule: "Mon/Wed/Fri 10:00-11:00", room: "D105", avgGrade: 85 },
    { id: "6", courseName: "Business Ethics", sectionLabel: "Section A", instructor: "Dr. Youssef Karim", capacity: 60, enrolled: 45, schedule: "Tue/Thu 14:00-15:30", room: "A201", avgGrade: 92 },
];

const UniversitySections = () => {
    const [search, setSearch] = useState("");
    const filtered = mockSections.filter(s =>
        s.courseName.toLowerCase().includes(search.toLowerCase()) ||
        s.instructor.toLowerCase().includes(search.toLowerCase())
    );

    const grouped = filtered.reduce<Record<string, Section[]>>((acc, s) => {
        if (!acc[s.courseName]) acc[s.courseName] = [];
        acc[s.courseName].push(s);
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
                <Input placeholder="Search by course or instructor..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Total Sections", value: mockSections.length, color: "text-primary" },
                    { label: "Total Enrolled", value: mockSections.reduce((s, c) => s + c.enrolled, 0), color: "text-emerald-500" },
                    { label: "Avg Capacity Used", value: `${Math.round(mockSections.reduce((s, c) => s + (c.enrolled / c.capacity) * 100, 0) / mockSections.length)}%`, color: "text-amber-500" },
                ].map(s => (
                    <Card key={s.label} className="border-border/50">
                        <CardContent className="p-5">
                            <p className={cn("text-2xl font-black", s.color)}>{s.value}</p>
                            <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {Object.entries(grouped).map(([course, sections]) => (
                <div key={course} className="space-y-3">
                    <h2 className="text-lg font-bold">{course}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sections.map(sec => {
                            const fillPct = Math.round((sec.enrolled / sec.capacity) * 100);
                            return (
                                <Card key={sec.id} className="border-border/50 hover:shadow-md transition-all">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-sm font-bold">{sec.sectionLabel}</CardTitle>
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
                                        <p className="text-sm font-medium">{sec.instructor}</p>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{sec.schedule}</span>
                                            <span>Room {sec.room}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{sec.enrolled}/{sec.capacity}</span>
                                            <span className="flex items-center gap-1"><BarChart2 className="w-3.5 h-3.5" />Avg: {sec.avgGrade}%</span>
                                        </div>
                                        <Progress value={fillPct} className="h-1.5" />
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            ))}
        </UniversityPageLayout>
    );
};

export default UniversitySections;
