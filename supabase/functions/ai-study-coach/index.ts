import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, studentData, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = buildSystemPrompt(studentData, mode);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits depleted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-study-coach error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function buildSystemPrompt(studentData: any, mode: string): string {
  const base = `You are an AI Study Coach — a personal learning mentor for students on the نافع (Nafea) platform. 
You are warm, motivational, data-driven, and actionable. Use emojis sparingly for encouragement.
Always give specific, personalized advice based on the student data provided.
Format your responses with markdown for readability (headers, bullet points, bold text).`;

  const dataContext = studentData ? `

## Student Context
- Total Study Hours: ${studentData.totalStudyHours ?? 'N/A'}
- Average Focus Score: ${studentData.avgFocusScore ?? 'N/A'}
- Current Streak: ${studentData.streak ?? 0} days
- Flashcards Due: ${studentData.flashcardsDue ?? 0}
- Weak Topics: ${studentData.weakTopics?.join(', ') || 'None identified'}
- Best Study Time: ${studentData.bestStudyTime ?? 'Unknown'}
- Courses Enrolled: ${studentData.coursesEnrolled ?? 0}
- Lessons Completed: ${studentData.lessonsCompleted ?? 0}
- Quiz Average: ${studentData.quizAverage ?? 'N/A'}%
- Cards Reviewed Today: ${studentData.cardsReviewedToday ?? 0}
- Study Sessions This Week: ${studentData.sessionsThisWeek ?? 0}
` : '';

  const modeInstructions: Record<string, string> = {
    insights: `Generate 4-6 personalized study insights based on the student data. Each insight should be specific, actionable, and encouraging. Include patterns you notice and areas for improvement. Structure as a list with emoji prefixes.`,
    recommendations: `Provide 4-5 smart study recommendations. Each should explain WHY and HOW to implement it. Be specific about timing, duration, and topics. Focus on actionable improvements.`,
    weekly_plan: `Generate a 7-day study plan based on the student's data, courses, and weak areas. Include specific time slots, topics, break times, and review sessions. Make it realistic and balanced. Format as a day-by-day schedule.`,
    weak_topics: `Analyze the student's weak topics and provide a detailed remediation plan. For each weak topic, suggest specific exercises, flashcard strategies, and AI-assisted learning approaches. Be encouraging but honest.`,
    motivation: `Generate a motivational message based on the student's current progress. Acknowledge achievements, set micro-goals for today, and provide encouragement. Keep it personal and specific to their data.`,
    chat: `You are having a conversation with the student. Answer their questions about study strategies, help them understand their progress, create plans, and motivate them. Be conversational and helpful.`,
  };

  return base + dataContext + '\n\n## Your Task\n' + (modeInstructions[mode] || modeInstructions.chat);
}
