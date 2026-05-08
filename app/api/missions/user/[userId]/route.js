import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req, { params }) {
  try {
    const userId = params.userId;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from("user_missions")
      .select(
        `
        id,
        is_completed,
        created_at,
        missions (
          id,
          mission_title,
          mission_type,
          duration
        )
      `,
      )
      .eq("user_id", userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
