"use client";
import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/app/_lib/supabase";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";

export default function ReactionTimeStat({ user }) {
  const [reactionData, setReactionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [gridSize, setGridSize] = useState("all");
  const [gameMode, setGameMode] = useState("all");

  // Fetch data
  useEffect(() => {
    if (!user?.[0]?.id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("UniversalGameStats")
          .select("game_summary, created_at, difficulty, grid_size, game_mode")
          .eq("user_id", user[0].id)
          .order("created_at", { ascending: true });

        if (error) throw error;

        const avgPerGame = data
          .map((row) => {
            const clicks = row.game_summary?.clicks || [];
            if (!clicks.length) return null;
            const avgTime =
              clicks.reduce((sum, c) => sum + c.timeTakenMs, 0) /
              clicks.length /
              1000;
            return {
              created_at: row.created_at,
              difficulty: row.difficulty,
              grid_size: row.grid_size,
              game_mode: row.game_mode,
              avgTime,
            };
          })
          .filter(Boolean);

        setReactionData(avgPerGame);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Unable to fetch reaction time data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Filters
  const filteredData = useMemo(() => {
    if (!reactionData.length) return [];
    const now = Date.now();
    return reactionData.filter((row) => {
      const matchesDifficulty =
        difficulty === "all" || row.difficulty === difficulty;
      const matchesGrid =
        gridSize === "all" || row.grid_size === parseInt(gridSize, 10);
      const matchesMode = gameMode === "all" || row.game_mode === gameMode;

      const diff = now - new Date(row.created_at).getTime();
      const matchesTime =
        filter === "all" ||
        (filter === "week" && diff <= 7 * 24 * 60 * 60 * 1000) ||
        (filter === "month" && diff <= 30 * 24 * 60 * 60 * 1000);

      return matchesDifficulty && matchesGrid && matchesMode && matchesTime;
    });
  }, [reactionData, filter, difficulty, gridSize, gameMode]);

  const averageTime = useMemo(() => {
    if (!filteredData.length) return 0;
    return (
      filteredData.reduce((sum, d) => sum + d.avgTime, 0) / filteredData.length
    );
  }, [filteredData]);

  const trend = useMemo(() => {
    if (filteredData.length < 2) return 0;
    const first = filteredData[0].avgTime;
    const last = filteredData[filteredData.length - 1].avgTime;
    return first === 0 ? last * 100 : ((last - first) / first) * 100;
  }, [filteredData]);

  const trendColor = trend >= 0 ? "text-error" : "text-success";

  // Options
  const difficultyOptions = [
    "all",
    ...new Set(reactionData.map((d) => d.difficulty)),
  ];
  const gridOptions = [
    "all",
    ...Array.from(new Set(reactionData.map((d) => d.grid_size))).sort(
      (a, b) => a - b
    ),
  ];
  const gameModeOptions = [
    "all",
    ...Array.from(new Set(reactionData.map((d) => d.game_mode))).filter(
      Boolean
    ),
  ];

  const playLink = `/play?mode=${gameMode}&difficulty=${difficulty}&grid=${gridSize}`;

  return (
    <div className="card bg-base-100 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <div>
          <div className="text-xl font-semibold">Average Reaction Time</div>
          {loading ? (
            <div className="h-12 w-32 bg-base-200 rounded-md mt-2" />
          ) : filteredData.length > 0 ? (
            <div className={`mt-2 text-4xl font-bold ${trendColor}`}>
              {error ? "Data unavailable" : `${averageTime.toFixed(2)}s`}
            </div>
          ) : (
            <div className="mt-2 text-gray-500 font-medium">
              No games found for selected filters.
            </div>
          )}
          {!loading && !error && filteredData.length > 1 && (
            <div className={`mt-1 text-sm ${trendColor}`}>
              Your average reaction {trend >= 0 ? "increased" : "decreased"} by{" "}
              {Math.abs(trend).toFixed(1)}%
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-start">
          {[
            {
              label: "Time Range",
              value: filter,
              setter: setFilter,
              options: ["week", "month", "all"],
            },
            {
              label: "Difficulty",
              value: difficulty,
              setter: setDifficulty,
              options: difficultyOptions,
            },
            {
              label: "Grid Size",
              value: gridSize,
              setter: setGridSize,
              options: gridOptions,
            },
            {
              label: "Game Mode",
              value: gameMode,
              setter: setGameMode,
              options: gameModeOptions,
            },
          ].map(({ label, value, setter, options }) => (
            <div key={label} className="flex flex-col">
              <label className="text-sm font-medium">{label}</label>
              <select
                className="select select-bordered w-36"
                value={value}
                onChange={(e) => setter(e.target.value)}
              >
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Area Chart */}
      {loading ? (
        <div className="h-64 w-full bg-base-200 rounded-xl" />
      ) : filteredData.length > 0 ? (
        <div className="w-full h-64 card bg-base-200 p-4 rounded-xl">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={filteredData.map((d) => ({
                date: new Date(d.created_at).toLocaleDateString(),
                avgTime: d.avgTime,
              }))}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorReaction" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={trend >= 0 ? "#ef4444" : "#22c55e"}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor={trend >= 0 ? "#ef4444" : "#22c55e"}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `${v.toFixed(2)}s`}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  color: "#f9fafb",
                  borderRadius: "12px",
                  padding: "8px 12px",
                  border: "none",
                }}
                labelStyle={{ color: "#f9fafb", fontWeight: "500" }}
                formatter={(value) => `${value.toFixed(2)}s`}
              />
              <Area
                type="monotone"
                dataKey="avgTime"
                stroke={trend >= 0 ? "#ef4444" : "#22c55e"}
                strokeWidth={3}
                fill="url(#colorReaction)"
                dot={{ r: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-base-200 rounded-xl gap-4">
          <div className="text-gray-500 font-medium">
            No games found for selected filters.
          </div>
          {gameMode !== "all" && difficulty !== "all" && gridSize !== "all" && (
            <Link href={playLink} className="btn btn-primary">
              Play this game
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
