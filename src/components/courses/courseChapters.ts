import { Course } from "./types";

export interface Chapter {
    id: string;
    courseId: string;
    number: number;
    title: string;
    description: string;
    duration: string;
    lessons: Lesson[];
    isCompleted: boolean;
    isLocked: boolean;
}

export interface Lesson {
    id: string;
    chapterId: string;
    number: number;
    title: string;
    type: LessonType;
    duration: string;
    isCompleted: boolean;
    isLocked: boolean;
    content?: string;
}

export type LessonType = "video" | "reading" | "quiz" | "exercise" | "flashcards";

// Extended course data with chapters
export interface CourseWithChapters extends Course {
    chapters: Chapter[];
    objectives: string[];
    prerequisites: string[];
    syllabus?: string; // Link to uploaded syllabus
}

export const courseChaptersData: Record<string, Chapter[]> = {
    "c1": [ // ISTQB Foundation Level
        {
            id: "ch1-1",
            courseId: "c1",
            number: 1,
            title: "Fundamentals of Testing",
            description: "Learn what testing is, why it's necessary, and common testing objectives and terminology.",
            duration: "3 hours",
            isCompleted: true,
            isLocked: false,
            lessons: [
                { id: "l1-1-1", chapterId: "ch1-1", number: 1, title: "What is Testing?", type: "video", duration: "15 min", isCompleted: true, isLocked: false },
                { id: "l1-1-2", chapterId: "ch1-1", number: 2, title: "Why is Testing Necessary?", type: "reading", duration: "20 min", isCompleted: true, isLocked: false },
                { id: "l1-1-3", chapterId: "ch1-1", number: 3, title: "Seven Testing Principles", type: "video", duration: "25 min", isCompleted: true, isLocked: false },
                { id: "l1-1-4", chapterId: "ch1-1", number: 4, title: "Test Process Fundamentals", type: "reading", duration: "30 min", isCompleted: true, isLocked: false },
                { id: "l1-1-5", chapterId: "ch1-1", number: 5, title: "Psychology of Testing", type: "video", duration: "20 min", isCompleted: true, isLocked: false },
                { id: "l1-1-6", chapterId: "ch1-1", number: 6, title: "Chapter 1 Quiz", type: "quiz", duration: "30 min", isCompleted: true, isLocked: false },
            ],
        },
        {
            id: "ch1-2",
            courseId: "c1",
            number: 2,
            title: "Testing Throughout the SDLC",
            description: "Understand how testing integrates with different software development lifecycles.",
            duration: "4 hours",
            isCompleted: true,
            isLocked: false,
            lessons: [
                { id: "l1-2-1", chapterId: "ch1-2", number: 1, title: "Software Development Lifecycle Models", type: "video", duration: "30 min", isCompleted: true, isLocked: false },
                { id: "l1-2-2", chapterId: "ch1-2", number: 2, title: "Test Levels", type: "reading", duration: "25 min", isCompleted: true, isLocked: false },
                { id: "l1-2-3", chapterId: "ch1-2", number: 3, title: "Test Types", type: "video", duration: "35 min", isCompleted: true, isLocked: false },
                { id: "l1-2-4", chapterId: "ch1-2", number: 4, title: "Maintenance Testing", type: "reading", duration: "20 min", isCompleted: true, isLocked: false },
                { id: "l1-2-5", chapterId: "ch1-2", number: 5, title: "Chapter 2 Quiz", type: "quiz", duration: "30 min", isCompleted: true, isLocked: false },
            ],
        },
        {
            id: "ch1-3",
            courseId: "c1",
            number: 3,
            title: "Static Testing",
            description: "Learn about reviews, walkthroughs, and static analysis techniques.",
            duration: "3 hours",
            isCompleted: false,
            isLocked: false,
            lessons: [
                { id: "l1-3-1", chapterId: "ch1-3", number: 1, title: "Static Testing Basics", type: "video", duration: "20 min", isCompleted: true, isLocked: false },
                { id: "l1-3-2", chapterId: "ch1-3", number: 2, title: "Review Process", type: "reading", duration: "25 min", isCompleted: true, isLocked: false },
                { id: "l1-3-3", chapterId: "ch1-3", number: 3, title: "Review Types", type: "video", duration: "30 min", isCompleted: false, isLocked: false },
                { id: "l1-3-4", chapterId: "ch1-3", number: 4, title: "Static Analysis Tools", type: "reading", duration: "20 min", isCompleted: false, isLocked: false },
                { id: "l1-3-5", chapterId: "ch1-3", number: 5, title: "Chapter 3 Quiz", type: "quiz", duration: "25 min", isCompleted: false, isLocked: false },
            ],
        },
        {
            id: "ch1-4",
            courseId: "c1",
            number: 4,
            title: "Test Design Techniques",
            description: "Master black-box, white-box, and experience-based testing techniques.",
            duration: "6 hours",
            isCompleted: false,
            isLocked: false,
            lessons: [
                { id: "l1-4-1", chapterId: "ch1-4", number: 1, title: "Categories of Test Techniques", type: "video", duration: "20 min", isCompleted: false, isLocked: false },
                { id: "l1-4-2", chapterId: "ch1-4", number: 2, title: "Equivalence Partitioning", type: "video", duration: "35 min", isCompleted: false, isLocked: false },
                { id: "l1-4-3", chapterId: "ch1-4", number: 3, title: "Boundary Value Analysis", type: "video", duration: "30 min", isCompleted: false, isLocked: false },
                { id: "l1-4-4", chapterId: "ch1-4", number: 4, title: "Decision Table Testing", type: "exercise", duration: "45 min", isCompleted: false, isLocked: false },
                { id: "l1-4-5", chapterId: "ch1-4", number: 5, title: "State Transition Testing", type: "video", duration: "35 min", isCompleted: false, isLocked: false },
                { id: "l1-4-6", chapterId: "ch1-4", number: 6, title: "Use Case Testing", type: "reading", duration: "25 min", isCompleted: false, isLocked: false },
                { id: "l1-4-7", chapterId: "ch1-4", number: 7, title: "White-box Techniques", type: "video", duration: "40 min", isCompleted: false, isLocked: false },
                { id: "l1-4-8", chapterId: "ch1-4", number: 8, title: "Experience-based Techniques", type: "reading", duration: "20 min", isCompleted: false, isLocked: false },
                { id: "l1-4-9", chapterId: "ch1-4", number: 9, title: "Practice Flashcards", type: "flashcards", duration: "15 min", isCompleted: false, isLocked: false },
                { id: "l1-4-10", chapterId: "ch1-4", number: 10, title: "Chapter 4 Quiz", type: "quiz", duration: "35 min", isCompleted: false, isLocked: false },
            ],
        },
        {
            id: "ch1-5",
            courseId: "c1",
            number: 5,
            title: "Test Management",
            description: "Learn about test organization, planning, estimation, and monitoring.",
            duration: "4 hours",
            isCompleted: false,
            isLocked: false,
            lessons: [
                { id: "l1-5-1", chapterId: "ch1-5", number: 1, title: "Test Organization", type: "video", duration: "25 min", isCompleted: false, isLocked: false },
                { id: "l1-5-2", chapterId: "ch1-5", number: 2, title: "Test Planning and Estimation", type: "reading", duration: "30 min", isCompleted: false, isLocked: false },
                { id: "l1-5-3", chapterId: "ch1-5", number: 3, title: "Test Monitoring and Control", type: "video", duration: "25 min", isCompleted: false, isLocked: false },
                { id: "l1-5-4", chapterId: "ch1-5", number: 4, title: "Configuration Management", type: "reading", duration: "20 min", isCompleted: false, isLocked: false },
                { id: "l1-5-5", chapterId: "ch1-5", number: 5, title: "Risk and Testing", type: "video", duration: "30 min", isCompleted: false, isLocked: false },
                { id: "l1-5-6", chapterId: "ch1-5", number: 6, title: "Defect Management", type: "exercise", duration: "35 min", isCompleted: false, isLocked: false },
                { id: "l1-5-7", chapterId: "ch1-5", number: 7, title: "Chapter 5 Quiz", type: "quiz", duration: "30 min", isCompleted: false, isLocked: false },
            ],
        },
        {
            id: "ch1-6",
            courseId: "c1",
            number: 6,
            title: "Tool Support for Testing",
            description: "Explore test automation tools, benefits, and implementation strategies.",
            duration: "4 hours",
            isCompleted: false,
            isLocked: true,
            lessons: [
                { id: "l1-6-1", chapterId: "ch1-6", number: 1, title: "Test Tool Considerations", type: "video", duration: "30 min", isCompleted: false, isLocked: true },
                { id: "l1-6-2", chapterId: "ch1-6", number: 2, title: "Effective Use of Tools", type: "reading", duration: "25 min", isCompleted: false, isLocked: true },
                { id: "l1-6-3", chapterId: "ch1-6", number: 3, title: "Tool Selection", type: "exercise", duration: "40 min", isCompleted: false, isLocked: true },
                { id: "l1-6-4", chapterId: "ch1-6", number: 4, title: "Final Chapter Quiz", type: "quiz", duration: "30 min", isCompleted: false, isLocked: true },
            ],
        },
    ],
    "c2": [ // Test Design Techniques
        {
            id: "ch2-1",
            courseId: "c2",
            number: 1,
            title: "Introduction to Test Design",
            description: "Overview of test design approaches and their importance.",
            duration: "1.5 hours",
            isCompleted: true,
            isLocked: false,
            lessons: [
                { id: "l2-1-1", chapterId: "ch2-1", number: 1, title: "Why Test Design Matters", type: "video", duration: "20 min", isCompleted: true, isLocked: false },
                { id: "l2-1-2", chapterId: "ch2-1", number: 2, title: "Test Design Process", type: "reading", duration: "25 min", isCompleted: true, isLocked: false },
                { id: "l2-1-3", chapterId: "ch2-1", number: 3, title: "Specification-Based vs Structure-Based", type: "video", duration: "30 min", isCompleted: true, isLocked: false },
            ],
        },
        {
            id: "ch2-2",
            courseId: "c2",
            number: 2,
            title: "Black-Box Techniques Deep Dive",
            description: "Master all specification-based testing techniques in detail.",
            duration: "3 hours",
            isCompleted: false,
            isLocked: false,
            lessons: [
                { id: "l2-2-1", chapterId: "ch2-2", number: 1, title: "Equivalence Partitioning Mastery", type: "video", duration: "35 min", isCompleted: true, isLocked: false },
                { id: "l2-2-2", chapterId: "ch2-2", number: 2, title: "EP Practice Exercises", type: "exercise", duration: "30 min", isCompleted: true, isLocked: false },
                { id: "l2-2-3", chapterId: "ch2-2", number: 3, title: "Boundary Value Analysis Mastery", type: "video", duration: "30 min", isCompleted: false, isLocked: false },
                { id: "l2-2-4", chapterId: "ch2-2", number: 4, title: "BVA Practice Exercises", type: "exercise", duration: "30 min", isCompleted: false, isLocked: false },
                { id: "l2-2-5", chapterId: "ch2-2", number: 5, title: "Chapter Quiz", type: "quiz", duration: "25 min", isCompleted: false, isLocked: false },
            ],
        },
        {
            id: "ch2-3",
            courseId: "c2",
            number: 3,
            title: "Decision Tables & State Diagrams",
            description: "Advanced techniques for complex business logic testing.",
            duration: "2.5 hours",
            isCompleted: false,
            isLocked: false,
            lessons: [
                { id: "l2-3-1", chapterId: "ch2-3", number: 1, title: "Decision Table Construction", type: "video", duration: "40 min", isCompleted: false, isLocked: false },
                { id: "l2-3-2", chapterId: "ch2-3", number: 2, title: "State Transition Diagrams", type: "video", duration: "35 min", isCompleted: false, isLocked: false },
                { id: "l2-3-3", chapterId: "ch2-3", number: 3, title: "Practical Exercises", type: "exercise", duration: "45 min", isCompleted: false, isLocked: false },
            ],
        },
    ],
    "c3": [ // Agile Testing Essentials
        {
            id: "ch3-1",
            courseId: "c3",
            number: 1,
            title: "Agile Fundamentals for Testers",
            description: "Understanding Agile principles and the tester's role.",
            duration: "2 hours",
            isCompleted: true,
            isLocked: false,
            lessons: [
                { id: "l3-1-1", chapterId: "ch3-1", number: 1, title: "Agile Manifesto & Principles", type: "video", duration: "25 min", isCompleted: true, isLocked: false },
                { id: "l3-1-2", chapterId: "ch3-1", number: 2, title: "Scrum Framework Overview", type: "reading", duration: "30 min", isCompleted: true, isLocked: false },
                { id: "l3-1-3", chapterId: "ch3-1", number: 3, title: "The Whole Team Approach", type: "video", duration: "20 min", isCompleted: true, isLocked: false },
                { id: "l3-1-4", chapterId: "ch3-1", number: 4, title: "Chapter Quiz", type: "quiz", duration: "20 min", isCompleted: false, isLocked: false },
            ],
        },
        {
            id: "ch3-2",
            courseId: "c3",
            number: 2,
            title: "Testing in Sprints",
            description: "Practical testing activities within the sprint cycle.",
            duration: "2.5 hours",
            isCompleted: false,
            isLocked: false,
            lessons: [
                { id: "l3-2-1", chapterId: "ch3-2", number: 1, title: "Sprint Planning for Testers", type: "video", duration: "30 min", isCompleted: false, isLocked: false },
                { id: "l3-2-2", chapterId: "ch3-2", number: 2, title: "Acceptance Criteria & DoD", type: "reading", duration: "25 min", isCompleted: false, isLocked: false },
                { id: "l3-2-3", chapterId: "ch3-2", number: 3, title: "Continuous Testing", type: "video", duration: "35 min", isCompleted: false, isLocked: false },
                { id: "l3-2-4", chapterId: "ch3-2", number: 4, title: "Sprint Retrospectives", type: "reading", duration: "20 min", isCompleted: false, isLocked: false },
            ],
        },
    ],
};

