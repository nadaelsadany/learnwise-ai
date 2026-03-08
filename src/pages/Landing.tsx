import { useNavigate } from "react-router-dom";
import {
  Brain,
  Layers,
  Clock,
  Trophy,
  BarChart3,
  BookOpen,
  Users,
  Building2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Star,
  GraduationCap,
  Zap,
  Shield,
  Globe,
  ChevronRight,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI Study Coach",
      description: "Personalized study insights and recommendations powered by advanced AI that adapts to your learning style.",
      color: "from-primary to-primary-glow",
    },
    {
      icon: Layers,
      title: "Smart Flashcards",
      description: "Spaced repetition system that scientifically improves memory retention and optimizes review timing.",
      color: "from-accent to-accent-glow",
    },
    {
      icon: Clock,
      title: "Time Blocking Planner",
      description: "AI-generated study schedules and productivity planning tailored to your energy levels and goals.",
      color: "from-success to-success",
    },
    {
      icon: Trophy,
      title: "Gamification System",
      description: "Achievements, streaks, leaderboards, and XP levels that keep you motivated throughout your journey.",
      color: "from-warning to-warning",
    },
    {
      icon: BarChart3,
      title: "Learning Analytics",
      description: "Track progress, study habits, and performance insights with beautiful, actionable dashboards.",
      color: "from-primary to-accent",
    },
  ];

  const studentBenefits = [
    "Organize study sessions with AI-powered scheduling",
    "Improve memory retention with spaced repetition",
    "Track progress with detailed analytics dashboards",
    "Stay motivated with achievements and streaks",
    "Get personalized recommendations from AI Coach",
    "Practice with smart flashcards and mock exams",
  ];

  const instructorCapabilities = [
    "Create and manage courses with rich content",
    "Generate quizzes and assessments with AI",
    "Monitor student performance in real-time",
    "Manage assignments and grading workflows",
    "Facilitate discussions and announcements",
    "Access detailed teaching analytics",
  ];

  const universityFeatures = [
    "Manage departments and instructor assignments",
    "Track institutional academic performance",
    "Generate comprehensive reports and exports",
    "Analyze learning trends with AI insights",
    "Manage enrollment and academic terms",
    "Centralized content library management",
  ];

  const testimonials = [
    {
      name: "Sarah Ahmed",
      role: "Computer Science Student",
      text: "Nafea completely changed how I study. The AI Coach helps me focus on weak areas and the spaced repetition flashcards boosted my exam scores by 30%.",
      rating: 5,
    },
    {
      name: "Dr. Mohammed Al-Rashid",
      role: "University Professor",
      text: "The instructor tools save me hours each week. AI-generated quizzes and real-time student analytics make teaching more effective and data-driven.",
      rating: 5,
    },
    {
      name: "Fatima Hassan",
      role: "Medical Student",
      text: "The time blocking planner and gamification keep me consistent. I've maintained a 45-day study streak and my GPA improved significantly.",
      rating: 5,
    },
  ];

  const screenshots = [
    { label: "Student Dashboard", icon: BookOpen },
    { label: "Instructor Portal", icon: Users },
    { label: "University Admin", icon: Building2 },
    { label: "AI Study Coach", icon: Brain },
    { label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">نافع <span className="text-muted-foreground font-normal text-base">| Nafea</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#students" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Students</a>
            <a href="#instructors" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Instructors</a>
            <a href="#universities" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Universities</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
            <Button size="sm" onClick={() => navigate("/auth")}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                AI-Powered Learning Platform
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Study Smarter
                <br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  with AI
                </span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Nafea helps students and educators improve learning through AI-powered study planning, smart flashcards, and intelligent learning analytics.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => {
                  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
                }} className="gap-2">
                  <Play className="w-4 h-4" /> Explore Platform
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                      <span className="text-xs font-medium text-muted-foreground">{String.fromCharCode(64 + i)}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">10,000+ learners</p>
                  <p className="text-xs text-muted-foreground">Already studying smarter</p>
                </div>
              </div>
            </div>

            {/* Hero Visual - Dashboard Preview */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl border border-border/50 bg-card shadow-elevated p-6 space-y-4">
                {/* Mini dashboard mockup */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-warning/60" />
                  <div className="w-3 h-3 rounded-full bg-success/60" />
                  <div className="flex-1 h-6 rounded-md bg-muted/50 mx-8" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Study Streak", value: "12 days", color: "bg-warning/10 text-warning" },
                    { label: "Questions", value: "342", color: "bg-primary/10 text-primary" },
                    { label: "Study Hours", value: "18.5h", color: "bg-success/10 text-success" },
                  ].map((stat) => (
                    <div key={stat.label} className={`rounded-xl p-3 ${stat.color}`}>
                      <p className="text-xs opacity-70">{stat.label}</p>
                      <p className="text-lg font-bold">{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="h-32 rounded-xl bg-muted/30 flex items-center justify-center">
                  <BarChart3 className="w-12 h-12 text-muted-foreground/30" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-20 rounded-xl bg-primary/5 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-foreground">AI Coach</span>
                    </div>
                    <div className="h-2 rounded-full bg-primary/20">
                      <div className="h-2 rounded-full bg-primary w-3/4" />
                    </div>
                  </div>
                  <div className="h-20 rounded-xl bg-accent/5 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Layers className="w-4 h-4 text-accent" />
                      <span className="text-xs font-medium text-foreground">Flashcards</span>
                    </div>
                    <div className="h-2 rounded-full bg-accent/20">
                      <div className="h-2 rounded-full bg-accent w-1/2" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-success text-success-foreground px-4 py-2 rounded-xl shadow-soft text-sm font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4" /> 72% Ready
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
              <Sparkles className="w-4 h-4" /> Platform Features
            </div>
            <h2 className="text-4xl font-bold text-foreground">Everything You Need to Learn Effectively</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Powerful AI-driven tools designed to transform how you study, teach, and manage education.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="group border-border/50 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 bg-card">
                <CardContent className="p-6 space-y-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* For Students */}
      <section id="students" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <GraduationCap className="w-4 h-4" /> For Students
              </div>
              <h2 className="text-4xl font-bold text-foreground">
                Achieve More with <span className="text-primary">Smarter Study</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Nafea empowers students with AI-driven tools that personalize learning, boost retention, and build lasting study habits.
              </p>
              <ul className="space-y-3">
                {studentBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success mt-0.5 shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button onClick={() => navigate("/auth")} className="gap-2">
                Start Learning <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="relative">
              <div className="rounded-2xl border border-border/50 bg-card shadow-card p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Student Dashboard</p>
                    <p className="text-sm text-muted-foreground">Track your learning journey</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {["Review Test Design Techniques", "Practice Equivalence Partitioning", "Chapter 4 Quiz"].map((task, i) => (
                    <div key={task} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                      <div className={`w-5 h-5 rounded-full border-2 ${i < 2 ? "bg-success border-success" : "border-border"} flex items-center justify-center`}>
                        {i < 2 && <CheckCircle2 className="w-3 h-3 text-success-foreground" />}
                      </div>
                      <span className={`text-sm ${i < 2 ? "text-muted-foreground line-through" : "text-foreground"}`}>{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Instructors */}
      <section id="instructors" className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="rounded-2xl border border-border/50 bg-card shadow-card p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
                    <Users className="w-7 h-7 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Instructor Portal</p>
                    <p className="text-sm text-muted-foreground">Manage courses and students</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Active Courses", value: "12" },
                    { label: "Students", value: "248" },
                    { label: "Completion", value: "87%" },
                    { label: "Avg Score", value: "78%" },
                  ].map((stat) => (
                    <div key={stat.label} className="p-3 rounded-xl bg-muted/50 text-center">
                      <p className="text-xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
                <Users className="w-4 h-4" /> For Instructors
              </div>
              <h2 className="text-4xl font-bold text-foreground">
                Teach Smarter with <span className="text-accent">AI Tools</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Powerful instructor tools that save time, improve engagement, and provide deep insights into student performance.
              </p>
              <ul className="space-y-3">
                {instructorCapabilities.map((cap) => (
                  <li key={cap} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-foreground">{cap}</span>
                  </li>
                ))}
              </ul>
              <Button variant="accent" onClick={() => navigate("/auth")} className="gap-2">
                Start Teaching <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* For Universities */}
      <section id="universities" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium">
                <Building2 className="w-4 h-4" /> For Universities
              </div>
              <h2 className="text-4xl font-bold text-foreground">
                Scale Education with <span className="text-success">Institutional Intelligence</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Comprehensive administration tools that help universities manage departments, track performance, and leverage AI for academic excellence.
              </p>
              <ul className="space-y-3">
                {universityFeatures.map((feat) => (
                  <li key={feat} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success mt-0.5 shrink-0" />
                    <span className="text-foreground">{feat}</span>
                  </li>
                ))}
              </ul>
              <Button variant="success" onClick={() => navigate("/auth")} className="gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="relative">
              <div className="rounded-2xl border border-border/50 bg-card shadow-card p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-success" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">University Admin</p>
                    <p className="text-sm text-muted-foreground">Institutional management</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Departments", value: "8" },
                    { label: "Instructors", value: "64" },
                    { label: "Students", value: "2,400" },
                  ].map((stat) => (
                    <div key={stat.label} className="p-3 rounded-xl bg-muted/50 text-center">
                      <p className="text-xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Screenshots */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-foreground">See the Platform in Action</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Explore the powerful interfaces designed for every role in the education ecosystem.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {screenshots.map((screen) => (
              <div key={screen.label} className="group rounded-2xl border border-border/50 bg-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 p-6 flex flex-col items-center gap-4 cursor-pointer">
                <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <screen.icon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm font-medium text-foreground text-center">{screen.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-foreground">Loved by Learners & Educators</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              See how Nafea is transforming the learning experience for thousands of users.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-border/50 bg-card">
                <CardContent className="p-6 space-y-4">
                  <div className="flex gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-foreground leading-relaxed">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-sm font-semibold text-muted-foreground">{t.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-success/10 border border-border/50 p-12 md:p-16 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Start Learning Smarter Today
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Join thousands of students, instructors, and universities already using Nafea to transform their educational experience.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
                Create Account <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                Request Demo <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-foreground">نافع | Nafea</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI-powered learning platform that helps students study smarter and educators teach better.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground transition-colors cursor-pointer">AI Study Coach</li>
                <li className="hover:text-foreground transition-colors cursor-pointer">Smart Flashcards</li>
                <li className="hover:text-foreground transition-colors cursor-pointer">Time Blocking</li>
                <li className="hover:text-foreground transition-colors cursor-pointer">Analytics</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Solutions</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground transition-colors cursor-pointer">For Students</li>
                <li className="hover:text-foreground transition-colors cursor-pointer">For Instructors</li>
                <li className="hover:text-foreground transition-colors cursor-pointer">For Universities</li>
                <li className="hover:text-foreground transition-colors cursor-pointer">Enterprise</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground transition-colors cursor-pointer">Help Center</li>
                <li className="hover:text-foreground transition-colors cursor-pointer">Contact Us</li>
                <li className="hover:text-foreground transition-colors cursor-pointer">Privacy Policy</li>
                <li className="hover:text-foreground transition-colors cursor-pointer">Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2026 Nafea. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <Shield className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
