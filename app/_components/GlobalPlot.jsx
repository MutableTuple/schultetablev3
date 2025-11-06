"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../_lib/supabase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function GlobalPlot({ userId }) {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch ALL games with accuracy values from your game_summary JSONB
      const { data, error } = await supabase
        .from("games")
        .select("user_id, game_summary->>accuracy as accuracy");

      if (error) {
        // console.error("Error fetching game data:", error);
      } else {
        setGames(
          data.map((g) => ({
            user: g.user_id,
            accuracy: Number(g.accuracy),
          }))
        );
      }
    };
    fetchData();
  }, []);

  // bucket function (0–100, step = 5%)
  const makeBuckets = (values) => {
    const buckets = Array.from({ length: 21 }, (_, i) => ({
      acc: i * 5,
      count: 0,
    }));
    values.forEach((v) => {
      if (!isNaN(v)) {
        const idx = Math.min(20, Math.floor(v / 5));
        buckets[idx].count += 1;
      }
    });
    return buckets;
  };

  // Global distribution (all players)
  const globalAccs = games.map((g) => g.accuracy);
  const globalBuckets = makeBuckets(globalAccs);

  // User distribution
  const userAccs = games
    .filter((g) => g.user === userId)
    .map((g) => g.accuracy);
  const userBuckets = makeBuckets(userAccs);

  // Merge into one dataset for LineChart
  const mergedData = globalBuckets.map((b, i) => ({
    acc: b.acc,
    global: b.count,
    user: userBuckets[i]?.count || 0,
  }));

  return (
    <div className="w-full h-[400px] bg-white rounded-2xl p-4 shadow-md">
      <h2 className="text-lg font-semibold mb-2">
        Accuracy Distribution: You vs Global
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={mergedData}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="acc"
            label={{
              value: "Accuracy (%)",
              position: "insideBottom",
              offset: -5,
            }}
          />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="global"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
            name="All Players"
          />
          <Line
            type="monotone"
            dataKey="user"
            stroke="#ff7300"
            strokeWidth={3}
            dot={false}
            name="You"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
