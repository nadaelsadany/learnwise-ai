import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ApplicantSidebar } from "@/components/layout/ApplicantSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    StopCircle,
    History,
    PlusCircle,
    Search,
    MoreVertical,
    MessageSquare,
    Sparkles,
    Send,
    Bot,
    User,
    Zap,
    Trash2,
    Mic,
    MicOff,
    Volume2
} from "lucide-react";

import { useAIChat } from "@/hooks/useAIChat";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { useToast } from "@/hooks/use-toast";

const StudentAITutor = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const { messages, isLoading, sendMessage, clearHistory } = useAIChat();
    const [inputMessage, setInputMessage] = useState("");
    const [speakingId, setSpeakingId] = useState<string | null>(null);
    const [revealedTranscriptIds, setRevealedTranscriptIds] = useState<Set<string>>(new Set());

    // Chat History States
    const [conversations, setConversations] = useState([
        { id: "1", title: "Quantum Physics Basics", date: "2 hours ago" },
        { id: "2", title: "Calculus Study Plan", date: "Yesterday" },
        { id: "3", title: "React Hook Debugging", date: "3 days ago" },
    ]);
    const [activeConversationId, setActiveConversationId] = useState("1");
    const [searchQuery, setSearchQuery] = useState("");

    const [isVoiceStarting, setIsVoiceStarting] = useState(false);

    const { isListening, transcript, volume, startListening, stopListening, setTranscript } = useVoiceRecognition();
    const { toast } = useToast();

    const handleToggleVoice = () => {
        if (isListening) {
            stopListening();
            setIsVoiceStarting(false);
        } else {
            setIsVoiceStarting(true);
            setTranscript("");
            setInputMessage("");
            startListening((text) => {
                if (text.trim()) {
                    sendMessage(text, "chat");
                }
                setIsVoiceStarting(false);
            });
            toast({
                title: "Activating Microphone...",
                description: "Speak when you see 'Listening'",
            });
        }
    };

    const toggleReveal = (id: string) => {
        setRevealedTranscriptIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const speakMessage = (text: string, id: string) => {
        if (speakingId === id) {
            window.speechSynthesis.cancel();
            setSpeakingId(null);
            return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setSpeakingId(null);
        setSpeakingId(id);
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
            stopListening();
        };
    }, [stopListening]);

    // 1. Synchronize voice state with UI while listening
    useEffect(() => {
        if (isListening) {
            setIsVoiceStarting(false);
            if (transcript) setInputMessage(transcript);
        }
    }, [isListening, transcript]);

    // 3. Auto-speak new AI messages
    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant' && lastMessage.id !== '1') {
            setTimeout(() => {
                speakMessage(lastMessage.content, lastMessage.id);
            }, 100);
        }
    }, [messages]);

    useEffect(() => {
        const query = searchParams.get("q");
        if (query) {
            sendMessage(query);
            setSearchParams({});
        }
    }, [searchParams]);

    const handleSendMessage = async (text?: string) => {
        const messageToSend = text || inputMessage;
        if (!messageToSend.trim() || isLoading) return;
        sendMessage(messageToSend, "chat");
        setInputMessage("");
    };

    const suggestedPrompts = [
        "Explain Quantum Entanglement",
        "Create a study schedule",
        "Quiz me on React Hooks",
    ];

    return (
        <div className="min-h-screen bg-background">
            <ApplicantSidebar onCollapse={setSidebarCollapsed} />
            <Header sidebarCollapsed={sidebarCollapsed} userRole="Student" />

            <main className={cn(
                "pt-16 transition-all duration-300 h-screen overflow-hidden",
                sidebarCollapsed ? "ml-20" : "ml-64"
            )}>
                <div className="flex h-full border-t border-border/50">
                    {/* Task 3: Chat History Sidebar */}
                    <div className="w-80 border-r border-border/50 bg-card/30 flex flex-col hidden md:flex">
                        <div className="p-4 border-b border-border/50 space-y-4">
                            <Button className="w-full justify-start gap-2 gradient-primary shadow-glow-primary h-11" onClick={() => clearHistory()}>
                                <PlusCircle className="w-4 h-4" />
                                New Chat
                            </Button>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search chats..." 
                                    className="pl-9 h-10 bg-muted/30 border-none rounded-xl"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <ScrollArea className="flex-1">
                            <div className="p-3 space-y-1">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-2 mt-2">Recent Chats</p>
                                {conversations.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase())).map((chat) => (
                                    <button
                                        key={chat.id}
                                        onClick={() => setActiveConversationId(chat.id)}
                                        className={cn(
                                            "w-full flex flex-col gap-0.5 p-3 rounded-xl transition-all text-left group",
                                            activeConversationId === chat.id 
                                                ? "bg-primary/10 text-primary" 
                                                : "hover:bg-muted text-foreground"
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold truncate flex-1">{chat.title}</span>
                                            <MoreVertical className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <span className="text-[10px] text-muted-foreground">{chat.date}</span>
                                    </button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Task 4: Main Chat Area */}
                    <div className="flex-1 flex flex-col relative bg-background">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-border/50 flex items-center justify-between bg-background/50 backdrop-blur-sm z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow-primary">
                                    <Bot className="w-5 h-5 text-primary-foreground" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold">AI Personal Tutor</h2>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Online</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground"><History className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => clearHistory()} className="rounded-full text-muted-foreground"><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <ScrollArea className="flex-1">
                            <div className="max-w-4xl mx-auto p-6 space-y-8">
                                {messages.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                                        <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center shadow-glow-primary animate-bounce-slow">
                                            <Sparkles className="w-10 h-10 text-primary-foreground" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold">How can I help you learn today?</h3>
                                            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">I'm your personal AI tutor, ready to explain concepts, build study plans, or quiz your knowledge.</p>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg pt-4">
                                            {suggestedPrompts.map((prompt, i) => (
                                                <Button 
                                                    key={i} 
                                                    variant="outline" 
                                                    className="justify-start gap-3 h-auto py-4 px-5 rounded-2xl bg-card border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-medium group"
                                                    onClick={() => handleSendMessage(prompt)}
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                        <MessageSquare className="w-4 h-4" />
                                                    </div>
                                                    {prompt}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {messages.map((msg) => (
                                    <div key={msg.id} className={cn(
                                        "flex gap-6 group animate-in fade-in slide-in-from-bottom-4 duration-500",
                                        msg.role === 'user' ? "flex-row-reverse" : ""
                                    )}>
                                        <div className={cn(
                                            "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                                            msg.role === 'user' ? "bg-primary text-primary-foreground" : "bg-card border border-border/50"
                                        )}>
                                            {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5 text-primary" />}
                                        </div>

                                        <div className={cn(
                                            "flex flex-col gap-3 max-w-[85%]",
                                            msg.role === 'user' ? "items-end" : "items-start"
                                        )}>
                                            {msg.role === 'assistant' ? (
                                                <div className="flex flex-col gap-3 w-full">
                                                    <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-soft leading-relaxed text-sm">
                                                        {msg.content}
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className={cn(
                                                                "h-8 rounded-xl gap-2 text-xs",
                                                                speakingId === msg.id ? "text-primary bg-primary/10" : "text-muted-foreground"
                                                            )}
                                                            onClick={() => speakMessage(msg.content, msg.id)}
                                                        >
                                                            {speakingId === msg.id ? <StopCircle className="w-3.5 h-3.5 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5" />}
                                                            {speakingId === msg.id ? "Speaking..." : "Read Aloud"}
                                                        </Button>
                                                        <Button variant="ghost" size="sm" className="h-8 rounded-xl text-muted-foreground hover:text-primary gap-2 text-xs"><History className="w-3.5 h-3.5" /> Explain More</Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-primary text-primary-foreground rounded-3xl px-6 py-4 shadow-glow-primary text-sm font-medium leading-relaxed">
                                                    {msg.content}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="flex gap-6 animate-pulse">
                                        <div className="w-10 h-10 rounded-2xl bg-card border border-border/50 flex items-center justify-center shrink-0">
                                            <Bot className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                        <div className="bg-card border border-border/50 rounded-3xl px-6 py-4 flex items-center gap-1.5 shadow-sm">
                                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        {/* Input Area */}
                        <div className="p-6 bg-gradient-to-t from-background via-background to-transparent pt-12">
                            <div className="max-w-4xl mx-auto space-y-4">
                                {/* Task 5: Smart Prompt Chips */}
                                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                    {suggestedPrompts.map((prompt, i) => (
                                        <Button 
                                            key={i} 
                                            variant="ghost" 
                                            size="sm" 
                                            className="whitespace-nowrap rounded-full bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all text-[11px] h-8 px-3 text-muted-foreground"
                                            onClick={() => handleSendMessage(prompt)}
                                        >
                                            <Zap className="w-3 h-3 mr-1.5 text-yellow-500" />
                                            {prompt}
                                        </Button>
                                    ))}
                                </div>

                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[2rem] blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                                    <div className="relative bg-card border border-border/50 rounded-[2rem] p-2 flex items-center gap-2 shadow-xl">
                                        {(isListening || isVoiceStarting) && (
                                            <div className="absolute -top-12 left-0 right-0 flex justify-center animate-in slide-in-from-bottom-2">
                                                <div className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-glow-primary flex items-center gap-2">
                                                    <Mic className="w-3 h-3 animate-pulse" />
                                                    {isVoiceStarting ? "Mic Warming Up..." : "Listening..."}
                                                </div>
                                            </div>
                                        )}
                                        <Input
                                            placeholder="Ask anything about your studies..."
                                            value={inputMessage}
                                            onChange={(e) => setInputMessage(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                                            disabled={isLoading || isListening || isVoiceStarting}
                                            className="border-none bg-transparent focus-visible:ring-0 px-4 py-6 h-12 text-sm"
                                        />
                                        <div className="flex items-center gap-1.5 pr-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className={cn(
                                                    "rounded-full transition-all duration-300 w-10 h-10",
                                                    (isListening || isVoiceStarting) ? "bg-destructive text-destructive-foreground" : "hover:bg-primary/10 text-muted-foreground hover:text-primary"
                                                )}
                                                onClick={handleToggleVoice}
                                            >
                                                {(isListening || isVoiceStarting) ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                            </Button>
                                            <Button 
                                                onClick={() => handleSendMessage()}
                                                disabled={!inputMessage.trim() || isLoading}
                                                size="icon" 
                                                className="rounded-full w-10 h-10 gradient-primary shadow-glow-primary transition-transform hover:scale-105 active:scale-95"
                                            >
                                                <Send className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[10px] text-center text-muted-foreground px-10">AI Tutor can provide insights on your courses, summarize lessons, and create adaptive quizzes. Check history to resume previous chats.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudentAITutor;
