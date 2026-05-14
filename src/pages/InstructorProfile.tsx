import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ApplicantSidebar } from "@/components/layout/ApplicantSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { ArrowLeft, Star, BookOpen, Briefcase, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseCardEnhanced, mockCourses } from "@/components/courses";

const InstructorProfile = () => {
  const { instructorId } = useParams();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock data for the profile
  const profile = {
    name: "Alex Thompson",
    role: "Lead QA Instructor",
    bio: "Passionate about software quality and test automation. With over 10 years in the industry, I help professionals level up their testing skills.",
    experience: "10+ years in QA and Automation. Former Lead SDET at TechCorp.",
    coursesTaught: 12,
    ratings: 4.8,
    reviews: 1240,
    messagingEnabled: true
  };

  const instructorCourses = mockCourses.filter(c => c.instructor === profile.name || c.instructor === "Staff").slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <ApplicantSidebar onCollapse={setSidebarCollapsed} />
      <Header sidebarCollapsed={sidebarCollapsed} userRole="Student" />

      <main className={cn(
        "pt-20 pb-24 px-4 sm:px-6 transition-all duration-300",
        sidebarCollapsed ? "lg:ml-20" : "lg:ml-64",
        "ml-0"
      )}>
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 -ml-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="bg-card rounded-2xl border border-border/50 shadow-soft p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-32 h-32 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-4xl flex-shrink-0 shadow-glow-primary">
                {profile.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="space-y-4 flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">{profile.name}</h1>
                    <p className="text-muted-foreground text-lg">{profile.role}</p>
                  </div>
                  {profile.messagingEnabled && (
                    <Button className="gap-2 gradient-primary shadow-glow-primary">
                      <MessageSquare className="w-4 h-4" /> Message Instructor
                    </Button>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-warning fill-warning" />
                    <span className="font-semibold">{profile.ratings}</span>
                    <span className="text-muted-foreground">({profile.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen className="w-5 h-5" />
                    <span>{profile.coursesTaught} Courses</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50 space-y-6">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-primary" />
                      Bio
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2">
                      <Briefcase className="w-4 h-4 text-primary" />
                      Experience
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{profile.experience}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Courses Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Courses by {profile.name}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {instructorCourses.map((course) => (
                <CourseCardEnhanced
                  key={course.id}
                  course={course}
                  onClick={() => navigate(`/courses/${course.id}`)}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InstructorProfile;
