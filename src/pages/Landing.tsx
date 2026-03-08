import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  Brain,
  Layers,
  Clock,
  Trophy,
  BarChart3,
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
  Check,
  X,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import screenshotStudent from "@/assets/screenshot-student.jpg";
import screenshotInstructor from "@/assets/screenshot-instructor.jpg";
import screenshotUniversity from "@/assets/screenshot-university.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0, 0, 0.2, 1] as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUpChild = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as const } },
};

/* Animated floating orbs for background */
const FloatingOrb = ({ className, delay = 0 }: { className: string; delay?: number }) => (
  <motion.div
    className={`absolute rounded-full pointer-events-none ${className}`}
    animate={{
      y: [0, -30, 0],
      x: [0, 15, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  />
);

/* Animated grid background */
const GridBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" className="text-foreground" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  </div>
);

/* Animated particles */
const Particles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 rounded-full bg-primary/20"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -100, 0],
          opacity: [0, 0.6, 0],
        }}
        transition={{
          duration: 4 + Math.random() * 4,
          repeat: Infinity,
          delay: Math.random() * 4,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

const Landing = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const features = [
    { icon: Brain, title: "AI Study Coach", description: "Personalized study insights and recommendations powered by advanced AI that adapts to your learning style.", color: "from-primary to-primary-glow" },
    { icon: Layers, title: "Smart Flashcards", description: "Spaced repetition system that scientifically improves memory retention and optimizes review timing.", color: "from-accent to-accent-glow" },
    { icon: Clock, title: "Time Blocking Planner", description: "AI-generated study schedules and productivity planning tailored to your energy levels and goals.", color: "from-success to-success" },
    { icon: Trophy, title: "Gamification System", description: "Achievements, streaks, leaderboards, and XP levels that keep you motivated throughout your journey.", color: "from-warning to-warning" },
    { icon: BarChart3, title: "Learning Analytics", description: "Track progress, study habits, and performance insights with beautiful, actionable dashboards.", color: "from-primary to-accent" },
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
    { name: "Sarah Ahmed", role: "Computer Science Student", text: "Nafea completely changed how I study. The AI Coach helps me focus on weak areas and the spaced repetition flashcards boosted my exam scores by 30%.", rating: 5 },
    { name: "Dr. Mohammed Al-Rashid", role: "University Professor", text: "The instructor tools save me hours each week. AI-generated quizzes and real-time student analytics make teaching more effective and data-driven.", rating: 5 },
    { name: "Fatima Hassan", role: "Medical Student", text: "The time blocking planner and gamification keep me consistent. I've maintained a 45-day study streak and my GPA improved significantly.", rating: 5 },
  ];

  const screenshots = [
    { label: "Student Dashboard", img: screenshotStudent },
    { label: "Instructor Portal", img: screenshotInstructor },
    { label: "University Admin", img: screenshotUniversity },
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with smart learning.",
      features: [
        { text: "Up to 3 courses", included: true },
        { text: "Basic AI Study Coach", included: true },
        { text: "50 flashcards/month", included: true },
        { text: "Basic analytics", included: true },
        { text: "Community support", included: true },
        { text: "Time blocking planner", included: false },
        { text: "Advanced AI features", included: false },
        { text: "Priority support", included: false },
      ],
      cta: "Get Started Free",
      popular: false,
    },
    {
      name: "Pro",
      price: "$19",
      period: "/month",
      description: "For serious students who want maximum results.",
      features: [
        { text: "Unlimited courses", included: true },
        { text: "Advanced AI Study Coach", included: true },
        { text: "Unlimited flashcards", included: true },
        { text: "Full analytics dashboard", included: true },
        { text: "Time blocking planner", included: true },
        { text: "Gamification & leaderboards", included: true },
        { text: "Spaced repetition engine", included: true },
        { text: "Priority email support", included: true },
      ],
      cta: "Start Pro Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For universities and institutions at scale.",
      features: [
        { text: "Everything in Pro", included: true },
        { text: "University admin portal", included: true },
        { text: "Department management", included: true },
        { text: "Institutional analytics", included: true },
        { text: "Custom AI model training", included: true },
        { text: "SSO & role management", included: true },
        { text: "API access & integrations", included: true },
        { text: "Dedicated account manager", included: true },
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  const stats = [
    { value: "10,000+", label: "Active Learners" },
    { value: "500+", label: "Courses Created" },
    { value: "2M+", label: "Flashcards Reviewed" },
    { value: "98%", label: "Satisfaction Rate" },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden relative" style={{ background: "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--card)) 25%, hsl(var(--background)) 50%, hsl(var(--card)) 75%, hsl(var(--background)) 100%)" }}>
      {/* Global mesh gradient overlay */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: "radial-gradient(ellipse 80% 60% at 10% 20%, hsl(var(--primary) / 0.04) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 60%, hsl(var(--accent) / 0.05) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 50% 90%, hsl(var(--success) / 0.03) 0%, transparent 60%)"
      }} />
      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] as const }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <span className="text-xl font-bold text-foreground">نافع <span className="text-muted-foreground font-normal text-base">| Nafea</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["features", "students", "instructors", "universities", "pricing"].map((link) => (
              <a key={link} href={`#${link}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors capitalize">{link}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>Sign In</Button>
            <Button size="sm" onClick={() => navigate("/auth")}>Get Started</Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 pb-20 px-6 relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Animated background elements */}
        <GridBackground />
        <Particles />
        <FloatingOrb className="w-[500px] h-[500px] bg-primary/[0.04] blur-[100px] -top-20 -right-20" delay={0} />
        <FloatingOrb className="w-[400px] h-[400px] bg-accent/[0.06] blur-[80px] bottom-0 -left-20" delay={2} />
        <FloatingOrb className="w-[300px] h-[300px] bg-success/[0.04] blur-[60px] top-1/2 right-1/4" delay={4} />

        {/* Animated gradient line */}
        <motion.div
          className="absolute top-20 left-0 right-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), hsl(var(--accent) / 0.3), transparent)",
          }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div className="max-w-7xl mx-auto relative w-full" style={{ y: heroY, opacity: heroOpacity }}>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div className="space-y-8" initial="hidden" animate="visible" variants={staggerContainer}>
              <motion.div variants={fadeUpChild} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                  <Sparkles className="w-4 h-4" />
                </motion.span>
                AI-Powered Learning Platform
              </motion.div>
              <motion.h1 variants={fadeUpChild} className="text-5xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight">
                Study Smarter<br />
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer">
                  with AI
                </span>
              </motion.h1>
              <motion.p variants={fadeUpChild} className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                Nafea helps students and educators improve learning through AI-powered study planning, smart flashcards, and intelligent learning analytics.
              </motion.p>
              <motion.div variants={fadeUpChild} className="flex flex-wrap gap-4">
                <Button size="xl" onClick={() => navigate("/auth")} className="gap-2 shadow-lg shadow-primary/25">
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </Button>
                <Button size="lg" variant="glass" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} className="gap-2">
                  <Play className="w-4 h-4" /> Explore Platform
                </Button>
              </motion.div>
              <motion.div variants={fadeUpChild} className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {["🧑‍🎓", "👩‍🏫", "👨‍💻", "👩‍🔬"].map((emoji, i) => (
                    <motion.div
                      key={i}
                      className="w-10 h-10 rounded-full bg-card border-2 border-background flex items-center justify-center text-lg shadow-soft"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                    >
                      {emoji}
                    </motion.div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">10,000+ learners</p>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-warning text-warning" />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">4.9/5</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Glow behind card */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-success/10 blur-3xl rounded-full scale-110" />

              <div className="relative rounded-2xl border border-border/50 bg-card/90 backdrop-blur-sm shadow-elevated p-6 space-y-4">
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
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      className={`rounded-xl p-3 ${stat.color}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                    >
                      <p className="text-xs opacity-70">{stat.label}</p>
                      <p className="text-lg font-bold">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="h-32 rounded-xl bg-muted/30 flex items-center justify-center overflow-hidden relative">
                  {/* Animated chart bars */}
                  <div className="flex items-end gap-2 h-24 px-4">
                    {[40, 60, 35, 80, 55, 70, 90, 50, 75, 65].map((h, i) => (
                      <motion.div
                        key={i}
                        className="w-4 rounded-t bg-primary/30"
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 0.8 + i * 0.05, duration: 0.5, ease: [0, 0, 0.2, 1] as const }}
                      />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-20 rounded-xl bg-primary/5 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-foreground">AI Coach</span>
                    </div>
                    <div className="h-2 rounded-full bg-primary/20 overflow-hidden">
                      <motion.div className="h-2 rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: "75%" }} transition={{ delay: 1, duration: 0.8 }} />
                    </div>
                  </div>
                  <div className="h-20 rounded-xl bg-accent/5 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Layers className="w-4 h-4 text-accent" />
                      <span className="text-xs font-medium text-foreground">Flashcards</span>
                    </div>
                    <div className="h-2 rounded-full bg-accent/20 overflow-hidden">
                      <motion.div className="h-2 rounded-full bg-accent" initial={{ width: 0 }} animate={{ width: "50%" }} transition={{ delay: 1.1, duration: 0.8 }} />
                    </div>
                  </div>
                </div>
              </div>
              <motion.div
                className="absolute -top-4 -right-4 bg-success text-success-foreground px-4 py-2 rounded-xl shadow-soft text-sm font-semibold flex items-center gap-2"
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
              >
                <Zap className="w-4 h-4" /> 72% Ready
              </motion.div>
              <motion.div
                className="absolute -bottom-3 -left-3 bg-card border border-border/50 px-3 py-1.5 rounded-lg shadow-soft text-xs font-medium text-foreground flex items-center gap-2"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, type: "spring" }}
              >
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" /> AI Coach Active
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 px-6 border-y border-border/50 bg-card/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] via-accent/[0.02] to-success/[0.02]" />
        <motion.div
          className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={fadeUpChild} className="text-center">
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 relative overflow-hidden">
        <FloatingOrb className="w-[300px] h-[300px] bg-accent/[0.04] blur-[80px] top-20 -right-20" delay={1} />
        <div className="max-w-7xl mx-auto relative">
          <motion.div className="text-center mb-16 space-y-4" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20">
              <Sparkles className="w-4 h-4" /> Platform Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Everything You Need to Learn Effectively</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Powerful AI-driven tools designed to transform how you study, teach, and manage education.</p>
          </motion.div>

          <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            {features.map((feature) => (
              <motion.div key={feature.title} variants={fadeUpChild}>
                <Card className="group border-border/50 hover:shadow-elevated transition-all duration-300 hover:-translate-y-2 bg-card/80 backdrop-blur-sm h-full relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`} />
                  <CardContent className="p-6 space-y-4 relative">
                    <motion.div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-soft`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <feature.icon className="w-6 h-6 text-primary-foreground" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* For Students */}
      <section id="students" className="py-24 px-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.03) 0%, hsl(var(--card) / 0.5) 50%, hsl(var(--accent) / 0.02) 100%)" }}>
        <FloatingOrb className="w-[400px] h-[400px] bg-primary/[0.03] blur-[80px] -top-20 left-1/4" delay={3} />
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div className="space-y-8" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                <GraduationCap className="w-4 h-4" /> For Students
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">Achieve More with <span className="text-primary">Smarter Study</span></h2>
              <p className="text-muted-foreground text-lg leading-relaxed">Nafea empowers students with AI-driven tools that personalize learning, boost retention, and build lasting study habits.</p>
              <ul className="space-y-3">
                {studentBenefits.map((benefit, i) => (
                  <motion.li
                    key={benefit}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-success mt-0.5 shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
              <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">Start Learning <ArrowRight className="w-4 h-4" /></Button>
            </motion.div>
            <motion.div className="relative" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* For Instructors */}
      <section id="instructors" className="py-24 px-6 relative overflow-hidden">
        <FloatingOrb className="w-[350px] h-[350px] bg-accent/[0.04] blur-[80px] bottom-0 right-0" delay={2} />
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div className="order-2 lg:order-1 relative" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
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
            </motion.div>
            <motion.div className="order-1 lg:order-2 space-y-8" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20">
                <Users className="w-4 h-4" /> For Instructors
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">Teach Smarter with <span className="text-accent">AI Tools</span></h2>
              <p className="text-muted-foreground text-lg leading-relaxed">Powerful instructor tools that save time, improve engagement, and provide deep insights into student performance.</p>
              <ul className="space-y-3">
                {instructorCapabilities.map((cap, i) => (
                  <motion.li
                    key={cap}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-foreground">{cap}</span>
                  </motion.li>
                ))}
              </ul>
              <Button variant="accent" size="lg" onClick={() => navigate("/auth")} className="gap-2">Start Teaching <ArrowRight className="w-4 h-4" /></Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* For Universities */}
      <section id="universities" className="py-24 px-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(var(--success) / 0.03) 0%, hsl(var(--card) / 0.5) 50%, hsl(var(--primary) / 0.02) 100%)" }}>
        <FloatingOrb className="w-[350px] h-[350px] bg-success/[0.04] blur-[80px] top-10 -left-20" delay={1.5} />
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div className="space-y-8" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium border border-success/20">
                <Building2 className="w-4 h-4" /> For Universities
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">Scale Education with <span className="text-success">Intelligence</span></h2>
              <p className="text-muted-foreground text-lg leading-relaxed">Comprehensive administration tools for managing departments, tracking performance, and leveraging AI for excellence.</p>
              <ul className="space-y-3">
                {universityFeatures.map((feat, i) => (
                  <motion.li
                    key={feat}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-success mt-0.5 shrink-0" />
                    <span className="text-foreground">{feat}</span>
                  </motion.li>
                ))}
              </ul>
              <Button variant="success" size="lg" onClick={() => navigate("/auth")} className="gap-2">Get Started <ArrowRight className="w-4 h-4" /></Button>
            </motion.div>
            <motion.div className="relative" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Screenshots */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <motion.div className="text-center mb-16 space-y-4" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">See the Platform in Action</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Explore the powerful interfaces designed for every role in the education ecosystem.</p>
          </motion.div>
          <motion.div className="grid md:grid-cols-3 gap-6" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            {screenshots.map((screen) => (
              <motion.div key={screen.label} variants={fadeUpChild} className="group">
                <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-card hover:shadow-elevated transition-all duration-500 hover:-translate-y-2">
                  <div className="aspect-video overflow-hidden">
                    <img src={screen.img} alt={screen.label} className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-sm font-semibold text-foreground">{screen.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-muted/30 relative overflow-hidden">
        <FloatingOrb className="w-[400px] h-[400px] bg-primary/[0.03] blur-[100px] -top-20 right-1/4" delay={2} />
        <div className="max-w-7xl mx-auto relative">
          <motion.div className="text-center mb-16 space-y-4" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              <Crown className="w-4 h-4" /> Pricing Plans
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Choose the plan that fits your learning journey. Upgrade anytime as you grow.</p>
          </motion.div>

          <motion.div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            {pricingPlans.map((plan) => (
              <motion.div key={plan.name} variants={fadeUpChild}>
                <Card className={`relative overflow-hidden transition-all duration-300 hover:-translate-y-2 h-full ${
                  plan.popular
                    ? "border-primary shadow-lg shadow-primary/10 scale-[1.02]"
                    : "border-border/50 hover:shadow-elevated"
                }`}>
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                  )}
                  <CardContent className="p-8 space-y-6">
                    <div>
                      {plan.popular && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                          <Zap className="w-3 h-3" /> Most Popular
                        </span>
                      )}
                      <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                        <span className="text-muted-foreground">{plan.period}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                    </div>

                    <Button
                      className="w-full gap-2"
                      variant={plan.popular ? "default" : "outline"}
                      size="lg"
                      onClick={() => navigate("/auth")}
                    >
                      {plan.cta} {plan.popular && <ArrowRight className="w-4 h-4" />}
                    </Button>

                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature.text} className="flex items-start gap-3">
                          {feature.included ? (
                            <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                          ) : (
                            <X className="w-4 h-4 text-muted-foreground/40 mt-0.5 shrink-0" />
                          )}
                          <span className={`text-sm ${feature.included ? "text-foreground" : "text-muted-foreground/60"}`}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <motion.div className="text-center mb-16 space-y-4" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Loved by Learners & Educators</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">See how Nafea is transforming the learning experience for thousands of users.</p>
          </motion.div>
          <motion.div className="grid md:grid-cols-3 gap-6" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={fadeUpChild}>
                <Card className="border-border/50 bg-card h-full hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex gap-1">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                      ))}
                    </div>
                    <p className="text-foreground leading-relaxed italic">"{t.text}"</p>
                    <div className="flex items-center gap-3 pt-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <span className="text-sm font-semibold text-foreground">{t.name[0]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section className="py-24 px-6 relative overflow-hidden" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
        <div className="max-w-4xl mx-auto relative">
          <div className="rounded-3xl relative overflow-hidden border border-border/50 p-12 md:p-16 text-center space-y-8">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-success/10" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-accent/10 via-transparent to-primary/10"
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">Start Learning Smarter Today</h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">Join thousands of students, instructors, and universities already using Nafea to transform education.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="xl" onClick={() => navigate("/auth")} className="gap-2 shadow-lg shadow-primary/25">Create Account <ArrowRight className="w-5 h-5" /></Button>
                <Button size="lg" variant="glass" className="gap-2">Request Demo <ChevronRight className="w-4 h-4" /></Button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

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
              <p className="text-sm text-muted-foreground leading-relaxed">AI-powered learning platform that helps students study smarter and educators teach better.</p>
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
              <Globe className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
              <Shield className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
