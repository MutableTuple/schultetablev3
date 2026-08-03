"use client";

import Link from "next/link";
import { Brain } from "lucide-react";

export default function BrainTestBtn() {
  return (
    <Link
      href="/official-brain-test"
      className="group relative flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-3.5 hover:border-primary/40 hover:shadow-sm active:scale-[0.98] transition-all duration-200"
    >
      <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-primary text-primary-foreground">
        10 GAMES
      </span>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary flex-shrink-0 group-hover:opacity-90 transition-opacity duration-200">
        <Brain size={18} />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">Brain Test</p>
        <p className="text-xs text-muted-foreground mt-0.5">Get your full report</p>
      </div>
    </Link>
  );
}
