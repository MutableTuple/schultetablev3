import { NextResponse } from "next/server";
import { createUserClient } from "@/app/_lib/supabaseServer";

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

    const supabase = await createUserClient();

    const { count, error } = await supabase
      .from("SingleGameStat")
      .select("id", { count: "exact", head: true })
      .eq("grid_size", gridSize)
      .eq("difficulty", difficulty)
      .gt("time_taken", 0);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ count });
  } catch (err) {
    console.error(err);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
