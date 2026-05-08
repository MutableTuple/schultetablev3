import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req, { params }) {
  try {
    const slug = params.slug;

    const { data, error } = await supabaseServer
      .from("Blogs")
      .select("*")
      .eq("slug", slug)
      .single(); // important → returns single object

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
