import React from "react";
import SectionCard from "./SectionCard";
import { LuTrendingUp, LuLock } from "react-icons/lu";
import MetricRow from "./MetricRow";

function getVerdict(reactionTrend, consistencyTrend, overallScore) {
  if (overallScore == null && !reactionTrend && !consistencyTrend) return null;

  const bothImproving =
    reactionTrend === "improving" && consistencyTrend === "improving";

  const bothDeclining =
    reactionTrend === "declining" && consistencyTrend === "declining";

  const reactionUp = reactionTrend === "improving";
  const consistencyUp = consistencyTrend === "improving";

  if (bothImproving && overallScore >= 70)
    return {
      label: "On a strong upward trajectory",
      badge: "badge-success",
      alert: "alert-success",
    };

  if (bothImproving)
    return {
      label: "Improving across the board",
      badge: "badge-success",
      alert: "alert-success",
    };

  if (reactionUp && !consistencyUp)
    return {
      label: "Faster but less consistent",
      badge: "badge-info",
      alert: "alert-info",
    };

  if (!reactionUp && consistencyUp)
    return {
      label: "More consistent, not faster yet",
      badge: "badge-info",
      alert: "alert-info",
    };

  if (bothDeclining)
    return {
      label: "Trending downward",
      badge: "badge-error",
      alert: "alert-error",
    };

  return {
    label: "Mixed signals",
    badge: "badge-warning",
    alert: "alert-warning",
  };
}

function getInsight(reactionTrend, consistencyTrend, overallScore) {
  if (overallScore == null && !reactionTrend && !consistencyTrend) return null;

  const bothImproving =
    reactionTrend === "improving" && consistencyTrend === "improving";

  const bothDeclining =
    reactionTrend === "declining" && consistencyTrend === "declining";

  const reactionUp = reactionTrend === "improving";
  const consistencyUp = consistencyTrend === "improving";

  if (bothImproving) return `Speed and consistency are both improving.`;
  if (reactionUp && !consistencyUp)
    return `Speed is improving faster than rhythm.`;
  if (!reactionUp && consistencyUp)
    return `Rhythm is improving before speed.`;
  if (bothDeclining) return `Recent performance has softened.`;

  return `Your trends are currently mixed.`;
}

export default function TrendCard({ intel, isPro }) {
  const verdict = getVerdict(
    intel?.reaction_trend,
    intel?.consistency_trend,
    intel?.overall_trend_score
  );

  const insight = getInsight(
    intel?.reaction_trend,
    intel?.consistency_trend,
    intel?.overall_trend_score
  );

  const locked = !isPro;
  const blur = "blur-sm select-none pointer-events-none";

  return (
    <SectionCard
      title="Performance Trends"
      icon={<LuTrendingUp className="w-4 h-4 text-success" />}
    >
      <MetricRow
        label="Reaction Trend"
        value={intel.reaction_trend}
        tip={locked ? "" : "Speed improving or dropping?"}
        positive={intel.reaction_trend === "improving"}
        type="trend"
        isPro={isPro}
        valueClassName={locked ? blur : ""}
      />

      <MetricRow
        label="Consistency Trend"
        value={intel.consistency_trend}
        tip={locked ? "" : "Stability over games."}
        positive={intel.consistency_trend === "improving"}
        isPro={isPro}
        valueClassName={locked ? blur : ""}
      />

      <MetricRow
        label="Overall Trend Score"
        value={`${intel.overall_trend_score?.toFixed(1)}`}
        tip={locked ? "" : "Combined improvement score."}
        isPro={isPro}
        valueClassName={locked ? blur : ""}
      />

      {verdict && (
        <div className={`alert ${verdict.alert} py-3 px-4 mt-3 rounded-xl`}>
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center gap-2">
              <LuTrendingUp className="w-3.5 h-3.5 shrink-0" />

              <span className="font-semibold text-sm">
                {verdict.label}
              </span>

              {intel.overall_trend_score != null && (
                <span
                  className={`badge ${verdict.badge} badge-sm ml-auto ${
                    locked ? blur : ""
                  }`}
                >
                  {intel.overall_trend_score?.toFixed(1)} score
                </span>
              )}
            </div>

            {insight && (
              <p
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
                Unlock full performance trends with Pro
              </div>
            )}
          </div>
        </div>
      )}
    </SectionCard>
  );
}