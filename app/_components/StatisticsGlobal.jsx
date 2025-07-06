"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../_lib/supabase";
import millify from "millify";

export default function StatisticsGlobal() {
  const [stats, setStats] = useState(null);

  const formatNumber = (num) =>
    typeof num === "number" ? millify(num, { precision: 2 }) : "0";

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase.rpc("get_global_game_stats");
      if (error) {
        console.error("Error fetching global stats:", error);
      } else {
        setStats(data);
      }
    };

    fetchStats();

    const channel = supabase
      .channel("global-game-stats")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "UniversalGameStats",
        },
        () => fetchStats()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  if (!stats) {
    return (
      <div className="text-center py-4 text-sm font-medium text-gray-500">
        Loading stats...
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-4 font-sans">
      <div className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-none">
        <input type="checkbox" />
        <div className="collapse-title text-sm sm:text-md font-semibold text-primary">
          🧠 Global Game Stats
        </div>
        <div className="collapse-content mt-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <StatBox
              label="Total Games"
              value={formatNumber(stats.total_games)}
              color="primary"
            />
            <StatBox
              label="Total Score"
              value={formatNumber(stats.total_score)}
              color="success"
            />
            <StatBox
              label="Time Spent"
              value={formatTime(stats.total_time)}
              color="info"
            />
            <StatBox
              label="Right Clicks"
              value={formatNumber(stats.total_right_click)}
              color="warning"
            />
            <StatBox
              label="Wrong Clicks"
              value={formatNumber(stats.total_wrong_click)}
              color="error"
            />
            <StatBox
              label="Accuracy"
              value={`${stats.overall_accuracy?.toFixed(2)}%`}
              color="secondary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, color }) {
  return (
    <div className="stat bg-base-100 border border-base-300 rounded-none px-3 py-2 shadow-sm">
      <div className={`stat-title text-${color} text-[12px] font-medium`}>
        {label}
      </div>
      <div className={`stat-value text-${color} text-base font-semibold`}>
        {value}
      </div>
    </div>
  );
}
