import { NextResponse } from "next/server";
import { createUserClient } from "@/lib/supabaseServer";

export async function POST(req) {
  try {
    const supabaseServer = await createUserClient();

    const { celebratedUserId } = await req.json();

    if (!celebratedUserId) {
      return NextResponse.json(
        { error: "Missing celebratedUserId" },
        { status: 400 },
      );
    }

    // First check if record exists
    const { data: existing, error: fetchError } = await supabaseServer
      .from("celebrations")
      .select("*")
      .eq("user_id", celebratedUserId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    let updatedData;

    if (existing) {
      const { data, error } = await supabaseServer
        .from("celebrations")
        .update({
          count: existing.count + 1,
          last_celebrated_at: new Date().toISOString(),
        })
        .eq("user_id", celebratedUserId)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      updatedData = data;
    } else {
      const { data, error } = await supabaseServer
        .from("celebrations")
        .insert([
          {
            user_id: celebratedUserId,
            count: 1,
            last_celebrated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      updatedData = data;
    }

    return NextResponse.json(updatedData);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}