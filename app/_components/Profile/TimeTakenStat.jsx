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
import Link from "next/link";

const TIME_FILTERS = [
  { value: "week", label: "7D" },
  { value: "month", label: "30D" },
  { value: "all", label: "All" },
];

function getTimeInsight(avgTime, trend, dataPoints) {
  if (dataPoints <= 1)
    return {
      emoji: "🎮",
      title: "Keep playing!",
      message:
        "Play more sessions to see your speed trends and get personalised tips.",
      color: "#6366f1",
    };
  if (avgTime < 5 && trend <= 0)
    return {
      emoji: "⚡",
      title: "Blazing fast!",
      message: `${avgTime.toFixed(1)}s average and still getting quicker. Your reaction speed is elite — keep pushing.`,
      color: "#10b981",
    };
  if (avgTime < 10 && trend <= 0)
    return {
      emoji: "🚀",
      title: "Speed is improving!",
      message: `You're finishing in ${avgTime.toFixed(1)}s on average and trending faster. Consistency is key — keep it up.`,
      color: "#10b981",
    };
  if (trend > 15)
    return {
      emoji: "🐢",
      title: "Slowing down lately",
      message: `Your time has increased by ${trend.toFixed(1)}% this period. Fatigue or distraction? Try shorter focused sessions.`,
      color: "#f43f5e",
    };
  if (avgTime > 20)
    return {
      emoji: "⏱️",
      title: "Room to speed up",
      message: `${avgTime.toFixed(1)}s average — accuracy is great, but try setting a pace target to shave off seconds each session.`,
      color: "#f59e0b",
    };
  if (trend < -10)
    return {
      emoji: "📉",
      title: "Getting faster!",
      message: `Down ${Math.abs(trend).toFixed(1)}% — your muscle memory is kicking in. Keep grinding.`,
      color: "#10b981",
    };
  return {
    emoji: "◎",
    title: "Steady pace",
    message: `${avgTime.toFixed(1)}s is a solid baseline. Try harder difficulties to push your speed ceiling.`,
    color: "#6366f1",
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
          Avg Time
        </span>
        <span
          className="font-bold tabular-nums"
          style={{ color: payload[0].stroke }}
        >
          {payload[0].value.toFixed(1)}s
        </span>
      </div>
    </div>
  );
};

