"use client";
import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/app/_lib/supabase";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";

export default function AccuracySpeedScatter({ user }) {
  const [clickData, setClickData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [gridSize, setGridSize] = useState("all");
  const [gameMode, setGameMode] = useState("all");

  // Fetch click data
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

        const allClicks = data
          .map((row) => row.game_summary?.clicks || [])
          .flat()
          .filter(Boolean);

        setClickData(allClicks);
      } catch (err) {
        console.error(err);
        setError("Unable to fetch click data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Filters
  const filteredClicks = useMemo(() => {
    if (!clickData.length) return [];
    const now = Date.now();

    return clickData.filter((click) => {
      const clickGame = click.gameInfo || {};
      const matchesDifficulty =
        difficulty === "all" || clickGame.difficulty === difficulty;
      const matchesGrid =
        gridSize === "all" || clickGame.grid_size === parseInt(gridSize, 10);
      const matchesMode =
        gameMode === "all" || clickGame.game_mode === gameMode;

      const diff = now - new Date(click.created_at || now).getTime();
      const matchesTime =
        filter === "all" ||
        (filter === "week" && diff <= 7 * 24 * 60 * 60 * 1000) ||
        (filter === "month" && diff <= 30 * 24 * 60 * 60 * 1000);

      return matchesDifficulty && matchesGrid && matchesMode && matchesTime;
    });
  }, [clickData, filter, difficulty, gridSize, gameMode]);

  // Prepare scatterplot data
  const scatterData = useMemo(() => {
    if (!filteredClicks.length) return [];
    return filteredClicks.map((click, i) => ({
      reactionTime: (click.timeTakenMs || 0) / 1000, // seconds
      accuracy: click.correct ? 1 : 0, // 1 = correct, 0 = wrong
      tile: click.number || i + 1,
      color: click.correct ? "#22c55e" : "#ef4444",
    }));
  }, [filteredClicks]);

  // Filter options
  const difficultyOptions = [
    "all",
    ...new Set(clickData.map((c) => c.difficulty)),
  ];
  const gridOptions = [
    "all",
    ...Array.from(new Set(clickData.map((c) => c.grid_size))).sort(
      (a, b) => a - b
    ),
  ];
  const gameModeOptions = [
    "all",
    ...Array.from(new Set(clickData.map((c) => c.game_mode))),
  ];

  const playLink = `/play?mode=${gameMode}&difficulty=${difficulty}&grid=${gridSize}`;

  return (
    <div className="card bg-base-100 flex flex-col gap-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <div>
          <div className="text-xl font-semibold">Accuracy vs Speed</div>
          {loading && <div className="h-12 w-32 bg-base-200 rounded-md mt-2" />}
          {!loading && !scatterData.length && (
            <div className="mt-2 text-gray-500 font-medium">
              No clicks found for selected filters.
            </div>
          )}
        </div>

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

      {/* Scatterplot */}
      {loading ? (
        <div className="h-96 w-full bg-base-200 rounded-xl" />
      ) : scatterData.length > 0 ? (
        <div className="w-full h-96 card bg-base-200 p-4 rounded-xl">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid stroke="#f0f0f0" />
              <XAxis
                type="number"
                dataKey="reactionTime"
                name="Reaction Time"
                unit="s"
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <YAxis
                type="number"
                dataKey="accuracy"
                name="Accuracy"
                domain={[0, 1]}
                tickFormatter={(v) => (v === 1 ? "✅" : "❌")}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{
                  backgroundColor: "#1f2937",
                  color: "#f9fafb",
                  borderRadius: "12px",
                  padding: "8px 12px",
                  border: "none",
                }}
                formatter={(value, name, props) => {
                  if (name === "accuracy")
                    return value === 1 ? "Correct" : "Wrong";
                  if (name === "reactionTime") return `${value.toFixed(2)}s`;
                  return value;
                }}
                labelFormatter={(label) => `Tile: ${label}`}
              />
              <Scatter
                name="Clicks"
                data={scatterData}
                fill="#8884d8"
                shape="circle"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-96 bg-base-200 rounded-xl gap-4">
          <div className="text-gray-500 font-medium">
            No data for this selection.
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
