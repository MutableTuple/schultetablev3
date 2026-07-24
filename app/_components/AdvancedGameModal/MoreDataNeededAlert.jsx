import React from "react";
import { BrainCircuit } from "lucide-react";

export default function MoreDataNeededAlert({ gameCount }) {
  const remaining = Math.max(0, 10 - gameCount);

  return (
    <div className="p-5 rounded-xl border border-border/60 bg-muted text-center space-y-4">
      {/* Title */}
      <h2 className="text-lg font-semibold text-foreground">
        More Data Needed
      </h2>

      {/* Message */}
      <p className="text-sm text-muted-foreground leading-relaxed">
        Play <strong>10 total games</strong> to unlock your personalized
        cognitive insights and accuracy breakdown.
      </p>

      {/* Loading / analyzing section */}
      <div className="flex flex-col items-center gap-2 pt-2 pb-1">
        <div className="relative flex items-center justify-center w-12 h-12">
          <span className="absolute inline-flex h-full w-full rounded-full bg-primary/20 animate-ping" />
          <span className="absolute inline-flex h-8 w-8 rounded-full bg-primary/10" />
          <BrainCircuit className="relative w-6 h-6 text-primary animate-pulse" />
        </div>
        <p className="text-xs text-muted-foreground italic">
          Meanwhile, we’re analyzing your patterns…
        </p>
      </div>

      {/* Remaining games */}
      <div className="text-xs text-muted-foreground">
        just <strong>{remaining}</strong> more game{remaining !== 1 ? "s" : ""}{" "}
        needed
      </div>
    </div>
  );
}
