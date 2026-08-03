import { createUserClient } from "@/app/_lib/supabaseServer";

export async function GET() {
  try {
    const supabase = await createUserClient();

    const { data, error } = await supabase
      .from("BrainTestSessions")
      .select("id, display_name, user_id, total_score, avg_reaction_ms, overall_accuracy, country, completed_at")
      .order("total_score", { ascending: false })
      .limit(10);

    if (error) {
      console.error("BRAIN TEST LEADERBOARD ERROR:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ entries: data || [] });
  } catch (err) {
    console.error("BRAIN TEST LEADERBOARD SERVER ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
