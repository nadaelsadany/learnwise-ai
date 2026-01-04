import { getMasteryLevel, getMasteryColor, getMasteryTextColor } from "./types";

export function HeatmapLegend() {
    const levels = [
        { label: "Not Started", min: 0, max: 0, level: "not-started" as const },
        { label: "Struggling", min: 1, max: 39, level: "struggling" as const },
        { label: "Developing", min: 40, max: 59, level: "developing" as const },
        { label: "Proficient", min: 60, max: 79, level: "proficient" as const },
        { label: "Mastered", min: 80, max: 100, level: "mastered" as const },
    ];

    return (
        <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
            <span className="text-sm font-medium text-muted-foreground">Legend:</span>
            {levels.map((item) => (
                <div key={item.level} className="flex items-center gap-2">
                    <div
                        className={`w-5 h-5 rounded ${getMasteryColor(item.level)}`}
                    />
                    <span className="text-xs text-muted-foreground">
                        {item.label} ({item.min === item.max ? item.min : `${item.min}-${item.max}`}%)
                    </span>
                </div>
            ))}
        </div>
    );
}
