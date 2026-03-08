import { cn } from "@/lib/utils";
import { Zap, GraduationCap, AlertTriangle, Clock } from "lucide-react";

export type ReviewMode = "all-due" | "quick" | "exam" | "weak-only";

interface ReviewModeSelectorProps {
  value: ReviewMode;
  onChange: (mode: ReviewMode) => void;
  dueTodayCount: number;
  weakCount: number;
}

const modes = [
  { id: "all-due" as const, icon: Clock, label: "Due Today", desc: "All cards due for review" },
  { id: "quick" as const, icon: Zap, label: "Quick Review", desc: "10 cards max, fast pace" },
  { id: "exam" as const, icon: GraduationCap, label: "Exam Mode", desc: "Timed, no peeking" },
  { id: "weak-only" as const, icon: AlertTriangle, label: "Weak Cards", desc: "Cards you struggle with" },
];

export function ReviewModeSelector({ value, onChange, dueTodayCount, weakCount }: ReviewModeSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = value === mode.id;
        const count = mode.id === "all-due" ? dueTodayCount : mode.id === "weak-only" ? weakCount : undefined;
        return (
          <button
            key={mode.id}
            onClick={() => onChange(mode.id)}
            className={cn(
              "flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-center",
              isActive
                ? "border-primary/40 bg-primary/10 shadow-sm"
                : "border-border/50 hover:border-primary/20 bg-transparent hover:bg-muted/30"
            )}
          >
            <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
            <span className={cn("text-xs font-semibold", isActive ? "text-foreground" : "text-muted-foreground")}>{mode.label}</span>
            {count !== undefined && <span className="text-[10px] text-muted-foreground">{count} cards</span>}
          </button>
        );
      })}
    </div>
  );
}
