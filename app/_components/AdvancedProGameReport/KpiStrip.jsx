"use client";
import React, { useState, useEffect, useMemo } from "react";
import { LuZap, LuTarget, LuTrendingUp, LuShield } from "react-icons/lu";
import {
  TbLock,
  TbX,
  TbTrendingUp,
  TbTrendingDown,
  TbMinus,
  TbBrain,
  TbBolt,
  TbAward,
  TbChartBar,
} from "react-icons/tb";
import { BsArrowUpShort, BsArrowDownShort } from "react-icons/bs";
import {
  AreaChart,
  Area,
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
  RadialBarChart,
  RadialBar,
} from "recharts";

// ─── label helpers ─────────────────────────────────────────────────────────────

function reactionLabel(ms) {
  if (ms < 200) return { text: "Elite reflexes", up: true };
  if (ms < 260) return { text: "Above average", up: true };
  if (ms < 320) return { text: "Average range", up: null };
  return { text: "Needs work", up: false };
}
function percentileLabel(p) {
  if (p >= 90) return { text: "Top 10% globally", up: true };
  if (p >= 70) return { text: "Top 30% globally", up: true };
  if (p >= 50) return { text: "Above median", up: null };
  return { text: "Below median", up: false };
}
function stabilityLabel(s) {
  if (s >= 85) return { text: "Very consistent", up: true };
  if (s >= 65) return { text: "Mostly steady", up: true };
  if (s >= 45) return { text: "Some variance", up: null };
  return { text: "High inconsistency", up: false };
}
function trendLabel(t) {
  if (t >= 7) return { text: "Improving fast", up: true };
  if (t >= 4) return { text: "Steady progress", up: true };
  if (t >= 1) return { text: "Slight gains", up: null };
  if (t >= -1) return { text: "Plateauing", up: null };
  return { text: "Declining", up: false };
}

// success/destructive tokens instead of hardcoded dark-green/dark-red — adapts to light/dark automatically
function sentimentColors(up) {
  if (up === true)
    return {
      bg: "bg-success/15",
      text: "text-success",
      stroke: "var(--success)",
      fill: "var(--success)",
    };
  if (up === false)
    return {
      bg: "bg-destructive/15",
      text: "text-destructive",
      stroke: "var(--destructive)",
      fill: "var(--destructive)",
    };
  return {
    bg: "bg-muted",
    text: "text-muted-foreground",
    stroke: "var(--muted-foreground)",
    fill: "var(--muted-foreground)",
  };
}

// ─── insight generators — hoisted out of the component, pure functions of their args ──

function reactionInsights(ms) {
  const c = sentimentColors(ms < 260 ? true : ms < 320 ? null : false);
  return [
    {
      Icon: TbBolt,
      ...c,
      title:
        ms < 200
          ? "Elite-tier speed"
          : ms < 260
            ? "Solid reaction speed"
            : "Room to improve",
      body: `Your ${Math.round(ms)}ms avg puts you ${ms < 260 ? "ahead of most players" : "in the average range"}. Consistent practice under 200ms is the target.`,
    },
    {
      Icon: TbBrain,
      ...c,
      title: "What affects reaction time",
      body: "Sleep quality, hydration, and warm-up sessions each improve baseline speed by 5–15%. Try playing 3 quick games before your main session.",
    },
  ];
}
function percentileInsights(p) {
  const c = sentimentColors(p >= 70 ? true : p >= 50 ? null : false);
  return [
    {
      Icon: TbAward,
      ...c,
      title: p >= 70 ? "You're in the upper tier" : "Climbing the leaderboard",
      body: `You're faster than ${p?.toFixed(1)}% of all players. Each 10% jump requires roughly 2–3 weeks of focused daily play.`,
    },
  ];
}
function stabilityInsights(s) {
  const c = sentimentColors(s >= 65 ? true : s >= 45 ? null : false);
  return [
    {
      Icon: TbChartBar,
      ...c,
      title: s >= 65 ? "Consistent performer" : "High variance detected",
      body: `A score of ${s?.toFixed(1)}/100 means your timing ${s >= 65 ? "is reliably predictable under pressure" : "fluctuates significantly — focus on breathing and rhythm between clicks"}.`,
    },
  ];
}
function trendInsights(t) {
  const c = sentimentColors(t >= 4 ? true : t >= 0 ? null : false);
  return [
    {
      Icon: TbTrendingUp,
      ...c,
      title:
        t >= 4
          ? "Clear upward trajectory"
          : t >= 0
            ? "Holding steady"
            : "Downward trend detected",
      body:
        t >= 4
          ? `A trend of ${t?.toFixed(1)}/10 is strong. At this rate you'll break into the next percentile tier within 2 weeks.`
          : t >= 0
            ? "You're maintaining your level. Push for at least 4 sessions per week to start climbing."
            : "Decline can come from fatigue or inconsistency. Try shorter, more focused sessions daily.",
    },
  ];
}

