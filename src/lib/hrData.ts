export interface HREmployee {
  id: number;
  name: string;
  role: string;
  dept: string;
  courses: number;
  progress: number;
  performanceLevel: "High" | "Mid" | "Low";
  performanceScore: number;
  manager: string;
  skills: string[];
  status: "Active" | "At Risk";
}

export interface HRPath {
  id: string;
  title: string;
  category: "Course" | "Learning Path" | "Career Track";
  description: string;
}

export interface HRAIRecommendation {
  id: string;
  title: string;
  description: string;
  targetGroup: string;
  suggestedAction: string;
  status: "Pending" | "Accepted" | "Rejected";
}

export interface HRCertification {
  id: number;
  name: string;
  employee: string;
  status: "Pending Approval" | "Approved" | "Rejected";
  date: string;
  timestamp: number;
}

export interface HRActivity {
  id: string;
  title: string;
  desc: string;
  time: string;
  timestamp: number;
  type: "success" | "warn" | "info";
}

const INITIAL_EMPLOYEES: HREmployee[] = [
  { id: 1, name: "Alex Johnson", role: "Frontend Dev", dept: "Engineering", courses: 4, progress: 85, performanceLevel: "High", performanceScore: 92, manager: "David Park", skills: ["React", "CSS", "UI Dev"], status: "Active" },
  { id: 2, name: "Sarah Miller", role: "UI Designer", dept: "Product", courses: 2, progress: 45, performanceLevel: "Low", performanceScore: 48, manager: "Aisha Nwosu", skills: ["Figma", "UI Design"], status: "At Risk" },
  { id: 3, name: "Michael Chen", role: "Backend Lead", dept: "Engineering", courses: 6, progress: 92, performanceLevel: "High", performanceScore: 95, manager: "David Park", skills: ["Node.js", "Postgres"], status: "Active" },
  { id: 4, name: "Emma Wilson", role: "HR Coordinator", dept: "Human Resources", courses: 3, progress: 60, performanceLevel: "Mid", performanceScore: 78, manager: "Demo HR", skills: ["Recruiting", "Communication"], status: "Active" },
  { id: 5, name: "David Wilson", role: "Account Executive", dept: "Sales", courses: 1, progress: 15, performanceLevel: "Low", performanceScore: 35, manager: "Sarah Johnson", skills: ["Cold Calling"], status: "At Risk" },
  { id: 6, name: "Lisa Wang", role: "QA Engineer", dept: "Engineering", courses: 5, progress: 70, performanceLevel: "Mid", performanceScore: 82, manager: "David Park", skills: ["Testing", "Selenium"], status: "Active" },
];

const INITIAL_PATHS: HRPath[] = [
  { id: "p1", title: "React Fundamentals", category: "Course", description: "Core UI component structures and hooks." },
  { id: "p2", title: "Python for Data Science", category: "Course", description: "Pandas, NumPy, and basic data analysis." },
  { id: "p3", title: "Sales Negotiation Mastery", category: "Course", description: "Advanced negotiation techniques and objection handling." },
  { id: "p4", title: "Cloud Security Essentials", category: "Course", description: "IAM, VPCs, and network security baselines." },
  { id: "p5", title: "Modern Leadership Path", category: "Learning Path", description: "Strategic management, motivation, and career development." },
  { id: "p6", title: "Frontend Architect Track", category: "Career Track", description: "Advanced system design, optimization, and state architectures." },
];

const INITIAL_RECOMMENDATIONS: HRAIRecommendation[] = [
  { id: "r1", title: "Performance Drop in Sales Team", description: "Sales team performance index decreased by 15% this quarter.", targetGroup: "Sales", suggestedAction: "Sales Negotiation Mastery", status: "Pending" },
  { id: "r2", title: "Struggling Employee Support", description: "Sarah Miller is running 3 weeks behind on UI Design fundamentals.", targetGroup: "Sarah Miller", suggestedAction: "Frontend Architect Track", status: "Pending" },
  { id: "r3", title: "Leadership Successor Gap", description: "No certified manager successors in the Finance team.", targetGroup: "Finance", suggestedAction: "Modern Leadership Path", status: "Pending" },
];

