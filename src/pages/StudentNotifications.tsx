import { useState } from "react";
import { ApplicantSidebar } from "@/components/layout/ApplicantSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Check, Zap, MessageSquare, BookOpen, Clock } from "lucide-react";

interface Notification {
    id: number;
    title: string;
    message: string;
    type: "deadline" | "message" | "system" | "course";
    time: string;
    read: boolean;
}

const StudentNotifications = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([
        { id: 1, title: "Assignment Due Soon", message: "Your assignment for 'React Basics' is due tomorrow.", type: "deadline", time: "2 hours ago", read: false },
        { id: 2, title: "New Course Material", message: "New video uploaded in 'Advanced CSS'.", type: "course", time: "5 hours ago", read: false },
        { id: 3, title: "Instructor Reply", message: "Instructor Sarah replied to your question.", type: "message", time: "1 day ago", read: true },
        { id: 4, title: "System Update", message: "LearnAI platform will be down for maintenance tonight.", type: "system", time: "2 days ago", read: true },
    ]);

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const markRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "deadline": return <Clock className="w-5 h-5 text-red-500" />;
            case "message": return <MessageSquare className="w-5 h-5 text-green-500" />;
            case "course": return <BookOpen className="w-5 h-5 text-purple-500" />;
            default: return <Zap className="w-5 h-5 text-yellow-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <ApplicantSidebar onCollapse={setSidebarCollapsed} />
            <Header sidebarCollapsed={sidebarCollapsed} userRole="Student" />

            <main className={cn(
                "pt-20 pb-8 px-6 transition-all duration-300",
                sidebarCollapsed ? "ml-20" : "ml-64"
            )}>
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Notifications</h1>
                            <p className="text-muted-foreground mt-1">
                                Stay updated with your courses and deadlines.
                            </p>
                        </div>
                        <Button variant="outline" onClick={markAllRead}>
                            <Check className="w-4 h-4 mr-2" /> Mark all as read
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <ScrollArea className="h-[600px]">
                                <div className="divide-y">
                                    {notifications.length === 0 ? (
                                        <div className="p-8 text-center text-muted-foreground">
                                            No notifications found.
                                        </div>
                                    ) : (
                                        notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={cn(
                                                    "flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                                                    !notification.read && "bg-muted/20"
                                                )}
                                                onClick={() => markRead(notification.id)}
                                            >
                                                <div className={cn(
                                                    "w-10 h-10 rounded-full bg-background border flex items-center justify-center shrink-0",
                                                    !notification.read && "border-primary/50 shadow-sm"
                                                )}>
                                                    {getIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className={cn("text-sm font-medium", !notification.read && "font-bold")}>
                                                            {notification.title}
                                                        </p>
                                                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                </div>
                                                {!notification.read && (
                                                    <span className="w-2 h-2 rounded-full bg-primary mt-2" />
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default StudentNotifications;
