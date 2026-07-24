import { NextResponse } from "next/server";
import { supabase } from "@/app/_lib/supabase";

// GET /api/duels/[id]?userId=... — the duel plus joined challenger/opponent
// info, used by the live duel room.
export async function GET(req, { params }) {
  const { id } = await params;
  const userId = req.nextUrl.searchParams.get("userId");

  const { data: duel, error } = await supabase
    .from("Duels")
    .select(
      `
      *,
      challenger:User!Duels_challenger_id_fkey(id, name, username, image),
      opponent:User!Duels_opponent_id_fkey(id, name, username, image)
    `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !duel) {
    return NextResponse.json({ error: "Duel not found" }, { status: 404 });
  }
  if (userId && duel.challenger_id !== userId && duel.opponent_id !== userId) {
    return NextResponse.json({ error: "Not a participant in this duel" }, { status: 403 });
  }

  return NextResponse.json({ duel });
}

// PATCH /api/duels/[id] — accept / decline a pending challenge, or mark
// yourself ready in the live room. Ready state lives in the DB (not
// Presence metadata) so both clients pick it up via the same
// postgres_changes subscription they already use for start/finish — no
// separate realtime payload-propagation path to go wrong.
// body: { userId, action: "accept" | "decline" | "ready" }
export async function PATCH(req, { params }) {
  const { id } = await params;
  const body = await req.json();
  const { userId, action } = body;

  if (!userId || !action) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data: duel, error: duelError } = await supabase
    .from("Duels")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (duelError || !duel) {
    return NextResponse.json({ error: "Duel not found" }, { status: 404 });
  }
  if (duel.challenger_id !== userId && duel.opponent_id !== userId) {
    return NextResponse.json({ error: "Not a participant in this duel" }, { status: 403 });
  }

  let update = null;

  if (action === "accept") {
    if (duel.opponent_id !== userId || duel.status !== "pending") {
      return NextResponse.json({ error: "This duel can't be accepted" }, { status: 400 });
    }
    update = { status: "active" };
  } else if (action === "decline") {
    if (duel.opponent_id !== userId || duel.status !== "pending") {
      return NextResponse.json({ error: "This duel can't be declined" }, { status: 400 });
    }
    update = { status: "declined" };
  } else if (action === "ready") {
    if (!["active", "in_progress"].includes(duel.status)) {
      return NextResponse.json({ error: "This duel isn't ready to be started" }, { status: 400 });
    }
    const isChallenger = duel.challenger_id === userId;
    update = isChallenger ? { challenger_ready: true } : { opponent_ready: true };
  } else {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  const { data, error } = await supabase.from("Duels").update(update).eq("id", id).select().single();

  if (error) {
    console.error("Duel update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ duel: data });
}
