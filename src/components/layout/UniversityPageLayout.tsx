import { useState, ReactNode } from "react";
import { UniversitySidebar, UniversitySidebarContent } from "@/components/layout/UniversitySidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";

interface UniversityPageLayoutProps {
    children: ReactNode;
}

export const UniversityPageLayout = ({ children }: UniversityPageLayoutProps) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            <UniversitySidebar onCollapse={setSidebarCollapsed} />
            <Header
                sidebarCollapsed={sidebarCollapsed}
                userRole="University"
                mobileSidebar={<UniversitySidebarContent collapsed={false} />}
            />
            <main className={cn(
                "pt-20 pb-12 px-4 sm:px-6 transition-all duration-300",
                sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
            )}>
                <div className="max-w-7xl mx-auto space-y-8">
                    {children}
                </div>
            </main>
        </div>
    );
};
