export type UserRole = "Employee" | "Manager" | "HR Admin";
export type UserStatus = "Active" | "Invited" | "Inactive";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  team: string;
  department: string;
  role: string;
  status: UserStatus;
}

export type CourseStatus = "Draft" | "Processing" | "Active";

export interface AdminCourse {
  id: number;
  title: string;
  description: string;
  audience: string;
  duration: string;
  status: CourseStatus;
  enrolled: number;
  completion: number;
  aiScore: number;
  processing?: number;
}

export interface EnrolledUser {
  id: number;
  name: string;
  team: string;
  progress: number;
  dueDate?: string;
}

export interface EnrollableCourse {
  id: number;
  title: string;
  enrolled: number;
  openEnroll: boolean;
  deadline?: string;
  users: EnrolledUser[];
}

export interface AdminActivity {
  id: string;
  event: string;
  time: string;
  timestamp: number;
  type: "success" | "warn" | "info";
}

const INITIAL_USERS: AdminUser[] = [
  { id: 1, name: "Sarah Johnson", email: "sarah@acme.com", team: "Marketing", department: "Sales & Marketing", role: "Employee", status: "Active" },
  { id: 2, name: "David Park", email: "david@acme.com", team: "Engineering", department: "Technology", role: "Manager", status: "Active" },
  { id: 3, name: "Lena Müller", email: "lena@acme.com", team: "Design", department: "Product", role: "Employee", status: "Active" },
  { id: 4, name: "Carlos Rivera", email: "carlos@acme.com", team: "Operations", department: "Operations", role: "Employee", status: "Invited" },
  { id: 5, name: "Aisha Nwosu", email: "aisha@acme.com", team: "Finance", department: "Finance", role: "Manager", status: "Active" },
  { id: 6, name: "Tom Chen", email: "tom@acme.com", team: "Engineering", department: "Technology", role: "Employee", status: "Inactive" },
];

const INITIAL_COURSES: AdminCourse[] = [
  { id: 1, title: "React Fundamentals", description: "Core concepts of React for frontend developers", audience: "Engineering", duration: "6h", status: "Active", enrolled: 48, completion: 82, aiScore: 91 },
  { id: 2, title: "Python for Data Science", description: "Python basics and data manipulation", audience: "Analytics Team", duration: "8h", status: "Active", enrolled: 36, completion: 74, aiScore: 88 },
  { id: 3, title: "Leadership Essentials", description: "Soft skills for new managers", audience: "All Managers", duration: "4h", status: "Active", enrolled: 64, completion: 91, aiScore: 94 },
  { id: 4, title: "Excel & Data Analysis", description: "Spreadsheet mastery", audience: "Finance & Ops", duration: "5h", status: "Active", enrolled: 29, completion: 65, aiScore: 79 },
  { id: 5, title: "Cybersecurity Basics", description: "Security awareness for all staff", audience: "All Employees", duration: "3h", status: "Processing", enrolled: 0, completion: 0, aiScore: 0, processing: 65 },
];

const INITIAL_ENROLLABLE_COURSES: EnrollableCourse[] = [
  {
    id: 1,
    title: "React Fundamentals",
    enrolled: 48,
    openEnroll: false,
    deadline: "2026-03-31",
    users: [
      { id: 1, name: "Sarah Johnson", team: "Engineering", progress: 82, dueDate: "2026-03-31" },
      { id: 2, name: "David Park", team: "Engineering", progress: 45, dueDate: "2026-03-31" },
      { id: 3, name: "Tom Chen", team: "Engineering", progress: 10, dueDate: "2026-03-31" },
    ],
  },
  {
    id: 2,
    title: "Leadership Essentials",
    enrolled: 24,
    openEnroll: true,
    users: [
      { id: 4, name: "Aisha Nwosu", team: "Finance", progress: 100 },
      { id: 5, name: "Carlos Rivera", team: "Operations", progress: 68 },
    ],
  },
  {
    id: 3,
    title: "Excel & Data Analysis",
    enrolled: 15,
    openEnroll: false,
    deadline: "2026-04-15",
    users: [
      { id: 6, name: "Lena Müller", team: "Design", progress: 55 },
    ],
  },
];

const INITIAL_ACTIVITIES: AdminActivity[] = [
  { id: "act-1", event: "Sarah Johnson enrolled in React Basics", time: "10m ago", timestamp: Date.now() - 10 * 60 * 1000, type: "success" },
  { id: "act-2", event: "Team Alpha completed Python Fundamentals", time: "1h ago", timestamp: Date.now() - 60 * 60 * 1000, type: "success" },
  { id: "act-3", event: "3 employees flagged for low performance", time: "2h ago", timestamp: Date.now() - 2 * 60 * 60 * 1000, type: "warn" },
  { id: "act-4", event: "New course 'Data Analysis' published", time: "4h ago", timestamp: Date.now() - 4 * 60 * 60 * 1000, type: "info" },
  { id: "act-5", event: "Quarterly report exported", time: "Yesterday", timestamp: Date.now() - 24 * 60 * 60 * 1000, type: "info" },
];

export const getAdminUsers = (): AdminUser[] => {
  const data = localStorage.getItem("learnwise_admin_users");
  if (!data) {
    localStorage.setItem("learnwise_admin_users", JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  return JSON.parse(data);
};

export const saveAdminUsers = (users: AdminUser[]): void => {
  localStorage.setItem("learnwise_admin_users", JSON.stringify(users));
};

export const getAdminCourses = (): AdminCourse[] => {
  const data = localStorage.getItem("learnwise_admin_courses");
  if (!data) {
    localStorage.setItem("learnwise_admin_courses", JSON.stringify(INITIAL_COURSES));
    return INITIAL_COURSES;
  }
  return JSON.parse(data);
};

export const saveAdminCourses = (courses: AdminCourse[]): void => {
  localStorage.setItem("learnwise_admin_courses", JSON.stringify(courses));
};

export const getEnrollableCourses = (): EnrollableCourse[] => {
  const data = localStorage.getItem("learnwise_admin_enrollable_courses");
  if (!data) {
    localStorage.setItem("learnwise_admin_enrollable_courses", JSON.stringify(INITIAL_ENROLLABLE_COURSES));
    return INITIAL_ENROLLABLE_COURSES;
  }
  return JSON.parse(data);
};

export const saveEnrollableCourses = (courses: EnrollableCourse[]): void => {
  localStorage.setItem("learnwise_admin_enrollable_courses", JSON.stringify(courses));
};

export const getAdminActivities = (): AdminActivity[] => {
  const data = localStorage.getItem("learnwise_admin_activities");
  if (!data) {
    localStorage.setItem("learnwise_admin_activities", JSON.stringify(INITIAL_ACTIVITIES));
    return INITIAL_ACTIVITIES;
  }
  return JSON.parse(data);
};

export const saveAdminActivities = (activities: AdminActivity[]): void => {
  localStorage.setItem("learnwise_admin_activities", JSON.stringify(activities));
};

export const addAdminActivity = (event: string, type: "success" | "warn" | "info" = "info"): void => {
  const activities = getAdminActivities();
  const newActivity: AdminActivity = {
    id: `act-${Date.now()}`,
    event,
    time: "Just now",
    timestamp: Date.now(),
    type,
  };
  saveAdminActivities([newActivity, ...activities].slice(0, 50)); // limit to 50 activities
};

// Formats relative time based on timestamp
export const formatRelativeTime = (timestamp: number): string => {
  const diffMs = Date.now() - timestamp;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 600);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return "Yesterday";
};
