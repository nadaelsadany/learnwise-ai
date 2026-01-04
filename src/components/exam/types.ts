export interface Question {
  id: string;
  number: number;
  text: string;
  options: QuestionOption[];
  correctAnswer: string;
  topic: string;
  points: number;
}

export interface QuestionOption {
  id: string;
  label: string;
  text: string;
}

export interface ExamConfig {
  id: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
  passingScore: number;
  totalQuestions: number;
  topics: string[];
}

export interface ExamSession {
  examId: string;
  startTime: Date;
  timeRemaining: number; // seconds
  currentQuestionIndex: number;
  answers: Record<string, string>; // questionId -> optionId
  flaggedQuestions: Set<string>;
  isPaused: boolean;
  isCompleted: boolean;
}

export interface ExamResult {
  examId: string;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  timeTaken: number; // seconds
  answeredCount: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  topicBreakdown: TopicResult[];
}

export interface TopicResult {
  topic: string;
  correct: number;
  total: number;
  percentage: number;
}

export type QuestionStatus = 'unanswered' | 'answered' | 'flagged' | 'current';
