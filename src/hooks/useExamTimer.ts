import { useState, useEffect, useCallback, useRef } from "react";

interface UseExamTimerProps {
    initialTimeSeconds: number;
    onTimeUp: () => void;
}

interface UseExamTimerReturn {
    timeRemaining: number;
    formattedTime: string;
    isRunning: boolean;
    isPaused: boolean;
    percentageRemaining: number;
    urgencyLevel: "normal" | "warning" | "critical";
    pause: () => void;
    resume: () => void;
    reset: () => void;
}

export function useExamTimer({
    initialTimeSeconds,
    onTimeUp,
}: UseExamTimerProps): UseExamTimerReturn {
    const [timeRemaining, setTimeRemaining] = useState(initialTimeSeconds);
    const [isRunning, setIsRunning] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const onTimeUpRef = useRef(onTimeUp);

    // Keep the callback reference fresh
    onTimeUpRef.current = onTimeUp;

    useEffect(() => {
        if (isRunning && !isPaused && timeRemaining > 0) {
            intervalRef.current = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        onTimeUpRef.current();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, isPaused, timeRemaining]);

    const pause = useCallback(() => {
        setIsPaused(true);
    }, []);

    const resume = useCallback(() => {
        setIsPaused(false);
    }, []);

    const reset = useCallback(() => {
        setTimeRemaining(initialTimeSeconds);
        setIsRunning(true);
        setIsPaused(false);
    }, [initialTimeSeconds]);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const percentageRemaining = (timeRemaining / initialTimeSeconds) * 100;

    const getUrgencyLevel = (): "normal" | "warning" | "critical" => {
        const fiveMinutes = 5 * 60;
        const oneMinute = 60;

        if (timeRemaining <= oneMinute) return "critical";
        if (timeRemaining <= fiveMinutes) return "warning";
        return "normal";
    };

    return {
        timeRemaining,
        formattedTime: formatTime(timeRemaining),
        isRunning,
        isPaused,
        percentageRemaining,
        urgencyLevel: getUrgencyLevel(),
        pause,
        resume,
        reset,
    };
}
