import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/_lib/supabaseServer";

export async function GET(req, { params }) {
  try {
    const userId = params.id;

    if (!userId) {
      return NextResponse.json({ error: "Missing user id" }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from("User")
      .select("*")
      .eq("id", userId)
      .single(); // important

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(null);
      }

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
