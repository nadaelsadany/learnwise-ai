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
    Sparkles,
    Send,
    Bot,
    User,
    BookOpen,
    Brain,
    Zap,
    Trash2,
    Mic,
    MicOff,
    Volume2,
    StopCircle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAIChat } from "@/hooks/useAIChat";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";

const StudentAITutor = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const { messages, isLoading, sendMessage, clearHistory } = useAIChat();
    const [inputMessage, setInputMessage] = useState("");
    const [activeTab, setActiveTab] = useState("chat");
    const [speakingId, setSpeakingId] = useState<string | null>(null);

    const { isListening, transcript, startListening, stopListening } = useVoiceRecognition();

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
        return () => window.speechSynthesis.cancel();
    }, []);

    useEffect(() => {
        if (transcript) {
            setInputMessage(transcript);
        }
    }, [transcript]);

    useEffect(() => {
        const query = searchParams.get("q");
        if (query) {
            sendMessage(query);
            setSearchParams({}); // Clear the param after sending
        }
    }, [searchParams]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;
        sendMessage(inputMessage, activeTab);
        setInputMessage("");
    };

    const suggestedPrompts = [
        "Explain Quantum Entanglement",
        "Create a study schedule for my Calculus exam",
        "Quiz me on React Hooks",
        "Summarize the last lesson"
    ];

    return (
        <div className="min-h-screen bg-background">
            <ApplicantSidebar onCollapse={setSidebarCollapsed} />
            <Header sidebarCollapsed={sidebarCollapsed} userRole="Student" />

            <main className={cn(
                "pt-20 pb-8 px-6 transition-all duration-300",
                sidebarCollapsed ? "ml-20" : "ml-64"
            )}>
                <div className="max-w-5xl mx-auto space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Sparkles className="w-8 h-8 text-primary" />
                            AI Personal Tutor
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Your personalized learning companion. Available 24/7.
                        </p>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="grid grid-cols-3 w-full max-w-xl">
                            <TabsTrigger value="chat" className="gap-2"><Bot className="w-4 h-4" /> Chat & Explain</TabsTrigger>
                            <TabsTrigger value="study" className="gap-2"><BookOpen className="w-4 h-4" /> Study Plan</TabsTrigger>
                            <TabsTrigger value="quiz" className="gap-2"><Brain className="w-4 h-4" /> Quiz Me</TabsTrigger>
                        </TabsList>

                        <div className="grid lg:grid-cols-4 gap-6">
                            {/* Chat Area */}
                            <Card className="lg:col-span-3 h-[600px] flex flex-col">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Conversation</CardTitle>
                                        <CardDescription>
                                            {activeTab === 'chat' && "Ask anything. I can explain concepts, debug code, or translate text."}
                                            {activeTab === 'study' && "Let's build a personalized study schedule based on your goals."}
                                            {activeTab === 'quiz' && "Test your knowledge with adaptive quizzes."}
                                        </CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={clearHistory} className="text-muted-foreground">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Clear
                                    </Button>
                                </CardHeader>
                                <CardContent className="flex-1 overflow-hidden p-0">
                                    <ScrollArea className="h-full p-4">
                                        <div className="space-y-4">
                                            {messages.map((msg) => (
                                                <div key={msg.id} className={cn(
                                                    "flex gap-3 max-w-[80%]",
                                                    msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                                )}>
                                                    <div className={cn(
                                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                                        msg.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted"
                                                    )}>
                                                        {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                                    </div>
                                                    <div className={cn(
                                                        "rounded-2xl px-4 py-2 text-sm relative group/msg",
                                                        msg.role === 'user'
                                                            ? "bg-primary text-primary-foreground rounded-tr-none"
                                                            : "bg-muted rounded-tl-none"
                                                    )}>
                                                        {msg.content}

                                                        {msg.role === 'assistant' && (
                                                            <button
                                                                onClick={() => speakMessage(msg.content, msg.id)}
                                                                className="absolute -right-8 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted text-muted-foreground opacity-0 group-hover/msg:opacity-100 transition-opacity"
                                                            >
                                                                {speakingId === msg.id ? (
                                                                    <StopCircle className="w-4 h-4 text-destructive" />
                                                                ) : (
                                                                    <Volume2 className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            {isLoading && (
                                                <div className="flex gap-3 mr-auto max-w-[80%]">
                                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                                        <Bot className="w-4 h-4" />
                                                    </div>
                                                    <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-2 flex items-center gap-1">
                                                        <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                        <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                        <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                                <CardFooter className="p-4 border-t">
                                    <form
                                        className="flex w-full items-center gap-2"
                                        onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                                    >
                                        <Input
                                            placeholder={activeTab === 'quiz' ? "Answer here..." : "Type your question..."}
                                            value={inputMessage}
                                            onChange={(e) => setInputMessage(e.target.value)}
                                            disabled={isLoading}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className={cn(
                                                "rounded-xl transition-all",
                                                isListening && "bg-destructive/10 text-destructive animate-pulse"
                                            )}
                                            onClick={isListening ? stopListening : startListening}
                                            disabled={isLoading}
                                        >
                                            {isListening ? (
                                                <MicOff className="w-4 h-4" />
                                            ) : (
                                                <Mic className="w-4 h-4" />
                                            )}
                                        </Button>
                                        <Button type="submit" size="icon" disabled={!inputMessage.trim() || isLoading}>
                                            <Send className="w-4 h-4" />
                                        </Button>
                                    </form>
                                </CardFooter>
                            </Card>

                            {/* Sidebar / Suggestions */}
                            <div className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm">Quick Actions</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {suggestedPrompts.map((prompt, i) => (
                                            <Button
                                                key={i}
                                                variant="outline"
                                                className="w-full justify-start h-auto py-2 px-3 text-xs text-left whitespace-normal leading-snug"
                                                onClick={() => {
                                                    sendMessage(prompt, activeTab);
                                                }}
                                            >
                                                <Zap className="w-3 h-3 mr-2 shrink-0 text-yellow-500" />
                                                {prompt}
                                            </Button>
                                        ))}
                                    </CardContent>
                                </Card>

                                <Card className="bg-primary/5 border-primary/20">
                                    <CardHeader>
                                        <CardTitle className="text-sm flex items-center gap-2">
                                            <Brain className="w-4 h-4 text-primary" />
                                            Learning Stats
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Topics Mastered</span>
                                            <span className="font-medium">12</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Questions Asked</span>
                                            <span className="font-medium">45</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </Tabs>
                </div>
            </main>
        </div>
    );
};

export default StudentAITutor;
