import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/app/_utils/getCurrentUser";

// still needed for the calc_message RPC call itself
async function getServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // no-op in contexts where cookies can't be mutated
          }
        },
      },
    },
  );
}

// Everything below is "premium" — stripped entirely for non-Pro users so it
// never leaves the server. Only `avg_reaction_last10` and `fastest_last10`
// survive, since those back the legitimately-free KpiStrip "Reaction Time"
// card (free: true). `percentile` is redacted too — it drives BrainScoreCard's
// grade/ring, ConsistencyCard's "Global Percentile", and KpiStrip's Accuracy
// card, all of which are locked.
function redactForFreeTier(intel) {
  return {
    ...intel,
    game_by_game_avg: null,
    game_by_game_fastest: null,
    game_by_game_consistency: null,
    game_dates: null,
    stability_score: null,
    overall_trend_score: null,
    reaction_trend: null,
    consistency_trend: null,
    drift_rate: null,
    consistency_change: null,
    avg_change: null,
    avg_prev10: null,
    insight: null,
    percentile: null,
    fatigue_score: null,
    avg_consistency_last10: null, // ← added: drives this card's verdict, big value, and insight
  };
}

export async function GET() {
  // Reuses your existing getCurrentUser() instead of a second, separate
  // profile-table lookup — this is the same function every page.js in this
  // app already calls successfully to resolve is_pro_user, so it's the real
  // source of truth instead of a guess at a table name.
  const { user, error: userError } = await getCurrentUser();

  if (userError || !user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isPro = user.is_pro_user === true;

  const supabase = await getServerSupabase();
  const { data: intel, error } = await supabase.rpc("calc_message", {
    p_user_id: user.id,
  });

  if (error || !intel) {
    console.error("calc_message RPC failed:", error);
    return NextResponse.json(
      { error: error?.message ?? "No data" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    intel: isPro ? intel : redactForFreeTier(intel),
    isPro,
  });
}
