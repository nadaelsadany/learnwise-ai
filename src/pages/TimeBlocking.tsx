import { useState, useEffect, useMemo } from "react";
import { ApplicantSidebar, ApplicantSidebarContent } from "@/components/layout/ApplicantSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, GripVertical, Clock, CalendarDays, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PomodoroTimer } from "@/components/timeblocking/PomodoroTimer";

type BlockCategory = "study" | "break" | "review" | "practice" | "personal";

interface TimeBlock {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: BlockCategory;
}

const isValidUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const categoryColors: Record<BlockCategory, string> = {
  study: "bg-primary/15 border-primary/30 text-primary",
  break: "bg-success/15 border-success/30 text-success",
  review: "bg-accent/15 border-accent/30 text-accent",
  practice: "bg-warning/15 border-warning/30 text-warning-foreground",
  personal: "bg-muted border-border text-muted-foreground",
};

const categoryLabels: Record<BlockCategory, string> = {
  study: "Study", break: "Break", review: "Review", practice: "Practice", personal: "Personal",
};

const hours = Array.from({ length: 16 }, (_, i) => `${(i + 6).toString().padStart(2, "0")}:00`);

const defaultBlocks: TimeBlock[] = [
  { id: "d1", title: "Morning Review – Flashcards", startTime: "07:00", endTime: "07:30", category: "review" },
  { id: "d2", title: "Deep Study – Test Design", startTime: "08:00", endTime: "09:30", category: "study" },
  { id: "d3", title: "Break & Walk", startTime: "09:30", endTime: "10:00", category: "break" },
  { id: "d4", title: "Practice Questions", startTime: "10:00", endTime: "11:00", category: "practice" },
  { id: "d5", title: "Lunch Break", startTime: "12:00", endTime: "13:00", category: "personal" },
  { id: "d6", title: "AI Tutor Session", startTime: "14:00", endTime: "15:00", category: "study" },
  { id: "d7", title: "Mock Exam Practice", startTime: "15:30", endTime: "17:00", category: "practice" },
  { id: "d8", title: "Evening Review", startTime: "19:00", endTime: "19:30", category: "review" },
];

