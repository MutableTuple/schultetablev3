import { NextResponse } from "next/server";
import { supabase } from "@/app/_lib/supabase";

// POST /api/duels/[id]/finish — records this player's completion time, plus
// the score/accuracy/mistakes computed client-side and the id of the
// matching row this same run wrote to UniversalGameStats (via
// /api/games/complete), so the duel and the universal stats stay linked.
// body: { userId, timeMs, score, accuracy, mistakes, gameId }
export async function POST(req, { params }) {
  const { id } = await params;
  const body = await req.json();
  const { userId, timeMs, score, accuracy, mistakes, gameId } = body;

  if (!userId || timeMs == null) {
    return NextResponse.json({ error: "Missing userId/timeMs" }, { status: 400 });
  }

  const { error } = await supabase.rpc("finish_duel", {
    p_duel_id: id,
    p_user_id: userId,
    p_time_ms: Math.round(timeMs),
    p_score: score ?? null,
    p_accuracy: accuracy ?? null,
    p_mistakes: mistakes ?? null,
    p_game_id: gameId ?? null,
  });

  if (error) {
    console.error("Finish duel error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
