import React, { useMemo } from "react";

export default function DynamicInsight({
  gamesRemaining,
  REPORT_INTERVAL,
  insightType,
}) {
  const gamesPlayed = REPORT_INTERVAL - gamesRemaining;

  const variants = {
    positive: [
      {
        text: "🔥 You're getting faster — but one hidden pattern is holding back your peak",
        highlight: "holding back your peak",
      },
      {
        text: "⚡ Strong progress — your report shows exactly where you can still level up",
        highlight: "exactly where you can still level up",
      },
      {
        text: "🧠 Your reaction speed is above average — but your weak spot might surprise you",
        highlight: "weak spot might surprise you",
      },
    ],
    negative: [
      {
        text: "⚠️ Your results are inconsistent — we know exactly why, and how to fix it",
        highlight: "exactly why, and how to fix it",
      },
      {
        text: "🧠 We detected a focus pattern that's costing you points every round",
        highlight: "costing you points every round",
      },
      {
        text: "📉 Something subtle is affecting your performance — your report has the answer",
        highlight: "your report has the answer",
      },
    ],
    neutral: [
      {
        text: "🔍 Your brain profile is ready — see what your play style really says about you",
        highlight: "what your play style really says about you",
      },
      {
        text: "🧠 We've mapped your cognitive pattern — tap to see what it means",
        highlight: "what it means",
      },
      {
        text: "📊 Your personal brain report is ready — most people are surprised by what they find",
        highlight: "surprised by what they find",
      },
    ],
  };

  const { text, highlight } = useMemo(() => {
    // Early users (<5 games)
    if (gamesPlayed < 10) {
      const remaining = 10 - gamesPlayed;
      return {
        text: `🧠 ${remaining} more ${remaining === 1 ? "game" : "games"} to unlock your personal brain report`,
        highlight: "personal brain report",
      };
    }

    // Mid users (5–9 games)
    if (gamesPlayed < REPORT_INTERVAL) {
      const remaining = REPORT_INTERVAL - gamesPlayed;
      return {
        text: `⚡ Almost there — ${remaining} ${remaining === 1 ? "game" : "games"} left before your full analysis is ready`,
        highlight: "full analysis is ready",
      };
    }

    // Qualified users — pick once and lock it
    const pool = variants[insightType] || variants.neutral;
    return pool[Math.floor(Math.random() * pool.length)];
  }, [gamesPlayed, insightType]); // only re-picks if these actually change

  const parts = text.split(highlight);

  return (
    <p className="text-lg font-semibold italic text-center my-1 px-2 leading-snug">
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <span className="text-primary font-bold not-italic">
              {highlight}
            </span>
          )}
        </span>
      ))}
      <span className="ml-1">👇</span>
    </p>
  );
}
