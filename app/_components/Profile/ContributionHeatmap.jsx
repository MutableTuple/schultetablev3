"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { subDays } from "date-fns";
import { supabase } from "@/app/_lib/supabase";
import { TbFlame } from "react-icons/tb";
import { RiCalendarLine } from "react-icons/ri";

// ─── brand-accent scale (orange is identical in light/dark, safe to hardcode) ──

const SCALE = {
  empty: "var(--muted)",
  l1: "rgba(249, 115, 22, 0.25)",
  l2: "rgba(249, 115, 22, 0.45)",
  l3: "rgba(249, 115, 22, 0.7)",
  l4: "#f97316",
};

const getColor = (count) => {
  if (!count || count === 0) return SCALE.empty;
  if (count >= 5) return SCALE.l4;
  if (count >= 3) return SCALE.l3;
  if (count >= 2) return SCALE.l2;
  return SCALE.l1;
};

const toISODate = (d) => d.toISOString().split("T")[0];

export default function ContributionHeatmap({ user }) {
  const [data, setData] = useState([]);
  const [tooltip, setTooltip] = useState({
    show: false,
    x: 0,
    y: 0,
    content: "",
  });

  const today = useMemo(() => new Date(), []);
  const startDate = useMemo(() => subDays(today, 365), [today]);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;

    const fetchData = async () => {
      const { data: rows, error } = await supabase
        .from("UniversalGameStats")
        .select("created_at")
        .eq("user_id", user.id)
        .gte("created_at", startDate.toISOString());
      if (error || cancelled) return;

      const counts = {};
      rows?.forEach((row) => {
        const date = toISODate(new Date(row.created_at));
        counts[date] = (counts[date] || 0) + 1;
      });
      setData(Object.entries(counts).map(([date, count]) => ({ date, count })));
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [user?.id, startDate]);

  const handleMouseOver = useCallback((event, value) => {
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
  }, []);

  const handleMouseOut = useCallback(
    () => setTooltip((t) => ({ ...t, show: false })),
    [],
  );

  // single pass over `data` for total/activeDays/dateMap, then one 365-day walk for streak
  const { total, activeDays, streak } = useMemo(() => {
    let total = 0;
    let activeDays = 0;
    const dateMap = {};

    data.forEach((d) => {
      const count = d.count || 0;
      total += count;
      if (count > 0) activeDays++;
      dateMap[d.date] = count;
    });

    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const d = toISODate(subDays(today, i));
      if (dateMap[d]) streak++;
      else break;
    }

    return { total, activeDays, streak };
  }, [data, today]);

  return (
    <>
      <style>{`
        .theme-heatmap .react-calendar-heatmap text {
          fill: var(--muted-foreground);
          font-size: 9px;
        }
        .theme-heatmap .react-calendar-heatmap rect {
          rx: 3;
          ry: 3;
        }
        .theme-heatmap .react-calendar-heatmap {
          overflow: visible;
        }
      `}</style>

      <div className="w-full">
        {/* Stat row */}
        <div className="grid grid-cols-3 divide-x divide-border border border-border rounded-xl overflow-hidden mb-5">
          {[
            { label: "Sessions this year", value: total, Icon: RiCalendarLine },
            { label: "Active days", value: activeDays, Icon: TbFlame },
            { label: "Current streak", value: `${streak}d`, Icon: TbFlame },
          ].map((s) => (
            <div
              key={s.label}
              className="px-4 py-3 bg-muted flex flex-col gap-0.5"
            >
              <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-widest">
                {s.label}
              </span>
              <span className="text-lg font-bold text-foreground tabular-nums">
                {s.value}
              </span>
            </div>
          ))}
        </div>

        {/* Heatmap wrapper — scrollable on mobile */}
        <div
          className="theme-heatmap bg-card border border-border rounded-2xl p-4 overflow-x-auto"
          style={{ minWidth: 0 }}
        >
          <div style={{ minWidth: 600 }}>
            <CalendarHeatmap
              startDate={startDate}
              endDate={today}
              values={data}
              showWeekdayLabels
              gutterSize={3}
              transformDayElement={(el, value) => {
                const fill = getColor(value?.count || 0);
                return React.cloneElement(el, {
                  style: {
                    fill,
                    cursor: value?.date ? "pointer" : "default",
                    transition: "fill 0.15s",
                  },
                  rx: 3,
                  ry: 3,
                  onMouseOver: (e) => handleMouseOver(e, value),
                  onMouseOut: handleMouseOut,
                });
              }}
            />
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-1.5 mt-3">
            <span className="text-[10px] text-muted-foreground font-medium">
              Less
            </span>
            {[SCALE.empty, SCALE.l1, SCALE.l2, SCALE.l3, SCALE.l4].map(
              (color, i) => (
                <span
                  key={i}
                  className="w-3 h-3 rounded-sm inline-block border border-border/60"
                  style={{ background: color }}
                />
              ),
            )}
            <span className="text-[10px] text-muted-foreground font-medium">
              More
            </span>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip.show && (
        <div
          className="fixed z-[9999] bg-popover text-popover-foreground border border-border text-xs px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y - 44,
            transform: "translateX(-50%)",
          }}
        >
          {tooltip.content}
        </div>
      )}
    </>
  );
}
