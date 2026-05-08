import React from "react";
import SectionCard from "./SectionCard";
import MetricRow from "./MetricRow";
import { LuTarget, LuLock } from "react-icons/lu";

function getVerdict(score) {
  if (score == null || isNaN(score)) return null;

  if (score >= 90)
    return {
      label: "Machine-like consistency",
      badge: "badge-success",
      alert: "alert-success",
    };

  if (score >= 75)
    return {
      label: "Very consistent",
      badge: "badge-info",
      alert: "alert-info",
    };

  if (score >= 55)
    return {
      label: "Moderately consistent",
      badge: "badge-primary",
      alert: "alert-info",
    };

  if (score >= 35)
    return {
      label: "Inconsistent timing",
      badge: "badge-warning",
      alert: "alert-warning",
    };

  return {
    label: "Highly erratic",
    badge: "badge-error",
    alert: "alert-error",
  };
}

function getInsight(intel) {
  const score = intel?.avg_consistency_last10;
  const change = intel?.consistency_change;
  const percentile = intel?.percentile;

  if (score == null || isNaN(score)) return null;

  if (change != null) {
    if (change < -10)
      return `Your recent timing became more erratic than earlier sessions.`;

    if (change < -3)
      return `Slightly less consistent than before.`;

    if (change > 10)
      return `Your rhythm has improved strongly in recent games.`;

    if (change > 3)
      return `A small but real rhythm improvement is visible.`;
  }

  if (percentile != null) {
    if (percentile >= 90)
      return `You rank among the most consistent players globally.`;

    if (percentile >= 70)
      return `You are above average for steady timing.`;

    if (percentile < 30)
      return `Your timing varies more than most players.`;
  }

  if (score >= 90) return `Near-perfect consistency.`;
  if (score >= 75) return `Strong stable rhythm overall.`;
  if (score >= 55) return `Decent timing with some fluctuations.`;
  if (score >= 35) return `Noticeable timing inconsistency.`;

  return `High timing variance detected.`;
}

export default function ConsistencyCard({ intel, isPro }) {
  const verdict = getVerdict(intel?.avg_consistency_last10);
  const insight = getInsight(intel);

  const locked = !isPro;
  const blur = "blur-sm select-none pointer-events-none";
  const lockedTip = "Unlock with Pro";

  return (
    <SectionCard
      title="Consistency"
      icon={<LuTarget className="w-4 h-4 text-secondary" />}
    >
      <MetricRow
        label="Avg Consistency"
        value={`${Math.round(intel.avg_consistency_last10)}`}
        tip="Higher = more stable timing."
        forceUnblur
        isPro
      />

      <MetricRow
        label="Global Percentile"
        value={`${intel.percentile?.toFixed(1)}%`}
        tip={locked ? lockedTip : "Where you rank among all players."}
        highlight
        isPro={isPro}
        valueClassName={locked ? blur : ""}
      />

      {intel.consistency_change != null && (
        <MetricRow
          label="Consistency Trend"
          value={`${
            intel.consistency_change > 0 ? "+" : ""
          }${intel.consistency_change.toFixed(1)}%`}
          tip={locked ? lockedTip : "Higher = more stable than before."}
          positive={intel.consistency_change >= 0}
          isPro={isPro}
          valueClassName={locked ? blur : ""}
        />
      )}

      {verdict && (
        <div className={`alert ${verdict.alert} py-3 px-4 mb-3 rounded-xl`}>
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center gap-2">
              <LuTarget className="w-3.5 h-3.5 shrink-0" />

              <span className="font-semibold text-sm">
                {verdict.label}
              </span>

              <span
                title={locked ? "Unlock with Pro" : ""}
                className={`badge ${verdict.badge} badge-sm ml-auto ${
                  locked ? blur : ""
                }`}
              >
                {Math.round(intel.avg_consistency_last10)} score
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
                Unlock full consistency insights with Pro
              </div>
            )}
          </div>
        </div>
      )}
    </SectionCard>
  );
}