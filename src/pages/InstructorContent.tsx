import { useState, useEffect } from "react";
import { InstructorPageLayout } from "@/components/instructor/InstructorPageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, FileText, Image as ImageIcon, Video, Folder, Plus, Search, MoreVertical, Trash2, Download, Link as LinkIcon, Loader2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getLibraryFiles, addLibraryFile, deleteLibraryFile, ContentLibraryFile } from "@/lib/instructorData";
import { useToast } from "@/hooks/use-toast";

const InstructorContent = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [files, setFiles] = useState<ContentLibraryFile[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    // Add File Dialog State
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [adding, setAdding] = useState(false);
    const [newFile, setNewFile] = useState({
        name: "",
        type: "document" as any,
        size: "1.5 MB"
    });

    const loadFiles = () => {
        setLoading(true);
        const data = getLibraryFiles();
        setFiles(data);
        setLoading(false);
    };

    useEffect(() => {
        loadFiles();
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case "document": return <FileText className="w-8 h-8 text-blue-500" />;
            case "image": return <ImageIcon className="w-8 h-8 text-purple-500" />;
            case "video": return <Video className="w-8 h-8 text-red-500" />;
            case "link": return <LinkIcon className="w-8 h-8 text-emerald-500" />;
            default: return <Folder className="w-8 h-8 text-yellow-500" />;
        }
    };

    const handleAddFile = async () => {
        if (!newFile.name) return;
        setAdding(true);
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 800));

        addLibraryFile({
            name: newFile.name,
            type: newFile.type,
            size: newFile.type === "link" ? "--" : newFile.size
        });

        toast({
            title: "Resource Added",
            description: `"${newFile.name}" has been uploaded to the Content Library.`
        });

        setNewFile({ name: "", type: "document", size: "1.5 MB" });
        setAdding(false);
        setIsAddOpen(false);
        loadFiles();
    };

    const handleDelete = (id: string) => {
        deleteLibraryFile(id);
        toast({
            variant: "destructive",
            title: "Resource Deleted",
            description: "The item has been removed from the Content Library."
        });
        loadFiles();
    };

    const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <InstructorPageLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between animate-slide-up">
                    <div>
                        <h1 className="text-2xl font-bold">Content Library</h1>
                        <p className="text-muted-foreground mt-1">
                            Store and manage reusable media files, links, worksheets, and templates.
                        </p>
                    </div>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="gradient-accent text-white shadow-glow-accent">
                                <Upload className="w-4 h-4 mr-2" /> Upload New
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Library Resource</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fileName">Resource Name / Link URL</Label>
                                    <Input
                                        id="fileName"
                                        value={newFile.name}
                                        onChange={(e) => setNewFile({ ...newFile, name: e.target.value })}
                                        placeholder="e.g. ISTQB Syllabus Quick Reference.pdf"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Resource Type</Label>
                                        <Select
                                            value={newFile.type}
                                            onValueChange={(val) => setNewFile({ ...newFile, type: val })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="document">Document (PDF/Word)</SelectItem>
                                                <SelectItem value="image">Image Asset</SelectItem>
                                                <SelectItem value="video">Video Lecture</SelectItem>
                                                <SelectItem value="link">Web Link</SelectItem>
                                                <SelectItem value="archive">Zip Archive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>File Size</Label>
                                        <Input
                                            value={newFile.size}
                                            onChange={(e) => setNewFile({ ...newFile, size: e.target.value })}
                                            placeholder="e.g. 2.4 MB"
                                            disabled={newFile.type === "link"}
                                        />
                                    </div>
                                </div>
                                <Button onClick={handleAddFile} disabled={!newFile.name || adding} className="w-full">
                                    {adding ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...
                                        </>
                                    ) : (
                                        "Save to Library"
                                    )}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card className="min-h-[500px] border-border/50 bg-card animate-slide-up" style={{ animationDelay: "100ms" }}>
                    <CardHeader className="pb-4 border-b border-border/50">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-semibold">Media & Resource Vault</CardTitle>
                            <div className="relative w-72">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search library..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <ScrollArea className="h-[500px]">
                            {loading ? (
                                <div className="flex items-center justify-center py-24">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                </div>
                            ) : filteredFiles.length === 0 ? (
                                <div className="text-center py-24 text-muted-foreground text-sm">
                                    No resources found matching the search.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-6">
                                    {/* Upload Placeholder */}
                                    <div 
                                        onClick={() => setIsAddOpen(true)}
                                        className="border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center p-6 text-center hover:bg-muted/50 transition-all cursor-pointer aspect-square bg-card"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
                                            <Plus className="w-6 h-6 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm font-medium">Add Resource</p>
                                    </div>

                                    {/* File Items */}
                                    {filteredFiles.map((file) => (
                                        <div key={file.id} className="group relative border border-border/50 rounded-xl p-4 hover:shadow-md transition-all bg-card aspect-square flex flex-col justify-between hover:border-accent/40">
                                            <div className="flex flex-col items-center justify-center flex-1 space-y-3">
                                                {getIcon(file.type)}
                                                <p className="font-medium text-sm text-center line-clamp-2 break-all px-1">
                                                    {file.name}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground border-t border-border/50 mt-2">
                                                <span>{file.size}</span>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6">
                                                            <MoreVertical className="w-3 h-3" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => {
                                                            toast({
                                                                title: "Download Triggered",
                                                                description: `Downloading ${file.name}...`
                                                            });
                                                        }}>
                                                            <Download className="w-4 h-4 mr-2" /> Download
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            className="text-destructive focus:bg-destructive/10"
                                                            onClick={() => handleDelete(file.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </InstructorPageLayout>
    );
};

export default InstructorContent;
