"use client";
import { useEffect, useState, useRef, useId } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import {
  FaTrophy,
  FaChartLine,
  FaBolt,
  FaBrain,
  FaRocket,
  FaLock,
  FaTimes,
  FaShieldAlt,
  FaBullseye,
  FaStar,
  FaUser,
} from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { HiSparkles } from "react-icons/hi2";
import { trackEvent } from "@/app/_lib/ga";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────────────────────────── */
const GUEST_HISTORY_KEY = "schulte_history_guest";
const USER_HISTORY_KEY_PREFIX = "schulte_history_user_";
const BEST_SCORE_KEY = "schulte_best_score";
const DAILY_GAMES_KEY = "schulte_daily_games";
const DAILY_GAMES_DATE_KEY = "schulte_daily_games_date";

/* ─────────────────────────────────────────────────────────────────────────────
   History helper (pure fn, no component dependency)
───────────────────────────────────────────────────────────────────────────── */
function loadHistory(userId) {
  try {
    if (userId) {
      const h = JSON.parse(
        localStorage.getItem(`${USER_HISTORY_KEY_PREFIX}${userId}`) || "[]",
      );
      if (h.length) return h;
    }
    const gh = JSON.parse(localStorage.getItem(GUEST_HISTORY_KEY) || "[]");
    if (gh.length) return gh;
    return JSON.parse(localStorage.getItem("schulte_last_10_games") || "[]");
  } catch {
    return [];
  }
}

