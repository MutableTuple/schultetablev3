"use client";

import Link from "next/link";
import { BarChart2 } from "lucide-react";

export default function AnalyticsBtn() {
  return (
    <Link
      href="/my-profile/analytics"
      className="group flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-3.5 hover:border-secondary/40 hover:shadow-sm active:scale-[0.98] transition-all duration-200"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground flex-shrink-0 group-hover:opacity-90 transition-opacity duration-200">
        <BarChart2 size={18} />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">Analytics</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          View performance insights
        </p>
      </div>
    </Link>
  );
}
