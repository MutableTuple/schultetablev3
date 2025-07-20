import toast from "react-hot-toast";
import { supabase } from "./supabase";
import showProgressToast from "../_components/Missions/ProgressToast";
import showMissionCompletedToast from "../_components/Missions/MissionCompletedToast";

export async function getAllAds() {
  const { data, error } = await supabase.from("Ads").select("*");

  if (error) console.error(error);
  return data;
}
async function trackGameSession(total_wrong_click, total_right_click, user) {
  const { data, error } = await supabase
    .from("SingleGameStat")
    .insert([{ total_wrong_click, total_right_click, time_taken, user }])
    .select();
  return data;
}

export async function getStatsofUser(user_id) {
  const { data, error } = await supabase
    .from("SingleGameStat")
    .select("*")
    .eq("user", user_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Supabase Error:", error);
    return null;
  }

  if (!data || data.length === 0) {
    console.warn("⚠️ No data found for this user.");
    return [];
  }

  console.log("✅ Data fetched:", data);
  return data;
}

export async function addUsertoDB(name, id, email, username, avatarUrl, token) {
  await supabase.from("User").insert([
    {
      id,
      name,
      email,
      username,
      image: avatarUrl,
      verification_token: token,
      is_verified: false,
    },
  ]);
}

export async function fetchUserFromDB(id) {
  const { data, error } = await supabase.from("User").select("*").eq("id", id);

  if (error) console.error("cant fetch user for some reason", error);
  console.log("Data", data);
  return data;
}

export async function updateProfile(name, social_link, bio, nationality, id) {
  const { data, error } = await supabase
    .from("User")
    .update({ name, social_link, bio, nationality })
    .eq("id", id)
    .select();

  if (error) console.error("err", error);
  return data;
}

export async function getAllNotifications() {
  const { data, error } = await supabase.from("Notification").select("*");
  if (error) console.error("cannot fetch", error);
  return data;
}
export async function getAllBlogs() {
  const { data, error } = await supabase.from("Blogs").select("*");
  if (error) console.error("cannot fetch", error);
  return data;
}
export async function getBlogBySlugName(slug) {
  const { data, error } = await supabase
    .from("Blogs")
    .select("*")
    .eq("slug", slug);
  if (error) console.error("cannot fetch", error);
  return data;
}

export async function getFastestTimeForGame(gridSize, difficulty) {
  const { data, error } = await supabase
    .from("SingleGameStat")
    .select("user, time_taken, grid_size, difficulty")
    .eq("grid_size", gridSize)
    .eq("difficulty", difficulty)
    .gt("time_taken", 0); // no sort or limit

  if (error) {
    console.log("Error fetching times:", error);
    return null;
  }

  // Convert time_taken to numbers and find the min
  const validTimes = data
    .map((entry) => ({
      ...entry,
      time_taken_num: parseFloat(entry.time_taken),
    }))
    .filter((entry) => !isNaN(entry.time_taken_num));

  const fastest = validTimes.reduce(
    (min, curr) => (curr.time_taken_num < min.time_taken_num ? curr : min),
    validTimes[0]
  );

  return fastest || null;
}

export async function getGamePlayedTimes(gridSize, difficulty) {
  const { count, error } = await supabase
    .from("SingleGameStat")
    .select("id", { count: "exact", head: true }) // head:true fetches no rows, just count
    .eq("grid_size", gridSize)
    .eq("difficulty", difficulty)
    .gt("time_taken", 0);

  if (error) {
    console.log("Error fetching game played times count:", error);
    return null;
  }

  return count; // number of times this game mode was played
}

