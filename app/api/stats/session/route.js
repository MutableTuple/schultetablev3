import { NextResponse } from "next/server";
import { createUserClient } from "@/app/_lib/supabaseServer";

export async function POST(req) {
  try {
    const body = await req.json();
    const { total_wrong_click, total_right_click, time_taken, user } = body;

    if (!user || time_taken == null) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const supabase = await createUserClient();

    const { data, error } = await supabase
      .from("SingleGameStat")
      .insert([
        {
          total_wrong_click,
          total_right_click,
          time_taken,
          user,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
