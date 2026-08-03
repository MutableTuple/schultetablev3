import { createUserClient } from "@/app/_lib/supabaseServer";

function computeAggregates(rounds) {
  const totalScore = rounds.reduce((a, r) => a + r.score, 0);
  const avgReactionMs = Math.round(
    rounds.reduce((a, r) => a + r.avgReactionTimeMs, 0) / rounds.length,
  );
  const fastestMs = Math.min(...rounds.map((r) => r.fastestMs));
  const overallAccuracy = Number(
    (rounds.reduce((a, r) => a + r.accuracy, 0) / rounds.length).toFixed(2),
  );
  const totalMistakes = rounds.reduce((a, r) => a + r.mistakes, 0);
  const totalTimeSec = Math.round(
    rounds.reduce((a, r) => a + r.durationMs, 0) / 1000,
  );

  return { totalScore, avgReactionMs, fastestMs, overallAccuracy, totalMistakes, totalTimeSec };
}

export async function POST(req) {
  try {
    const supabase = await createUserClient();
    const body = await req.json();
    const { sessionId, rounds, startedAt, country } = body;

    if (!sessionId || !Array.isArray(rounds) || rounds.length === 0) {
      return Response.json({ error: "Invalid payload" }, { status: 400 });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const stats = computeAggregates(rounds);

    let displayName = "Guest";
    if (user?.id) {
      const { data: profile } = await supabase
        .from("User")
        .select("name")
        .eq("id", user.id)
        .maybeSingle();
      displayName = profile?.name || user.email || "Player";
    }

    const { data: inserted, error } = await supabase
      .from("BrainTestSessions")
      .insert([
        {
          session_id: sessionId,
          user_id: user?.id || null,
          display_name: displayName,
          total_score: stats.totalScore,
          avg_reaction_ms: stats.avgReactionMs,
          fastest_ms: stats.fastestMs,
          overall_accuracy: stats.overallAccuracy,
          total_mistakes: stats.totalMistakes,
          total_time_sec: stats.totalTimeSec,
          rounds,
          country,
          started_at: startedAt,
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error("BRAIN TEST COMPLETE SAVE ERROR:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, id: inserted?.id ?? null });
  } catch (err) {
    console.error("BRAIN TEST COMPLETE SERVER ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