const INITIAL_CERTS: HRCertification[] = [
  { id: 1, name: "ISTQB Foundation", employee: "Emma Wilson", status: "Pending Approval", date: "2h ago", timestamp: Date.now() - 2 * 3600 * 1000 },
  { id: 2, name: "AWS Cloud Practitioner", employee: "Alex Johnson", status: "Approved", date: "5h ago", timestamp: Date.now() - 5 * 3600 * 1000 },
  { id: 3, name: "React Professional", employee: "Lisa Wang", status: "Pending Approval", date: "Yesterday", timestamp: Date.now() - 24 * 3600 * 1000 },
];

const INITIAL_ACTIVITIES: HRActivity[] = [
  { id: "hract-1", title: "Course Assigned", desc: "React Fundamentals assigned to Dev Team", time: "10m ago", timestamp: Date.now() - 10 * 60 * 1000, type: "success" },
  { id: "hract-2", title: "Certificate Approved", desc: "AWS Practitioner for Alex Johnson", time: "1h ago", timestamp: Date.now() - 60 * 60 * 1000, type: "success" },
  { id: "hract-3", title: "Learning Path Update", desc: "Modern Leadership path updated", time: "3h ago", timestamp: Date.now() - 3 * 3600 * 1000, type: "info" },
];

export const getHREmployees = (): HREmployee[] => {
  const data = localStorage.getItem("learnwise_hr_employees");
  if (!data) {
    localStorage.setItem("learnwise_hr_employees", JSON.stringify(INITIAL_EMPLOYEES));
    return INITIAL_EMPLOYEES;
  }
  return JSON.parse(data);
};

export const saveHREmployees = (employees: HREmployee[]): void => {
  localStorage.setItem("learnwise_hr_employees", JSON.stringify(employees));
};

export const getHRPaths = (): HRPath[] => {
  return INITIAL_PATHS;
};

export const getAIRecommendations = (): HRAIRecommendation[] => {
  const data = localStorage.getItem("learnwise_hr_recommendations");
  if (!data) {
    localStorage.setItem("learnwise_hr_recommendations", JSON.stringify(INITIAL_RECOMMENDATIONS));
    return INITIAL_RECOMMENDATIONS;
  }
  return JSON.parse(data);
};

export const saveAIRecommendations = (recs: HRAIRecommendation[]): void => {
  localStorage.setItem("learnwise_hr_recommendations", JSON.stringify(recs));
};

export const getHRCertifications = (): HRCertification[] => {
  const data = localStorage.getItem("learnwise_hr_certs");
  if (!data) {
    localStorage.setItem("learnwise_hr_certs", JSON.stringify(INITIAL_CERTS));
    return INITIAL_CERTS;
  }
  return JSON.parse(data);
};

export const saveHRCertifications = (certs: HRCertification[]): void => {
  localStorage.setItem("learnwise_hr_certs", JSON.stringify(certs));
};

export const getHRActivities = (): HRActivity[] => {
  const data = localStorage.getItem("learnwise_hr_activities");
  if (!data) {
    localStorage.setItem("learnwise_hr_activities", JSON.stringify(INITIAL_ACTIVITIES));
    return INITIAL_ACTIVITIES;
  }
  return JSON.parse(data);
};

export const saveHRActivities = (acts: HRActivity[]): void => {
  localStorage.setItem("learnwise_hr_activities", JSON.stringify(acts));
};

export const addHRActivity = (title: string, desc: string, type: "success" | "warn" | "info" = "info"): void => {
  const activities = getHRActivityLog();
  const newActivity: HRActivity = {
    id: `hract-${Date.now()}`,
    title,
    desc,
    time: "Just now",
    timestamp: Date.now(),
    type,
  };
  saveHRActivities([newActivity, ...activities].slice(0, 50));
};

// Internal getter that maps relative times
export const getHRActivityLog = (): HRActivity[] => {
  const acts = getHRActivities();
  return acts.map(act => ({
    ...act,
    time: formatRelativeTime(act.timestamp),
  }));
};

// Formats relative time based on timestamp
export const formatRelativeTime = (timestamp: number): string => {
  const diffMs = Date.now() - timestamp;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return "Yesterday";
};
