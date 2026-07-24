import { NextResponse } from "next/server";
import { supabase } from "@/app/_lib/supabase";

// GET /api/duels?userId=... — every duel this user is part of, newest first.
export async function GET(req) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("Duels")
    .select(
      `
      *,
      challenger:User!Duels_challenger_id_fkey(id, name, username, image),
      opponent:User!Duels_opponent_id_fkey(id, name, username, image)
    `,
    )
    .or(`challenger_id.eq.${userId},opponent_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Duels list error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ duels: data ?? [] });
}

// POST /api/duels — create a new challenge.
// body: { challengerId, opponentUsername, gridSize, difficulty, gameMode }
export async function POST(req) {
  const body = await req.json();
  const { challengerId, opponentUsername, gridSize, difficulty, gameMode } = body;

  if (!challengerId || !opponentUsername || !gridSize || !difficulty || !gameMode) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data: opponent, error: lookupError } = await supabase
    .from("User")
    .select("id")
    .eq("username", opponentUsername.trim())
    .maybeSingle();

  if (lookupError) {
    console.error("Opponent lookup error:", lookupError);
    return NextResponse.json({ error: "Failed to look up opponent" }, { status: 500 });
  }
  if (!opponent) {
    return NextResponse.json({ error: "No player found with that username" }, { status: 404 });
  }
  if (opponent.id === challengerId) {
    return NextResponse.json({ error: "You can't challenge yourself" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("Duels")
    .insert({
      challenger_id: challengerId,
      opponent_id: opponent.id,
      opponent_username: opponentUsername.trim(),
      grid_size: gridSize,
      difficulty,
      game_mode: gameMode,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("Duel create error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ duel: data }, { status: 201 });
}
