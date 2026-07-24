import React from "react";
import { Trophy, Gamepad2, Grid3x3, Target, Clock, Zap } from "lucide-react";
import { formatNumber } from "@/app/_utils/formatNumber";

export default function PerformanceInfo({
  score,
  timeSec,
  accuracy,
  mode,
  gridSize,
  avgReactionTimeMs,
}) {
  return (
    <div className="border border-border bg-card rounded-2xl overflow-hidden">
      {/* Score Header */}
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="text-primary" size={18} />
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Score
          </span>
        </div>
        <span className="text-2xl font-black tabular-nums text-foreground">
          {formatNumber(score)}
        </span>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        <div className="flex flex-col items-center justify-center px-3 py-3 gap-1">
          <Clock className="text-muted-foreground" size={14} />
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            Time
          </span>
          <span className="text-base font-black tabular-nums text-foreground">
            {timeSec}s
          </span>
        </div>

        <div className="flex flex-col items-center justify-center px-3 py-3 gap-1">
          <Target className="text-muted-foreground" size={14} />
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            Accuracy
          </span>
          <span className="text-base font-black tabular-nums text-foreground">
            {accuracy}%
          </span>
        </div>

        <div className="flex flex-col items-center justify-center px-3 py-3 gap-1">
          <Zap className="text-muted-foreground" size={14} />
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            Avg React
          </span>
          <span className="text-base font-black tabular-nums text-foreground">
            {avgReactionTimeMs}ms
          </span>
        </div>
      </div>

      {/* Meta Row */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <Grid3x3 size={15} />
          <span>
            {gridSize}×{gridSize}
          </span>
        </div>
        <div className="w-px h-3 bg-border" />
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground capitalize">
          <Gamepad2 size={15} />
          <span>{mode} mode</span>
        </div>
      </div>
    </div>
  );
}
