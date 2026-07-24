"use client";
import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  Target,
  Clock,
} from "lucide-react";

export default function InstantFeedback({ feedback }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!feedback) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), 2800);
    return () => clearTimeout(t);
  }, [feedback]);

  if (!feedback) return null;

  const { score, accuracy, scoreDelta, timeMs } = feedback;
  const improved = scoreDelta !== null && scoreDelta > 1;
  const worsened = scoreDelta !== null && scoreDelta < -1;
  const DeltaIcon = improved ? TrendingUp : worsened ? TrendingDown : Minus;
  const deltaTone = improved
    ? "text-success"
    : worsened
      ? "text-warning"
      : "text-muted-foreground";

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-2xl border border-border bg-card px-4 py-2.5 shadow-sm transition-all duration-300 ease-out ${
        show
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-1.5 text-lg font-black text-foreground tabular-nums">
        <Star size={14} className="text-muted-foreground" />
        {score?.toLocaleString?.() ?? score}
      </div>

      <div className="h-6 w-px bg-border" />

      <div className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
        <Target size={14} />
        {Math.round(accuracy)}%
      </div>

      {typeof timeMs === "number" && (
        <>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
            <Clock size={14} />
            {(timeMs / 1000).toFixed(2)}s
          </div>
        </>
      )}

      {scoreDelta !== null && (
        <div
          className={`flex items-center gap-1 text-xs font-bold ${deltaTone}`}
        >
          <DeltaIcon size={12} />
          {scoreDelta > 0 ? "+" : ""}
          {scoreDelta}%
        </div>
      )}
    </div>
  );
}
