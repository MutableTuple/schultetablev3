// GameList.jsx
import { formatNumber } from "@/app/_utils/formatNumber";
import Link from "next/link";
import React from "react";
import { Lock, ArrowRight } from "lucide-react";

const Stat = React.memo(function Stat({ label, value, locked }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      {locked ? (
        <div className="flex items-center gap-1">
          <Lock className="w-3 h-3 text-muted-foreground" />
          <span className="text-sm font-semibold text-muted-foreground">
            Pro
          </span>
        </div>
      ) : (
        <span className="text-sm font-semibold text-foreground">{value}</span>
      )}
    </div>
  );
});

function GameList({ summary, game, isPro, avgReaction, durationSec }) {
  return (
    <div className=" overflow-hidden">
      {/* Row 1 — always visible */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-border">
        <div className="px-5 py-4">
          <Stat label="Accuracy" value={summary?.accuracy ?? "—"} />
        </div>
        <div className="px-5 py-4">
          <Stat
            label="Right Clicks"
            value={formatNumber(game?.total_right_click ?? 0)}
          />
        </div>
        <div className="px-5 py-4">
          <Stat
            label="Wrong Clicks"
            value={formatNumber(game?.total_wrong_click ?? 0)}
          />
        </div>
        <div className="px-5 py-4">
          <Stat label="Score" value={formatNumber(game?.score ?? 0)} />
        </div>
      </div>

      {/* Row 2 — pro stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-y sm:divide-y-0 divide-border border-t border-border">
        <div className="px-5 py-4">
          <Stat
            label="Avg Reaction"
            value={avgReaction ? `${avgReaction} ms` : "—"}
            locked={!isPro}
          />
        </div>
        <div className="px-5 py-4">
          <Stat
            label="Duration"
            value={durationSec ? `${durationSec}s` : "—"}
            locked={!isPro}
          />
        </div>

        {isPro ? (
          <Link
            href={`/game-analytics/${game?.id ?? "#"}`}
            className="px-5 py-4 flex items-center justify-between group hover:bg-muted transition-colors"
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Full Report</span>
              <span className="text-sm font-semibold text-foreground">
                View Analysis
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ) : (
          <Link
            href="/get-pro"
            className="px-5 py-4 flex items-center justify-between group hover:bg-primary/5 transition-colors"
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Full Report</span>
              <div className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-primary" />
                <span className="text-sm font-semibold text-primary">
                  Unlock Pro
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-primary/70 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  );
}

export default React.memo(GameList);
