import { InstructorPageLayout } from "@/components/instructor/InstructorPageLayout";
import { MessageSquare, Pin, Clock, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const mockDiscussions = [
  { id: 1, title: "How do I approach the final project?", author: "Sarah M.", course: "ML 101", replies: 8, pinned: true, time: "2h ago" },
  { id: 2, title: "Confusion about gradient descent steps", author: "Ahmed K.", course: "ML 101", replies: 12, pinned: true, time: "4h ago" },
  { id: 3, title: "Study group for midterm?", author: "Lisa W.", course: "Statistics", replies: 5, pinned: false, time: "6h ago" },
  { id: 4, title: "Resource recommendation for regression", author: "John D.", course: "ML 101", replies: 3, pinned: false, time: "1d ago" },
  { id: 5, title: "Assignment 2 deadline extension?", author: "Omar H.", course: "Business Strategy", replies: 15, pinned: false, time: "1d ago" },
];

const InstructorDiscussions = () => {
  return (
    <InstructorPageLayout>
      <section className="animate-slide-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-glow-accent">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Discussions</h1>
            <p className="text-muted-foreground text-sm">Monitor and moderate course discussions</p>
          </div>
        </div>
      </section>

      <section className="space-y-3 animate-slide-up" style={{ animationDelay: "100ms" }}>
        {mockDiscussions.map((d) => (
          <Card key={d.id} className="shadow-soft border-border/50 hover:shadow-elevated transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="w-9 h-9 mt-0.5">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">{d.author.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {d.pinned && <Pin className="w-3.5 h-3.5 text-accent flex-shrink-0" />}
                    <h3 className="font-medium text-sm truncate">{d.title}</h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{d.author}</span>
                    <Badge variant="outline" className="text-[10px]">{d.course}</Badge>
                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{d.replies}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{d.time}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </InstructorPageLayout>
  );
};

export default InstructorDiscussions;
