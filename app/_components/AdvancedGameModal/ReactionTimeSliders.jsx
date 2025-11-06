import React, { useState } from "react";

export default function ReactionTimeSliders({
  isFirstGame,
  trend,
  data,
  messages,
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Convert ms → formatted seconds
  const toSec = (ms) => (ms / 1000).toFixed(3) + "s";

  // Slider knob position (as percentage)
  const calcPos = (val, min, max) => {
    if (max === min) return 0;
    return ((val - min) / (max - min)) * 100;
  };

  // Determine range class based on position
  const getRangeClass = (position) => {
    if (position < 33) {
      return "range-success"; // fast (good)
    } else if (position > 66) {
      return "range-error"; // slow (bad)
    }
    return "range-primary"; // neutral/middle range
  };

  return (
    <div>
      {/* Toggle Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-4 p-3  bg-base-300 rounded-box transition-all duration-200 "
      >
        <span className="font-semibold text-sm">Reaction Time Details</span>
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Collapsible Content */}
      <div
        className={`transition-all duration-300 overflow-hidden ${isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="space-y-6">
          {/* ✅ FASTEST */}
          <div className="card bg-base-100  p-4 transition-all duration-200 ">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-sm">Fastest Reaction</span>
              {!isFirstGame && (
                <div
                  className={`badge ${trend.fastest_pct < 0 ? "badge-success" : "badge-error"} gap-1`}
                >
                  {trend.fastest_pct > 0 ? "+" : ""}
                  {trend.fastest_pct}%
                </div>
              )}
            </div>

            <div className="relative">
              {/* Min/Max labels */}
              <div className="flex justify-between text-xs opacity-60 mb-2">
                <span className="badge badge-ghost badge-xs">
                  {toSec(data.global.fastest_min)}
                </span>
                <span className="badge badge-ghost badge-xs">
                  {toSec(data.global.fastest_max)}
                </span>
              </div>

              {/* DaisyUI Range Slider */}
              <input
                type="range"
                min={0}
                max={100}
                value={calcPos(
                  data.current.fastest,
                  data.global.fastest_min,
                  data.global.fastest_max
                )}
                className={`range ${getRangeClass(calcPos(data.current.fastest, data.global.fastest_min, data.global.fastest_max))} pointer-events-none`}
                readOnly
              />

              {/* Value Display */}
              <div className="flex justify-center mt-2">
                <span
                  className={`badge ${getRangeClass(calcPos(data.current.fastest, data.global.fastest_min, data.global.fastest_max)).replace("range-", "badge-")} font-mono`}
                >
                  {toSec(data.current.fastest)}
                </span>
              </div>
            </div>

            <p className="text-xs mt-3 opacity-70 italic">
              {messages?.fastest ?? "Baseline recorded."}
            </p>
          </div>

          {/* ✅ AVERAGE */}
          <div className="card bg-base-100  p-4 transition-all duration-200 ">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-sm">Average Reaction</span>
              {!isFirstGame && (
                <div
                  className={`badge ${trend.avg_pct < 0 ? "badge-success" : "badge-error"} gap-1`}
                >
                  {trend.avg_pct > 0 ? "+" : ""}
                  {trend.avg_pct}%
                </div>
              )}
            </div>

            <div className="relative">
              <div className="flex justify-between text-xs opacity-60 mb-2">
                <span className="badge badge-ghost badge-xs">
                  {toSec(data.global.avg_min)}
                </span>
                <span className="badge badge-ghost badge-xs">
                  {toSec(data.global.avg_max)}
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={100}
                value={calcPos(
                  data.current.avg,
                  data.global.avg_min,
                  data.global.avg_max
                )}
                className={`range ${getRangeClass(calcPos(data.current.avg, data.global.avg_min, data.global.avg_max))} pointer-events-none`}
                readOnly
              />

              <div className="flex justify-center mt-2">
                <span
                  className={`badge ${getRangeClass(calcPos(data.current.avg, data.global.avg_min, data.global.avg_max)).replace("range-", "badge-")} font-mono`}
                >
                  {toSec(data.current.avg)}
                </span>
              </div>
            </div>

            <p className="text-xs mt-3 opacity-70 italic">
              {messages?.avg ?? "Baseline created."}
            </p>
          </div>

          {/* ✅ SLOWEST */}
          <div className="card bg-base-100  p-4 transition-all duration-200 ">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-sm">Slowest Reaction</span>
              {!isFirstGame && (
                <div
                  className={`badge ${trend.slowest_pct < 0 ? "badge-success" : "badge-error"} gap-1`}
                >
                  {trend.slowest_pct > 0 ? "+" : ""}
                  {trend.slowest_pct}%
                </div>
              )}
            </div>

            <div className="relative">
              <div className="flex justify-between text-xs opacity-60 mb-2">
                <span className="badge badge-ghost badge-xs">
                  {toSec(data.global.slowest_min)}
                </span>
                <span className="badge badge-ghost badge-xs">
                  {toSec(data.global.slowest_max)}
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={100}
                value={calcPos(
                  data.current.slowest,
                  data.global.slowest_min,
                  data.global.slowest_max
                )}
                className={`range ${getRangeClass(calcPos(data.current.slowest, data.global.slowest_min, data.global.slowest_max))} pointer-events-none`}
                readOnly
              />

              <div className="flex justify-center mt-2">
                <span
                  className={`badge ${getRangeClass(calcPos(data.current.slowest, data.global.slowest_min, data.global.slowest_max)).replace("range-", "badge-")} font-mono`}
                >
                  {toSec(data.current.slowest)}
                </span>
              </div>
            </div>

            <p className="text-xs mt-3 opacity-70 italic">
              {messages?.slowest ?? "First game — no comparison yet."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
