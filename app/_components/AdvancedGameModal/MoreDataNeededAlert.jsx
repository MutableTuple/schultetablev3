import React from "react";

export default function MoreDataNeededAlert({ gameCount }) {
  const remaining = Math.max(0, 10 - gameCount);

  return (
    <div className="p-5 rounded-xl border border-base-300/60 bg-base-200 text-center space-y-4">
      {/* Title */}
      <h2 className="text-lg font-semibold text-base-content/90">
        More Data Needed
      </h2>

      {/* Message */}
      <p className="text-sm text-base-content/70 leading-relaxed">
        Play <strong>10 total games</strong> to unlock your personalized
        cognitive insights and accuracy breakdown.
      </p>

      {/* Loading / analyzing section */}
      <div className="flex flex-col items-center gap-2 pt-2 pb-1">
        <span className="loading loading-dots loading-md text-primary"></span>
        <p className="text-xs text-base-content/60 italic">
          Meanwhile, we’re analyzing your patterns…
        </p>
      </div>

      {/* Remaining games    */}
      <div className="text-xs opacity-70">
        just <strong>{remaining}</strong> more game{remaining !== 1 ? "s" : ""}{" "}
        needed
      </div>
    </div>
  );
}
