import { useState } from "react";
import { InstructorSidebar } from "@/components/layout/InstructorSidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Sparkles,
    MessageSquare,
    FileText,
    CheckSquare,
    BarChart,
    Send,
    User,
    Bot,
    Copy,
    RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const InstructorAI = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState("chat");
    const { toast } = useToast();

    // Chat State
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Hello! I am your AI teaching assistant. How can I help you improve your courses today?',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    // Tool States
    const [quizTopic, setQuizTopic] = useState("");
    const [generatedQuiz, setGeneratedQuiz] = useState<string | null>(null);
    const [lessonTopic, setLessonTopic] = useState("");
    const [generatedLesson, setGeneratedLesson] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const newMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            content: inputMessage,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);
        setInputMessage("");
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const response: ChatMessage = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: `I can certainly help you with "${newMessage.content}". As an AI, I can assist with curriculum design, student engagement strategies, or technical explanations. What specific aspect would you like advice on?`,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, response]);
            setIsTyping(false);
        }, 1500);
    };

    const handleGenerateQuiz = () => {
        if (!quizTopic) return;
        setIsGenerating(true);

        // Mock Generation
        setTimeout(() => {
            setGeneratedQuiz(JSON.stringify([
                {
                    question: `What is the primary function of ${quizTopic}?`,
                    options: ["Option A", "Option B", "Option C", "Option D"],
                    answer: "Option B"
                },
                {
                    question: `Which of the following best describes ${quizTopic}?`,
                    options: ["Concept X", "Concept Y", "Concept Z"],
                    answer: "Concept X"
                }
            ], null, 2));
            setIsGenerating(false);
            toast({ title: "Quiz Generated", description: "Your quiz questions are ready." });
        }, 2000);
    };

    const handleGenerateLesson = () => {
        if (!lessonTopic) return;
        setIsGenerating(true);

        // Mock Generation
        setTimeout(() => {
            setGeneratedLesson(`
# Lesson Plan: ${lessonTopic}

## Learning Objectives
1. Understand the core concepts of ${lessonTopic}.
2. Apply ${lessonTopic} in real-world scenarios.

## Introduction (5 mins)
- Hook: Start with an interesting fact about ${lessonTopic}.
- Definition: Define key terms.

## Main Content (20 mins)
- Concept A: Detailed explanation.
- Concept B: Common pitfalls.
- Activity: Group discussion.

## Conclusion (5 mins)
- Recap key points.
- Q&A session.
            `);
            setIsGenerating(false);
            toast({ title: "Lesson Drafted", description: "Your lesson outline is ready." });
        }, 2000);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: "Copied!", description: "Content copied to clipboard." });
    };

    return (
        <div className="min-h-screen bg-background">
            <InstructorSidebar onCollapse={setSidebarCollapsed} />
            <Header sidebarCollapsed={sidebarCollapsed} userRole="Instructor" />

            <main className={cn(
                "pt-20 pb-8 px-6 transition-all duration-300",
                sidebarCollapsed ? "ml-20" : "ml-64"
            )}>
                <div className="max-w-6xl mx-auto space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Sparkles className="w-8 h-8 text-primary" />
                            AI Teaching Assistant
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Leverage AI to create content, grade assessments, and get teaching advice.
                        </p>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
                            <TabsTrigger value="chat" className="gap-2">
                                <MessageSquare className="w-4 h-4" /> Chat
                            </TabsTrigger>
                            <TabsTrigger value="quiz" className="gap-2">
                                <CheckSquare className="w-4 h-4" /> Quiz Gen
                            </TabsTrigger>
                            <TabsTrigger value="lesson" className="gap-2">
                                <FileText className="w-4 h-4" /> Lesson Drafter
                            </TabsTrigger>
                            <TabsTrigger value="insights" className="gap-2">
                                <BarChart className="w-4 h-4" /> Insights
                            </TabsTrigger>
                        </TabsList>

                        {/* Chat Interface */}
                        <TabsContent value="chat" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Card className="h-[600px] flex flex-col">
                                <CardHeader>
                                    <CardTitle>Assistant Chat</CardTitle>
                                    <CardDescription>Ask questions about course structure, engagement, or technical topics.</CardDescription>
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
                                                        "rounded-2xl px-4 py-2 text-sm",
                                                        msg.role === 'user'
                                                            ? "bg-primary text-primary-foreground rounded-tr-none"
                                                            : "bg-muted rounded-tl-none"
                                                    )}>
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            ))}
                                            {isTyping && (
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
                                    <div className="flex w-full items-center gap-2">
                                        <Input
                                            placeholder="Type your message..."
                                            value={inputMessage}
                                            onChange={(e) => setInputMessage(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                            disabled={isTyping}
                                        />
                                        <Button size="icon" onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
                                            <Send className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        {/* Quiz Generator */}
                        <TabsContent value="quiz" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Quiz Generator</CardTitle>
                                        <CardDescription>Generate multiple-choice questions from a topic.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Topic or Concept</Label>
                                            <Input
                                                placeholder="e.g. React Hooks, Photosynthesis..."
                                                value={quizTopic}
                                                onChange={(e) => setQuizTopic(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Difficulty</Label>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" className="flex-1">Easy</Button>
                                                <Button variant="outline" size="sm" className="flex-1 bg-accent/10 border-accent/20 text-accent-foreground">Medium</Button>
                                                <Button variant="outline" size="sm" className="flex-1">Hard</Button>
                                            </div>
                                        </div>
                                        <Button
                                            className="w-full"
                                            onClick={handleGenerateQuiz}
                                            disabled={!quizTopic || isGenerating}
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Generating...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-4 h-4 mr-2" /> Generate Quiz
                                                </>
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card className="h-full">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle>Result</CardTitle>
                                        {generatedQuiz && (
                                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(generatedQuiz)}>
                                                <Copy className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </CardHeader>
                                    <CardContent>
                                        {generatedQuiz ? (
                                            <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto h-[300px]">
                                                {generatedQuiz}
                                            </pre>
                                        ) : (
                                            <div className="h-[300px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                                                Generated content will appear here
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Lesson Drafter */}
                        <TabsContent value="lesson" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Lesson Drafter</CardTitle>
                                        <CardDescription>Create a structured lesson plan from a title.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Lesson Title</Label>
                                            <Input
                                                placeholder="e.g. Introduction to Thermodynamics"
                                                value={lessonTopic}
                                                onChange={(e) => setLessonTopic(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Target Audience level</Label>
                                            <Input placeholder="e.g. High School, Undergraduate" />
                                        </div>
                                        <Button
                                            className="w-full"
                                            onClick={handleGenerateLesson}
                                            disabled={!lessonTopic || isGenerating}
                                        >
                                            {isGenerating ? "Drafting..." : "Draft Lesson Plan"}
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle>Draft</CardTitle>
                                        {generatedLesson && (
                                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(generatedLesson)}>
                                                <Copy className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </CardHeader>
                                    <CardContent>
                                        {generatedLesson ? (
                                            <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-muted/30">
                                                <div className="whitespace-pre-wrap font-mono text-sm">
                                                    {generatedLesson}
                                                </div>
                                            </ScrollArea>
                                        ) : (
                                            <div className="h-[400px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                                                Draft will appear here
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Insights Mockup */}
                        <TabsContent value="insights" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Student Performance Analysis</CardTitle>
                                    <CardDescription>AI-driven insights on how your students are performing.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex gap-4 items-start border border-blue-100 dark:border-blue-900">
                                            <Sparkles className="w-5 h-5 text-blue-600 mt-1" />
                                            <div>
                                                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Key Insight</h4>
                                                <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                                                    Students seem to struggle with concepts introduced in "Chapter 3: State Management".
                                                    Quiz scores dropped by 15% on average compared to Chapter 2.
                                                </p>
                                                <Button variant="link" className="p-0 h-auto text-blue-600 mt-2 text-xs">Generate Review Material</Button>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div className="p-4 border rounded-lg">
                                                <p className="text-sm text-muted-foreground">Engagement Trend</p>
                                                <p className="text-2xl font-bold text-green-600">+12%</p>
                                                <p className="text-xs text-muted-foreground">vs last week</p>
                                            </div>
                                            <div className="p-4 border rounded-lg">
                                                <p className="text-sm text-muted-foreground">At Risk Students</p>
                                                <p className="text-2xl font-bold text-red-600">3</p>
                                                <p className="text-xs text-muted-foreground">Need attention</p>
                                            </div>
                                            <div className="p-4 border rounded-lg">
                                                <p className="text-sm text-muted-foreground">Top Performing Topic</p>
                                                <p className="text-lg font-bold">React Components</p>
                                                <p className="text-xs text-muted-foreground">95% avg score</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
};

export default InstructorAI;
