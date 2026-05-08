"use client";
import React, { useEffect, useState, useRef } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { subDays, format } from "date-fns";
import { supabase } from "@/app/_lib/supabase";

const GH_COLORS = {
  empty: "#161b22",
  l1: "#0e4429",
  l2: "#006d32",
  l3: "#26a641",
  l4: "#39d353",
};

const getColor = (count) => {
  if (!count || count === 0) return GH_COLORS.empty;
  if (count >= 5) return GH_COLORS.l4;
  if (count >= 4) return GH_COLORS.l3;
  if (count >= 3) return GH_COLORS.l2;
  if (count >= 2) return GH_COLORS.l1;
  return GH_COLORS.l1;
};

const totalSessions = (data) =>
  data.reduce((sum, d) => sum + (d.count || 0), 0);

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

  useEffect(() => {
    const fetchData = async () => {
      const { data: rows, error } = await supabase
        .from("UniversalGameStats")
        .select("created_at")
        .eq("user_id", user?.id)
        .gte("created_at", startDate.toISOString());

      if (error) return;

      const counts = {};
      rows?.forEach((row) => {
        const date = new Date(row.created_at).toISOString().split("T")[0];
        counts[date] = (counts[date] || 0) + 1;
      });

      setData(Object.entries(counts).map(([date, count]) => ({ date, count })));
    };

    fetchData();
  }, [user]);

  const handleMouseOver = (event, value) => {
    if (!value?.date) return;
    const rect = event.target.getBoundingClientRect();
    const count = value.count || 0;
    const label =
      count === 0
        ? `No sessions on ${value.date}`
        : `${count} session${count > 1 ? "s" : ""} on ${value.date}`;

    setTooltip({
      show: true,
      x: rect.left + rect.width / 2,
      y: rect.top,
      content: label,
    });
  };

  const handleMouseOut = () => setTooltip((t) => ({ ...t, show: false }));

  const total = totalSessions(data);

  return (
    <>
      <style>{`
        .gh-heatmap-wrap .react-calendar-heatmap text {
          fill: #7d8590;
          font-size: 9px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        }
        .gh-heatmap-wrap .react-calendar-heatmap rect {
          rx: 2;
          ry: 2;
        }
        .gh-heatmap-wrap .react-calendar-heatmap {
          overflow: visible;
        }
      `}</style>

      <div
        style={{
          background: "#0d1117",
          border: "1px solid #30363d",
          borderRadius: "6px",
          padding: "16px",
          marginTop: "24px",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
          color: "#e6edf3",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <span style={{ fontSize: "14px", color: "#e6edf3", fontWeight: 600 }}>
            {total} sessions in the last year
          </span>
          <span style={{ fontSize: "12px", color: "#7d8590" }}>
            Based on game completions
          </span>
        </div>

        {/* Heatmap */}
        <div className="gh-heatmap-wrap" style={{ overflowX: "auto" }}>
          <CalendarHeatmap
            startDate={startDate}
            endDate={today}
            values={data}
            showWeekdayLabels
            gutterSize={3}
            transformDayElement={(el, value) => {
              const fill = getColor(value?.count || 0);
              return React.cloneElement(el, {
                style: { fill, cursor: value?.date ? "pointer" : "default" },
                rx: 2,
                ry: 2,
                onMouseOver: (e) => handleMouseOver(e, value),
                onMouseOut: handleMouseOut,
              });
            }}
          />
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "4px",
            marginTop: "8px",
          }}
        >
          <span style={{ fontSize: "11px", color: "#7d8590" }}>Less</span>
          {[
            GH_COLORS.empty,
            GH_COLORS.l1,
            GH_COLORS.l2,
            GH_COLORS.l3,
            GH_COLORS.l4,
          ].map((color, i) => (
            <span
              key={i}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "2px",
                background: color,
                border: "1px solid rgba(255,255,255,0.06)",
                display: "inline-block",
              }}
            />
          ))}
          <span style={{ fontSize: "11px", color: "#7d8590" }}>More</span>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip.show && (
        <div
          ref={tooltipRef}
          style={{
            position: "fixed",
            zIndex: 9999,
            left: tooltip.x,
            top: tooltip.y - 44,
            transform: "translateX(-50%)",
            background: "#1c2128",
            border: "1px solid #444c56",
            color: "#e6edf3",
            fontSize: "12px",
            padding: "6px 10px",
            borderRadius: "6px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
          }}
        >
          {tooltip.content}
        </div>
      )}
    </>
  );
}
