import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { StudySessionProvider } from "@/components/learning/StudySessionProvider";
import Auth from "./pages/Auth";
import CreateCourse from "./pages/CreateCourse";
import ApplicantDashboard from "./pages/ApplicantDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import InstructorCourses from "./pages/InstructorCourses";
import CourseEditor from "./pages/CourseEditor";
import CourseStudents from "./pages/CourseStudents";
import AllStudents from "./pages/AllStudents";
import StudentProgress from "./pages/StudentProgress";
import InstructorAI from "./pages/InstructorAI";
import InstructorAnalytics from "./pages/InstructorAnalytics";
import InstructorSettings from "./pages/InstructorSettings";
import InstructorContent from "./pages/InstructorContent";
import InstructorNotifications from "./pages/InstructorNotifications";
import InstructorCurriculum from "./pages/InstructorCurriculum";
import InstructorAssignments from "./pages/InstructorAssignments";
import InstructorQuizzes from "./pages/InstructorQuizzes";
import InstructorDiscussions from "./pages/InstructorDiscussions";
import InstructorAnnouncements from "./pages/InstructorAnnouncements";
import InstructorFlashcards from "./pages/InstructorFlashcards";
import InstructorLeaderboard from "./pages/InstructorLeaderboard";
import StudentNotifications from "./pages/StudentNotifications";
import StudentAITutor from "./pages/StudentAITutor";
import InstructorChat from "./pages/InstructorChat";
import StudentSettings from "./pages/StudentSettings";
import CourseCatalog from "./pages/CourseCatalog";
import SyllabusUpload from "./pages/SyllabusUpload";
import MockExamRunner from "./pages/MockExamRunner";
import MockExamList from "./pages/MockExamList";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import LessonPlayer from "./pages/LessonPlayer";
import CourseDiscussions from "./pages/CourseDiscussions";
import Flashcards from "./pages/Flashcards";
import TimeBlocking from "./pages/TimeBlocking";
import SpacedRepetition from "./pages/SpacedRepetition";
import LearningAnalytics from "./pages/LearningAnalytics";
import AIStudyCoach from "./pages/AIStudyCoach";
import Achievements from "./pages/Achievements";
import NotFound from "./pages/NotFound";
import UniversityDashboard from "./pages/UniversityDashboard";
import UniversityDepartments from "./pages/UniversityDepartments";
import UniversityInstructors from "./pages/UniversityInstructors";
import UniversityStudents from "./pages/UniversityStudents";
import UniversityCourses from "./pages/UniversityCourses";
import UniversityAnalytics from "./pages/UniversityAnalytics";
import UniversitySettings from "./pages/UniversitySettings";
import UniversityAcademicTerms from "./pages/UniversityAcademicTerms";
import UniversitySections from "./pages/UniversitySections";
import UniversityEnrollment from "./pages/UniversityEnrollment";
import UniversityExams from "./pages/UniversityExams";
import UniversityAnnouncements from "./pages/UniversityAnnouncements";
import UniversityContentLibrary from "./pages/UniversityContentLibrary";
import UniversityReports from "./pages/UniversityReports";
import UniversityAIInsights from "./pages/UniversityAIInsights";
import UniversityRoles from "./pages/UniversityRoles";
import { Loader2 } from "lucide-react";
import Onboarding from "./pages/Onboarding";
import UserProfile from "./pages/UserProfile";
import Landing from "./pages/Landing";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminCourses from "./pages/AdminCourses";
import AdminEnrollments from "./pages/AdminEnrollments";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminSettings from "./pages/AdminSettings";
import Reporting from "./pages/Reporting";
import Learning from "./pages/Learning";
import Discussions from "./pages/Discussions";
import InstructorProfile from "./pages/InstructorProfile";
import HRDashboard from "./pages/HRDashboard";
import HREmployees from "./pages/HREmployees";
import HRAssignments from "./pages/HRAssignments";
import HRCertifications from "./pages/HRCertifications";
import HRReports from "./pages/HRReports";
import HRAIInsights from "./pages/HRAIInsights";
import HRSettings from "./pages/HRSettings";
import { FloatingCoachButton } from "@/components/dashboard/FloatingCoachButton";

