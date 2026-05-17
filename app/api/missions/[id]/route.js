import { NextResponse } from "next/server";
import { createUserClient } from "@/app/_lib/supabaseServer";

export async function GET(req, { params }) {
  try {
    const supabaseServer = await createUserClient();

    const missionId = params.id;

    if (!missionId) {
      return NextResponse.json(
        { error: "Missing mission id" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from("missions")
      .select("*")
      .eq("id", missionId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(null);
      }

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}