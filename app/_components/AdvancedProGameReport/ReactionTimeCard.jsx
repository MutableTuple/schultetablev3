"use client";
import React, { useState, useMemo } from "react";
import { LuZap, LuInfo } from "react-icons/lu";
import {
  TbTrendingUp,
  TbTrendingDown,
  TbMinus,
  TbX,
  TbBolt,
  TbBrain,
  TbTargetArrow,
} from "react-icons/tb";
import { BsLightningCharge } from "react-icons/bs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─── helpers ──────────────────────────────────────────────────────────────────

function getVerdict(ms) {
  if (ms == null || isNaN(ms)) return null;
  if (ms < 180) return { text: "Elite", level: "good" };
  if (ms < 220) return { text: "Sharp", level: "good" };
  if (ms < 260) return { text: "Above Average", level: "good" };
  if (ms < 320) return { text: "Average", level: "neutral" };
  return { text: "Below Average", level: "bad" };
}

function getTrend(change) {
  if (change == null) return null;
  if (change < -3)
    return { text: "Improving", level: "good", Icon: TbTrendingUp };
  if (change > 3)
    return { text: "Declining", level: "bad", Icon: TbTrendingDown };
  return { text: "Steady", level: "neutral", Icon: TbMinus };
}

function getInsight(intel) {
  const avg = intel?.avg_reaction_last10;
  const change = intel?.avg_change;
  const slowest = intel?.slowest_last10;
  const fastest = intel?.fastest_last10;
  if (avg == null) return null;
  if (change != null) {
    if (change > 10)
      return `Your last 10 games dipped — you're taking ${change.toFixed(0)}% longer than earlier sessions. Rest or warm up more.`;
    if (change > 3)
      return `Slightly slower than your earlier baseline. Try focusing on breathing between clicks.`;
    if (change < -10)
      return `You're reacting ${Math.abs(change).toFixed(0)}% faster than before. Outstanding momentum.`;
    if (change < -3)
      return `Marginally quicker than your previous sessions — consistency is building.`;
  }
  if (fastest != null && slowest != null) {
    const spread = slowest - fastest;
    if (spread > 200)
      return `There's a ${Math.round(spread)}ms gap between your fastest and slowest. High variance suggests fatigue.`;
    if (spread > 120)
      return `Reactions vary by ~${Math.round(spread)}ms — tighten that window with short daily drills.`;
  }
  if (avg > 320)
    return `Reaction speed can improve. Daily 5-minute focused sessions compound fast.`;
  if (avg < 200)
    return `Exceptional reaction speed. You're operating at a competitive level.`;
  return `Solid and steady performance. Maintain your current routine.`;
}

// ─── badge ────────────────────────────────────────────────────────────────────

function badgeCls(level) {
  if (level === "good")
    return "bg-success/10 text-success border border-success/20";
  if (level === "bad")
    return "bg-destructive/10 text-destructive border border-destructive/20";
  return "bg-muted text-muted-foreground border border-border";
}

// ─── custom line dot ──────────────────────────────────────────────────────────

function CustomDot({ cx, cy, index, payload, totalCount }) {
  if (!cx || !cy) return null;
  const isLast = index === totalCount - 1;

  if (!isLast) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={3}
        fill="var(--foreground)"
        stroke="var(--card)"
        strokeWidth={1.5}
      />
    );
  }

  const label = String(payload.ms);
  const pillW = label.length * 7.5 + 18;

  return (
    <g>
      <rect
        x={cx - pillW / 2}
        y={cy - 30}
        width={pillW}
        height={20}
        rx={6}
        fill="var(--foreground)"
      />
      <text
        x={cx}
        y={cy - 16}
        textAnchor="middle"
        fill="var(--background)"
        fontSize={11}
        fontWeight={700}
      >
        {label}
      </text>
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill="var(--card)"
        stroke="var(--foreground)"
        strokeWidth={2}
      />
    </g>
  );
}

// ─── tooltip ──────────────────────────────────────────────────────────────────

function ChartTip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-foreground text-background text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-lg">
      {payload[0].value}ms
    </div>
  );
}

// ─── modal ────────────────────────────────────────────────────────────────────

