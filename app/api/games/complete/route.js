import { createUserClient } from "@/app/_lib/supabaseServer";

function computeFasterThanPct(userAvgMs, benchmark) {
  if (!benchmark || (benchmark.total_games ?? 0) < 20) return null;
  const bands = [
    [1, benchmark.p01_avg],
    [5, benchmark.p05_avg],
    [10, benchmark.p10_avg],
    [25, benchmark.p25_avg],
    [50, benchmark.p50_avg],
    [75, benchmark.p75_avg],
    [90, benchmark.p90_avg],
    [95, benchmark.p95_avg],
    [99, benchmark.p99_avg],
  ].filter(([, v]) => v != null);
  if (!bands.length) return null;
  for (const [pct, val] of bands) {
    if (userAvgMs <= val) return 100 - pct;
  }
  return 1;
}

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
    } = body;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const finalUserId = user?.id || null;

    const { data: inserted, error: insertError } = await supabase
      .from("UniversalGameStats")
      .insert([
        {
          user_id: finalUserId,
          game_summary: gameSummary,
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

    const { data: timeData, error: timeError } = await supabase
      .from("UniversalGameStats")
      .select("time_taken")
      .eq("grid_size", gridSize)
      .eq("difficulty", difficulty)
      .eq("game_mode", mode)
      .order("time_taken", { ascending: true })
      .limit(3);

    if (timeError) {
      return Response.json({ error: timeError.message }, { status: 500 });
    }

    const timeTaken = elapsed / 1000;
    const top = timeData?.map((d) => d.time_taken) || [];

    let position = null;
    if (top.length === 0) position = 1;
    else if (timeTaken < top[0]) position = 1;
    else if (top[1] && timeTaken < top[1]) position = 2;
    else if (top[2] && timeTaken < top[2]) position = 3;

    // Real percentile — how this run compares to everyone else on this exact
    // grid/difficulty/mode. Only shown once there's enough of a field to mean
    // anything (>=20 games), otherwise it stays null and the UI hides it.
    const { data: benchmark } = await supabase
      .from("GlobalReactionStats")
      .select(
        "p01_avg, p05_avg, p10_avg, p25_avg, p50_avg, p75_avg, p90_avg, p95_avg, p99_avg, total_games",
      )
      .eq("grid_size", gridSize)
      .eq("difficulty", difficulty)
      .eq("game_mode", mode)
      .maybeSingle();

    const fasterThanPct = computeFasterThanPct(avgMs, benchmark);

    return Response.json({
      success: true,
      position,
      fasterThanPct,
      gameId: inserted?.id ?? null,
    });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
