import { useState, useEffect } from "react";
import { ApplicantSidebar } from "@/components/layout/ApplicantSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Search,
    MoreVertical,
    MessageSquare,
    Send,
    User,
    PlusCircle,
    Paperclip,
    Image as ImageIcon,
    Smile,
    Info,
    Video,
    Phone,
    Users
} from "lucide-react";

// Mock Data
const instructors = [
    { id: "1", name: "Dr. Sarah Mitchell", role: "Quantum Physics Instructor", avatar: "/avatars/mitchell.jpg", status: "online", lastSeen: "Active now" },
    { id: "2", name: "Prof. James Wilson", role: "Calculus & Algebra", avatar: "/avatars/wilson.jpg", status: "offline", lastSeen: "Seen 2h ago" },
    { id: "3", name: "Elena Rodriguez", role: "Web Development Head", avatar: "/avatars/rodriguez.jpg", status: "online", lastSeen: "Active now" },
];

const mockMessages = [
    { id: "1", senderId: "1", text: "Hello Alex! How can I help you with the Quantum Physics assignment?", timestamp: "10:30 AM", isMe: false },
    { id: "2", senderId: "me", text: "Hi Dr. Mitchell! I'm having some trouble understanding the double-slit experiment results.", timestamp: "10:32 AM", isMe: true },
    { id: "3", senderId: "1", text: "That's a classic stumbling block. Would you like to schedule a quick video call to discuss the wave-particle duality?", timestamp: "10:35 AM", isMe: false },
];

const InstructorChat = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeInstructorId, setActiveInstructorId] = useState("1");
    const [inputMessage, setInputMessage] = useState("");
    const [messages, setMessages] = useState(mockMessages);

    const activeInstructor = instructors.find(i => i.id === activeInstructorId);

    const handleSendMessage = () => {
        if (!inputMessage.trim()) return;
        const newMessage = {
            id: Date.now().toString(),
            senderId: "me",
            text: inputMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true
        };
        setMessages([...messages, newMessage]);
        setInputMessage("");
    };

    return (
        <div className="min-h-screen bg-background">
            <ApplicantSidebar onCollapse={setSidebarCollapsed} />
            <Header sidebarCollapsed={sidebarCollapsed} userRole="Student" />

            <main className={cn(
                "pt-16 transition-all duration-300 h-screen overflow-hidden",
                sidebarCollapsed ? "ml-20" : "ml-64"
            )}>
                <div className="flex h-full border-t border-border/50">
                    {/* Conversations Sidebar */}
                    <div className="w-80 border-r border-border/50 bg-card/30 flex flex-col hidden md:flex">
                        <div className="p-4 border-b border-border/50 space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold">Messages</h2>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <PlusCircle className="w-5 h-5 text-primary" />
                                </Button>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search instructors..." 
                                    className="pl-9 h-10 bg-muted/30 border-none rounded-xl"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <ScrollArea className="flex-1">
                            <div className="p-3 space-y-1">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-2 mt-2">Active Conversations</p>
                                {instructors.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())).map((instructor) => (
                                    <button
                                        key={instructor.id}
                                        onClick={() => setActiveInstructorId(instructor.id)}
                                        className={cn(
                                            "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group",
                                            activeInstructorId === instructor.id 
                                                ? "bg-primary/10 text-primary" 
                                                : "hover:bg-muted text-foreground"
                                        )}
                                    >
                                        <div className="relative shrink-0">
                                            <Avatar className="w-12 h-12 rounded-xl shadow-sm">
                                                <AvatarImage src={instructor.avatar} />
                                                <AvatarFallback className="bg-primary/5 text-primary">
                                                    {instructor.name.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            {instructor.status === 'online' && (
                                                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-success border-2 border-background rounded-full" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold truncate">{instructor.name}</span>
                                                <span className="text-[10px] text-muted-foreground">10:35 AM</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate">{instructor.role}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col bg-background relative">
                        {activeInstructor ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b border-border/50 flex items-center justify-between bg-background/50 backdrop-blur-sm z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="relative shrink-0">
                                            <Avatar className="w-10 h-10 rounded-xl">
                                                <AvatarImage src={activeInstructor.avatar} />
                                                <AvatarFallback>{activeInstructor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                            {activeInstructor.status === 'online' && (
                                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success border-2 border-background rounded-full animate-pulse" />
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-bold">{activeInstructor.name}</h2>
                                            <p className="text-[10px] text-muted-foreground">{activeInstructor.lastSeen}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground"><Phone className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground"><Video className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground"><Info className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground"><MoreVertical className="w-4 h-4" /></Button>
                                    </div>
                                </div>

                                {/* Messages Area */}
                                <ScrollArea className="flex-1">
                                    <div className="p-6 space-y-6 max-w-4xl mx-auto">
                                        <div className="text-center">
                                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest bg-muted px-3 py-1 rounded-full">Today</span>
                                        </div>
                                        {messages.map((msg) => (
                                            <div key={msg.id} className={cn(
                                                "flex gap-3 group animate-in fade-in slide-in-from-bottom-2",
                                                msg.isMe ? "flex-row-reverse" : ""
                                            )}>
                                                {!msg.isMe && (
                                                    <Avatar className="w-8 h-8 rounded-lg shrink-0 mt-1">
                                                        <AvatarImage src={activeInstructor.avatar} />
                                                        <AvatarFallback>{activeInstructor.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                )}
                                                <div className={cn(
                                                    "flex flex-col gap-1 max-w-[70%]",
                                                    msg.isMe ? "items-end" : "items-start"
                                                )}>
                                                    <div className={cn(
                                                        "px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                                                        msg.isMe 
                                                            ? "bg-primary text-primary-foreground rounded-tr-none" 
                                                            : "bg-card border border-border/50 rounded-tl-none"
                                                    )}>
                                                        {msg.text}
                                                    </div>
                                                    <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>

                                {/* Chat Input */}
                                <div className="p-4 bg-background border-t border-border/50">
                                    <div className="max-w-4xl mx-auto flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary"><Paperclip className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary hidden sm:flex"><ImageIcon className="w-4 h-4" /></Button>
                                        </div>
                                        <div className="flex-1 relative">
                                            <Input 
                                                placeholder="Type your message..." 
                                                value={inputMessage}
                                                onChange={(e) => setInputMessage(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                                className="rounded-2xl bg-muted/30 border-border/50 focus-visible:ring-primary/20 h-11 pr-10"
                                            />
                                            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full text-muted-foreground hover:text-primary h-9 w-9">
                                                <Smile className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <Button 
                                            size="icon" 
                                            className="rounded-2xl w-11 h-11 gradient-primary shadow-glow-primary shrink-0 transition-transform hover:scale-105 active:scale-95"
                                            onClick={handleSendMessage}
                                            disabled={!inputMessage.trim()}
                                        >
                                            <Send className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-10 space-y-4">
                                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary animate-bounce-slow">
                                    <MessageSquare className="w-10 h-10" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Select a conversation</h3>
                                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">Choose an instructor from the list to start chatting about your courses.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default InstructorChat;
