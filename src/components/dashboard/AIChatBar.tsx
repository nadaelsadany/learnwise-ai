import { useState, useEffect } from "react";
import { Mic, Send, Sparkles, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";

interface AIChatBarProps {
  onSend?: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const AIChatBar = ({
  onSend,
  isLoading = false,
  placeholder = "Ask AI anything about your studies..."
}: AIChatBarProps) => {
  const [message, setMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const { isListening, transcript, startListening, stopListening, setTranscript } = useVoiceRecognition();

  useEffect(() => {
    if (transcript) {
      setMessage(transcript);
    }
  }, [transcript]);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend?.(message.trim());
      setMessage("");
      setTranscript("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pointer-events-none z-50">
      <div className="max-w-4xl mx-auto pointer-events-auto">
        <div className={cn(
          "relative rounded-2xl bg-card border border-border/50 shadow-elevated transition-all duration-300",
          isExpanded && "rounded-b-none"
        )}>
          {/* AI Glow Effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/20 via-primary/20 to-accent/20 blur-xl opacity-50 -z-10 animate-pulse-glow" />

          {/* Input Area */}
          <div className="flex items-center gap-2 p-3">
            {/* AI Icon */}
            <div className="flex-shrink-0 w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-glow-accent">
              <Sparkles className="w-5 h-5 text-accent-foreground" />
            </div>

            {/* Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsExpanded(true)}
                onBlur={() => !message && setIsExpanded(false)}
                placeholder={placeholder}
                className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground py-2 px-1"
                disabled={isLoading}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Voice Button */}
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-xl transition-all",
                  isListening && "bg-destructive/10 text-destructive animate-pulse"
                )}
                onClick={toggleVoice}
              >
                {isListening ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </Button>

              {/* Send Button */}
              <Button
                variant="accent"
                size="icon"
                className="rounded-xl"
                onClick={handleSend}
                disabled={!message.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Quick Suggestions */}
          {isExpanded && (
            <div className="px-3 pb-3 flex flex-wrap gap-2 animate-fade-in">
              {[
                "Explain test levels",
                "Quiz me on ISTQB",
                "Review my weak topics",
                "Create flashcards"
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setMessage(suggestion);
                    onSend?.(suggestion);
                  }}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