const queryClient = new QueryClient();

// Landing page: show landing for guests, redirect logged-in users to dashboard
const LandingOrDashboard = () => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Landing />;
  }

  // Redirect logged-in users to their dashboard
  if (role === "instructor") return <Navigate to="/instructor" replace />;
  if (role === "university") return <Navigate to="/university" replace />;
  if (role === "admin") return <Navigate to="/admin" replace />;
  if (role === "hr") return <Navigate to="/hr" replace />;
  return <Navigate to="/dashboard" replace />;
};

// Student dashboard route
const StudentDashboardRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  return <ApplicantDashboard />;
};

const AppRoutes = () => {
  return (
    <>
      <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingOrDashboard />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/signup" element={<Auth />} />
      <Route path="/onboarding" element={<Onboarding />} />

      {/* Student dashboard */}
      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["applicant"]}><ApplicantDashboard /></ProtectedRoute>} />

      {/* Profile route - accessible by all authenticated users */}
      <Route path="/profile" element={<Navigate to="/settings" replace />} />
      {/* Legacy root redirect - handled by / above */}

      {/* Applicant routes */}
      <Route
        path="/catalog"
        element={
          <ProtectedRoute allowedRoles={["applicant"]}>
            <CourseCatalog />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <ProtectedRoute allowedRoles={["applicant"]}>
            <Courses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:courseId"
        element={
          <ProtectedRoute allowedRoles={["applicant"]}>
            <CourseDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:courseId/lessons/:lessonId"
        element={
          <ProtectedRoute allowedRoles={["applicant"]}>
            <LessonPlayer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:courseId/discussions"
        element={
          <ProtectedRoute allowedRoles={["applicant"]}>
            <CourseDiscussions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/flashcards"
        element={
          <ProtectedRoute allowedRoles={["applicant"]}>
            <Flashcards />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mock-exam"
        element={
          <ProtectedRoute allowedRoles={["applicant"]}>
            <MockExamList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mock-exam/:examId"
        element={
          <ProtectedRoute allowedRoles={["applicant"]}>
            <MockExamRunner />
          </ProtectedRoute>
        }
      />
      <Route
        path="/progress"
        element={
          <ProtectedRoute allowedRoles={["applicant"]}>
            <StudentProgress />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute allowedRoles={["applicant"]}>
            <StudentNotifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-tutor"
        element={
          <ProtectedRoute allowedRoles={["applicant"]}>
            <StudentAITutor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute allowedRoles={["applicant"]}>
            <StudentSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/time-blocking"
        element={
          <ProtectedRoute allowedRoles={["applicant"]}>
            <TimeBlocking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/spaced-repetition"
        element={
          <ProtectedRoute allowedRoles={["applicant"]}>
            <SpacedRepetition />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute allowedRoles={["applicant"]}>
            <LearningAnalytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor-chat"
        element={
          <ProtectedRoute allowedRoles={["applicant"]}>
            <InstructorChat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-coach"
        element={
          <ProtectedRoute allowedRoles={["applicant"]}>
            <AIStudyCoach />
          </ProtectedRoute>
        }
      />
      <Route
        path="/achievements"
        element={
          <ProtectedRoute allowedRoles={["applicant"]}>
            <Achievements />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reporting"
        element={
          <ProtectedRoute allowedRoles={["applicant"]}>
            <Reporting />
          </ProtectedRoute>
        }
      />
      <Route
        path="/learning"
        element={
          <ProtectedRoute allowedRoles={["applicant"]}>
            <Learning />
          </ProtectedRoute>
        }
      />
      <Route
        path="/discussions"
        element={
          <ProtectedRoute allowedRoles={["applicant"]}>
            <Discussions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor-profile/:instructorId"
        element={
          <ProtectedRoute allowedRoles={["applicant"]}>
            <InstructorProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor"
        element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <InstructorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/courses"
        element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <InstructorCourses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/courses/:courseId"
        element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <CourseEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/courses/:courseId/students"
        element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <CourseStudents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/ai-tools"
        element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <InstructorAI />
          </ProtectedRoute>
        }
      />
      <Route
        path="/syllabus-upload"
        element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <SyllabusUpload />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/create-course"
        element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <CreateCourse />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/analytics"
        element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <InstructorAnalytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/settings"
        element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <InstructorSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/content"
        element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <InstructorContent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/notifications"
        element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <InstructorNotifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/students"
        element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <AllStudents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/curriculum"
        element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <InstructorCurriculum />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/assignments"
        element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <InstructorAssignments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/quizzes"
        element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <InstructorQuizzes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/discussions"
        element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <InstructorDiscussions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/announcements"
        element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <InstructorAnnouncements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/flashcards"
        element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <InstructorFlashcards />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/leaderboard"
        element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <InstructorLeaderboard />
          </ProtectedRoute>
        }
      />
      {/* duplicate removed */}

      <Route
        path="/university"
        element={
          <ProtectedRoute allowedRoles={["university"]}>
            <UniversityDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/university/departments"
        element={
          <ProtectedRoute allowedRoles={["university"]}>
            <UniversityDepartments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/university/instructors"
        element={
          <ProtectedRoute allowedRoles={["university"]}>
            <UniversityInstructors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/university/students"
        element={
          <ProtectedRoute allowedRoles={["university"]}>
            <UniversityStudents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/university/courses"
        element={
          <ProtectedRoute allowedRoles={["university"]}>
            <UniversityCourses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/university/analytics"
        element={
          <ProtectedRoute allowedRoles={["university"]}>
            <UniversityAnalytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/university/settings"
        element={
          <ProtectedRoute allowedRoles={["university"]}>
            <UniversitySettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/university/terms"
        element={
          <ProtectedRoute allowedRoles={["university"]}>
            <UniversityAcademicTerms />
          </ProtectedRoute>
        }
      />
      <Route
        path="/university/sections"
        element={
          <ProtectedRoute allowedRoles={["university"]}>
            <UniversitySections />
          </ProtectedRoute>
        }
      />
      <Route
        path="/university/enrollment"
        element={
          <ProtectedRoute allowedRoles={["university"]}>
            <UniversityEnrollment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/university/exams"
        element={
          <ProtectedRoute allowedRoles={["university"]}>
            <UniversityExams />
          </ProtectedRoute>
        }
      />
      <Route
        path="/university/announcements"
        element={
          <ProtectedRoute allowedRoles={["university"]}>
            <UniversityAnnouncements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/university/content"
        element={
          <ProtectedRoute allowedRoles={["university"]}>
            <UniversityContentLibrary />
          </ProtectedRoute>
        }
      />
      <Route
        path="/university/reports"
        element={
          <ProtectedRoute allowedRoles={["university"]}>
            <UniversityReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/university/ai-insights"
        element={
          <ProtectedRoute allowedRoles={["university"]}>
            <UniversityAIInsights />
          </ProtectedRoute>
        }
      />
      <Route
        path="/university/roles"
        element={
          <ProtectedRoute allowedRoles={["university"]}>
            <UniversityRoles />
          </ProtectedRoute>
        }
      />
      <Route
        path="/university/*"
        element={
          <ProtectedRoute allowedRoles={["university"]}>
            <UniversityDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/courses"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminCourses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/enrollments"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminEnrollments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminAnalytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminSettings />
          </ProtectedRoute>
        }
      />

      {/* HR routes */}
      <Route
        path="/hr"
        element={
          <ProtectedRoute allowedRoles={["hr"]}>
            <HRDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/employees"
        element={
          <ProtectedRoute allowedRoles={["hr"]}>
            <HREmployees />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/assignments"
        element={
          <ProtectedRoute allowedRoles={["hr"]}>
            <HRAssignments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/certifications"
        element={
          <ProtectedRoute allowedRoles={["hr"]}>
            <HRCertifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/reports"
        element={
          <ProtectedRoute allowedRoles={["hr"]}>
            <HRReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/ai-insights"
        element={
          <ProtectedRoute allowedRoles={["hr"]}>
            <HRAIInsights />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/settings"
        element={
          <ProtectedRoute allowedRoles={["hr"]}>
            <HRSettings />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    <FloatingCoachButton />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <StudySessionProvider>
            <AppRoutes />
          </StudySessionProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
