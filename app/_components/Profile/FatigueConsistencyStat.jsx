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

export default function FatigueConsistencyStat({ user }) {
  const [gameData, setGameData] = useState([]);
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
            const variance =
              clicks.reduce(
                (sum, c) => sum + Math.pow(c.timeTakenMs / 1000 - avgTime, 2),
                0
              ) / clicks.length;
            return {
              created_at: row.created_at,
              difficulty: row.difficulty,
              grid_size: row.grid_size,
              game_mode: row.game_mode,
              avgTime,
              variance, // measure of consistency
            };
          })
          .filter(Boolean);

        setGameData(avgPerGame);
      } catch (err) {
        // console.error("Fetch error:", err);
        setError("Unable to fetch game data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Filters
  const filteredData = useMemo(() => {
    if (!gameData.length) return [];
    const now = Date.now();
    return gameData.filter((row) => {
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
  }, [gameData, filter, difficulty, gridSize, gameMode]);

  const trend = useMemo(() => {
    if (filteredData.length < 2) return 0;
    const first = filteredData[0].avgTime;
    const last = filteredData[filteredData.length - 1].avgTime;
    return first === 0 ? last * 100 : ((last - first) / first) * 100;
  }, [filteredData]);

  const trendColor = trend >= 0 ? "text-error" : "text-success";

  const difficultyOptions = [
    "all",
    ...new Set(gameData.map((d) => d.difficulty)),
  ];
  const gridOptions = [
    "all",
    ...Array.from(new Set(gameData.map((d) => d.grid_size))).sort(
      (a, b) => a - b
    ),
  ];
  const gameModeOptions = [
    "all",
    ...Array.from(new Set(gameData.map((d) => d.game_mode))),
  ];

  const playLink = `/play?mode=${gameMode}&difficulty=${difficulty}&grid=${gridSize}`;

  return (
    <div className="card bg-base-100 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <div>
          <div className="text-xl font-semibold">
            Fatigue / Consistency Overview
          </div>
          {!loading && filteredData.length > 1 && (
            <div className={`mt-2 text-sm ${trendColor}`}>
              Your reaction times {trend >= 0 ? "slowed down" : "improved"} by{" "}
              {Math.abs(trend).toFixed(1)}% across games
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
                consistency: Math.sqrt(d.variance), // SD shows stability
              }))}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorFatigue" x1="0" y1="0" x2="0" y2="1">
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
                formatter={(value, name, props) => {
                  if (name === "avgTime") return `${value.toFixed(2)}s`;
                  if (name === "consistency") return `${value.toFixed(2)}s SD`;
                  return value;
                }}
              />
              <Area
                type="monotone"
                dataKey="avgTime"
                stroke={trend >= 0 ? "#ef4444" : "#22c55e"}
                strokeWidth={3}
                fill="url(#colorFatigue)"
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
