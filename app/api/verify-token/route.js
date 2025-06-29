// /app/api/verify-token/route.js
import { supabase } from "@/app/_lib/supabase";

export async function POST(req) {
  const { userId, token } = await req.json();

  const { data, error } = await supabase
    .from("User")
    .select("verification_token")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 400,
    });
  }

  if (data.verification_token === token) {
    await supabase
      .from("User")
      .update({ is_verified: true, verification_token: null })
      .eq("id", userId);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  return new Response(JSON.stringify({ error: "Invalid token" }), {
    status: 400,
  });
}
