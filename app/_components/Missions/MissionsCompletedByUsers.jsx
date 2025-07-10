"use client";
import React, { useEffect, useState } from "react";
import MissionsUserCard from "./MissionsUserCard";
import { FiAlertTriangle } from "react-icons/fi";
import { supabase } from "@/app/_lib/supabase";

export default function MissionsCompletedByUsers({
  mission_completions,
  mission,
}) {
  const [userStats, setUserStats] = useState([]);
  const [loading, setLoading] = useState(true); // ⬅️ Added loading state

  useEffect(() => {
    if (!Array.isArray(mission_completions) || !mission[0]?.id) return;

    const fetchGamesPlayed = async () => {
      setLoading(true);

      const missionStart = new Date(mission[0].created_at).toISOString();
      const missionEnd = new Date(mission[0].duration).toISOString();

      // Fetch all game stats in timeframe
      const { data, error } = await supabase
        .from("UniversalGameStats")
        .select("user_id, created_at")
        .gte("created_at", missionStart)
        .lte("created_at", missionEnd);

      if (error) {
        console.error("Error fetching game stats:", error.message);
        setLoading(false);
        return;
      }

      const userGameCounts = new Map();

      // Count games per user_id (including nulls)
      for (const row of data) {
        const id = row.user_id || "anon";
        userGameCounts.set(id, (userGameCounts.get(id) || 0) + 1);
      }

      const users = [];

      for (const [userId, count] of userGameCounts) {
        if (userId === "anon") {
          users.push({
            username: "Anonymous",
            nationality: "Global Users",
            image: "https://api.dicebear.com/7.x/shapes/svg?seed=Anon", // you can use a placeholder image here
            gamesPlayed: count,
          });
        } else {
          const completion = mission_completions.find(
            (entry) => entry.user_id === userId && entry?.User
          );
          if (completion?.User) {
            users.push({
              username: completion.User.username || "Anonymous",
              nationality: completion.User.nationality || "Unknown",
              image: completion.User.image || "",
              gamesPlayed: count,
              is_pro: !!completion.User.is_pro_user,
            });
          }
        }
      }

      const sortedUsers = users.sort((a, b) => b.gamesPlayed - a.gamesPlayed);

      setUserStats(sortedUsers);
      setLoading(false);
    };

    fetchGamesPlayed();
  }, [mission_completions, mission]);

  return (
    <div className="max-w-8xl px-4 py-6 text-xs text-center">
      <div className="flex flex-col gap-2">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <span className="loading loading-spinner loading-lg text-warning"></span>
          </div>
        ) : userStats.length > 0 ? (
          <MissionsUserCard
            title="Top Players for this Mission"
            users={userStats}
          />
        ) : (
          <div className="text-base-content/60 py-8 flex items-center gap-2">
            <FiAlertTriangle /> No one has contributed to this mission yet.
          </div>
        )}
      </div>
    </div>
  );
}
