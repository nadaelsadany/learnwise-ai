import { useState, useCallback, useMemo } from "react";
import { Question, ExamSession, ExamResult, ExamConfig } from "@/components/exam/types";

interface UseExamSessionProps {
    questions: Question[];
    config: ExamConfig;
}

interface UseExamSessionReturn {
    session: ExamSession;
    currentQuestion: Question;
    currentQuestionIndex: number;
    answeredCount: number;
    flaggedCount: number;
    progressPercentage: number;
    goToQuestion: (index: number) => void;
    goToNext: () => void;
    goToPrevious: () => void;
    selectAnswer: (questionId: string, optionId: string) => void;
    toggleFlag: (questionId: string) => void;
    isAnswered: (questionId: string) => boolean;
    isFlagged: (questionId: string) => boolean;
    getQuestionStatus: (questionId: string, index: number) => "unanswered" | "answered" | "flagged" | "current";
    calculateResults: () => ExamResult;
    completeExam: () => void;
}

export function useExamSession({
    questions,
    config,
}: UseExamSessionProps): UseExamSessionReturn {
    const [session, setSession] = useState<ExamSession>({
        examId: config.id,
        startTime: new Date(),
        timeRemaining: config.timeLimitMinutes * 60,
        currentQuestionIndex: 0,
        answers: {},
        flaggedQuestions: new Set(),
        isPaused: false,
        isCompleted: false,
    });

    const currentQuestion = questions[session.currentQuestionIndex];

    const answeredCount = useMemo(
        () => Object.keys(session.answers).length,
        [session.answers]
    );

    const flaggedCount = useMemo(
        () => session.flaggedQuestions.size,
        [session.flaggedQuestions]
    );

    const progressPercentage = useMemo(
        () => (answeredCount / questions.length) * 100,
        [answeredCount, questions.length]
    );

    const goToQuestion = useCallback((index: number) => {
        if (index >= 0 && index < questions.length) {
            setSession((prev) => ({
                ...prev,
                currentQuestionIndex: index,
            }));
        }
    }, [questions.length]);

    const goToNext = useCallback(() => {
        setSession((prev) => ({
            ...prev,
            currentQuestionIndex: Math.min(prev.currentQuestionIndex + 1, questions.length - 1),
        }));
    }, [questions.length]);

    const goToPrevious = useCallback(() => {
        setSession((prev) => ({
            ...prev,
            currentQuestionIndex: Math.max(prev.currentQuestionIndex - 1, 0),
        }));
    }, []);

    const selectAnswer = useCallback((questionId: string, optionId: string) => {
        setSession((prev) => ({
            ...prev,
            answers: {
                ...prev.answers,
                [questionId]: optionId,
            },
        }));
    }, []);

    const toggleFlag = useCallback((questionId: string) => {
        setSession((prev) => {
            const newFlagged = new Set(prev.flaggedQuestions);
            if (newFlagged.has(questionId)) {
                newFlagged.delete(questionId);
            } else {
                newFlagged.add(questionId);
            }
            return {
                ...prev,
                flaggedQuestions: newFlagged,
            };
        });
    }, []);

    const isAnswered = useCallback(
        (questionId: string) => questionId in session.answers,
        [session.answers]
    );

    const isFlagged = useCallback(
        (questionId: string) => session.flaggedQuestions.has(questionId),
        [session.flaggedQuestions]
    );

    const getQuestionStatus = useCallback(
        (questionId: string, index: number): "unanswered" | "answered" | "flagged" | "current" => {
            if (index === session.currentQuestionIndex) return "current";
            if (session.flaggedQuestions.has(questionId)) return "flagged";
            if (questionId in session.answers) return "answered";
            return "unanswered";
        },
        [session.currentQuestionIndex, session.flaggedQuestions, session.answers]
    );

    const calculateResults = useCallback((): ExamResult => {
        const timeTaken = config.timeLimitMinutes * 60 - session.timeRemaining;

        let correctCount = 0;
        const topicStats: Record<string, { correct: number; total: number }> = {};

        questions.forEach((question) => {
            const userAnswer = session.answers[question.id];
            const isCorrect = userAnswer === question.correctAnswer;

            if (isCorrect) correctCount++;

            if (!topicStats[question.topic]) {
                topicStats[question.topic] = { correct: 0, total: 0 };
            }
            topicStats[question.topic].total++;
            if (isCorrect) topicStats[question.topic].correct++;
        });

        const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
        const score = correctCount;
        const percentage = (correctCount / questions.length) * 100;

        const topicBreakdown = Object.entries(topicStats).map(([topic, stats]) => ({
            topic,
            correct: stats.correct,
            total: stats.total,
            percentage: (stats.correct / stats.total) * 100,
        }));

        return {
            examId: config.id,
            score,
            totalPoints,
            percentage,
            passed: percentage >= config.passingScore,
            timeTaken,
            answeredCount,
            correctCount,
            incorrectCount: answeredCount - correctCount,
            unansweredCount: questions.length - answeredCount,
            topicBreakdown,
        };
    }, [questions, session, config, answeredCount]);

    const completeExam = useCallback(() => {
        setSession((prev) => ({
            ...prev,
            isCompleted: true,
        }));
    }, []);

    return {
        session,
        currentQuestion,
        currentQuestionIndex: session.currentQuestionIndex,
        answeredCount,
        flaggedCount,
        progressPercentage,
        goToQuestion,
        goToNext,
        goToPrevious,
        selectAnswer,
        toggleFlag,
        isAnswered,
        isFlagged,
        getQuestionStatus,
        calculateResults,
        completeExam,
    };
}
