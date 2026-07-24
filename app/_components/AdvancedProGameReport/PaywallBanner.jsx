import React from "react";
import {
  LuLock,
  LuChartBar,
  LuTrendingUp,
  LuTarget,
  LuMap,
  LuStar,
  LuShield,
} from "react-icons/lu";
import PaymentLink from "../AdvancedGameModal/PaymentLink";

const COLOR_MAP = {
  primary: { bg: "bg-primary/15", text: "text-primary" },
  success: { bg: "bg-success/15", text: "text-success" },
  warning: { bg: "bg-warning/15", text: "text-warning" },
};

const FEATURES = [
  {
    Icon: LuChartBar,
    label: "Deep Metrics",
    desc: "All 10-game insights",
    color: "primary",
  },
  {
    Icon: LuTrendingUp,
    label: "Trend Charts",
    desc: "Track your progress",
    color: "success",
  },
  {
    Icon: LuTarget,
    label: "AI Insights",
    desc: "Know what slows you down",
    color: "warning",
  },
  {
    Icon: LuMap,
    label: "Improvement",
    desc: "Your personal roadmap",
    color: "primary",
  },
];

export default function PaywallBanner({ user, userId }) {
  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-foreground text-background p-6 sm:p-8">
        {/* ambient glow */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          {/* Header */}
          <div className="flex items-start gap-5">
            <div className="relative shrink-0">
              <div className="absolute inset-0 rounded-full bg-primary/25 blur-md" />
              <div className="relative w-16 h-16 rounded-full bg-background/5 border border-primary/30 flex items-center justify-center">
                <LuLock className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-background/50 mb-2">
                Limited Preview
              </p>
              <h3 className="text-3xl sm:text-4xl font-extrabold leading-tight text-background">
                Your full cognitive report
                <br />
                is <span className="text-primary">locked.</span>
              </h3>
              <p className="text-background/60 mt-3 max-w-md leading-relaxed">
                Complete more games to unlock deep insights, personalized
                trends, and your improvement roadmap.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-background/10 my-6" />

          {/* Feature grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {FEATURES.map(({ Icon, label, desc, color }) => {
              const c = COLOR_MAP[color];
              return (
                <div key={label}>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${c.bg}`}
                  >
                    <Icon className={`w-5 h-5 ${c.text}`} />
                  </div>
                  <p className="font-bold text-background">{label}</p>
                  <p className="text-sm text-background/50 mt-1 leading-snug">
                    {desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="h-px bg-background/10 my-6" />

          {/* Bottom row */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-3 rounded-xl border border-primary/25 bg-background/5 px-4 py-3 flex-1">
              <div className="w-9 h-9 rounded-full border border-primary/40 flex items-center justify-center shrink-0">
                <LuStar className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-bold text-background text-sm">
                  One payment. Forever access.
                </p>
                <p className="text-background/50 text-xs">
                  No subscription. No hidden fees.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="border-l border-background/10 pl-5">
                <p className="text-4xl font-extrabold text-background leading-none">
                  $4.99
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mt-1">
                  Lifetime access
                </p>
              </div>
              <PaymentLink user={user} userId={userId} />
            </div>
          </div>
        </div>
      </div>

      {/* Trust line — sits on the page background, not the ink card, so it
          uses theme tokens instead of the fixed background/foreground pair */}
      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
        <LuShield className="w-3.5 h-3.5" />
        Secure payment
        <span aria-hidden="true">•</span>
        7-day money back guarantee
      </div>
    </div>
  );
}
