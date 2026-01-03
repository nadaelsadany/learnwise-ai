import { TrendingDown, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface WeaknessItem {
  topic: string;
  score: number;
  questionsAttempted: number;
}

interface WeaknessAnalysisProps {
  weaknesses: WeaknessItem[];
  onPractice?: (topic: string) => void;
}

export const WeaknessAnalysis = ({ weaknesses, onPractice }: WeaknessAnalysisProps) => {
  return (
    <div className="rounded-2xl bg-card border border-border/50 shadow-card p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-accent/10">
          <Sparkles className="w-4 h-4 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold">AI Weakness Analysis</h3>
          <p className="text-xs text-muted-foreground">Focus areas based on your performance</p>
        </div>
      </div>

      {/* Weakness List */}
      <div className="space-y-4">
        {weaknesses.map((item, index) => (
          <div 
            key={item.topic}
            className="group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-destructive" />
                <span className="text-sm font-medium">{item.topic}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {item.score}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Progress 
                value={item.score} 
                className="flex-1 h-2"
              />
              <Button 
                variant="ghost" 
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-7 px-2"
                onClick={() => onPractice?.(item.topic)}
              >
                Practice <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {item.questionsAttempted} questions attempted
            </p>
          </div>
        ))}
      </div>

      {/* AI Suggestion */}
      <div className="mt-4 p-3 rounded-xl bg-accent/5 border border-accent/20">
        <p className="text-sm text-accent">
          <Sparkles className="w-4 h-4 inline-block mr-1.5" />
          AI suggests focusing on "{weaknesses[0]?.topic}" for your next study session
        </p>
      </div>
    </div>
  );
};
