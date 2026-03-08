import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Plus, Phone, MessageSquare, Coffee, Users, Zap, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { format, subDays, startOfWeek, addDays } from "date-fns";

const isValidUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const distractionTypes = [
  { value: "phone", label: "Phone/Social Media", icon: Phone, color: "bg-destructive" },
  { value: "messages", label: "Messages/Chat", icon: MessageSquare, color: "bg-warning" },
  { value: "break", label: "Unplanned Break", icon: Coffee, color: "bg-accent" },
  { value: "people", label: "People/Interruption", icon: Users, color: "bg-primary" },
  { value: "other", label: "Other", icon: Zap, color: "bg-muted-foreground" },
];

interface Distraction {
  id: string;
  distraction_type: string;
  description: string | null;
  duration_seconds: number;
  logged_at: string;
}

interface DistractionTrackerProps {
  sessionId?: string;
}

export function DistractionTracker({ sessionId }: DistractionTrackerProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [distractions, setDistractions] = useState<Distraction[]>([]);
  const [weeklyData, setWeeklyData] = useState<{ day: string; count: number }[]>([]);
  const [newDistraction, setNewDistraction] = useState({
    type: "phone",
    description: "",
    duration: 5,
  });
  const { user } = useAuth();
  const isMock = !user?.id || !isValidUuid(user.id);

  // Mock data for demo
  const mockDistractions: Distraction[] = [
    { id: "m1", distraction_type: "phone", description: "Checked Instagram", duration_seconds: 300, logged_at: new Date().toISOString() },
    { id: "m2", distraction_type: "messages", description: "Replied to friend", duration_seconds: 180, logged_at: new Date(Date.now() - 3600000).toISOString() },
    { id: "m3", distraction_type: "break", description: "Got coffee", duration_seconds: 600, logged_at: new Date(Date.now() - 7200000).toISOString() },
  ];

  const mockWeeklyData = [
    { day: "Mon", count: 3 },
    { day: "Tue", count: 5 },
    { day: "Wed", count: 2 },
    { day: "Thu", count: 4 },
    { day: "Fri", count: 1 },
    { day: "Sat", count: 2 },
    { day: "Sun", count: 3 },
  ];

  useEffect(() => {
    const loadDistractions = async () => {
      if (isMock) {
        setDistractions(mockDistractions);
        setWeeklyData(mockWeeklyData);
        return;
      }

      const today = new Date();
      const weekStart = startOfWeek(today, { weekStartsOn: 1 });
      const weekEnd = addDays(weekStart, 6);

      const { data, error } = await supabase
        .from("distractions")
        .select("*")
        .eq("student_id", user!.id)
        .gte("logged_at", format(weekStart, "yyyy-MM-dd"))
        .order("logged_at", { ascending: false });

      if (error) {
        console.error(error);
        setDistractions(mockDistractions);
        setWeeklyData(mockWeeklyData);
        return;
      }

      setDistractions(data || []);

      // Calculate weekly data
      const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
      const weekly = weekDays.map((day) => {
        const dateStr = format(day, "yyyy-MM-dd");
        const count = (data || []).filter((d: Distraction) => 
          format(new Date(d.logged_at), "yyyy-MM-dd") === dateStr
        ).length;
        return { day: format(day, "EEE"), count };
      });
      setWeeklyData(weekly);
    };

    loadDistractions();
  }, [user, isMock]);

  const logDistraction = async () => {
    if (isMock) {
      const newD: Distraction = {
        id: Date.now().toString(),
        distraction_type: newDistraction.type,
        description: newDistraction.description || null,
        duration_seconds: newDistraction.duration * 60,
        logged_at: new Date().toISOString(),
      };
      setDistractions((prev) => [newD, ...prev]);
      toast.success("Distraction logged");
      setDialogOpen(false);
      setNewDistraction({ type: "phone", description: "", duration: 5 });
      return;
    }

    const { data, error } = await supabase.from("distractions").insert({
      student_id: user!.id,
      session_id: sessionId || null,
      distraction_type: newDistraction.type,
      description: newDistraction.description || null,
      duration_seconds: newDistraction.duration * 60,
    }).select().single();

    if (error) {
      toast.error("Failed to log distraction");
      return;
    }

    setDistractions((prev) => [data, ...prev]);
    toast.success("Distraction logged — stay focused! 💪");
    setDialogOpen(false);
    setNewDistraction({ type: "phone", description: "", duration: 5 });
  };

  const todayDistractions = distractions.filter((d) => 
    format(new Date(d.logged_at), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
  );

  const totalTimeLost = todayDistractions.reduce((acc, d) => acc + d.duration_seconds, 0);
  const mostCommonType = todayDistractions.length > 0
    ? distractionTypes.find(
        (t) => t.value === 
          todayDistractions.reduce((acc, d) => {
            acc[d.distraction_type] = (acc[d.distraction_type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
          |> ((counts: Record<string, number>) => Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0])
      )
    : null;

  // Simpler most common calculation
  const typeCounts = todayDistractions.reduce((acc, d) => {
    acc[d.distraction_type] = (acc[d.distraction_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const sortedTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
  const topType = sortedTypes[0]?.[0];
  const topTypeInfo = distractionTypes.find((t) => t.value === topType);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-destructive" />
            Distraction Tracker
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="gap-1.5 h-8">
                <Plus className="w-3.5 h-3.5" /> Log
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log a Distraction</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Type</label>
                  <Select value={newDistraction.type} onValueChange={(v) => setNewDistraction({ ...newDistraction, type: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {distractionTypes.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          <span className="flex items-center gap-2">
                            <t.icon className="w-4 h-4" />
                            {t.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Description (optional)</label>
                  <Input
                    placeholder="What distracted you?"
                    value={newDistraction.description}
                    onChange={(e) => setNewDistraction({ ...newDistraction, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Duration (minutes)</label>
                  <Input
                    type="number"
                    min={1}
                    max={60}
                    value={newDistraction.duration}
                    onChange={(e) => setNewDistraction({ ...newDistraction, duration: parseInt(e.target.value) || 5 })}
                  />
                </div>
                <Button onClick={logDistraction} className="w-full">
                  Log Distraction
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Today's Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-center">
            <p className="text-2xl font-bold text-destructive">{todayDistractions.length}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Today</p>
          </div>
          <div className="rounded-xl bg-warning/10 border border-warning/20 p-3 text-center">
            <p className="text-2xl font-bold text-warning-foreground">
              {Math.floor(totalTimeLost / 60)}m
            </p>
            <p className="text-[10px] text-muted-foreground uppercase">Time Lost</p>
          </div>
          <div className="rounded-xl bg-muted p-3 text-center">
            {topTypeInfo ? (
              <>
                <topTypeInfo.icon className="w-5 h-5 mx-auto text-muted-foreground" />
                <p className="text-[10px] text-muted-foreground uppercase mt-1">Top Type</p>
              </>
            ) : (
              <>
                <p className="text-lg font-bold text-success">✓</p>
                <p className="text-[10px] text-muted-foreground uppercase">Focused!</p>
              </>
            )}
          </div>
        </div>

        {/* Weekly Chart */}
        <div>
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            Weekly Distractions
          </p>
          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} barSize={20}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis hide domain={[0, "auto"]} />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted) / 0.3)", radius: 6 }}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                    fontSize: "11px",
                  }}
                  formatter={(value: number) => [`${value} distractions`, "Count"]}
                />
                <Bar dataKey="count" radius={[4, 4, 2, 2]}>
                  {weeklyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.count > 4 ? "hsl(var(--destructive))" : entry.count > 2 ? "hsl(var(--warning))" : "hsl(var(--primary) / 0.5)"} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Distractions */}
        {todayDistractions.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Recent</p>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {todayDistractions.slice(0, 5).map((d) => {
                const typeInfo = distractionTypes.find((t) => t.value === d.distraction_type);
                return (
                  <div key={d.id} className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50">
                    {typeInfo && <typeInfo.icon className="w-3.5 h-3.5 text-muted-foreground" />}
                    <span className="flex-1 truncate text-xs">
                      {d.description || typeInfo?.label || "Distraction"}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {Math.round(d.duration_seconds / 60)}m
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {todayDistractions.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-sm">No distractions logged today</p>
            <p className="text-xs mt-1">Great focus! Keep it up 🎯</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
