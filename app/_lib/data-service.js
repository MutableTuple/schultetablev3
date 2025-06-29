import { supabase } from "./supabase";

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
