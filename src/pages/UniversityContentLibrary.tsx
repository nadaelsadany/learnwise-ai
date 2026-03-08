import { useState, useRef } from "react";
import { UniversityPageLayout } from "@/components/layout/UniversityPageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { FolderOpen, Search, FileText, Video, Image, Presentation, Upload, Download, Eye, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const typeIcon: Record<string, React.ElementType> = { pdf: FileText, video: Video, image: Image, presentation: Presentation, document: FileText };
const typeColor: Record<string, string> = {
    pdf: "text-destructive bg-destructive/10",
    video: "text-violet-500 bg-violet-500/10",
    image: "text-sky-500 bg-sky-500/10",
    presentation: "text-amber-500 bg-amber-500/10",
    document: "text-primary bg-primary/10",
};

const getFileType = (name: string): string => {
    const ext = name.split(".").pop()?.toLowerCase() || "";
    if (["pdf"].includes(ext)) return "pdf";
    if (["mp4", "mov", "avi", "webm"].includes(ext)) return "video";
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "image";
    if (["pptx", "ppt", "key"].includes(ext)) return "presentation";
    return "document";
};

const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const UniversityContentLibrary = () => {
    const [search, setSearch] = useState("");
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [uploadDept, setUploadDept] = useState("General");
    const [uploadCourse, setUploadCourse] = useState("");
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: content = [], isLoading } = useQuery({
        queryKey: ["content-library"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("content_library")
                .select("*")
                .order("created_at", { ascending: false });
            if (error) throw error;
            return data;
        },
    });

    const handleUpload = async (files: FileList | null) => {
        if (!files || files.length === 0 || !user) return;
        setUploading(true);
        try {
            for (const file of Array.from(files)) {
                const filePath = `${user.id}/${Date.now()}-${file.name}`;
                const { error: uploadError } = await supabase.storage
                    .from("content-library")
                    .upload(filePath, file);
                if (uploadError) throw uploadError;

                const { error: dbError } = await supabase.from("content_library").insert({
                    name: file.name,
                    file_type: getFileType(file.name),
                    department: uploadDept,
                    course_name: uploadCourse || null,
                    uploaded_by: user.id,
                    uploaded_by_name: user.email?.split("@")[0] || "Unknown",
                    file_path: filePath,
                    file_size: formatFileSize(file.size),
                });
                if (dbError) throw dbError;
            }
            queryClient.invalidateQueries({ queryKey: ["content-library"] });
            toast({ title: "Files Uploaded", description: `${files.length} file(s) uploaded successfully.` });
            setIsUploadOpen(false);
        } catch (err: any) {
            toast({ variant: "destructive", title: "Upload Failed", description: err.message });
        } finally {
            setUploading(false);
        }
    };

    const getPublicUrl = (path: string) => {
        const { data } = supabase.storage.from("content-library").getPublicUrl(path);
        return data.publicUrl;
    };

    const filtered = content.filter((c: any) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.department || "").toLowerCase().includes(search.toLowerCase())
    );

    const departments = [...new Set(content.map((c: any) => c.department || "General"))];

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
                <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2"><Upload className="w-4 h-4" /> Upload Content</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Upload Files</DialogTitle></DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Department</Label>
                                <Select value={uploadDept} onValueChange={setUploadDept}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="General">General</SelectItem>
                                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                                        <SelectItem value="Business Administration">Business Administration</SelectItem>
                                        <SelectItem value="Design & Arts">Design & Arts</SelectItem>
                                        <SelectItem value="Physics">Physics</SelectItem>
                                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Course (optional)</Label>
                                <Input value={uploadCourse} onChange={e => setUploadCourse(e.target.value)} placeholder="e.g. Data Structures" />
                            </div>
                            <div
                                className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                                <p className="text-sm font-medium">Click to select files</p>
                                <p className="text-xs text-muted-foreground mt-1">PDF, PPTX, DOCX, images, videos (max 20MB)</p>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                className="hidden"
                                accept=".pdf,.pptx,.ppt,.docx,.doc,.xlsx,.xls,.txt,.md,.jpg,.jpeg,.png,.gif,.webp,.mp4,.mov"
                                onChange={e => handleUpload(e.target.files)}
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
                            {uploading && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</div>}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                    { label: "Total Files", value: content.length },
                    { label: "Departments", value: departments.length },
                    { label: "Total Downloads", value: content.reduce((s: number, c: any) => s + (c.downloads || 0), 0) },
                    { label: "File Types", value: [...new Set(content.map((c: any) => c.file_type))].length },
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

            {isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : filtered.length === 0 ? (
                <Card className="border-border/50"><CardContent className="p-12 text-center text-muted-foreground">No files yet. Upload content to get started.</CardContent></Card>
            ) : (
                <Tabs defaultValue="all">
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        {departments.map(d => <TabsTrigger key={d} value={d}>{d}</TabsTrigger>)}
                    </TabsList>
                    {["all", ...departments].map(tab => (
                        <TabsContent key={tab} value={tab} className="space-y-3 mt-4">
                            {filtered.filter((c: any) => tab === "all" || c.department === tab).map((item: any) => {
                                const Icon = typeIcon[item.file_type] || FileText;
                                return (
                                    <Card key={item.id} className="border-border/50 hover:shadow-md transition-all">
                                        <CardContent className="p-4 flex items-center gap-4">
                                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", typeColor[item.file_type] || "text-primary bg-primary/10")}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm truncate">{item.name}</p>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                                    <Badge variant="outline" className="text-xs">{item.department || "General"}</Badge>
                                                    {item.course_name && <span>{item.course_name}</span>}
                                                    <span>{item.file_size}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(item.created_at).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-1"><Download className="w-3 h-3" />{item.downloads}</span>
                                                <Button variant="ghost" size="icon" asChild>
                                                    <a href={getPublicUrl(item.file_path)} target="_blank" rel="noopener noreferrer"><Eye className="w-4 h-4" /></a>
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild>
                                                    <a href={getPublicUrl(item.file_path)} download><Download className="w-4 h-4" /></a>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </TabsContent>
                    ))}
                </Tabs>
            )}
        </UniversityPageLayout>
    );
};

export default UniversityContentLibrary;
