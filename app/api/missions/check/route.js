import { NextResponse } from "next/server";
import { createUserClient } from "@/app/_lib/supabaseServer";

export async function POST(req) {
  try {
    const supabaseServer = await createUserClient();

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    const { data: allMissions, error: missionsError } =
      await supabaseServer
        .from("missions")
        .select("*");

    if (missionsError) {
      return NextResponse.json(
        { error: missionsError.message },
        { status: 500 }
      );
    }

    const results = [];

    for (const mission of allMissions) {
      const goal = parseInt(mission.actual_mission_value);
      let completed = false;
      let progress = null;

      if (
        mission.mission_type ===
        "global_challenge_complete_1000_games"
      ) {
        const { count, error } = await supabaseServer
          .from("UniversalGameStats")
          .select("id", { count: "exact", head: true })
          .gte("created_at", mission.created_at)
          .lte("created_at", mission.duration);

        if (!error && typeof count === "number") {
          progress = { count, goal };

          if (count >= goal) {
            completed = true;
          }

          const { data: existing, error: fetchError } =
            await supabaseServer
              .from("user_missions")
              .select("*")
              .eq("user_id", userId)
              .eq("mission_id", mission.id)
              .single();

          if (
            fetchError &&
            fetchError.code !== "PGRST116"
          ) {
            continue;
          }

          if (!existing) {
            await supabaseServer
              .from("user_missions")
              .insert([
                {
                  user_id: userId,
                  mission_id: mission.id,
                  is_completed: completed,
                },
              ]);
          } else if (
            !existing.is_completed &&
            completed
          ) {
            await supabaseServer
              .from("user_missions")
              .update({ is_completed: true })
              .eq("user_id", userId)
              .eq("mission_id", mission.id);
          }

          results.push({
            missionId: mission.id,
            missionTitle: mission.mission_title,
            completed,
            progress,
          });
        }
      }
    }

    return NextResponse.json(results);
  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}