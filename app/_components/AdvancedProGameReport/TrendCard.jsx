"use client";
import React, { useMemo } from "react";
import { LuTrendingUp, LuLock, LuZap, LuShield } from "react-icons/lu";
import { TbTrendingUp, TbTrendingDown } from "react-icons/tb";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

// ─── helpers ──────────────────────────────────────────────────────────────────
// success/warning/destructive for clear-good/mixed/clear-bad states.
// The two "one metric up, one down" trade-off states get `primary` (orange) —
// not good or bad news, just a directional pattern worth the brand accent's attention.

function getVerdict(reactionTrend, consistencyTrend, overallScore) {
  const bothImproving =
    reactionTrend === "improving" && consistencyTrend === "improving";
  const bothDeclining =
    reactionTrend === "declining" && consistencyTrend === "declining";
  const reactionUp = reactionTrend === "improving";
  const consistencyUp = consistencyTrend === "improving";

  if (bothImproving && overallScore >= 70)
    return {
      label: "On a strong upward trajectory",
      color: "var(--success)",
      bg: "bg-success/15",
      text: "text-success",
      border: "border-success/30",
    };
  if (bothImproving)
    return {
      label: "Improving across the board",
      color: "var(--success)",
      bg: "bg-success/10",
      text: "text-success",
      border: "border-success/20",
    };
  if (reactionUp && !consistencyUp)
    return {
      label: "Faster but less consistent",
      color: "var(--primary)",
      bg: "bg-primary/10",
      text: "text-primary",
      border: "border-primary/25",
    };
  if (!reactionUp && consistencyUp)
    return {
      label: "More consistent, not faster",
      color: "var(--primary)",
      bg: "bg-primary/10",
      text: "text-primary",
      border: "border-primary/25",
    };
  if (bothDeclining)
    return {
      label: "Trending downward",
      color: "var(--destructive)",
      bg: "bg-destructive/15",
      text: "text-destructive",
      border: "border-destructive/30",
    };
  return {
    label: "Mixed signals",
    color: "var(--warning)",
    bg: "bg-warning/15",
    text: "text-warning",
    border: "border-warning/30",
  };
}

function getInsight(reactionTrend, consistencyTrend) {
  const reactionUp = reactionTrend === "improving";
  const consistencyUp = consistencyTrend === "improving";
  const bothImproving = reactionUp && consistencyUp;
  const bothDeclining =
    reactionTrend === "declining" && consistencyTrend === "declining";
  if (bothImproving)
    return "Speed and consistency are both improving — keep the momentum going.";
  if (reactionUp && !consistencyUp)
    return "Speed is rising faster than rhythm — focus on spacing between clicks.";
  if (!reactionUp && consistencyUp)
    return "Rhythm is stabilising before speed catches up — a good sign.";
  if (bothDeclining)
    return "Recent performance has softened — rest or shorter sessions may help.";
  return "Trends are currently mixed — look for patterns in your best sessions.";
}

// ─── tooltips ─────────────────────────────────────────────────────────────────

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-xl shadow-lg px-3 py-2 text-xs space-y-1">
      <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-semibold mb-1">
        Session {payload[0]?.payload?.session}
      </p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: p.color }}
          />
          <span className="text-muted-foreground">{p.name}</span>
          <span className="font-bold text-popover-foreground tabular-nums ml-auto pl-3">
            {typeof p.value === "number" ? p.value.toFixed(1) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const DeltaTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="text-muted-foreground text-[10px] mb-0.5 uppercase tracking-widest font-semibold">
        Session {payload[0]?.payload?.session}
      </p>
      <p className="font-bold text-popover-foreground tabular-nums">
        {payload[0].value > 0 ? "+" : ""}
        {payload[0].value.toFixed(1)}ms vs baseline
      </p>
    </div>
  );
};

// ─── trend pill ───────────────────────────────────────────────────────────────
// value == null means the field was redacted server-side for a free user —
// show a neutral "unknown" state with a lock icon, not a fake red/declining
// arrow (the old version defaulted `improving` to false for null trends,
// which painted every locked pill red regardless of the real trend).

