import { Bell, Search, User, Menu, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  userName?: string;
  userRole?: string;
  sidebarCollapsed?: boolean;
  mobileSidebar?: React.ReactNode;
}

export const Header = ({
  userName = "Alex Johnson",
  userRole = "Student",
  sidebarCollapsed = false,
  mobileSidebar
}: HeaderProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <header className={cn(
      "fixed top-0 right-0 h-16 bg-card/80 backdrop-blur-xl border-b border-border/50 z-30 flex items-center justify-between px-4 sm:px-6 transition-all duration-300",
      sidebarCollapsed ? "lg:left-20" : "lg:left-64",
      "left-0"
    )}>
      {/* Left side: Mobile Menu & Search */}
      <div className="flex items-center gap-4 flex-1">
        {mobileSidebar && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 border-none">
              {mobileSidebar}
            </SheetContent>
          </Sheet>
        )}

        <div className="flex-1 max-w-md hidden xs:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-primary/10 hover:text-primary transition-colors"
          onClick={() => navigate(userRole === 'Instructor' ? '/instructor/notifications' : userRole === 'Admin' ? '/admin' : '/notifications')}
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive border-2 border-background" />
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-border/50 cursor-pointer group">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium group-hover:text-primary transition-colors">{userName}</p>
                <p className="text-xs text-muted-foreground">{userRole}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-medium shadow-soft group-hover:shadow-glow-primary transition-all">
                {userName.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate(userRole === 'Instructor' ? '/instructor/settings' : userRole === 'Admin' ? '/admin/settings' : '/settings')}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(userRole === 'Instructor' ? '/instructor/notifications' : userRole === 'Admin' ? '/admin' : '/notifications')}>
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
