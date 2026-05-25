export interface Lesson {
  id: string;
  title: string;
  type: "video" | "text" | "quiz";
  content?: string;
  videoUrl?: string;
  duration?: number;
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface InstructorCourse {
  id: string;
  instructor_id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration_hours: number;
  image_url: string | null;
  status: "draft" | "published" | "archived";
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  start_date?: string | null;
  end_date?: string | null;
  attachment_url?: string | null;
  enrolledCount: number;
  minApplicants?: number;
  chapters?: Chapter[];
}

export interface AssessmentQuestion {
  id: string;
  question_text: string;
  question_type: "multiple_choice" | "open_ended";
  options: string[];
  correct_answer: string;
  points: number;
}

export interface Assessment {
  id: string;
  title: string;
  type: "Quiz" | "Exam" | "Assignment";
  course_id: string;
  course_title: string;
  passing_score: number;
  time_limit_minutes: number | null;
  question_count: number;
  questions: AssessmentQuestion[];
}

export interface ContentLibraryFile {
  id: string;
  name: string;
  type: "document" | "image" | "video" | "archive" | "link";
  size: string;
  date: string;
}

export interface LearnerCourse {
  id: string;
  title: string;
  progress: number;
  score: number;
  status: "Active" | "Completed";
}

export interface LearnerFeedback {
  id: string;
  date: string;
  text: string;
  resources: string[];
}

export interface Learner {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  enrolledCoursesCount: number;
  totalProgress: number;
  averageScore: number;
  lastActive: string | null;
  courses: LearnerCourse[];
  feedback: LearnerFeedback[];
  isFlagged: boolean;
}

export interface DropOffPoint {
  moduleName: string;
  courseTitle: string;
  completionRate: number; // percentage
  avgTimeSpent: number; // minutes
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface HardQuestion {
  id: string;
  quizTitle: string;
  courseTitle: string;
  questionText: string;
  successRate: number; // percentage
}

// Initial Data Setup
const INITIAL_COURSES: InstructorCourse[] = [
  {
    id: "c1",
    instructor_id: "inst-1",
    title: "ISTQB Foundation Level",
    description: "Complete preparation for the ISTQB FL certification exam with comprehensive modules covering all syllabus topics.",
    category: "Certification",
    level: "beginner",
    duration_hours: 24,
    image_url: null,
    status: "published",
    is_featured: true,
    created_at: new Date("2026-02-01").toISOString(),
    updated_at: new Date("2026-05-20").toISOString(),
    enrolledCount: 245,
    minApplicants: 5,
    chapters: [
      {
        id: "ch-1",
        title: "Fundamentals of Testing",
        lessons: [
          { id: "l-1", title: "What is Testing?", type: "video", content: "Introduction to software testing fundamentals.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
          { id: "l-2", title: "Why is Testing Necessary?", type: "text", content: "Detailed explanation of defects, failures, and testing goals." }
        ]
      },
      {
        id: "ch-2",
        title: "Testing Throughout the Software Development Lifecycle",
        lessons: [
          { id: "l-3", title: "Software Development Models", type: "video", content: "Comparing Agile, V-model, and waterfall testing approaches.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
          { id: "l-4", title: "Test Levels and Test Types", type: "text", content: "Integration, system, and acceptance testing." }
        ]
      }
    ]
  },
  {
    id: "c2",
    instructor_id: "inst-1",
    title: "Test Design Techniques",
    description: "Master black-box and white-box testing techniques including equivalence partitioning, boundary value analysis, and decision tables.",
    category: "Testing Techniques",
    level: "intermediate",
    duration_hours: 8,
    image_url: null,
    status: "published",
    is_featured: false,
    created_at: new Date("2026-03-01").toISOString(),
    updated_at: new Date("2026-05-18").toISOString(),
    enrolledCount: 182,
    chapters: [
      {
        id: "ch-3",
        title: "Black-box Test Techniques",
        lessons: [
          { id: "l-5", title: "Equivalence Partitioning", type: "video", content: "Partitioning input domains into valid/invalid sets.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
          { id: "l-6", title: "Boundary Value Analysis", type: "text", content: "Testing at boundaries of input domains." }
        ]
      }
    ]
  },
  {
    id: "c3",
    instructor_id: "inst-1",
    title: "Agile Testing Essentials",
    description: "Learn testing practices in agile development environments. Cover Scrum, Kanban, and continuous testing strategies.",
    category: "Agile",
    level: "beginner",
    duration_hours: 6,
    image_url: null,
    status: "draft",
    is_featured: false,
    created_at: new Date("2026-05-15").toISOString(),
    updated_at: new Date("2026-05-15").toISOString(),
    enrolledCount: 0,
    chapters: []
  }
];

const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: "a1",
    title: "Chapter 1 Quiz - Testing Basics",
    type: "Quiz",
    course_id: "c1",
    course_title: "ISTQB Foundation Level",
    passing_score: 70,
    time_limit_minutes: 15,
    question_count: 3,
    questions: [
      {
        id: "q-1",
        question_text: "Which of the following is a primary objective of software testing?",
        question_type: "multiple_choice",
        options: [
          "To prove that the software has no defects",
          "To find defects and gain confidence in the quality level",
          "To write code faster",
          "To replace developer unit testing entirely"
        ],
        correct_answer: "To find defects and gain confidence in the quality level",
        points: 10
      },
      {
        id: "q-2",
        question_text: "Testing and debugging are the same activity.",
        question_type: "multiple_choice",
        options: ["True", "False"],
        correct_answer: "False",
        points: 10
      },
      {
        id: "q-3",
        question_text: "Explain the difference between error, defect, and failure.",
        question_type: "open_ended",
        options: [],
        correct_answer: "An error is a human mistake. A defect is a flaw in the code caused by the error. A failure is an event where the system does not perform as expected, triggered by executing the defect.",
        points: 20
      }
    ]
  },
  {
    id: "a2",
    title: "Equivalence Partitioning Exam",
    type: "Exam",
    course_id: "c2",
    course_title: "Test Design Techniques",
    passing_score: 75,
    time_limit_minutes: 30,
    question_count: 2,
    questions: [
      {
        id: "q-4",
        question_text: "For an input range of 1 to 100, what are the valid/invalid partitions?",
        question_type: "multiple_choice",
        options: [
          "x < 1 (invalid), 1 <= x <= 100 (valid), x > 100 (invalid)",
          "x <= 1 (valid), x > 100 (invalid)",
          "All partition sets are valid",
          "No partitions can be defined"
        ],
        correct_answer: "x < 1 (invalid), 1 <= x <= 100 (valid), x > 100 (invalid)",
        points: 10
      },
      {
        id: "q-5",
        question_text: "Boundary value analysis includes values at the boundaries and directly adjacent values.",
        question_type: "multiple_choice",
        options: ["True", "False"],
        correct_answer: "True",
        points: 10
      }
    ]
  }
];

const INITIAL_FILES: ContentLibraryFile[] = [
  { id: "f-1", name: "ISTQB_Foundation_Syllabus_2023.pdf", type: "document", size: "2.4 MB", date: "2026-05-10" },
  { id: "f-2", name: "Agile_Testing_Quick_Reference.pdf", type: "document", size: "1.1 MB", date: "2026-05-12" },
  { id: "f-3", name: "Test_Design_BVA_Examples.png", type: "image", size: "512 KB", date: "2026-05-15" },
  { id: "f-4", name: "Boundary_Analysis_Walkthrough.mp4", type: "video", size: "128 MB", date: "2026-05-17" },
  { id: "f-5", name: "https://www.istqb.org/certifications/certified-tester-foundation-level", type: "link", size: "--", date: "2026-05-19" }
];

const INITIAL_LEARNERS: Learner[] = [
  {
    id: "learn-1",
    full_name: "Alex Johnson",
    email: "alex@acme.com",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    enrolledCoursesCount: 2,
    totalProgress: 85,
    averageScore: 92,
    lastActive: new Date().toISOString(),
    courses: [
      { id: "c1", title: "ISTQB Foundation Level", progress: 90, score: 95, status: "Active" },
      { id: "c2", title: "Test Design Techniques", progress: 80, score: 89, status: "Active" }
    ],
    feedback: [
      { id: "fb-1", date: "2026-05-22", text: "Excellent test coverage in your mock exam practice. Focus on white-box techniques next.", resources: ["f-3"] }
    ],
    isFlagged: false
  },
  {
    id: "learn-2",
    full_name: "Sarah Miller",
    email: "sarah@acme.com",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    enrolledCoursesCount: 2,
    totalProgress: 35,
    averageScore: 48,
    lastActive: new Date(Date.now() - 3 * 86400000).toISOString(),
    courses: [
      { id: "c1", title: "ISTQB Foundation Level", progress: 40, score: 52, status: "Active" },
      { id: "c2", title: "Test Design Techniques", progress: 30, score: 44, status: "Active" }
    ],
    feedback: [],
    isFlagged: false
  },
  {
    id: "learn-3",
    full_name: "Michael Chen",
    email: "michael@acme.com",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    enrolledCoursesCount: 1,
    totalProgress: 92,
    averageScore: 95,
    lastActive: new Date(Date.now() - 3600000).toISOString(),
    courses: [
      { id: "c1", title: "ISTQB Foundation Level", progress: 92, score: 95, status: "Active" }
    ],
    feedback: [],
    isFlagged: false
  },
  {
    id: "learn-4",
    full_name: "Emma Wilson",
    email: "emma@acme.com",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    enrolledCoursesCount: 1,
    totalProgress: 60,
    averageScore: 78,
    lastActive: new Date(Date.now() - 5 * 3600000).toISOString(),
    courses: [
      { id: "c1", title: "ISTQB Foundation Level", progress: 60, score: 78, status: "Active" }
    ],
    feedback: [],
    isFlagged: false
  },
  {
    id: "learn-5",
    full_name: "David Wilson",
    email: "david-sales@acme.com",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    enrolledCoursesCount: 1,
    totalProgress: 15,
    averageScore: 35,
    lastActive: new Date(Date.now() - 10 * 86400000).toISOString(),
    courses: [
      { id: "c1", title: "ISTQB Foundation Level", progress: 15, score: 35, status: "Active" }
    ],
    feedback: [],
    isFlagged: false
  }
];

const INITIAL_DROP_OFFS: DropOffPoint[] = [
  { moduleName: "Module 2: Test Levels & V-Model", courseTitle: "ISTQB Foundation Level", completionRate: 64, avgTimeSpent: 85, difficulty: "Medium" },
  { moduleName: "Module 3: Decision Tables Technique", courseTitle: "Test Design Techniques", completionRate: 42, avgTimeSpent: 110, difficulty: "Hard" },
  { moduleName: "Module 4: White-Box Code Coverage", courseTitle: "ISTQB Foundation Level", completionRate: 28, avgTimeSpent: 140, difficulty: "Hard" }
];

const INITIAL_HARD_QUESTIONS: HardQuestion[] = [
  { id: "hq-1", quizTitle: "Chapter 1 Quiz", courseTitle: "ISTQB Foundation Level", questionText: "Difference between defect severity and priority.", successRate: 35 },
  { id: "hq-2", quizTitle: "BVA Midterm Exam", courseTitle: "Test Design Techniques", questionText: "Calculate boundary values for complex double boundary expressions.", successRate: 22 }
];

// Helper Functions
export const getInstructorCourses = (): InstructorCourse[] => {
  const data = localStorage.getItem("learnwise_instructor_courses");
  if (!data) {
    localStorage.setItem("learnwise_instructor_courses", JSON.stringify(INITIAL_COURSES));
    return INITIAL_COURSES;
  }
  return JSON.parse(data);
};

export const saveInstructorCourses = (courses: InstructorCourse[]): void => {
  localStorage.setItem("learnwise_instructor_courses", JSON.stringify(courses));
};

export const getAssessments = (): Assessment[] => {
  const data = localStorage.getItem("learnwise_instructor_assessments");
  if (!data) {
    localStorage.setItem("learnwise_instructor_assessments", JSON.stringify(INITIAL_ASSESSMENTS));
    return INITIAL_ASSESSMENTS;
  }
  return JSON.parse(data);
};

export const saveAssessments = (assessments: Assessment[]): void => {
  localStorage.setItem("learnwise_instructor_assessments", JSON.stringify(assessments));
};

export const getLibraryFiles = (): ContentLibraryFile[] => {
  const data = localStorage.getItem("learnwise_instructor_files");
  if (!data) {
    localStorage.setItem("learnwise_instructor_files", JSON.stringify(INITIAL_FILES));
    return INITIAL_FILES;
  }
  return JSON.parse(data);
};

export const saveLibraryFiles = (files: ContentLibraryFile[]): void => {
  localStorage.setItem("learnwise_instructor_files", JSON.stringify(files));
};

export const getLearners = (): Learner[] => {
  const data = localStorage.getItem("learnwise_instructor_learners");
  if (!data) {
    localStorage.setItem("learnwise_instructor_learners", JSON.stringify(INITIAL_LEARNERS));
    return INITIAL_LEARNERS;
  }
  return JSON.parse(data);
};

export const saveLearners = (learners: Learner[]): void => {
  localStorage.setItem("learnwise_instructor_learners", JSON.stringify(learners));
};

export const getDropOffs = (): DropOffPoint[] => {
  return INITIAL_DROP_OFFS;
};

export const getHardQuestions = (): HardQuestion[] => {
  return INITIAL_HARD_QUESTIONS;
};

// Actions
export const addInstructorCourse = (course: Omit<InstructorCourse, "id" | "instructor_id" | "enrolledCount" | "created_at" | "updated_at" | "is_featured" | "chapters">): InstructorCourse => {
  const courses = getInstructorCourses();
  const newCourse: InstructorCourse = {
    ...course,
    id: `c-${Date.now()}`,
    instructor_id: "inst-1",
    enrolledCount: 0,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    chapters: []
  };
  saveInstructorCourses([...courses, newCourse]);
  return newCourse;
};

export const updateInstructorCourse = (id: string, updates: Partial<InstructorCourse>): void => {
  const courses = getInstructorCourses();
  const updated = courses.map((c) => (c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c));
  saveInstructorCourses(updated);
};

export const deleteInstructorCourse = (id: string): void => {
  const courses = getInstructorCourses();
  saveInstructorCourses(courses.filter((c) => c.id !== id));
};

export const addAssessment = (assessment: Omit<Assessment, "id">): Assessment => {
  const assessments = getAssessments();
  const newAss: Assessment = {
    ...assessment,
    id: `a-${Date.now()}`
  };
  saveAssessments([...assessments, newAss]);
  return newAss;
};

export const addLibraryFile = (file: Omit<ContentLibraryFile, "id" | "date">): ContentLibraryFile => {
  const files = getLibraryFiles();
  const newFile: ContentLibraryFile = {
    ...file,
    id: `f-${Date.now()}`,
    date: new Date().toISOString().split("T")[0]
  };
  saveLibraryFiles([...files, newFile]);
  return newFile;
};

export const deleteLibraryFile = (id: string): void => {
  const files = getLibraryFiles();
  saveLibraryFiles(files.filter((f) => f.id !== id));
};

export const submitLearnerFeedback = (studentId: string, feedbackText: string, resources: string[]): void => {
  const learners = getLearners();
  const updated = learners.map((l) => {
    if (l.id === studentId) {
      const newFb: LearnerFeedback = {
        id: `fb-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        text: feedbackText,
        resources
      };
      return {
        ...l,
        feedback: [newFb, ...l.feedback]
      };
    }
    return l;
  });
  saveLearners(updated);
};

export const flagLearnerToHR = (studentId: string, courseTitle: string): void => {
  // Update learner flagged status
  const learners = getLearners();
  const updatedLearners = learners.map((l) => {
    if (l.id === studentId) {
      return { ...l, isFlagged: true };
    }
    return l;
  });
  saveLearners(updatedLearners);

  // Sync to hrData
  const hrEmployeesData = localStorage.getItem("learnwise_hr_employees");
  if (hrEmployeesData) {
    const employees = JSON.parse(hrEmployeesData);
    // Find matching employee by name or ID. Our IDs in instructor and HR map 1-to-1 (e.g. learn-1 -> id: 1, learn-2 -> id: 2)
    const targetId = parseInt(studentId.replace("learn-", ""));
    const updatedEmployees = employees.map((emp: any) => {
      if (emp.id === targetId) {
        return { ...emp, status: "At Risk", performanceLevel: "Low" };
      }
      return emp;
    });
    localStorage.setItem("learnwise_hr_employees", JSON.stringify(updatedEmployees));
  }

  // Also write an activity log in hrData
  const hrActivitiesData = localStorage.getItem("learnwise_hr_activities");
  if (hrActivitiesData) {
    const activities = JSON.parse(hrActivitiesData);
    const targetName = learners.find((l) => l.id === studentId)?.full_name || "Employee";
    const newAct = {
      id: `hract-${Date.now()}`,
      title: "Employee Flagged",
      desc: `${targetName} was flagged for low performance in ${courseTitle}`,
      time: "Just now",
      timestamp: Date.now(),
      type: "warn"
    };
    localStorage.setItem("learnwise_hr_activities", JSON.stringify([newAct, ...activities].slice(0, 50)));
  }
};
