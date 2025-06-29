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
      <div className="stat bg-base-100 rounded-lg border border-base-300 shadow-sm p-4">
        <div className="stat-title text-xs opacity-70">Accuracy</div>
        <div className="stat-value text-info text-sm">
          {summary?.accuracy ?? "N/A"}
        </div>
      </div>

      <div className="stat bg-base-100 rounded-lg border border-base-300 shadow-sm p-4">
        <div className="stat-title text-xs opacity-70">Right Clicks</div>
        <div className="stat-value text-success text-sm">
          {formatNumber(game?.total_right_click ?? 0)}
        </div>
      </div>

      <div className="stat bg-base-100 rounded-lg border border-base-300 shadow-sm p-4">
        <div className="stat-title text-xs opacity-70">Wrong Clicks</div>
        <div className="stat-value text-error text-sm">
          {formatNumber(game?.total_wrong_click ?? 0)}
        </div>
      </div>

      <div className="stat bg-base-100 rounded-lg border border-base-300 shadow-sm p-4">
        <div className="stat-title text-xs opacity-70">Score</div>
        <div className="stat-value text-primary text-sm">
          {formatNumber(game?.score ?? 0)}
        </div>
      </div>

      {isPro && (
        <>
          <div className="stat bg-base-100 rounded-lg border border-base-300 shadow-sm p-4">
            <div className="stat-title text-xs opacity-70">
              Avg Reaction Time
            </div>
            <div className="stat-value text-warning text-sm">
              {avgReaction ?? "N/A"}ms
            </div>
          </div>

          <div className="stat bg-base-100 rounded-lg border border-base-300 shadow-sm p-4">
            <div className="stat-title text-xs opacity-70">Game Duration</div>
            <div className="stat-value text-accent text-sm">
              {durationSec ?? "N/A"}s
            </div>
          </div>

          <Link
            href={`/game-analytics/${game?.id ?? "#"}`}
            className="w-full text-left bg-base-100 border border-base-300 shadow-sm rounded-lg p-4 hover:bg-base-200 transition"
          >
            <div className="text-sm text-accent font-semibold">
              View complete data &rarr;
            </div>
          </Link>
        </>
      )}
    </div>
  );
}
