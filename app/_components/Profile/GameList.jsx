import { formatNumber } from "@/app/_utils/formatNumber";
import Link from "next/link";
import React from "react";

export default function GameList({
  summary,
  game,
  isPro,
  avgReaction,
  durationSec,
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="stat bg-base-200 rounded-lg border  border-base-300  p-4">
        <div className="stat-title text-xs opacity-70">Accuracy</div>
        <div className="stat-value text-info text-base">
          {summary?.accuracy ?? "N/A"}
        </div>
      </div>

      <div className="stat bg-base-200 rounded-lg border border-base-300  p-4">
        <div className="stat-title text-xs opacity-70">Right Clicks</div>
        <div className="stat-value text-success text-base">
          {formatNumber(game?.total_right_click ?? 0)}
        </div>
      </div>

      <div className="stat bg-base-200 rounded-lg border border-base-300  p-4">
        <div className="stat-title text-xs opacity-70">Wrong Clicks</div>
        <div className="stat-value text-error text-base">
          {formatNumber(game?.total_wrong_click ?? 0)}
        </div>
      </div>

      <div className="stat bg-base-200 rounded-lg border border-base-300  p-4">
        <div className="stat-title text-xs opacity-70">Score</div>
        <div className="stat-value text-primary text-base">
          {formatNumber(game?.score ?? 0)}
        </div>
      </div>

      {isPro && (
        <>
          <div className="stat bg-base-200 rounded-lg border border-base-300  p-4">
            <div className="stat-title text-xs opacity-70">
              Avg Reaction Time
            </div>
            <div className="stat-value text-warning text-base">
              {avgReaction ?? "N/A"}ms
            </div>
          </div>

          <div className="stat bg-base-200 rounded-lg border border-base-300  p-4">
            <div className="stat-title text-xs opacity-70">Game Duration</div>
            <div className="stat-value text-accent text-base">
              {durationSec ?? "N/A"}s
            </div>
          </div>

          <Link
            href={`/game-analytics/${game?.id ?? "#"}`}
            className="w-full text-left bg-base-200 border border-base-300  rounded-lg p-4 hover:bg-base-200 transition"
          >
            <div className="text-base text-accent font-semibold">
              View complete Analysis &rarr;
            </div>
          </Link>
        </>
      )}
    </div>
  );
}
