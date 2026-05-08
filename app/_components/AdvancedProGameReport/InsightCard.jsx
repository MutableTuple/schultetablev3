import React from 'react'
import { LuBrain } from 'react-icons/lu';

export default function InsightCard({ insight, isPro }) {
  return (
    <div className="bg-base-200 rounded-xl p-4 border border-base-300">
      <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
        <LuBrain className="w-4 h-4 text-primary" />
        Overall Insight
      </h3>
      {isPro ? (
        <p className="text-sm leading-relaxed">{insight}</p>
      ) : (
        <div className="space-y-2">
          <p className="text-sm blur-[5px] select-none opacity-80 leading-relaxed">
            Your performance shows a distinct pattern that separates
            top-percentile players from the rest. The key factor is not raw
            speed but cognitive recovery between rounds.
          </p>
          <p className="text-xs opacity-50 text-center pt-1">
            Unlock Pro to read your full insight
          </p>
        </div>
      )}
    </div>
  );
}

