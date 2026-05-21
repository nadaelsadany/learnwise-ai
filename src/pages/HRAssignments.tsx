import { useState } from "react";
import { HRSidebar, HRSidebarContent } from "@/components/layout/HRSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";

const HRAssignments = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    return (
        <div className="min-h-screen bg-background">
            <HRSidebar onCollapse={setSidebarCollapsed} />
            <Header sidebarCollapsed={sidebarCollapsed} userRole="HR Manager" mobileSidebar={<HRSidebarContent collapsed={false} />} />
            <main className={cn("pt-20 pb-12 px-4 transition-all duration-300", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64")}>
                <h1 className="text-2xl font-black">Learning Assignments</h1>
                <p className="text-muted-foreground">Assign courses and career paths to employees and teams.</p>
            </main>
        </div>
    );
};
export default HRAssignments;
