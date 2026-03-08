import { useState } from "react";
import { UniversityPageLayout } from "@/components/layout/UniversityPageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FolderOpen, Search, FileText, Video, Image, Presentation, Upload, Download, Eye, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentItem {
    id: string;
    name: string;
    type: "pdf" | "video" | "image" | "presentation" | "document";
    department: string;
    course?: string;
    uploadedBy: string;
    uploadedAt: string;
    size: string;
    downloads: number;
}

const mockContent: ContentItem[] = [
    { id: "1", name: "Data Structures Lecture Notes.pdf", type: "pdf", department: "Computer Science", course: "Data Structures", uploadedBy: "Dr. Omar Farouk", uploadedAt: "2026-03-05", size: "2.4 MB", downloads: 156 },
    { id: "2", name: "UI Design Principles.pptx", type: "presentation", department: "Design & Arts", course: "UI Design", uploadedBy: "Sara Khalil", uploadedAt: "2026-03-04", size: "8.1 MB", downloads: 89 },
    { id: "3", name: "Machine Learning Intro Video", type: "video", department: "Computer Science", course: "Machine Learning", uploadedBy: "Prof. Noor Ahmed", uploadedAt: "2026-03-03", size: "245 MB", downloads: 67 },
    { id: "4", name: "Academic Writing Guide.pdf", type: "pdf", department: "General", uploadedBy: "Academic Affairs", uploadedAt: "2026-03-02", size: "1.1 MB", downloads: 234 },
    { id: "5", name: "Business Case Study Template.docx", type: "document", department: "Business Administration", course: "Business Ethics", uploadedBy: "Dr. Youssef Karim", uploadedAt: "2026-03-01", size: "340 KB", downloads: 45 },
    { id: "6", name: "Algorithm Visualization Diagrams", type: "image", department: "Computer Science", course: "Data Structures", uploadedBy: "Dr. Omar Farouk", uploadedAt: "2026-02-28", size: "5.6 MB", downloads: 112 },
];

const typeIcon = { pdf: FileText, video: Video, image: Image, presentation: Presentation, document: FileText };
const typeColor = {
    pdf: "text-destructive bg-destructive/10",
    video: "text-violet-500 bg-violet-500/10",
    image: "text-sky-500 bg-sky-500/10",
    presentation: "text-amber-500 bg-amber-500/10",
    document: "text-primary bg-primary/10",
};

const UniversityContentLibrary = () => {
    const [search, setSearch] = useState("");
    const departments = [...new Set(mockContent.map(c => c.department))];

    const filtered = mockContent.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.department.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <UniversityPageLayout>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <FolderOpen className="w-5 h-5 text-primary" />
                        </div>
                        Content Library
                    </h1>
                    <p className="text-muted-foreground mt-1">Shared academic resources organized by department and course</p>
                </div>
                <Button className="gap-2"><Upload className="w-4 h-4" /> Upload Content</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                    { label: "Total Files", value: mockContent.length },
                    { label: "Departments", value: departments.length },
                    { label: "Total Downloads", value: mockContent.reduce((s, c) => s + c.downloads, 0) },
                    { label: "File Types", value: [...new Set(mockContent.map(c => c.type))].length },
                ].map(s => (
                    <Card key={s.label} className="border-border/50">
                        <CardContent className="p-4">
                            <p className="text-xl font-black">{s.value}</p>
                            <p className="text-xs text-muted-foreground">{s.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search files..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <Tabs defaultValue="all">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    {departments.map(d => <TabsTrigger key={d} value={d}>{d}</TabsTrigger>)}
                </TabsList>

                {["all", ...departments].map(tab => (
                    <TabsContent key={tab} value={tab} className="space-y-3 mt-4">
                        {filtered.filter(c => tab === "all" || c.department === tab).map(item => {
                            const Icon = typeIcon[item.type];
                            return (
                                <Card key={item.id} className="border-border/50 hover:shadow-md transition-all">
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", typeColor[item.type])}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm truncate">{item.name}</p>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                                <Badge variant="outline" className="text-xs">{item.department}</Badge>
                                                {item.course && <span>{item.course}</span>}
                                                <span>{item.size}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(item.uploadedAt).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1"><Download className="w-3 h-3" />{item.downloads}</span>
                                            <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon"><Download className="w-4 h-4" /></Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </TabsContent>
                ))}
            </Tabs>
        </UniversityPageLayout>
    );
};

export default UniversityContentLibrary;
