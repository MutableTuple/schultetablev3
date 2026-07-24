"use client";
import React, { useMemo } from "react";
import { LuBrain, LuLock, LuSparkles } from "react-icons/lu";

// ─── 3-arc semi-circle gauge ──────────────────────────────────────────────────

function SemiGauge({ percent, color = "var(--success)" }) {
  const r = 52;
  const cx = 70;
  const cy = 70;
  const circ = Math.PI * r;
  const dash = (percent / 100) * circ;

  return (
    <div
      className="relative flex flex-col items-center justify-center"
      style={{ width: 140, height: 85 }}
    >
      <svg width="140" height="90" viewBox="0 0 140 90">
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="var(--border)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
        />
      </svg>
      <div className="absolute bottom-0 text-center">
        <p className="text-2xl font-bold text-foreground leading-none">
          {percent}%
        </p>
        <p className="text-[10px] text-muted-foreground mt-0.5 whitespace-nowrap">
          Training Consistency
        </p>
      </div>
    </div>
  );
}

// ─── brand-orange brain SVG ────────────────────────────────────────────────────

function BrainIllustration() {
  return (
    <div className="relative flex-shrink-0 w-28 h-28 select-none">
      <span className="absolute top-0 right-3 text-primary/70 text-lg">✦</span>
      <span className="absolute top-6 right-0 text-primary/40 text-xs">✦</span>
      <span className="absolute bottom-4 right-1 text-primary/60 text-sm">
        ✦
      </span>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <radialGradient id="brain-accent" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#fdba74" />
            <stop offset="60%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#c2410c" />
          </radialGradient>
        </defs>
        <g
          fill="none"
          stroke="url(#brain-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M50 18 C34 18 22 29 22 42 C22 49 25 55 31 59 C29 63 28 68 30 72 C33 77 39 79 44 78 C46 81 48 83 50 83 C52 83 54 81 56 78 C61 79 67 77 70 72 C72 68 71 63 69 59 C75 55 78 49 78 42 C78 29 66 18 50 18Z"
            fill="url(#brain-accent)"
            opacity="0.85"
          />
          <path
            d="M50 18 C50 27 45 33 41 37"
            stroke="#ffedd5"
            strokeWidth="1.5"
          />
          <path
            d="M50 18 C50 27 55 33 59 37"
            stroke="#ffedd5"
            strokeWidth="1.5"
          />
          <path
            d="M31 59 C38 56 45 57 50 55 C55 57 62 56 69 59"
            stroke="#ffedd5"
            strokeWidth="1.5"
          />
          <path
            d="M44 78 C45 71 47 64 50 60 C53 64 55 71 56 78"
            stroke="#ffedd5"
            strokeWidth="1.5"
          />
          <path
            d="M22 42 C27 40 33 42 37 45 C41 48 46 48 50 49 C54 48 59 48 63 45 C67 42 73 40 78 42"
            stroke="#ffedd5"
            strokeWidth="1.5"
          />
        </g>
      </svg>
    </div>
  );
}

// ─── brain coach icon ─────────────────────────────────────────────────────────

function BrainCoachIcon() {
  return (
    <div className="w-8 h-8 rounded-xl bg-success/15 flex items-center justify-center flex-shrink-0">
      <LuBrain className="w-4 h-4 text-success" />
    </div>
  );
}

// ─── split insight text into sentences ────────────────────────────────────────

