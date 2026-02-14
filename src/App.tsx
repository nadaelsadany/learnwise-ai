import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { StudySessionProvider } from "@/components/learning/StudySessionProvider";
import Auth from "./pages/Auth";
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
import StudentNotifications from "./pages/StudentNotifications";
import StudentAITutor from "./pages/StudentAITutor";
import StudentSettings from "./pages/StudentSettings";
import CourseCatalog from "./pages/CourseCatalog";
import SyllabusUpload from "./pages/SyllabusUpload";
import MockExamRunner from "./pages/MockExamRunner";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import LessonPlayer from "./pages/LessonPlayer";
import Flashcards from "./pages/Flashcards";
import NotFound from "./pages/NotFound";
import UniversityDashboard from "./pages/UniversityDashboard";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

// Component to handle role-based redirection for the root route
const RoleBasedRedirect = () => {
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
    return <Navigate to="/auth" replace />;
  }

  // Redirect based on role
  if (role === "instructor") {
    return <InstructorDashboard />;
  }

  if (role === "university") {
    return <UniversityDashboard />;
  }

  return <ApplicantDashboard />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/auth" element={<Auth />} />

      {/* Role-based home route */}
      <Route path="/" element={<RoleBasedRedirect />} />

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

      {/* Instructor routes */}
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
        path="/instructor"
        element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <InstructorDashboard />
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
        path="/syllabus-upload"
        element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <SyllabusUpload />
          </ProtectedRoute>
        }
      />

      <Route
        path="/university"
        element={
          <ProtectedRoute allowedRoles={["university"]}>
            <UniversityDashboard />
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

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
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
