"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/app/_lib/supabase";
import AnalyticsData from "./AnalyticsData";
import GameChart from "./GameChart";
import ContributionHeatmap from "./ContributionHeatmap";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { RiDashboardLine, RiCalendarLine, RiCheckLine } from "react-icons/ri";
import {
  TbArrowUpRight,
  TbClock,
  TbRefresh,
  TbTargetArrow,
  TbChartBar,
  TbChartPie,
  TbLock,
} from "react-icons/tb";
import { BsCalendar3, BsLightningCharge } from "react-icons/bs";
import { HiSparkles } from "react-icons/hi2";
import { Loader2 } from "lucide-react";

// ─── constants ────────────────────────────────────────────────────────────────

const DATE_RANGES = [
  { value: "28d", label: "28 Days" },
  { value: "3m", label: "3 Months" },
  { value: "6m", label: "6 Months" },
  { value: "all", label: "All Time" },
  { value: "custom", label: "Custom" },
];

// ─── date helpers ─────────────────────────────────────────────────────────────

function getTodayRange() {
  const from = new Date();
  from.setHours(0, 0, 0, 0);
  const to = new Date();
  to.setHours(23, 59, 59, 999);
  return { from, to };
}

// ─── tooltip components ───────────────────────────────────────────────────────

const BarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border shadow-lg rounded-xl p-3 min-w-[120px]">
      <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-sm font-bold text-popover-foreground tabular-nums">
        {payload[0].value}
      </p>
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border shadow-lg rounded-xl p-3">
      <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
        {payload[0].name}
      </p>
      <p className="text-sm font-bold text-popover-foreground tabular-nums">
        {payload[0].value.toLocaleString()}
      </p>
      <p className="text-[10px] text-muted-foreground">
        {payload[0].payload.pct}%
      </p>
    </div>
  );
};

// ─── locked placeholder — dashed hatch + lock icon, no derived numbers ────────

function LockedBlock({ height = 160, label = "Requires a Pro subscription" }) {
  return (
    <div
      className="rounded-xl border border-dashed border-border flex flex-col items-center justify-center gap-1.5 text-center px-4"
      style={{
        height,
        backgroundImage:
          "repeating-linear-gradient(135deg, var(--muted) 0px, var(--muted) 1px, transparent 1px, transparent 10px)",
      }}
    >
      <TbLock size={18} className="text-muted-foreground" />
      <p className="text-xs font-semibold text-foreground">Pro feature</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <a
        href="/get-pro"
        className="text-[11px] font-semibold text-primary hover:underline mt-0.5"
      >
        Unlock with Pro
      </a>
    </div>
  );
}

function LockedChartCard({ title, subtitle, Icon, height = 160 }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-muted-foreground" />
        <div>
          <h3 className="text-sm font-bold text-foreground">{title}</h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
      </div>
      <LockedBlock height={height} />
    </div>
  );
}

// ─── score bar chart ──────────────────────────────────────────────────────────

