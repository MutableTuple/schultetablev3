import React from "react";
import { LuZap, LuTarget, LuTrendingUp, LuShield } from "react-icons/lu";

function reactionLabel(ms) {
  if (ms < 200) return { text: "Elite reflexes", cls: "good" };
  if (ms < 260) return { text: "Above average", cls: "good" };
  if (ms < 320) return { text: "Average range", cls: "warn" };
  return { text: "Needs work", cls: "bad" };
}

function percentileLabel(p) {
  if (p >= 90) return { text: "Top 10% globally", cls: "good" };
  if (p >= 70) return { text: "Top 30% globally", cls: "good" };
  if (p >= 50) return { text: "Above median", cls: "warn" };
  return { text: "Below median", cls: "warn" };
}

function stabilityLabel(s) {
  if (s >= 85) return { text: "Very consistent", cls: "good" };
  if (s >= 65) return { text: "Mostly steady", cls: "good" };
  if (s >= 45) return { text: "Some variance", cls: "warn" };
  return { text: "High inconsistency", cls: "bad" };
}

function trendLabel(t) {
  if (t >= 7) return { text: "Improving fast", cls: "good" };
  if (t >= 4) return { text: "Steady progress", cls: "good" };
  if (t >= 1) return { text: "Slight gains", cls: "warn" };
  if (t >= -1) return { text: "Plateauing", cls: "warn" };
  return { text: "Declining", cls: "bad" };
}

const badgeStyles = {
  good: "bg-success/15 text-success",
  warn: "bg-warning/15 text-warning",
  bad: "bg-error/15 text-error",
  locked: "bg-base-300 text-base-content/40",
};

const barColors = {
  good: "bg-success",
  warn: "bg-warning",
  bad: "bg-error",
};

function KpiCard({ icon, label, value, badge, context, barPercent, unlocked }) {
  const badgeCls = unlocked ? badge.cls : "locked";
  const badgeText = unlocked ? badge.text : "Pro only";

  return (
    <div className="bg-base-200 rounded-xl p-4 flex flex-col gap-2">
      {/* Label row */}
      <div className="flex items-center gap-1.5 text-xs font-medium opacity-70">
        {icon}
        {label}
      </div>

      {/* Value */}
      {unlocked ? (
        <p className="text-2xl font-bold tracking-tight leading-none">
          {value}
        </p>
      ) : (
        <p className="text-2xl font-bold blur-[6px] select-none opacity-40 leading-none">
          ••••
        </p>
      )}

      {/* Status badge */}
      <span
        className={`inline-flex items-center w-fit px-2 py-0.5 rounded-full text-[11px] font-medium ${badgeStyles[badgeCls]}`}
      >
        {badgeText}
      </span>

      {/* Progress bar */}
      <div className="h-1 rounded-full bg-base-300 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            unlocked ? barColors[badge.cls] : "bg-base-300"
          }`}
          style={{
            width: unlocked
              ? `${Math.min(100, Math.max(0, barPercent))}%`
              : "0%",
          }}
        />
      </div>

      {/* Context explanation */}
      <p className="text-[11px] leading-relaxed opacity-60">
        {unlocked ? context : "Upgrade to Pro to unlock this insight."}
      </p>
    </div>
  );
}

export default function KpiStrip({ intel, isPro }) {
  const kpis = [
    {
      icon: <LuZap className="w-4 h-4 text-primary" />,
      label: "Avg Reaction",
      value: `${Math.round(intel.avg_reaction_last10)} ms`,
      badge: reactionLabel(intel.avg_reaction_last10),
      context:
        "Time from stimulus to action. Under 200 ms is competitive; under 160 ms is pro-level.",
      // Lower is better — invert the bar
      barPercent: Math.max(
        0,
        100 - ((intel.avg_reaction_last10 - 150) / 250) * 100,
      ),
      free: true,
    },
    {
      icon: <LuTarget className="w-4 h-4 text-secondary" />,
      label: "Global Percentile",
      value: `${intel.percentile?.toFixed(1)}%`,
      badge: percentileLabel(intel.percentile),
      context:
        "You're faster than this percentage of all tracked players worldwide.",
      barPercent: intel.percentile,
      free: false,
    },
    {
      icon: <LuShield className="w-4 h-4 text-accent" />,
      label: "Stability",
      value: `${intel.stability_score?.toFixed(1)} / 100`,
      badge: stabilityLabel(intel.stability_score),
      context:
        "How consistent your reaction times are. High variance means your timing is unpredictable under pressure.",
      barPercent: intel.stability_score,
      free: false,
    },
    {
      icon: <LuTrendingUp className="w-4 h-4 text-success" />,
      label: "Trend",
      value: `${intel.overall_trend_score?.toFixed(1)} / 10`,
      badge: trendLabel(intel.overall_trend_score),
      context:
        "Your improvement direction over recent sessions. Positive means you're getting faster over time.",
      // Score is -5 to +10, normalize to 0–100
      barPercent: Math.max(
        0,
        Math.min(100, ((intel.overall_trend_score + 5) / 15) * 100),
      ),
      free: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {kpis.map((k, i) => (
        <KpiCard
          key={i}
          icon={k.icon}
          label={k.label}
          value={k.value}
          badge={k.badge}
          context={k.context}
          barPercent={k.barPercent}
          unlocked={isPro || k.free}
        />
      ))}
    </div>
  );
}
