import {
    LayoutDashboard,
    Users,
    BookOpen,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    BarChart2,
    Award,
    Briefcase,
    Sparkles,
    FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
 
interface SidebarProps {
    onCollapse?: (collapsed: boolean) => void;
}
 
const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/hr" },
    { icon: Users, label: "Employees", path: "/hr/employees" },
    { icon: BookOpen, label: "Learning & Career Paths", path: "/hr/assignments" },
    { icon: Sparkles, label: "AI Recommendations", path: "/hr/ai-insights" },
    { icon: Award, label: "Progress Tracking", path: "/hr/certifications" },
    { icon: BarChart2, label: "Performance Insights", path: "/hr/performance" },
    { icon: FileText, label: "Reports", path: "/hr/reports" },
];

export const HRSidebarContent = ({ collapsed }: { collapsed: boolean }) => {
    const location = useLocation();
    const { signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate("/auth");
    };

    return (
        <div className="flex flex-col h-full bg-card/50 backdrop-blur-xl border-r border-border/50">
            <div className={cn(
                "p-6 flex items-center gap-3",
                collapsed ? "justify-center px-2" : ""
            )}>
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-white" />
                </div>
                {!collapsed && (
                    <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-500">
                        HRAI Portal
                    </span>
                )}
            </div>

            <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto scrollbar-none">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        item.path === "/hr"
                            ? location.pathname === "/hr"
                            : location.pathname.startsWith(item.path);

                    return (
                        <Link to={item.path} key={item.path}>
                            <Button
                                variant={isActive ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start gap-3 transition-all duration-300",
                                    isActive && "bg-indigo-600/10 text-indigo-600 hover:bg-indigo-600/20",
                                    collapsed ? "justify-center px-2" : "px-4"
                                )}
                            >
                                <Icon className={cn("w-5 h-5", isActive && "text-indigo-600")} />
                                {!collapsed && <span>{item.label}</span>}
                            </Button>
                        </Link>
                    );
                })}
            </div>

            <div className="px-3 pb-2">
                <Link to="/hr/settings">
                    <Button
                        variant={location.pathname === "/hr/settings" ? "secondary" : "ghost"}
                        className={cn(
                            "w-full justify-start gap-3 transition-all duration-300",
                            location.pathname === "/hr/settings" && "bg-indigo-600/10 text-indigo-600",
                            collapsed ? "justify-center px-2" : "px-4"
                        )}
                    >
                        <Settings className={cn("w-5 h-5", location.pathname === "/hr/settings" && "text-indigo-600")} />
                        {!collapsed && <span>Settings</span>}
                    </Button>
                </Link>
            </div>

            <div className="p-4 border-t border-border/50">
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10",
                        collapsed ? "justify-center px-2" : "px-4"
                    )}
                    onClick={handleSignOut}
                >
                    <LogOut className="w-5 h-5" />
                    {!collapsed && <span>Sign Out</span>}
                </Button>
            </div>
        </div>
    );
};

export const HRSidebar = ({ onCollapse }: SidebarProps) => {
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        onCollapse?.(collapsed);
    }, [collapsed, onCollapse]);

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 h-screen z-40 hidden lg:block transition-all duration-300",
                    collapsed ? "w-20" : "w-64"
                )}
            >
                <HRSidebarContent collapsed={collapsed} />

                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -right-4 top-8 w-8 h-8 rounded-full border bg-background shadow-md z-50 hover:bg-accent"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <ChevronLeft className="w-4 h-4" />
                    )}
                </Button>
            </aside>
        </>
    );
};
