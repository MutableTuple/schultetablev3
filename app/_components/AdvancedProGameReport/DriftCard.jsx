"use client";
import React, { useMemo } from "react";
import { LuClock, LuLock } from "react-icons/lu";
import { TbTrendingUp, TbTrendingDown, TbMinus } from "react-icons/tb";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

// ─── helpers ──────────────────────────────────────────────────────────────────

function getVerdict(rate) {
  if (rate == null || isNaN(rate)) return null;
  if (rate >= 0.5)
    return {
      label: "Warming up strongly",
      color: "var(--success)",
      bg: "bg-success/15",
      text: "text-success",
      border: "border-success/30",
    };
  if (rate > 0.05)
    return {
      label: "Slight positive drift",
      color: "var(--success)",
      bg: "bg-success/10",
      text: "text-success",
      border: "border-success/20",
    };
  if (rate >= -0.05)
    return {
      label: "Holding steady",
      color: "var(--muted-foreground)",
      bg: "bg-muted",
      text: "text-muted-foreground",
      border: "border-border",
    };
  if (rate >= -0.5)
    return {
      label: "Slight negative drift",
      color: "var(--warning)",
      bg: "bg-warning/15",
      text: "text-warning",
      border: "border-warning/30",
    };
  return {
    label: "Fading through the session",
    color: "var(--destructive)",
    bg: "bg-destructive/15",
    text: "text-destructive",
    border: "border-destructive/30",
  };
}

function getInsight(rate) {
  if (rate == null || isNaN(rate)) return null;
  if (rate >= 0.5) return "You improve noticeably as sessions progress.";
  if (rate > 0.05) return "Small positive momentum builds mid-session.";
  if (rate >= -0.05) return "Your pace remains stable throughout sessions.";
  if (rate >= -0.5) return "Slight slowdown appears later in sessions.";
  return "Clear end-of-session fatigue is present.";
}

// ─── tooltips ─────────────────────────────────────────────────────────────────

const ChartTooltip = ({ active, payload, unit = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="text-muted-foreground text-[10px] mb-0.5 uppercase tracking-widest font-semibold">
        Session {payload[0]?.payload?.session}
      </p>
      <p className="font-bold text-popover-foreground tabular-nums">
        {typeof payload[0].value === "number"
          ? payload[0].value.toFixed(1)
          : payload[0].value}
        {unit}
      </p>
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
        {payload[0].value.toFixed(1)}ms vs avg
      </p>
    </div>
  );
};

// ─── main ─────────────────────────────────────────────────────────────────────

