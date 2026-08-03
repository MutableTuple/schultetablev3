"use client";

import React from "react";
import dynamic from "next/dynamic";

const Confetti = dynamic(() => import("react-confetti"), {
  ssr: false,
  loading: () => null,
});

const RIBBON_COLORS = [
  "#F3A83C",
  "#FF5E5B",
  "#5B8DEF",
  "#43C6AC",
  "#FFD700",
  "#C084FC",
];

// Draws an elongated tapered strip instead of the default square/circle so
// the finale celebration reads as falling ribbons, not generic confetti.
// `this` is bound to the particle by react-confetti; `this.w` is its size.
function drawRibbon(ctx) {
  const w = Math.max(this.w, 6) * 0.35;
  const h = Math.max(this.w, 6) * 2.6;
  ctx.beginPath();
  ctx.moveTo(-w / 2, -h / 2);
  ctx.lineTo(w / 2, -h / 2);
  ctx.lineTo(w / 3, h / 2);
  ctx.lineTo(-w / 3, h / 2);
  ctx.closePath();
  ctx.fill();
}

export default function RibbonConfetti({
  active,
  onComplete,
  numberOfPieces = 260,
}) {
  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[70] pointer-events-none">
      <Confetti
        recycle={false}
        numberOfPieces={numberOfPieces}
        gravity={0.18}
        initialVelocityY={{ min: 8, max: 18 }}
        colors={RIBBON_COLORS}
        drawShape={drawRibbon}
        tweenDuration={8000}
        onConfettiComplete={(instance) => {
          onComplete?.();
          instance?.reset?.();
        }}
      />
    </div>
  );
}
