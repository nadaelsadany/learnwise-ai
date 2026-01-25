import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Upload, Loader2, Save, FileText, Video as VideoIcon } from "lucide-react";
import { useCourseEditor, Chapter } from "@/hooks/useCourseEditor";
import { ChapterList } from "@/components/instructor/ChapterList";
import { InstructorSidebar } from "@/components/layout/InstructorSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { useCourses } from "@/hooks/useCourses";

const CourseEditor = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState("info");

    // State for Course Info
    const [courseInfo, setCourseInfo] = useState({
        title: "",
        description: "",
        category: "",
        level: "beginner",
        minApplicants: 0,
        pdfUrl: ""
    });

    const [chapters, setChapters] = useState<Chapter[]>([]);

    const { updateCourse } = useCourses(); // Assuming we use existing hook for basic updates
    const { analyzeSyllabus, uploadMedia, analyzing, uploading } = useCourseEditor();

    const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Upload PDF (Mock usage)
        // const url = await uploadMedia(file, 'syllabi');
        // if (url) setCourseInfo(prev => ({ ...prev, pdfUrl: url }));

        // AI Analyze
        const structure = await analyzeSyllabus(file);
        if (structure) {
            // Map AI structure to chapters
            const newChapters: Chapter[] = structure.map((module: any) => ({
                id: crypto.randomUUID(),
                title: module.title,
                lessons: module.lessons.map((l: any) => ({
                    id: crypto.randomUUID(),
                    title: l.title,
                    type: l.type,
                    content: ""
                }))
            }));
            setChapters(newChapters);
            setActiveTab("curriculum"); // Switch to curriculum tab to show results
        }
    };

    const handleSaveInfo = async () => {
        if (!courseId) return;
        // Mock save for minApplicants since it's not in DB yet
        await updateCourse(courseId, {
            title: courseInfo.title,
            description: courseInfo.description,
            category: courseInfo.category,
            level: courseInfo.level
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <InstructorSidebar onCollapse={setSidebarCollapsed} />
            <Header sidebarCollapsed={sidebarCollapsed} userRole="Instructor" />

            <main className={cn(
                "pt-20 pb-8 px-6 transition-all duration-300",
                sidebarCollapsed ? "ml-20" : "ml-64"
            )}>
                <div className="max-w-5xl mx-auto space-y-6">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => navigate("/instructor/courses")}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <h1 className="text-2xl font-bold">Edit Course</h1>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="info">Course Info</TabsTrigger>
                            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                            <TabsTrigger value="settings">Settings</TabsTrigger>
                        </TabsList>

                        <TabsContent value="info" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Basic Information</CardTitle>
                                    <CardDescription>Manage your course details and settings.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="title">Course Title</Label>
                                        <Input
                                            id="title"
                                            value={courseInfo.title}
                                            onChange={(e) => setCourseInfo({ ...courseInfo, title: e.target.value })}
                                            placeholder="e.g. Master React"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={courseInfo.description}
                                            onChange={(e) => setCourseInfo({ ...courseInfo, description: e.target.value })}
                                            rows={4}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="category">Category</Label>
                                            <Input
                                                id="category"
                                                value={courseInfo.category}
                                                onChange={(e) => setCourseInfo({ ...courseInfo, category: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="level">Level</Label>
                                            <Select
                                                value={courseInfo.level}
                                                onValueChange={(val) => setCourseInfo({ ...courseInfo, level: val })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select level" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="beginner">Beginner</SelectItem>
                                                    <SelectItem value="intermediate">Intermediate</SelectItem>
                                                    <SelectItem value="advanced">Advanced</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="minApplicants">Minimum Applicants</Label>
                                        <Input
                                            id="minApplicants"
                                            type="number"
                                            min="0"
                                            value={courseInfo.minApplicants}
                                            onChange={(e) => setCourseInfo({ ...courseInfo, minApplicants: parseInt(e.target.value) || 0 })}
                                            placeholder="0"
                                            className="max-w-[200px]"
                                        />
                                        <p className="text-sm text-muted-foreground">Minimum number of students required to start the course.</p>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <Label className="mb-2 block">AI Syllabus Analysis</Label>
                                        <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors">
                                            <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                            {analyzing ? (
                                                <div className="flex items-center gap-2 text-primary">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span>Analyzing PDF...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <p className="text-sm font-medium">Upload PDF Syllabus</p>
                                                    <p className="text-xs text-muted-foreground mb-4">AI will analyze topics and suggest a structure</p>
                                                    <Input
                                                        type="file"
                                                        accept=".pdf"
                                                        className="max-w-xs"
                                                        onChange={handlePdfUpload}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <Button onClick={handleSaveInfo}>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="curriculum">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Course Curriculum</CardTitle>
                                    <CardDescription>Drag and drop chapters and lessons to reorder.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <ChapterList
                                        chapters={chapters}
                                        onUpdateChapters={setChapters}
                                        onUploadMedia={uploadMedia}
                                    />
                                    <div className="flex justify-end pt-4 border-t">
                                        <Button onClick={() => console.log("Saving curriculum:", chapters)}>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Curriculum
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
};

export default CourseEditor;
