import Link from "next/link";
import React from "react";
import { LuBrain } from "react-icons/lu";
import { TbArrowUpRight } from "react-icons/tb";

export default function PageHeader({ isPro, user, userId }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <span className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center shrink-0">
          <LuBrain size={17} />
        </span>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-base font-bold text-foreground tracking-tight">
              Advanced Brain Report
            </h1>
            {isPro && (
              <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest">
                PRO
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-lg">
            Deep cognitive performance analysis based on your last{" "}
            <strong className="text-foreground">10 games</strong> — speed,
            consistency, fatigue, stability, drift, and long-term trends.
          </p>
        </div>
      </div>
      <Link
        href="/"
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-foreground text-background text-xs font-semibold hover:bg-foreground/85 transition-all shrink-0 whitespace-nowrap"
      >
        Play More Games
        <TbArrowUpRight size={13} />
      </Link>
    </div>
  );
}