export async function getOverallStats() {
  const twentyFourHoursAgo = new Date(
    Date.now() - 24 * 60 * 60 * 1000
  ).toISOString();

  const { count, error } = await supabase
    .from("SingleGameStat")
    .select("id", { count: "exact", head: true })
    .gt("time_taken", 0)
    .gte("created_at", twentyFourHoursAgo);

  if (error) {
    console.log("Error fetching overall stats:", error);
    return null;
  }

  return count; // total games played in last 24 hrs
}
export async function getCurrentUserGameData(id) {
  const { data, error } = await supabase
    .from("UniversalGameStats")
    .select("*")
    .eq("user_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single(); // or use "completedAt" if you have it

  if (error) {
    console.error("Can't fetch user game data:", error);
    return null;
  }

  return data;
}

export async function getGameById(id) {
  const { data, error } = await supabase
    .from("UniversalGameStats")
    .select("*")
    .eq("id", id);

  if (error) {
    console.error("Can't fetch user game data:", error);
    return null;
  }

  return data;
}
export async function getUserById(id) {
  const { data, error } = await supabase.from("User").select("*").eq("id", id);

  if (error) {
    console.error("Can't fetch user game data:", error);
    return null;
  }

  return data;
}
export async function getUserByUsername(username) {
  const { data, error } = await supabase
    .from("User")
    .select("*")
    .eq("username", username);

  if (error) {
    console.error("Can't fetch user game data:", error);
    return null;
  }

  return data;
}

export async function getMissionByID(id) {
  const { data, error } = await supabase
    .from("missions")
    .select("*")
    .eq("id", id);

  if (error) {
    console.error("Can't fetch user game data:", error);
    return null;
  }

  return data;
}
export async function getUserMissionsCompletions() {
  const { data, error } = await supabase.from("user_missions").select(`
      *,
      User:User(*),
      missions(*)
    `);

  if (error) {
    console.error("Can't fetch user game data:", error);
    return null;
  }

  return data;
}

export async function checkAndUpdateUserMissions(userId) {
  if (!userId) return;

  try {
    const { data: allMissions, error: missionsError } = await supabase
      .from("missions")
      .select("*");

    if (missionsError) {
      console.error("Error fetching missions:", missionsError.message);
      return;
    }

    for (const mission of allMissions) {
      const goal = parseInt(mission.actual_mission_value);
      let completed = false;

      if (mission.mission_type === "global_challenge_complete_1000_games") {
        const { count, error } = await supabase
          .from("UniversalGameStats")
          .select("*", { count: "exact", head: true })
          .gte("created_at", mission.created_at)
          .lte("created_at", mission.duration);
        // .neq("user_id", null);

        if (!error && typeof count === "number") {
          if (count >= goal) {
            completed = true;
          } else if (count > 0) {
            // ✅ Show animated progress toast
            showProgressToast({
              count,
              goal,
              title: "Global Mission",
              subtitle: `Progress for "${mission.mission_title}"`,
            });
          }

          // ✅ Insert or update participation
          const { data: existing, error: fetchError } = await supabase
            .from("user_missions")
            .select("*")
            .eq("user_id", userId)
            .eq("mission_id", mission.id)
            .single();

          if (fetchError && fetchError.code !== "PGRST116") {
            // Not just a "no rows" error
            console.error(
              "Error checking existing user_mission:",
              fetchError.message
            );
            continue;
          }

          if (!existing) {
            // New participant
            await supabase.from("user_missions").insert([
              {
                user_id: userId,
                mission_id: mission.id,
                is_completed: completed,
              },
            ]);
            console.log("🔄 Inserted new user_mission participation");

            if (completed) {
              showMissionCompletedToast({
                title: "Global Mission Completed!",
                subtitle: mission.mission_title,
                missionId: mission.id,
              });
            }
          } else if (!existing.is_completed && completed) {
            // Update to mark as completed
            await supabase
              .from("user_missions")
              .update({ is_completed: true })
              .eq("user_id", userId)
              .eq("mission_id", mission.id);

            showMissionCompletedToast({
              title: "Global Mission Completed!",
              subtitle: mission.mission_title,
              missionId: mission.id,
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("checkAndUpdateUserMissions failed:", error.message);
  }
}

export async function incrementCelebrateCount(celebratedUserId) {
  const { data: existing, error } = await supabase
    .from("celebrations")
    .select("*")
    .eq("user_id", celebratedUserId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Fetch error:", error);
    return;
  }

  if (existing) {
    // Increment
    await supabase
      .from("celebrations")
      .update({
        count: existing.count + 1,
        last_celebrated_at: new Date().toISOString(),
      })
      .eq("user_id", celebratedUserId);
  } else {
    // Insert new
    await supabase.from("celebrations").insert([
      {
        user_id: celebratedUserId,
        count: 1,
        last_celebrated_at: new Date().toISOString(),
      },
    ]);
  }
}
export async function getAllUsers() {
  const { data, error } = await supabase.from("User").select("*");

  if (error) {
    console.error("Can't Users", error);
    return null;
  }

  return data;
}
