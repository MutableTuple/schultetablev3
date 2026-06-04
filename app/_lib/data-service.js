import toast from "react-hot-toast";
import { supabase } from "./supabase";
import showProgressToast from "../_components/Missions/ProgressToast";
import showMissionCompletedToast from "../_components/Missions/MissionCompletedToast";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

export async function getAllAds() {
  const res = await fetch("/api/ads");
  return res.json();
}

export async function trackGameSession(
  total_wrong_click,
  total_right_click,
  time_taken,
  user,
) {
  const res = await fetch("/api/stats/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      total_wrong_click,
      total_right_click,
      time_taken,
      user,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to track session");
  }

  return res.json();
}

export async function addUsertoDB(userData) {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-internal-request": "true",
    },
    body: JSON.stringify(userData),
  });

  return res.json();
}

export async function fetchUserFromDB(id) {
  try {
    const { data, error } = await supabase
      .from("User")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Failed to fetch user:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Server error while fetching user:", err);
    return null;
  }
}
export async function updateProfile(updates) {
  const res = await fetch("/api/users", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-internal-request": "true",
    },
    body: JSON.stringify(updates),
  });

  return res.json();
}
export async function getAllNotifications() {
  const res = await fetch("/api/notifications");

  if (!res.ok) {
    console.error("Failed to fetch notifications");
    return [];
  }

  return res.json();
}

export async function getFastestTimeForGame(gridSize, difficulty) {
  const res = await fetch(
    `/api/stats/fastest?gridSize=${gridSize}&difficulty=${difficulty}`,
  );

  if (!res.ok) return null;

  return res.json();
}

// BLOGS

export async function getAllBlogs() {
  const res = await fetch("/api/blogs");

  if (!res.ok) return [];

  return res.json();
}
export async function getBlogBySlugName(slug) {
  const res = await fetch(`/api/blogs/${slug}`);

  if (!res.ok) return null;

  return res.json();
}
export async function getGamePlayedTimes(gridSize, difficulty) {
  const res = await fetch(
    `/api/stats/played-count?gridSize=${gridSize}&difficulty=${difficulty}`,
  );

  if (!res.ok) return null;

  const data = await res.json();
  return data.count;
}

export async function getOverallStats() {
  const res = await fetch("/api/stats/overall");

  if (!res.ok) return null;

  const data = await res.json();
  return data.count;
}

export async function getCurrentUserGameData(id) {
  const res = await fetch(`/api/games/current?userId=${id}`);

  if (!res.ok) return null;

  return res.json();
}

export async function getGameById(id) {
  const res = await fetch(`/api/games/${id}`);

  if (!res.ok) return null;

  return res.json();
}

export async function getUserById(id) {
  try {
    const res = await fetch(`/api/users/${id}`, {
      headers: {
        "x-internal-request": "true",
      },
    });

    if (!res.ok) return null;

    return await res.json();
  } catch (err) {
    console.error("getUserById error:", err);
    return null;
  }
}
export async function getUserByUsername(username) {
  try {
    const res = await fetch(`/api/users?username=${username}`, {
      headers: {
        "x-internal-request": "true",
      },
    });

    if (!res.ok) return null;

    return await res.json();
  } catch (err) {
    console.error("getUserByUsername error:", err);
    return null;
  }
}

export async function getMissionByID(id) {
  const res = await fetch(`/api/missions/${id}`);

  if (!res.ok) return null;

  return res.json();
}

export async function getUserMissionsCompletions(userId) {
  const res = await fetch(`/api/missions/user/${userId}`);

  if (!res.ok) return null;

  return res.json();
}

export async function checkAndUpdateUserMissions(userId) {
  const res = await fetch("/api/missions/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });

  if (!res.ok) return [];

  return res.json();
}

// * FOR FE

// const results = await checkAndUpdateUserMissions(userId);

//* results.forEach((mission) => {
//*   if (mission.completed) {
//*     showMissionCompletedToast({
//*       title: "Mission Completed!",
//*       subtitle: mission.missionTitle,
//*     });
//*   } else if (mission.progress?.count > 0) {
//*     showProgressToast({
//*       count: mission.progress.count,
//*       goal: mission.progress.goal,
//*       title: "Global Mission",
//*       subtitle: mission.missionTitle,
//*     });
//*   }
//* });

// *

export async function incrementCelebrateCount(celebratedUserId) {
  const res = await fetch("/api/celebrations/increment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ celebratedUserId }),
  });

  if (!res.ok) return null;

  return res.json();
}
// * RPC FOR ATOMIC INCREMENT
// create or replace function increment_celebration(user_id uuid)
// returns void as $$
// begin
//   insert into celebrations (user_id, count, last_celebrated_at)
//   values (user_id, 1, now())
//   on conflict (user_id)
//   do update set
//     count = celebrations.count + 1,
//     last_celebrated_at = now();
// end;
// $$ language plpgsql;
// *

export async function getAllUsers() {
  try {
    const res = await fetch(`${baseUrl}/api/users`, {
      headers: {
        "x-internal-request": "true",
      },
      credentials: "include", // ⭐ IMPORTANT
    });

    if (!res.ok) {
      console.error("Failed to fetch users");
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error("Network error:", err);
    return [];
  }
}
