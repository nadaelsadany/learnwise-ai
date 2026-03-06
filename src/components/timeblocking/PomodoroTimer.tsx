import { useState, useEffect, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";
import { toast } from "sonner";

interface PomodoroTimerProps {
  activeBlockTitle?: string | null;
  onSessionComplete?: () => void;
}

type TimerMode = "focus" | "short-break" | "long-break";

const DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60,
  "short-break": 5 * 60,
  "long-break": 15 * 60,
};

const modeLabels: Record<TimerMode, string> = {
  focus: "Focus",
  "short-break": "Short Break",
  "long-break": "Long Break",
};

const modeColors: Record<TimerMode, string> = {
  focus: "text-primary",
  "short-break": "text-success",
  "long-break": "text-accent",
};

export const PomodoroTimer = ({ activeBlockTitle, onSessionComplete }: PomodoroTimerProps) => {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(DURATIONS.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Auto-start when active block changes
  useEffect(() => {
    if (activeBlockTitle) {
      setMode("focus");
      setTimeLeft(DURATIONS.focus);
      setIsRunning(true);
      toast.info(`Pomodoro started for: ${activeBlockTitle}`);
    }
  }, [activeBlockTitle]);

  useEffect(() => {
    clearTimer();
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    }
    return clearTimer;
  }, [isRunning, clearTimer]);

  useEffect(() => {
    if (timeLeft <= 0 && isRunning) {
      setIsRunning(false);
      if (mode === "focus") {
        const newCount = completedPomodoros + 1;
        setCompletedPomodoros(newCount);
        toast.success(`Pomodoro #${newCount} complete! Take a break.`);
        onSessionComplete?.();
        const nextMode = newCount % 4 === 0 ? "long-break" : "short-break";
        setMode(nextMode);
        setTimeLeft(DURATIONS[nextMode]);
      } else {
        toast.info("Break over! Ready to focus again.");
        setMode("focus");
        setTimeLeft(DURATIONS.focus);
      }
    }
  }, [timeLeft, isRunning, mode, completedPomodoros, onSessionComplete]);

  const toggleTimer = () => setIsRunning((r) => !r);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(DURATIONS[mode]);
  };

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(DURATIONS[newMode]);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((DURATIONS[mode] - timeLeft) / DURATIONS[mode]) * 100;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          {mode === "focus" ? <Brain className="w-4 h-4 text-primary" /> : <Coffee className="w-4 h-4 text-success" />}
          Pomodoro Timer
        </h3>
        <div className="flex gap-1">
          {(["focus", "short-break", "long-break"] as TimerMode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={cn(
                "text-[10px] px-2 py-1 rounded-full transition-all",
                mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              )}
            >
              {modeLabels[m]}
            </button>
          ))}
        </div>
      </div>

      {activeBlockTitle && (
        <p className="text-xs text-muted-foreground mb-3 truncate">
          📌 {activeBlockTitle}
        </p>
      )}

      {/* Circular progress */}
      <div className="flex flex-col items-center py-4">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--border))" strokeWidth="4" opacity="0.3" />
            <circle
              cx="50" cy="50" r="45" fill="none"
              stroke={mode === "focus" ? "hsl(var(--primary))" : mode === "short-break" ? "hsl(var(--success))" : "hsl(var(--accent))"}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("text-3xl font-bold tabular-nums", modeColors[mode])}>
              {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
            </span>
            <span className="text-[10px] text-muted-foreground">{modeLabels[mode]}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" size="icon" onClick={resetTimer} className="h-9 w-9">
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button onClick={toggleTimer} className="gap-2 px-6">
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isRunning ? "Pause" : "Start"}
        </Button>
      </div>

      <div className="flex items-center justify-center gap-1.5 mt-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all",
              i < completedPomodoros % 4 ? "bg-primary" : "bg-border"
            )}
          />
        ))}
        <span className="text-[10px] text-muted-foreground ml-1">
          {completedPomodoros} done
        </span>
      </div>
    </Card>
  );
};
