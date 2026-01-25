import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { InstructorSidebar } from "@/components/layout/InstructorSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { useEnrolledStudents, EnrolledStudent } from "@/hooks/useEnrolledStudents";
import { useCourses } from "@/hooks/useCourses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Users, BookOpen, Clock, Trophy, Loader2 } from "lucide-react";
import { format } from "date-fns";

const CourseStudents = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [courseTitle, setCourseTitle] = useState("Loading...");
  const navigate = useNavigate();

  const { students, loading, fetchEnrolledStudents, getStudentProgress } = useEnrolledStudents();
  const { courses, fetchInstructorCourses } = useCourses();
  const [studentProgress, setStudentProgress] = useState<Record<string, any>>({});

  useEffect(() => {
    if (courseId) {
      fetchEnrolledStudents(courseId);
      fetchInstructorCourses();
    }
  }, [courseId]);

  useEffect(() => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setCourseTitle(course.title);
    }
  }, [courses, courseId]);

  useEffect(() => {
    const fetchAllProgress = async () => {
      const progressData: Record<string, any> = {};
      for (const student of students) {
        progressData[student.student_id] = await getStudentProgress(student.student_id);
      }
      setStudentProgress(progressData);
    };

    if (students.length > 0) {
      fetchAllProgress();
    }
  }, [students]);

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <InstructorSidebar onCollapse={setSidebarCollapsed} />
      <Header sidebarCollapsed={sidebarCollapsed} userRole="Instructor" />

      <main
        className={cn(
          "pt-20 pb-8 px-6 transition-all duration-300",
          sidebarCollapsed ? "ml-20" : "ml-64"
        )}
      >
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/instructor/courses")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Enrolled Students</h1>
              <p className="text-muted-foreground">{courseTitle}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{students.length}</p>
                    <p className="text-xs text-muted-foreground">Total Students</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {students.filter(s => s.completed_at).length}
                    </p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {Math.round(students.reduce((sum, s) => sum + s.progress_percentage, 0) / (students.length || 1))}%
                    </p>
                    <p className="text-xs text-muted-foreground">Avg. Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {Math.round(Object.values(studentProgress).reduce((sum: number, p: any) => sum + (p?.totalStudyTime || 0), 0))}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Study Mins</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Students Table */}
          <Card>
            <CardHeader>
              <CardTitle>Student List</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No students enrolled yet</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Enrolled</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Lessons</TableHead>
                      <TableHead>Avg. Score</TableHead>
                      <TableHead>Study Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => {
                      const progress = studentProgress[student.student_id] || {};
                      return (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={student.profile?.avatar_url || undefined} />
                                <AvatarFallback>
                                  {getInitials(student.profile?.full_name || null)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {student.profile?.full_name || "Unknown Student"}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(student.enrolled_at), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={student.progress_percentage} className="w-20 h-2" />
                              <span className="text-sm">{student.progress_percentage}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{progress.lessonsCompleted || 0}</TableCell>
                          <TableCell>
                            {progress.averageScore ? `${Math.round(progress.averageScore)}%` : "-"}
                          </TableCell>
                          <TableCell>
                            {progress.totalStudyTime ? `${Math.round(progress.totalStudyTime)} min` : "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CourseStudents;