// Helper to get course with chapters
export function getCourseWithChapters(courseId: string, courses: Course[]): CourseWithChapters | null {
    const course = courses.find(c => c.id === courseId);
    if (!course) return null;

    return {
        ...course,
        chapters: courseChaptersData[courseId] || [],
        objectives: getDefaultObjectives(courseId),
        prerequisites: getDefaultPrerequisites(courseId),
    };
}

function getDefaultObjectives(courseId: string): string[] {
    const objectives: Record<string, string[]> = {
        "c1": [
            "Understand fundamental testing concepts and terminology",
            "Apply testing throughout the software development lifecycle",
            "Use static and dynamic testing techniques effectively",
            "Design test cases using black-box and white-box techniques",
            "Manage testing activities and defects",
            "Select and implement appropriate testing tools",
        ],
        "c2": [
            "Master equivalence partitioning and boundary value analysis",
            "Create decision tables for complex business logic",
            "Design state transition tests for stateful systems",
            "Apply use case testing techniques",
            "Understand white-box coverage criteria",
        ],
        "c3": [
            "Understand Agile principles and testing practices",
            "Work effectively in Scrum teams",
            "Implement continuous testing strategies",
            "Write effective acceptance criteria",
        ],
    };
    return objectives[courseId] || ["Complete all course modules", "Pass the final assessment"];
}

function getDefaultPrerequisites(courseId: string): string[] {
    const prerequisites: Record<string, string[]> = {
        "c1": ["Basic understanding of software development", "No prior testing experience required"],
        "c2": ["ISTQB Foundation Level knowledge recommended", "Basic testing concepts"],
        "c3": ["Basic testing knowledge", "Familiarity with software development processes"],
    };
    return prerequisites[courseId] || ["No prerequisites"];
}