// ─── tooltip ───────────────────────────────────────────────────────────────────

const ChartTooltip = ({ active, payload, label, unit = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-xl shadow-lg px-3 py-2 text-xs">
      {label && (
        <p className="text-muted-foreground mb-1 text-[10px] uppercase tracking-widest font-semibold">
          {label}
        </p>
      )}
      <p className="font-bold text-popover-foreground tabular-nums">
        {payload[0].value}
        {unit}
      </p>
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="text-muted-foreground text-[10px] mb-0.5">
        {payload[0].payload.name}
      </p>
      <p className="font-bold text-popover-foreground">
        {payload[0].value} sessions · {payload[0].payload.pct}%
      </p>
    </div>
  );
};

// ─── sparkline ─────────────────────────────────────────────────────────────────

const CardSparkline = React.memo(function CardSparkline({
  data,
  color,
  gradientId,
}) {
  if (!data?.length) return <div className="h-10" />;
  return (
    <div style={{ height: 44, width: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.18} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="linear"
            dataKey="v"
            stroke={color}
            strokeWidth={1.2}
            fill={`url(#${gradientId})`}
            dot={false}
            isAnimationActive={false}
            activeDot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

// ─── modal ─────────────────────────────────────────────────────────────────────

function KpiModal({ kpi, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const {
    label,
    value,
    badge,
    context,
    barPercent,
    modalCharts,
    Icon,
    deepInsights,
  } = kpi;
  const colors = sentimentColors(badge.up);
  const TrendIcon =
    badge.up === true
      ? TbTrendingUp
      : badge.up === false
        ? TbTrendingDown
        : TbMinus;

  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col bg-black/50"
      style={{ backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="mt-auto md:m-auto w-full md:max-w-xl bg-card text-card-foreground md:rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] md:max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-foreground text-background flex items-center justify-center shrink-0">
              <Icon size={15} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-foreground">{label}</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {context}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-all shrink-0"
          >
            <TbX size={16} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-1">
                Score
              </p>
              <p className="text-5xl font-bold text-foreground tabular-nums leading-none">
                {value}
              </p>
            </div>
            <div
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl ${colors.bg}`}
            >
              <TrendIcon size={14} className={colors.text} />
              <span className={`text-xs font-bold ${colors.text}`}>
                {badge.text}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                Performance
              </span>
              <span className="text-[10px] font-bold text-foreground">
                {barPercent.toFixed(0)}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(100, Math.max(0, barPercent))}%`,
                  background: colors.stroke,
                }}
              />
            </div>
          </div>

          {modalCharts?.map((chart, i) => (
            <div key={i}>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-3">
                {chart.title}
              </p>
              <div style={{ height: chart.height || 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  {chart.element}
                </ResponsiveContainer>
              </div>
            </div>
          ))}

          {deepInsights?.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                Insights
              </p>
              {deepInsights.map((ins, i) => (
                <div
                  key={i}
                  className={`rounded-xl px-4 py-3 flex items-start gap-2.5 ${ins.bg}`}
                >
                  <ins.Icon
                    size={14}
                    className={`${ins.text} mt-0.5 shrink-0`}
                  />
                  <div>
                    <p className={`text-xs font-semibold ${ins.text}`}>
                      {ins.title}
                    </p>
                    <p
                      className={`text-[11px] leading-relaxed mt-0.5 opacity-80 ${ins.text}`}
                    >
                      {ins.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── kpi card ───────────────────────────────────────────────────────────────────

const KpiCard = React.memo(function KpiCard({
  kpi,
  unlocked,
  onOpen,
  sparkColor,
  gradientId,
}) {
  const { Icon, label, value, badge, changeText, sparkData } = kpi;
  const ArrowIcon =
    badge.up === true
      ? BsArrowUpShort
      : badge.up === false
        ? BsArrowDownShort
        : TbMinus;
  const colors = sentimentColors(badge.up);

  return (
    <button
      onClick={unlocked ? () => onOpen(kpi) : undefined}
      className={`bg-card border border-border rounded-2xl p-4 flex flex-col gap-3 text-left w-full transition-all duration-200
        ${unlocked ? "hover:border-foreground/20 cursor-pointer" : "cursor-default opacity-70"}`}
    >
      {/* Icon + label */}
      <div className="flex items-center gap-2.5">
        <span className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center shrink-0">
          <Icon size={13} />
        </span>
        <span className="text-sm text-muted-foreground font-medium">
          {label}
        </span>
      </div>

      {/* Value + change */}
      <div>
        {unlocked ? (
          <>
            <p className="text-[26px] font-bold text-foreground tabular-nums leading-tight">
              {value}
            </p>
            <div
              className={`flex items-center gap-0.5 mt-1 text-[13px] font-semibold ${colors.text}`}
            >
              <ArrowIcon size={16} />
              <span>{changeText}</span>
            </div>
          </>
        ) : (
          <>
            <p
              className="text-[26px] font-bold text-muted-foreground/40 tabular-nums leading-tight select-none"
              style={{ filter: "blur(6px)" }}
            >
              ••••
            </p>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-muted-foreground">
              <TbLock size={11} /> Upgrade to Pro
            </div>
          </>
        )}
      </div>

      {/* Sparkline */}
      {unlocked ? (
        <CardSparkline
          data={sparkData}
          color={sparkColor}
          gradientId={gradientId}
        />
      ) : (
        <div className="h-10 bg-muted rounded-lg flex items-center justify-center">
          <TbLock size={14} className="text-muted-foreground/40" />
        </div>
      )}
    </button>
  );
});

// ─── main ──────────────────────────────────────────────────────────────────────

export default function KpiStrip({ intel, isPro }) {
  const [activeModal, setActiveModal] = useState(null);

  // everything derived from `intel` is built once here instead of on every render
  // (previously rebuilt on every modal open/close, since that state lives in this component)
  const kpis = useMemo(() => {
    const reactionSeries = (intel.game_by_game_avg || []).map((v, i) => ({
      i,
      v,
    }));
    const sessionScores = (intel.game_by_game_fastest || []).map((v, i) => ({
      i,
      v,
    }));

    const reactionChangePct = intel.avg_prev10
      ? ((Math.abs(intel.avg_change) / intel.avg_prev10) * 100).toFixed(1)
      : "0.0";

    const avgMs = reactionSeries.length
      ? Math.round(
          reactionSeries.reduce((a, b) => a + b.v, 0) / reactionSeries.length,
        )
      : 0;
    const stabilityData = (intel.game_by_game_avg || []).map((v, i) => ({
      i,
      v: Math.abs(v - avgMs),
    }));

    // single pass instead of 4 separate .filter() passes over the same array
    const bandCounts = { fast: 0, quick: 0, mid: 0, slow: 0 };
    (intel.game_by_game_fastest || []).forEach((v) => {
      if (v < 200) bandCounts.fast++;
      else if (v < 260) bandCounts.quick++;
      else if (v < 320) bandCounts.mid++;
      else bandCounts.slow++;
    });
    const totalBand =
      bandCounts.fast + bandCounts.quick + bandCounts.mid + bandCounts.slow;
    const pct = (n) => (totalBand ? ((n / totalBand) * 100).toFixed(0) : 0);
    const reactionBands = [
      {
        name: "<200ms",
        value: bandCounts.fast,
        pct: pct(bandCounts.fast),
        fill: "var(--foreground)",
      },
      {
        name: "200–260ms",
        value: bandCounts.quick,
        pct: pct(bandCounts.quick),
        fill: "color-mix(in oklab, var(--foreground) 70%, var(--muted))",
      },
      {
        name: "260–320ms",
        value: bandCounts.mid,
        pct: pct(bandCounts.mid),
        fill: "color-mix(in oklab, var(--foreground) 40%, var(--muted))",
      },
      {
        name: ">320ms",
        value: bandCounts.slow,
        pct: pct(bandCounts.slow),
        fill: "var(--muted)",
      },
    ].filter((b) => b.value > 0);

    const reactionBarData = reactionSeries.map((d) => ({
      session: `#${d.i + 1}`,
      ms: Math.round(d.v),
    }));
    // computed once, not inside the .map() that renders each Cell (was O(n^2))
    const minReactionMs = reactionBarData.length
      ? Math.min(...reactionBarData.map((r) => r.ms))
      : null;

    return [
      {
        Icon: LuZap,
        label: "Reaction Time",
        value: `${Math.round(intel.avg_reaction_last10)} ms`,
        badge: reactionLabel(intel.avg_reaction_last10),
        changeText: `${reactionChangePct}%`,
        context: "Time from stimulus to action. Under 200ms is competitive.",
        barPercent: Math.max(
          0,
          100 - ((intel.avg_reaction_last10 - 150) / 250) * 100,
        ),
        free: true,
        sparkData: reactionSeries,
        modalCharts: [
          {
            title: "Reaction time per session",
            height: 160,
            element: (
              <BarChart
                data={reactionBarData}
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
                  tickFormatter={(v) => `${v}ms`}
                />
                <Tooltip
                  content={<ChartTooltip unit="ms" />}
                  cursor={{ fill: "var(--muted)" }}
                />
                <Bar dataKey="ms" radius={[4, 4, 0, 0]} maxBarSize={22}>
                  {reactionBarData.map((d, i) => (
                    <Cell
                      key={i}
                      fill={
                        d.ms === minReactionMs
                          ? "var(--foreground)"
                          : "var(--muted)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            ),
          },
          reactionBands.length > 0 && {
            title: "Speed distribution",
            height: 160,
            element: (
              <PieChart>
                <Pie
                  data={reactionBands}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {reactionBands.map((b, i) => (
                    <Cell key={i} fill={b.fill} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            ),
          },
        ].filter(Boolean),
        deepInsights: reactionInsights(intel.avg_reaction_last10),
      },
      {
        Icon: LuTarget,
        label: "Accuracy",
        value: `${intel.percentile?.toFixed(1)}%`,
        badge: percentileLabel(intel.percentile),
        changeText: "2.1%",
        context: "You're faster than this % of all tracked players worldwide.",
        barPercent: intel.percentile,
        free: false,
        sparkData: [],
        modalCharts: [
          {
            title: "Where you stand",
            height: 160,
            element: (
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="85%"
                startAngle={90}
                endAngle={-270}
                data={[
                  { value: intel.percentile, fill: "var(--primary)" },
                  { value: 100 - intel.percentile, fill: "var(--muted)" },
                ]}
                barSize={10}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={5}
                  background={false}
                />
              </RadialBarChart>
            ),
          },
        ],
        deepInsights: percentileInsights(intel.percentile),
      },
      {
        Icon: LuShield,
        label: "Consistency",
        value: `${intel.stability_score?.toFixed(0)}%`,
        badge: stabilityLabel(intel.stability_score),
        changeText: `${Math.abs(intel.consistency_change ?? 0).toFixed(1)}%`,
        context: "Consistency of your reaction times across sessions.",
        barPercent: intel.stability_score,
        free: false,
        sparkData: (intel.game_by_game_consistency || []).map((v, i) => ({
          i,
          v,
        })),
        modalCharts: [
          {
            title: "Deviation from your avg per session",
            height: 160,
            element: (
              <AreaChart
                data={stabilityData}
                margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="stab-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--foreground)"
                      stopOpacity={0.15}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--foreground)"
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
                  tickFormatter={(v) => `${v}ms`}
                />
                <Tooltip
                  content={<ChartTooltip unit="ms" />}
                  cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="var(--foreground)"
                  strokeWidth={2}
                  fill="url(#stab-grad)"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: "var(--foreground)",
                    strokeWidth: 0,
                  }}
                />
              </AreaChart>
            ),
          },
        ],
        deepInsights: stabilityInsights(intel.stability_score),
      },
      {
        Icon: LuTrendingUp,
        label: "Focus Score",
        value: `${Math.max(0, Math.min(100, Math.round((intel.overall_trend_score / 10) * 100)))}%`,
        badge: trendLabel(intel.overall_trend_score),
        changeText: `${Math.abs(intel.drift_rate ?? 0).toFixed(1)}%`,
        context: "Improvement direction across your recent sessions.",
        barPercent: Math.max(
          0,
          Math.min(100, ((intel.overall_trend_score + 5) / 15) * 100),
        ),
        free: false,
        sparkData: sessionScores,
        modalCharts: [
          {
            title: "Score trend over sessions",
            height: 160,
            element: (
              <AreaChart
                data={sessionScores.map((d) => ({
                  session: `#${d.i + 1}`,
                  score: d.v,
                }))}
                margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="trend-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--foreground)"
                      stopOpacity={0.15}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--foreground)"
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
                  type="monotone"
                  dataKey="score"
                  stroke="var(--foreground)"
                  strokeWidth={2}
                  fill="url(#trend-grad)"
                  dot={{ r: 3, fill: "var(--foreground)", strokeWidth: 0 }}
                  activeDot={{
                    r: 5,
                    fill: "var(--foreground)",
                    strokeWidth: 0,
                  }}
                />
              </AreaChart>
            ),
          },
        ],
        deepInsights: trendInsights(intel.overall_trend_score),
      },
    ];
  }, [intel]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((k, i) => {
          const unlocked = isPro || k.free;
          const colors = sentimentColors(k.badge.up);
          return (
            <KpiCard
              key={k.label}
              kpi={k}
              unlocked={unlocked}
              onOpen={setActiveModal}
              sparkColor={colors.stroke}
              gradientId={`kpi-spark-${i}`}
            />
          );
        })}
      </div>

      {activeModal && (
        <KpiModal kpi={activeModal} onClose={() => setActiveModal(null)} />
      )}
    </>
  );
}
