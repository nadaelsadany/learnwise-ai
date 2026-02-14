import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, User, BookOpen, Loader2, Eye, EyeOff, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

type AuthMode = "signin" | "signup";
type AppRole = "applicant" | "instructor" | "university";

const emailSchema = z.string().email("Please enter a valid email address");
// ... (keep existing code)

// ... inside the component, inside the grid
<div className="space-y-2">
  <Label>I am a...</Label>
  <div className="grid grid-cols-3 gap-3">
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
  </div>
</div>

{/* Full Name */ }
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

{/* Email */ }
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

{/* Password */ }
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

{/* Submit Button */ }
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
            </form >

  {/* Toggle Mode */ }
  < div className = "mt-6 text-center" >
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
            </div >
          </CardContent >
        </Card >
      </div >
    </div >
  );
};

export default Auth;
