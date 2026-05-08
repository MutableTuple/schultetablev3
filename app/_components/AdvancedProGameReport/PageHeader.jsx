import Link from 'next/link';
import React from 'react'
import { LuBrain } from 'react-icons/lu';

export default function PageHeader({ isPro, user, userId }) {
  return (
    <div className="bg-base-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <LuBrain className="text-primary w-5 h-5" />
          <h1 className="text-xl font-bold">Advanced Brain Report</h1>
          {isPro && (
            <span className="badge badge-primary badge-sm font-semibold">
              PRO
            </span>
          )}
        </div>
        <p className="text-xs opacity-60 leading-relaxed max-w-lg">
          Deep cognitive performance analysis based on your last{" "}
          <strong>10 games</strong> — speed, consistency, fatigue, stability,
          drift, and long-term trends.
        </p>
      </div>
      <Link href="/play" className="btn btn-primary btn-sm shrink-0">
        Play More Games
      </Link>
    </div>
  );
}
