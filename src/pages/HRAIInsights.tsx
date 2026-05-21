import { useState } from "react";
import { HRSidebar, HRSidebarContent } from "@/components/layout/HRSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";

const HRAIInsights = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    return (
        <div className="min-h-screen bg-background">
            <HRSidebar onCollapse={setSidebarCollapsed} />
            <Header sidebarCollapsed={sidebarCollapsed} userRole="HR Manager" mobileSidebar={<HRSidebarContent collapsed={false} />} />
            <main className={cn("pt-20 pb-12 px-4 transition-all duration-300", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64")}>
                <h1 className="text-2xl font-black">AI Insights</h1>
                <p className="text-muted-foreground">AI-powered analysis of skill gaps and learning recommendations.</p>
            </main>
        </div>
    );
};
export default HRAIInsights;
