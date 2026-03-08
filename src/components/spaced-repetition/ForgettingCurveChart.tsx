import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { TrendingDown } from "lucide-react";

interface ReviewCard {
  interval: number;
  easeFactor: number;
  repetitions: number;
  lastReviewed: Date | null;
}

interface ForgettingCurveChartProps {
  cards: ReviewCard[];
}

export function ForgettingCurveChart({ cards }: ForgettingCurveChartProps) {
  const chartData = useMemo(() => {
    // Generate forgetting curve projection for the next 30 days
    const days = 30;
    const reviewedCards = cards.filter(c => c.lastReviewed);
    if (reviewedCards.length === 0) {
      // Show theoretical Ebbinghaus curve
      return Array.from({ length: days }, (_, i) => ({
        day: i,
        retention: Math.round(100 * Math.exp(-0.5 * i / (1 + 0))),
        withReview: Math.round(Math.min(100, 100 * (1 - 0.3 * Math.log(1 + i / 3)))),
      }));
    }

    const avgEase = reviewedCards.reduce((s, c) => s + c.easeFactor, 0) / reviewedCards.length;
    const avgReps = reviewedCards.reduce((s, c) => s + c.repetitions, 0) / reviewedCards.length;

    return Array.from({ length: days }, (_, i) => ({
      day: i,
      retention: Math.round(100 * Math.exp(-0.4 * i / (1 + avgReps * 0.5))),
      withReview: Math.round(Math.min(100, 100 * Math.exp(-0.1 * i / (avgEase * (1 + avgReps))))),
    }));
  }, [cards]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-destructive" />
          Forgetting Curve Projection
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="reviewGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} label={{ value: "Days", position: "insideBottom", offset: -5, fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} unit="%" domain={[0, 100]} width={35} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.75rem",
                  fontSize: "12px",
                }}
                formatter={(value: number, name: string) => [`${value}%`, name === "retention" ? "Without Review" : "With Spaced Review"]}
              />
              <ReferenceLine y={70} stroke="hsl(var(--warning))" strokeDasharray="3 3" label={{ value: "70% threshold", fontSize: 10, fill: "hsl(var(--warning))" }} />
              <Area type="monotone" dataKey="retention" stroke="hsl(var(--destructive))" fill="url(#retentionGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="withReview" stroke="hsl(var(--success))" fill="url(#reviewGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-2">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="w-3 h-0.5 bg-destructive rounded" /> Without review
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="w-3 h-0.5 bg-success rounded" /> With spaced review
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
