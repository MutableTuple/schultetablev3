"use client";
import React, { useMemo } from "react";
import { LuActivity, LuLock, LuInfo } from "react-icons/lu";
import { TbTrendingUp, TbTrendingDown, TbMinus } from "react-icons/tb";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

// ─── helpers ──────────────────────────────────────────────────────────────────

function fmt(ms) {
  return `${Math.round(ms)}ms`;
}

function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function trendColor(t) {
  if (t === "improving")
    return {
      text: "text-success",
      bg: "bg-success/10",
      border: "border-success/20",
    };
  if (t === "declining")
    return {
      text: "text-destructive",
      bg: "bg-destructive/10",
      border: "border-destructive/20",
    };
  return {
    text: "text-muted-foreground",
    bg: "bg-muted",
    border: "border-border",
  };
}

const TrendBadge = React.memo(function TrendBadge({ trend }) {
  const c = trendColor(trend);
  const Icon =
    trend === "improving"
      ? TbTrendingUp
      : trend === "declining"
        ? TbTrendingDown
        : TbMinus;
  return (
    <span
      className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${c.bg} ${c.text} ${c.border}`}
    >
      <Icon size={10} />
      {trend === "improving" ? "▲" : trend === "declining" ? "▼" : "•"}
    </span>
  );
});

const MiniBar = React.memo(function MiniBar({
  value,
  max,
  color = "var(--success)",
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-14 h-1.5 bg-muted rounded-full overflow-hidden flex-shrink-0">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-[11px] tabular-nums text-foreground/80">
        {Math.round(value)}
      </span>
    </div>
  );
});

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-xl shadow-lg px-3 py-2 text-xs space-y-1">
      <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-semibold mb-1">
        Session #{payload[0]?.payload?.session}
      </p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: p.color }}
          />
          <span className="text-muted-foreground">{p.name}</span>
          <span className="font-bold text-popover-foreground tabular-nums ml-auto pl-3">
            {Math.round(p.value)}
            {p.name.includes("RT") ? "ms" : ""}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── main ─────────────────────────────────────────────────────────────────────

function GameTable({ intel, isPro }) {
  const {
    games,
    overallTrend,
    bestIdx,
    worstAvgIdx,
    mean,
    outlierIdx,
    avgWithoutOutlier,
    chartData,
    maxAvg,
    maxCons,
  } = useMemo(() => {
    const games = (intel.game_by_game_avg ?? []).map((avg, i) => {
      const prev = intel.game_by_game_avg[i - 1];
      const trend =
        prev === undefined
          ? "same"
          : avg < prev
            ? "improving"
            : avg > prev
              ? "declining"
              : "same";
      return {
        index: i + 1,
        avg,
        fastest: intel.game_by_game_fastest?.[i],
        consistency: intel.game_by_game_consistency?.[i] ?? 0,
        date: intel.game_dates?.[i],
        trend,
      };
    });

    // Overall short-term trend (first vs last)
    const first = intel.game_by_game_avg?.[0];
    const last = intel.game_by_game_avg?.[intel.game_by_game_avg.length - 1];
    const diffPct = first && last ? (last - first) / first : 0;
    const overallTrend =
      diffPct < -0.03 ? "improving" : diffPct > 0.03 ? "declining" : "same";

    // Best / worst by fastest tile
    const fastestAll = intel.game_by_game_fastest ?? [];
    const bestIdx = fastestAll.indexOf(Math.min(...fastestAll));
    const worstAvgIdx = intel.game_by_game_avg?.indexOf(
      Math.max(...(intel.game_by_game_avg ?? [])),
    );

    // Outlier detection — session whose avg is >1.5 std devs above mean
    const avgAll = intel.game_by_game_avg ?? [];
    const mean = avgAll.reduce((a, b) => a + b, 0) / (avgAll.length || 1);
    const std = Math.sqrt(
      avgAll.reduce((a, b) => a + (b - mean) ** 2, 0) / (avgAll.length || 1),
    );
    const outlierIdx = avgAll.findIndex((v) => Math.abs(v - mean) > 1.5 * std);
    const avgWithoutOutlier =
      outlierIdx >= 0
        ? avgAll.filter((_, i) => i !== outlierIdx).reduce((a, b) => a + b, 0) /
          (avgAll.length - 1)
        : null;

    const chartData = games.map((g) => ({
      session: g.index,
      avg: Math.round(g.avg),
      fastest: g.fastest,
      consistency: Math.round(g.consistency),
    }));

    const maxAvg = Math.max(...(intel.game_by_game_avg ?? [1]));
    const maxCons = Math.max(...(intel.game_by_game_consistency ?? [1]));

    return {
      games,
      overallTrend,
      bestIdx,
      worstAvgIdx,
      mean,
      outlierIdx,
      avgWithoutOutlier,
      chartData,
      maxAvg,
      maxCons,
    };
  }, [intel]);

  const oc = trendColor(overallTrend);
  const longTermColor = trendColor(intel.reaction_trend);

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center">
            <LuActivity className="w-3.5 h-3.5 text-background" />
          </span>
          <h3 className="text-sm font-semibold text-foreground">
            Game-by-Game Breakdown
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${oc.bg} ${oc.text} ${oc.border}`}
          >
            Short-term: {overallTrend}
          </span>
          <span
            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${longTermColor.bg} ${longTermColor.text} ${longTermColor.border}`}
          >
            Long-term: {intel.reaction_trend ?? "stable"}
          </span>
        </div>
      </div>

      {/* ── Summary stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 bg-muted border-b border-border">
        {[
          {
            label: "Best tile",
            value: fmt(intel.fastest_last10 ?? 0),
            sub: `Session #${bestIdx + 1}`,
            color: "text-success",
          },
          {
            label: "Slowest avg",
            value: fmt(maxAvg),
            sub: `Session #${worstAvgIdx + 1}`,
            color: "text-destructive",
          },
          {
            label: "Avg (last 10)",
            value: fmt(intel.avg_reaction_last10 ?? 0),
            sub: "across all sessions",
            color: "text-foreground",
          },
          {
            label: "Δ Change",
            value: `${intel.avg_change >= 0 ? "+" : ""}${intel.avg_change?.toFixed(1)}ms`,
            sub: "vs previous 10",
            color: intel.avg_change < 0 ? "text-success" : "text-destructive",
          },
        ].map(({ label, value, sub, color }) => (
          <div
            key={label}
            className="bg-card rounded-xl border border-border px-3 py-2.5"
          >
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
              {label}
            </p>
            <p
              className={`text-lg font-bold tabular-nums leading-tight mt-0.5 ${color}`}
            >
              {value}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Area chart ── */}
      {chartData.length > 1 && (
        <div className="px-2 pt-4 pb-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold px-3 mb-2">
            Avg reaction trend
          </p>
          <div style={{ height: 130 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gt-avg" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--foreground)"
                      stopOpacity={0.18}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--foreground)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="gt-fast" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--success)"
                      stopOpacity={0.15}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--success)"
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
                  content={<ChartTooltip />}
                  cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                />
                <ReferenceLine
                  y={Math.round(mean)}
                  stroke="var(--border)"
                  strokeDasharray="4 4"
                  strokeWidth={1}
                />
                <Area
                  type="linear"
                  dataKey="avg"
                  name="Avg RT"
                  stroke="var(--foreground)"
                  strokeWidth={2}
                  fill="url(#gt-avg)"
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
                  dataKey="fastest"
                  name="Fastest"
                  stroke="var(--success)"
                  strokeWidth={1.5}
                  fill="url(#gt-fast)"
                  dot={false}
                  isAnimationActive={false}
                  activeDot={{ r: 3, fill: "var(--success)", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 px-3 mt-1">
            <span className="flex items-center gap-1 text-[9px] text-muted-foreground">
              <span className="w-2.5 h-0.5 bg-foreground rounded inline-block" />{" "}
              Avg RT
            </span>
            <span className="flex items-center gap-1 text-[9px] text-muted-foreground">
              <span className="w-2.5 h-0.5 bg-success rounded inline-block" />{" "}
              Fastest tile
            </span>
            <span className="flex items-center gap-1 text-[9px] text-muted-foreground">
              <span className="w-2.5 h-px bg-muted-foreground rounded inline-block border-dashed" />{" "}
              Overall avg
            </span>
          </div>
        </div>
      )}

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-y border-border">
              {[
                "#",
                "Date",
                "Avg RT",
                "Best Tile",
                "Consistency",
                "vs Avg",
                "Trend",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-widest whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {games.map((g, i) => {
              const isBest = i === bestIdx;
              const isWorst = i === worstAvgIdx;
              const isOutlier = i === outlierIdx;
              const vsAvg = g.avg - mean;
              const rowBg = isBest
                ? "bg-success/10"
                : isWorst
                  ? "bg-destructive/8"
                  : "";

              return (
                <tr
                  key={i}
                  className={`border-b border-border last:border-0 transition-colors hover:bg-muted/50 ${rowBg}`}
                >
                  {/* # */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-foreground/80">
                        {g.index}
                      </span>
                      {isBest && (
                        <span className="text-[9px] bg-success/20 text-success px-1.5 py-0.5 rounded font-bold">
                          BEST
                        </span>
                      )}
                      {isOutlier && !isBest && (
                        <span className="text-[9px] bg-warning/20 text-warning px-1.5 py-0.5 rounded font-bold">
                          OUTLIER
                        </span>
                      )}
                    </div>
                  </td>
                  {/* Date */}
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {g.date ? fmtDate(g.date) : "—"}
                  </td>
                  {/* Avg RT */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {isPro ? (
                      <MiniBar
                        value={g.avg}
                        max={maxAvg}
                        color={
                          isWorst ? "var(--destructive)" : "var(--foreground)"
                        }
                      />
                    ) : (
                      <span className="blur-sm select-none text-xs text-muted-foreground/40">
                        •••
                      </span>
                    )}
                  </td>
                  {/* Fastest */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {isPro ? (
                      <span
                        className={`text-xs font-semibold tabular-nums ${isBest ? "text-success" : "text-foreground/80"}`}
                      >
                        {fmt(g.fastest)}
                      </span>
                    ) : (
                      <span className="blur-sm select-none text-xs text-muted-foreground/40">
                        •••
                      </span>
                    )}
                  </td>
                  {/* Consistency */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {isPro ? (
                      <MiniBar
                        value={g.consistency}
                        max={maxCons}
                        color={
                          g.consistency < mean * 0.7
                            ? "var(--success)"
                            : "var(--warning)"
                        }
                      />
                    ) : (
                      <LuLock className="w-3 h-3 text-muted-foreground/40" />
                    )}
                  </td>
                  {/* vs avg */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {isPro ? (
                      <span
                        className={`text-[11px] font-semibold tabular-nums ${vsAvg <= 0 ? "text-success" : "text-destructive"}`}
                      >
                        {vsAvg > 0 ? "+" : ""}
                        {Math.round(vsAvg)}ms
                      </span>
                    ) : (
                      <LuLock className="w-3 h-3 text-muted-foreground/40" />
                    )}
                  </td>
                  {/* Trend */}
                  <td className="px-4 py-3">
                    <TrendBadge trend={g.trend} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Footer insight ── */}
      <div className="px-5 py-3.5 bg-muted border-t border-border flex items-start gap-2">
        <LuInfo className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {outlierIdx >= 0 && avgWithoutOutlier != null ? (
            <>
              Session{" "}
              <span className="font-semibold text-foreground">
                #{outlierIdx + 1}
              </span>{" "}
              was an outlier. Excluding it, your true avg drops to{" "}
              <span className="font-semibold text-foreground">
                {fmt(avgWithoutOutlier)}
              </span>
              . Focus on replicating sessions like{" "}
              <span className="font-semibold text-foreground">
                #{bestIdx + 1}
              </span>
              .
            </>
          ) : (
            <>
              Your sessions are consistent — no major outliers detected. Keep it
              up.
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default React.memo(GameTable);
