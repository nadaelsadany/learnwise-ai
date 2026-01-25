import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    tab?: string;
}

export const useAIChat = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    // Load history from localStorage on mount
    useEffect(() => {
        if (user) {
            const savedChat = localStorage.getItem(`chat_history_${user.id}`);
            if (savedChat) {
                try {
                    setMessages(JSON.parse(savedChat));
                } catch (e) {
                    console.error("Failed to parse chat history", e);
                }
            } else {
                setMessages([
                    {
                        id: '1',
                        role: 'assistant',
                        content: 'Hi! I am your AI Tutor. I can help you understand complex topics, create study plans, or quiz you on your courses. What shall we learn today?',
                        timestamp: new Date().toISOString()
                    }
                ]);
            }
        }
    }, [user]);

    // Save history to localStorage whenever it changes
    useEffect(() => {
        if (user && messages.length > 0) {
            localStorage.setItem(`chat_history_${user.id}`, JSON.stringify(messages));
        }
    }, [messages, user]);

    const sendMessage = useCallback(async (content: string, tab: string = "chat") => {
        if (!content.trim()) return;

        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            content,
            timestamp: new Date().toISOString(),
            tab
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        // Simulate AI thinking and response
        setTimeout(() => {
            let response = "";

            if (tab === "quiz") {
                response = `That's a good answer! Let's check: based on the ISTQB principles, the correct answer for "${content}" would be B. Here's why...`;
            } else if (tab === "study") {
                response = `I've updated your study plan for "${content}". I recommend 30 minutes of theory followed by a 15-minute practice quiz. Shall I add this to your calendar?`;
            } else {
                const responses = [
                    `That's a great question about "${content}". In the context of QA, this usually refers to...`,
                    `I can certainly help you with that. Would you like a detailed breakdown or a quick summary?`,
                    `Interesting point! According to the ISTQB syllabus, this concept is crucial for...`,
                    `Let me look that up for you. Based on your current progress, I recommend focusing on...`,
                    `I've analyzed your question. Here's a practice scenario to help you understand it better.`
                ];
                response = responses[Math.floor(Math.random() * responses.length)];
            }

            const assistantMessage: ChatMessage = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: response,
                timestamp: new Date().toISOString(),
                tab
            };

            setMessages(prev => [...prev, assistantMessage]);
            setIsLoading(false);
        }, 1500);
    }, []);

    const clearHistory = useCallback(() => {
        setMessages([
            {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: 'Chat history cleared. How else can I help you today?',
                timestamp: new Date().toISOString()
            }
        ]);
        if (user) {
            localStorage.removeItem(`chat_history_${user.id}`);
        }
    }, [user]);

    return {
        messages,
        isLoading,
        sendMessage,
        clearHistory
    };
};
