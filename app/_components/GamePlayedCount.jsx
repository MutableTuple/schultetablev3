"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/app/_lib/supabase";
import { formatNumber } from "../_utils/formatNumber";

export default function GamePlayedCount({ userData, user, mode }) {
  const [scorePercentile, setScorePercentile] = useState(null);
  const [accuracyPercentile, setAccuracyPercentile] = useState(null);
  const [timePercentile, setTimePercentile] = useState(null);

  const isPro = user[0]?.is_pro_user;

  useEffect(() => {
    const fetchAllPercentiles = async () => {
      if (!userData || !isPro) return;

      const baseParams = {
        p_user_id: userData.id,
        p_game_mode: userData.game_mode,
        p_grid_size: userData.grid_size,
        p_difficulty: userData.difficulty,
      };

      const calculatedAccuracy =
        userData.total_right_click + userData.total_wrong_click > 0
          ? parseFloat(
              (
                (userData.total_right_click /
                  (userData.total_right_click + userData.total_wrong_click)) *
                100
              ).toFixed(1)
            )
          : 0;

      try {
        const [
          { data: scoreData, error: scoreError },
          { data: accData, error: accError },
          { data: timeData, error: timeError },
        ] = await Promise.all([
          supabase.rpc("get_score_percentile_jsonb", {
            ...baseParams,
            p_score: userData.score,
          }),
          supabase.rpc("get_accuracy_percentile_jsonb", {
            ...baseParams,
            p_accuracy: calculatedAccuracy,
          }),
          supabase.rpc("get_time_percentile_jsonb", {
            ...baseParams,
            p_duration_ms: userData.time_taken * 1000,
          }),
        ]);

        if (scoreError) console.error("Score RPC Error:", scoreError);
        if (accError) console.error("Accuracy RPC Error:", accError);
        if (timeError) console.error("Time RPC Error:", timeError);

        setScorePercentile(scoreData ? (scoreData * 100).toFixed(1) : "N/A");
        setAccuracyPercentile(
          accData !== null && accData !== undefined
            ? (accData * 100).toFixed(1)
            : "N/A"
        );
        setTimePercentile(timeData ? (timeData * 100).toFixed(1) : "N/A");
      } catch (err) {
        console.error("Unexpected percentile fetch error:", err, err.message);
        setScorePercentile("N/A");
        setAccuracyPercentile("N/A");
        setTimePercentile("N/A");
        console.log(scorePercentile, accuracyPercentile, timePercentile);
      }
    };

    fetchAllPercentiles();
  }, [userData, isPro]);

  return (
    <div className="stats stats-vertical border border-base-300 text-sm lg:text-xs p-2 lg:p-1 gap-2 lg:gap-1 bg-base-100">
      <div className="stat">
        <div className="stat-title">Total time taken</div>
        <div className="stat-value text-primary text-lg lg:text-base">
          {userData.time_taken}s
        </div>
        <div className="stat-desc">
          {isPro
            ? timePercentile
              ? `You're time was in top ${timePercentile}%`
              : "Loading..."
            : "get pro to unlock percentile ranks"}
        </div>
      </div>

      <div className="stat">
        <div className="stat-title">Accuracy</div>
        <div className="stat-value text-secondary text-lg lg:text-base">
          {userData.total_wrong_click === 0
            ? "100%"
            : `${(
                (userData.total_right_click /
                  (userData.total_right_click + userData.total_wrong_click)) *
                100
              ).toFixed(1)}%`}
        </div>
        <div className="stat-desc">
          {isPro
            ? accuracyPercentile
              ? `right clicks (${userData.total_right_click})  & wrong clicks (${userData.total_wrong_click}) `
              : "Loading..."
            : "get pro to unlock percentile ranks"}
        </div>
      </div>

      <div className="stat">
        <div className="stat-title">Last game score</div>
        <div className="stat-value text-accent text-lg lg:text-base">
          {formatNumber(userData.score)}
        </div>
        <div className="stat-desc">
          {isPro
            ? scorePercentile
              ? `You're score was in top ${scorePercentile}%`
              : "Loading..."
            : "get pro to unlock percentile ranks"}
        </div>
      </div>

      <div className="stat">
        <div className="stat-title">Board data (Game mode: {mode})</div>
        <div className="stat-value text-info text-lg lg:text-base">
          {userData.grid_size} x {userData.grid_size}
        </div>
        <div className="stat-desc">{userData.difficulty}</div>
      </div>
    </div>
  );
}
