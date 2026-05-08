import React, { useMemo } from 'react'
import {
  LuActivity,
} from "react-icons/lu";


export default function GameTable({ intel, isPro }) {
  const games = useMemo(() => {
    return intel.game_by_game_avg?.map((avg, i) => {
      const prev = intel.game_by_game_avg[i - 1];
      let trend = "same";
      if (prev !== undefined) {
        trend = avg < prev ? "improving" : avg > prev ? "declining" : "same";
      }
      return {
        index: i + 1,
        avg,
        fastest: intel.game_by_game_fastest[i],
        consistency: intel.game_by_game_consistency[i],
        date: intel.game_dates[i],
        trend,
      };
    });
  }, [intel]);

  const first = intel.game_by_game_avg?.[0];
  const last = intel.game_by_game_avg?.[intel.game_by_game_avg.length - 1];
  let overallTrend = "same";
  if (first && last) {
    const diff = (last - first) / first;
    overallTrend =
      diff < -0.03 ? "improving" : diff > 0.03 ? "declining" : "same";
  }

  const trendBadge = (t) =>
    t === "improving"
      ? "badge-success"
      : t === "declining"
        ? "badge-error"
        : "badge-neutral";

  return (
    <div className="bg-base-200 rounded-xl p-4 border border-base-300 space-y-3">
      <h3 className="font-semibold text-sm flex items-center gap-2">
        <LuActivity className="w-4 h-4 text-primary" />
        Game-by-Game Breakdown
      </h3>

      {/* Trend badges */}
      <div className="flex flex-wrap gap-2">
        <span className={`badge px-3 py-2 text-xs ${trendBadge(overallTrend)}`}>
          {overallTrend === "improving"
            ? "▲ Short-term Improving"
            : overallTrend === "declining"
              ? "▼ Short-term Declining"
              : "• Short-term Stable"}
        </span>
        <span
          className={`badge px-3 py-2 text-xs ${trendBadge(intel.reaction_trend)}`}
        >
          {intel.reaction_trend === "improving"
            ? "▲ Long-term Improving"
            : intel.reaction_trend === "declining"
              ? "▼ Long-term Declining"
              : "• Long-term Stable"}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table table-xs">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Avg RT</th>
              <th>Fastest</th>
              <th>Consistency</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {games?.map((g, i) => (
              <tr
                key={i}
                className={
                  intel.best_game_index === i + 1
                    ? "bg-success/10"
                    : intel.worst_game_index === i + 1
                      ? "bg-error/10"
                      : ""
                }
              >
                <td className="font-medium">{g.index}</td>
                <td>{new Date(g.date).toLocaleDateString()}</td>
                <td>
                  {isPro ? (
                    `${Math.round(g.avg)} ms`
                  ) : (
                    <span className="blur-[4px] select-none">•••</span>
                  )}
                </td>
                <td>
                  {isPro ? (
                    `${Math.round(g.fastest)} ms`
                  ) : (
                    <span className="blur-[4px] select-none">•••</span>
                  )}
                </td>
                <td>
                  {isPro ? (
                    `${Math.round(g.consistency)}`
                  ) : (
                    <span className="blur-[4px] select-none">•••</span>
                  )}
                </td>
                <td>
                  <span className={`badge badge-xs ${trendBadge(g.trend)}`}>
                    {g.trend === "improving"
                      ? "▲"
                      : g.trend === "declining"
                        ? "▼"
                        : "•"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
