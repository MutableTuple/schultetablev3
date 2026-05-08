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

function getReactionInsight(avgTime, trend, dataPoints) {
  if (dataPoints <= 1)
    return {
      emoji: "🎮",
      title: "Keep playing!",
      message:
        "Play more sessions to unlock reaction time trends and personalised coaching.",
      color: "#6366f1",
    };
  if (avgTime < 0.3 && trend <= 0)
    return {
      emoji: "⚡",
      title: "Inhuman reflexes!",
      message: `${(avgTime * 1000).toFixed(0)}ms average — you're in the top 1%. Your reaction speed is elite.`,
      color: "#10b981",
    };
  if (avgTime < 0.5 && trend <= 0)
    return {
      emoji: "🚀",
      title: "Lightning fast!",
      message: `${(avgTime * 1000).toFixed(0)}ms and still dropping. Keep this momentum going — sub-300ms is within reach.`,
      color: "#10b981",
    };
  if (avgTime < 0.5 && trend > 10)
    return {
      emoji: "⚠️",
      title: "Fast, but slowing",
      message: `You're fast at ${(avgTime * 1000).toFixed(0)}ms, but reactions have slowed ${trend.toFixed(1)}% recently. Rest up.`,
      color: "#f59e0b",
    };
  if (trend < -10)
    return {
      emoji: "📉",
      title: "Reactions are sharper!",
      message: `Down ${Math.abs(trend).toFixed(1)}% — your brain-to-click loop is getting tighter. Keep training.`,
      color: "#10b981",
    };
  if (trend > 20)
    return {
      emoji: "🐢",
      title: "Reactions slowing down",
      message: `Up ${trend.toFixed(1)}% this period. Fatigue or distraction can do this — try shorter, focused bursts.`,
      color: "#f43f5e",
    };
  if (avgTime > 1.0)
    return {
      emoji: "🎯",
      title: "Room to speed up",
      message: `${(avgTime * 1000).toFixed(0)}ms is a solid start. Focus on anticipating tiles rather than reacting to them.`,
      color: "#f59e0b",
    };
  return {
    emoji: "◎",
    title: "Consistent pace",
    message: `${(avgTime * 1000).toFixed(0)}ms average reaction — steady and reliable. Push for sub-500ms to reach the next tier.`,
    color: "#6366f1",
  };
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const ms = (payload[0].value * 1000).toFixed(0);
  return (
    <div className="bg-base-100 border border-base-300 rounded-2xl shadow-2xl p-4 text-sm min-w-[150px]">
      <p className="text-xs uppercase tracking-widest text-base-content/40 font-semibold mb-2">
        {label}
      </p>
      <div className="flex items-center justify-between gap-4">
        <span className="flex items-center gap-1.5 text-base-content/70">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ background: payload[0].stroke }}
          />
          Reaction
        </span>
        <span
          className="font-bold tabular-nums"
          style={{ color: payload[0].stroke }}
        >
          {ms}ms
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

