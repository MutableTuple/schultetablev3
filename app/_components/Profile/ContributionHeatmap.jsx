"use client";
import React, { useEffect, useState, useRef } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { subDays } from "date-fns";
import { supabase } from "@/app/_lib/supabase";

export default function ContributionHeatmap({ user }) {
  const [data, setData] = useState([]);
  const [tooltip, setTooltip] = useState({
    show: false,
    x: 0,
    y: 0,
    content: "",
  });
  const tooltipRef = useRef(null);
  const today = new Date();
  const startDate = subDays(today, 365);

  const getColor = (count) => {
    if (typeof window === "undefined") return "#e5e7eb";
    if (count >= 5) return "#4f46e5"; // Indigo-600
    if (count >= 4) return "#6366f1"; // Indigo-500
    if (count >= 3) return "#818cf8"; // Indigo-400
    if (count >= 2) return "#c7d2fe"; // Indigo-200
    if (count >= 1) return "#e0e7ff"; // Indigo-100
    return "#f3f4f6"; // Gray-100
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: rows, error } = await supabase
        .from("UniversalGameStats")
        .select("created_at")
        .eq("user_id", user[0].id)
        .gte("created_at", startDate.toISOString());

      if (error) {
        console.error("Error fetching stats:", error);
        return;
      }

      const counts = {};
      rows?.forEach((row) => {
        const date = new Date(row.created_at).toISOString().split("T")[0];
        counts[date] = (counts[date] || 0) + 1;
      });

      const formatted = Object.entries(counts).map(([date, count]) => ({
        date,
        count,
      }));

      setData(formatted);
    };

    fetchData();
  }, [user]);

  const handleMouseOver = (event, value) => {
    if (!value?.date) return;

    const rect = event.target.getBoundingClientRect();
    const tooltipContent = `${value.date}: ${value.count} session${value.count > 1 ? "s" : ""}`;

    setTooltip({
      show: true,
      x: rect.left + rect.width / 2,
      y: rect.top,
      content: tooltipContent,
    });
  };

  const handleMouseOut = () => {
    setTooltip({ ...tooltip, show: false });
  };

  return (
    <div className="relative p-6 bg-base-100 rounded-box border border-base-300 mt-6">
      <h2 className="text-xs font-bold text-primary mb-4">
        Your Activity Heatmap
      </h2>

      <div className="overflow-x-auto">
        <CalendarHeatmap
          startDate={startDate}
          endDate={today}
          values={data}
          showWeekdayLabels
          gutterSize={2}
          transformDayElement={(el, value) => {
            const fillColor = getColor(value?.count || 0);

            return React.cloneElement(el, {
              style: {
                ...el.props.style,
                fill: fillColor,
                rx: 0,
                cursor: "pointer",
              },
              onMouseOver: (e) => handleMouseOver(e, value),
              onMouseOut: handleMouseOut,
            });
          }}
        />
      </div>

      {tooltip.show && (
        <div
          ref={tooltipRef}
          className="fixed z-50 px-2 py-1 text-xs text-white bg-black rounded shadow-lg"
          style={{
            left: tooltip.x,
            top: tooltip.y - 40,
            transform: "translateX(-50%)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          {tooltip.content}
        </div>
      )}

      <div className="mt-4 text-sm text-base-content/70 italic">
        Based on your game completions
      </div>
    </div>
  );
}
