"use client";
import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const METRICS = [
  {
    key: "accuracy",
    label: "Accuracy",
    unit: "%",
    color: "#6366f1",
    gradientId: "gradAccuracy",
    badge: "badge-primary",
    icon: "◎",
  },
  {
    key: "reactionTime",
    label: "Reaction",
    unit: "ms",
    color: "#f43f5e",
    gradientId: "gradReaction",
    badge: "badge-error",
    icon: "⚡",
  },
  {
    key: "score",
    label: "Score",
    unit: "",
    color: "#10b981",
    gradientId: "gradScore",
    badge: "badge-success",
    icon: "★",
  },
];

function StatPill({ icon, label, value, unit, color, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 text-sm font-medium cursor-pointer select-none
        ${
          active
            ? "border-transparent text-base-100 shadow-lg scale-105"
            : "border-base-300 text-base-content/60 bg-base-200 hover:bg-base-300"
        }`}
      style={
        active ? { background: color, boxShadow: `0 4px 16px ${color}55` } : {}
      }
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-base-100 border border-base-300 rounded-2xl shadow-2xl p-4 text-sm min-w-[160px]">
      <p className="font-bold text-base-content mb-3 text-xs uppercase tracking-widest opacity-50">
        {label}
      </p>
      <div className="space-y-2">
        {payload.map((p) => (
          <div
            key={p.dataKey}
            className="flex items-center justify-between gap-4"
          >
            <span className="flex items-center gap-1.5 text-base-content/70">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ background: p.stroke }}
              />
              {p.name}
            </span>
            <span
              className="font-semibold tabular-nums"
              style={{ color: p.stroke }}
            >
              {p.value}
              {p.name === "Accuracy" ? "%" : p.name === "Reaction" ? "ms" : ""}
            </span>
          </div>
        ))}
        <div className="pt-2 mt-2 border-t border-base-300 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-base-content/50">
          <span>✅ Right</span>
          <span className="text-right font-medium text-success">
            {d.rightClicks}
          </span>
          <span>❌ Wrong</span>
          <span className="text-right font-medium text-error">
            {d.wrongClicks}
          </span>
        </div>
      </div>
    </div>
  );
};

function getInsight(avgAccuracy, avgReaction, totalRight, totalWrong, trend) {
  const total = totalRight + totalWrong;
  const wrongRate = total > 0 ? totalWrong / total : 0;

  // Trend: compare first half vs second half of sessions
  // trend > 0 means improving, < 0 means declining
  if (avgAccuracy >= 85 && avgReaction < 400 && trend >= 0) {
    return {
      emoji: "🔥",
      title: "You're on fire!",
      message: `${avgAccuracy}% accuracy with ${avgReaction}ms reaction — you're in the top tier. Keep this streak going.`,
      alertClass: "alert-success",
      barColor: "#10b981",
    };
  }
  if (avgAccuracy >= 85 && trend < 0) {
    return {
      emoji: "📉",
      title: "Accuracy is great, but slipping",
      message: `Your accuracy is solid at ${avgAccuracy}%, but recent sessions show a dip. Take a short break or slow down.`,
      alertClass: "alert-warning",
      barColor: "#f59e0b",
    };
  }
  if (avgAccuracy >= 70 && avgReaction > 700) {
    return {
      emoji: "⏱️",
      title: "Good accuracy, slow reactions",
      message: `You're hitting ${avgAccuracy}% accuracy — nice! But your avg reaction of ${avgReaction}ms has room to improve. Focus on speed drills.`,
      alertClass: "alert-info",
      barColor: "#6366f1",
    };
  }
  if (avgAccuracy < 60 && wrongRate > 0.4) {
    return {
      emoji: "🎯",
      title: "Accuracy needs work",
      message: `${Math.round(wrongRate * 100)}% of clicks are wrong. Slow down and aim for precision over speed — accuracy compounds.`,
      alertClass: "alert-error",
      barColor: "#f43f5e",
    };
  }
  if (avgAccuracy >= 70 && trend > 0) {
    return {
      emoji: "📈",
      title: "You're improving!",
      message: `Solid ${avgAccuracy}% accuracy and your scores are trending up. Consistency is your superpower right now.`,
      alertClass: "alert-success",
      barColor: "#10b981",
    };
  }
  // Default / not enough data
  return {
    emoji: "🎮",
    title: "Keep playing to unlock insights",
    message:
      "Play a few more sessions and we'll analyze your accuracy, speed, and trends to give you personalized tips.",
    alertClass: "alert-info",
    barColor: "#6366f1",
  };
}

