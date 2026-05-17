import { NextResponse } from "next/server";
import { createUserClient } from "@/app/_lib/supabaseServer";
import { supabase } from "@/app/_lib/supabase";

export async function POST(req) {
  const supabaseServer = await createUserClient();

  const { credential } = await req.json();

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: credential,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // ✅ ensure user exists in your DB
  const user = data.user;

  const { data: existing } = await supabaseServer
    .from("User")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!existing) {
    await supabaseServer.from("User").insert([
      {
        id: user.id,
        name: user.user_metadata?.full_name,
        email: user.email,
        image: user.user_metadata?.avatar_url,
      },
    ]);
  }

  return NextResponse.json({
    success: true,
    user,
  });
}