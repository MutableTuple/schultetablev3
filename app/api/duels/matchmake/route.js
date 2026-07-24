import { NextResponse } from "next/server";
import { supabase } from "@/app/_lib/supabase";

// POST /api/duels/matchmake — join the queue for a grid/difficulty/mode
// combo. If a compatible waiting opponent already exists, matches
// immediately and returns the new active duel. Otherwise the caller is
// placed in the queue and the client should poll GET until matched.
// body: { userId, gridSize, difficulty, gameMode }
export async function POST(req) {
  const body = await req.json();
  const { userId, gridSize, difficulty, gameMode } = body;

  if (!userId || !gridSize || !difficulty || !gameMode) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabase.rpc("matchmake_duel", {
    p_user_id: userId,
    p_grid_size: gridSize,
    p_difficulty: difficulty,
    p_game_mode: gameMode,
  });

  if (error) {
    console.error("Matchmake error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const result = data?.[0];
  if (result?.matched) {
    return NextResponse.json({ matched: true, duelId: result.duel_id });
  }
  return NextResponse.json({ matched: false, waiting: true });
}

// GET /api/duels/matchmake?userId=... — poll while waiting in the queue.
export async function GET(req) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const { data: queueRow, error } = await supabase
    .from("DuelQueue")
    .select("id, matched_duel_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Matchmake poll error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!queueRow) {
    return NextResponse.json({ waiting: false, matched: false });
  }

  if (queueRow.matched_duel_id) {
    // Picked up — clean up the queue row now that the client has it.
    await supabase.from("DuelQueue").delete().eq("id", queueRow.id);
    return NextResponse.json({ waiting: false, matched: true, duelId: queueRow.matched_duel_id });
  }

  return NextResponse.json({ waiting: true, matched: false });
}

// DELETE /api/duels/matchmake?userId=... — leave the queue.
export async function DELETE(req) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const { error } = await supabase.from("DuelQueue").delete().eq("user_id", userId);
  if (error) {
    console.error("Matchmake cancel error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ cancelled: true });
}
