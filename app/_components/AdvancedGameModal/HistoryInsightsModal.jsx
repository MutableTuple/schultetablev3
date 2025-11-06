"use client";

import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/app/_lib/supabase";
import AnalyticsFilter from "./AnalyticsFilter";
import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function HistoryInsightsModal({
  user,
  graphColor,
  tier,
  percentile,
  motivation,
}) {
  const [range, setRange] = useState("7");
  const [difficulty, setDifficulty] = useState("");
  const [gridSize, setGridSize] = useState("");
  const [gameMode, setGameMode] = useState("");

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch raw past games (NOT daily averages)
  async function loadHistory() {
    if (!user?.[0]?.id) return;

    setLoading(true);

    const { data, error } = await supabase.rpc("fetch_history", {
      p_user_id: user[0].id,
      difficulty_filter: difficulty || null,
      grid_size_filter: gridSize ? Number(gridSize) : null,
      game_mode_filter: gameMode || null,
      game_limit:
        range === "7" ? 7 : range === "14" ? 14 : range === "21" ? 21 : null,
    });
    if (error) {
      // console.error("HISTORY ERROR:", error);
      setLoading(false);
      return;
    }

    setHistory(data); // ✅ We use raw past games
    setLoading(false);
  }

  useEffect(() => {
    loadHistory();
  }, [range, difficulty, gridSize, gameMode]);

  // ✅ Build chart data (EXACT SAME STYLE AS CURRENT GAME)
  const chartData = useMemo(() => {
    return history.map((row, i) => ({
      date: row.date,
      rt: row.score,
      spike: i === 0 ? 0 : Math.abs(row.score - history[i - 1].score), // difference between previous game
    }));
  }, [history]);

  return (
    <div>
      <h3 className="font-semibold text-lg mb-2">History Insights</h3>

      {/* ✅ FILTERS */}
      <AnalyticsFilter
        range={range}
        setRange={setRange}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        gridSize={gridSize}
        setGridSize={setGridSize}
        gameMode={gameMode}
        setGameMode={setGameMode}
      />

      {/* ✅ CHART (same style as Current Game graph) */}
      <div className="w-full h-64 bg-base-100 rounded-xl p-3 mt-2">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <defs>
                <linearGradient id="historyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={graphColor} stopOpacity={0.65} />
                  <stop offset="100%" stopColor={graphColor} stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* ✅ Tooltip same UI */}
              <Tooltip
                contentStyle={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "10px 14px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  fontSize: "12px",
                }}
                labelStyle={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#6b7280",
                }}
                formatter={(v, name) =>
                  name === "rt"
                    ? [`${v}`, "Consistency Score"]
                    : [`+${v}`, "Spike"]
                }
                labelFormatter={(d) =>
                  new Date(d).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })
                }
              />

              {/* ✅ X AXIS */}
              <XAxis
                dataKey="date"
                tickFormatter={(d) =>
                  new Date(d).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })
                }
                tick={{ fontSize: 10, fill: "#6b7280" }}
              />

              {/* ✅ Y AXIS */}
              <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} />

              {/* ✅ SAME BAR STYLE as current game */}
              <Bar
                dataKey="rt"
                fill={graphColor}
                opacity={0.25}
                radius={[6, 6, 0, 0]}
              />

              {/* ✅ SAME AREA STYLE as current game */}
              <Area
                dataKey="spike"
                type="monotone"
                stroke={graphColor}
                strokeWidth={2.4}
                fill="url(#historyGrad)"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ✅ Summary */}
      <p className="text-sm mt-3 text-base-content/80">
        Showing your past games over the last {range} days.
      </p>

      <p className="text-sm text-blue-400 font-semibold mt-3">
        Tier: <b>{tier}</b>
      </p>

      <p className="text-sm text-primary mt-1">
        More consistent than <b>{percentile}%</b> of players.
      </p>

      <p className="text-sm text-base-content/70 italic mt-3">{motivation}</p>
    </div>
  );
}
