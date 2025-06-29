"use client";
import React, { useEffect, useState } from "react";
import { formatNumber } from "@/app/_utils/formatNumber";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/app/_lib/supabase";

export default function AnalyticsData({
  user,
  loading,
  totalGames,
  gameData,
  totalScore,
  totalRightClicks,
  totalWrongClicks,
  avgAccuracy,
  avgDuration,
  avgReactionTime,
  formatMs,
  formatPercent,
}) {
  // Fallback check: show message if critical values are missing
  const isDataMissing =
    totalGames == null ||
    totalScore == null ||
    totalRightClicks == null ||
    totalWrongClicks == null ||
    avgAccuracy == null ||
    avgDuration == null ||
    avgReactionTime == null;
  const [latestRank, setLatestRank] = useState(null);

  useEffect(() => {
    const fetchRank = async () => {
      const { data, error } = await supabase.rpc("get_user_rank", {
        uid: user[0]?.id,
      });
      if (!error && data?.[0]?.rank) {
        setLatestRank(data[0].rank);
      }
    };
    if (user?.[0]?.id) fetchRank();
  }, [user]);

  return (
    <div className="space-y-6 bg-base-100">
      <h1 className="text-sm font-bold opacity-50">Advanced Analytics</h1>
      {!user?.[0]?.is_pro_user && (
        <div className="alert alert-info shadow text-sm">
          <span>
            You can only see stats from your <strong>last 5 games</strong>.{" "}
            <a href="/get-pro" className="underline font-medium">
              Upgrade to PRO
            </a>{" "}
            to unlock full analytics.
          </span>
        </div>
      )}

      {loading ? (
        <p className="text-sm opacity-60 flex justify-center">
          <span className="loading loading-spinner loading-xl"></span>
        </p>
      ) : isDataMissing ? (
        <div className="text-center text-base-content/70 text-sm border border-base-300 rounded-lg p-4">
          Not enough data available for this game.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="stat bg-base-100 border border-base-300 rounded-lg shadow-sm">
            <div className="stat-title text-base-content/70">
              Total Games Played
            </div>
            <div className="stat-value text-primary">{totalGames}</div>
            <div className="stat-desc text-success">
              Last played{" "}
              {gameData?.[0]?.created_at
                ? formatDistanceToNow(new Date(gameData[0].created_at), {
                    addSuffix: true,
                  })
                : "N/A"}
            </div>
          </div>

          <div className="stat bg-base-100 border border-base-300 rounded-lg shadow-sm">
            <div className="stat-title text-base-content/70">Total Score</div>
            <div className="stat-value text-info">
              {formatNumber(totalScore)}
            </div>
            <div className="stat-desc text-success">All-time performance</div>
          </div>

          <div className="stat bg-base-100 border border-base-300 rounded-lg shadow-sm">
            <div className="stat-title text-base-content/70">Current Rank</div>
            <div className="stat-value text-warning">
              {latestRank ?? (
                <span className="loading loading-ring loading-xs"></span>
              )}
            </div>
            <div className="stat-desc text-success">Based on total score</div>
          </div>

          <div className="stat bg-base-100 border border-base-300 rounded-lg shadow-sm">
            <div className="stat-title text-base-content/70">
              Total Right Clicks
            </div>
            <div className="stat-value text-secondary">
              {formatNumber(totalRightClicks)}
            </div>
            <div className="stat-desc text-success">Across all sessions</div>
          </div>

          <div className="stat bg-base-100 border border-base-300 rounded-lg shadow-sm">
            <div className="stat-title text-base-content/70">
              Total Wrong Clicks
            </div>
            <div className="stat-value text-error">
              {formatNumber(totalWrongClicks)}
            </div>
            <div className="stat-desc text-error">Mistakes made</div>
          </div>

          <div className="stat bg-base-100 border border-base-300 rounded-lg shadow-sm">
            <div className="stat-title text-base-content/70">Avg Accuracy</div>
            <div className="stat-value text-success">
              {formatPercent(avgAccuracy)}
            </div>
            <div className="stat-desc text-success">Across all games</div>
          </div>

          <div className="stat bg-base-100 border border-base-300 rounded-lg shadow-sm">
            <div className="stat-title text-base-content/70">
              Avg Time to Finish
            </div>
            <div className="stat-value text-accent">
              {formatMs(avgDuration)}
            </div>
            <div className="stat-desc text-success">Full grid avg</div>
          </div>

          <div className="stat bg-base-100 border border-base-300 rounded-lg shadow-sm">
            <div className="stat-title text-base-content/70">
              Avg Reaction Time
            </div>
            <div className="stat-value text-warning">
              {formatMs(avgReactionTime)}
            </div>
            <div className="stat-desc text-success">Between tiles</div>
          </div>
        </div>
      )}
    </div>
  );
}
