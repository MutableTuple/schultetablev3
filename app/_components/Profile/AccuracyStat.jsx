"use client";
import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/app/_lib/supabase";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const FILTERS = [
  { value: "week", label: "7D" },
  { value: "month", label: "30D" },
  { value: "all", label: "All" },
];

function getPerformanceInsight(accuracy, trend, dataPoints) {
  if (dataPoints <= 1)
    return {
      emoji: "🎮",
      title: "Keep playing!",
      message:
        "Play more sessions to unlock accuracy trends and personalised tips.",
      color: "#6366f1",
      alertBg: "#6366f115",
    };
  if (accuracy >= 90 && trend >= 0)
    return {
      emoji: "🏆",
      title: "Elite accuracy!",
      message: `You're hitting ${accuracy.toFixed(1)}% — that's exceptional. Your aim has stayed sharp and is still climbing.`,
      color: "#10b981",
      alertBg: "#10b98115",
    };
  if (accuracy >= 90 && trend < 0)
    return {
      emoji: "⚠️",
      title: "High accuracy, slight dip",
      message: `Still great at ${accuracy.toFixed(1)}%, but you've dipped ${Math.abs(trend).toFixed(1)}% recently. Take a short break and reset.`,
      color: "#f59e0b",
      alertBg: "#f59e0b15",
    };
  if (accuracy >= 75 && trend > 5)
    return {
      emoji: "📈",
      title: "On the rise!",
      message: `Up ${trend.toFixed(1)}% this period — your consistency is paying off. Push for 90%+.`,
      color: "#6366f1",
      alertBg: "#6366f115",
    };
  if (accuracy >= 75)
    return {
      emoji: "◎",
      title: "Solid performance",
      message: `${accuracy.toFixed(1)}% is a strong baseline. Focus on reducing wrong clicks to break through to the next level.`,
      color: "#6366f1",
      alertBg: "#6366f115",
    };
  if (accuracy < 60)
    return {
      emoji: "🎯",
      title: "Accuracy needs work",
      message: `At ${accuracy.toFixed(1)}%, precision is the priority right now. Slow down and aim before clicking — speed comes later.`,
      color: "#f43f5e",
      alertBg: "#f43f5e15",
    };
  return {
    emoji: "💪",
    title: "Room to grow",
    message: `${accuracy.toFixed(1)}% — you're getting there. Consistent daily practice will compound quickly.`,
    color: "#f59e0b",
    alertBg: "#f59e0b15",
  };
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-base-100 border border-base-300 rounded-2xl shadow-2xl p-4 text-sm min-w-[140px]">
      <p className="text-xs uppercase tracking-widest text-base-content/40 font-semibold mb-2">
        {label}
      </p>
      <div className="flex items-center justify-between gap-4">
        <span className="flex items-center gap-1.5 text-base-content/70">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ background: payload[0].stroke }}
          />
          Accuracy
        </span>
        <span
          className="font-bold tabular-nums"
          style={{ color: payload[0].stroke }}
        >
          {payload[0].value.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

export default function AccuracyStat({ user }) {
  const [accuracyData, setAccuracyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user?.id) return;
    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from("UniversalGameStats")
          .select("accuracy, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });

        if (error) throw error;
        if (!data?.length) {
          setAccuracyData([]);
          return;
        }

        const grouped = {};
        data.forEach((row) => {
          const day = new Date(row.created_at).toISOString().split("T")[0];
          if (!grouped[day]) grouped[day] = [];
          grouped[day].push(row.accuracy || 0);
        });

        setAccuracyData(
          Object.entries(grouped)
            .sort(([a], [b]) => new Date(a) - new Date(b))
            .map(([date, accs]) => ({
              date,
              displayDate: new Date(date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
              }),
              accuracy: accs.reduce((s, v) => s + v, 0) / accs.length,
            })),
        );
      } catch {
        setError("Unable to fetch accuracy data.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  const filteredData = useMemo(() => {
    if (!accuracyData.length) return [];
    const now = new Date();
    return accuracyData.filter((d) => {
      const diff = now - new Date(d.date);
      if (filter === "week") return diff <= 7 * 86400000;
      if (filter === "month") return diff <= 30 * 86400000;
      return true;
    });
  }, [filter, accuracyData]);

  const accuracy = useMemo(() => {
    if (!filteredData.length) return 0;
    return (
      filteredData.reduce((s, d) => s + d.accuracy, 0) / filteredData.length
    );
  }, [filteredData]);

  const trend = useMemo(() => {
    if (filteredData.length < 2) return 0;
    const first = filteredData[0].accuracy;
    const last = filteredData[filteredData.length - 1].accuracy;
    return first === 0 ? last * 100 : ((last - first) / first) * 100;
  }, [filteredData]);

  const best = useMemo(
    () =>
      filteredData.length
        ? Math.max(...filteredData.map((d) => d.accuracy))
        : 0,
    [filteredData],
  );
  const worst = useMemo(
    () =>
      filteredData.length
        ? Math.min(...filteredData.map((d) => d.accuracy))
        : 0,
    [filteredData],
  );

  const isUp = trend >= 0;
  const lineColor =
    accuracy >= 75 ? "#6366f1" : accuracy >= 60 ? "#f59e0b" : "#f43f5e";
  const insight = getPerformanceInsight(accuracy, trend, filteredData.length);

  return (
    <div className="card bg-base-100  overflow-hidden">
      {/* top accent */}
      <div
        className="h-0.5 w-full"
        style={{
          background: `linear-gradient(to right, ${lineColor}, ${lineColor}44)`,
        }}
      />

      <div className="card-body p-6 space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-base-content tracking-tight">
              Overall Accuracy
            </h2>
            <p className="text-xs text-base-content/40 mt-0.5">
              Daily average across all sessions
            </p>
          </div>

          {/* Filter pills */}
          <div className="join rounded-xl border border-base-300 bg-base-200 p-0.5 self-start sm:self-auto">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`join-item btn btn-xs rounded-lg border-0 font-medium transition-all duration-150 ${
                  filter === f.value
                    ? "bg-base-100 text-base-content shadow-sm"
                    : "bg-transparent text-base-content/40 hover:text-base-content"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Big number + mini stats ── */}
        {loading ? (
          <div className="space-y-3">
            <div className="h-12 w-40 bg-base-200 animate-pulse rounded-xl" />
            <div className="h-4 w-64 bg-base-200 animate-pulse rounded-lg" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-error/20 bg-error/8 px-4 py-3 text-sm text-error">
            {error}
          </div>
        ) : (
          <div className="flex flex-wrap items-end gap-6">
            {/* Primary number */}
            <div>
              <div
                className="text-5xl font-bold tabular-nums tracking-tight"
                style={{ color: lineColor }}
              >
                {accuracy.toFixed(1)}%
              </div>
              <div
                className={`flex items-center gap-1 mt-1.5 text-sm font-medium ${isUp ? "text-success" : "text-error"}`}
              >
                <span>{isUp ? "▲" : "▼"}</span>
                <span>{Math.abs(trend).toFixed(1)}% vs first session</span>
              </div>
            </div>

            {/* Mini stat pills */}
            <div className="flex flex-wrap gap-2 pb-1">
              {[
                {
                  label: "Best day",
                  value: `${best.toFixed(1)}%`,
                  color: "#10b981",
                },
                {
                  label: "Worst day",
                  value: `${worst.toFixed(1)}%`,
                  color: "#f43f5e",
                },
                {
                  label: "Sessions",
                  value: filteredData.length,
                  color: "#6366f1",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl bg-base-200 border border-base-300 px-3 py-2 flex flex-col gap-0.5"
                >
                  <span className="text-xs text-base-content/40">
                    {s.label}
                  </span>
                  <span
                    className="text-sm font-bold tabular-nums"
                    style={{ color: s.color }}
                  >
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Insight banner ── */}
        {!loading && !error && filteredData.length > 0 && (
          <div
            className="rounded-2xl px-4 py-3 flex items-start gap-3"
            style={{
              background: insight.alertBg,
              borderLeft: `3px solid ${insight.color}`,
            }}
          >
            <span className="text-xl mt-0.5">{insight.emoji}</span>
            <div>
              <p className="text-sm font-semibold text-base-content">
                {insight.title}
              </p>
              <p className="text-xs text-base-content/55 leading-relaxed mt-0.5">
                {insight.message}
              </p>
            </div>
          </div>
        )}

        {/* ── Chart ── */}
        {loading ? (
          <div className="h-56 w-full bg-base-200 animate-pulse rounded-2xl" />
        ) : filteredData.length > 0 ? (
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={filteredData}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={lineColor}
                      stopOpacity={0.25}
                    />
                    <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="currentColor"
                  strokeOpacity={0.06}
                  vertical={false}
                />
                <XAxis
                  dataKey="displayDate"
                  tick={{ fontSize: 11, fill: "currentColor", opacity: 0.35 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
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
                {/* 75% reference line */}
                <ReferenceLine
                  y={75}
                  stroke={lineColor}
                  strokeDasharray="4 3"
                  strokeOpacity={0.3}
                  label={{
                    value: "75% goal",
                    position: "insideTopRight",
                    fontSize: 10,
                    fill: lineColor,
                    opacity: 0.5,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="accuracy"
                  stroke={lineColor}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0, fill: lineColor }}
                  fill="url(#accGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="rounded-2xl border border-base-300 bg-base-200/50 p-10 flex flex-col items-center gap-2 text-center">
            <span className="text-3xl">📭</span>
            <p className="text-sm text-base-content/50">
              No data for this period
            </p>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="flex items-center justify-between text-xs text-base-content/25 pt-1 border-t border-base-300">
          <span>Grouped by day · average per session</span>
          <span>
            {filter === "week"
              ? "Last 7 days"
              : filter === "month"
                ? "Last 30 days"
                : "All time"}
          </span>
        </div>
      </div>
    </div>
  );
}