export default function ReactionTimeStat({ user }) {
  const [reactionData, setReactionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [gridSize, setGridSize] = useState("all");
  const [gameMode, setGameMode] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("UniversalGameStats")
          .select("game_summary, created_at, difficulty, grid_size, game_mode")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });
        if (error) throw error;

        const parsed = data
          .map((row) => {
            const clicks = row.game_summary?.clicks || [];
            if (!clicks.length) return null;
            const avgTime =
              clicks.reduce((s, c) => s + c.timeTakenMs, 0) /
              clicks.length /
              1000;
            return {
              created_at: row.created_at,
              difficulty: row.difficulty,
              grid_size: row.grid_size,
              game_mode: row.game_mode,
              avgTime,
            };
          })
          .filter(Boolean);

        setReactionData(parsed);
      } catch {
        setError("Unable to fetch reaction time data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const difficultyOptions = [
    "all",
    ...new Set(reactionData.map((d) => d.difficulty)),
  ];
  const gridOptions = [
    "all",
    ...Array.from(new Set(reactionData.map((d) => d.grid_size))).sort(
      (a, b) => a - b,
    ),
  ];
  const gameModeOptions = [
    "all",
    ...Array.from(new Set(reactionData.map((d) => d.game_mode))).filter(
      Boolean,
    ),
  ];

  const filteredData = useMemo(() => {
    const now = Date.now();
    return reactionData.filter((row) => {
      const diff = now - new Date(row.created_at).getTime();
      return (
        (difficulty === "all" || row.difficulty === difficulty) &&
        (gridSize === "all" || row.grid_size === parseInt(gridSize, 10)) &&
        (gameMode === "all" || row.game_mode === gameMode) &&
        (filter === "all" ||
          (filter === "week" && diff <= 7 * 86400000) ||
          (filter === "month" && diff <= 30 * 86400000))
      );
    });
  }, [reactionData, filter, difficulty, gridSize, gameMode]);

  const chartData = useMemo(
    () =>
      filteredData.map((d) => ({
        displayDate: new Date(d.created_at).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        avgTime: d.avgTime,
      })),
    [filteredData],
  );

  const averageTime = useMemo(
    () =>
      filteredData.length
        ? filteredData.reduce((s, d) => s + d.avgTime, 0) / filteredData.length
        : 0,
    [filteredData],
  );

  const trend = useMemo(() => {
    if (filteredData.length < 2) return 0;
    const first = filteredData[0].avgTime;
    const last = filteredData[filteredData.length - 1].avgTime;
    return first === 0 ? last * 100 : ((last - first) / first) * 100;
  }, [filteredData]);

  const best = useMemo(
    () =>
      filteredData.length ? Math.min(...filteredData.map((d) => d.avgTime)) : 0,
    [filteredData],
  );
  const worst = useMemo(
    () =>
      filteredData.length ? Math.max(...filteredData.map((d) => d.avgTime)) : 0,
    [filteredData],
  );

  const isFaster = trend <= 0;
  const lineColor =
    averageTime < 0.5 ? "#10b981" : averageTime < 1.0 ? "#6366f1" : "#f59e0b";
  const insight = getReactionInsight(averageTime, trend, filteredData.length);

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
              Average Reaction Time
            </h2>
            <p className="text-xs text-base-content/40 mt-0.5">
              Per-click average across all sessions
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
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

        {/* ── Filter panel ── */}
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
        ) : filteredData.length > 0 ? (
          <div className="flex flex-wrap items-end gap-6">
            <div>
              {/* Show both ms and seconds */}
              <div
                className="text-5xl font-bold tabular-nums tracking-tight"
                style={{ color: lineColor }}
              >
                {(averageTime * 1000).toFixed(0)}
                <span className="text-2xl font-semibold ml-1 opacity-60">
                  ms
                </span>
              </div>
              <div className="text-sm text-base-content/30 mt-0.5 tabular-nums">
                = {averageTime.toFixed(3)}s per click
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
                  label: "Best",
                  value: `${(best * 1000).toFixed(0)}ms`,
                  color: "#10b981",
                },
                {
                  label: "Worst",
                  value: `${(worst * 1000).toFixed(0)}ms`,
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
        {!loading && !error && filteredData.length > 0 && (
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
        ) : filteredData.length > 0 ? (
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="reactionGrad" x1="0" y1="0" x2="0" y2="1">
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
                  tickFormatter={(v) => `${(v * 1000).toFixed(0)}ms`}
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
                  dataKey="avgTime"
                  stroke={lineColor}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0, fill: lineColor }}
                  fill="url(#reactionGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {/* ── Footer ── */}
        {filteredData.length > 0 && (
          <div className="flex items-center justify-between text-xs text-base-content/25 pt-1 border-t border-base-300">
            <span>Per-click avg · lower is better</span>
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
