import { useState } from "react";
import { HRSidebar, HRSidebarContent } from "@/components/layout/HRSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    FileSpreadsheet, FileText, Download, Sparkles, 
    TrendingUp, Calendar, AlertCircle, BarChart2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getHREmployees } from "@/lib/hrData";

const HRReports = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const employees = getHREmployees();
    const { toast } = useToast();

    const handleExportCSV = () => {
        // Build CSV string
        const headers = ["Employee ID", "Name", "Department", "Role", "Assigned Courses", "Learning Progress %", "Performance Rating %", "Status"];
        const rows = employees.map(e => [
            e.id, 
            `"${e.name}"`, 
            `"${e.dept}"`, 
            `"${e.role}"`, 
            e.courses, 
            `${e.progress}%`, 
            `${e.performanceScore}%`, 
            e.status
        ]);
        
        const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `talent_development_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
            title: "Report Exported",
            description: "Talent development data successfully downloaded as CSV.",
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <HRSidebar onCollapse={setSidebarCollapsed} />
            <Header
                sidebarCollapsed={sidebarCollapsed}
                userRole="Talent Manager"
                mobileSidebar={<HRSidebarContent collapsed={false} />}
            />
            <main className={cn("pt-20 pb-12 px-4 sm:px-6 transition-all duration-300", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64")}>
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight">Management Reports</h1>
                            <p className="text-muted-foreground text-sm">Download compliance, training, and strategic talent development audits.</p>
                        </div>
                        <Button 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/20"
                            onClick={handleExportCSV}
                        >
                            <Download className="w-4 h-4 mr-2" /> Export CSV Report
                        </Button>
                    </div>

                    {/* Available report formats cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-border/50 shadow-soft hover:border-indigo-300 transition-all duration-300">
                            <CardHeader className="flex flex-row items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                                    <FileSpreadsheet className="w-5 h-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-base font-bold">Talent Directory & Progress Audit</CardTitle>
                                    <CardDescription>Full employee registry including courses, progress, and performance ratings.</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-3.5 bg-muted/20 border border-border/50 rounded-xl space-y-1.5 text-xs text-muted-foreground">
                                    <p className="flex justify-between"><span className="font-semibold text-foreground">File Format:</span> CSV Spreadsheet</p>
                                    <p className="flex justify-between"><span className="font-semibold text-foreground">Calculated Fields:</span> Department Progress Averages, Skill Ratings</p>
                                    <p className="flex justify-between"><span className="font-semibold text-foreground">Security Level:</span> Restricted (HR & Admins only)</p>
                                </div>
                                <Button variant="outline" className="w-full text-xs h-9 border-indigo-200 hover:bg-indigo-50 text-indigo-600" onClick={handleExportCSV}>
                                    <Download className="w-3.5 h-3.5 mr-1.5" /> Download Spreadsheet
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-border/50 shadow-soft hover:border-indigo-300 transition-all duration-300">
                            <CardHeader className="flex flex-row items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center shrink-0">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-base font-bold">AI Skill Gaps & Action Report</CardTitle>
                                    <CardDescription>Summary of department performance drops and recommended interventions.</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-3.5 bg-muted/20 border border-border/50 rounded-xl space-y-1.5 text-xs text-muted-foreground">
                                    <p className="flex justify-between"><span className="font-semibold text-foreground">File Format:</span> PDF Document</p>
                                    <p className="flex justify-between"><span className="font-semibold text-foreground">Calculated Fields:</span> Recommended courses, accepted suggestions log</p>
                                    <p className="flex justify-between"><span className="font-semibold text-foreground">Security Level:</span> Confidential (Talent Managers only)</p>
                                </div>
                                <Button 
                                    variant="outline" 
                                    className="w-full text-xs h-9 border-indigo-200 hover:bg-indigo-50 text-indigo-600"
                                    onClick={() => {
                                        toast({
                                            title: "Preparing PDF Report...",
                                            description: "Generating AI Skill Gap Report document. Ready in a few seconds."
                                        });
                                    }}
                                >
                                    <Download className="w-3.5 h-3.5 mr-1.5" /> Export PDF Summary
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Preview Table */}
                    <Card className="border-border/50 shadow-soft">
                        <CardHeader>
                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                <BarChart2 className="w-5 h-5 text-indigo-500" /> Data Source Preview
                            </CardTitle>
                            <CardDescription>Live preview of data fields configured for export streams.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="bg-muted/10 font-black uppercase text-muted-foreground tracking-widest border-b border-border/50">
                                            <th className="px-6 py-3">ID</th>
                                            <th className="px-6 py-3">Employee</th>
                                            <th className="px-6 py-3">Department</th>
                                            <th className="px-6 py-3">Role</th>
                                            <th className="px-6 py-3">Courses</th>
                                            <th className="px-6 py-3">Progress</th>
                                            <th className="px-6 py-3">Rating</th>
                                            <th className="px-6 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employees.map((emp) => (
                                            <tr key={emp.id} className="border-b border-border/50 hover:bg-muted/20">
                                                <td className="px-6 py-3 font-mono">{emp.id}</td>
                                                <td className="px-6 py-3 font-bold">{emp.name}</td>
                                                <td className="px-6 py-3">{emp.dept}</td>
                                                <td className="px-6 py-3 text-muted-foreground">{emp.role}</td>
                                                <td className="px-6 py-3 font-semibold">{emp.courses}</td>
                                                <td className="px-6 py-3 text-indigo-600 font-semibold">{emp.progress}%</td>
                                                <td className="px-6 py-3 text-violet-600 font-semibold">{emp.performanceScore}%</td>
                                                <td className="px-6 py-3">
                                                    <Badge variant={emp.status === "At Risk" ? "destructive" : "default"} className="text-[9px] py-0.5">
                                                        {emp.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default HRReports;
