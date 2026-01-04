import { cn } from "@/lib/utils";
import {
    StudentMastery,
    Topic,
    getMasteryLevel,
    getMasteryColor,
    getMasteryTextColor,
} from "./types";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { TrendingUp, TrendingDown, Minus, User } from "lucide-react";
import { HeatmapLegend } from "./HeatmapLegend";

interface MasteryHeatmapProps {
    students: StudentMastery[];
    topics: Topic[];
    className?: string;
}

export function MasteryHeatmap({ students, topics, className }: MasteryHeatmapProps) {
    const getTrendIcon = (trend: "improving" | "stable" | "declining") => {
        switch (trend) {
            case "improving":
                return <TrendingUp className="w-3 h-3 text-success" />;
            case "declining":
                return <TrendingDown className="w-3 h-3 text-destructive" />;
            default:
                return <Minus className="w-3 h-3 text-muted-foreground" />;
        }
    };

    return (
        <div className={cn("space-y-4", className)}>
            {/* Legend */}
            <HeatmapLegend />

            {/* Heatmap Grid */}
            <div className="rounded-2xl bg-card border border-border/50 shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        {/* Header Row - Topics */}
                        <thead>
                            <tr className="border-b border-border/50">
                                <th className="sticky left-0 bg-card z-10 px-4 py-3 text-left text-sm font-semibold min-w-[180px]">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-muted-foreground" />
                                        Student
                                    </div>
                                </th>
                                {topics.map((topic) => (
                                    <th
                                        key={topic.id}
                                        className="px-2 py-3 text-center text-xs font-medium text-muted-foreground min-w-[90px]"
                                    >
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="truncate max-w-[80px]">{topic.name}</span>
                                            <span className="text-[10px] text-muted-foreground/60">
                                                {topic.category}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                                <th className="px-4 py-3 text-center text-xs font-semibold bg-primary/5 min-w-[80px]">
                                    Overall
                                </th>
                            </tr>
                        </thead>

                        {/* Student Rows */}
                        <tbody>
                            {students.map((student, index) => (
                                <tr
                                    key={student.studentId}
                                    className={cn(
                                        "border-b border-border/30 transition-colors hover:bg-muted/30",
                                        index % 2 === 0 && "bg-muted/10"
                                    )}
                                >
                                    {/* Student Name Cell */}
                                    <td className="sticky left-0 bg-card z-10 px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                                                {student.studentName.split(" ").map((n) => n[0]).join("")}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{student.studentName}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Last active: {student.lastActive.toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Topic Score Cells */}
                                    {topics.map((topic) => {
                                        const score = student.topicScores[topic.id];
                                        const level = getMasteryLevel(score?.score);
                                        const colorClass = getMasteryColor(level);
                                        const textColorClass = getMasteryTextColor(level);

                                        return (
                                            <td key={topic.id} className="px-2 py-2 text-center">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div
                                                            className={cn(
                                                                "mx-auto w-14 h-10 rounded-lg flex flex-col items-center justify-center cursor-default transition-transform hover:scale-105",
                                                                colorClass
                                                            )}
                                                        >
                                                            <span className={cn("text-sm font-bold", textColorClass)}>
                                                                {score?.score ?? "-"}
                                                            </span>
                                                            {score && score.score > 0 && (
                                                                <div className="mt-0.5">{getTrendIcon(score.trend)}</div>
                                                            )}
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="p-3 max-w-[200px]">
                                                        {score && score.score > 0 ? (
                                                            <div className="space-y-1">
                                                                <p className="font-semibold">{topic.name}</p>
                                                                <p className="text-xs">
                                                                    Score: <span className="font-medium">{score.score}%</span>
                                                                </p>
                                                                <p className="text-xs">
                                                                    Progress: {score.questionsCorrect}/{score.questionsAttempted} correct
                                                                </p>
                                                                <p className="text-xs flex items-center gap-1">
                                                                    Trend: {getTrendIcon(score.trend)}{" "}
                                                                    <span className="capitalize">{score.trend}</span>
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <p className="text-xs">Not started</p>
                                                        )}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </td>
                                        );
                                    })}

                                    {/* Overall Mastery Cell */}
                                    <td className="px-4 py-2 text-center bg-primary/5">
                                        <div
                                            className={cn(
                                                "mx-auto w-14 h-10 rounded-lg flex items-center justify-center font-bold",
                                                getMasteryColor(getMasteryLevel(student.overallMastery)),
                                                getMasteryTextColor(getMasteryLevel(student.overallMastery))
                                            )}
                                        >
                                            {student.overallMastery}%
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-xl bg-card border border-border/50 p-4">
                    <p className="text-xs text-muted-foreground mb-1">Total Students</p>
                    <p className="text-2xl font-bold">{students.length}</p>
                </div>
                <div className="rounded-xl bg-card border border-border/50 p-4">
                    <p className="text-xs text-muted-foreground mb-1">Avg. Mastery</p>
                    <p className="text-2xl font-bold">
                        {Math.round(
                            students.reduce((sum, s) => sum + s.overallMastery, 0) / students.length
                        )}%
                    </p>
                </div>
                <div className="rounded-xl bg-card border border-border/50 p-4">
                    <p className="text-xs text-muted-foreground mb-1">Students Struggling</p>
                    <p className="text-2xl font-bold text-destructive">
                        {students.filter((s) => s.overallMastery < 40).length}
                    </p>
                </div>
                <div className="rounded-xl bg-card border border-border/50 p-4">
                    <p className="text-xs text-muted-foreground mb-1">Students Mastered</p>
                    <p className="text-2xl font-bold text-success">
                        {students.filter((s) => s.overallMastery >= 80).length}
                    </p>
                </div>
            </div>
        </div>
    );
}
