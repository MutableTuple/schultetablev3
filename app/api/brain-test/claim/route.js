import { createUserClient } from "@/app/_lib/supabaseServer";
import { supabaseAdmin } from "@/app/_lib/supabaseAdmin";
// Retroactively attaches a logged-in user's id to Brain Test rounds that
// were saved anonymously (user_id null) while they were still a guest.
// Uses the service-role client for the UPDATE since RLS won't generally let
// a user claim rows they didn't originally own.
export async function POST(req) {
  try {
    const supabase = await createUserClient();
    const { sessionId } = await req.json();

    if (!sessionId) {
      return Response.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      return Response.json({ error: "Not logged in" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("UniversalGameStats")
      .update({ user_id: user.id })
      .is("user_id", null)
      .eq("game_summary->>brainTestSessionId", sessionId)
      .select("id");

    if (error) {
      console.error("BRAIN TEST CLAIM ERROR:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    // Also attach the completed-test summary row, if one exists yet (it's
    // only inserted once round 10 finishes, so this is a no-op for an
    // in-progress attempt claimed mid-test).
    let profileName = null;
    const { data: profile } = await supabase
      .from("User")
      .select("name")
      .eq("id", user.id)
      .maybeSingle();
    profileName = profile?.name || user.email || "Player";

    const { error: sessionUpdateError } = await supabaseAdmin
      .from("BrainTestSessions")
      .update({ user_id: user.id, display_name: profileName })
      .is("user_id", null)
      .eq("session_id", sessionId);

    if (sessionUpdateError) {
      console.error("BRAIN TEST SESSION CLAIM ERROR:", sessionUpdateError);
    }

    return Response.json({ success: true, claimed: data?.length ?? 0 });
  } catch (err) {
    console.error("BRAIN TEST CLAIM SERVER ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