export default function GameChart({
  gameData,
  totalRightClicks,
  totalWrongClicks,
}) {
  const [activeMetrics, setActiveMetrics] = useState([
    "accuracy",
    "reactionTime",
    "score",
  ]);

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

  const toggleMetric = (key) => {
    setActiveMetrics((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  // Summary stats
  const avgAccuracy = chartData.length
    ? (
        chartData.reduce((s, d) => s + d.accuracy, 0) / chartData.length
      ).toFixed(1)
    : 0;
  const bestScore = chartData.length
    ? Math.max(...chartData.map((d) => d.score))
    : 0;
  const avgReaction = chartData.length
    ? Math.round(
        chartData.reduce((s, d) => s + d.reactionTime, 0) / chartData.length,
      )
    : 0;

  // Trend: compare avg score of first half vs second half
  const half = Math.floor(chartData.length / 2);
  const firstHalfAvg =
    half > 0
      ? chartData.slice(0, half).reduce((s, d) => s + d.accuracy, 0) / half
      : 0;
  const secondHalfAvg =
    half > 0
      ? chartData.slice(half).reduce((s, d) => s + d.accuracy, 0) /
        (chartData.length - half)
      : 0;
  const trend = secondHalfAvg - firstHalfAvg;

  const insight = getInsight(
    parseFloat(avgAccuracy),
    avgReaction,
    totalRightClicks || 0,
    totalWrongClicks || 0,
    trend,
  );

  return (
    <div className="card bg-base-100 border border-base-300  mt-10 overflow-hidden">
      {/* Subtle top accent bar */}
      <div className="h-0.5 w-full bg-gradient-to-r from-indigo-500 via-rose-500 to-emerald-500 opacity-70" />

      <div className="card-body p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-base-content tracking-tight">
              Game Progress
            </h2>
            <p className="text-xs text-base-content/40 mt-0.5">
              Last {chartData.length} sessions
            </p>
          </div>

          {/* Metric toggles */}
          <div className="flex flex-wrap gap-2">
            {METRICS.map((m) => (
              <StatPill
                key={m.key}
                icon={m.icon}
                label={m.label}
                color={m.color}
                active={activeMetrics.includes(m.key)}
                onClick={() => toggleMetric(m.key)}
              />
            ))}
          </div>
        </div>

        {/* Summary stat pills */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Avg Accuracy",
              value: `${avgAccuracy}%`,
              color: "#6366f1",
              icon: "◎",
            },
            {
              label: "Best Score",
              value: bestScore,
              color: "#10b981",
              icon: "★",
            },
            {
              label: "Avg Reaction",
              value: `${avgReaction}ms`,
              color: "#f43f5e",
              icon: "⚡",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl bg-base-200 border border-base-300 p-3 flex flex-col gap-1"
            >
              <span className="text-xs text-base-content/40 font-medium">
                {s.label}
              </span>
              <span
                className="text-xl font-bold tabular-nums"
                style={{ color: s.color }}
              >
                {s.icon} {s.value}
              </span>
            </div>
          ))}
        </div>

        {/* Insight banner */}
        <div
          className={`alert ${insight.alertClass} rounded-2xl py-3 px-4 flex items-start gap-3 border-0`}
          style={{
            background: `${insight.barColor}18`,
            borderLeft: `3px solid ${insight.barColor}`,
          }}
        >
          <span className="text-xl mt-0.5">{insight.emoji}</span>
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-sm text-base-content">
              {insight.title}
            </span>
            <span className="text-xs text-base-content/60 leading-relaxed">
              {insight.message}
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="w-full" style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
            >
              <defs>
                {METRICS.map((m) => (
                  <linearGradient
                    key={m.gradientId}
                    id={m.gradientId}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={m.color} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={m.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>

              <CartesianGrid
                strokeDasharray="4 4"
                stroke="currentColor"
                strokeOpacity={0.06}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "currentColor", opacity: 0.35 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "currentColor", opacity: 0.35 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "currentColor",
                  strokeOpacity: 0.1,
                  strokeWidth: 1,
                }}
              />

              {METRICS.filter((m) => activeMetrics.includes(m.key)).map((m) => (
                <Area
                  key={m.key}
                  type="monotone"
                  dataKey={m.key}
                  name={m.label}
                  stroke={m.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0, fill: m.color }}
                  fill={`url(#${m.gradientId})`}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-base-content/30 pt-1 border-t border-base-300">
          <span>Click legend pills to toggle metrics</span>
          <span>
            ✅ {totalRightClicks} right · ❌ {totalWrongClicks} wrong
          </span>
        </div>
      </div>
    </div>
  );
}
