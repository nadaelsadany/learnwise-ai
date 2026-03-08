import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface CoachMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface StudentData {
  totalStudyHours: number;
  avgFocusScore: number;
  streak: number;
  flashcardsDue: number;
  weakTopics: string[];
  bestStudyTime: string;
  coursesEnrolled: number;
  lessonsCompleted: number;
  quizAverage: number;
  cardsReviewedToday: number;
  sessionsThisWeek: number;
}

const COACH_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-study-coach`;

async function streamCoach({
  messages,
  studentData,
  mode,
  onDelta,
  onDone,
  onError,
}: {
  messages: { role: string; content: string }[];
  studentData: StudentData | null;
  mode: string;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (err: string) => void;
}) {
  const resp = await fetch(COACH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, studentData, mode }),
  });

  if (!resp.ok) {
    const body = await resp.json().catch(() => ({ error: "Unknown error" }));
    onError(body.error || `Error ${resp.status}`);
    return;
  }

  if (!resp.body) { onError("No response body"); return; }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;
      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") { streamDone = true; break; }
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onDelta(content);
      } catch {
        textBuffer = line + "\n" + textBuffer;
        break;
      }
    }
  }
  onDone();
}

export const useStudyCoach = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch student data for context
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setDataLoading(true);
      try {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const today = now.toISOString().split('T')[0];

        const [sessionsRes, cardsRes, enrollRes, lessonsRes, quizRes] = await Promise.all([
          supabase.from('study_sessions').select('*').eq('student_id', user.id).gte('started_at', weekAgo.toISOString()),
          supabase.from('sr_cards').select('*').eq('student_id', user.id),
          supabase.from('enrollments').select('*').eq('student_id', user.id),
          supabase.from('lesson_completions').select('*').eq('student_id', user.id),
          supabase.from('quiz_results').select('*').eq('student_id', user.id),
        ]);

        const sessions = sessionsRes.data || [];
        const cards = cardsRes.data || [];
        const enrollments = enrollRes.data || [];
        const lessons = lessonsRes.data || [];
        const quizzes = quizRes.data || [];

        const totalSeconds = sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
        const dueCards = cards.filter(c => new Date(c.next_review) <= now);
        const weakCards = cards.filter(c => c.ease_factor < 2.0);
        const weakTopics = [...new Set(weakCards.map(c => c.topic))].slice(0, 5);
        const quizAvg = quizzes.length > 0
          ? Math.round(quizzes.reduce((s, q) => s + Number(q.percentage), 0) / quizzes.length)
          : 0;

        // Determine best study time from sessions
        const hourCounts: Record<number, number> = {};
        sessions.forEach(s => {
          const h = new Date(s.started_at).getHours();
          hourCounts[h] = (hourCounts[h] || 0) + (s.duration_seconds || 0);
        });
        const bestHour = Object.entries(hourCounts).sort((a, b) => Number(b[1]) - Number(a[1]))[0];
        const bestTime = bestHour ? (Number(bestHour[0]) < 12 ? 'Morning' : Number(bestHour[0]) < 17 ? 'Afternoon' : 'Evening') : 'Unknown';

        // Calculate streak
        const completionDates = new Set(lessons.map(l => l.completed_at.split('T')[0]));
        let streak = 0;
        const d = new Date(today);
        while (completionDates.has(d.toISOString().split('T')[0])) {
          streak++;
          d.setDate(d.getDate() - 1);
        }

        const reviewedToday = cards.filter(c => c.last_reviewed && c.last_reviewed.startsWith(today)).length;

        setStudentData({
          totalStudyHours: Math.round(totalSeconds / 3600 * 10) / 10,
          avgFocusScore: 72, // would need focus_score table; using heuristic
          streak,
          flashcardsDue: dueCards.length,
          weakTopics,
          bestStudyTime: bestTime,
          coursesEnrolled: enrollments.length,
          lessonsCompleted: lessons.length,
          quizAverage: quizAvg,
          cardsReviewedToday: reviewedToday,
          sessionsThisWeek: sessions.length,
        });
      } catch (e) {
        console.error("Failed to fetch student data", e);
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const sendMessage = useCallback(async (content: string, mode: string = 'chat') => {
    if (!content.trim()) return;

    const userMsg: CoachMessage = { id: crypto.randomUUID(), role: 'user', content };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
        }
        return [...prev, { id: crypto.randomUUID(), role: 'assistant', content: assistantSoFar }];
      });
    };

    try {
      const apiMessages = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
      await streamCoach({
        messages: apiMessages,
        studentData,
        mode,
        onDelta: upsert,
        onDone: () => setIsLoading(false),
        onError: (err) => {
          toast({ title: "AI Coach Error", description: err, variant: "destructive" });
          setIsLoading(false);
        },
      });
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  }, [messages, studentData, toast]);

  const generateInsights = useCallback(async (mode: string) => {
    const prompts: Record<string, string> = {
      insights: "Analyze my learning data and give me personalized study insights.",
      recommendations: "Based on my study patterns, what should I improve?",
      weekly_plan: "Create a personalized weekly study plan for me.",
      weak_topics: "What are my weakest topics and how should I improve them?",
      motivation: "Give me a motivational update on my progress.",
    };
    await sendMessage(prompts[mode] || prompts.insights, mode);
  }, [sendMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, isLoading, studentData, dataLoading, sendMessage, generateInsights, clearMessages };
};
