import { useState } from "react";
import { ApplicantSidebar } from "@/components/layout/ApplicantSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

const Discussions = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <ApplicantSidebar onCollapse={setSidebarCollapsed} />
      <Header sidebarCollapsed={sidebarCollapsed} userRole="Student" />

      <main className={cn(
        "pt-20 pb-24 px-4 sm:px-6 transition-all duration-300",
        sidebarCollapsed ? "lg:ml-20" : "lg:ml-64",
        "ml-0"
      )}>
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
          <header>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Discussions</h1>
            </div>
            <p className="text-muted-foreground ml-13">Course Q&A and communication threads.</p>
          </header>
          
          <div className="rounded-2xl border border-dashed border-border/50 bg-muted/20 p-12 text-center">
            <h3 className="text-lg font-medium">No active discussions</h3>
            <p className="text-muted-foreground mt-1">Start a new thread to ask a question or share insights.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Discussions;
