import { InstructorPageLayout } from "@/components/instructor/InstructorPageLayout";
import { Trophy, Star, Flame, Medal, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const mockLeaderboard = [
  { rank: 1, name: "Sarah Mitchell", xp: 4850, streak: 21, achievements: 12, badge: "🥇" },
  { rank: 2, name: "Ahmed Khan", xp: 4200, streak: 18, achievements: 10, badge: "🥈" },
  { rank: 3, name: "Lisa Wang", xp: 3900, streak: 15, achievements: 9, badge: "🥉" },
  { rank: 4, name: "John Doe", xp: 3600, streak: 12, achievements: 8, badge: "" },
  { rank: 5, name: "Omar Hassan", xp: 3400, streak: 10, achievements: 7, badge: "" },
  { rank: 6, name: "Emily Chen", xp: 3100, streak: 8, achievements: 6, badge: "" },
  { rank: 7, name: "David Kim", xp: 2800, streak: 7, achievements: 5, badge: "" },
  { rank: 8, name: "Maria Garcia", xp: 2500, streak: 5, achievements: 4, badge: "" },
];

const InstructorLeaderboard = () => {
  return (
    <InstructorPageLayout>
      <section className="animate-slide-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-glow-accent">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Student Leaderboard</h1>
            <p className="text-muted-foreground text-sm">Top performing students across your courses</p>
          </div>
        </div>
      </section>

      {/* Top 3 Podium */}
      <section className="grid grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
        {mockLeaderboard.slice(0, 3).map((student, i) => (
          <Card key={student.rank} className={`shadow-soft border-border/50 text-center ${i === 0 ? "ring-2 ring-warning/30" : ""}`}>
            <CardContent className="pt-6 pb-4">
              <div className="text-3xl mb-2">{student.badge}</div>
              <Avatar className="w-14 h-14 mx-auto mb-2">
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {student.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-sm">{student.name}</h3>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Star className="w-3.5 h-3.5 text-warning" />
                <span className="font-bold text-sm">{student.xp.toLocaleString()} XP</span>
              </div>
              <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-500" />{student.streak}d</span>
                <span className="flex items-center gap-1"><Award className="w-3 h-3 text-accent" />{student.achievements}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Full List */}
      <section className="animate-slide-up" style={{ animationDelay: "200ms" }}>
        <Card className="shadow-soft border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Full Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockLeaderboard.map((student) => (
                <div key={student.rank} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <span className="w-8 text-center font-bold text-muted-foreground">#{student.rank}</span>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {student.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex-1 font-medium text-sm">{student.name}</span>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-warning" />{student.xp.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-500" />{student.streak}d</span>
                    <Badge variant="secondary" className="text-[10px]">{student.achievements} badges</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </InstructorPageLayout>
  );
};

export default InstructorLeaderboard;
