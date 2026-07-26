"use client";
import Link from "next/link";
import React from "react";
import {
  Zap,
  Ban,
  BarChart3,
  Calendar,
  BadgeCheck,
  Trophy,
  Infinity as InfinityIcon,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: Ban,
    title: "No ads, ever",
    desc: "A completely distraction-free experience.",
  },
  {
    icon: BarChart3,
    title: "Advanced Brain Report",
    desc: "Deep analysis of speed, consistency, focus, and fatigue.",
  },
  {
    icon: Calendar,
    title: "Monthly Brain Report",
    desc: "Fresh insights on your progress, delivered every month.",
  },
  {
    icon: BadgeCheck,
    title: "Pro checkmark",
    desc: "Stand out as a Pro player on the leaderboard and profile.",
  },
  {
    icon: Trophy,
    title: "Global percentile rank",
    desc: "See exactly how you compare against players worldwide.",
  },
  {
    icon: InfinityIcon,
    title: "Lifetime access",
    desc: "Pay once, use forever — no subscriptions, ever.",
  },
];

export default function UpgradeToProOnLeaderboardButton() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[var(--ink)] text-background border border-primary/25 p-5 space-y-4">
      {/* shine sweep — reuses your existing .shine / @keyframes shineMove */}
      <div className="shine pointer-events-none" />

      <div className="relative flex items-center justify-between gap-3">
        <p className="text-xl font-black leading-tight">
          Upgrade to{" "}
          <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
            Pro
          </span>
        </p>
        <div className="inline-flex items-center gap-1 bg-primary/15 text-primary text-[10px] font-bold px-2 py-1 rounded-full shrink-0">
          <Zap size={10} /> 75% OFF
        </div>
      </div>

      <div className="relative space-y-2.5">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-3">
            <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Icon size={15} className="text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold leading-tight">{title}</p>
              <p className="text-xs text-background/50 leading-snug">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <Button
        render={<Link href="/get-pro" />}
        nativeButton={false}
        className="relative w-full py-2.5 text-sm font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
      >
        <Lock size={13} />
        Get Pro Now
      </Button>
      <p className="relative flex items-center justify-center gap-1 text-[10px] text-background/40">
        <Lock size={9} /> Secure one-time payment
      </p>
    </div>
  );
}
