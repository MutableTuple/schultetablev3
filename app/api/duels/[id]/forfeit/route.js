import { NextResponse } from "next/server";
import { supabase } from "@/app/_lib/supabase";

// POST /api/duels/[id]/forfeit — called by the REMAINING player once they
// detect (via Realtime Presence) that their opponent disconnected and
// didn't come back within the grace period. Ends the duel in the caller's
// favor. Idempotent — no-ops if the duel already finished normally.
// body: { leavingUserId }
export async function POST(req, { params }) {
  const { id } = await params;
  const body = await req.json();
  const { leavingUserId } = body;

  if (!leavingUserId) {
    return NextResponse.json({ error: "Missing leavingUserId" }, { status: 400 });
  }

  const { error } = await supabase.rpc("forfeit_duel", {
    p_duel_id: id,
    p_leaving_user_id: leavingUserId,
  });

  if (error) {
    console.error("Forfeit duel error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
