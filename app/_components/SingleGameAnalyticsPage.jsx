"use client";
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { motion } from "framer-motion";
import KeystrokeAnim from "./Profile/KeystrokeAnim";
import BackButton from "./BackButton";
import { formatNumber } from "../_utils/formatNumber";

export default function SingleGameAnalyticsPage({ game }) {
  if (!game)
    return <div className="text-center py-10">Game data not found.</div>;

  const summary = game?.game_summary || {};
  const clicks = summary?.clicks || [];

  const reactionTimes = clicks.map((c, i) => {
    const label =
      typeof c.number === "object"
        ? `${c.number.expr}`
        : `${c.number || i + 1}`;

    return {
      name: label,
      time: c.timeTakenMs || 0,
    };
  });

  const radarData = [
    {
      subject: "Speed",
      value: Math.max(0, 100 - (summary?.avgReactionTimeMs || 0) / 10),
      fullMark: 100,
    },
    {
      subject: "Accuracy",
      value: parseFloat(summary?.accuracy || "0"),
      fullMark: 100,
    },
    {
      subject: "Consistency",
      value: Math.min(summary?.consistencyScore || 0, 100),
      fullMark: 100,
    },
    {
      subject: "Focus",
      value: Math.max(0, 100 - (summary?.mistakes || 0) * 10),
      fullMark: 100,
    },
    {
      subject: "Endurance",
      value: Math.min((summary?.totalTiles || 0) * 10, 100),
      fullMark: 100,
    },
    {
      subject: "Stability",
      value: Math.max(
        0,
        100 - ((summary?.slowestMs || 0) - (summary?.fastestMs || 0)) / 10
      ),
      fullMark: 100,
    },
  ];

  const stats = [
    { label: "Score", value: formatNumber(game?.score) },
    { label: "Accuracy", value: summary?.accuracy },
    { label: "Avg. Reaction", value: `${summary?.avgReactionTimeMs || 0}ms` },
    { label: "Fastest", value: `${summary?.fastestMs || 0}ms` },
    { label: "Mistakes", value: summary?.mistakes },
    {
      label: "Duration",
      value: `${(summary?.durationMs || 0) / 1000}s`,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <BackButton />
      <h1 className="text-3xl font-bold text-base-content">
        🎯 Game Analytics - {game.game_mode?.toUpperCase()} MODE
      </h1>

      {/* Modern Stat Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {stats.map((item, i) => (
          <motion.div
            key={i}
            className="stat bg-base-100 border border-base-300 rounded-lg shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="stat-title text-xs">{item.label}</div>
            <div className="stat-value text-secondary">{item.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Reaction Time Chart */}
      <motion.div
        className="bg-secondary border border-base-300 rounded-xl p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-semibold mb-3 text-base-content">
          ⏱ Reaction Time Per Click
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reactionTimes}>
            <XAxis dataKey="name" stroke="#ffffff" />
            <YAxis stroke="#ffffff" />
            <Tooltip />
            <Bar dataKey="time" fill="#ffffff" name="Time (ms)" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Radar Chart */}
      <motion.div
        className="bg-secondary border border-base-300 rounded-xl p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className=" text-lg font-semibold mb-3 ">🧠 Cognitive Focus Map</h2>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid stroke="#ffffff" />
            <PolarAngleAxis dataKey="subject" stroke="hsl(var(--bc))" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#ffffff" />
            <Radar
              name="You"
              dataKey="value"
              stroke="#ffffff"
              fill="#ffffff"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Click Flow */}
      <motion.div
        className="bg-base-100 border border-base-300 rounded-xl p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-lg font-semibold mb-6 text-base-content">
          Duration between clicks
        </h2>

        <KeystrokeAnim clicks={clicks} />
      </motion.div>
    </div>
  );
}
