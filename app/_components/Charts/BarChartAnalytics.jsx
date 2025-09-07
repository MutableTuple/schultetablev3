import React from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function BarChartAnalytics({ reactionTimes }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={reactionTimes}>
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
        <Bar
          dataKey="time"
          fill="#ffffff"
          name="Time (ms)"
          radius={[0, 0, 0, 0]} // perfect corners
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
