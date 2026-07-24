"use client";
import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function getInsight(avgAccuracy, avgReaction, totalRight, totalWrong, trend) {
  const total = totalRight + totalWrong;
  const wrongRate = total > 0 ? totalWrong / total : 0;
  if (avgAccuracy >= 85 && avgReaction < 400 && trend >= 0)
    return {
      emoji: "🔥",
      title: "You're on fire!",
      message: `${avgAccuracy}% accuracy with ${avgReaction}ms reaction — top tier. Keep it up.`,
    };
  if (avgAccuracy >= 85 && trend < 0)
    return {
      emoji: "📉",
      title: "Accuracy slipping",
      message: `Solid at ${avgAccuracy}%, but recent sessions are dipping. Try a short break.`,
    };
  if (avgAccuracy >= 70 && avgReaction > 700)
    return {
      emoji: "⏱️",
      title: "Good accuracy, slow reactions",
      message: `${avgAccuracy}% accuracy is nice — but ${avgReaction}ms reaction has room to drop.`,
    };
  if (avgAccuracy < 60 && wrongRate > 0.4)
    return {
      emoji: "🎯",
      title: "Accuracy needs work",
      message: `${Math.round(wrongRate * 100)}% of clicks are wrong. Slow down — precision compounds.`,
    };
  if (avgAccuracy >= 70 && trend > 0)
    return {
      emoji: "📈",
      title: "You're improving!",
      message: `${avgAccuracy}% accuracy and trending up. Consistency is your edge.`,
    };
  return {
    emoji: "🎮",
    title: "Keep playing",
    message:
      "A few more sessions and we'll surface personalized tips on accuracy, speed, and trends.",
  };
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border shadow-lg p-4 min-w-[160px] rounded-lg">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
        {label}
      </p>
      <div className="space-y-2">
        {payload.map((p) => (
          <div
            key={p.dataKey}
            className="flex items-center justify-between gap-6"
          >
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 inline-block"
                style={{ background: p.stroke }}
              />
              <span className="text-xs text-muted-foreground">{p.name}</span>
            </div>
            <span className="text-xs font-bold text-popover-foreground tabular-nums">
              {p.value}
              {p.name === "Accuracy" ? "%" : p.name === "Reaction" ? "ms" : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AREAS = [
  {
    key: "score",
    name: "Score",
    fillDark: "var(--foreground)",
    fillLight: "var(--muted)",
    stroke: "var(--foreground)",
  },
  {
    key: "reactionTime",
    name: "Reaction",
    fillDark: "var(--muted-foreground)",
    fillLight: "var(--muted)",
    stroke: "var(--muted-foreground)",
  },
  {
    key: "accuracy",
    name: "Accuracy",
    fillDark: "var(--primary)",
    fillLight: "var(--muted)",
    stroke: "var(--primary)",
  },
];

export default function GameChart({
  gameData,
  totalRightClicks,
  totalWrongClicks,
}) {
  const chartData = useMemo(
    () =>
      gameData
        .map((g) => ({
          date: new Date(g.created_at).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          }),
          accuracy: parseFloat(g?.game_summary?.accuracy || 0),
          reactionTime: g?.game_summary?.avgReactionTimeMs || 0,
          score: g?.score || 0,
        }))
        .reverse(),
    [gameData],
  );

  const { avgAccuracy, bestScore, avgReaction, trend } = useMemo(() => {
    const len = chartData.length;
    if (!len)
      return { avgAccuracy: "0", bestScore: 0, avgReaction: 0, trend: 0 };

    const half = Math.floor(len / 2);
    let sumAcc = 0;
    let sumReaction = 0;
    let maxScore = -Infinity;
    let firstHalfAcc = 0;
    let secondHalfAcc = 0;

    chartData.forEach((d, i) => {
      sumAcc += d.accuracy;
      sumReaction += d.reactionTime;
      if (d.score > maxScore) maxScore = d.score;
      if (i < half) firstHalfAcc += d.accuracy;
      else secondHalfAcc += d.accuracy;
    });

    const firstHalfAvg = half > 0 ? firstHalfAcc / half : 0;
    const secondHalfAvg = half > 0 ? secondHalfAcc / (len - half) : 0;

    return {
      avgAccuracy: (sumAcc / len).toFixed(1),
      bestScore: maxScore,
      avgReaction: Math.round(sumReaction / len),
      trend: secondHalfAvg - firstHalfAvg,
    };
  }, [chartData]);

  const insight = useMemo(
    () =>
      getInsight(
        parseFloat(avgAccuracy),
        avgReaction,
        totalRightClicks || 0,
        totalWrongClicks || 0,
        trend,
      ),
    [avgAccuracy, avgReaction, totalRightClicks, totalWrongClicks, trend],
  );

  return (
    <div className="overflow-hidden mt-8">
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground tracking-tight">
              Game Progress
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Last {chartData.length} sessions
            </p>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4">
            {AREAS.map((a) => (
              <div key={a.key} className="flex items-center gap-1.5">
                <span
                  className="w-3 h-0.5 inline-block"
                  style={{ background: a.stroke }}
                />
                <span className="text-[10px] text-muted-foreground font-medium">
                  {a.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-3 divide-x divide-border border border-border rounded-xl overflow-hidden">
          {[
            { label: "Avg Accuracy", value: `${avgAccuracy}%`, icon: "◎" },
            { label: "Best Score", value: bestScore, icon: "★" },
            { label: "Avg Reaction", value: `${avgReaction}ms`, icon: "⚡" },
          ].map((s) => (
            <div
              key={s.label}
              className="px-4 py-3 bg-muted flex flex-col gap-0.5"
            >
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                {s.label}
              </span>
              <span className="text-lg font-bold text-foreground tabular-nums">
                {s.icon} {s.value}
              </span>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
            >
              <defs>
                {AREAS.map((a) => (
                  <linearGradient
                    key={a.key}
                    id={`grad-${a.key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={a.fillDark}
                      stopOpacity={0.18}
                    />
                    <stop
                      offset="100%"
                      stopColor={a.fillLight}
                      stopOpacity={0}
                    />
                  </linearGradient>
                ))}
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
              />

              {AREAS.map((a) => (
                <Area
                  key={a.key}
                  type="linear"
                  dataKey={a.key}
                  name={a.name}
                  stroke={a.stroke}
                  strokeWidth={1.5}
                  fill={`url(#grad-${a.key})`}
                  dot={false}
                  activeDot={{ r: 4, fill: a.stroke, strokeWidth: 0 }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Insight */}
        <div className="border border-border bg-muted rounded-xl px-4 py-3 flex items-start gap-3">
          <span className="text-base mt-0.5">{insight.emoji}</span>
          <div>
            <p className="text-xs font-semibold text-foreground">
              {insight.title}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
              {insight.message}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border">
          <span>All 3 metrics overlaid · sharp area chart</span>
          <span>
            ✅ {totalRightClicks} right · ❌ {totalWrongClicks} wrong
          </span>
        </div>
      </div>
    </div>
  );
}
