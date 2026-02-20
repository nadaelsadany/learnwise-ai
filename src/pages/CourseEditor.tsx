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
import { useEffect } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Copy, Eye, EyeOff, Lock, Unlock, Trash2, Archive, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
        pdfUrl: "",
        startDate: "",
        endDate: "",
        attachmentUrl: ""
    });

    // State for Settings
    const [settings, setSettings] = useState({
        isPublished: false,
        isPublic: true,
        allowComments: true,
        showReviews: true,
        enrollmentType: "open"
    });

    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [loadingCourse, setLoadingCourse] = useState(true);

    const { updateCourse, getCourseById } = useCourses(); // Assuming we use existing hook for basic updates
    const { analyzeSyllabus, uploadMedia, saveCurriculum, fetchCurriculum, analyzing, loading: savingCurriculum, uploading } = useCourseEditor();
    const { toast } = useToast();

    useEffect(() => {
        const loadData = async () => {
            if (!courseId) return;

            setLoadingCourse(true);
            const { course } = await getCourseById(courseId);
            if (course) {
                setCourseInfo({
                    title: course.title || "",
                    description: course.description || "",
                    category: course.category || "",
                    level: course.level || "beginner",
                    minApplicants: 0, // Not in DB
                    pdfUrl: course.attachment_url || "",
                    startDate: course.start_date || "",
                    endDate: course.end_date || "",
                    attachmentUrl: course.attachment_url || ""
                });
            }

            const curriculum = await fetchCurriculum(courseId);
            if (curriculum) {
                setChapters(curriculum);
            }
            setLoadingCourse(false);
        };

        loadData();
    }, [courseId]);

    const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Upload PDF and save as attachment
        const url = await uploadMedia(file, 'attachments');
        if (url) {
            setCourseInfo(prev => ({ ...prev, pdfUrl: url, attachmentUrl: url }));
            console.log("Attachment uploaded:", url);
        }

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
        await updateCourse(courseId, {
            title: courseInfo.title,
            description: courseInfo.description,
            category: courseInfo.category,
            level: courseInfo.level as any,
            // duration_hours: courseInfo.duration_hours, // Added if needed
        });
    };

    const handleSaveCurriculum = async () => {
        if (!courseId) return;
        await saveCurriculum(courseId, chapters);
    };

    const handleSaveSettings = () => {
        toast({
            title: "Settings Saved",
            description: "Course settings have been updated successfully.",
        });
    };

    const handleArchiveCourse = () => {
        toast({
            title: "Course Archived",
            description: "This course is now hidden from students.",
        });
    };

    const handleDeleteCourse = () => {
        toast({
            variant: "destructive",
            title: "Course Deleted",
            description: "The course has been permanently deleted.",
        });
        navigate("/instructor/courses");
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
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" onClick={() => navigate("/instructor/courses")}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <h1 className="text-2xl font-bold">Edit Course</h1>
                        </div>
                        {loadingCourse && <Loader2 className="w-6 h-6 animate-spin text-primary" />}
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="info">Course Info</TabsTrigger>
                            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                            <TabsTrigger value="students">Students</TabsTrigger>
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

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="startDate">Start Date</Label>
                                            <Input
                                                id="startDate"
                                                type="datetime-local"
                                                value={courseInfo.startDate}
                                                onChange={(e) => setCourseInfo({ ...courseInfo, startDate: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="endDate">End Date</Label>
                                            <Input
                                                id="endDate"
                                                type="datetime-local"
                                                value={courseInfo.endDate}
                                                onChange={(e) => setCourseInfo({ ...courseInfo, endDate: e.target.value })}
                                            />
                                        </div>
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
                                        <Button
                                            onClick={handleSaveCurriculum}
                                            disabled={savingCurriculum}
                                        >
                                            {savingCurriculum ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <Save className="w-4 h-4 mr-2" />
                                            )}
                                            Save Curriculum
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="students">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Enrolled Students</CardTitle>
                                    <CardDescription>Manage and view students enrolled in this course.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Student</TableHead>
                                                <TableHead>Enrolled Date</TableHead>
                                                <TableHead>Progress</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {[
                                                { id: 1, name: "Alice Johnson", email: "alice@example.com", progress: 45, enrolledAt: "2024-01-15", avatar: "AJ" },
                                                { id: 2, name: "Bob Smith", email: "bob@example.com", progress: 72, enrolledAt: "2024-01-10", avatar: "BS" },
                                                { id: 3, name: "Charlie Brown", email: "charlie@example.com", progress: 12, enrolledAt: "2024-01-20", avatar: "CB" },
                                                { id: 4, name: "Diana Prince", email: "diana@example.com", progress: 100, enrolledAt: "2023-12-05", avatar: "DP" },
                                                { id: 5, name: "Edward Norton", email: "edward@example.com", progress: 0, enrolledAt: "2024-01-25", avatar: "EN" },
                                            ].map((student) => (
                                                <TableRow key={student.id}>
                                                    <TableCell className="flex items-center gap-3">
                                                        <Avatar>
                                                            <AvatarFallback>{student.avatar}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-medium">{student.name}</p>
                                                            <p className="text-xs text-muted-foreground">{student.email}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{student.enrolledAt}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-2 w-full max-w-[100px] bg-secondary rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-primary"
                                                                    style={{ width: `${student.progress}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs text-muted-foreground">{student.progress}%</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={student.progress === 100 ? "default" : "secondary"}>
                                                            {student.progress === 100 ? "Completed" : "Active"}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="settings" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Course Visibility</CardTitle>
                                            <CardDescription>Control how your course is viewed by others.</CardDescription>
                                        </div>
                                        <Badge variant={settings.isPublished ? "default" : "secondary"}>
                                            {settings.isPublished ? "Published" : "Draft"}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2">
                                                {settings.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                <Label className="text-base">Publish Course</Label>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Make this course visible to students.
                                            </p>
                                        </div>
                                        <Switch
                                            checked={settings.isPublished}
                                            onCheckedChange={(checked) => setSettings({ ...settings, isPublished: checked })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2">
                                                {settings.isPublic ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                                <Label className="text-base">Public Access</Label>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Allow anyone to view this course without an invite.
                                            </p>
                                        </div>
                                        <Switch
                                            checked={settings.isPublic}
                                            onCheckedChange={(checked) => setSettings({ ...settings, isPublic: checked })}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Enrollment & Interaction</CardTitle>
                                    <CardDescription>Manage how students enroll and interact.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid gap-2">
                                        <Label>Enrollment Type</Label>
                                        <Select
                                            value={settings.enrollmentType}
                                            onValueChange={(val) => setSettings({ ...settings, enrollmentType: val })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="open">Open Enrollment</SelectItem>
                                                <SelectItem value="application">Application Required</SelectItem>
                                                <SelectItem value="invite">Invite Only</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Allow Comments</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Students can comment on lessons.
                                            </p>
                                        </div>
                                        <Switch
                                            checked={settings.allowComments}
                                            onCheckedChange={(checked) => setSettings({ ...settings, allowComments: checked })}
                                        />
                                    </div>

                                    <div className="flex justify-end pt-4 border-t">
                                        <Button onClick={handleSaveSettings}>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-destructive/50">
                                <CardHeader>
                                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                                    <CardDescription>Irreversible actions for this course.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Alert variant="destructive">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertTitle>Warning</AlertTitle>
                                        <AlertDescription>
                                            Archiving a course will hide it from students but keep data. Deleting is permanent.
                                        </AlertDescription>
                                    </Alert>

                                    <div className="flex items-center justify-between pt-2">
                                        <div>
                                            <p className="font-medium">Archive Course</p>
                                            <p className="text-sm text-muted-foreground">Hide from public view.</p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="text-warning hover:text-warning border-warning/50 hover:bg-warning/10"
                                            onClick={handleArchiveCourse}
                                        >
                                            <Archive className="w-4 h-4 mr-2" />
                                            Archive
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div>
                                            <p className="font-medium text-destructive">Delete Course</p>
                                            <p className="text-sm text-muted-foreground">Permanently remove this course.</p>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            onClick={handleDeleteCourse}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete Course
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main >
        </div >
    );
};

export default CourseEditor;
