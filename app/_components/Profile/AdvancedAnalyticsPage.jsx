"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/app/_lib/supabase";
import AnalyticsData from "./AnalyticsData";
import GameChart from "./GameChart";
import ContributionHeatmap from "./ContributionHeatmap";
import SingleGameCounts from "./SingleGameCounts";

export default function AdvancedAnalyticsPage({ user }) {
  const [gameData, setGameData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("28d"); // default preset
  const [customRange, setCustomRange] = useState({ from: null, to: null });
  const [showCalendar, setShowCalendar] = useState(false);

  const formatMs = (ms) => `${(ms / 1000).toFixed(2)}s`;
  const formatPercent = (val) =>
    typeof val === "string" ? val : `${val.toFixed(1)}%`;

  const fetchGameData = async () => {
    if (!user?.[0]?.id) return;
    setLoading(true);

    const isPro = user[0]?.is_pro_user;

    let query = supabase
      .from("UniversalGameStats")
      .select("*")
      .eq("user_id", user[0].id)
      .order("created_at", { ascending: false });

    const now = new Date();

    // Apply filters
    if (dateRange === "28d") {
      const fromDate = new Date();
      fromDate.setDate(now.getDate() - 28);
      query = query.gte("created_at", fromDate.toISOString());
    } else if (dateRange === "3m") {
      const fromDate = new Date();
      fromDate.setMonth(now.getMonth() - 3);
      query = query.gte("created_at", fromDate.toISOString());
    } else if (dateRange === "6m") {
      const fromDate = new Date();
      fromDate.setMonth(now.getMonth() - 6);
      query = query.gte("created_at", fromDate.toISOString());
    } else if (dateRange === "custom" && customRange.from && customRange.to) {
      query = query
        .gte("created_at", customRange.from.toISOString())
        .lte("created_at", customRange.to.toISOString());
    }
    // "all" → no filter

    if (!isPro) query = query.limit(5); // Free users capped

    const { data, error } = await query;

    if (error) {
      // console.error("Error fetching game stats:", error);
    } else {
      setGameData(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchGameData();
  }, [user, dateRange, customRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <span className="loading loading-bars loading-lg text-primary"></span>
      </div>
    );
  }

  // Aggregations
  const totalGames = gameData.length;
  const totalRightClicks = gameData.reduce(
    (sum, g) => sum + (g.total_right_click || 0),
    0
  );
  const totalWrongClicks = gameData.reduce(
    (sum, g) => sum + (g.total_wrong_click || 0),
    0
  );
  const totalScore = gameData.reduce((sum, g) => sum + (g.score || 0), 0);

  const totalAccuracy = gameData.reduce((sum, g) => {
    const acc = parseFloat(g?.game_summary?.accuracy || "0");
    return sum + (isNaN(acc) ? 0 : acc);
  }, 0);
  const totalAvgReaction = gameData.reduce(
    (sum, g) => sum + (g?.game_summary?.avgReactionTimeMs || 0),
    0
  );
  const totalDuration = gameData.reduce(
    (sum, g) => sum + (g?.game_summary?.durationMs || 0),
    0
  );

  const avgAccuracy = totalGames ? totalAccuracy / totalGames : 0;
  const avgReactionTime = totalGames ? totalAvgReaction / totalGames : 0;
  const avgDuration = totalGames ? totalDuration / totalGames : 0;

  const latestRank = gameData[0]?.rank ?? "N/A";

  return (
    <div>
      {/* 🔽 Filter UI */}
      <div className="flex items-center gap-4 mb-6">
        <select
          className="select select-bordered"
          value={dateRange}
          onChange={(e) => {
            setDateRange(e.target.value);
            if (e.target.value !== "custom") setShowCalendar(false);
          }}
        >
          <option value="28d">Last 28 Days</option>
          <option value="3m">Last 3 Months</option>
          <option value="6m">Last 6 Months</option>
          <option value="all">All Time</option>
          <option value="custom">Custom Range</option>
        </select>

        {dateRange === "custom" && (
          <div className="relative">
            <button
              className="btn btn-outline"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              {customRange.from && customRange.to
                ? `${customRange.from.toLocaleDateString()} → ${customRange.to.toLocaleDateString()}`
                : customRange.from
                  ? `${customRange.from.toLocaleDateString()} → ...`
                  : customRange.to
                    ? `... → ${customRange.to.toLocaleDateString()}`
                    : "Pick Date Range"}
            </button>

            {showCalendar && (
              <div className="absolute z-50 bg-base-100 shadow-xl rounded-lg p-4 mt-2">
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="input input-bordered"
                    onChange={(e) =>
                      setCustomRange((prev) => ({
                        ...prev,
                        from: e.target.value ? new Date(e.target.value) : null,
                      }))
                    }
                  />
                  <input
                    type="date"
                    className="input input-bordered"
                    onChange={(e) =>
                      setCustomRange((prev) => ({
                        ...prev,
                        to: e.target.value ? new Date(e.target.value) : null,
                      }))
                    }
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setShowCalendar(false);
                      fetchGameData();
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Analytics Components */}
      <AnalyticsData
        user={user}
        loading={loading}
        totalGames={totalGames}
        gameData={gameData}
        totalScore={totalScore}
        latestRank={latestRank}
        totalRightClicks={totalRightClicks}
        totalWrongClicks={totalWrongClicks}
        avgAccuracy={avgAccuracy}
        avgDuration={avgDuration}
        avgReactionTime={avgReactionTime}
        formatMs={formatMs}
        formatPercent={formatPercent}
      />
      <SingleGameCounts user={user} />
      <GameChart
        gameData={gameData}
        totalRightClicks={totalRightClicks}
        totalWrongClicks={totalWrongClicks}
      />
      <ContributionHeatmap user={user} />
    </div>
  );
}
