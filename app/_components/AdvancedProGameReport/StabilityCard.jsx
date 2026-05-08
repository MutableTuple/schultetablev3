import React from "react";
import SectionCard from "./SectionCard";
import { LuShield, LuLock } from "react-icons/lu";
import MetricRow from "./MetricRow";

function getVerdict(score) {
  if (score == null || isNaN(score)) return null;

  if (score >= 85)
    return {
      label: "Rock-solid stability",
      badge: "badge-success",
      alert: "alert-success",
    };

  if (score >= 70)
    return {
      label: "Strong mental rhythm",
      badge: "badge-info",
      alert: "alert-info",
    };

  if (score >= 50)
    return {
      label: "Moderate stability",
      badge: "badge-primary",
      alert: "alert-info",
    };

  if (score >= 30)
    return {
      label: "Unstable rhythm",
      badge: "badge-warning",
      alert: "alert-warning",
    };

  return {
    label: "Very erratic sessions",
    badge: "badge-error",
    alert: "alert-error",
  };
}

function getInsight(score) {
  if (score == null || isNaN(score)) return null;

  if (score >= 85) return `Your sessions are extremely steady.`;
  if (score >= 70) return `You maintain a strong rhythm most days.`;
  if (score >= 50) return `Moderate session-to-session consistency detected.`;
  if (score >= 30) return `Your sessions vary noticeably.`;

  return `High variance between sessions detected.`;
}

export default function StabilityCard({ intel, isPro }) {
  const score = intel?.stability_score;
  const verdict = getVerdict(score);
  const insight = getInsight(score);

  const locked = !isPro;
  const blur = "blur-sm select-none pointer-events-none";

  return (
    <SectionCard
      title="Stability"
      icon={<LuShield className="w-4 h-4 text-accent" />}
    >
      <MetricRow
        label="Stability Score"
        value={`${score?.toFixed(1)} / 100`}
        tip={locked ? "" : "Higher = steadier mental rhythm."}
        isPro={isPro}
        valueClassName={locked ? blur : ""}
      />

      {verdict && (
        <div className={`alert ${verdict.alert} py-3 px-4 mt-3 rounded-xl`}>
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center gap-2">
              <LuShield className="w-3.5 h-3.5 shrink-0" />

              <span className="font-semibold text-sm">
                {verdict.label}
              </span>

              <span
                className={`badge ${verdict.badge} badge-sm ml-auto ${
                  locked ? blur : ""
                }`}
              >
                {score?.toFixed(1)} / 100
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
                Unlock full stability insights with Pro
              </div>
            )}
          </div>
        </div>
      )}
    </SectionCard>
  );
}