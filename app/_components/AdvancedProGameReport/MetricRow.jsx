import React from 'react'

export default function MetricRow({
  label,
  value,
  tip,
  highlight,
  positive,
  type,
  isPro,
  forceUnblur,
}) {
  const parseNum = (v) => {
    if (v == null) return null;
    if (typeof v === "number") return v;
    const n = parseFloat(String(v).replace(/[^0-9.-]/g, ""));
    return isNaN(n) ? null : n;
  };
  const numeric = parseNum(value);

  const getArrow = () => {
    if (numeric === null) return "";
    if (type === "trend") {
      if (value === "improving") return "▲";
      if (value === "declining") return "▼";
      return "•";
    }
    if (type === "rt") {
      if (numeric <= 250) return "▲";
      if (numeric <= 350) return "•";
      return "▼";
    }
    if (numeric > 0) return "▲";
    if (numeric < 0) return "▼";
    return "•";
  };

  const getBadgeColor = () => {
    if (highlight) return "badge-info";
    if (type === "trend") {
      if (value === "improving") return "badge-success";
      if (value === "declining") return "badge-error";
      return "badge-neutral";
    }
    if (type === "rt" && numeric !== null) {
      if (numeric <= 250) return "badge-success";
      if (numeric <= 350) return "badge-warning";
      return "badge-error";
    }
    if (positive === true) return "badge-success";
    if (positive === false) return "badge-error";
    if (numeric > 0) return "badge-success";
    if (numeric < 0) return "badge-error";
    return "badge-neutral";
  };

  const getMeaningText = () => {
    if (type === "trend") {
      if (value === "improving") return "Your reaction time is improving.";
      if (value === "declining") return "Your reaction time is slowing.";
      return "Stable.";
    }
    if (type === "rt" && numeric !== null) {
      if (numeric <= 250) return "Excellent reaction speed.";
      if (numeric <= 350) return "Good reaction control.";
      return "Slow — try focusing more.";
    }
    if (numeric > 0) return "This indicates improvement.";
    if (numeric < 0) return "This shows a decline.";
    return "Stable performance.";
  };

  const renderValue = () =>
    isPro || forceUnblur ? (
      <span>{value}</span>
    ) : (
      <span className="blur-[4px] opacity-70 select-none">••••</span>
    );

  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        {label}
        <div className="tooltip tooltip-top max-w-xs" data-tip={tip}>
          <span className="badge badge-xs bg-base-300 cursor-pointer">?</span>
        </div>
      </div>
      <span
        className={`badge ${getBadgeColor()} px-3 py-2 font-semibold flex items-center gap-1.5`}
      >
        {numeric !== null && <span>{getArrow()}</span>}
        {renderValue()}
        <div
          className="tooltip tooltip-left max-w-xs"
          data-tip={getMeaningText()}
        >
          <span className="badge badge-xs bg-base-100 cursor-pointer">i</span>
        </div>
      </span>
    </div>
  );
}

