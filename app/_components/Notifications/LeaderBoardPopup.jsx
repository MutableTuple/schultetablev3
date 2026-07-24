"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Gamepad2,
  Flame,
  Zap,
  Target,
  Skull,
  Crown,
  Trophy,
  Sparkles,
  Rocket,
  Gem,
  X,
} from "lucide-react";

// ─── tier styling — 3 on-brand tiers instead of DaisyUI's info/warning/
// success/error/secondary grab-bag. Higher tiers get the ink-flip "hero"
// treatment already used elsewhere in this app for premium moments.
const TIER_STYLES = {
  1: {
    iconBg: "bg-primary/15",
    iconText: "text-primary",
    bar: "bg-primary",
    button: "bg-primary text-primary-foreground hover:bg-primary/90",
  },
  2: {
    iconBg: "bg-success/15",
    iconText: "text-success",
    bar: "bg-success",
    button: "bg-success text-success-foreground hover:bg-success/90",
  },
  3: {
    iconBg: "bg-foreground",
    iconText: "text-background",
    bar: "bg-foreground",
    button: "bg-foreground text-background hover:bg-foreground/90",
  },
};

const MILESTONES = {
  first: {
    Icon: Gamepad2,
    title: "First game complete!",
    sub: "Your journey on the leaderboard starts now.",
    tier: 1,
    confetti: true,
  },
  5: {
    Icon: Flame,
    title: "5 games in. You're hooked.",
    sub: "The leaderboard is starting to notice you.",
    tier: 1,
    confetti: false,
  },
  10: {
    Icon: Zap,
    title: "10 games played.",
    sub: "You're not here to lose. Check your rank.",
    tier: 1,
    confetti: false,
  },
  20: {
    Icon: Target,
    title: "20 games. Deliberate practice.",
    sub: "Most players quit before this. You didn't.",
    tier: 1,
    confetti: false,
  },
  50: {
    Icon: Skull,
    title: "50 games. Obsessed.",
    sub: "You're in the top tier of dedicated players.",
    tier: 2,
    confetti: true,
  },
  100: {
    Icon: Crown,
    title: "100 games. Legendary.",
    sub: "Only a handful of players ever reach this.",
    tier: 2,
    confetti: true,
  },
  500: {
    Icon: Trophy,
    title: "500 games. Unstoppable.",
    sub: "You are the leaderboard at this point.",
    tier: 3,
    confetti: true,
  },
  1000: {
    Icon: Sparkles,
    title: "1,000 games. A different breed.",
    sub: "This isn't a game anymore. This is a lifestyle.",
    tier: 3,
    confetti: true,
  },
  5000: {
    Icon: Rocket,
    title: "5,000 games. Are you even human?",
    sub: "Scientists want to study you. The #1 spot fears you.",
    tier: 3,
    confetti: true,
  },
  10000: {
    Icon: Gem,
    title: "10,000 games. You ARE the game.",
    sub: "No words. Just respect. Infinite respect.",
    tier: 3,
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

// ─── confetti — resolves theme colors at fire-time via getComputedStyle,
// same trick used by QuickResultBottomSheet's ConfettiCanvas, so this stays
// on-brand instead of a hardcoded rainbow palette.
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

    const styles = getComputedStyle(canvas);
    const colors = [
      styles.getPropertyValue("--orange").trim() || "#f97316",
      styles.getPropertyValue("--success").trim() || "#16a34a",
      styles.getPropertyValue("--warning").trim() || "#d97706",
      styles.getPropertyValue("--foreground").trim() || "#0a0a0a",
    ];
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

const NOOP = () => {};

export default function LeaderBoardPopup({
  open = true,
  duration = 6000,
  onClose = NOOP,
  onView = NOOP,
  isFirstGame = false,
  gamesPlayed = 1,
}) {
  const [progress, setProgress] = useState(100);
  const [secsLeft, setSecsLeft] = useState(Math.ceil(duration / 1000));
  const rafRef = useRef(null);
  const startRef = useRef(null);

  // Latest onClose, read inside the RAF loop below — kept out of the timer
  // effect's dependency array on purpose. Without this, every re-render that
  // handed this component a new `onClose` reference (any inline arrow fn, or
  // even the default param recreating itself) would re-run the effect and
  // reset the countdown, which is why the popup used to never actually close.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const milestone = getMilestone(gamesPlayed, isFirstGame);
  const tierStyle = TIER_STYLES[milestone.tier];
  const Icon = milestone.Icon;

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
        onCloseRef.current();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [open, duration]);

  if (!open) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] animate-in slide-in-from-top duration-400">
      <div className="relative w-[calc(100vw-2rem)] max-w-[380px] bg-card border border-border rounded-xl overflow-hidden shadow-lg">
        <Confetti active={milestone.confetti} />

        {/* Top progress bar */}
        <div className="w-full h-[3px] bg-muted">
          <div
            className={`h-full transition-none ${tierStyle.bar}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Main content */}
        <div className="flex items-center gap-3 px-4 pt-3 pb-2 relative z-10">
          {/* Icon */}
          <div
            className={`w-10 h-10 rounded-xl ${tierStyle.iconBg} flex items-center justify-center flex-shrink-0`}
          >
            <Icon size={18} className={tierStyle.iconText} />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold leading-snug text-foreground">
              {milestone.title}
            </p>
            <p className="text-xs text-muted-foreground leading-snug mt-0.5">
              {milestone.sub}
            </p>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground/60 hover:bg-muted hover:text-foreground transition-colors flex-shrink-0"
          >
            <X size={14} />
          </button>
        </div>

        {/* View ranks button */}
        <div className="px-4 pb-3 relative z-10">
          <button
            onClick={onView}
            className={`w-full h-9 rounded-lg text-sm font-semibold transition-colors ${tierStyle.button}`}
          >
            See your leaderboard rank →
          </button>
        </div>

        {/* Bottom timer row */}
        <div className="flex items-center gap-2 px-4 pb-3 relative z-10">
          <span className="text-[11px] text-muted-foreground/60 w-5 text-right tabular-nums">
            {secsLeft}s
          </span>
          <div className="flex-1 h-[3px] bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-foreground/20 rounded-full transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
