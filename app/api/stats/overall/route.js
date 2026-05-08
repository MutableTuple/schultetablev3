import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

// Safe to cache — this doesn't need real-time precision
export const revalidate = 60; // cache for 1 minute

export async function GET() {
  try {
    const twentyFourHoursAgo = new Date(
      Date.now() - 24 * 60 * 60 * 1000,
    ).toISOString();

    const { count, error } = await supabaseServer
      .from("SingleGameStat")
      .select("id", { count: "exact", head: true })
      .gt("time_taken", 0)
      .gte("created_at", twentyFourHoursAgo);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ count });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