const TimeBlocking = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [blocks, setBlocks] = useState<TimeBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeBlock, setActiveBlock] = useState<TimeBlock | null>(null);
  const [newBlock, setNewBlock] = useState({ title: "", startTime: "08:00", endTime: "09:00", category: "study" as BlockCategory });
  const { user } = useAuth();
  const isMock = !user?.id || !isValidUuid(user.id);

  // Load blocks
  useEffect(() => {
    const load = async () => {
      if (isMock) { setBlocks(defaultBlocks); setLoading(false); return; }
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("time_blocks")
        .select("*")
        .eq("student_id", user!.id)
        .eq("block_date", today)
        .order("start_time");
      if (error) { console.error(error); setBlocks(defaultBlocks); }
      else if (data.length === 0) { setBlocks(defaultBlocks); }
      else { setBlocks(data.map((r: any) => ({ id: r.id, title: r.title, startTime: r.start_time, endTime: r.end_time, category: r.category as BlockCategory }))); }
      setLoading(false);
    };
    load();
  }, [user, isMock]);

  const addBlock = async () => {
    if (!newBlock.title || !newBlock.startTime || !newBlock.endTime) { toast.error("Fill all fields"); return; }
    if (isMock) {
      const block: TimeBlock = { id: Date.now().toString(), ...newBlock };
      setBlocks((p) => [...p, block].sort((a, b) => a.startTime.localeCompare(b.startTime)));
    } else {
      const { data, error } = await supabase.from("time_blocks").insert({
        student_id: user!.id,
        title: newBlock.title,
        start_time: newBlock.startTime,
        end_time: newBlock.endTime,
        category: newBlock.category,
        block_date: new Date().toISOString().split("T")[0],
      }).select().single();
      if (error) { toast.error("Failed to save"); return; }
      setBlocks((p) => [...p, { id: data.id, title: data.title, startTime: data.start_time, endTime: data.end_time, category: data.category as BlockCategory }].sort((a, b) => a.startTime.localeCompare(b.startTime)));
    }
    setNewBlock({ title: "", startTime: "08:00", endTime: "09:00", category: "study" });
    setDialogOpen(false);
    toast.success("Time block added!");
  };

  const removeBlock = async (id: string) => {
    setBlocks((p) => p.filter((b) => b.id !== id));
    if (!isMock && isValidUuid(id)) {
      await supabase.from("time_blocks").delete().eq("id", id);
    }
    toast.success("Block removed");
  };

  // Detect current active block
  useEffect(() => {
    const check = () => {
      const now = new Date();
      const nowMin = now.getHours() * 60 + now.getMinutes();
      const active = blocks.find((b) => {
        if (b.category === "break" || b.category === "personal") return false;
        const [sh, sm] = b.startTime.split(":").map(Number);
        const [eh, em] = b.endTime.split(":").map(Number);
        return nowMin >= sh * 60 + sm && nowMin < eh * 60 + em;
      });
      setActiveBlock(active || null);
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, [blocks]);

  const totalStudyMinutes = useMemo(() =>
    blocks.filter((b) => b.category !== "break" && b.category !== "personal")
      .reduce((acc, b) => {
        const [sh, sm] = b.startTime.split(":").map(Number);
        const [eh, em] = b.endTime.split(":").map(Number);
        return acc + (eh * 60 + em - (sh * 60 + sm));
      }, 0), [blocks]);

  const getBlockHeight = (b: TimeBlock) => {
    const [sh, sm] = b.startTime.split(":").map(Number);
    const [eh, em] = b.endTime.split(":").map(Number);
    return Math.max((eh * 60 + em - (sh * 60 + sm)) * 1.2, 48);
  };
  const getBlockTop = (b: TimeBlock) => {
    const [sh, sm] = b.startTime.split(":").map(Number);
    return (sh - 6) * 72 + sm * 1.2;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ApplicantSidebar onCollapse={setSidebarCollapsed} />
      <Header sidebarCollapsed={sidebarCollapsed} userRole="Student" mobileSidebar={<ApplicantSidebarContent onItemClick={() => {}} />} />

      <main className={cn("pt-20 pb-10 px-4 sm:px-6 transition-all duration-300", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64", "ml-0")}>
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <CalendarDays className="w-7 h-7 text-primary" /> Time Blocking
              </h1>
              <p className="text-muted-foreground text-sm mt-1">Schedule your day into focused blocks to maximize productivity.</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2"><Plus className="w-4 h-4" /> Add Block</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add Time Block</DialogTitle></DialogHeader>
                <div className="space-y-4 pt-2">
                  <Input placeholder="Block title" value={newBlock.title} onChange={(e) => setNewBlock({ ...newBlock, title: e.target.value })} />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Start</label>
                      <Input type="time" value={newBlock.startTime} onChange={(e) => setNewBlock({ ...newBlock, startTime: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">End</label>
                      <Input type="time" value={newBlock.endTime} onChange={(e) => setNewBlock({ ...newBlock, endTime: e.target.value })} />
                    </div>
                  </div>
                  <Select value={newBlock.category} onValueChange={(v) => setNewBlock({ ...newBlock, category: v as BlockCategory })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryLabels).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button onClick={addBlock} className="w-full">Add Block</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats + Pomodoro */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <p className="text-xs text-muted-foreground">Total Blocks</p>
                <p className="text-2xl font-bold">{blocks.length}</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-xs text-muted-foreground">Study Time</p>
                <p className="text-2xl font-bold text-primary">{Math.floor(totalStudyMinutes / 60)}h {totalStudyMinutes % 60}m</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-xs text-muted-foreground">Breaks</p>
                <p className="text-2xl font-bold text-success">{blocks.filter((b) => b.category === "break").length}</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-xs text-muted-foreground">Focus Ratio</p>
                <p className="text-2xl font-bold text-accent">
                  {blocks.length > 0 ? Math.round((blocks.filter((b) => b.category === "study" || b.category === "practice").length / blocks.length) * 100) : 0}%
                </p>
              </Card>
            </div>
            <PomodoroTimer activeBlockTitle={activeBlock?.title || null} />
          </div>

          {/* Timeline */}
          <Card className="p-6 overflow-hidden">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" /> Today's Schedule
            </h2>
            <div className="relative" style={{ height: `${16 * 72}px` }}>
              {hours.map((hour, i) => (
                <div key={hour} className="absolute left-0 right-0 flex items-start" style={{ top: `${i * 72}px` }}>
                  <span className="text-xs text-muted-foreground w-14 flex-shrink-0 -mt-2">{hour}</span>
                  <div className="flex-1 border-t border-border/40" />
                </div>
              ))}
              {blocks.map((block) => (
                <div
                  key={block.id}
                  className={cn(
                    "absolute left-16 right-4 rounded-xl border px-3 py-2 flex items-start justify-between gap-2 transition-all hover:shadow-md cursor-default group",
                    categoryColors[block.category],
                    activeBlock?.id === block.id && "ring-2 ring-primary shadow-lg"
                  )}
                  style={{ top: `${getBlockTop(block)}px`, height: `${getBlockHeight(block)}px`, minHeight: "48px" }}
                >
                  <div className="flex items-start gap-2 min-w-0">
                    <GripVertical className="w-4 h-4 mt-0.5 opacity-30 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{block.title}</p>
                      <p className="text-xs opacity-70">{block.startTime} – {block.endTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {activeBlock?.id === block.id && <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0 animate-pulse">LIVE</Badge>}
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">{categoryLabels[block.category]}</Badge>
                    <button onClick={() => removeBlock(block.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10">
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 border-primary/20 bg-primary/5">
            <h3 className="font-semibold text-sm mb-2">💡 Time Blocking Tips</h3>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li>• <strong>Batch similar tasks</strong> – group all review activities together for deeper focus.</li>
              <li>• <strong>Include breaks</strong> – the Pomodoro technique suggests 25 min work / 5 min break cycles.</li>
              <li>• <strong>Protect deep work</strong> – schedule your hardest study in your peak energy hours.</li>
              <li>• <strong>Be realistic</strong> – buffer 10-15 min between blocks for transitions.</li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TimeBlocking;