function incrementDailyGames() {
  const today = new Date().toISOString().split("T")[0];
  const storedDate = localStorage.getItem(DAILY_GAMES_DATE_KEY);
  if (storedDate !== today) {
    localStorage.setItem(DAILY_GAMES_DATE_KEY, today);
    localStorage.setItem(DAILY_GAMES_KEY, "1");
    return 1;
  }
  const current = Number(localStorage.getItem(DAILY_GAMES_KEY) || 0) + 1;
  localStorage.setItem(DAILY_GAMES_KEY, current.toString());
  return current;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Score delta vs. recent average
───────────────────────────────────────────────────────────────────────────── */
function computeScoreDelta(current, history) {
  const prev = history.filter((g) => g.completedAt !== current.completedAt);
  if (!prev.length) return null;
  const avgScore = prev.reduce((a, g) => a + (g.score || 0), 0) / prev.length;
  if (!avgScore) return null;
  return +(((current.score - avgScore) / avgScore) * 100).toFixed(1);
}

/* ─────────────────────────────────────────────────────────────────────────────
   Insight builder
───────────────────────────────────────────────────────────────────────────── */
function buildInsight(gameSummaryData, history, isPersonalBest) {
  if (isPersonalBest)
    return "That's a new personal best. Your brain just rewrote its own ceiling.";
  const prev = history.filter(
    (g) => g.completedAt !== gameSummaryData.completedAt,
  );
  if (!prev.length) return "Baseline set. Every game from here is data.";
  const avgPrev =
    prev.reduce((a, g) => a + (g.avgReactionTimeMs || 0), 0) / prev.length;
  if (!avgPrev || isNaN(avgPrev))
    return "Keep going — patterns take a few games to emerge.";
  const diff = ((gameSummaryData.avgReactionTimeMs - avgPrev) / avgPrev) * 100;
  if (diff < -16) return "Blazing fast. You're in a flow state — ride it.";
  if (diff < -8) return "Clearly sharper than usual. Something clicked today.";
  if (diff < -3) return "Incrementally faster. The compound effect is real.";
  if (diff > 16) return "Your brain's running on empty — here's why.";
  if (diff > 8)
    return "Slower today. Hydration, sleep, or stress? Worth checking.";
  return "Dialled in. Consistent performance is underrated.";
}

function getInsightType(gameSummaryData, history, isPersonalBest) {
  if (isPersonalBest) return "personal_best";
  const prev = history.filter(
    (g) => g.completedAt !== gameSummaryData.completedAt,
  );
  if (!prev.length) return "neutral";
  const avgPrev =
    prev.reduce((a, g) => a + (g.avgReactionTimeMs || 0), 0) / prev.length;
  if (!avgPrev || isNaN(avgPrev)) return "neutral";
  const diff = ((gameSummaryData.avgReactionTimeMs - avgPrev) / avgPrev) * 100;
  if (diff < -16) return "massive_positive";
  return "neutral";
}

/* ─────────────────────────────────────────────────────────────────────────────
   Report CTA copy — tied to the actual number the user just saw instead of a
   generic "ready" label, so the click is driven by curiosity about *their*
   result, not a static notice.
───────────────────────────────────────────────────────────────────────────── */
function buildReportCta(scoreDelta, accuracy) {
  if (scoreDelta != null && scoreDelta <= -8) {
    return `See why your score dropped ${Math.abs(scoreDelta)}%`;
  }
  if (scoreDelta != null && scoreDelta >= 8) {
    return `Your score jumped ${scoreDelta}% — see the full picture`;
  }
  if (accuracy < 70) {
    return `Your accuracy dipped to ${Math.round(accuracy)}% — see why`;
  }
  return "Your free Brain Report is ready";
}

/* ─────────────────────────────────────────────────────────────────────────────
   Upgrade cadence — every 5th game gets a quiet tap-to-open card, the
   highest-intent moments (personal best / flow state / every 10th game)
   auto-open the full pitch. Has nothing to do with the free Brain Report
   unlock — that's tracked separately via `gamesRemaining`.
───────────────────────────────────────────────────────────────────────────── */
function getUpgradeMode({ isPersonalBest, insightType, totalGames }) {
  if (isPersonalBest) return "full";
  if (insightType === "massive_positive") return "full";
  if (totalGames > 0 && totalGames % 10 === 0) return "full";
  if (totalGames > 0 && totalGames % 5 === 0) return "mini";
  return "none";
}

function getUpgradeCopy(isPersonalBest, insightType) {
  if (isPersonalBest)
    return {
      headline: "New personal best!",
      subline:
        "That run beats most players today. See exactly how far ahead you are.",
      cta: "Show my full rank",
      Icon: FaTrophy,
    };
  if (insightType === "massive_positive")
    return {
      headline: "You're in a flow state.",
      subline:
        "Runs like this are rare — see how it stacks up against your best week.",
      cta: "See my trend",
      Icon: FaRocket,
    };
  return {
    headline: "You just saw your last 5 games.",
    subline:
      "Pro shows all of them — full history, percentile rank, and Focus IQ trend.",
    cta: "See my full stats",
    Icon: FaChartLine,
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   ConfettiCanvas — resolves theme colors at fire-time via getComputedStyle,
   since canvas 2D can't consume CSS var() directly.
───────────────────────────────────────────────────────────────────────────── */
function ConfettiCanvas({ intensity = "normal" }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const W = canvas.width,
      H = canvas.height;

    const styles = getComputedStyle(canvas);
    const primary = styles.getPropertyValue("--orange").trim() || "#f97316";
    const success = styles.getPropertyValue("--success").trim() || "#16a34a";
    const warning = styles.getPropertyValue("--warning").trim() || "#d97706";
    const foreground =
      styles.getPropertyValue("--foreground").trim() || "#0a0a0a";
    const COLORS = [primary, success, warning, foreground];
    const SHAPES = ["rect", "circle", "strip", "star"];
    const count = intensity === "personal_best" ? 200 : 130;
    const particles = Array.from({ length: count }, (_, i) => {
      const fromLeft = i < count / 2;
      const isPB = intensity === "personal_best";
      return {
        x: isPB ? W * (fromLeft ? 0.12 : 0.88) : fromLeft ? W * 0.2 : W * 0.8,
        y: isPB ? H * 0.35 : H * 0.45,
        vx: (Math.random() - (fromLeft ? 0.18 : 0.82)) * (isPB ? 20 : 16),
        vy: -(Math.random() * (isPB ? 16 : 12) + (isPB ? 7 : 5)),
        rot: Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * (isPB ? 0.4 : 0.28),
        w: Math.random() * (isPB ? 13 : 10) + 4,
        h: Math.random() * 6 + 3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        alpha: 1,
        gravity: 0.2 + Math.random() * 0.15,
        wobble: Math.random() * 0.09,
        wobbleSpeed: Math.random() * 0.08 + 0.02,
        wobblePhase: Math.random() * Math.PI * 2,
      };
    });
    let raf,
      elapsed = 0,
      last = performance.now();
    const draw = (now) => {
      const dt = Math.min((now - last) / 16.67, 2);
      last = now;
      elapsed += dt * 16.67;
      ctx.clearRect(0, 0, W, H);
      let anyAlive = false;
      for (const p of particles) {
        p.vy += p.gravity * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.rotV * dt;
        p.wobblePhase += p.wobbleSpeed;
        const wx = Math.sin(p.wobblePhase) * p.wobble * p.w;
        const fadeAt = intensity === "personal_best" ? 3200 : 2400;
        if (elapsed > fadeAt) p.alpha = Math.max(0, p.alpha - 0.017 * dt);
        if (p.alpha > 0) anyAlive = true;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x + wx, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "strip") {
          ctx.fillRect(-p.w / 2, -1.5, p.w, 3);
        } else if (p.shape === "star") {
          ctx.beginPath();
          for (let s = 0; s < 5; s++) {
            const a = (s * 4 * Math.PI) / 5 - Math.PI / 2;
            const r = s % 2 === 0 ? p.w / 2 : p.w / 4;
            ctx[s === 0 ? "moveTo" : "lineTo"](
              Math.cos(a) * r,
              Math.sin(a) * r,
            );
          }
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      }
      if (anyAlive) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [intensity]);
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 20,
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Last5Insights — the actual free value: a real trend, not a single line of
   text. Everything here is computed from localStorage history, no network
   dependency, so it's always available regardless of backend state.
───────────────────────────────────────────────────────────────────────────── */
function Last5Insights({ history, isProUser }) {
  const gradientId = useId();
  const games = [...history].slice(0, 5).reverse(); // oldest → newest, left → right
  if (games.length < 2) return null;

  const avgAccuracy =
    games.reduce((a, g) => a + (g.accuracy || 0), 0) / games.length;
  const avgReaction =
    games.reduce((a, g) => a + (g.avgReactionTimeMs || 0), 0) / games.length;
  const avgDuration =
    games.reduce((a, g) => a + (g.durationMs || 0), 0) / games.length;

  const scores = games.map((g) => g.score || 0);
  const max = Math.max(...scores);
  const min = Math.min(...scores);
  const range = max - min || 1;

  const w = 260,
    h = 56,
    pad = 4;
  const points = scores.map((s, i) => {
    const x = pad + (i / (scores.length - 1)) * (w - pad * 2);
    const y = h - pad - ((s - min) / range) * (h - pad * 2);
    return [x, y];
  });
  const linePath = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`)
    .join(" ");
  const areaPath = `${linePath} L${points[points.length - 1][0]},${h} L${points[0][0]},${h} Z`;

  return (
    <div className="mb-4 rounded-2xl border border-border bg-card px-4 py-3.5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
          Last {games.length} games — score trend
        </span>
        {!isProUser && (
          <span className="text-[10px] font-semibold text-muted-foreground/60">
            Free
          </span>
        )}
      </div>

      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-14 mb-3"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--orange)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--orange)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
        <path
          d={linePath}
          fill="none"
          stroke="var(--orange)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-sm font-bold text-foreground">
            {Math.round(avgAccuracy)}%
          </div>
          <div className="text-[9px] uppercase tracking-wide text-muted-foreground">
            Avg accuracy
          </div>
        </div>
        <div>
          <div className="text-sm font-bold text-foreground">
            {Math.round(avgReaction)}ms
          </div>
          <div className="text-[9px] uppercase tracking-wide text-muted-foreground">
            Avg speed
          </div>
        </div>
        <div>
          <div className="text-sm font-bold text-foreground">
            {(avgDuration / 1000).toFixed(1)}s
          </div>
          <div className="text-[9px] uppercase tracking-wide text-muted-foreground">
            Avg time
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   UpgradeCard — the single monetization surface. Deliberately dark (ink
   block) so it contrasts against the light hero/insights above it instead of
   blending into another same-toned box. Tap anywhere opens the full pitch.
───────────────────────────────────────────────────────────────────────────── */
function UpgradeCard({ copy, onOpen }) {
  const { Icon, headline, subline, cta } = copy;
  return (
    <button
      onClick={onOpen}
      className="w-full text-left mb-3 rounded-none bg-[var(--ink)] px-4 py-4 relative"
    >
      <IoIosArrowRoundForward
        size={18}
        className="absolute top-4 right-4 text-background/30"
      />
      <div className="flex items-start gap-3 mb-3 pr-6">
        <div className="shrink-0 w-9 h-9 rounded-none flex items-center justify-center bg-primary/20">
          <Icon size={16} className="text-primary" />
        </div>
        <div>
          <div className="font-black text-sm text-background leading-tight">
            {headline}
          </div>
          <div className="text-xs text-background/50 mt-1 leading-relaxed">
            {subline}
          </div>
        </div>
      </div>
      <div className="w-full h-10 rounded-none bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
        {cta} — $4.99 once
      </div>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FullUpgradeModal — Sheet on mobile / Dialog on desktop, both height-capped
   with internal scroll so nothing renders off-screen. Only closes via the X:
   `open` is hardcoded true and `onOpenChange` is a no-op, so Base UI's
   controlled Popup has no path to close itself regardless of what triggers
   a dismiss internally (outside click, Escape, swipe) — confirmed against
   the real dialog.jsx. `showCloseButton={false}` hides the library's own
   built-in close button (confirmed prop name from dialog.jsx); the Sheet
   equivalent is assumed to follow the same naming convention but not yet
   verified against sheet.jsx.
───────────────────────────────────────────────────────────────────────────── */
function FullUpgradeModal({ onUpgrade, onClose, copy, history, isDesktop }) {
  const gameCount = history?.length ?? 0;

  const features = [
    {
      Icon: FaBullseye,
      color: "violet",
      label: "Focus Analysis",
      sub: "When your focus is at its best (and worst)",
    },
    {
      Icon: FaChartLine,
      color: "success",
      label: "Mental Fatigue Score",
      sub: "How tiredness silently slows you down",
    },
    {
      Icon: FaBolt,
      color: "warning",
      label: "Habit Consistency",
      sub: "Why some days are productive, others aren't",
    },
    {
      Icon: FaArrowTrendUp,
      color: "blue",
      label: "Personal Improvement Roadmap",
      sub: "Step-by-step plan to upgrade your brain",
    },
  ];
  const iconStyles = {
    violet: "bg-violet-500/15 text-violet-400",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    blue: "bg-blue-500/15 text-blue-400",
  };
  const moreInsightsCount = 3;

  const content = (
    <>
      <button
        onClick={() => {
          trackEvent("upgrade_modal_closed", { source: "close_button" });
          onClose?.();
        }}
        className="absolute top-4 right-4 z-20 w-7 h-7 rounded-full flex items-center justify-center text-foreground/50 hover:bg-foreground/10 hover:text-foreground transition-colors"
      >
        <FaTimes size={13} />
      </button>

      {/* ── Header ── */}
      <div className="px-6 pt-7 pb-2">
        <div className="relative w-16 h-16 mb-5">
          <div className="absolute inset-0 rounded-full bg-primary/25 blur-xl" />
          <div className="relative w-16 h-16 rounded-full border border-primary/40 bg-primary/10 flex items-center justify-center">
            <FaBrain size={26} className="text-primary" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-black/60 border-2 border-background flex items-center justify-center">
            <FaLock size={9} className="text-primary" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-foreground leading-snug">
          Your brain has <span className="text-primary">hidden</span> patterns.
        </h2>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed pb-6">
          {copy?.subline ||
            `We analyzed ${gameCount > 0 ? gameCount : "your"} game${
              gameCount === 1 ? "" : "s"
            } and found insights that can change the way you focus, think and perform.`}
        </p>
      </div>

      {/* ── Body ── */}
      <div className="px-5 pt-5 pb-6">
        {/* Feature checklist */}
        <div className="rounded-2xl border border-border bg-card p-4 mb-4">
          <div className="text-base font-bold text-foreground mb-3.5">
            Unlock what&apos;s holding you back
          </div>
          <div className="space-y-3.5">
            {features.map(({ Icon, color, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${iconStyles[color]}`}
                >
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground">
                    {label}
                  </div>
                  <div className="text-[11px] text-muted-foreground leading-snug">
                    {sub}
                  </div>
                </div>
                <FaLock
                  size={11}
                  className="text-muted-foreground/40 shrink-0"
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-violet-400 text-center mt-3.5 pt-3.5 border-t border-border">
            <HiSparkles size={13} />+ {moreInsightsCount} more powerful insights
          </div>
        </div>

        {/* Real personalization — last 5 games, actual localStorage data */}
        {gameCount > 1 && <Last5Insights history={history} isProUser={false} />}

        {/*
          TODO — VERIFY BEFORE SHIPPING: the user count, avg-improvement %,
          and star rating below are placeholder values from the design
          mockup, not measured data. This project has a standing rule
          against shipping fabricated stats/testimonials — replace these
          with real, verified figures (or delete this block) before launch.
        */}
        <div className="rounded-2xl border border-border bg-card px-4 py-3.5 mb-4 flex items-center gap-3">
          <div className="flex -space-x-2 shrink-0">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-7 h-7 rounded-full bg-muted border-2 border-card flex items-center justify-center"
              >
                <FaUser size={10} className="text-muted-foreground" />
              </span>
            ))}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-0.5 mb-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar key={i} size={10} className="text-warning" />
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground leading-tight">
              1,000+ users unlocked their reports and improved their focus &amp;
              productivity.
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center justify-end gap-1 text-success font-bold text-sm">
              <FaArrowTrendUp size={11} />
              +124%
            </div>
            <div className="text-[9px] text-muted-foreground leading-tight">
              avg improvement
              <br />
              in 30 days
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-3xl font-black text-foreground tabular-nums">
            $4.99
          </span>
          <span className="rounded-full bg-violet-600 text-white text-[10px] font-bold px-2.5 py-1 tracking-wide">
            LIFETIME ACCESS
          </span>
        </div>
        <div className="text-xs text-muted-foreground mb-4">
          One payment. Forever yours.
        </div>

        <Button
          onClick={() => {
            trackEvent("purchase_cta_clicked", {
              product: "lifetime_pro",
              price: 4.99,
            });
            onUpgrade?.();
          }}
          className="w-full h-auto font-bold text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 text-white bg-gradient-to-r from-blue-500 to-violet-600 hover:opacity-90 border-0"
        >
          <FaLock size={12} />
          Unlock My Brain Report
        </Button>

        {/*
          TODO — VERIFY: only keep this line if a 7-day money-back
          guarantee is an actual, honored policy. Do not ship an
          unverified refund promise.
        */}
      </div>
    </>
  );

  if (isDesktop) {
    return (
      <Dialog open onOpenChange={() => {}}>
        <DialogContent
          showCloseButton={false}
          className="dark bg-background text-foreground max-w-sm p-0 gap-0 rounded-3xl max-h-[85vh] overflow-y-auto overflow-x-hidden"
        >
          <DialogTitle className="sr-only">Unlock Pro</DialogTitle>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open onOpenChange={() => {}}>
      <SheetContent
        showCloseButton={false}
        side="bottom"
        className="dark bg-background text-foreground p-0 gap-0 relative rounded-t-3xl max-h-[88vh] overflow-y-auto overflow-x-hidden"
      >
        <SheetTitle className="sr-only">Unlock Pro</SheetTitle>
        <div className="flex justify-center pt-2.5 pb-1">
          <div className="h-1 w-10 rounded-full bg-muted" />
        </div>
        {content}
      </SheetContent>
    </Sheet>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────────────────────────── */
export default function QuickResultBottomSheet({
  gameSummaryData,
  onPlayAgain,
  onViewReport,
  onTryRecommendation,
  onClose,
  visible,
  gamesRemaining,
  user,
  isProUser,
  onUpgrade,
  onLogin,
}) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [insightText, setInsightText] = useState(null);
  const [scoreDelta, setScoreDelta] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [upgradeCopy, setUpgradeCopy] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isPersonalBest, setIsPersonalBest] = useState(false);
  const [confettiMode, setConfettiMode] = useState("none");

  const initRef = useRef(false);
  const confettiFiredRef = useRef(false);
  const historyRef = useRef([]);
  const autoOpenTimerRef = useRef(null);

  useEffect(() => {
    if (!visible || initRef.current || !gameSummaryData) return;
    initRef.current = true;

    const history = loadHistory(user?.id);
    historyRef.current = history;

    const score = gameSummaryData.score ?? 0;
    const prevBest = parseInt(localStorage.getItem(BEST_SCORE_KEY) || "0");
    const pb = score > prevBest;
    if (pb) localStorage.setItem(BEST_SCORE_KEY, score);
    setIsPersonalBest(pb);

    const dailyGamesToday = incrementDailyGames();

    const delta = computeScoreDelta(gameSummaryData, history);
    setScoreDelta(delta);
    setInsightText(buildInsight(gameSummaryData, history, pb));
    const insightType = getInsightType(gameSummaryData, history, pb);

    trackEvent("result_sheet_viewed", {
      score,
      accuracy: gameSummaryData.accuracy,
      score_delta: delta,
      is_personal_best: pb,
      games_remaining: gamesRemaining,
      is_pro_user: !!isProUser,
    });

    if (gamesRemaining === 0) {
      trackEvent("free_report_cta_viewed", {
        score,
        score_delta: delta,
      });
    }

    if (!isProUser) {
      const mode = getUpgradeMode({
        isPersonalBest: pb,
        insightType,
        totalGames: dailyGamesToday,
      });
      if (mode !== "none") {
        const copy = getUpgradeCopy(pb, insightType);
        setUpgradeCopy(copy);
        if (mode === "full") {
          autoOpenTimerRef.current = setTimeout(
            () => setShowUpgradeModal(true),
            1400,
          );
        }
      }
    }

    const shouldConfetti = pb || insightType === "massive_positive";
    if (shouldConfetti && !confettiFiredRef.current) {
      confettiFiredRef.current = true;
      const mode = pb ? "personal_best" : "normal";
      setConfettiMode(mode);
      setTimeout(() => setConfettiMode("none"), pb ? 5500 : 3800);
    }
  }, [visible, gameSummaryData, isProUser, user]);

  useEffect(() => {
    if (!visible) {
      initRef.current = false;
      confettiFiredRef.current = false;
      if (autoOpenTimerRef.current) clearTimeout(autoOpenTimerRef.current);
      setUpgradeCopy(null);
      setShowUpgradeModal(false);
      setIsPersonalBest(false);
      setScoreDelta(null);
      setInsightText(null);
      setConfettiMode("none");
    }
  }, [visible]);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const pool = isDesktop
      ? [
          { grid: 4, mode: "alphabet" },
          { grid: 5, mode: "maths" },
          { grid: 6, mode: "number" },
        ]
      : [
          { grid: 3, mode: "alphabet" },
          { grid: 4, mode: "number" },
        ];
    setRecommendation(pool[Math.floor(Math.random() * pool.length)]);
  }, [visible, isDesktop]);

  if (!visible || !gameSummaryData) return null;

  const { score = 0, accuracy = 0, fasterThanPct } = gameSummaryData;
  const topPct = fasterThanPct != null ? 100 - fasterThanPct : null;
  const deltaTone =
    scoreDelta != null && scoreDelta > 1
      ? "text-success"
      : scoreDelta != null && scoreDelta < -1
        ? "text-warning"
        : "text-muted-foreground";
  const reportCtaText = buildReportCta(scoreDelta, accuracy);

  const bodyContent = (
    <>
      {!user && (
        <div className="flex justify-end mb-1">
          <Button
            onClick={onLogin}
            variant="ghost"
            size="sm"
            className="rounded-none text-xs h-6 px-2 text-muted-foreground hover:text-foreground"
          >
            Login to save →
          </Button>
        </div>
      )}

      {isPersonalBest && (
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-primary mb-2">
          <FaTrophy size={11} /> New personal best
        </div>
      )}

      <div className="text-center mb-1">
        <div className="flex items-center justify-center gap-1.5">
          <span className="text-5xl font-black leading-none text-foreground tracking-tight tabular-nums">
            {score?.toLocaleString?.() ?? score}
          </span>
          {scoreDelta != null && (
            <span className={`text-xs font-bold self-start mt-1 ${deltaTone}`}>
              {scoreDelta > 0 ? "+" : ""}
              {scoreDelta}%
            </span>
          )}
        </div>
        <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mt-1">
          Score
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mb-3 text-sm">
        <div className="text-center">
          <span className="font-bold text-foreground">
            {Math.round(accuracy)}%
          </span>
          <span className="text-muted-foreground"> accuracy</span>
        </div>
        {topPct != null && (
          <>
            <div className="h-3 w-px bg-border" />
            <div className="text-center">
              <span className="font-bold text-primary">Top {topPct}%</span>
              <span className="text-muted-foreground"> on this board</span>
            </div>
          </>
        )}
      </div>

      {insightText && (
        <p className="text-sm text-center text-muted-foreground mb-3 px-2">
          {insightText}
        </p>
      )}

      <Last5Insights history={historyRef.current} isProUser={isProUser} />

      {gamesRemaining === 0 && (
        <Link href="/monthly-brain-report">
          <button
            onClick={() => {
              trackEvent("view_free_report_clicked", {
                score_delta: scoreDelta,
                accuracy,
              });
              onViewReport?.();
            }}
            className="w-full mb-3 flex items-center justify-between gap-2 rounded-none bg-success px-4 py-3.5"
          >
            <span className="flex items-center gap-2 text-sm font-black text-white">
              <FaBrain size={15} /> {reportCtaText}
            </span>
            <IoIosArrowRoundForward size={20} className="text-white shrink-0" />
          </button>
        </Link>
      )}

      {gamesRemaining > 0 && (
        <div className="w-full mb-3 flex items-center gap-2 rounded-none border border-border bg-card px-4 py-3">
          <FaLock size={11} className="text-muted-foreground shrink-0" />
          <span className="text-xs font-semibold text-muted-foreground">
            {gamesRemaining} more game{gamesRemaining === 1 ? "" : "s"} to
            unlock your free Brain Report
          </span>
        </div>
      )}

      {!isProUser && upgradeCopy && (
        <UpgradeCard
          copy={upgradeCopy}
          onOpen={() => {
            trackEvent("upgrade_offer_clicked", { source: "upgrade_card" });
            setShowUpgradeModal(true);
          }}
        />
      )}

      <Button
        onClick={() => {
          trackEvent("play_again_clicked", { source: "quick_result_sheet" });
          onPlayAgain();
        }}
        variant="outline"
        className="w-full h-auto py-3 rounded-none font-bold text-sm"
      >
        Play Again
      </Button>

      {recommendation && (
        <button
          onClick={() => {
            trackEvent("recommended_play_clicked", {
              grid: recommendation.grid,
              mode: recommendation.mode,
            });
            onTryRecommendation?.(recommendation);
          }}
          className="w-full mt-2 text-xs text-center text-muted-foreground hover:text-foreground transition-colors"
        >
          or try {recommendation.grid}×{recommendation.grid}{" "}
          {recommendation.mode} next →
        </button>
      )}
    </>
  );

  return (
    <>
      {isDesktop ? (
        <Dialog open onOpenChange={() => {}}>
          <DialogContent
            showCloseButton={false}
            className="max-w-xs p-5 overflow-hidden rounded-none bg-background border-border "
          >
            <DialogTitle className="sr-only">Game Results</DialogTitle>
            <button
              onClick={() => {
                trackEvent("result_sheet_closed", { source: "close_button" });
                onClose?.();
              }}
              className="absolute top-3 right-3 z-30 w-7 h-7 rounded-full flex items-center justify-center text-foreground/50 hover:bg-foreground/10 hover:text-foreground transition-colors"
            >
              <FaTimes size={13} />
            </button>
            {confettiMode !== "none" && (
              <ConfettiCanvas intensity={confettiMode} />
            )}
            {bodyContent}
          </DialogContent>
        </Dialog>
      ) : (
        <Sheet open onOpenChange={() => {}}>
          <SheetContent
            showCloseButton={false}
            side="bottom"
            className="max-h-[70dvh] p-0 gap-0 overflow-hidden rounded-none bg-background border-border relative"
          >
            <SheetTitle className="sr-only">Game Results</SheetTitle>
            <button
              onClick={() => {
                trackEvent("result_sheet_closed", { source: "close_button" });
                onClose?.();
              }}
              className="absolute top-3 right-3 z-30 w-7 h-7 rounded-full flex items-center justify-center text-foreground/50 hover:bg-foreground/10 hover:text-foreground transition-colors"
            >
              <FaTimes size={13} />
            </button>
            {confettiMode !== "none" && (
              <ConfettiCanvas intensity={confettiMode} />
            )}
            <div className="flex justify-center pt-2.5 pb-1 flex-shrink-0">
              <div className="h-1 w-10 rounded-none bg-muted" />
            </div>
            <div className="overflow-y-auto overscroll-contain flex-1 px-4 pt-2 pb-5">
              {bodyContent}
            </div>
          </SheetContent>
        </Sheet>
      )}

      {!isProUser && showUpgradeModal && (
        <FullUpgradeModal
          onUpgrade={onUpgrade}
          onClose={() => setShowUpgradeModal(false)}
          copy={upgradeCopy}
          history={historyRef.current}
          isDesktop={isDesktop}
        />
      )}
    </>
  );
}
