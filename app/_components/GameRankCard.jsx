"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../_lib/supabase";

export default function GameRankCard({
  gameSummaryData,
  gridSize,
  difficulty,
  current_game_mode,
}) {
  const [globalRank, setGlobalRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (!gameSummaryData) return;

    let isCancelled = false; // prevent state updates if unmounted
    const maxRetries = 2; // retry twice
    let attempt = 0;

    async function fetchGlobalRank() {
      setLoading(true);
      setErrorMsg(null);

      while (attempt <= maxRetries) {
        try {
          const { data, error } = await supabase
            .rpc("rank_game", {
              current_game: gameSummaryData,
              grid_size: gridSize,
              difficulty: difficulty,
              game_mode: current_game_mode,
            })
            .single();

          if (error) throw error;

          if (!isCancelled) {
            setGlobalRank(data?.overall_rank ?? null);
            setLoading(false);
          }
          return;
        } catch (err) {
          attempt += 1;
          if (attempt > maxRetries && !isCancelled) {
            setErrorMsg("Failed to fetch rank");
            setGlobalRank(null);
            setLoading(false);
          }
        }
      }
    }

    fetchGlobalRank();

    return () => {
      isCancelled = true;
    };
  }, [gameSummaryData, gridSize, difficulty, current_game_mode]);

  return (
    <div className="stat bg-base-200 rounded-lg p-4 text-center shadow">
      <div className="stat-title">Game Rank</div>
      <div className="stat-value text-error">
        {loading
          ? "Loading..."
          : errorMsg
            ? "Error"
            : globalRank?.toLocaleString() || "N/A"}
      </div>
      <div className="stat-desc truncate">Your global rank among all games</div>
    </div>
  );
}
