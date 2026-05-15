import { useState, useCallback, useMemo, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ApplicantSidebar } from "@/components/layout/ApplicantSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { useExamTimer } from "@/hooks/useExamTimer";
import { useExamSession } from "@/hooks/useExamSession";
import {
    ExamTimer,
    QuestionNavigation,
    ExamProgressBar,
    QuestionCard,
    ExamControls,
    ExamResultsDialog,
    mockExamConfig,
    mockQuestions,
    ExamResult,
} from "@/components/exam";
import { Button } from "@/components/ui/button";
import { FileQuestion, Clock, Target, ArrowLeft } from "lucide-react";

const MockExamRunner = () => {
    const { examId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const mode = searchParams.get("mode");
    const isReviewMode = mode === "review";

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [examResult, setExamResult] = useState<ExamResult | null>(null);

    const {
        session,
        currentQuestion,
        currentQuestionIndex,
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
    } = useExamSession({
        questions: mockQuestions,
        config: mockExamConfig,
    });

    // Simulate answers for review mode
    useEffect(() => {
        if (isReviewMode) {
            mockQuestions.forEach((q, index) => {
                // Mix of correct and some intentional mistakes for demo
                const answer = index % 4 === 0 ? "a" : q.correctAnswer;
                selectAnswer(q.id, answer);
            });
        }
    }, [isReviewMode, selectAnswer]);

    const handleTimeUp = useCallback(() => {
        const result = calculateResults();
        setExamResult(result);
        completeExam();
        setShowResults(true);
    }, [calculateResults, completeExam]);

    const {
        formattedTime,
        percentageRemaining,
        urgencyLevel,
        isPaused,
        pause,
        resume,
        reset,
    } = useExamTimer({
        initialTimeSeconds: mockExamConfig.timeLimitMinutes * 60,
        onTimeUp: handleTimeUp,
        autoStart: !isReviewMode,
    });

    const handleSubmit = useCallback(() => {
        pause();
        const result = calculateResults();
        setExamResult(result);
        completeExam();
        setShowResults(true);
    }, [pause, calculateResults, completeExam]);

    const handleReviewFlagged = useCallback(() => {
        // Find first flagged question
        const flaggedIndex = mockQuestions.findIndex((q) =>
            session.flaggedQuestions.has(q.id)
        );
        if (flaggedIndex !== -1) {
            goToQuestion(flaggedIndex);
        }
    }, [session.flaggedQuestions, goToQuestion]);

    const handleRetake = useCallback(() => {
        setShowResults(false);
        setExamResult(null);
        reset();
        goToQuestion(0);
        // Note: This would need to reset the session state too in a real implementation
        window.location.reload(); // Quick reset for demo
    }, [reset, goToQuestion]);

    const handleReviewAnswers = useCallback(() => {
        setShowResults(false);
        goToQuestion(0);
    }, [goToQuestion]);

    return (
        <div className="min-h-screen bg-background">
            <ApplicantSidebar onCollapse={setSidebarCollapsed} />
            <Header sidebarCollapsed={sidebarCollapsed} userRole="Student" />

            <main
                className={cn(
                    "pt-20 pb-8 px-6 transition-all duration-300",
                    sidebarCollapsed ? "ml-20" : "ml-64"
                )}
            >
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Back Button */}
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/mock-exam")}
                        className="gap-2 -ml-2 text-muted-foreground hover:text-primary"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Exams
                    </Button>

                    {/* Exam Header */}
                    <section className="animate-slide-up">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow-primary">
                                        <FileQuestion className="w-5 h-5 text-primary-foreground" />
                                    </div>
                                    <h1 className="text-2xl font-bold">{mockExamConfig.title}</h1>
                                </div>
                                <p className="text-muted-foreground">
                                    {mockExamConfig.description}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 border border-border/50">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">
                                        {isReviewMode ? "Time Taken: 42:15" : `${mockExamConfig.timeLimitMinutes} min`}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 border border-border/50">
                                    <Target className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">
                                        {isReviewMode ? "Score: 78%" : `Pass: ${mockExamConfig.passingScore}%`}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Main Exam Layout */}
                    <div className="grid lg:grid-cols-12 gap-6">
                        {/* Left Column - Navigation */}
                        <div
                            className="lg:col-span-3 space-y-4 animate-slide-up"
                            style={{ animationDelay: "100ms" }}
                        >
                             <QuestionNavigation
                                questions={mockQuestions}
                                currentIndex={currentQuestionIndex}
                                getQuestionStatus={(id, idx) => {
                                    if (isReviewMode) {
                                        if (idx === currentQuestionIndex) return 'current';
                                        const answer = session.answers[id];
                                        const question = mockQuestions.find(q => q.id === id);
                                        if (answer === question?.correctAnswer) return 'correct';
                                        return 'incorrect';
                                    }
                                    return getQuestionStatus(id, idx);
                                }}
                                onQuestionClick={goToQuestion}
                            />
                             <ExamProgressBar
                                answeredCount={isReviewMode ? 16 : answeredCount}
                                flaggedCount={isReviewMode ? 4 : flaggedCount}
                                totalQuestions={mockQuestions.length}
                                progressPercentage={isReviewMode ? 78 : progressPercentage}
                                isReviewMode={isReviewMode}
                            />
                        </div>

                        {/* Center Column - Question */}
                        <div
                            className="lg:col-span-6 animate-slide-up"
                            style={{ animationDelay: "150ms" }}
                        >
                            <QuestionCard
                                question={currentQuestion}
                                selectedAnswer={session.answers[currentQuestion.id]}
                                isFlagged={isFlagged(currentQuestion.id)}
                                onSelectAnswer={(optionId) =>
                                    !isReviewMode && selectAnswer(currentQuestion.id, optionId)
                                }
                                onToggleFlag={() => !isReviewMode && toggleFlag(currentQuestion.id)}
                                onPrevious={goToPrevious}
                                onNext={goToNext}
                                isFirst={currentQuestionIndex === 0}
                                isLast={currentQuestionIndex === mockQuestions.length - 1}
                                totalQuestions={mockQuestions.length}
                                showCorrection={isReviewMode}
                            />
                        </div>

                        {/* Right Column - Timer & Controls */}
                        <div
                            className="lg:col-span-3 space-y-4 animate-slide-up"
                            style={{ animationDelay: "200ms" }}
                        >
                            {!isReviewMode && (
                                <ExamTimer
                                    formattedTime={formattedTime}
                                    percentageRemaining={percentageRemaining}
                                    urgencyLevel={urgencyLevel}
                                    isPaused={isPaused}
                                />
                            )}
                             <ExamControls
                                isPaused={isPaused}
                                answeredCount={answeredCount}
                                flaggedCount={flaggedCount}
                                totalQuestions={mockQuestions.length}
                                onPause={pause}
                                onResume={resume}
                                onSubmit={isReviewMode ? () => navigate("/mock-exam") : handleSubmit}
                                onReviewFlagged={handleReviewFlagged}
                                submitLabel={isReviewMode ? "Exit Review" : "Finish Exam"}
                                hideTimer={isReviewMode}
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* Results Dialog */}
            <ExamResultsDialog
                isOpen={showResults}
                result={examResult}
                onReviewAnswers={handleReviewAnswers}
                onRetake={handleRetake}
            />
        </div>
    );
};

export default MockExamRunner;
