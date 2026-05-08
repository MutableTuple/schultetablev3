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
    } = body;

    // Logged-in user if exists
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("API USER:", user);

    // If no user -> store NULL
    const finalUserId = user?.id || null;

    // 1️⃣ Save game (guest games included)
    const { error: insertError } = await supabase
      .from("UniversalGameStats")
      .insert([
        {
          user_id: finalUserId, // null for guests
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
      ]);

    if (insertError) {
      return Response.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    // 2️⃣ Only increment score for real users
    if (user?.id) {
      const { error: rpcError } = await supabase.rpc(
        "increment_user_score",
        {
          p_user_id: user.id,
          p_increment: score,
        }
      );

      if (rpcError) {
        console.error("RPC ERROR:", rpcError);
      }
    }

    // 3️⃣ Rank check
    const { data: timeData, error: timeError } = await supabase
      .from("UniversalGameStats")
      .select("time_taken")
      .eq("grid_size", gridSize)
      .eq("difficulty", difficulty)
      .eq("game_mode", mode)
      .order("time_taken", { ascending: true })
      .limit(3);

    if (timeError) {
      return Response.json(
        { error: timeError.message },
        { status: 500 }
      );
    }

    const timeTaken = elapsed / 1000;
    const top = timeData?.map((d) => d.time_taken) || [];

    let position = null;

    if (top.length === 0) position = 1;
    else if (timeTaken < top[0]) position = 1;
    else if (top[1] && timeTaken < top[1]) position = 2;
    else if (top[2] && timeTaken < top[2]) position = 3;

    return Response.json({
      success: true,
      position,
    });
  } catch (err) {
    console.error("SERVER ERROR:", err);

    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}