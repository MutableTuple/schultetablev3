import { createUserClient } from "@/app/_lib/supabaseServer";

export async function POST(req) {
  try {
    const supabase = await createUserClient();
    const body = await req.json();

    const {
      gameSummary,
      gridSize,
      difficulty,
      totalTiles,
      mistakes,
      elapsed,
      score,
      mode,
      accuracy,
      country,
      fastestMs,
      avgMs,
      slowestMs,
      sessionId,
      roundIndex,
    } = body;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const finalUserId = user?.id || null;

    const enrichedSummary = {
      ...gameSummary,
      isBrainTest: true,
      brainTestSessionId: sessionId,
      brainTestRoundIndex: roundIndex,
    };

    const { data: inserted, error: insertError } = await supabase
      .from("UniversalGameStats")
      .insert([
        {
          user_id: finalUserId,
          game_summary: enrichedSummary,
          grid_size: gridSize,
          difficulty,
          total_right_click: totalTiles,
          total_wrong_click: mistakes,
          time_taken: elapsed / 1000,
          score,
          game_mode: mode,
          accuracy,
          country,
          fastest_ms: fastestMs,
          avg_reaction_ms: avgMs,
          slowest_ms: slowestMs,
        },
      ])
      .select("id")
      .single();

    if (insertError) {
      return Response.json({ error: insertError.message }, { status: 500 });
    }

    if (user?.id) {
      const { error: rpcError } = await supabase.rpc("increment_user_score", {
        p_user_id: user.id,
        p_increment: score,
      });
      if (rpcError) {
        console.error("RPC ERROR:", rpcError);
      }
    }

    return Response.json({
      success: true,
      gameId: inserted?.id ?? null,
      userId: finalUserId,
    });
  } catch (err) {
    console.error("BRAIN TEST ROUND SAVE ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
