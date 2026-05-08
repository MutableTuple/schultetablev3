import React from "react";
import { MdOutlineSportsScore } from "react-icons/md";
import { FaGamepad } from "react-icons/fa";
import { IoIosGrid } from "react-icons/io";
import { GiArcheryTarget } from "react-icons/gi";
import { BsClockHistory } from "react-icons/bs";
import { BsLightningCharge } from "react-icons/bs";
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
    <div className="border border-base-300 bg-base-100">
      {/* Score Header */}
      <div className="border-b border-base-300 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MdOutlineSportsScore className="text-primary text-lg" />
          <span className="text-xs font-bold uppercase tracking-widest text-base-content/50">
            Score
          </span>
        </div>
        <span className="text-2xl font-black tabular-nums">
          {formatNumber(score)}
        </span>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 divide-x divide-base-300 border-b border-base-300">
        <div className="flex flex-col items-center justify-center px-3 py-3 gap-1">
          <BsClockHistory className="text-base-content/40 text-sm" />
          <span className="text-xs text-base-content/50 font-semibold uppercase tracking-wider">
            Time
          </span>
          <span className="text-base font-black tabular-nums">{timeSec}s</span>
        </div>

        <div className="flex flex-col items-center justify-center px-3 py-3 gap-1">
          <GiArcheryTarget className="text-base-content/40 text-sm" />
          <span className="text-xs text-base-content/50 font-semibold uppercase tracking-wider">
            Accuracy
          </span>
          <span className="text-base font-black tabular-nums">{accuracy}%</span>
        </div>

        <div className="flex flex-col items-center justify-center px-3 py-3 gap-1">
          <BsLightningCharge className="text-base-content/40 text-sm" />
          <span className="text-xs text-base-content/50 font-semibold uppercase tracking-wider">
            Avg React
          </span>
          <span className="text-base font-black tabular-nums">
            {avgReactionTimeMs}ms
          </span>
        </div>
      </div>

      {/* Meta Row */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-base-content/60">
          <IoIosGrid className="text-base" />
          <span>
            {gridSize}×{gridSize}
          </span>
        </div>
        <div className="w-px h-3 bg-base-300" />
        <div className="flex items-center gap-1.5 text-xs font-semibold text-base-content/60 capitalize">
          <FaGamepad className="text-base" />
          <span>{mode} mode</span>
        </div>
      </div>
    </div>
  );
}
