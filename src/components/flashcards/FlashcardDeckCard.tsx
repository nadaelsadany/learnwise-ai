import { cn } from "@/lib/utils";
import { FlashcardDeck } from "./types";
import { Progress } from "@/components/ui/progress";
import {
    BookOpen,
    PenTool,
    Zap,
    BarChart3,
    Bot,
    Clock,
    Layers
} from "lucide-react";

interface FlashcardDeckCardProps {
    deck: FlashcardDeck;
    onClick?: () => void;
}

const iconMap: Record<string, React.ElementType> = {
    BookOpen,
    PenTool,
    Zap,
    BarChart3,
    Bot,
};

export function FlashcardDeckCard({ deck, onClick }: FlashcardDeckCardProps) {
    const Icon = iconMap[deck.icon] || Layers;
    const masteryPercent = Math.round((deck.masteredCount / deck.cardCount) * 100);

    return (
        <button
            onClick={onClick}
            className="w-full text-left group rounded-2xl bg-card border border-border/50 shadow-soft overflow-hidden transition-all duration-300 hover:shadow-elevated hover:-translate-y-1"
        >
            {/* Gradient Header */}
            <div className={cn("h-24 relative bg-gradient-to-br", deck.color)}>
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                </div>
                {deck.dueCount > 0 && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
                        {deck.dueCount} due
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                    {deck.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {deck.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" />
                        <span>{deck.cardCount} cards</span>
                    </div>
                    {deck.lastStudied && (
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Studied {deck.lastStudied.toLocaleDateString()}</span>
                        </div>
                    )}
                </div>

                {/* Mastery Progress */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Mastery</span>
                        <span className="font-medium">{masteryPercent}%</span>
                    </div>
                    <Progress value={masteryPercent} className="h-2" />
                </div>
            </div>
        </button>
    );
}
