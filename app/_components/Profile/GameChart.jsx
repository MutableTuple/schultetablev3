"use client";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function GameChart({
  gameData,
  totalRightClicks,
  totalWrongClicks,
}) {
  const chartData = gameData
    .map((g) => ({
      date: new Date(g.created_at).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
      accuracy: parseFloat(g?.game_summary?.accuracy || 0),
      reactionTime: g?.game_summary?.avgReactionTimeMs || 0,
      score: g?.score || 0,
      rightClicks: totalRightClicks || 0,
      wrongClicks: totalWrongClicks || 0,
    }))
    .reverse();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 rounded-lg bg-base-300 shadow-md text-sm text-base-content space-y-1">
          <p className="font-semibold">{label}</p>
          <p>Accuracy: {data.accuracy}%</p>
          <p>Reaction Time: {data.reactionTime}ms</p>
          <p>Score: {data.score}</p>
          <p>✅ Right Clicks: {data.rightClicks}</p>
          <p>❌ Wrong Clicks: {data.wrongClicks}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-10  p-0 rounded-xl bg-base-100 border border-base-300 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xs p-6  font-bold text-base-content">
          Game Progress
        </h2>
      </div>

      <ResponsiveContainer
        width="100%"
        height={320}
        className={"md:scale-100 scale-110"}
      >
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorReaction" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#facc15" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#facc15" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
          <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 12 }} />
          <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: 12, color: "#6b7280" }}
          />

          <Area
            type="monotone"
            dataKey="accuracy"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorAccuracy)"
            name="Accuracy (%)"
          />
          <Area
            type="monotone"
            dataKey="reactionTime"
            stroke="#facc15"
            fillOpacity={1}
            fill="url(#colorReaction)"
            name="Reaction Time (ms)"
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorScore)"
            name="Score"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
