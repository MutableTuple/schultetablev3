"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { formatNumber } from "@/app/_utils/formatNumber";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/app/_lib/supabase";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { RiGamepadLine } from "react-icons/ri";
import {
  BsTrophy,
  BsLightningCharge,
  BsCheckCircle,
  BsXCircle,
  BsClock,
  BsArrowUpShort,
  BsArrowDownShort,
  BsX,
  BsLockFill,
} from "react-icons/bs";
import { TbTargetArrow, TbStar } from "react-icons/tb";
import { HiSparkles } from "react-icons/hi2";

// ─── helpers ────────────────────────────────────────────────────────────────

function getTrend(data, key) {
  if (!data || data.length < 4) return null;
  const half = Math.floor(data.length / 2);
  const first =
    data.slice(0, half).reduce((s, d) => s + (d[key] || 0), 0) / half;
  const second =
    data.slice(half).reduce((s, d) => s + (d[key] || 0), 0) /
    (data.length - half);
  const pct = first === 0 ? 0 : ((second - first) / first) * 100;
  return { pct: Math.abs(pct).toFixed(1), up: second >= first };
}

// For some metrics "up" is bad (wrong clicks, reaction time)
function trendColor(up, higherIsBad = false) {
  const positive = higherIsBad ? !up : up;
  return positive
    ? { bg: "bg-success/10", text: "text-success", dot: "var(--success)" }
    : {
        bg: "bg-destructive/10",
        text: "text-destructive",
        dot: "var(--destructive)",
      };
}

// ─── sparkline ──────────────────────────────────────────────────────────────

const Sparkline = React.memo(function Sparkline({
  data,
  dataKey,
  color = "var(--foreground)",
}) {
  if (!data?.length) return null;
  const gradientId = `spark-${dataKey}`;
  return (
    <ResponsiveContainer width="100%" height={38}>
      <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="linear"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#${gradientId})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
});

// ─── modal tooltip ──────────────────────────────────────────────────────────

const ModalTooltip = ({ active, payload, label, unit }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border shadow-lg p-3 min-w-[130px] rounded-lg">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
        {label}
      </p>
      <p className="text-sm font-bold text-popover-foreground tabular-nums">
        {payload[0].value}
        {unit}
      </p>
    </div>
  );
};

// ─── metric modal ───────────────────────────────────────────────────────────

