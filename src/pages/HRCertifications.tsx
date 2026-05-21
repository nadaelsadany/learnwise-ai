import { useState } from "react";
import { HRSidebar, HRSidebarContent } from "@/components/layout/HRSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";

const HRCertifications = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    return (
        <div className="min-h-screen bg-background">
            <HRSidebar onCollapse={setSidebarCollapsed} />
            <Header sidebarCollapsed={sidebarCollapsed} userRole="HR Manager" mobileSidebar={<HRSidebarContent collapsed={false} />} />
            <main className={cn("pt-20 pb-12 px-4 transition-all duration-300", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64")}>
                <h1 className="text-2xl font-black">Certifications</h1>
                <p className="text-muted-foreground">Track and approve employee certifications and exam results.</p>
            </main>
        </div>
    );
};
export default HRCertifications;
