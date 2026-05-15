import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Brain, FileQuestion, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface GenerationModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedChapters: { id: string; title: string }[];
    initialType?: "quiz" | "mock";
}

export function GenerationModal({
    isOpen,
    onClose,
    selectedChapters,
    initialType = "quiz"
}: GenerationModalProps) {
    const [type, setType] = useState<"quiz" | "mock">(initialType);
    const [difficulty, setDifficulty] = useState("medium");
    const [questionCount, setQuestionCount] = useState("10");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = () => {
        setIsGenerating(true);
        
        // Simulate AI generation
        setTimeout(() => {
            setIsGenerating(false);
            toast.success(`${type === "quiz" ? "Quiz" : "Mock Exam"} generated successfully!`, {
                description: `Based on ${selectedChapters.length} chapter(s). Saved to Practice section.`,
            });
            onClose();
        }, 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        AI Practice Generator
                    </DialogTitle>
                    <DialogDescription>
                        Configure your AI-generated practice session based on course content.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Selected Chapters Summary */}
                    <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Selected Content</Label>
                        <div className="p-3 rounded-lg bg-muted/50 border border-border/50 max-h-[100px] overflow-y-auto">
                            <ul className="space-y-1">
                                {selectedChapters.map((ch) => (
                                    <li key={ch.id} className="text-sm flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                        <span className="truncate">{ch.title}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Practice Type</Label>
                            <Select value={type} onValueChange={(val: any) => setType(val)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="quiz">
                                        <div className="flex items-center gap-2">
                                            <Brain className="w-4 h-4" />
                                            <span>Quiz</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="mock">
                                        <div className="flex items-center gap-2">
                                            <FileQuestion className="w-4 h-4" />
                                            <span>Mock Exam</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Difficulty</Label>
                            <Select value={difficulty} onValueChange={setDifficulty}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="easy">Easy</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="hard">Hard</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Number of Questions</Label>
                        <Input 
                            type="number" 
                            value={questionCount} 
                            onChange={(e) => setQuestionCount(e.target.value)}
                            min={5}
                            max={50}
                        />
                        <p className="text-[11px] text-muted-foreground">
                            AI will generate unique questions for the selected chapters.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isGenerating}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleGenerate} 
                        disabled={isGenerating}
                        className="gradient-primary shadow-glow-primary gap-2"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Generate Now
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
