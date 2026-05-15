import { Question, ExamConfig } from "./types";

export const mockExamConfig: ExamConfig = {
    id: "istqb-foundation-mock-1",
    title: "ISTQB Foundation Level - Mock Exam",
    description: "Practice exam covering all ISTQB Foundation Level syllabus topics",
    timeLimitMinutes: 60,
    passingScore: 65,
    totalQuestions: 20,
    topics: [
        "Fundamentals of Testing",
        "Testing Throughout the SDLC",
        "Static Testing",
        "Test Design Techniques",
        "Test Management",
        "Tool Support for Testing"
    ]
};

export const mockQuestions: Question[] = [
    {
        id: "q1",
        number: 1,
        text: "Which of the following is the MOST important objective of testing?",
        options: [
            { id: "a", label: "A", text: "Finding defects" },
            { id: "b", label: "B", text: "Proving that the software has no defects" },
            { id: "c", label: "C", text: "Providing confidence in the level of quality" },
            { id: "d", label: "D", text: "Preventing defects" }
        ],
        correctAnswer: "c",
        topic: "Fundamentals of Testing",
        points: 1,
        explanation: "While finding and preventing defects are important, the ultimate goal of testing in a professional context is to provide stakeholders with confidence in the level of quality of the system."
    },
    {
        id: "q2",
        number: 2,
        text: "What is the key difference between verification and validation?",
        options: [
            { id: "a", label: "A", text: "Verification is done by developers, validation by testers" },
            { id: "b", label: "B", text: "Verification checks against specifications, validation checks against user needs" },
            { id: "c", label: "C", text: "Verification is done first, validation is done last" },
            { id: "d", label: "D", text: "There is no difference, they are synonyms" }
        ],
        correctAnswer: "b",
        topic: "Fundamentals of Testing",
        points: 1,
        explanation: "Verification focuses on whether the system is built according to the specified requirements ('Are we building the product right?'), while Validation focuses on whether the system meets the actual user needs ('Are we building the right product?')."
    },
    {
        id: "q3",
        number: 3,
        text: "Which testing level focuses on testing interfaces between components?",
        options: [
            { id: "a", label: "A", text: "Unit testing" },
            { id: "b", label: "B", text: "Integration testing" },
            { id: "c", label: "C", text: "System testing" },
            { id: "d", label: "D", text: "Acceptance testing" }
        ],
        correctAnswer: "b",
        topic: "Testing Throughout the SDLC",
        points: 1,
        explanation: "Integration testing is specifically designed to uncover defects in the interfaces and interactions between integrated components or systems."
    },
    {
        id: "q4",
        number: 4,
        text: "What is the main purpose of regression testing?",
        options: [
            { id: "a", label: "A", text: "To test new functionality" },
            { id: "b", label: "B", text: "To check that unchanged software still works after changes" },
            { id: "c", label: "C", text: "To test the software under stress conditions" },
            { id: "d", label: "D", text: "To verify security requirements" }
        ],
        correctAnswer: "b",
        topic: "Testing Throughout the SDLC",
        points: 1,
        explanation: "Regression testing is performed to confirm that a recent code change has not adversely affected existing features that were previously working correctly."
    },
    {
        id: "q5",
        number: 5,
        text: "Which of the following is an example of static testing?",
        options: [
            { id: "a", label: "A", text: "Running automated test scripts" },
            { id: "b", label: "B", text: "Code review" },
            { id: "c", label: "C", text: "Exploratory testing" },
            { id: "d", label: "D", text: "Performance testing" }
        ],
        correctAnswer: "b",
        topic: "Static Testing",
        points: 1,
        explanation: "Static testing involves examining the code or documentation without actually executing the software. Reviews, walkthroughs, and inspections are primary examples."
    },
    {
        id: "q6",
        number: 6,
        text: "In equivalence partitioning, if a field accepts values 1-100, which partitions should be tested?",
        options: [
            { id: "a", label: "A", text: "Only valid values within 1-100" },
            { id: "b", label: "B", text: "Values below 1, within 1-100, and above 100" },
            { id: "c", label: "C", text: "All values from 1 to 100" },
            { id: "d", label: "D", text: "Only boundary values 1 and 100" }
        ],
        correctAnswer: "b",
        topic: "Test Design Techniques",
        points: 1,
        explanation: "Equivalence partitioning requires testing at least one value from each identified partition: one invalid partition below the range (<1), one valid partition within the range (1-100), and one invalid partition above the range (>100)."
    },
    {
        id: "q7",
        number: 7,
        text: "What is boundary value analysis primarily used for?",
        options: [
            { id: "a", label: "A", text: "Testing security vulnerabilities" },
            { id: "b", label: "B", text: "Testing values at the edges of equivalence partitions" },
            { id: "c", label: "C", text: "Testing all possible combinations of inputs" },
            { id: "d", label: "D", text: "Testing the graphical user interface" }
        ],
        correctAnswer: "b",
        topic: "Test Design Techniques",
        points: 1
    },
    {
        id: "q8",
        number: 8,
        text: "Which technique uses a table to show combinations of inputs and their corresponding outputs?",
        options: [
            { id: "a", label: "A", text: "State transition testing" },
            { id: "b", label: "B", text: "Decision table testing" },
            { id: "c", label: "C", text: "Use case testing" },
            { id: "d", label: "D", text: "Error guessing" }
        ],
        correctAnswer: "b",
        topic: "Test Design Techniques",
        points: 1
    },
    {
        id: "q9",
        number: 9,
        text: "What does statement coverage measure?",
        options: [
            { id: "a", label: "A", text: "The percentage of decision outcomes exercised" },
            { id: "b", label: "B", text: "The percentage of executable statements in the code" },
            { id: "c", label: "C", text: "The percentage of paths through the code" },
            { id: "d", label: "D", text: "The percentage of conditions tested" }
        ],
        correctAnswer: "b",
        topic: "Test Design Techniques",
        points: 1
    },
    {
        id: "q10",
        number: 10,
        text: "Which of the following best describes a test case?",
        options: [
            { id: "a", label: "A", text: "A set of test conditions, inputs, and expected results" },
            { id: "b", label: "B", text: "A description of how to test a feature" },
            { id: "c", label: "C", text: "A list of defects found during testing" },
            { id: "d", label: "D", text: "A report on testing activities" }
        ],
        correctAnswer: "a",
        topic: "Test Management",
        points: 1
    },
    {
        id: "q11",
        number: 11,
        text: "What is the purpose of exit criteria in testing?",
        options: [
            { id: "a", label: "A", text: "To define when testing can begin" },
            { id: "b", label: "B", text: "To define when testing can end" },
            { id: "c", label: "C", text: "To define the scope of testing" },
            { id: "d", label: "D", text: "To define who performs testing" }
        ],
        correctAnswer: "b",
        topic: "Test Management",
        points: 1
    },
    {
        id: "q12",
        number: 12,
        text: "Which factor is MOST likely to influence the effort required for testing?",
        options: [
            { id: "a", label: "A", text: "The color scheme of the application" },
            { id: "b", label: "B", text: "The complexity of the software" },
            { id: "c", label: "C", text: "The office location of the test team" },
            { id: "d", label: "D", text: "The programming language used" }
        ],
        correctAnswer: "b",
        topic: "Test Management",
        points: 1
    },
    {
        id: "q13",
        number: 13,
        text: "What is the primary purpose of a test execution tool?",
        options: [
            { id: "a", label: "A", text: "To write test cases" },
            { id: "b", label: "B", text: "To automate the running of tests" },
            { id: "c", label: "C", text: "To manage requirements" },
            { id: "d", label: "D", text: "To track defects" }
        ],
        correctAnswer: "b",
        topic: "Tool Support for Testing",
        points: 1
    },
    {
        id: "q14",
        number: 14,
        text: "Which of the following is a benefit of test automation?",
        options: [
            { id: "a", label: "A", text: "It eliminates the need for test planning" },
            { id: "b", label: "B", text: "It allows for faster regression testing" },
            { id: "c", label: "C", text: "It always finds more defects than manual testing" },
            { id: "d", label: "D", text: "It requires no maintenance" }
        ],
        correctAnswer: "b",
        topic: "Tool Support for Testing",
        points: 1
    },
    {
        id: "q15",
        number: 15,
        text: "What is a test oracle?",
        options: [
            { id: "a", label: "A", text: "A database used for testing" },
            { id: "b", label: "B", text: "A source to determine expected results" },
            { id: "c", label: "C", text: "A testing tool from Oracle" },
            { id: "d", label: "D", text: "A senior tester" }
        ],
        correctAnswer: "b",
        topic: "Fundamentals of Testing",
        points: 1
    },
    {
        id: "q16",
        number: 16,
        text: "Which testing type evaluates the system behavior under load?",
        options: [
            { id: "a", label: "A", text: "Functional testing" },
            { id: "b", label: "B", text: "Performance testing" },
            { id: "c", label: "C", text: "Usability testing" },
            { id: "d", label: "D", text: "Compatibility testing" }
        ],
        correctAnswer: "b",
        topic: "Testing Throughout the SDLC",
        points: 1
    },
    {
        id: "q17",
        number: 17,
        text: "What is the V-model in software development?",
        options: [
            { id: "a", label: "A", text: "A model where testing is done only at the end" },
            { id: "b", label: "B", text: "A model that shows the relationship between development and testing phases" },
            { id: "c", label: "C", text: "A visual representation of test results" },
            { id: "d", label: "D", text: "A model for calculating test coverage" }
        ],
        correctAnswer: "b",
        topic: "Testing Throughout the SDLC",
        points: 1
    },
    {
        id: "q18",
        number: 18,
        text: "What is meant by 'test independence'?",
        options: [
            { id: "a", label: "A", text: "Tests that don't depend on each other" },
            { id: "b", label: "B", text: "Separation between the person who wrote the code and who tests it" },
            { id: "c", label: "C", text: "Testing without using any tools" },
            { id: "d", label: "D", text: "Testing without any documentation" }
        ],
        correctAnswer: "b",
        topic: "Fundamentals of Testing",
        points: 1
    },
    {
        id: "q19",
        number: 19,
        text: "Which document describes the scope, approach, and schedule of testing activities?",
        options: [
            { id: "a", label: "A", text: "Test case" },
            { id: "b", label: "B", text: "Test plan" },
            { id: "c", label: "C", text: "Defect report" },
            { id: "d", label: "D", text: "Test script" }
        ],
        correctAnswer: "b",
        topic: "Test Management",
        points: 1
    },
    {
        id: "q20",
        number: 20,
        text: "What is the 'pesticide paradox' in testing?",
        options: [
            { id: "a", label: "A", text: "Tests become less effective over time as bugs are fixed" },
            { id: "b", label: "B", text: "Running the same tests repeatedly will eventually find no new defects" },
            { id: "c", label: "C", text: "Pesticides affect software quality" },
            { id: "d", label: "D", text: "Automated tests are less effective than manual tests" }
        ],
        correctAnswer: "b",
        topic: "Fundamentals of Testing",
        points: 1
    }
];