function DriftCard({ intel, isPro }) {
  const locked = !isPro;
  const rate = intel?.drift_rate;

  const {
    verdict,
    insight,
    accentColor,
    isPositive,
    mergedData,
    deltaData,
    overallAvg,
  } = useMemo(() => {
    const verdict = getVerdict(rate);
    const insight = getInsight(rate);
    const accentColor = verdict?.color ?? "var(--success)";
    const isPositive = rate != null && rate >= 0;

    const sessionData = (intel?.game_by_game_avg || []).map((v, i) => ({
      session: i + 1,
      avg: parseFloat(v.toFixed(1)),
    }));
    const fastestData = (intel?.game_by_game_fastest || []).map((v, i) => ({
      session: i + 1,
      fastest: v,
    }));
    const mergedData = sessionData.map((d, i) => ({
      ...d,
      fastest: fastestData[i]?.fastest ?? null,
    }));

    const overallAvg = intel?.avg_reaction_last10 ?? 0;
    const deltaData = sessionData.map((d) => ({
      session: d.session,
      delta: parseFloat((d.avg - overallAvg).toFixed(1)),
    }));

    return {
      verdict,
      insight,
      accentColor,
      isPositive,
      mergedData,
      deltaData,
      overallAvg,
    };
  }, [intel, rate]);

  const TrendIcon = isPositive
    ? TbTrendingUp
    : rate < 0
      ? TbTrendingDown
      : TbMinus;
  const trendColor = isPositive ? "text-success" : "text-destructive";

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center">
            <LuClock className="w-3.5 h-3.5 text-background" />
          </span>
          <h3 className="text-sm font-semibold text-foreground">
            Drift Analysis
          </h3>
        </div>
        {verdict ? (
          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${verdict.bg} ${verdict.text} ${verdict.border}`}
          >
            {verdict.label}
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-border text-muted-foreground">
            <LuLock className="w-3 h-3" /> Pro
          </span>
        )}
      </div>

      {/* ── Big value ── */}
      <div className="px-5 pb-5">
        <div className="flex items-end gap-3">
          <span className="text-5xl font-bold text-foreground tabular-nums leading-none">
            {rate != null ? `${rate >= 0 ? "+" : ""}${rate.toFixed(2)}` : "—"}
          </span>
          <div className="mb-1">
            <span className="text-xs text-muted-foreground block">
              drift rate
            </span>
            {rate != null ? (
              <span
                className={`text-xs font-semibold flex items-center gap-0.5 ${trendColor}`}
              >
                <TrendIcon size={13} />
                {isPositive ? "improving" : "fading"}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                <LuLock className="w-3 h-3" /> Unlock Pro
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Area chart — avg reaction per session (empty when locked, since
          game_by_game_avg/fastest are already redacted server-side) ── */}
      {mergedData.length > 1 && (
        <div className="px-2 pb-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold px-3 mb-2">
            Avg reaction per session
          </p>
          <div style={{ height: 130 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={mergedData}
                margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="drift-avg-grad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={accentColor}
                      stopOpacity={0.18}
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
                  tickFormatter={(v) => `${v}ms`}
                />
                <Tooltip
                  content={<ChartTooltip unit="ms" />}
                  cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                />
                <ReferenceLine
                  y={overallAvg}
                  stroke="var(--border)"
                  strokeDasharray="4 4"
                  strokeWidth={1}
                />
                <Area
                  type="linear"
                  dataKey="avg"
                  stroke={accentColor}
                  strokeWidth={2}
                  fill="url(#drift-avg-grad)"
                  dot={false}
                  isAnimationActive={false}
                  activeDot={{ r: 4, fill: accentColor, strokeWidth: 0 }}
                />
                <Line
                  type="linear"
                  dataKey="fastest"
                  stroke="var(--muted-foreground)"
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                  activeDot={{
                    r: 3,
                    fill: "var(--muted-foreground)",
                    strokeWidth: 0,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[9px] text-muted-foreground/60 px-3 mt-1">
            — Avg reaction &nbsp;·&nbsp; — Best per session
          </p>
        </div>
      )}

      {/* ── Bar chart — delta from overall avg ── */}
      {deltaData.length > 1 && (
        <div className="px-2 pb-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold px-3 mb-2">
            Deviation from your overall avg
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
                      fill={d.delta <= 0 ? accentColor : "var(--destructive)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[9px] text-muted-foreground/60 px-3 mt-1">
            Green = faster than avg &nbsp;·&nbsp; Red = slower than avg
          </p>
        </div>
      )}

      {/* ── Metric row ── */}
      <div className="px-5 py-3 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            Avg Drift Rate
            <span
              title="Positive = you get slightly faster during a session."
              className="text-[10px] text-muted-foreground/50 cursor-help"
            >
              ⓘ
            </span>
          </span>
          {locked ? (
            <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
              <LuLock className="w-3 h-3" /> Pro
            </span>
          ) : (
            <span className="text-sm font-semibold text-foreground tabular-nums">
              {rate != null ? `${rate >= 0 ? "+" : ""}${rate.toFixed(2)}` : "—"}
            </span>
          )}
        </div>
      </div>

      {/* ── Insight banner ── */}
      {insight && verdict ? (
        <div
          className={`mx-4 mb-4 rounded-xl px-4 py-3 border ${verdict.bg} ${verdict.border}`}
        >
          <div className="flex items-start gap-2">
            <LuClock
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
      ) : (
        <div className="mx-4 mb-4 rounded-xl px-4 py-3 border border-primary/25 bg-primary/8">
          <div className="flex items-start gap-2">
            <LuLock className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-primary">
                Unlock full drift insights
              </p>
              <p className="text-[11px] leading-relaxed mt-0.5 text-muted-foreground">
                See your drift verdict, session-by-session reaction trend, and a
                personalized insight with Pro.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(DriftCard);
