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

  const formatMs = (ms) => `${(ms / 1000).toFixed(2)}s`;
  const formatPercent = (val) =>
    typeof val === "string" ? val : `${val.toFixed(1)}%`;

  useEffect(() => {
    const fetchGameData = async () => {
      if (!user?.[0]?.id) return;
      setLoading(true);

      const isPro = user[0]?.is_pro_user;
      const query = supabase
        .from("UniversalGameStats")
        .select("*")
        .eq("user_id", user[0].id)
        .order("created_at", { ascending: false });

      if (!isPro) query.limit(5);

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching game stats:", error);
      } else {
        setGameData(data);
      }

      setLoading(false);
    };

    fetchGameData();
  }, [user]);

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
