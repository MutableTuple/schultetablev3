import React from "react";
import SectionCard from "./SectionCard";
import { LuClock, LuLock } from "react-icons/lu";
import MetricRow from "./MetricRow";

function getVerdict(rate) {
  if (rate == null || isNaN(rate)) return null;

  if (rate >= 0.5)
    return {
      label: "Warming up strongly",
      badge: "badge-success",
      alert: "alert-success",
    };

  if (rate > 0.05)
    return {
      label: "Slight positive drift",
      badge: "badge-info",
      alert: "alert-info",
    };

  if (rate >= -0.05)
    return {
      label: "Holding steady",
      badge: "badge-success",
      alert: "alert-success",
    };

  if (rate >= -0.5)
    return {
      label: "Slight negative drift",
      badge: "badge-warning",
      alert: "alert-warning",
    };

  return {
    label: "Fading through the session",
    badge: "badge-error",
    alert: "alert-error",
  };
}

function getInsight(rate) {
  if (rate == null || isNaN(rate)) return null;

  if (rate >= 0.5) return `You improve noticeably as sessions progress.`;
  if (rate > 0.05) return `Small positive momentum builds mid-session.`;
  if (rate >= -0.05) return `Your pace remains stable throughout sessions.`;
  if (rate >= -0.5) return `Slight slowdown appears later in sessions.`;

  return `Clear end-of-session fatigue is present.`;
}

export default function DriftCard({ intel, isPro }) {
  const rate = intel?.drift_rate;
  const verdict = getVerdict(rate);
  const insight = getInsight(rate);

  const locked = !isPro;
  const blur = "blur-sm select-none pointer-events-none";

  return (
    <SectionCard
      title="Drift Analysis"
      icon={<LuClock className="w-4 h-4 text-info" />}
    >
      <MetricRow
        label="Avg Drift Rate"
        value={`${rate?.toFixed(2)}`}
        tip={locked ? "" : "Positive = you get slightly faster during a session."}
        isPro={isPro}
        valueClassName={locked ? blur : ""}
      />

      {verdict && (
        <div className={`alert ${verdict.alert} py-3 px-4 mt-3 rounded-xl`}>
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center gap-2">
              <LuClock className="w-3.5 h-3.5 shrink-0" />

              <span className="font-semibold text-sm">
                {verdict.label}
              </span>

              <span
                className={`badge ${verdict.badge} badge-sm ml-auto ${
                  locked ? blur : ""
                }`}
              >
                {rate >= 0 ? "+" : ""}
                {rate?.toFixed(2)}
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
                Unlock full drift insights with Pro
              </div>
            )}
          </div>
        </div>
      )}
    </SectionCard>
  );
}