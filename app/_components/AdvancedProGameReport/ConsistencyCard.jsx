"use client";
import React, { useMemo } from "react";
import { LuTarget, LuLock } from "react-icons/lu";
import { TbTrendingUp, TbTrendingDown, TbMinus } from "react-icons/tb";
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

function getVerdict(score) {
  if (score == null || isNaN(score)) return null;
  if (score >= 90)
    return {
      label: "Machine-like consistency",
      color: "var(--success)",
      bg: "bg-success/15",
      text: "text-success",
      border: "border-success/30",
    };
  if (score >= 75)
    return {
      label: "Very consistent",
      color: "var(--success)",
      bg: "bg-success/10",
      text: "text-success",
      border: "border-success/20",
    };
  if (score >= 55)
    return {
      label: "Moderately consistent",
      color: "var(--muted-foreground)",
      bg: "bg-muted",
      text: "text-muted-foreground",
      border: "border-border",
    };
  if (score >= 35)
    return {
      label: "Inconsistent timing",
      color: "var(--warning)",
      bg: "bg-warning/15",
      text: "text-warning",
      border: "border-warning/30",
    };
  return {
    label: "Highly erratic",
    color: "var(--destructive)",
    bg: "bg-destructive/15",
    text: "text-destructive",
    border: "border-destructive/30",
  };
}

function getInsight(intel) {
  const score = intel?.avg_consistency_last10;
  const change = intel?.consistency_change;
  const pct = intel?.percentile;
  if (score == null || isNaN(score)) return null;
  if (change != null) {
    if (change < -10)
      return "Your recent timing became more erratic than earlier sessions.";
    if (change < -3) return "Slightly less consistent than before.";
    if (change > 10)
      return "Your rhythm has improved strongly in recent games.";
    if (change > 3) return "A small but real rhythm improvement is visible.";
  }
  if (pct != null) {
    if (pct >= 90)
      return "You rank among the most consistent players globally.";
    if (pct >= 70) return "You are above average for steady timing.";
    if (pct < 30) return "Your timing varies more than most players.";
  }
  if (score >= 90) return "Near-perfect consistency.";
  if (score >= 75) return "Strong stable rhythm overall.";
  if (score >= 55) return "Decent timing with some fluctuations.";
  if (score >= 35) return "Noticeable timing inconsistency.";
  return "High timing variance detected.";
}

// ─── tooltip ──────────────────────────────────────────────────────────────────

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

// ─── metric row ───────────────────────────────────────────────────────────────

const MetricRow = React.memo(function MetricRow({
  label,
  value,
  tip,
  positive,
  locked,
  highlight,
}) {
  const TrendIcon =
    positive === true
      ? TbTrendingUp
      : positive === false
        ? TbTrendingDown
        : TbMinus;
  const trendColor =
    positive === true
      ? "text-success"
      : positive === false
        ? "text-destructive"
        : "text-muted-foreground";

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <div className="flex items-center gap-1.5">
        <span className="text-sm text-muted-foreground">{label}</span>
        {tip && (
          <span
            title={tip}
            className="text-[10px] text-muted-foreground/50 cursor-help"
          >
            ⓘ
          </span>
        )}
      </div>
      {locked ? (
        <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
          <LuLock className="w-3 h-3" /> Pro
        </span>
      ) : (
        <div className="flex items-center gap-1.5">
          {positive !== undefined && (
            <TrendIcon size={13} className={trendColor} />
          )}
          <span
            className={`text-sm font-semibold tabular-nums ${highlight ? "text-foreground" : "text-foreground/70"}`}
          >
            {value}
          </span>
        </div>
      )}
    </div>
  );
});

// ─── main component ───────────────────────────────────────────────────────────

