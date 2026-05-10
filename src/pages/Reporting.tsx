import { useState } from "react";
import { ApplicantSidebar, ApplicantSidebarContent } from "@/components/layout/ApplicantSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Filter, 
  Calendar, 
  ChevronRight, 
  GraduationCap, 
  Award, 
  Target, 
  Clock,
  Briefcase,
  History
} from "lucide-react";

const Reporting = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "2024-01-01", end: "2024-12-31" });
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const summaryStats = [
    { label: "Completed Courses", value: "4", icon: GraduationCap, color: "text-primary" },
    { label: "Skills Validated", value: "12", icon: Target, color: "text-accent" },
    { label: "Exams Passed", value: "2", icon: Award, color: "text-success" },
    { label: "Total Study Time", value: "148h", icon: Clock, color: "text-warning" },
  ];

  const learningHistory = [
    { id: 1, title: "ISTQB Foundation Level", type: "Course", date: "2024-04-15", status: "Completed", result: "92%" },
    { id: 2, title: "Test Design Techniques", type: "Course", date: "2024-03-20", status: "Completed", result: "88%" },
    { id: 3, title: "Mock Exam: ISTQB FL", type: "Exam", date: "2024-05-02", status: "Passed", result: "85%" },
    { id: 4, title: "Agile Testing Basics", type: "Course", date: "2024-02-10", status: "Completed", result: "95%" },
    { id: 5, title: "Usability Testing Workshop", type: "Course", date: "2024-05-05", status: "In Progress", result: "N/A" },
    { id: 6, title: "Security Testing Fundamentals", type: "Course", date: "2024-05-08", status: "In Progress", result: "N/A" },
    { id: 7, title: "Final Certification Prep", type: "Exam", date: "2024-05-20", status: "Scheduled", result: "N/A" },
  ];

  const filteredHistory = learningHistory.filter(item => {
    const inDateRange = item.date >= dateRange.start && item.date <= dateRange.end;
    const matchesType = filterType === "All" || item.type === filterType;
    const matchesStatus = filterStatus === "All" || item.status === filterStatus;
    return inDateRange && matchesType && matchesStatus;
  });

  const displayHistory = showAll ? filteredHistory : filteredHistory.slice(0, 5);

  const skillsData = [
    { name: "Black-box Testing", level: "Expert", progress: 95 },
    { name: "White-box Testing", level: "Intermediate", progress: 65 },
    { name: "Test Management", level: "Advanced", progress: 82 },
    { name: "Automation Basics", level: "Beginner", progress: 35 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ApplicantSidebar onCollapse={setSidebarCollapsed} />
      <Header sidebarCollapsed={sidebarCollapsed} userRole="Student" mobileSidebar={<ApplicantSidebarContent onItemClick={() => {}} />} />

      <main className={cn(
        "pt-20 pb-24 px-4 sm:px-6 transition-all duration-300",
        sidebarCollapsed ? "lg:ml-20" : "lg:ml-64",
        "ml-0"
      )}>
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow-primary">
                  <FileText className="w-5 h-5 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold">Learning Report</h1>
              </div>
              <p className="text-muted-foreground text-sm">Formal record of your educational journey and achievements</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" /> Export PDF
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" /> Export CSV
              </Button>
            </div>
          </section>

          {/* Filters */}
          <Card className="shadow-soft border-border/50 animate-slide-up" style={{ animationDelay: "100ms" }}>
            <CardContent className="p-4 space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Period:</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input 
                    type="date" 
                    value={dateRange.start} 
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    className="w-40 h-9 text-sm"
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input 
                    type="date" 
                    value={dateRange.end} 
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    className="w-40 h-9 text-sm"
                  />
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn("ml-auto gap-2", showAdvanced && "text-primary bg-primary/5")}
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  <Filter className="w-4 h-4" /> Advanced Filters
                </Button>
              </div>

              {showAdvanced && (
                <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border/50 animate-accordion-down">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">Type:</span>
                    <div className="flex gap-1">
                      {["All", "Course", "Exam"].map(t => (
                        <Button 
                          key={t} 
                          variant={filterType === t ? "default" : "outline"} 
                          size="sm" 
                          className="h-7 text-[10px] px-2"
                          onClick={() => setFilterType(t)}
                        >
                          {t}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">Status:</span>
                    <div className="flex gap-1">
                      {["All", "Completed", "Passed", "In Progress"].map(s => (
                        <Button 
                          key={s} 
                          variant={filterStatus === s ? "default" : "outline"} 
                          size="sm" 
                          className="h-7 text-[10px] px-2"
                          onClick={() => setFilterStatus(s)}
                        >
                          {s}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: "150ms" }}>
            {summaryStats.map((stat, i) => (
              <Card key={i} className="shadow-soft border-border/50 overflow-hidden group">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:scale-110 transition-transform", stat.color)}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Learning History Table */}
            <Card className="lg:col-span-2 shadow-soft border-border/50 animate-slide-up" style={{ animationDelay: "200ms" }}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-primary" />
                  <CardTitle className="text-base">Learning History</CardTitle>
                </div>
                <CardDescription>Comprehensive record of courses and assessments</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-y border-border/50">
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Result</th>
                        <th className="text-right px-4 py-3 font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {displayHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-4 font-medium">{item.title}</td>
                          <td className="px-4 py-4 text-muted-foreground">{item.type}</td>
                          <td className="px-4 py-4 text-muted-foreground">{item.date}</td>
                          <td className="px-4 py-4 font-semibold">{item.result}</td>
                          <td className="px-4 py-4 text-right">
                            <Badge 
                              variant={item.status === 'Completed' || item.status === 'Passed' ? 'success' : item.status === 'In Progress' ? 'warning' : 'outline'} 
                              className="text-[10px]"
                            >
                              {item.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                      {displayHistory.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground italic">
                            No records found matching the selected filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t border-border/50 text-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary text-xs"
                    onClick={() => setShowAll(!showAll)}
                    disabled={filteredHistory.length <= 5}
                  >
                    {showAll ? "Show less" : "View all history"} 
                    {!showAll && <ChevronRight className="w-3 h-3 ml-1" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Side Sections */}
            <div className="space-y-6 animate-slide-up" style={{ animationDelay: "250ms" }}>
              {/* Skill Matrix */}
              <Card className="shadow-soft border-border/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-accent" />
                    <CardTitle className="text-base">Skill Matrix</CardTitle>
                  </div>
                  <CardDescription>Validated competency levels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {skillsData.map((skill, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-muted-foreground">{skill.level}</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent transition-all duration-500" 
                          style={{ width: `${skill.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Career Progress */}
              <Card className="shadow-soft border-border/50 bg-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" />
                    <CardTitle className="text-base">Career Progress</CardTitle>
                  </div>
                  <CardDescription>Path to Junior QA Engineer</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <p className="text-xs font-medium">Foundation Cert. Completed</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <p className="text-xs font-medium">Advanced Techniques Mastery</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-muted border border-border" />
                      <p className="text-xs text-muted-foreground">Portfolio Development (In Progress)</p>
                    </div>
                    <div className="mt-4 p-3 bg-card rounded-xl border border-primary/10">
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        You have completed <span className="font-bold text-primary">78%</span> of the requirements for your target role.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reporting;