function ReactionModal({ intel, series, verdict, insight, onClose }) {
  const avg = Math.round(intel.avg_reaction_last10);
  const fastest = intel.fastest_last10;
  const slowest = intel.slowest_last10;
  const spread = slowest && fastest ? Math.round(slowest - fastest) : null;

  const bestIdx = series.length
    ? series.reduce((bi, d, i, arr) => (d.ms < arr[bi].ms ? i : bi), 0)
    : -1;

  const avgPct =
    fastest && slowest
      ? Math.round(((avg - fastest) / (slowest - fastest || 1)) * 100)
      : 0;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg bg-card text-card-foreground rounded-t-2xl sm:rounded-2xl border border-border shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-foreground flex items-center justify-center shrink-0">
              <BsLightningCharge size={14} className="text-background" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                Reaction Time — Deep Dive
              </p>
              <p className="text-[10px] text-muted-foreground">
                Last 10 sessions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors shrink-0"
          >
            <TbX size={15} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 flex flex-col gap-5">
          {/* Big value + verdict */}
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-1">
                10-game avg
              </p>
              <p className="text-5xl font-bold text-foreground tabular-nums leading-none">
                {avg}
                <span className="text-xl font-semibold text-muted-foreground ml-1">
                  ms
                </span>
              </p>
            </div>
            {verdict && (
              <span
                className={`text-xs font-bold px-3 py-1.5 rounded-xl shrink-0 ${badgeCls(verdict.level)}`}
              >
                {verdict.text}
              </span>
            )}
          </div>

          {/* Stat strip */}
          <div className="grid grid-cols-3 border border-border rounded-xl overflow-hidden">
            {[
              {
                label: "Fastest",
                value: fastest ? `${Math.round(fastest)}ms` : "—",
              },
              { label: "Average", value: `${avg}ms` },
              {
                label: "Slowest",
                value: slowest ? `${Math.round(slowest)}ms` : "—",
              },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`px-3 py-3 bg-muted ${i < 2 ? "border-r border-border" : ""}`}
              >
                <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-widest mb-0.5">
                  {s.label}
                </p>
                <p className="text-sm font-bold text-foreground tabular-nums">
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* Bar chart */}
          {series.length > 0 && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-3">
                Reaction per session
              </p>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={series}
                    margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                    barCategoryGap="30%"
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="game"
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
                      content={<ChartTip />}
                      cursor={{ fill: "var(--muted)" }}
                    />
                    <Bar dataKey="ms" radius={[4, 4, 0, 0]} maxBarSize={22}>
                      {series.map((_, i) => (
                        <Cell
                          key={i}
                          fill={
                            i === bestIdx ? "var(--foreground)" : "var(--muted)"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5">
                Dark bar = personal best session
              </p>
            </div>
          )}

          {/* Speed range */}
          {spread != null && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-3">
                Speed range
              </p>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground w-14 text-right shrink-0">
                  {Math.round(fastest)}ms
                </span>
                <div className="flex-1 h-2.5 rounded-full bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 rounded-full bg-foreground" />
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-background"
                    style={{ left: `${Math.min(98, avgPct)}%` }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground w-14 shrink-0">
                  {Math.round(slowest)}ms
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
                {spread}ms spread · avg at {avgPct}% of range
              </p>
            </div>
          )}

          {/* Insight */}
          {insight && (
            <div className="bg-foreground rounded-xl px-4 py-3 flex items-start gap-3">
              <TbBolt size={14} className="text-background mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-background mb-0.5">
                  What this means
                </p>
                <p className="text-[11px] text-background/70 leading-relaxed">
                  {insight}
                </p>
              </div>
            </div>
          )}

          {/* How to improve */}
          <div className="bg-muted border border-border rounded-xl px-4 py-3 flex items-start gap-3">
            <TbBrain
              size={14}
              className="text-muted-foreground mt-0.5 shrink-0"
            />
            <div>
              <p className="text-xs font-semibold text-foreground mb-0.5">
                How to improve
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                3–5 focused sessions per week beats longer infrequent ones. Warm
                up with 2–3 light games. Sleep and hydration affect baseline
                speed by 5–15%.
              </p>
            </div>
          </div>

          {/* vs baseline */}
          {intel.avg_change != null && (
            <div className="bg-muted border border-border rounded-xl px-4 py-3 flex items-start gap-3">
              <TbTargetArrow
                size={14}
                className="text-muted-foreground mt-0.5 shrink-0"
              />
              <div>
                <p className="text-xs font-semibold text-foreground mb-0.5">
                  vs your baseline
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  You're{" "}
                  {intel.avg_change > 0
                    ? `${intel.avg_change.toFixed(1)}% slower`
                    : `${Math.abs(intel.avg_change).toFixed(1)}% faster`}{" "}
                  than earlier sessions.{" "}
                  {intel.avg_change < -5
                    ? "Keep this momentum going."
                    : intel.avg_change > 5
                      ? "Focus on warm-ups to recover speed."
                      : "Small fluctuations are normal."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── main card ────────────────────────────────────────────────────────────────

export default function ReactionTimeCard({ intel, isPro }) {
  const [modalOpen, setModalOpen] = useState(false);

  const { avg, verdict, trend, insight, series } = useMemo(() => {
    const avg = Math.round(intel?.avg_reaction_last10 ?? 0);
    return {
      avg,
      verdict: getVerdict(avg),
      trend: getTrend(intel?.avg_change),
      insight: getInsight(intel),
      series: (intel?.game_by_game_avg || []).map((v, i) => ({
        game: i + 1,
        ms: Math.round(v),
      })),
    };
  }, [intel]);

  const TrendIcon = trend?.Icon ?? TbMinus;

  return (
    <>
      <div className="bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row gap-5">
        {/* ── Left column ── */}
        <div className="sm:w-48 shrink-0 flex flex-col gap-2.5">
          {/* Title row */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <LuZap size={13} className="text-primary fill-primary" />
            </div>
            <span className="text-sm font-bold text-foreground">
              Reaction Speed
            </span>
            <LuInfo
              size={13}
              className="text-muted-foreground cursor-pointer shrink-0"
            />
          </div>

          {/* Big value */}
          <div className="leading-none">
            <span className="text-[2.6rem] font-extrabold text-foreground tabular-nums">
              {avg}
            </span>
            <span className="text-lg font-semibold text-muted-foreground ml-1.5">
              ms
            </span>
          </div>

          {/* Verdict badge */}
          {verdict && (
            <span
              className={`self-start text-xs font-bold px-2.5 py-1 rounded-lg ${badgeCls(verdict.level)}`}
            >
              {verdict.text}
            </span>
          )}

          {/* Description */}
          <p className="text-xs text-muted-foreground leading-relaxed">
            Measures how quickly you react after seeing the target.
          </p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Lower is better.
            <br />
            Under 200ms is elite.
          </p>

          {/* Deep dive button */}
          <button
            onClick={() => setModalOpen(true)}
            className="self-start mt-auto text-[11px] font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            Deep dive <TbTrendingUp size={11} />
          </button>
        </div>

        {/* ── Right column ── */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Chart header */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-muted-foreground">
              Last 10 Games
            </span>
            {trend && (
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${badgeCls(trend.level)}`}
              >
                <TrendIcon size={12} />
                {trend.text}
              </span>
            )}
          </div>

          {/* Line chart */}
          <div className="flex-1 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={series}
                margin={{ top: 30, right: 16, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="var(--border)"
                  strokeDasharray="0"
                  vertical={false}
                />
                <XAxis
                  dataKey="game"
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  width={36}
                />
                <Tooltip
                  content={<ChartTip />}
                  cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                />
                <Line
                  type="linear"
                  dataKey="ms"
                  stroke="var(--foreground)"
                  strokeWidth={2}
                  dot={({ key, ...dotProps }) => (
                    <CustomDot
                      key={key}
                      {...dotProps}
                      totalCount={series.length}
                    />
                  )}
                  activeDot={false}
                  isAnimationActive
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {modalOpen && (
        <ReactionModal
          intel={intel}
          series={series}
          verdict={verdict}
          insight={insight}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
