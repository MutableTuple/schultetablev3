import { NextResponse } from "next/server";
import { createUserClient } from "@/lib/supabaseServer";

// Blogs don’t change every second → safe to cache
export const revalidate = 60;

export async function GET() {
  try {
    const supabaseServer = await createUserClient();

    const { data, error } = await supabaseServer
      .from("Blogs")
      .select("id, title, slug, thumbnail, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}