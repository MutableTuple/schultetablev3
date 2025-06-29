"use client";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ComparedSummary({ summaries }) {
  if (!summaries || summaries.length === 0) {
    return (
      <div className="text-center text-base-content/70 p-6">
        <h2 className="text-xl font-semibold mb-2">
          No comparison data available
        </h2>
        <p className="text-sm">
          Ask friends to play and compare once they have enough game history.
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
      {summaries.map((entry, index) => {
        const { latest, average, user: u } = entry;

        const chartData =
          average && Object.keys(average).length > 0
            ? [
                { name: "Score", value: parseFloat(average?.score) || 0 },
                {
                  name: "Reaction",
                  value: parseFloat(average?.avgReactionTimeMs) || 0,
                },
                { name: "Mistakes", value: parseFloat(average?.mistakes) || 0 },
                {
                  name: "Consistency",
                  value: parseFloat(average?.consistencyScore) || 0,
                },
              ]
            : [];

        return (
          <div
            key={index}
            className="card bg-base-100 border border-base-300 shadow-sm p-4 space-y-4"
          >
            <div className="flex items-center gap-3">
              <img
                src={u?.image || "/avatar.png"}
                alt={u?.name || "Anonymous"}
                className="w-10 h-10 rounded-full border"
              />
              <div>
                <div className="font-semibold">{u?.name || "Anonymous"}</div>
                <div className="text-xs opacity-60">
                  Latest:{" "}
                  {latest?.completedAt
                    ? new Date(latest.completedAt).toLocaleString()
                    : "No recent games"}
                </div>
              </div>
            </div>

            {/* Averages */}
            <div className="stats stats-vertical w-full text-sm shadow-sm">
              {average ? (
                <>
                  <div className="stat">
                    <div className="stat-title">Avg Score</div>
                    <div className="stat-value">{average?.score ?? "—"}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Accuracy</div>
                    <div className="stat-value">
                      {average?.accuracy ?? "—"}%
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Avg Reaction</div>
                    <div className="stat-value">
                      {average?.avgReactionTimeMs ?? "—"}ms
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Mistakes</div>
                    <div className="stat-value">{average?.mistakes ?? "—"}</div>
                  </div>
                </>
              ) : (
                <div className="text-xs text-base-content/60 italic px-2 py-4">
                  Not enough data to show averages.
                </div>
              )}
            </div>

            <div className="divider">Last Game</div>

            {/* Last Game Summary */}
            <div className="stats stats-vertical w-full text-sm shadow-sm">
              {latest ? (
                <>
                  <div className="stat">
                    <div className="stat-title">Score</div>
                    <div className="stat-value">{latest?.score ?? "—"}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Grid</div>
                    <div className="stat-value">
                      {latest?.gridSize
                        ? `${latest.gridSize}×${latest.gridSize}`
                        : "—"}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Duration</div>
                    <div className="stat-value">
                      {latest?.durationMs
                        ? `${(latest.durationMs / 1000).toFixed(2)}s`
                        : "—"}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Difficulty</div>
                    <div className="stat-value">
                      {latest?.difficulty ?? "—"}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-xs text-base-content/60 italic px-2 py-4">
                  No recent games to display.
                </div>
              )}
            </div>

            {/* Area Chart */}
            <div className="rounded border bg-base-200 p-2 h-36">
              {chartData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient
                        id="colorValue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} />
                    <YAxis stroke="#9ca3af" fontSize={10} />
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <Tooltip wrapperClassName="text-xs" />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-base-content/60">
                  Not enough data to render chart.
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