function splitInsight(text) {
  if (!text) return [];
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// ─── compute coach metrics from intel ────────────────────────────────────────
// Heuristic, not a model — real inputs, but the output bands (sessions/improvement)
// are fixed thresholds, not a computed projection. Left as-is; not "fake" since it
// does vary per user, just shouldn't be read as more precise than it is.

function coachMetrics(intel) {
  const stability = intel?.stability_score ?? 70;
  const consistency = Math.min(100, Math.round(stability));
  const sessions = consistency >= 80 ? 4 : consistency >= 60 ? 5 : 6;
  const improveLow = consistency >= 75 ? 5 : 3;
  const improveHigh = consistency >= 75 ? 8 : 6;
  const estReaction = intel?.avg_reaction_last10
    ? Math.round(intel.avg_reaction_last10 * 0.95)
    : 470;
  return { consistency, sessions, improveLow, improveHigh, estReaction };
}

// ─── real headline instead of static "Your brain is adapting well." ───────────

function getCoachHeadline(intel) {
  const reactionUp = intel?.reaction_trend === "improving";
  const consistencyUp = intel?.consistency_trend === "improving";
  const stability = intel?.stability_score ?? 0;

  if (reactionUp && consistencyUp)
    return {
      title: "Your brain is adapting well.",
      sub: "Speed and consistency are both climbing — keep it up!",
    };
  if (reactionUp && !consistencyUp)
    return {
      title: "You're getting faster.",
      sub: "Rhythm is still catching up to your new speed.",
    };
  if (!reactionUp && consistencyUp)
    return {
      title: "Your timing is stabilising.",
      sub: "Speed gains usually follow steady rhythm.",
    };
  if (stability >= 65)
    return {
      title: "Holding a steady baseline.",
      sub: "Consistent play is the foundation for the next jump.",
    };
  return {
    title: "Recent sessions have softened.",
    sub: "A short break or lighter session can help reset.",
  };
}

// ─── real teaser line instead of static "You became slower..." ────────────────

function getFreeTeaser(intel) {
  const change = intel?.avg_change;
  if (change != null && change > 3)
    return `You became ${Math.abs(change).toFixed(0)}% slower over your last 10 games.`;
  if (change != null && change < -3)
    return `You got ${Math.abs(change).toFixed(0)}% faster over your last 10 games.`;
  return "Your reaction speed has been holding steady.";
}

// ─── main ─────────────────────────────────────────────────────────────────────

function InsightCard({ insight, isPro, intel }) {
  const sentences = useMemo(() => splitInsight(insight), [insight]);
  const coach = useMemo(() => coachMetrics(intel), [intel]);
  const headline = useMemo(() => getCoachHeadline(intel), [intel]);
  const teaser = useMemo(() => getFreeTeaser(intel), [intel]);

  return (
    <div className="space-y-3">
      {/* ── AI Insight ── */}
      <div className="relative bg-primary/8 border border-primary/20 rounded-2xl p-5 overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
            <LuBrain className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground">
            AI Insight
          </span>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            {isPro ? (
              sentences.length > 0 ? (
                <div className="space-y-2">
                  {sentences.map((s, i) => (
                    <p
                      key={i}
                      className={`text-sm leading-relaxed ${i === 0 ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                    >
                      {s}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight}
                </p>
              )
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">
                  {teaser}
                </p>
                <p className="text-sm text-muted-foreground blur-sm select-none leading-relaxed">
                  This usually happens when mental fatigue starts building.
                </p>
                <p className="text-sm text-muted-foreground blur-sm select-none leading-relaxed">
                  Taking a 2 minute break before another session would likely
                  improve your reaction speed.
                </p>
                <div className="flex items-center gap-1.5 pt-1 text-xs text-primary font-medium">
                  <LuLock className="w-3 h-3" />
                  Unlock Pro to read your full AI insight
                </div>
              </div>
            )}
          </div>

          <BrainIllustration />
        </div>
      </div>

      {/* ── Brain Coach ── */}
      <div className="bg-success/8 border border-success/20 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BrainCoachIcon />
            <span className="text-sm font-semibold text-foreground">
              Brain Coach
            </span>
            <LuSparkles className="w-3.5 h-3.5 text-success" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground leading-snug">
              {headline.title}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {headline.sub}
            </p>
          </div>

          {isPro ? (
            <SemiGauge percent={coach.consistency} color="var(--success)" />
          ) : (
            <div className="relative flex-shrink-0">
              <SemiGauge percent={75} color="var(--success)" />
              <div className="absolute inset-0 flex items-center justify-center">
                <LuLock className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-success/20">
          {[
            {
              label: "Recommended",
              value: isPro ? `${coach.sessions} sessions` : "— sessions",
              sub: "this week",
            },
            {
              label: "Expected Improvement",
              value: isPro ? `${coach.improveLow}–${coach.improveHigh}%` : "—%",
              sub: "next week",
            },
            {
              label: "Estimated Reaction",
              value: isPro ? `${coach.estReaction} ms` : "— ms",
              sub: "next week",
            },
          ].map(({ label, value, sub }) => (
            <div key={label} className="text-center">
              <p className="text-[10px] text-muted-foreground font-medium leading-tight">
                {label}
              </p>
              <p
                className={`text-lg font-bold text-foreground mt-1 leading-none tabular-nums ${!isPro ? "blur-sm select-none" : ""}`}
              >
                {value}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {!isPro && (
          <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-success font-medium">
            <LuLock className="w-3 h-3" />
            Unlock Pro for your personalised coaching plan
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(InsightCard);
