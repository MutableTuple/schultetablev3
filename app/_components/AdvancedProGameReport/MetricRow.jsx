import React from "react";

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

  const getTrend = () => {
    if (numeric === null) return "neutral";

    if (type === "trend") {
      if (value === "improving") return "up";
      if (value === "declining") return "down";
      return "neutral";
    }

    if (type === "rt") {
      if (numeric <= 250) return "up";
      if (numeric <= 350) return "neutral";
      return "down";
    }

    if (numeric > 0) return "up";
    if (numeric < 0) return "down";

    return "neutral";
  };

  const trend = getTrend();

  const getArrow = () => {
    switch (trend) {
      case "up":
        return "↗";

      case "down":
        return "↘";

      default:
        return "•";
    }
  };

  const getMeaningText = () => {
    if (type === "trend") {
      if (value === "improving") return "Your reaction time is improving.";

      if (value === "declining") return "Your reaction time is slowing.";

      return "Stable performance.";
    }

    if (type === "rt" && numeric !== null) {
      if (numeric <= 250) return "Excellent reaction speed.";

      if (numeric <= 350) return "Good reaction control.";

      return "Reaction time is slower than average.";
    }

    if (numeric > 0) return "This indicates improvement.";

    if (numeric < 0) return "This indicates a decline.";

    return "Stable performance.";
  };

  const pillClasses =
    trend === "up"
      ? "border-[#b9d8c4] bg-[#edf6f0] text-[#315c3b]"
      : trend === "down"
        ? "border-[#e0bebe] bg-[#fbf2f2] text-[#7b4343]"
        : "border-zinc-200 bg-zinc-100 text-zinc-700";

  const renderValue = () =>
    isPro || forceUnblur ? (
      value
    ) : (
      <span className="blur-[5px] opacity-60 select-none">••••</span>
    );
  return (
    <div className="group flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-5 py-4 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50">
      {/* Left */}

      <div className="flex min-w-0 items-center gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-medium text-zinc-900">
              {label}
            </span>

            <div className="tooltip tooltip-right" data-tip={tip}>
              <button className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-300 text-[11px] font-semibold text-zinc-500 transition hover:border-zinc-400 hover:bg-zinc-100">
                ?
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right */}

      <div className="flex items-center gap-3">
        <div
          className={`flex items-center gap-2 rounded-full border px-4 py-2 transition-all duration-200 ${pillClasses}`}
        >
          <span className="text-base font-bold">{getArrow()}</span>

          <span className="text-sm font-semibold tabular-nums tracking-tight">
            {renderValue()}
          </span>
        </div>

        <div className="tooltip tooltip-left" data-tip={getMeaningText()}>
          <button className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-300 bg-white text-xs font-semibold text-zinc-500 transition hover:border-zinc-400 hover:bg-zinc-100">
            i
          </button>
        </div>
      </div>
    </div>
  );
}
