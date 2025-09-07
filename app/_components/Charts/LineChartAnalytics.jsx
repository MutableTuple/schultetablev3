import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

export default function LineChartAnalytics({ reactionTimes }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={reactionTimes}>
        <XAxis dataKey="name" stroke="#ffffff" fontSize={12} interval={0} />
        <YAxis stroke="#ffffff" />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              const { time, change } = payload[0].payload;
              return (
                <div className="p-2 bg-slate-800 border border-slate-600 rounded text-slate-100 text-sm">
                  <p className="font-semibold">{label}</p>
                  <p>Time: {time} ms</p>
                  {change !== null && (
                    <p>
                      Change:{" "}
                      <span
                        className={
                          change >= 0 ? "text-red-400" : "text-green-400"
                        }
                      >
                        {change}%
                      </span>
                    </p>
                  )}
                </div>
              );
            }
            return null;
          }}
        />

        <Line
          type="monotone"
          dataKey="time"
          stroke="#fff"
          strokeWidth={3}
          dot={{ fill: "#facc15", r: 5 }}
          activeDot={{ r: 7, fill: "#f87171" }}
          name="Time (ms)"
        >
          {/* Labels for % change above each dot */}
          <LabelList
            dataKey="change"
            position="top"
            formatter={(value) =>
              value !== null ? `${value > 0 ? "+" : ""}${value}%` : ""
            }
            style={{ fontSize: "12px", fill: "#94a3b8" }}
          />
        </Line>
      </LineChart>
    </ResponsiveContainer>
  );
}