function ConsistencyCard({ intel, isPro }) {
  const locked = !isPro;

  const { verdict, insight, consistencyData, avgConsistency } = useMemo(() => {
    // No `?? 0` fallback — a fake "0" reads as real (if bad) data. `null`
    // means "we have nothing," and every render path below treats that
    // explicitly instead of accidentally showing a number.
    const avgConsistency = intel?.avg_consistency_last10 ?? null;
    return {
      verdict: getVerdict(avgConsistency),
      insight: getInsight(intel),
      consistencyData: (intel?.game_by_game_consistency || []).map((v, i) => ({
        session: i + 1,
        value: parseFloat(v.toFixed(1)),
      })),
      avgConsistency,
    };
  }, [intel]);

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center">
            <LuTarget className="w-3.5 h-3.5 text-background" />
          </span>
          <h3 className="text-sm font-semibold text-foreground">Consistency</h3>
        </div>
        {isPro && verdict ? (
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
      <div className="px-5 pb-4">
        {isPro && avgConsistency != null ? (
          <div className="flex items-end gap-3">
            <span className="text-5xl font-bold text-foreground tabular-nums leading-none">
              {Math.round(avgConsistency)}
            </span>
            <div className="mb-1">
              <span className="text-xs text-muted-foreground block">
                consistency score
              </span>
              {intel?.consistency_change != null && (
                <span
                  className={`text-xs font-semibold flex items-center gap-0.5 ${intel.consistency_change >= 0 ? "text-success" : "text-destructive"}`}
                >
                  {intel.consistency_change >= 0 ? (
                    <TbTrendingUp size={13} />
                  ) : (
                    <TbTrendingDown size={13} />
                  )}
                  {intel.consistency_change > 0 ? "+" : ""}
                  {intel.consistency_change.toFixed(1)}%
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-end gap-3">
            <span className="text-5xl font-bold text-foreground/25 tabular-nums leading-none select-none">
              --
            </span>
            <div className="mb-1">
              <span className="text-xs text-muted-foreground block">
                consistency score
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-primary mt-0.5">
                <LuLock className="w-3 h-3" /> Unlock Pro
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Area chart — consistency over sessions (naturally empty when
          locked, since game_by_game_consistency is redacted server-side) ── */}
      {consistencyData.length > 1 && (
        <div className="px-2 pb-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold px-3 mb-2">
            Consistency per session
          </p>
          <div style={{ height: 120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={consistencyData}
                margin={{ top: 4, right: 8, left: -24, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="cons-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={verdict?.color ?? "var(--success)"}
                      stopOpacity={0.18}
                    />
                    <stop
                      offset="100%"
                      stopColor={verdict?.color ?? "var(--success)"}
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
                  dataKey="value"
                  stroke={verdict?.color ?? "var(--success)"}
                  strokeWidth={2}
                  fill="url(#cons-grad)"
                  dot={false}
                  isAnimationActive={false}
                  activeDot={{
                    r: 4,
                    fill: verdict?.color ?? "var(--success)",
                    strokeWidth: 0,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Bar chart — per-session deviation (same guard as above) ── */}
      {consistencyData.length > 1 && (
        <div className="px-2 pb-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold px-3 mb-2">
            Variance per session
          </p>
          <div style={{ height: 100 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={consistencyData}
                margin={{ top: 4, right: 8, left: -24, bottom: 0 }}
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
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: "var(--muted)" }}
                />
                <ReferenceLine
                  y={avgConsistency ?? 0}
                  stroke="var(--border)"
                  strokeDasharray="4 4"
                  strokeWidth={1}
                />
                <Bar
                  dataKey="value"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={18}
                  isAnimationActive={false}
                >
                  {consistencyData.map((d, i) => (
                    <Cell
                      key={i}
                      fill={
                        d.value < (avgConsistency ?? 0)
                          ? (verdict?.color ?? "var(--success)")
                          : "var(--muted)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Metrics ── */}
      <div className="px-5 pt-1 pb-2">
        <MetricRow
          label="Avg Consistency"
          value={avgConsistency != null ? `${Math.round(avgConsistency)}` : "—"}
          tip="Higher = more stable timing."
          locked={locked}
          highlight
        />
        <MetricRow
          label="Global Percentile"
          value={
            intel?.percentile != null ? `${intel.percentile.toFixed(1)}%` : "—"
          }
          tip="Where you rank among all players."
          locked={locked}
          highlight
        />
        {intel?.consistency_change != null && (
          <MetricRow
            label="Consistency Trend"
            value={`${intel.consistency_change > 0 ? "+" : ""}${intel.consistency_change.toFixed(1)}%`}
            tip="Higher = more stable than before."
            positive={intel.consistency_change >= 0}
            locked={locked}
          />
        )}
      </div>

      {/* ── Insight banner ── */}
      {isPro && insight && verdict ? (
        <div
          className={`mx-4 mb-4 rounded-xl px-4 py-3 border ${verdict.bg} ${verdict.border}`}
        >
          <div className="flex items-start gap-2">
            <LuTarget
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
                Unlock full insights
              </p>
              <p className="text-[11px] leading-relaxed mt-0.5 text-muted-foreground">
                See your consistency verdict, session-by-session variance
                charts, and a personalized insight with Pro.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(ConsistencyCard);