function FilterChip({ label, value, options, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-base-content/40 uppercase tracking-wider">
        {label}
      </span>
      <select
        className="select select-sm bg-base-200 border-base-300 rounded-xl text-sm font-medium focus:outline-none focus:border-base-content/20 min-w-[110px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>
            {o.label ?? (o === "all" ? "All" : o)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function TimeTakenStat({ user }) {
  const [timeData, setTimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [gridSize, setGridSize] = useState("all");
  const [gameMode, setGameMode] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    const fetchTimeTaken = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from("UniversalGameStats")
          .select("time_taken, created_at, difficulty, grid_size, game_mode")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });
        if (error) throw error;
        setTimeData((data || []).filter((d) => d.game_mode));
      } catch {
        setError("Unable to fetch your time data.");
      } finally {
        setLoading(false);
      }
    };
    fetchTimeTaken();
  }, [user]);

  const difficultyOptions = [
    "all",
    ...Array.from(new Set(timeData.map((d) => d.difficulty))),
  ];
  const gridOptions = [
    "all",
    ...Array.from(new Set(timeData.map((d) => d.grid_size))).sort(
      (a, b) => a - b,
    ),
  ];
  const gameModeOptions = [
    "all",
    ...Array.from(new Set(timeData.map((d) => d.game_mode))).filter(Boolean),
  ];

  const filteredData = useMemo(() => {
    const now = new Date();
    return timeData.filter((row) => {
      const diff = now - new Date(row.created_at);
      return (
        (difficulty === "all" || row.difficulty === difficulty) &&
        (gridSize === "all" || row.grid_size === parseInt(gridSize)) &&
        (gameMode === "all" || row.game_mode === gameMode) &&
        (filter === "all" ||
          (filter === "week" && diff <= 7 * 86400000) ||
          (filter === "month" && diff <= 30 * 86400000))
      );
    });
  }, [timeData, filter, difficulty, gridSize, gameMode]);

  const chartData = useMemo(() => {
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
        displayDate: new Date(date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        time_taken: times.reduce((s, v) => s + v, 0) / times.length,
      }));
  }, [filteredData]);

  const averageTime = useMemo(
    () =>
      chartData.length
        ? chartData.reduce((s, d) => s + d.time_taken, 0) / chartData.length
        : 0,
    [chartData],
  );

  const trend = useMemo(() => {
    if (chartData.length < 2) return 0;
    const first = chartData[0].time_taken;
    const last = chartData[chartData.length - 1].time_taken;
    return first === 0 ? last * 100 : ((last - first) / first) * 100;
  }, [chartData]);

  const best = useMemo(
    () =>
      chartData.length ? Math.min(...chartData.map((d) => d.time_taken)) : 0,
    [chartData],
  );
  const worst = useMemo(
    () =>
      chartData.length ? Math.max(...chartData.map((d) => d.time_taken)) : 0,
    [chartData],
  );

  // Lower time = better, so trend down = good = green
  const isFaster = trend <= 0;
  const lineColor = isFaster
    ? "#10b981"
    : averageTime < 10
      ? "#6366f1"
      : "#f59e0b";
  const insight = getTimeInsight(averageTime, trend, chartData.length);

  const activeFilterCount = [
    difficulty !== "all",
    gridSize !== "all",
    gameMode !== "all",
    filter !== "all",
  ].filter(Boolean).length;

  const playLink = `/play?mode=${gameMode}&difficulty=${difficulty}&grid=${gridSize}`;

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
              Average Time Taken
            </h2>
            <p className="text-xs text-base-content/40 mt-0.5">
              Daily average finish time per session
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
            {/* Time range pills */}
            <div className="join rounded-xl border border-base-300 bg-base-200 p-0.5">
              {TIME_FILTERS.map((f) => (
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

            {/* Filter toggle */}
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className={`btn btn-xs rounded-xl border font-medium gap-1.5 transition-all ${
                filtersOpen || activeFilterCount > 0
                  ? "btn-primary border-primary"
                  : "border-base-300 bg-base-200 text-base-content/50 hover:text-base-content"
              }`}
            >
              <span>⚙️</span>
              Filters
              {activeFilterCount > 0 && (
                <span className="badge badge-xs badge-primary-content bg-white/30 text-white border-0 font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── Expandable filter panel ── */}
        {filtersOpen && (
          <div className="rounded-2xl border border-base-300 bg-base-200/60 p-4 flex flex-wrap gap-4">
            <FilterChip
              label="Difficulty"
              value={difficulty}
              options={difficultyOptions}
              onChange={setDifficulty}
            />
            <FilterChip
              label="Grid Size"
              value={gridSize}
              options={gridOptions}
              onChange={setGridSize}
            />
            <FilterChip
              label="Game Mode"
              value={gameMode}
              options={gameModeOptions}
              onChange={setGameMode}
            />
            {activeFilterCount > 0 && (
              <div className="flex items-end">
                <button
                  className="btn btn-xs btn-ghost text-base-content/40 hover:text-error rounded-xl"
                  onClick={() => {
                    setDifficulty("all");
                    setGridSize("all");
                    setGameMode("all");
                    setFilter("all");
                  }}
                >
                  ✕ Reset all
                </button>
              </div>
            )}
          </div>
        )}

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
        ) : chartData.length > 0 ? (
          <div className="flex flex-wrap items-end gap-6">
            <div>
              <div
                className="text-5xl font-bold tabular-nums tracking-tight"
                style={{ color: lineColor }}
              >
                {averageTime.toFixed(1)}s
              </div>
              <div
                className={`flex items-center gap-1 mt-1.5 text-sm font-medium ${isFaster ? "text-success" : "text-error"}`}
              >
                <span>{isFaster ? "▼" : "▲"}</span>
                <span>
                  {Math.abs(trend).toFixed(1)}% vs first session ·{" "}
                  {isFaster ? "faster" : "slower"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pb-1">
              {[
                {
                  label: "Best day",
                  value: `${best.toFixed(1)}s`,
                  color: "#10b981",
                },
                {
                  label: "Worst day",
                  value: `${worst.toFixed(1)}s`,
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
        ) : (
          <div className="rounded-2xl border border-base-300 bg-base-200/50 p-8 flex flex-col items-center gap-3 text-center">
            <span className="text-3xl">🔍</span>
            <p className="text-sm font-medium text-base-content/60">
              No games match these filters
            </p>
            <p className="text-xs text-base-content/35">
              Try adjusting difficulty, grid size, or game mode
            </p>
            {gameMode !== "all" &&
              difficulty !== "all" &&
              gridSize !== "all" && (
                <Link
                  href={playLink}
                  className="btn btn-sm btn-primary rounded-xl mt-1"
                >
                  Play this combo
                </Link>
              )}
          </div>
        )}

        {/* ── Insight banner ── */}
        {!loading && !error && chartData.length > 0 && (
          <div
            className="rounded-2xl px-4 py-3 flex items-start gap-3"
            style={{
              background: `${insight.color}15`,
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
        ) : chartData.length > 0 ? (
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="timeGrad" x1="0" y1="0" x2="0" y2="1">
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
                  domain={["auto", "auto"]}
                  tickFormatter={(v) => `${v.toFixed(0)}s`}
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
                <ReferenceLine
                  y={averageTime}
                  stroke={lineColor}
                  strokeDasharray="4 3"
                  strokeOpacity={0.3}
                  label={{
                    value: "avg",
                    position: "insideTopRight",
                    fontSize: 10,
                    fill: lineColor,
                    opacity: 0.5,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="time_taken"
                  stroke={lineColor}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0, fill: lineColor }}
                  fill="url(#timeGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {/* ── Footer ── */}
        {chartData.length > 0 && (
          <div className="flex items-center justify-between text-xs text-base-content/25 pt-1 border-t border-base-300">
            <span>Grouped by day · lower is better</span>
            <span>
              {filter === "week"
                ? "Last 7 days"
                : filter === "month"
                  ? "Last 30 days"
                  : "All time"}
              {activeFilterCount > 0 &&
                ` · ${activeFilterCount} filter${activeFilterCount > 1 ? "s" : ""} active`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
