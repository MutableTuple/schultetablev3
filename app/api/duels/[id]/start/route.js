import { NextResponse } from "next/server";
import { supabase } from "@/app/_lib/supabase";

// POST /api/duels/[id]/start — idempotent: whichever player's client calls
// this first generates the shared board + start time; the other's call
// just returns what was already generated.
export async function POST(req, { params }) {
  const { id } = await params;
  const body = await req.json();
  const { userId } = body;

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const { data: duel } = await supabase.from("Duels").select("*").eq("id", id).maybeSingle();
  if (!duel) {
    return NextResponse.json({ error: "Duel not found" }, { status: 404 });
  }
  if (duel.challenger_id !== userId && duel.opponent_id !== userId) {
    return NextResponse.json({ error: "Not a participant in this duel" }, { status: 403 });
  }

  const { data, error } = await supabase.rpc("start_duel", { p_duel_id: id });
  if (error) {
    console.error("Start duel error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const result = data?.[0];
  return NextResponse.json({
    boardNumbers: result?.board_numbers ?? [],
    startedAt: result?.started_at ?? null,
  });
}
