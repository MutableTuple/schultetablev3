"use client";
import React, { useState } from "react";

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
  LineChart,
  Line,
} from "recharts";
import { motion } from "framer-motion";
import KeystrokeAnim from "./Profile/KeystrokeAnim";
import BackButton from "./BackButton";
import { formatNumber } from "../_utils/formatNumber";
import Navbar from "./Navbar";
import { GrAnalytics } from "react-icons/gr";
import BarChartAnalytics from "./Charts/BarChartAnalytics";
import LineChartAnalytics from "./Charts/LineChartAnalytics";

export default function SingleGameAnalyticsPage({ game }) {
  const [chartType, setChartType] = useState("line");

  if (!game)
    return <div className="text-center py-10">Game data not found.</div>;

  const summary = game?.game_summary || {};
  const clicks = summary?.clicks || [];

  const reactionTimes = clicks.map((c, i, arr) => {
    const label =
      typeof c.number === "object"
        ? `${c.number.expr}`
        : `${c.number || i + 1}`;

    const currentTime = c.timeTakenMs || 0;
    const prevTime = i > 0 ? arr[i - 1].timeTakenMs : null;
    const change =
      prevTime !== null
        ? (((currentTime - prevTime) / prevTime) * 100).toFixed(2)
        : null;

    return {
      name: label,
      time: currentTime,
      prevTime,
      change, // % diff from previous
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
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-6 space-y-10">
        <BackButton />
        <h1 className="md:text-3xl text-lg font-bold text-base-content flex items-center gap-2">
          <GrAnalytics /> Game Analytics - {game.game_mode?.toUpperCase()} MODE
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

        {/* Reaction Time Chart (Toggleable) */}
        <motion.div
          className="bg-secondary border border-base-300 p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Header + Switch */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-base-content">
              Reaction Time
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setChartType("bar")}
                className={`btn btn-sm ${
                  chartType === "bar" ? "btn-primary" : "btn-outline"
                }`}
              >
                Bar
              </button>
              <button
                onClick={() => setChartType("line")}
                className={`btn btn-sm ${
                  chartType === "line" ? "btn-primary" : "btn-outline"
                }`}
              >
                Line
              </button>
            </div>
          </div>

          {/* Chart */}
          <ResponsiveContainer width="100%" height={300}>
            {chartType === "bar" ? (
              <BarChartAnalytics reactionTimes={reactionTimes} />
            ) : (
              <LineChartAnalytics reactionTimes={reactionTimes} />
            )}
          </ResponsiveContainer>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          className="bg-secondary border border-base-300 rounded-xl p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className=" text-lg font-semibold mb-3 ">Cognitive Focus Map</h2>
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
          className="bg-base-100 border border-base-300 rounded-xl p-6 cursor-pointer"
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
    </>
  );
}
