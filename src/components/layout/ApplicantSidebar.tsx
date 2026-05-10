import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Brain,
  FileQuestion,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronDown,
  Sparkles,
  GraduationCap,
  LogOut,
  CalendarDays,
  RotateCcw,
  Award,
  Bell,
  User,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface NavSubItem {
  label: string;
  href?: string;
  action?: string;
  icon: React.ElementType;
}

interface NavGroup {
  icon: React.ElementType;
  label: string;
  href?: string;
  badge?: string;
  subItems?: NavSubItem[];
}

const navItems: NavGroup[] = [
  { 
    icon: LayoutDashboard, 
    label: "Overview", 
    subItems: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
      { label: "Achievements", href: "/achievements", icon: Award },
    ] 
  },
  { 
    icon: BookOpen, 
    label: "Learning", 
    href: "/learning"
  },
  { 
    icon: Brain, 
    label: "Practice", 
    subItems: [
      { label: "Flashcards", href: "/flashcards", icon: Brain },
      { label: "Mock Exams", href: "/mock-exam", icon: FileQuestion },
      { label: "Spaced Repetition", href: "/spaced-repetition", icon: RotateCcw },
      { label: "Time Blocking", href: "/time-blocking", icon: CalendarDays },
    ] 
  },
  { 
    icon: Sparkles, 
    label: "AI Coach", 
    subItems: [
      { label: "AI Tutor", href: "/ai-tutor", icon: Sparkles },
      { label: "AI Coach", href: "/ai-coach", icon: Brain },
    ] 
  },
  { icon: FileText, label: "Reporting", href: "/reporting" },
  { 
    icon: User, 
    label: "Account", 
    subItems: [
      { label: "My Profile", href: "/profile", icon: User },
      { label: "Notifications", href: "/notifications", icon: Bell },
      { label: "Settings", href: "/settings", icon: Settings },
      { label: "Sign Out", action: "sign-out", icon: LogOut },
    ] 
  },
];

interface SidebarContentProps {
  collapsed?: boolean;
  onItemClick?: () => void;
  className?: string;
}

export const ApplicantSidebarContent = ({ collapsed, onItemClick, className }: SidebarContentProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Automatically expand groups that contain the active route
  useEffect(() => {
    navItems.forEach(group => {
      if (group.subItems?.some(sub => sub.href === location.pathname)) {
        setExpandedItems(prev => prev.includes(group.label) ? prev : [...prev, group.label]);
      }
    });
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    onItemClick?.();
  };

  const toggleExpand = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  return (
    <div className={cn("flex flex-col h-full bg-card", className)}>
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-border/50">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-glow-primary">
          <GraduationCap className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in text-left">
            <h1 className="font-bold text-lg">Nafea</h1>
            <p className="text-xs text-muted-foreground">Student Portal</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((group) => {
          const isGroupActive = group.href === location.pathname || 
                                group.subItems?.some(sub => sub.href === location.pathname);
          const isExpanded = expandedItems.includes(group.label);

          return (
            <div key={group.label} className="space-y-1">
              <button
                onClick={() => {
                  if (group.subItems) {
                    toggleExpand(group.label);
                  } else if (group.href) {
                    handleNavigate(group.href);
                  }
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group/item relative",
                  group.href === location.pathname
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : isGroupActive && !isExpanded && !collapsed
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <group.icon className={cn(
                  "w-5 h-5 flex-shrink-0 transition-transform",
                  !isGroupActive && "group-hover/item:scale-110"
                )} />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left text-sm font-medium animate-fade-in">
                      {group.label}
                    </span>
                    {group.subItems && (
                      <ChevronDown className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        isExpanded ? "rotate-180" : ""
                      )} />
                    )}
                  </>
                )}
                {collapsed && isGroupActive && (
                  <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
                )}
              </button>

              {!collapsed && group.subItems && isExpanded && (
                <div className="ml-4 pl-4 border-l border-border/50 space-y-1 animate-accordion-down">
                  {group.subItems.map((sub) => {
                    const isSubActive = location.pathname === sub.href;
                    return (
                      <button
                        key={sub.label}
                        onClick={() => {
                          if (sub.action === "sign-out") {
                            handleSignOut();
                          } else if (sub.href) {
                            handleNavigate(sub.href);
                          }
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm",
                          isSubActive
                            ? "text-primary font-semibold bg-primary/5"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <sub.icon className="w-4 h-4" />
                        <span>{sub.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

interface SidebarProps {
  onCollapse?: (collapsed: boolean) => void;
}

export const ApplicantSidebar = ({ onCollapse }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    onCollapse?.(newState);
  };

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen bg-card border-r border-border/50 shadow-soft z-40 transition-all duration-300 flex-col hidden lg:flex",
      collapsed ? "w-20" : "w-64"
    )}>
      <ApplicantSidebarContent collapsed={collapsed} />

      {/* Collapse Button */}
      <div className="p-3 border-t border-border/50">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleCollapse}
          className="w-full justify-center"
        >
          <ChevronLeft className={cn(
            "w-4 h-4 transition-transform",
            collapsed && "rotate-180"
          )} />
        </Button>
      </div>
    </aside>
  );
};

