import React from "react";
import SectionCard from "./SectionCard";
import MetricRow from "./MetricRow";
import { LuActivity, LuLock } from "react-icons/lu";

function getVerdict(score) {
  if (score == null || isNaN(score)) return null;

  if (score <= -20)
    return {
      label: "Heavy fatigue detected",
      badge: "badge-error",
      alert: "alert-error",
    };

  if (score <= -8)
    return {
      label: "Noticeable fatigue",
      badge: "badge-warning",
      alert: "alert-warning",
    };

  if (score < 0)
    return {
      label: "Mild slowdown",
      badge: "badge-warning",
      alert: "alert-warning",
    };

  if (score <= 5)
    return {
      label: "No fatigue",
      badge: "badge-success",
      alert: "alert-success",
    };

  return {
    label: "Getting faster mid-session",
    badge: "badge-success",
    alert: "alert-success",
  };
}

function getInsight(score) {
  if (score == null || isNaN(score)) return null;

  if (score <= -20)
    return `You're slowing down significantly across sessions.`;

  if (score <= -8)
    return `Noticeable fatigue appears later in sessions.`;

  if (score < 0)
    return `Mild slowdown detected over time.`;

  if (score <= 5)
    return `Your pace stays steady throughout sessions.`;

  return `You tend to get faster as the session progresses.`;
}

export default function FatigueCard({ intel, isPro }) {
  const verdict = getVerdict(intel?.fatigue_score);
  const insight = getInsight(intel?.fatigue_score);

  const locked = !isPro;
  const blur = "blur-sm select-none pointer-events-none";

  return (
    <SectionCard
      title="Fatigue"
      icon={<LuActivity className="w-4 h-4 text-warning" />}
    >
      {intel.fatigue_score != null ? (
        <>
          <MetricRow
            label="Fatigue Score"
            value={`${intel.fatigue_score.toFixed(1)}%`}
            tip={locked ? "" : "Negative = slowing over a session."}
            positive={intel.fatigue_score < 0}
            isPro={isPro}
            valueClassName={locked ? blur : ""}
          />

          {verdict && (
            <div className={`alert ${verdict.alert} py-3 px-4 mt-3 rounded-xl`}>
              <div className="flex flex-col gap-1 w-full">
                <div className="flex items-center gap-2">
                  <LuActivity className="w-3.5 h-3.5 shrink-0" />

                  <span className="font-semibold text-sm">
                    {verdict.label}
                  </span>

                  <span
                    className={`badge ${verdict.badge} badge-sm ml-auto ${
                      locked ? blur : ""
                    }`}
                  >
                    {intel.fatigue_score > 0 ? "+" : ""}
                    {intel.fatigue_score.toFixed(1)}%
                  </span>
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
                    Unlock full fatigue insights with Pro
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-xs opacity-60">
          Not enough data to measure fatigue yet.
        </p>
      )}
    </SectionCard>
  );
}