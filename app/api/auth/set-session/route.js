import { NextResponse } from "next/server";
import { setSession } from "@/app/_lib/auth";
import { supabase } from "@/app/_lib/supabase";
import { supabaseServer } from "@/app/_lib/supabaseServer";

export async function POST(req) {
  const { access_token, refresh_token } = await req.json();

  // 🔥 get user from token
  const { data } = await supabase.auth.getUser(access_token);

  const session = {
    access_token,
    refresh_token,
    user: data.user,
  };

  // ✅ store in YOUR cookies
  await setSession(session);

  // ✅ create user in DB if needed
  const { data: existing } = await supabaseServer
    .from("User")
    .select("*")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!existing) {
    await supabaseServer.from("User").insert([
      {
        id: data.user.id,
        name: data.user.user_metadata?.full_name,
        email: data.user.email,
        image: data.user.user_metadata?.avatar_url,
      },
    ]);
  }

  return NextResponse.json({ success: true });
}
