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
      setLoading(true); // Start loading

      const missionStart = new Date(mission[0].created_at);
      const missionEnd = new Date(mission[0].duration);
      const userMap = new Map();

      for (const entry of mission_completions) {
        if (entry?.mission_id === mission[0].id && entry?.User) {
          const userId = entry.user_id;

          if (!userMap.has(userId)) {
            const { count, error } = await supabase
              .from("UniversalGameStats")
              .select("*", { count: "exact", head: true })
              .eq("user_id", userId)
              .gte("created_at", missionStart.toISOString())
              .lte("created_at", missionEnd.toISOString());

            if (!error) {
              if ((count || 0) > 0) {
                userMap.set(userId, {
                  username: entry.User.username || "Anonymous",
                  nationality: entry.User.nationality || "Unknown",
                  image: entry.User.image || "",
                  gamesPlayed: count,
                });
              }
            }
          }
        }
      }

      const sortedUsers = Array.from(userMap.values()).sort(
        (a, b) => b.gamesPlayed - a.gamesPlayed
      );

      setUserStats(sortedUsers);
      setLoading(false); // Stop loading
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
