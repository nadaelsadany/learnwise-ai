import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { energyLevel, courses, existingBlocks, date } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a study schedule optimizer. Generate a daily study schedule as a JSON array of time blocks.

Rules:
- Energy level preference: ${energyLevel || "balanced"}
  - If "morning": Schedule hardest subjects 6-11am, lighter review afternoon, breaks evening
  - If "afternoon": Schedule deep work 12-5pm, morning for review, evening for light tasks
  - If "night": Schedule deep work 6-11pm, morning/afternoon for lighter tasks
  - If "balanced": Distribute evenly with breaks
- Include breaks every 90 minutes
- Each block needs: title, startTime (HH:MM), endTime (HH:MM), category (study|break|review|practice|personal)
- Schedule between 06:00 and 22:00
- Include 1-hour lunch break around noon
- Total study time should be 4-6 hours
- If courses are provided, distribute study across them
- Avoid conflicts with existing blocks

Return ONLY a JSON array, no markdown, no explanation. Example:
[{"title":"Deep Study - Math","startTime":"08:00","endTime":"09:30","category":"study"}]`;

    const userPrompt = `Generate a study schedule for ${date || "today"}.
${courses?.length ? `Courses: ${courses.join(", ")}` : "General study day"}
${existingBlocks?.length ? `Already scheduled (avoid conflicts): ${JSON.stringify(existingBlocks)}` : "No existing blocks"}`;

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
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in workspace settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "[]";
    
    // Parse the JSON from the response
    let blocks;
    try {
      // Try to extract JSON array from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      blocks = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      console.error("Failed to parse AI response:", content);
      blocks = [];
    }

    return new Response(JSON.stringify({ blocks }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-schedule error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
