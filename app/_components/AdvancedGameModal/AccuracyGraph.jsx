"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { supabase } from "@/app/_lib/supabase";
import { FaQuestionCircle } from "react-icons/fa";
import { FaArrowTrendUp, FaArrowTrendDown, FaMinus } from "react-icons/fa6";

/**
 * AccuracyGraph
 * Props:
 *  - game: game JSON (must include clicks array with { correct:boolean, timeTakenMs })
 *  - user: user array (your usual shape user[0].id)
 *  - openProModal: callback
 */
export default function AccuracyGraph({ game = {}, user, openProModal }) {
  const [intel, setIntel] = useState(null);
  const [loading, setLoading] = useState(true);
  const svgRef = useRef(null);

  const clicks = game?.clicks || [];

  // Build per-click accuracy safely
  const accuracyOverTime = useMemo(() => {
    if (!clicks.length) return [];
    let correctSoFar = 0;
    return clicks.map((c, i) => {
      if (c && c.correct) correctSoFar += 1;
      const accuracy = (correctSoFar / (i + 1)) * 100;
      return {
        idx: i,
        x: clicks.length > 1 ? (i / (clicks.length - 1)) * 100 : 0,
        y: 100 - accuracy, // SVG invert (0 top)
        accuracy,
        correct: !!c.correct,
        timeTakenMs: c.timeTakenMs ?? null,
      };
    });
  }, [clicks]);

  // Smooth path helper (Catmull-Rom -> Bezier)
  const buildSmoothPath = (pts) => {
    if (!pts.length) return "";
    if (pts.length === 1) {
      const p = pts[0];
      return `M ${p.x},${p.y} L ${p.x},${p.y}`;
    }
    // For small sets use polyline fallback
    if (pts.length < 3) {
      return `M ${pts.map((p) => `${p.x},${p.y}`).join(" L ")}`;
    }
    const cr = (i) => {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1] || p1;
      const p3 = pts[i + 2] || p2;
      const tension = 0.5;

      const x1 = p1.x + ((p2.x - p0.x) * tension) / 6;
      const y1 = p1.y + ((p2.y - p0.y) * tension) / 6;
      const x2 = p2.x - ((p3.x - p1.x) * tension) / 6;
      const y2 = p2.y - ((p3.y - p1.y) * tension) / 6;

      return { x1, y1, x2, y2 };
    };

    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const c = cr(i);
      const p2 = pts[i + 1];
      d += ` C ${c.x1},${c.y1} ${c.x2},${c.y2} ${p2.x},${p2.y}`;
    }
    return d;
  };

  // Fetch RPC intelligence (only when logged)
  useEffect(() => {
    async function fetchIntel() {
      if (!user?.[0]?.id) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase.rpc("calc_accuracy_intel", {
          game,
          user_id: user[0].id,
        });
        if (!error) setIntel(data);
      } catch (err) {
        // console.error("RPC error", err);
      } finally {
        setLoading(false);
      }
    }
    fetchIntel();
  }, [user, game]);

  const trend = intel?.trend ?? null;
  const tier = intel?.tier;
  const message = intel?.message;
  const percentile = intel?.percentile;
  const past = intel?.past_7 || [];
  const bestStreak = intel?.best_streak;
  const worstStreak = intel?.worst_streak;

  // Draw animation: set stroke-dasharray/dashoffset for path
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const path = svg.querySelector("path.current");
    if (!path) return;
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    // trigger draw
    requestAnimationFrame(() => {
      path.style.transition = "stroke-dashoffset 700ms ease-out";
      path.style.strokeDashoffset = "0";
    });
  }, [accuracyOverTime]);

  // prepare points scaled into viewBox coordinates (0..100)
  const pts = accuracyOverTime.map((p) => ({ x: p.x, y: p.y }));

  // Prepare flat polyline fallback string
  const polyPoints = pts.map((p) => `${p.x},${p.y}`).join(" ");

  // motivational short message if RPC missing
  const localMessage =
    message ||
    (accuracyOverTime.length
      ? (() => {
          const last = accuracyOverTime[accuracyOverTime.length - 1].accuracy;
          if (last >= 93) return "Your accuracy is razor-sharp — phenomenal.";
          if (last >= 85) return "Excellent — you're in the zone.";
          if (last >= 75) return "Nice work — steady and focused.";
          if (last >= 60) return "You're warming up — keep practicing.";
          return "Focus dips happened — try slower & steady runs.";
        })()
      : "Play a round to see accuracy timeline.");

  // helper counts
  const total = clicks.length;
  const correctCount = clicks.filter((c) => c.correct).length;
  const mistakes = total - correctCount;

  // Past-lines: for display (flat horizontal lines at percent)
  const pastLines = past
    .filter((p) => p !== null)
    .map((acc, idx) => ({
      color: `hsl(${(idx * 60) % 360} 80% 55%)`,
      y: 100 - acc,
    }));

  return (
    <div className="w-full p-3 rounded-xl bg-base-200 text-center">
      {/* header */}
      <div className="flex items-center justify-between text-xs mb-1">
        <div className="flex items-center gap-1">
          <span className="text-base-content/70 font-medium">Accuracy</span>
          <div
            className="tooltip"
            data-tip="Accuracy = % correct clicks during the game. Higher = better focus."
          >
            <FaQuestionCircle className="text-[10px] opacity-70" />
          </div>
        </div>

        {!user || loading ? (
          <span className="text-[10px] text-base-content/50">---</span>
        ) : trend === null ? (
          <span className="text-[10px] text-base-content/50">First game</span>
        ) : trend > 0 ? (
          <span className="flex items-center gap-1 text-green-500">
            <FaArrowTrendUp /> +{Number(trend).toFixed(1)}%
          </span>
        ) : trend < 0 ? (
          <span className="flex items-center gap-1 text-red-500">
            <FaArrowTrendDown /> {Number(trend).toFixed(1)}%
          </span>
        ) : (
          <span className="flex items-center gap-1 text-gray-500">
            <FaMinus /> same
          </span>
        )}
      </div>

      {/* SVG chart */}
      <div className="relative">
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          className="w-full h-28"
          preserveAspectRatio="none"
        >
          {/* past flat lines */}
          {pastLines.map((pl, i) => (
            <line
              key={i}
              x1="0"
              x2="100"
              y1={pl.y}
              y2={pl.y}
              stroke={pl.color}
              strokeWidth="1.2"
              opacity="0.22"
            />
          ))}

          {/* grid (light) */}
          <g opacity="0.06" stroke="#000">
            <line x1="0" x2="100" y1="25" y2="25" />
            <line x1="0" x2="100" y1="50" y2="50" />
            <line x1="0" x2="100" y1="75" y2="75" />
          </g>

          {/* smooth path fallback to path */}
          {pts.length > 0 && (
            <path
              d={buildSmoothPath(pts)}
              className="current"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* red sparks for mistakes */}
          {accuracyOverTime
            .filter((p) => p.correct === false)
            .map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="1.6" fill="#ef4444" />
                {/* small burst lines */}
                <line
                  x1={p.x - 1.8}
                  x2={p.x + 1.8}
                  y1={p.y - 1.8}
                  y2={p.y + 1.8}
                  stroke="#ef4444"
                  strokeWidth="0.5"
                  opacity="0.6"
                />
              </g>
            ))}

          {/* hoverable invisible rect for future hover interactions */}
        </svg>

        {/* tooltip: on hover could be added - skipping heavy events for now */}
      </div>

      {/* summary row */}
      <div className="flex items-center justify-between gap-2 mt-2 text-[12px]">
        <div className="flex flex-col items-start">
          <div className="text-[13px] font-semibold">
            {total ? `${((correctCount / total) * 100).toFixed(0)}%` : "—"}
          </div>
          <div className="text-[11px] text-base-content/60">
            {correctCount} correct • {mistakes} mistakes
          </div>
        </div>

        <div className="text-right">
          {tier && (
            <div className="text-[12px] text-green-400 font-medium">{tier}</div>
          )}
          {percentile !== undefined && percentile !== null && (
            <div className="text-[11px] text-primary">
              {Number(percentile).toFixed(0)}% better
            </div>
          )}
        </div>
      </div>

      {/* motivational message */}
      <p className="mt-2 text-[11px] text-base-content/60 italic">
        {localMessage}
      </p>

      {/* RPC message if returned */}
      {message && message !== localMessage && (
        <p className="mt-1 text-[11px] text-base-content/60 italic">
          {message}
        </p>
      )}

      {/* PRO CTA */}
      {!user ? (
        <button
          onClick={openProModal}
          className="mt-3 text-[12px] text-primary underline opacity-80 hover:opacity-100"
        >
          Log in to unlock full accuracy history →
        </button>
      ) : (
        <button
          onClick={openProModal}
          className="mt-3 text-[12px] text-primary underline opacity-80 hover:opacity-100"
        >
          Unlock advanced accuracy analytics →
        </button>
      )}
    </div>
  );
}