function ScoreBarChart({ gameData }) {
  const data = (gameData || [])
    .slice()
    .reverse()
    .slice(-12)
    .map((g, i) => ({
      session: `#${i + 1}`,
      score: g?.score || 0,
    }));

  const max = Math.max(...data.map((d) => d.score), 0);

  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <TbChartBar size={14} className="text-muted-foreground" />
            <h3 className="text-sm font-bold text-foreground">
              Score per Session
            </h3>
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Last {data.length} games
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold">
            Peak
          </p>
          <p className="text-lg font-bold text-foreground tabular-nums">
            {max.toLocaleString()}
          </p>
        </div>
      </div>
      <div style={{ height: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
            barCategoryGap="30%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="session"
              tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<BarTooltip />}
              cursor={{ fill: "var(--muted)" }}
            />
            <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={28}>
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={
                    entry.score === max ? "var(--foreground)" : "var(--border)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── accuracy bar chart (Pro only) ─────────────────────────────────────────────

function AccuracyBarChart({ gameData }) {
  const data = (gameData || [])
    .slice()
    .reverse()
    .slice(-12)
    .map((g, i) => ({
      session: `#${i + 1}`,
      accuracy: parseFloat(g?.accuracy ?? g?.game_summary?.accuracy ?? 0),
    }));

  const avg = data.length
    ? (data.reduce((s, d) => s + d.accuracy, 0) / data.length).toFixed(1)
    : 0;

  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <TbTargetArrow size={14} className="text-muted-foreground" />
            <h3 className="text-sm font-bold text-foreground">
              Accuracy per Session
            </h3>
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Last {data.length} games
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold">
            Avg
          </p>
          <p className="text-lg font-bold text-foreground tabular-nums">
            {avg}%
          </p>
        </div>
      </div>
      <div style={{ height: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
            barCategoryGap="30%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="session"
              tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              content={<BarTooltip />}
              cursor={{ fill: "var(--muted)" }}
            />
            <Bar dataKey="accuracy" radius={[4, 4, 0, 0]} maxBarSize={28}>
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={
                    entry.accuracy >= 85
                      ? "var(--foreground)"
                      : entry.accuracy >= 70
                        ? "var(--muted-foreground)"
                        : "var(--border)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[9px] text-muted-foreground font-medium">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-foreground inline-block" />
          <span>≥85% excellent</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-muted-foreground inline-block" />
          <span>≥70% good</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-border inline-block" />
          <span>&lt;70% needs work</span>
        </div>
      </div>
    </div>
  );
}

// ─── clicks pie chart ─────────────────────────────────────────────────────────

function ClicksPieChart({ totalRightClicks, totalWrongClicks }) {
  const total = (totalRightClicks || 0) + (totalWrongClicks || 0);
  const rightPct =
    total > 0 ? ((totalRightClicks / total) * 100).toFixed(1) : 0;
  const wrongPct =
    total > 0 ? ((totalWrongClicks / total) * 100).toFixed(1) : 0;

  const pieData = [
    { name: "Correct", value: totalRightClicks || 0, pct: rightPct },
    { name: "Mistakes", value: totalWrongClicks || 0, pct: wrongPct },
  ];

  const COLORS = ["var(--success)", "var(--destructive)"];

  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <TbChartPie size={14} className="text-muted-foreground" />
        <div>
          <h3 className="text-sm font-bold text-foreground">Click Breakdown</h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            All-time accuracy split
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div style={{ width: 120, height: 120, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={34}
                outerRadius={54}
                dataKey="value"
                strokeWidth={0}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-3 flex-1 w-full">
          {pieData.map((d, i) => (
            <div key={d.name}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-sm inline-block"
                    style={{ background: COLORS[i] }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {d.name}
                  </span>
                </div>
                <span className="text-xs font-bold text-foreground tabular-nums">
                  {d.pct}%
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${d.pct}%`, background: COLORS[i] }}
                />
              </div>
            </div>
          ))}
          <p className="text-[10px] text-muted-foreground mt-1">
            {total.toLocaleString()} total clicks
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── reaction band chart (Pro only) ────────────────────────────────────────────

function ReactionBandChart({ gameData }) {
  const sessions = (gameData || [])
    .map((g) => g?.avg_reaction_ms ?? g?.game_summary?.avgReactionTimeMs ?? 0)
    .filter(Boolean);
  const bands = [
    { label: "<300ms", range: [0, 300], fill: "var(--foreground)" },
    {
      label: "300–500ms",
      range: [300, 500],
      fill: "color-mix(in srgb, var(--foreground) 70%, transparent)",
    },
    {
      label: "500–700ms",
      range: [500, 700],
      fill: "color-mix(in srgb, var(--foreground) 40%, transparent)",
    },
    { label: ">700ms", range: [700, Infinity], fill: "var(--border)" },
  ].map((b) => ({
    ...b,
    count: sessions.filter((v) => v >= b.range[0] && v < b.range[1]).length,
  }));

  const maxCount = Math.max(...bands.map((b) => b.count), 1);

  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <BsLightningCharge size={13} className="text-muted-foreground" />
        <div>
          <h3 className="text-sm font-bold text-foreground">
            Reaction Speed Bands
          </h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            How often you hit each speed tier
          </p>
        </div>
      </div>
      <div className="space-y-2.5">
        {bands.map((b) => (
          <div key={b.label} className="flex items-center gap-3">
            <span className="text-[10px] text-muted-foreground font-medium w-20 shrink-0">
              {b.label}
            </span>
            <div className="flex-1 h-6 bg-muted rounded-lg overflow-hidden relative">
              <div
                className="h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-2"
                style={{
                  width: `${(b.count / maxCount) * 100}%`,
                  background: b.fill,
                  minWidth: b.count > 0 ? "2rem" : 0,
                }}
              />
            </div>
            <span className="text-xs font-bold text-foreground tabular-nums w-6 text-right shrink-0">
              {b.count}
            </span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground">
        Dark = faster · Light = slower
      </p>
    </div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function AdvancedAnalyticsPage({ user }) {
  const isPro = user?.is_pro_user === true;

  const [gameData, setGameData] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("28d");
  const [customRange, setCustomRange] = useState({ from: null, to: null });
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const formatMs = (ms) => `${(ms / 1000).toFixed(2)}s`;
  const formatPercent = (value) =>
    typeof value === "string" ? value : `${value.toFixed(1)}%`;

  async function fetchGameData() {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);

    // Free tier is locked to today only, regardless of dateRange/customRange
    // state — those controls aren't even rendered for free users (see below),
    // but the fetch enforces it independently so it can't drift out of sync.
    let from = null,
      to = null;
    if (!isPro) {
      ({ from, to } = getTodayRange());
    } else {
      const now = new Date();
      switch (dateRange) {
        case "28d":
          from = new Date();
          from.setDate(now.getDate() - 28);
          break;
        case "3m":
          from = new Date();
          from.setMonth(now.getMonth() - 3);
          break;
        case "6m":
          from = new Date();
          from.setMonth(now.getMonth() - 6);
          break;
        case "custom":
          from = customRange.from;
          to = customRange.to;
          break;
      }
    }

    let gamesQuery = supabase
      .from("UniversalGameStats")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (from) gamesQuery = gamesQuery.gte("created_at", from.toISOString());
    if (to) gamesQuery = gamesQuery.lte("created_at", to.toISOString());
    gamesQuery = isPro ? gamesQuery.range(0, 100) : gamesQuery.limit(50);

    // These two queries don't depend on each other — run them together
    // instead of waiting for one to finish before starting the next.
    // p_from/p_to are today-scoped for free users too, so the aggregate
    // stat cards can't show numbers wider than the game list underneath them.
    const [{ data: analyticsData }, { data: games }] = await Promise.all([
      supabase.rpc("get_user_analytics", {
        p_user_id: user.id,
        p_from: from ? from.toISOString() : null,
        p_to: to ? to.toISOString() : null,
      }),
      gamesQuery,
    ]);

    if (analyticsData?.length) setAnalytics(analyticsData[0]);
    setGameData(games || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchGameData();
  }, [user, dateRange, customRange]);

  const totalGames = analytics?.total_games || 0;
  const totalScore = analytics?.total_score || 0;
  const totalRightClicks = analytics?.total_right_clicks || 0;
  const totalWrongClicks = analytics?.total_wrong_clicks || 0;
  const avgAccuracy = analytics?.avg_accuracy || 0;
  const avgReactionTime = analytics?.avg_reaction_time || 0;
  const avgDuration = analytics?.avg_duration || 0;

  const customLabel =
    customRange.from && customRange.to
      ? `${customRange.from.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} – ${customRange.to.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}`
      : "Select dates";

  const rangeLabelMap = {
    "28d": "Last 28 Days",
    "3m": "Last 3 Months",
    "6m": "Last 6 Months",
    all: "All Time",
    custom: customLabel,
  };

  const activeRangeLabel = isPro ? rangeLabelMap[dateRange] : "Today";

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">
          Crunching your stats...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 space-y-6">
        {/* ── HEADER ────────────────────────────────────── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shrink-0">
              <RiDashboardLine size={16} />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Analytics
              </p>
              <h1 className="text-xl font-bold tracking-tight text-foreground leading-tight">
                Advanced Analytics
              </h1>
            </div>
          </div>

          {isPro ? (
            <div className="flex flex-wrap gap-2 shrink-0">
              {DATE_RANGES.map((range) => (
                <button
                  key={range.value}
                  onClick={() => {
                    setDateRange(range.value);
                    if (range.value !== "custom") setShowCustomPicker(false);
                    else setShowCustomPicker((v) => !v);
                  }}
                  className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200
                    ${
                      dateRange === range.value
                        ? "bg-[var(--ink)] text-background border-transparent"
                        : "bg-card text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
                    }`}
                >
                  {range.value === "custom" ? (
                    <span className="flex items-center gap-1">
                      <BsCalendar3 size={10} />
                      {range.label}
                    </span>
                  ) : (
                    range.label
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--ink)] text-background text-xs font-medium">
                <RiCalendarLine size={11} />
                Today
              </span>
              <a
                href="/get-pro"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-muted-foreground text-xs font-medium hover:border-foreground/30 hover:text-foreground transition-all"
              >
                <TbLock size={11} />
                Unlock full history
              </a>
            </div>
          )}
        </div>

        {/* ── CUSTOM DATE PICKER (Pro only) ────────────── */}
        {isPro && showCustomPicker && (
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <RiCalendarLine size={13} className="text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">
                Custom Range
              </h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "From", key: "from" },
                { label: "To", key: "to" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
                    {label}
                  </label>
                  <input
                    type="date"
                    className="w-full border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-ring bg-muted"
                    onChange={(e) =>
                      setCustomRange((prev) => ({
                        ...prev,
                        [key]: e.target.value ? new Date(e.target.value) : null,
                      }))
                    }
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <span className="text-xs text-muted-foreground">
                {customLabel}
              </span>
              <button
                onClick={() => {
                  fetchGameData();
                  setShowCustomPicker(false);
                }}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all"
              >
                <RiCheckLine size={12} /> Apply
              </button>
            </div>
          </div>
        )}

        {/* ── FREE PLAN BANNER ─────────────────────────── */}
        {!isPro && (
          <div className="bg-[var(--ink)] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <HiSparkles
                size={16}
                className="text-background/60 mt-0.5 shrink-0"
              />
              <div>
                <p className="text-sm font-semibold text-background">
                  Free Plan
                </p>
                <p className="text-xs text-background/60 mt-0.5 leading-relaxed">
                  Viewing{" "}
                  <span className="text-background/90 font-medium">
                    today's games
                  </span>{" "}
                  only, with score and click totals. Upgrade for full history,
                  accuracy trends, reaction analysis & activity insights.
                </p>
              </div>
            </div>
            <a
              href="/get-pro"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all shrink-0 whitespace-nowrap"
            >
              <TbArrowUpRight size={13} /> Upgrade to Pro
            </a>
          </div>
        )}

        {/* ── STAT CARDS ───────────────────────────────── */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <AnalyticsData
            user={user}
            loading={loading}
            totalGames={totalGames}
            gameData={gameData}
            totalScore={totalScore}
            totalRightClicks={totalRightClicks}
            totalWrongClicks={totalWrongClicks}
            avgAccuracy={avgAccuracy}
            avgDuration={avgDuration}
            avgReactionTime={avgReactionTime}
            formatMs={formatMs}
            formatPercent={formatPercent}
          />
        </div>

        {/* ── BENTO GRID: BAR CHARTS + PIE + REACTION ──── */}
        {/* Score + clicks stay free; accuracy + reaction bands are Pro-gated. */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <ScoreBarChart gameData={gameData} />
          </div>
          <div className="md:col-span-1">
            <ClicksPieChart
              totalRightClicks={totalRightClicks}
              totalWrongClicks={totalWrongClicks}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            {isPro ? (
              <ReactionBandChart gameData={gameData} />
            ) : (
              <LockedChartCard
                title="Reaction Speed Bands"
                subtitle="How often you hit each speed tier"
                Icon={BsLightningCharge}
                height={168}
              />
            )}
          </div>
          <div className="md:col-span-2">
            {isPro ? (
              <AccuracyBarChart gameData={gameData} />
            ) : (
              <LockedChartCard
                title="Accuracy per Session"
                subtitle="Track precision across sessions"
                Icon={TbTargetArrow}
                height={168}
              />
            )}
          </div>
        </div>

        {/* ── PERFORMANCE TREND CHARTS (Pro only) ──────── */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
            <div>
              <h2 className="text-sm font-bold text-foreground tracking-tight">
                Performance Trends
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Session-level breakdowns with trend detection
              </p>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
              <TbClock size={11} />
              {activeRangeLabel}
            </span>
          </div>
          {isPro ? (
            <GameChart
              gameData={gameData}
              totalRightClicks={totalRightClicks}
              totalWrongClicks={totalWrongClicks}
            />
          ) : (
            <LockedBlock
              height={220}
              label="Session-level trend detection is a Pro feature"
            />
          )}
        </div>

        {/* ── HEATMAP (Pro only) ───────────────────────── */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-foreground tracking-tight">
              Activity Heatmap
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Daily practice streaks at a glance.
            </p>
          </div>
          {isPro ? (
            <ContributionHeatmap user={user} />
          ) : (
            <LockedBlock
              height={140}
              label="Full activity history is a Pro feature"
            />
          )}
        </div>

        {/* ── FOOTER ───────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[10px] text-muted-foreground border-t border-border pt-5 gap-2">
          <span className="flex items-center gap-1.5">
            <RiCalendarLine size={11} />
            Showing:{" "}
            <span className="text-foreground font-semibold ml-1">
              {activeRangeLabel}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <TbRefresh size={11} />
            Refreshes on each visit
          </span>
        </div>
      </div>
    </div>
  );
}
