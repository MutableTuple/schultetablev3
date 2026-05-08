"use client";
import React, { useEffect, useState, useRef } from "react";

const MILESTONES = {
  first: {
    emoji: "🎮",
    title: "First game complete!",
    sub: "Your journey on the leaderboard starts now.",
    color: "bg-info/20",
    btnColor: "btn-info",
    barColor: "bg-info",
    confetti: true,
  },
  5: {
    emoji: "🔥",
    title: "5 games in. You're hooked.",
    sub: "The leaderboard is starting to notice you.",
    color: "bg-warning/20",
    btnColor: "btn-warning",
    barColor: "bg-warning",
    confetti: false,
  },
  10: {
    emoji: "⚡",
    title: "10 games played.",
    sub: "You're not here to lose. Check your rank.",
    color: "bg-warning/20",
    btnColor: "btn-warning",
    barColor: "bg-warning",
    confetti: false,
  },
  20: {
    emoji: "🎯",
    title: "20 games. Deliberate practice.",
    sub: "Most players quit before this. You didn't.",
    color: "bg-success/20",
    btnColor: "btn-success",
    barColor: "bg-success",
    confetti: false,
  },
  50: {
    emoji: "💀",
    title: "50 games. Obsessed.",
    sub: "You're in the top tier of dedicated players.",
    color: "bg-error/20",
    btnColor: "btn-error",
    barColor: "bg-error",
    confetti: true,
  },
  100: {
    emoji: "👑",
    title: "100 games. Legendary.",
    sub: "Only a handful of players ever reach this.",
    color: "bg-warning/20",
    btnColor: "btn-warning",
    barColor: "bg-warning",
    confetti: true,
  },
  500: {
    emoji: "🏆",
    title: "500 games. Unstoppable.",
    sub: "You are the leaderboard at this point.",
    color: "bg-warning/20",
    btnColor: "btn-warning",
    barColor: "bg-warning",
    confetti: true,
  },
  1000: {
    emoji: "🌌",
    title: "1,000 games. A different breed.",
    sub: "This isn't a game anymore. This is a lifestyle.",
    color: "bg-purple-500/20",
    btnColor: "btn-secondary",
    barColor: "bg-secondary",
    confetti: true,
  },
  5000: {
    emoji: "🛸",
    title: "5,000 games. Are you even human?",
    sub: "Scientists want to study you. The #1 spot fears you.",
    color: "bg-secondary/20",
    btnColor: "btn-secondary",
    barColor: "bg-secondary",
    confetti: true,
  },
  10000: {
    emoji: "💎",
    title: "10,000 games. You ARE the game.",
    sub: "No words. Just respect. Infinite respect.",
    color: "bg-info/20",
    btnColor: "btn-info",
    barColor: "bg-info",
    confetti: true,
  },
};

function getMilestone(gamesPlayed, isFirst) {
  if (isFirst) return MILESTONES.first;
  const keys = [10000, 5000, 1000, 500, 100, 50, 20, 10, 5];
  for (const k of keys) {
    if (gamesPlayed >= k) return MILESTONES[k];
  }
  return MILESTONES[5];
}

function Confetti({ active }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const colors = ["#EF9F27", "#378ADD", "#1D9E75", "#D4537E", "#7F77DD", "#E24B4A"];
    particlesRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      r: Math.random() * 5 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 2.5 + 1.5,
      wobble: Math.random() * 0.08 + 0.02,
      wobblePos: Math.random() * Math.PI * 2,
      tilt: Math.random() * 10 - 5,
      tiltDir: Math.random() > 0.5 ? 1 : -1,
      opacity: 1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p) => {
        p.y += p.speed;
        p.wobblePos += p.wobble;
        p.x += Math.sin(p.wobblePos) * 1.5;
        p.tilt += p.tiltDir * 0.15;
        if (p.y > canvas.height * 0.7) p.opacity -= 0.015;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.tilt * Math.PI) / 180);
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.5);
        ctx.restore();
      });
      particlesRef.current = particlesRef.current.filter((p) => p.opacity > 0);
      if (particlesRef.current.length > 0) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none rounded-xl"
    />
  );
}

export default function LeaderBoardPopup({
  open = true,
  duration = 6000,
  onClose = () => {},
  onView = () => {},
  isFirstGame = false,
  gamesPlayed = 1,
}) {
  const [progress, setProgress] = useState(100);
  const [secsLeft, setSecsLeft] = useState(Math.ceil(duration / 1000));
  const rafRef = useRef(null);
  const startRef = useRef(null);

  const milestone = getMilestone(gamesPlayed, isFirstGame);

  useEffect(() => {
    if (!open) return;
    setProgress(100);
    setSecsLeft(Math.ceil(duration / 1000));
    startRef.current = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      const secs = Math.ceil((duration - elapsed) / 1000);
      setProgress(pct);
      setSecsLeft(secs);
      if (pct > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        onClose();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] animate-in slide-in-from-top duration-400">
      <div className="relative w-[360px] bg-base-100 border border-base-300 rounded-xl overflow-hidden shadow-lg">

        <Confetti active={milestone.confetti} />

        {/* Top progress bar */}
        <div className="w-full h-[3px] bg-base-200">
          <div
            className={`h-full transition-none ${milestone.barColor}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Main content */}
        <div className="flex items-center gap-3 px-4 pt-3 pb-2 relative z-10">

          {/* Icon */}
          <div className={`w-10 h-10 rounded-xl ${milestone.color} flex items-center justify-center flex-shrink-0 text-xl`}>
            <span style={{ fontSize: 20 }}>{milestone.emoji}</span>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold leading-snug">
              {milestone.title}
            </p>
            <p className="text-xs opacity-50 leading-snug mt-0.5">
              {milestone.sub}
            </p>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="btn btn-ghost btn-xs btn-square rounded-lg opacity-40 hover:opacity-100 flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* View ranks button — full width feel */}
        <div className="px-4 pb-3 relative z-10">
          <button
            onClick={onView}
            className={`btn ${milestone.btnColor} btn-sm w-full rounded-lg font-medium`}
          >
            See your leaderboard rank →
          </button>
        </div>

        {/* Bottom timer row */}
        <div className="flex items-center gap-2 px-4 pb-3 relative z-10">
          <span className="text-[11px] opacity-30 w-5 text-right tabular-nums">
            {secsLeft}s
          </span>
          <div className="flex-1 h-[3px] bg-base-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-base-content/20 rounded-full transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}