import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const gridSize = searchParams.get("gridSize");
    const difficulty = searchParams.get("difficulty");

    if (!gridSize || !difficulty) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseServer
      .from("SingleGameStat")
      .select("user, time_taken, grid_size, difficulty")
      .eq("grid_size", gridSize)
      .eq("difficulty", difficulty)
      .gt("time_taken", 0)
      .order("time_taken", { ascending: true }) // DB sorts
      .limit(1); // Only return fastest

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0] || null);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
