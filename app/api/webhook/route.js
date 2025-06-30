import { supabase } from "@/app/_lib/supabase";

export async function POST(req) {
  const body = await req.json();

  if (body.meta?.event_name === "order_created") {
    const email = body.data?.attributes?.user_email;
    const userId = body.meta?.custom_data?.user_id; // ← Correct path now

    if (!email || !userId) {
      console.error("Missing email or user ID", { email, userId });
      return new Response("Missing email or user ID", { status: 400 });
    }

    const { error } = await supabase
      .from("User")
      .update({ is_pro_user: true })
      .eq("id", userId);

    if (error) {
      console.error("Supabase update error:", error.message);
      return new Response("Database error", { status: 500 });
    }

    return new Response("User upgraded to Pro", { status: 200 });
  }

  return new Response("Ignored", { status: 200 });
}
