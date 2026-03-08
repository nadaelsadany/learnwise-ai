import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, User, BookOpen, Loader2, Eye, EyeOff, Building2, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

type AuthMode = "signin" | "signup";
type AppRole = "applicant" | "instructor" | "university" | "admin";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedRole, setSelectedRole] = useState<AppRole>("applicant");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; fullName?: string }>({});

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: typeof errors = {};

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }

    if (mode === "signup" && !fullName.trim()) {
      newErrors.fullName = "Please enter your full name";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (mode === "signin") {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            variant: "destructive",
            title: "Sign in failed",
            description: error.message === "Invalid login credentials"
              ? "Invalid email or password. Please try again."
              : error.message,
          });
          return;
        }
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate("/");
      } else {
        const { error } = await signUp(email, password, selectedRole, fullName);
        if (error) {
          const message = error.message.includes("already registered")
            ? "This email is already registered. Please sign in instead."
            : error.message;
          toast({
            variant: "destructive",
            title: "Sign up failed",
            description: message,
          });
          return;
        }
        toast({
          title: "Account created!",
          description: "Welcome to Nafea. Let's start learning!",
        });
        navigate("/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary shadow-glow-primary mb-4">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">نافع</h1>
          <p className="text-muted-foreground">منصة التعلم الذكي</p>
        </div>

        <Card className="border-border/50 shadow-soft">
          <CardHeader className="text-center">
            <CardTitle>{mode === "signin" ? "Welcome back" : "Create an account"}</CardTitle>
            <CardDescription>
              {mode === "signin"
                ? "Sign in to continue your learning journey"
                : "Start your learning journey today"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* ── Test Accounts (sign-in only) ── */}
              {mode === "signin" && (
                <div className="rounded-xl border border-border/50 bg-muted/30 p-3 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">
                    Quick Test Login
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Student", email: "student@demo.com", icon: "👨‍🎓", color: "hover:bg-primary/10 hover:text-primary hover:border-primary/40" },
                      { label: "Instructor", email: "instructor@demo.com", icon: "👨‍🏫", color: "hover:bg-accent/10 hover:text-accent-foreground hover:border-accent/40" },
                      { label: "University", email: "university@demo.com", icon: "🏛️", color: "hover:bg-indigo-500/10 hover:text-indigo-600 hover:border-indigo-400/40" },
                      { label: "Admin", email: "admin@demo.com", icon: "🛡️", color: "hover:bg-rose-500/10 hover:text-rose-600 hover:border-rose-400/40" },
                    ].map((acct) => (
                      <button
                        key={acct.label}
                        type="button"
                        onClick={() => {
                          setEmail(acct.email);
                          setPassword("demo1234");
                          setErrors({});
                        }}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg border border-border/50 bg-background text-sm font-medium transition-all",
                          acct.color
                        )}
                      >
                        <span>{acct.icon}</span>
                        {acct.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground text-center">
                    Password: <span className="font-mono font-semibold">demo1234</span>
                  </p>
                </div>
              )}

              {mode === "signup" && (
                <>
                  {/* Role Selection */}
                  <div className="space-y-2">
                    <Label>I am a...</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedRole("applicant")}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                          selectedRole === "applicant"
                            ? "border-primary bg-primary/5 shadow-soft"
                            : "border-border/50 hover:border-primary/50"
                        )}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          selectedRole === "applicant" ? "gradient-primary" : "bg-muted"
                        )}>
                          <User className={cn(
                            "w-6 h-6",
                            selectedRole === "applicant" ? "text-primary-foreground" : "text-muted-foreground"
                          )} />
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-sm">Student</p>
                          <p className="text-xs text-muted-foreground">Learn</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedRole("instructor")}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                          selectedRole === "instructor"
                            ? "border-accent bg-accent/5 shadow-soft"
                            : "border-border/50 hover:border-accent/50"
                        )}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          selectedRole === "instructor" ? "gradient-accent" : "bg-muted"
                        )}>
                          <BookOpen className={cn(
                            "w-6 h-6",
                            selectedRole === "instructor" ? "text-white" : "text-muted-foreground"
                          )} />
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-sm">Instructor</p>
                          <p className="text-xs text-muted-foreground">Teach</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedRole("university")}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                          selectedRole === "university"
                            ? "border-primary bg-primary/5 shadow-soft"
                            : "border-border/50 hover:border-primary/50"
                        )}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          selectedRole === "university" ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}>
                          <Building2 className={cn(
                            "w-6 h-6",
                            selectedRole === "university" ? "text-primary-foreground" : "text-muted-foreground"
                          )} />
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-sm">University</p>
                          <p className="text-xs text-muted-foreground">Manage</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedRole("admin")}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                          selectedRole === "admin"
                            ? "border-rose-500 bg-rose-500/5 shadow-soft"
                            : "border-border/50 hover:border-rose-400/50"
                        )}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          selectedRole === "admin" ? "bg-rose-500 text-white" : "bg-muted"
                        )}>
                          <Shield className={cn(
                            "w-6 h-6",
                            selectedRole === "admin" ? "text-white" : "text-muted-foreground"
                          )} />
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-sm">Admin</p>
                          <p className="text-xs text-muted-foreground">HR / L&D</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={errors.fullName ? "border-destructive" : ""}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-destructive">{errors.fullName}</p>
                    )}
                  </div>
                </>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn("pr-10", errors.password ? "border-destructive" : "")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                variant="gradient"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {mode === "signin" ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  mode === "signin" ? "Sign In" : "Create Account"
                )}
              </Button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {mode === "signin" ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === "signin" ? "signup" : "signin");
                    setErrors({});
                  }}
                  className="ml-1 text-primary font-medium hover:underline"
                >
                  {mode === "signin" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
