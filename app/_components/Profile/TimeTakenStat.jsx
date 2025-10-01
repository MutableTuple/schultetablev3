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

export default function TimeTakenStat({ user }) {
  const [timeData, setTimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [filter, setFilter] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [gridSize, setGridSize] = useState("all");
  const [gameMode, setGameMode] = useState("all");

  // Fetch data efficiently
  useEffect(() => {
    if (!user?.[0]?.id) return;

    const fetchTimeTaken = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("UniversalGameStats")
          .select("time_taken, created_at, difficulty, grid_size, game_mode")
          .eq("user_id", user[0].id)
          .order("created_at", { ascending: true });

        if (error) throw error;

        if (!data?.length) {
          setTimeData([]);
          return;
        }

        // Remove empty game_mode values
        const cleanedData = data.filter((d) => d.game_mode);
        setTimeData(cleanedData);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Unable to fetch your time data at the moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchTimeTaken();
  }, [user]);

  // Apply all filters
  const filteredData = useMemo(() => {
    if (!timeData.length) return [];

    const now = new Date();

    return timeData.filter((row) => {
      const matchesDifficulty =
        difficulty === "all" || row.difficulty === difficulty;
      const matchesGrid =
        gridSize === "all" || row.grid_size === parseInt(gridSize);
      const matchesMode = gameMode === "all" || row.game_mode === gameMode;

      const diff = now - new Date(row.created_at);
      const matchesTime =
        filter === "all" ||
        (filter === "week" && diff <= 7 * 24 * 60 * 60 * 1000) ||
        (filter === "month" && diff <= 30 * 24 * 60 * 60 * 1000);

      return matchesDifficulty && matchesGrid && matchesMode && matchesTime;
    });
  }, [timeData, filter, difficulty, gridSize, gameMode]);

  // Debug selected filters
  useEffect(() => {
    console.log("Selected Filters:", {
      filter,
      difficulty,
      gridSize,
      gameMode,
    });
    console.log("Filtered Data:", filteredData);
    if (!filteredData.length) console.warn("No games match these filters!");
  }, [filter, difficulty, gridSize, gameMode, filteredData]);

  // Group by day for chart
  const chartData = useMemo(() => {
    if (!filteredData.length) return [];

    const grouped = {};
    filteredData.forEach((row) => {
      const day = new Date(row.created_at).toISOString().split("T")[0];
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(row.time_taken || 0);
    });

    return Object.entries(grouped)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([date, times]) => ({
        date,
        time_taken: times.reduce((sum, v) => sum + v, 0) / times.length,
      }));
  }, [filteredData]);

  // Average and trend
  const averageTime = useMemo(() => {
    if (!chartData.length) return 0;
    return (
      chartData.reduce((sum, d) => sum + d.time_taken, 0) / chartData.length
    );
  }, [chartData]);

  const trend = useMemo(() => {
    if (chartData.length < 2) return 0;
    const first = chartData[0].time_taken;
    const last = chartData[chartData.length - 1].time_taken;
    return first === 0 ? last * 100 : ((last - first) / first) * 100;
  }, [chartData]);

  const trendColor = trend >= 0 ? "text-error" : "text-success";

  // Extract unique options and sort grid sizes numerically
  const difficultyOptions = [
    "all",
    ...Array.from(new Set(timeData.map((d) => d.difficulty))),
  ];
  const gridOptions = [
    "all",
    ...Array.from(new Set(timeData.map((d) => d.grid_size))).sort(
      (a, b) => a - b
    ),
  ];
  const gameModeOptions = [
    "all",
    ...Array.from(new Set(timeData.map((d) => d.game_mode))).filter(Boolean),
  ];

  // Generate play link
  const playLink = `/play?mode=${gameMode}&difficulty=${difficulty}&grid=${gridSize}`;

  return (
    <div className="card bg-base-100 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <div>
          <div className="text-xl font-semibold">Average Time Taken</div>
          {loading ? (
            <div className="h-12 w-32 bg-base-200 animate-pulse rounded-md mt-2"></div>
          ) : chartData.length > 0 ? (
            <div className={`mt-2 text-4xl font-bold ${trendColor}`}>
              {error ? "Data unavailable" : `${averageTime.toFixed(1)}s`}
            </div>
          ) : (
            <div className="mt-2 text-gray-500 font-medium">
              No games found for selected filters.
            </div>
          )}
          {!loading && !error && chartData.length > 1 && (
            <div className={`mt-1 text-sm ${trendColor}`}>
              Your average time {trend >= 0 ? "increased" : "decreased"} by{" "}
              {Math.abs(trend).toFixed(1)}% over the selected period.
            </div>
          )}
          {!loading &&
            !error &&
            chartData.length <= 1 &&
            chartData.length > 0 && (
              <div className="mt-1 text-sm text-gray-500">
                Not enough data to show a trend.
              </div>
            )}
        </div>

        {/* Filters with labels */}
        <div className="flex flex-wrap gap-4 items-start">
          <div className="flex flex-col">
            <label className="text-sm font-medium">Time Range</label>
            <select
              className="select select-bordered w-36"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium">Difficulty</label>
            <select
              className="select select-bordered w-36"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              {difficultyOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium">Grid Size</label>
            <select
              className="select select-bordered w-36"
              value={gridSize}
              onChange={(e) => setGridSize(e.target.value)}
            >
              {gridOptions.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium">Game Mode</label>
            <select
              className="select select-bordered w-36"
              value={gameMode}
              onChange={(e) => setGameMode(e.target.value)}
            >
              {gameModeOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Area Chart or No Games */}
      {loading ? (
        <div className="h-64 w-full bg-base-200 animate-pulse rounded-xl"></div>
      ) : chartData.length > 0 ? (
        <div className="w-full h-64 card bg-base-200 p-4 rounded-xl">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
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
                domain={["auto", "auto"]}
                tickFormatter={(v) => `${v.toFixed(1)}s`}
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
                  boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
                  fontSize: "0.875rem",
                }}
                labelStyle={{ color: "#f9fafb", fontWeight: "500" }}
                formatter={(value) => `${value.toFixed(1)}s`}
              />
              <Area
                type="monotone"
                dataKey="time_taken"
                stroke={trend >= 0 ? "#ef4444" : "#22c55e"}
                strokeWidth={3}
                fill="url(#colorTime)"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
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
