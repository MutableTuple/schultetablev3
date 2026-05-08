import React from "react";
import SectionCard from "./SectionCard";
import { LuZap, LuLock } from "react-icons/lu";
import MetricRow from "./MetricRow";

function getVerdict(ms) {
  if (ms == null || isNaN(ms)) return null;

  if (ms < 180)
    return {
      label: "Elite reflexes",
      badge: "badge-success",
      alert: "alert-success",
    };

  if (ms < 220)
    return {
      label: "Sharp reflexes",
      badge: "badge-info",
      alert: "alert-info",
    };

  if (ms < 260)
    return {
      label: "Good reaction speed",
      badge: "badge-primary",
      alert: "alert-info",
    };

  if (ms < 320)
    return {
      label: "Average reaction speed",
      badge: "badge-warning",
      alert: "alert-warning",
    };

  return {
    label: "Reaction speed needs work",
    badge: "badge-error",
    alert: "alert-error",
  };
}

function getInsight(intel) {
  const avg = intel?.avg_reaction_last10;
  const change = intel?.avg_change;
  const slowest = intel?.slowest_last10;
  const fastest = intel?.fastest_last10;

  if (avg == null || isNaN(avg)) return null;

  if (change != null) {
    if (change > 10)
      return `Your last 10 games have dipped — you're taking ${change.toFixed(
        0
      )}% longer than earlier sessions.`;

    if (change > 3) return `Slightly slower than your earlier baseline.`;

    if (change < -10)
      return `You're reacting ${Math.abs(change).toFixed(
        0
      )}% faster than before.`;

    if (change < -3)
      return `Marginally quicker than your previous sessions.`;
  }

  if (fastest != null && slowest != null) {
    const spread = slowest - fastest;

    if (spread > 200)
      return `There's a ${Math.round(
        spread
      )}ms gap between your fastest and slowest clicks.`;

    if (spread > 120)
      return `Your reactions vary by ~${Math.round(spread)}ms across the grid.`;
  }

  if (avg > 320) return `Your reaction speed can improve further.`;
  if (avg < 200) return `Exceptional level reaction speed.`;

  return `Solid and steady performance.`;
}

export default function ReactionTimeCard({ intel, isPro }) {
  const verdict = getVerdict(intel?.avg_reaction_last10);
  const insight = getInsight(intel);

  const locked = !isPro;
  const blur = "blur-sm select-none pointer-events-none";

  const lockedTip = "Unlock with Pro";

  return (
    <SectionCard
      title="Reaction Time"
      icon={<LuZap className="w-4 h-4 text-primary" />}
    >
      <MetricRow
        label="Avg Reaction Time"
        value={`${Math.round(intel.avg_reaction_last10)} ms`}
        tip="Lower = better"
        type="rt"
        forceUnblur
      />

      <MetricRow
        label="Fastest (Best)"
        value={`${Math.round(intel.fastest_last10)} ms`}
        tip={locked ? lockedTip : "Fastest single reaction in last 10 games."}
        type="rt"
        isPro={isPro}
        valueClassName={locked ? blur : ""}
      />

      <MetricRow
        label="Slowest (Worst)"
        value={`${Math.round(intel.slowest_last10)} ms`}
        tip={locked ? lockedTip : "Worst reaction out of last 10 games."}
        type="rt"
        isPro={isPro}
        valueClassName={locked ? blur : ""}
      />

      {intel.avg_prev10 && (
        <MetricRow
          label="Previous 10 Avg"
          value={`${Math.round(intel.avg_prev10)} ms`}
          tip={locked ? lockedTip : "Your earlier baseline."}
          isPro={isPro}
          valueClassName={locked ? blur : ""}
        />
      )}

      {intel.avg_change != null && (
        <MetricRow
          label="Speed Trend"
          value={`${intel.avg_change > 0 ? "+" : ""}${intel.avg_change.toFixed(
            1
          )}%`}
          tip={locked ? lockedTip : "Speed improvement vs earlier games."}
          positive={intel.avg_change < 0}
          isPro={isPro}
          valueClassName={locked ? blur : ""}
        />
      )}

      {verdict && (
        <div className={`alert ${verdict.alert} py-3 px-4 mb-3 rounded-xl`}>
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center gap-2">
              <LuZap className="w-3.5 h-3.5 shrink-0" />

              <span className="font-semibold text-sm">
                {verdict.label}
              </span>

              <span
                title={locked ? "Unlock with Pro" : ""}
                className={`badge ${verdict.badge} badge-sm ml-auto ${
                  locked ? blur : ""
                }`}
              >
                {Math.round(intel.avg_reaction_last10)} ms avg
              </span>
            </div>

            {insight && (
              <p
                title={locked ? "Unlock with Pro" : ""}
                className={`text-xs opacity-80 leading-relaxed mt-0.5 ${
                  locked ? blur : ""
                }`}
              >
                {insight}
              </p>
            )}

            {locked && (
              <div className="flex items-center gap-1 mt-1 text-xs font-medium opacity-80">
                <LuLock className="w-3 h-3" />
                Unlock full reaction insights with Pro
              </div>
            )}
          </div>
        </div>
      )}
    </SectionCard>
  );
}