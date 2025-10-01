"use client";
import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/app/_lib/supabase";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AccuracyStat({ user }) {
  const [accuracyData, setAccuracyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // week, month, all

  useEffect(() => {
    if (!user?.[0]?.id) return;

    const fetchAccuracy = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("UniversalGameStats")
          .select("accuracy, created_at")
          .eq("user_id", user[0].id)
          .order("created_at", { ascending: true });

        if (error) throw error;

        if (!data || data.length === 0) {
          setAccuracyData([]);
          return;
        }

        // Group by day and calculate average accuracy per day
        const grouped = {};
        data.forEach((row) => {
          const day = new Date(row.created_at).toISOString().split("T")[0];
          if (!grouped[day]) grouped[day] = [];
          grouped[day].push(row.accuracy || 0);
        });

        const chartData = Object.entries(grouped)
          .sort(([a], [b]) => new Date(a) - new Date(b))
          .map(([date, accuracies]) => ({
            date,
            accuracy:
              accuracies.reduce((sum, v) => sum + v, 0) / accuracies.length,
          }));

        setAccuracyData(chartData);
      } catch (err) {
        console.error(err);
        setError("Unable to fetch your accuracy data at the moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccuracy();
  }, [user]);

  const filteredData = useMemo(() => {
    if (!accuracyData.length) return [];
    const now = new Date();
    return accuracyData.filter((d) => {
      const diff = now - new Date(d.date);
      if (filter === "week") return diff <= 7 * 24 * 60 * 60 * 1000;
      if (filter === "month") return diff <= 30 * 24 * 60 * 60 * 1000;
      return true;
    });
  }, [filter, accuracyData]);

  const accuracy = useMemo(() => {
    if (!filteredData.length) return 0;
    return (
      filteredData.reduce((sum, d) => sum + d.accuracy, 0) / filteredData.length
    );
  }, [filteredData]);

  const trend = useMemo(() => {
    if (filteredData.length < 2) return 0;
    const first = filteredData[0].accuracy;
    const last = filteredData[filteredData.length - 1].accuracy;
    if (first === 0) return last * 100;
    return ((last - first) / first) * 100;
  }, [filteredData]);

  const trendColor = trend >= 0 ? "text-success" : "text-error";
  const trendSign = trend >= 0 ? "▲" : "▼";

  return (
    <div className="card bg-base-100 flex flex-col gap-6 ">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <div>
          <div className="text-xl font-semibold">Overall Accuracy</div>
          {loading ? (
            <div className="h-12 w-32 bg-base-200 animate-pulse rounded-md mt-2"></div>
          ) : (
            <div className={`mt-2 text-4xl font-bold ${trendColor}`}>
              {error ? "Data unavailable" : `${accuracy.toFixed(1)}%`}
            </div>
          )}
          {!loading && !error && filteredData.length > 1 && (
            <div className={`mt-1 text-sm ${trendColor}`}>
              Your accuracy {trend >= 0 ? "improved" : "dropped"} by{" "}
              {Math.abs(trend).toFixed(1)}% over the selected period.
            </div>
          )}
          {!loading && !error && filteredData.length <= 1 && (
            <div className="mt-1 text-sm text-gray-500">
              Not enough data to show a trend.
            </div>
          )}
        </div>

        {/* Filter */}
        <select
          className="select select-bordered w-36"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Area Chart */}
      {loading ? (
        <div className="h-64 w-full bg-base-200 animate-pulse rounded-xl"></div>
      ) : (
        filteredData.length > 0 && (
          <div className="w-full h-64 card bg-base-200 p-4 rounded-xl">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={filteredData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={trend >= 0 ? "#22c55e" : "#ef4444"}
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor={trend >= 0 ? "#22c55e" : "#ef4444"}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v.toFixed(0)}%`}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937", // dark gray
                    color: "#f9fafb", // light text
                    borderRadius: "12px",
                    padding: "8px 12px",
                    border: "none",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
                    fontSize: "0.875rem",
                  }}
                  labelStyle={{
                    color: "#f9fafb",
                    fontWeight: "500",
                  }}
                  formatter={(value) => `${value.toFixed(1)}%`}
                />
                <Area
                  type="monotone"
                  dataKey="accuracy"
                  stroke={trend >= 0 ? "#22c55e" : "#ef4444"}
                  strokeWidth={3}
                  fill="url(#colorAcc)"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )
      )}
    </div>
  );
}