function MetricModal({ stat, onClose }) {
  if (!stat) return null;
  const { label, value, sub, Icon, sparkData, sparkKey, unit, higherIsBad } =
    stat;
  const trend = getTrend(sparkData, sparkKey);
  const colors = trend ? trendColor(trend.up, higherIsBad) : null;
  const lineColor = colors ? colors.dot : "var(--foreground)";

  const vals = (sparkData || []).map((d) => d[sparkKey] || 0).filter(Boolean);
  const peak = vals.length ? Math.max(...vals) : null;
  const low = vals.length ? Math.min(...vals) : null;
  const avg = vals.length
    ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-card text-card-foreground border border-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-start justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-foreground text-background flex items-center justify-center">
              <Icon size={15} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-foreground">{label}</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
          >
            <BsX size={16} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Big value + trend */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-1">
                Current
              </p>
              <p className="text-4xl font-bold text-foreground tabular-nums">
                {value}
              </p>
            </div>
            {trend && colors && (
              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg ${colors.bg}`}
              >
                {trend.up ? (
                  <BsArrowUpShort size={16} className={colors.text} />
                ) : (
                  <BsArrowDownShort size={16} className={colors.text} />
                )}
                <span className={`text-xs font-bold ${colors.text}`}>
                  {trend.pct}%
                </span>
              </div>
            )}
          </div>

          {/* Mini stat strip */}
          {vals.length > 0 && (
            <div className="grid grid-cols-3 divide-x divide-border border border-border rounded-xl overflow-hidden">
              {[
                { label: "Peak", value: `${peak}${unit}` },
                { label: "Avg", value: `${avg}${unit}` },
                { label: "Low", value: `${low}${unit}` },
              ].map((s) => (
                <div
                  key={s.label}
                  className="px-3 py-2.5 bg-muted flex flex-col gap-0.5"
                >
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                    {s.label}
                  </span>
                  <span className="text-sm font-bold text-foreground tabular-nums">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Full chart */}
          {sparkData?.length > 1 && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-3">
                Trend over sessions
              </p>
              <div style={{ height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={sparkData}
                    margin={{ top: 4, right: 8, left: -24, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="i"
                      tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `#${v + 1}`}
                    />
                    <YAxis
                      tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={<ModalTooltip unit={unit} />}
                      cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                    />
                    <Line
                      type="linear"
                      dataKey={sparkKey}
                      stroke={lineColor}
                      strokeWidth={2}
                      dot={{ r: 3, fill: lineColor, strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: lineColor, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Insight line */}
          {trend && colors && (
            <div
              className={`rounded-xl px-4 py-3 flex items-center gap-2 ${colors.bg}`}
            >
              <span className="text-base">
                {trend.up === !higherIsBad ? "📈" : "📉"}
              </span>
              <p className={`text-xs font-medium ${colors.text}`}>
                {trend.up === !higherIsBad
                  ? `Up ${trend.pct}% vs earlier sessions — keep going.`
                  : `Down ${trend.pct}% vs earlier sessions — room to improve.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── stat card ───────────────────────────────────────────────────────────────

const StatCard = React.memo(function StatCard({ stat, onOpen }) {
  const {
    label,
    value,
    sub,
    Icon,
    loading,
    sparkData,
    sparkKey,
    higherIsBad,
    locked,
  } = stat;

  // Locked card — no number shown, links straight to the upgrade page instead
  // of opening a modal that would have nothing real to show anyway.
  if (locked) {
    return (
      <a
        href="/get-pro"
        className="relative bg-card border border-border rounded-2xl p-5 flex flex-col gap-2 overflow-hidden group hover:border-primary/40 hover:shadow-sm transition-all duration-200 text-left w-full"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
            {label}
          </span>
          <span className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/15 group-hover:text-primary transition-all duration-200">
            <Icon size={13} />
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-sm font-semibold text-primary mt-1">
          <BsLockFill size={12} />
          Unlock Pro
        </div>

        <div className="flex items-center gap-1.5 mt-auto">
          <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
          <span className="text-[10px] text-muted-foreground">{sub}</span>
        </div>
      </a>
    );
  }

  const trend = getTrend(sparkData, sparkKey);
  const colors = trend ? trendColor(trend.up, higherIsBad) : null;
  const sparkColor = colors ? colors.dot : "var(--foreground)";

  return (
    <button
      onClick={() => onOpen(stat)}
      className="relative bg-card border border-border rounded-2xl p-5 flex flex-col gap-2 overflow-hidden group hover:border-foreground/30 hover:shadow-sm transition-all duration-200 text-left w-full cursor-pointer"
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
          {label}
        </span>
        <span className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-foreground group-hover:text-background transition-all duration-200">
          <Icon size={13} />
        </span>
      </div>

      {/* Value row */}
      <div className="flex items-end justify-between gap-2">
        <div className="text-2xl font-bold tabular-nums text-foreground">
          {loading ? (
            <span className="loading loading-ring loading-sm text-muted-foreground" />
          ) : (
            value
          )}
        </div>
        {trend && colors && (
          <div
            className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md mb-0.5 ${colors.bg}`}
          >
            {trend.up ? (
              <BsArrowUpShort size={13} className={colors.text} />
            ) : (
              <BsArrowDownShort size={13} className={colors.text} />
            )}
            <span className={`text-[10px] font-bold ${colors.text}`}>
              {trend.pct}%
            </span>
          </div>
        )}
      </div>

      {/* Sparkline */}
      {sparkData?.length > 1 && (
        <div className="w-full -mx-1">
          <Sparkline data={sparkData} dataKey={sparkKey} color={sparkColor} />
        </div>
      )}

      {/* Sub */}
      <div className="flex items-center gap-1.5 mt-auto">
        <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
        <span className="text-[10px] text-muted-foreground">{sub}</span>
      </div>
    </button>
  );
});

// ─── main export ─────────────────────────────────────────────────────────────

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
  const [activeModal, setActiveModal] = useState(null);
  const isProUser = user?.is_pro_user === true;

  // Skip the rank fetch entirely for free users — this stops the app's own
  // code from requesting/holding the real rank client-side, but note this
  // is a client-side mitigation only. If `get_user_rank` itself doesn't
  // check pro status server-side, a free user could still call this same
  // RPC directly from the console with their own session.
  useEffect(() => {
    if (!user?.id || !isProUser) return;
    let cancelled = false;
    const fetchRank = async () => {
      const { data, error } = await supabase.rpc("get_user_rank", {
        uid: user.id,
      });
      if (!cancelled && !error && data[0]?.rank) setLatestRank(data[0].rank);
    };
    fetchRank();
    return () => {
      cancelled = true;
    };
  }, [user?.id, isProUser]);

  const sparkSessions = useMemo(
    () =>
      (gameData || [])
        .slice()
        .reverse()
        .map((g, i) => ({
          i,
          accuracy: parseFloat(g?.game_summary?.accuracy || 0),
          reaction: g?.game_summary?.avgReactionTimeMs || 0,
          score: g?.score || 0,
          right: g?.game_summary?.rightClicks || 0,
          wrong: g?.game_summary?.wrongClicks || 0,
          duration: g?.game_summary?.durationMs || 0,
        })),
    [gameData],
  );

  const isDataMissing =
    totalGames == null ||
    totalScore == null ||
    totalRightClicks == null ||
    totalWrongClicks == null ||
    avgAccuracy == null ||
    avgDuration == null ||
    avgReactionTime == null;

  const STATS = useMemo(
    () => [
      {
        label: "Games Played",
        value: totalGames,
        sub: gameData?.[0]?.created_at
          ? `Last played ${formatDistanceToNow(new Date(gameData[0].created_at), { addSuffix: true })}`
          : "No sessions yet",
        Icon: RiGamepadLine,
        sparkData: sparkSessions,
        sparkKey: "score",
        unit: "",
        higherIsBad: false,
      },
      {
        label: "Total Score",
        value: formatNumber(totalScore),
        sub: "All-time performance",
        Icon: TbStar,
        sparkData: sparkSessions,
        sparkKey: "score",
        unit: "",
        higherIsBad: false,
      },
      {
        label: "Current Rank",
        value: isProUser ? (latestRank ?? "—") : null,
        sub: "See where you stand globally",
        Icon: BsTrophy,
        loading: isProUser && latestRank == null,
        locked: !isProUser,
        sparkData: [],
        sparkKey: "score",
        unit: "",
        higherIsBad: true,
      },
      {
        label: "Right Clicks",
        value: formatNumber(totalRightClicks),
        sub: "Across all sessions",
        Icon: BsCheckCircle,
        sparkData: sparkSessions,
        sparkKey: "right",
        unit: "",
        higherIsBad: false,
      },
      {
        label: "Wrong Clicks",
        value: formatNumber(totalWrongClicks),
        sub: "Mistakes made",
        Icon: BsXCircle,
        sparkData: sparkSessions,
        sparkKey: "wrong",
        unit: "",
        higherIsBad: true,
      },
      {
        label: "Avg Accuracy",
        value: isProUser ? formatPercent(avgAccuracy) : null,
        sub: "Across all games",
        Icon: TbTargetArrow,
        locked: !isProUser,
        sparkData: sparkSessions,
        sparkKey: "accuracy",
        unit: "%",
        higherIsBad: false,
      },
      {
        label: "Avg Finish Time",
        value: isProUser ? formatMs(avgDuration) : null,
        sub: "Full grid average",
        Icon: BsClock,
        locked: !isProUser,
        sparkData: sparkSessions,
        sparkKey: "duration",
        unit: "ms",
        higherIsBad: true,
      },
      {
        label: "Avg Reaction",
        value: isProUser ? formatMs(avgReactionTime) : null,
        sub: "Between tiles",
        Icon: BsLightningCharge,
        locked: !isProUser,
        sparkData: sparkSessions,
        sparkKey: "reaction",
        unit: "ms",
        higherIsBad: true,
      },
    ],
    [
      totalGames,
      gameData,
      totalScore,
      totalRightClicks,
      totalWrongClicks,
      avgAccuracy,
      avgDuration,
      avgReactionTime,
      latestRank,
      isProUser,
      sparkSessions,
      formatMs,
      formatPercent,
    ],
  );

  const closeModal = useCallback(() => setActiveModal(null), []);

  return (
    <>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-foreground tracking-tight">
              Advanced Analytics
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your performance breakdown
            </p>
          </div>
          {!isProUser && (
            <a
              href="/get-pro"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 text-xs text-foreground font-medium"
            >
              <HiSparkles size={11} />
              Upgrade to PRO
            </a>
          )}
        </div>

        {/* Free tier notice */}
        {!isProUser && (
          <div className="rounded-xl border border-border bg-muted px-4 py-3 flex items-center gap-3">
            <TbStar size={16} className="text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Viewing stats from{" "}
              <strong className="text-foreground">today's games</strong> only,
              with rank &amp; averages locked.{" "}
              <a
                href="/get-pro"
                className="text-primary font-semibold underline underline-offset-2"
              >
                Upgrade to PRO
              </a>{" "}
              to unlock full history &amp; deeper insights.
            </p>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="loading loading-spinner loading-lg text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Crunching your stats...
            </span>
          </div>
        ) : isDataMissing ? (
          <div className="rounded-2xl border border-border bg-muted p-10 flex flex-col items-center gap-3 text-center">
            <RiGamepadLine size={28} className="text-muted-foreground/50" />
            <p className="text-sm font-medium text-foreground">
              Not enough data yet
            </p>
            <p className="text-xs text-muted-foreground">
              Play a few games to start seeing your analytics here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {STATS.map((s) => (
              <StatCard key={s.label} stat={s} onOpen={setActiveModal} />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {activeModal && <MetricModal stat={activeModal} onClose={closeModal} />}
    </>
  );
}
