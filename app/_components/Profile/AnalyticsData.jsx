"use client";
import React, { useEffect, useState } from "react";
import { formatNumber } from "@/app/_utils/formatNumber";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/app/_lib/supabase";

const STATS = (props) => [
  {
    label: "Games Played",
    value: props.totalGames,
    sub: props.gameData?.[0]?.created_at
      ? `Last played ${formatDistanceToNow(new Date(props.gameData[0].created_at), { addSuffix: true })}`
      : "No sessions yet",
    icon: "🎮",
    color: "#6366f1",
    textClass: "text-primary",
  },
  {
    label: "Total Score",
    value: formatNumber(props.totalScore),
    sub: "All-time performance",
    icon: "⭐",
    color: "#06b6d4",
    textClass: "text-info",
  },
  {
    label: "Current Rank",
    value: props.latestRank ?? "—",
    sub: "Based on total score",
    icon: "🏆",
    color: "#f59e0b",
    textClass: "text-warning",
    loading: props.latestRank == null,
  },
  {
    label: "Right Clicks",
    value: formatNumber(props.totalRightClicks),
    sub: "Across all sessions",
    icon: "✅",
    color: "#10b981",
    textClass: "text-success",
  },
  {
    label: "Wrong Clicks",
    value: formatNumber(props.totalWrongClicks),
    sub: "Mistakes made",
    icon: "❌",
    color: "#f43f5e",
    textClass: "text-error",
  },
  {
    label: "Avg Accuracy",
    value: props.formatPercent(props.avgAccuracy),
    sub: "Across all games",
    icon: "🎯",
    color: "#10b981",
    textClass: "text-success",
  },
  {
    label: "Avg Finish Time",
    value: props.formatMs(props.avgDuration),
    sub: "Full grid average",
    icon: "⏱️",
    color: "#a78bfa",
    textClass: "text-accent",
  },
  {
    label: "Avg Reaction",
    value: props.formatMs(props.avgReactionTime),
    sub: "Between tiles",
    icon: "⚡",
    color: "#f59e0b",
    textClass: "text-warning",
  },
];

function StatCard({ label, value, sub, icon, color, textClass, loading }) {
  return (
    <div className="relative bg-base-100 border border-base-300 rounded-2xl p-5 flex flex-col gap-3 overflow-hidden group hover:border-base-content/20 transition-all duration-200 hover:shadow-lg">
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(ellipse at top left, ${color}12, transparent 70%)`,
        }}
      />

      {/* Top row */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-base-content/40 uppercase tracking-widest">
          {label}
        </span>
        <span
          className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
          style={{ background: `${color}18` }}
        >
          {icon}
        </span>
      </div>

      {/* Value */}
      <div className={`text-2xl font-bold tabular-nums ${textClass}`}>
        {loading ? <span className="loading loading-ring loading-sm" /> : value}
      </div>

      {/* Sub */}
      <div className="flex items-center gap-1.5">
        <div className="w-1 h-1 rounded-full" style={{ background: color }} />
        <span className="text-xs text-base-content/40">{sub}</span>
      </div>
    </div>
  );
}

export default function AnalyticsData({
  user,
  loading,
  totalGames,
  gameData,
  totalScore,
  totalRightClicks,
  totalWrongClicks,
  avgAccuracy,
  avgDuration,
  avgReactionTime,
  formatMs,
  formatPercent,
}) {
  const [latestRank, setLatestRank] = useState(null);

  useEffect(() => {
    const fetchRank = async () => {
      const { data, error } = await supabase.rpc("get_user_rank", {
        uid: user?.id,
      });
      if (!error && data[0]?.rank) setLatestRank(data[0].rank);
    };
    if (user?.id) fetchRank();
  }, [user]);

  const isDataMissing =
    totalGames == null ||
    totalScore == null ||
    totalRightClicks == null ||
    totalWrongClicks == null ||
    avgAccuracy == null ||
    avgDuration == null ||
    avgReactionTime == null;

  const stats = STATS({
    totalGames,
    gameData,
    totalScore,
    latestRank,
    totalRightClicks,
    totalWrongClicks,
    formatPercent,
    formatMs,
    avgAccuracy,
    avgDuration,
    avgReactionTime,
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-base-content tracking-tight">
            Advanced Analytics
          </h1>
          <p className="text-xs text-base-content/40 mt-0.5">
            Your performance breakdown
          </p>
        </div>
        {!user?.is_pro_user && (
          <a
            href="/get-pro"
            className="btn btn-sm rounded-full border-base-300 bg-base-200 hover:bg-primary hover:text-primary-content hover:border-primary transition-all duration-200 text-xs gap-1.5"
          >
            <span>✦</span> Upgrade to PRO
          </a>
        )}
      </div>

      {/* Free tier notice */}
      {!user?.is_pro_user && (
        <div className="rounded-2xl border border-info/30 bg-info/8 px-4 py-3 flex items-center gap-3">
          <span className="text-info text-lg">📊</span>
          <p className="text-xs text-base-content/70 leading-relaxed">
            You're viewing stats from your{" "}
            <strong className="text-base-content">last 5 games</strong> only.{" "}
            <a
              href="/get-pro"
              className="text-info font-semibold hover:underline"
            >
              Upgrade to PRO
            </a>{" "}
            to unlock full history & deeper insights.
          </p>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <span className="loading loading-spinner loading-lg text-primary" />
          <span className="text-xs text-base-content/30">
            Crunching your stats...
          </span>
        </div>
      ) : isDataMissing ? (
        <div className="rounded-2xl border border-base-300 bg-base-200/50 p-10 flex flex-col items-center gap-3 text-center">
          <span className="text-3xl">🎮</span>
          <p className="text-sm font-medium text-base-content/70">
            Not enough data yet
          </p>
          <p className="text-xs text-base-content/40">
            Play a few games to start seeing your analytics here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      )}
    </div>
  );
}