const TrendPill = React.memo(function TrendPill({
  label,
  value,
  icon: Icon,
  improving,
}) {
  const color =
    value == null
      ? "text-muted-foreground bg-muted border-border"
      : improving
        ? "text-success bg-success/10 border-success/20"
        : "text-destructive bg-destructive/10 border-destructive/20";
  const Arrow =
    value == null ? LuLock : improving ? TbTrendingUp : TbTrendingDown;
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${color}`}
    >
      <Icon size={13} className="shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest opacity-60">
          {label}
        </p>
        <p className="text-xs font-bold capitalize">{value ?? "—"}</p>
      </div>
      <Arrow size={14} className="shrink-0" />
    </div>
  );
});

// ─── main ─────────────────────────────────────────────────────────────────────

function TrendCard({ intel, isPro }) {
  const locked = !isPro;
  const overallScore = intel?.overall_trend_score ?? 0;

  const { verdict, insight, accentColor, stackedData, deltaData } =
    useMemo(() => {
      const verdict = getVerdict(
        intel?.reaction_trend,
        intel?.consistency_trend,
        intel?.overall_trend_score,
      );
      const insight = getInsight(
        intel?.reaction_trend,
        intel?.consistency_trend,
      );
      const accentColor = verdict?.color ?? "var(--success)";

      const reactionMax = Math.max(...(intel?.game_by_game_avg ?? [1]), 1);
      const stackedData = (intel?.game_by_game_avg ?? []).map((avg, i) => ({
        session: i + 1,
        reaction: parseFloat(avg.toFixed(1)),
        consistency: parseFloat(
          (intel?.game_by_game_consistency?.[i] ?? 0).toFixed(1),
        ),
        fastest: intel?.game_by_game_fastest?.[i] ?? null,
        reactionScore: parseFloat(
          Math.max(0, 100 - (avg / reactionMax) * 100).toFixed(1),
        ),
      }));

      const baseline = stackedData[0]?.reaction ?? 0;
      const deltaData = stackedData.map((d) => ({
        session: d.session,
        delta: parseFloat((baseline - d.reaction).toFixed(1)),
      }));

      return { verdict, insight, accentColor, stackedData, deltaData };
    }, [intel]);

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center">
            <LuTrendingUp className="w-3.5 h-3.5 text-background" />
          </span>
          <h3 className="text-sm font-semibold text-foreground">
            Performance Trends
          </h3>
        </div>
        {!locked && verdict && (
          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${verdict.bg} ${verdict.text} ${verdict.border}`}
          >
            {verdict.label}
          </span>
        )}
        {locked && (
          <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-border text-muted-foreground">
            <LuLock className="w-3 h-3" /> Pro
          </span>
        )}
      </div>

      {/* ── Big score ── */}
      <div className="px-5 pb-4">
        <div className="flex items-end gap-3">
          <span className="text-5xl font-bold text-foreground tabular-nums leading-none">
            {locked ? "—" : overallScore.toFixed(1)}
          </span>
          <div className="mb-1">
            <span className="text-xs text-muted-foreground block">
              overall trend score
            </span>
            {locked ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                <LuLock className="w-3 h-3" /> Unlock Pro
              </span>
            ) : (
              <span
                className={`text-xs font-semibold flex items-center gap-0.5 ${overallScore >= 0 ? "text-success" : "text-destructive"}`}
              >
                {overallScore >= 0 ? (
                  <TbTrendingUp size={13} />
                ) : (
                  <TbTrendingDown size={13} />
                )}
                {overallScore >= 0 ? "upward" : "downward"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Trend pills ── */}
      <div className="grid grid-cols-2 gap-2 px-5 pb-4">
        <TrendPill
          label="Reaction"
          value={intel?.reaction_trend}
          icon={LuZap}
          improving={intel?.reaction_trend === "improving"}
        />
        <TrendPill
          label="Consistency"
          value={intel?.consistency_trend}
          icon={LuShield}
          improving={intel?.consistency_trend === "improving"}
        />
      </div>

      {/* ── Stacked area chart — reaction + consistency ── */}
      {stackedData.length > 1 && (
        <div className="px-2 pb-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold px-3 mb-2">
            Reaction vs consistency per session
          </p>
          <div style={{ height: 150 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stackedData}
                margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="reaction-grad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--foreground)"
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--foreground)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient
                    id="consistency-grad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={accentColor}
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="100%"
                      stopColor={accentColor}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
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
                  tickFormatter={(v) => `#${v}`}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                />
                <Area
                  type="linear"
                  dataKey="reaction"
                  name="Reaction (ms)"
                  stroke="var(--foreground)"
                  strokeWidth={2}
                  fill="url(#reaction-grad)"
                  dot={false}
                  isAnimationActive={false}
                  activeDot={{
                    r: 4,
                    fill: "var(--foreground)",
                    strokeWidth: 0,
                  }}
                />
                <Area
                  type="linear"
                  dataKey="consistency"
                  name="Consistency"
                  stroke={accentColor}
                  strokeWidth={2}
                  fill="url(#consistency-grad)"
                  dot={false}
                  isAnimationActive={false}
                  activeDot={{ r: 4, fill: accentColor, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 px-3 mt-1">
            <span className="flex items-center gap-1 text-[9px] text-muted-foreground">
              <span className="w-2.5 h-0.5 bg-foreground rounded inline-block" />{" "}
              Reaction ms
            </span>
            <span className="flex items-center gap-1 text-[9px] text-muted-foreground">
              <span
                className="w-2.5 h-0.5 rounded inline-block"
                style={{ background: accentColor }}
              />{" "}
              Consistency
            </span>
          </div>
        </div>
      )}

      {/* ── Bar chart — improvement delta vs session 1 ── */}
      {deltaData.length > 1 && (
        <div className="px-2 pb-2 mt-1">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold px-3 mb-2">
            Speed gain vs session 1 baseline
          </p>
          <div style={{ height: 100 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={deltaData}
                margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
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
                  tickFormatter={(v) => `#${v}`}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}ms`}
                />
                <Tooltip
                  content={<DeltaTooltip />}
                  cursor={{ fill: "var(--muted)" }}
                />
                <ReferenceLine y={0} stroke="var(--border)" strokeWidth={1} />
                <Bar
                  dataKey="delta"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={18}
                  isAnimationActive={false}
                >
                  {deltaData.map((d, i) => (
                    <Cell
                      key={i}
                      fill={d.delta >= 0 ? accentColor : "var(--destructive)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[9px] text-muted-foreground/60 px-3 mt-1">
            Green = faster than first session &nbsp;·&nbsp; Red = slower
          </p>
        </div>
      )}

      {/* ── Metric rows ── */}
      <div className="px-5 py-3 border-t border-border space-y-0">
        {[
          {
            label: "Reaction Trend",
            value: intel?.reaction_trend,
            positive: intel?.reaction_trend === "improving",
          },
          {
            label: "Consistency Trend",
            value: intel?.consistency_trend,
            positive: intel?.consistency_trend === "improving",
          },
          {
            label: "Overall Trend Score",
            value: overallScore.toFixed(1),
            positive: overallScore >= 0,
          },
        ].map(({ label, value, positive }) => {
          const Arrow = positive ? TbTrendingUp : TbTrendingDown;
          const col = positive ? "text-success" : "text-destructive";
          return (
            <div
              key={label}
              className="flex items-center justify-between py-2.5 border-b border-border last:border-0"
            >
              <span className="text-sm text-muted-foreground">{label}</span>
              {locked ? (
                <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                  <LuLock className="w-3 h-3" /> Pro
                </span>
              ) : (
                <span
                  className={`flex items-center gap-1 text-sm font-semibold capitalize ${col}`}
                >
                  <Arrow size={13} /> {value ?? "—"}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Insight banner ── */}
      {!locked && verdict ? (
        <div
          className={`mx-4 mb-4 rounded-xl px-4 py-3 border ${verdict.bg} ${verdict.border}`}
        >
          <div className="flex items-start gap-2">
            <LuTrendingUp
              className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${verdict.text}`}
            />
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold ${verdict.text}`}>
                {verdict.label}
              </p>
              <p
                className={`text-[11px] leading-relaxed mt-0.5 ${verdict.text} opacity-80`}
              >
                {insight}
              </p>
            </div>
          </div>
        </div>
      ) : locked ? (
        <div className="mx-4 mb-4 rounded-xl px-4 py-3 border border-primary/25 bg-primary/8">
          <div className="flex items-start gap-2">
            <LuLock className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-primary">
                Unlock full trend insights
              </p>
              <p className="text-[11px] leading-relaxed mt-0.5 text-muted-foreground">
                See your trend verdict, session-by-session reaction &amp;
                consistency charts, and a personalized insight with Pro.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default React.memo(TrendCard);
