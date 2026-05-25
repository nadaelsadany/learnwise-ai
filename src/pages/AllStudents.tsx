import { useState, useEffect } from "react";
import { InstructorPageLayout } from "@/components/instructor/InstructorPageLayout";
import { cn } from "@/lib/utils";
import { useInstructorStudents, AggregatedStudent } from "@/hooks/useInstructorStudents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { 
  Search, 
  Loader2, 
  Mail, 
  BookOpen, 
  AlertTriangle, 
  MessageSquare, 
  Flag, 
  CheckCircle,
  FileText,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import { getLibraryFiles, submitLearnerFeedback, flagLearnerToHR } from "@/lib/instructorData";
import { useToast } from "@/hooks/use-toast";

const AllStudents = () => {
    const { students, loading, refreshStudents } = useInstructorStudents();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStudent, setSelectedStudent] = useState<AggregatedStudent | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    
    // Feedback form state
    const [feedbackText, setFeedbackText] = useState("");
    const [selectedResourceId, setSelectedResourceId] = useState("");
    const [libraryResources, setLibraryResources] = useState<any[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        setLibraryResources(getLibraryFiles());
    }, [isDetailsOpen]);

    const filteredStudents = students.filter(student =>
        student.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const handleSendFeedback = () => {
        if (!selectedStudent || !feedbackText.trim()) return;

        const resourcesList = selectedResourceId ? [selectedResourceId] : [];
        submitLearnerFeedback(selectedStudent.id, feedbackText, resourcesList);
        
        toast({
            title: "Feedback Recorded",
            description: `Sent personalized feedback to ${selectedStudent.full_name}.`
        });

        setFeedbackText("");
        setSelectedResourceId("");
        // Reload details & refresh list
        refreshStudents();
        setIsDetailsOpen(false);
    };

    const handleFlagStudent = (courseTitle: string) => {
        if (!selectedStudent) return;
        flagLearnerToHR(selectedStudent.id, courseTitle);

        toast({
            title: "Flagged to HR",
            description: `${selectedStudent.full_name} has been flagged. The HR Department has been notified.`,
            variant: "destructive"
        });

        // Refresh list
        refreshStudents();
        setIsDetailsOpen(false);
    };

    return (
        <InstructorPageLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-slide-up">
                    <div>
                        <h1 className="text-2xl font-bold">Learners</h1>
                        <p className="text-muted-foreground">Monitor performance, provide personalized feedback interventions, or escalate concerns to HR.</p>
                    </div>
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search learners..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <Card className="border-border/50 bg-card animate-slide-up" style={{ animationDelay: "100ms" }}>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Learner Directory ({filteredStudents.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : filteredStudents.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <p>No learners found.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Learner</TableHead>
                                        <TableHead>Courses Enrolled</TableHead>
                                        <TableHead>Average Progress</TableHead>
                                        <TableHead>Performance Score</TableHead>
                                        <TableHead>Last Active</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStudents.map((student) => {
                                        const isLowPerformer = student.totalProgress < 40;
                                        return (
                                            <TableRow key={student.id} className={cn(student.isFlagged && "bg-destructive/5 hover:bg-destructive/10")}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar>
                                                            <AvatarFallback className="bg-primary/10 text-primary font-medium">{getInitials(student.full_name)}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-medium text-sm">{student.full_name}</p>
                                                                {student.isFlagged && (
                                                                    <Badge variant="destructive" className="text-[10px] py-0 px-1.5 flex items-center gap-0.5">
                                                                        <Flag className="w-2.5 h-2.5" /> Flagged to HR
                                                                    </Badge>
                                                                )}
                                                                {!student.isFlagged && isLowPerformer && (
                                                                    <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-warning border-warning/30 bg-warning/5 flex items-center gap-0.5">
                                                                        <AlertTriangle className="w-2.5 h-2.5" /> Intervention Required
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                                <Mail className="w-3 h-3" />
                                                                {student.email || "Contact student"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                                                        <span>{student.enrolledCoursesCount} Courses</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-16 bg-secondary rounded-full overflow-hidden">
                                                            <div 
                                                                className={cn("h-full", isLowPerformer ? "bg-warning" : "bg-primary")}
                                                                style={{ width: `${student.totalProgress}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-semibold">{student.totalProgress}%</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge 
                                                        variant={student.averageScore >= 80 ? "default" : student.averageScore >= 60 ? "secondary" : "destructive"}
                                                        className="text-xs font-semibold"
                                                    >
                                                        {student.averageScore}%
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-xs">
                                                    {student.lastActive ? format(new Date(student.lastActive), "MMM d, yyyy") : "Never"}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedStudent(student);
                                                            setIsDetailsOpen(true);
                                                        }}
                                                    >
                                                        Intervene & Details
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Details / Intervention Dialog */}
                {selectedStudent && (
                    <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card border-border/50">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <span>{selectedStudent.full_name}</span>
                                    {selectedStudent.isFlagged && <Badge variant="destructive">Flagged to HR</Badge>}
                                </DialogTitle>
                                <DialogDescription>Review curriculum achievements and issue personalized learning support.</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6 pt-3">
                                {/* Course breakdown */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Course Enrollments</h4>
                                    <div className="grid gap-3">
                                        {selectedStudent.courses.map((course) => (
                                            <div key={course.id} className="flex justify-between items-center bg-muted/40 p-3 rounded-xl border border-border/50">
                                                <div className="space-y-1">
                                                    <span className="font-medium text-sm">{course.title}</span>
                                                    <p className="text-xs text-muted-foreground">Test Average: {selectedStudent.averageScore}%</p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <Badge variant="outline">{course.progress}% Complete</Badge>
                                                    {course.progress < 40 && !selectedStudent.isFlagged && (
                                                        <Button 
                                                            size="xs" 
                                                            variant="destructive"
                                                            className="h-7 text-xs px-2.5"
                                                            onClick={() => handleFlagStudent(course.title)}
                                                        >
                                                            Flag Concern to HR
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Support Intervention Form */}
                                <div className="space-y-3 border-t border-border/50 pt-4">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                        <MessageSquare className="w-3.5 h-3.5" /> Support Interventions & Resources
                                    </h4>
                                    
                                    <div className="space-y-3 bg-muted/20 p-4 rounded-xl border border-border/50">
                                        <div className="space-y-2">
                                            <Label htmlFor="feedbackText" className="text-xs font-medium">Personalized Feedback & Study Plan</Label>
                                            <Textarea 
                                                id="feedbackText" 
                                                value={feedbackText} 
                                                onChange={e => setFeedbackText(e.target.value)}
                                                placeholder="Suggest areas of improvement or detail additional topics to review..."
                                                rows={3}
                                                className="text-sm bg-card border-border/50"
                                            />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label className="text-xs font-medium">Recommend Content Library Resource</Label>
                                            <Select value={selectedResourceId} onValueChange={setSelectedResourceId}>
                                                <SelectTrigger className="bg-card border-border/50"><SelectValue placeholder="Select content reference" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">-- None --</SelectItem>
                                                    {libraryResources.map(res => (
                                                        <SelectItem key={res.id} value={res.name}>{res.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Button onClick={handleSendFeedback} disabled={!feedbackText.trim()} className="w-full text-xs">
                                            Send Feedback
                                        </Button>
                                    </div>
                                </div>

                                {/* Feedback Log */}
                                {selectedStudent.feedback && selectedStudent.feedback.length > 0 && (
                                    <div className="space-y-3 border-t border-border/50 pt-4">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" /> Historical Interventions
                                        </h4>
                                        <div className="space-y-3">
                                            {selectedStudent.feedback.map((fb: any, idx: number) => (
                                                <div key={idx} className="p-3 rounded-xl bg-card border border-border/50 text-sm space-y-1">
                                                    <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                                                        <span>Trainer support logged</span>
                                                        <span>{fb.date}</span>
                                                    </div>
                                                    <p className="text-foreground leading-relaxed">{fb.text}</p>
                                                    {fb.resources && fb.resources.length > 0 && (
                                                        <div className="flex items-center gap-1.5 pt-1.5">
                                                            <FileText className="w-3.5 h-3.5 text-primary" />
                                                            <span className="text-xs text-primary font-medium">{fb.resources[0]}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </InstructorPageLayout>
    );
};

export default AllStudents;
