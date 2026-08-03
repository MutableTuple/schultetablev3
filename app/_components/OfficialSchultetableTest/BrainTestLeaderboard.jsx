"use client";

import React, { useEffect, useState } from "react";
import { Trophy, Loader2, Medal } from "lucide-react";

const RANK_STYLES = {
  1: "bg-[#FFD700]/15 text-[#a1780a] border-[#FFD700]/40",
  2: "bg-[#C0C0C0]/20 text-muted-foreground border-[#C0C0C0]/40",
  3: "bg-[#CD7F32]/15 text-[#8a4b1f] border-[#CD7F32]/40",
};

export default function BrainTestLeaderboard({ refreshKey }) {
  const [entries, setEntries] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/brain-test/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setEntries(data.entries || []);
      })
      .catch(() => {
        if (!cancelled) setEntries([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return (
    <aside className="w-full xl:w-[280px] xl:shrink-0 flex flex-col gap-3">
      <div className="rounded-3xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Trophy size={16} />
          </div>
          <div>
            <p className="text-sm font-black text-foreground leading-none">Top 10</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Brain Test leaderboard</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : entries && entries.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            {entries.map((entry, i) => {
              const rank = i + 1;
              return (
                <div
                  key={entry.id}
                  className="flex items-center gap-2.5 rounded-2xl px-2.5 py-2 hover:bg-muted/60 transition-colors"
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-bold shrink-0 ${
                      RANK_STYLES[rank] || "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {rank <= 3 ? <Medal size={11} /> : rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {entry.display_name || "Guest"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {entry.avg_reaction_ms}ms avg · {entry.overall_accuracy}%
                    </p>
                  </div>
                  <span className="text-xs font-black text-primary shrink-0">
                    {entry.total_score}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-xs text-muted-foreground">
              No completed tests yet — be the first to finish all 10 rounds!
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
