"use client";

import React from "react";
import {
  Brain,
  Zap,
  Target,
  Shuffle,
  Calculator,
  Clock,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

const FEATURES = [
  { icon: Zap, label: "Reaction speed", desc: "How fast you find each target" },
  { icon: Target, label: "Focus & attention", desc: "Accuracy under time pressure" },
  { icon: Shuffle, label: "Pattern switching", desc: "Numbers, letters, words, emoji" },
  { icon: Calculator, label: "Mental math", desc: "Solve, then locate, then tap" },
];

const FACTS = [
  { icon: Clock, label: "~5 minutes" },
  { icon: ShieldCheck, label: "10 rounds" },
  { icon: TrendingUp, label: "Full report" },
];

export default function BrainTestBranding() {
  return (
    <aside className="w-full xl:w-[280px] xl:shrink-0 flex flex-col gap-5">
      <div className="rounded-3xl border border-border bg-card p-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary shrink-0">
            <Brain size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Schulte Table
            </p>
            <h1 className="text-lg font-black text-foreground leading-tight">
              The Brain Test
            </h1>
          </div>
        </div>

        <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
          A single, guided cognitive assessment — 10 rounds across different
          grid sizes, difficulties, and game modes. Same conditions for
          everyone, so your result actually means something.
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {FACTS.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-semibold text-foreground"
            >
              <Icon size={11} className="text-primary" />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
          What we measure
        </p>
        <div className="flex flex-col gap-3">
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                <Icon size={14} />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">{label}</p>
                <p className="text-[11px] text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
