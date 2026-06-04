"use client";
import { useEffect, useState, useMemo, useRef } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import {
  FaTrophy,
  FaLock,
  FaGlobe,
  FaChartLine,
  FaEye,
  FaBolt,
  FaBrain,
  FaMedal,
  FaRocket,
  FaBullseye,
  FaFire,
  FaMeh,
  FaCheckCircle,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaStar,
  FaHeartbeat,
  FaShieldAlt,
} from "react-icons/fa";
import { PiConfettiFill } from "react-icons/pi";
import { HiDocumentReport } from "react-icons/hi";
import { trackEvent } from "@/app/_lib/ga";
/* ─────────────────────────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────────────────────────── */
const GUEST_HISTORY_KEY = "schulte_history_guest";
const USER_HISTORY_KEY_PREFIX = "schulte_history_user_";
const REPORT_INTERVAL = 10;
const GAMES_PLAYED_KEY = "schulte_games_played_total";
const BEST_SCORE_KEY = "schulte_best_score";
const LAST_UPGRADE_GAME_KEY = "schulte_last_upgrade_show";
const DAILY_GAMES_KEY = "schulte_daily_games";
const DAILY_GAMES_DATE_KEY = "schulte_daily_games_date";
const DAILY_GOAL = 10;
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
function getDailyGameCount() {
  const today = new Date().toISOString().split("T")[0];
  const storedDate = localStorage.getItem(DAILY_GAMES_DATE_KEY);
  if (storedDate !== today) {
    localStorage.setItem(DAILY_GAMES_DATE_KEY, today);
    localStorage.setItem(DAILY_GAMES_KEY, "0");
    return 0;
  }
  return Number(localStorage.getItem(DAILY_GAMES_KEY) || 0);
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
   Stat deltas
───────────────────────────────────────────────────────────────────────────── */
function computeDeltas(current, history) {
  const prev = history.filter((g) => g.completedAt !== current.completedAt);
  if (!prev.length) return null;
  const avg = (field) =>
    prev.reduce((a, g) => a + (g[field] || 0), 0) / prev.length;
  const avgScore = avg("score");
  const avgAccuracy = avg("accuracy");
  const avgReaction = avg("avgReactionTimeMs");
  const avgDuration = avg("durationMs");
  return {
    scoreDelta: avgScore
      ? +(((current.score - avgScore) / avgScore) * 100).toFixed(1)
      : null,
    accuracyDelta: avgAccuracy
      ? +(((current.accuracy - avgAccuracy) / avgAccuracy) * 100).toFixed(1)
      : null,
    reactionDelta: avgReaction
      ? +(
          (-(current.avgReactionTimeMs - avgReaction) / avgReaction) *
          100
        ).toFixed(1)
      : null,
    durationDelta: avgDuration
      ? +((-(current.durationMs - avgDuration) / avgDuration) * 100).toFixed(1)
      : null,
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   Insight builder
───────────────────────────────────────────────────────────────────────────── */
function buildInsight(gameSummaryData, history, isPersonalBest) {
  if (isPersonalBest)
    return {
      text: "That's a new personal best. Your brain just rewrote its own ceiling.",
      type: "personal_best",
    };
  const prev = history.filter(
    (g) => g.completedAt !== gameSummaryData.completedAt,
  );
  if (!prev.length)
    return {
      text: "Baseline set. Every game from here is data.",
      type: "neutral",
    };
  const avgPrev =
    prev.reduce((a, g) => a + (g.avgReactionTimeMs || 0), 0) / prev.length;
  if (!avgPrev || isNaN(avgPrev))
    return {
      text: "Keep going — patterns take a few games to emerge.",
      type: "neutral",
    };
  const diff = ((gameSummaryData.avgReactionTimeMs - avgPrev) / avgPrev) * 100;
  if (diff < -16)
    return {
      text: "Blazing fast. You're in a flow state — ride it.",
      type: "massive_positive",
    };
  if (diff < -8)
    return {
      text: "Clearly sharper than usual. Something clicked today.",
      type: "positive",
    };
  if (diff < -3)
    return {
      text: "Incrementally faster. The compound effect is real.",
      type: "slight_positive",
    };
  if (diff > 16)
    return {
      text: "Your brain's running on empty. Rest is training too.",
      type: "negative",
    };
  if (diff > 8)
    return {
      text: "Slower today. Hydration, sleep, or stress? Worth checking.",
      type: "slight_negative",
    };
  return {
    text: "Dialled in. Consistent performance is underrated.",
    type: "neutral",
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   Upgrade helpers
───────────────────────────────────────────────────────────────────────────── */
function getUpgradeMode({
  isPersonalBest,
  insightType,
  isComplete,
  totalGames,
}) {
  if (isPersonalBest) return "full";
  if (insightType === "massive_positive") return "full";
  if (isComplete) return "full";
  if (totalGames > 0 && totalGames % 10 === 0) return "full";
  if (totalGames > 0 && totalGames % 5 === 0) return "mini";
  return "none";
}

function getUpgradeCopy(isPersonalBest, insightType, isComplete) {
  if (isPersonalBest)
    return {
      headline: "You just hit a personal best.",
      subline: "See exactly where that puts you against the world.",
      cta: "See my global rank",
      Icon: FaTrophy,
      accent: "#fbbf24",
    };
  if (insightType === "massive_positive")
    return {
      headline: "You're in a flow state right now.",
      subline: "Your rank is climbing — unlock it before the session fades.",
      cta: "Unlock my rank",
      Icon: FaRocket,
      accent: "#4ade80",
    };
  if (isComplete)
    return {
      headline: "You completed all 10 games.",
      subline: "Your full Brain Report is ready. You earned this.",
      cta: "View my Brain Report",
      Icon: FaBrain,
      accent: "#818cf8",
    };
  return {
    headline: "Your rank is waiting.",
    subline: "Hundreds of players are benchmarked — where do you fit?",
    cta: "Find out",
    Icon: FaGlobe,
    accent: "#a78bfa",
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   ConfettiCanvas
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
    const COLORS =
      intensity === "personal_best"
        ? [
            "#ffd700",
            "#ffed4a",
            "#ff9500",
            "#ff0080",
            "#c77dff",
            "#00ff88",
            "#4f8ef7",
          ]
        : [
            "#4ade80",
            "#22c55e",
            "#00c6ff",
            "#a3e635",
            "#34d399",
            "#6ee7b7",
            "#86efac",
          ];
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
        borderRadius: "inherit",
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   InsightBanner
───────────────────────────────────────────────────────────────────────────── */
function InsightBanner({ insight }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (insight) {
      const t = setTimeout(() => setShow(true), 120);
      return () => clearTimeout(t);
    }
  }, [insight]);
  if (!insight) return null;
  const themes = {
    massive_positive: {
      bg: "linear-gradient(135deg,#052e16,#14532d)",
      border: "rgba(74,222,128,0.4)",
      iconColor: "#4ade80",
      text: "#bbf7d0",
      Icon: FaRocket,
      glow: "0 0 24px rgba(74,222,128,0.18)",
    },
    positive: {
      bg: "linear-gradient(135deg,#0a2e1a,#0f3d22)",
      border: "rgba(34,197,94,0.3)",
      iconColor: "#22c55e",
      text: "#dcfce7",
      Icon: FaArrowUp,
      glow: "0 0 16px rgba(34,197,94,0.12)",
    },
    slight_positive: {
      bg: "linear-gradient(135deg,#0f2d1a,#143320)",
      border: "rgba(74,222,128,0.2)",
      iconColor: "#86efac",
      text: "#d1fae5",
      Icon: FaChartLine,
      glow: "none",
    },
    negative: {
      bg: "linear-gradient(135deg,#2d0c0c,#3d1515)",
      border: "rgba(239,68,68,0.32)",
      iconColor: "#f87171",
      text: "#fecaca",
      Icon: FaBrain,
      glow: "0 0 16px rgba(239,68,68,0.1)",
    },
    slight_negative: {
      bg: "linear-gradient(135deg,#2a1010,#351818)",
      border: "rgba(239,68,68,0.2)",
      iconColor: "#fca5a5",
      text: "#fee2e2",
      Icon: FaMeh,
      glow: "none",
    },
    neutral: {
      bg: "linear-gradient(135deg,#1a1a2e,#1e1e3a)",
      border: "rgba(167,139,250,0.25)",
      iconColor: "#a78bfa",
      text: "#e9d5ff",
      Icon: FaBullseye,
      glow: "none",
    },
    personal_best: {
      bg: "linear-gradient(135deg,#1c1400,#2d2000)",
      border: "rgba(250,204,21,0.45)",
      iconColor: "#fbbf24",
      text: "#fef3c7",
      Icon: FaTrophy,
      glow: "0 0 28px rgba(250,204,21,0.22)",
    },
  };
  const t = themes[insight.type] || themes.neutral;
  const { Icon } = t;
  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3 mb-3 transition-all duration-500"
      style={{
        background: t.bg,
        border: `1px solid ${t.border}`,
        boxShadow: t.glow,
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(6px)",
      }}
    >
      <div
        className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full"
        style={{ background: "rgba(255,255,255,0.07)" }}
      >
        <Icon size={15} color={t.iconColor} />
      </div>
      <p
        className="text-sm font-semibold leading-snug"
        style={{ color: t.text }}
      >
        {insight.text}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   NeuroCoachHeader
───────────────────────────────────────────────────────────────────────────── */
function NeuroCoachHeader({ user, onLogin }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="avatar online">
        <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          <img
            src="https://api.dicebear.com/7.x/bottts/svg?seed=Brainy"
            alt="Neuro Coach"
          />
        </div>
      </div>
      <div>
        <div className="font-extrabold text-base leading-tight">
          Neuro Coach
        </div>
        <div className="text-xs opacity-60">Analyzing your session…</div>
      </div>
      {!user && (
        <button
          onClick={onLogin}
          className="ml-auto btn btn-xs btn-outline btn-primary rounded-full text-xs"
        >
          Login to save
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DailyGoalBar
───────────────────────────────────────────────────────────────────────────── */
function DailyGoalBar({ gamesRemaining, REPORT_INTERVAL }) {
  const completed = REPORT_INTERVAL - gamesRemaining;
  const pct = Math.round((completed / REPORT_INTERVAL) * 100);
  return (
    <div
      className="rounded-xl mb-4 p-3"
      style={{ border: "2px solid #a855f7" }}
    >
      <div className="relative w-full h-3 rounded-full bg-base-300 overflow-hidden mb-1.5">
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: "#1a1a1a" }}
        />
      </div>
      <div className="flex items-center justify-end gap-1.5 text-xs font-semibold opacity-70">
        {gamesRemaining === 0 ? (
          <>
            <FaCheckCircle size={11} color="#22c55e" /> Daily goal reached!
          </>
        ) : (
          <>
            {gamesRemaining} more game{gamesRemaining !== 1 ? "s" : ""} to reach
            daily goal
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   StatTile
───────────────────────────────────────────────────────────────────────────── */
function StatTile({ label, value, delta }) {
  const hasHistory = delta !== null && delta !== undefined;
  const improved = hasHistory && delta > 1;
  const worsened = hasHistory && delta < -1;
  const palette = improved
    ? { bg: "#16a34a", text: "#fff", sub: "rgba(255,255,255,0.82)" }
    : worsened
      ? { bg: "#dc2626", text: "#fff", sub: "rgba(255,255,255,0.85)" }
      : {
          bg: "rgba(128,128,128,0.10)",
          text: "inherit",
          sub: "rgba(128,128,128,0.7)",
          border: "1px solid rgba(128,128,128,0.18)",
        };
  const DeltaIcon = improved ? FaArrowUp : worsened ? FaArrowDown : FaMinus;
  const sign = improved ? "+" : "";
  return (
    <div
      className="rounded-xl flex flex-col items-center justify-center py-3 px-1 gap-0.5"
      style={{
        background: palette.bg,
        border: palette.border || "none",
        minHeight: 84,
      }}
    >
      {hasHistory && (
        <div
          className="flex items-center gap-0.5 text-[10px] font-bold"
          style={{ color: palette.sub }}
        >
          <DeltaIcon size={8} />
          {sign}
          {Math.abs(delta)}%
        </div>
      )}
      <div
        className="text-xl font-black leading-tight text-center"
        style={{ color: palette.text }}
      >
        {value}
      </div>
      <div
        className="text-[10px] font-bold uppercase tracking-wide text-center"
        style={{ color: palette.text, opacity: 0.85 }}
      >
        {label}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   StatsRow
───────────────────────────────────────────────────────────────────────────── */
function StatsRow({ score, accuracy, avgReactionTimeMs, timeSec, deltas }) {
  const reactionSec = (avgReactionTimeMs / 1000).toFixed(1);
  return (
    <div className="grid grid-cols-4 gap-2 mb-3">
      <StatTile
        label="Score"
        value={score?.toLocaleString?.() ?? score}
        delta={deltas?.scoreDelta}
      />
      <StatTile
        label="Accuracy"
        value={`${Math.round(accuracy)}%`}
        delta={deltas?.accuracyDelta}
      />
      <StatTile
        label="Reaction"
        value={`${reactionSec}s`}
        delta={deltas?.reactionDelta}
      />
      <StatTile
        label="Time"
        value={`${timeSec}s`}
        delta={deltas?.durationDelta}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   BrainReportCard
───────────────────────────────────────────────────────────────────────────── */
function BrainReportCard({ onViewReport, gamesRemaining }) {
  const locked = gamesRemaining > 0;
  return (
    <div
      className="rounded-2xl overflow-hidden mb-3 flex items-stretch"
      style={{
        background:
          "linear-gradient(135deg,#1e1b4b 0%,#312e81 40%,#a21caf 100%)",
        minHeight: 110,
      }}
    >
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="font-black text-white text-base leading-tight mb-1">
            View Your complete Brain report.
          </div>
          <div className="text-xs text-white/70">
            Detailed insights about all your games, powered by AI.
          </div>
        </div>
        <button
          disabled={locked}
          onClick={() => {
            if (locked) return;
            trackEvent("brain_report_clicked", {
              source: "quick_result_sheet",
              games_remaining: gamesRemaining,
            });
            onViewReport?.();
          }}
          className="mt-3 flex items-center gap-2 self-start px-4 py-2 rounded-full font-bold text-sm transition-all active:scale-95"
          style={{
            background: locked ? "rgba(255,255,255,0.15)" : "#f59e0b",
            color: "#1a1a1a",
            border: "none",
            cursor: locked ? "not-allowed" : "pointer",
            opacity: locked ? 0.6 : 1,
          }}
        >
          {locked ? (
            <>
              <FaLock size={11} /> {gamesRemaining} more to unlock
            </>
          ) : (
            <>View My complete brain report</>
          )}
          {!locked && (
            <span
              className="flex items-center justify-center w-6 h-6 rounded-full"
              style={{ background: "#1a1a1a" }}
            >
              <IoIosArrowRoundForward color="#f59e0b" size={16} />
            </span>
          )}
        </button>
      </div>
      <div
        className="flex items-center justify-center pr-4"
        style={{ minWidth: 90 }}
      >
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <rect
            x="10"
            y="8"
            width="52"
            height="64"
            rx="4"
            fill="white"
            fillOpacity="0.15"
            stroke="white"
            strokeOpacity="0.3"
            strokeWidth="1.5"
          />
          <rect
            x="18"
            y="20"
            width="36"
            height="3"
            rx="1.5"
            fill="white"
            fillOpacity="0.5"
          />
          <rect
            x="18"
            y="27"
            width="28"
            height="3"
            rx="1.5"
            fill="white"
            fillOpacity="0.4"
          />
          <rect
            x="18"
            y="34"
            width="32"
            height="3"
            rx="1.5"
            fill="white"
            fillOpacity="0.3"
          />
          <polyline
            points="18,58 28,46 36,52 46,40 58,44"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="58" cy="44" r="3" fill="#f59e0b" />
        </svg>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   GlobalRankBar
───────────────────────────────────────────────────────────────────────────── */
function GlobalRankBar({ onUpgrade, isProUser }) {
  if (isProUser) return null;
  return (
    <div
      className="rounded-xl flex items-center justify-between px-4 py-3 cursor-pointer active:scale-95 transition-transform"
      style={{ background: "#16a34a" }}
      onClick={onUpgrade}
    >
      <div className="flex items-center gap-2">
        <FaGlobe size={14} color="#fff" />
        <span className="font-black text-white text-sm">Your Global Rank</span>
      </div>
      <div
        className="flex items-center gap-2 rounded-full px-4 py-1.5"
        style={{ background: "#fff" }}
      >
        <span className="font-bold text-xs" style={{ color: "#1a1a1a" }}>
          Get Pro to know
        </span>
        <FaMedal size={16} color="#f59e0b" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   RecommendedPlayButton
───────────────────────────────────────────────────────────────────────────── */
function RecommendedPlayButton({
  recommendation,
  onTryRecommendation,
  onPlayAgain,
}) {
  return (
    <button
      className="relative w-full mb-3 rounded-xl font-semibold flex gap-2 justify-center items-center px-6 py-3 transition-all duration-300 cursor-pointer active:scale-95 text-white"
      style={{ background: "linear-gradient(135deg,#3b82f6,#06b6d4)" }}
      onClick={() => {
        trackEvent("recommended_play_clicked", {
          recommendation: `${recommendation?.grid}x${recommendation?.grid}_${recommendation?.mode}`,
          grid: recommendation?.grid,
          mode: recommendation?.mode,
        });
        recommendation ? onTryRecommendation?.(recommendation) : onPlayAgain();
      }}
    >
      <FaStar size={13} />
      Recommended — Play {recommendation?.grid}×{recommendation?.grid}
      <IoIosArrowRoundForward size={18} />
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SmartUpgradeBlock
───────────────────────────────────────────────────────────────────────────── */
function SmartUpgradeBlock({
  mode,
  copy,
  onOpen,
  isPersonalBest,
  insightType,
}) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    if (mode !== "none") {
      const t = setTimeout(() => setEntered(true), 80);
      return () => clearTimeout(t);
    }
  }, [mode]);
  if (mode === "none") return null;
  const { Icon, accent } = copy;
  if (mode === "mini") {
    return (
      <div
        onClick={onOpen}
        className="mt-3 flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-300"
        style={{
          background: `rgba(${accent === "#fbbf24" ? "251,191,36" : "167,139,250"},0.08)`,
          border: `1px solid ${accent}33`,
          opacity: entered ? 1 : 0,
          transform: entered ? "translateY(0)" : "translateY(8px)",
        }}
      >
        <div
          className="flex items-center gap-2 text-xs font-semibold"
          style={{ color: accent }}
        >
          <Icon size={12} />
          {copy.headline}
        </div>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
          style={{
            background: `${accent}22`,
            color: accent,
            border: `1px solid ${accent}44`,
          }}
        >
          Unlock $4.99 <IoIosArrowRoundForward size={11} />
        </span>
      </div>
    );
  }
  return (
    <div
      className="mt-3 rounded-2xl overflow-hidden cursor-pointer transition-all duration-400"
      style={{
        background: "linear-gradient(135deg,#0f0f1f,#1a1035)",
        border: `1px solid ${accent}44`,
        boxShadow: `0 0 32px ${accent}18`,
        opacity: entered ? 1 : 0,
        transform: entered
          ? "translateY(0) scale(1)"
          : "translateY(14px) scale(0.97)",
        transition:
          "opacity 0.4s ease, transform 0.45s cubic-bezier(0.34,1.4,0.64,1)",
      }}
      onClick={onOpen}
    >
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start gap-3 mb-3">
          <div
            className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: `${accent}20`,
              border: `1px solid ${accent}44`,
            }}
          >
            <Icon size={16} color={accent} />
          </div>
          <div>
            <div
              className="font-black text-sm leading-tight"
              style={{ color: "#fff" }}
            >
              {copy.headline}
            </div>
            <div
              className="text-xs mt-0.5"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              {copy.subline}
            </div>
          </div>
        </div>
        <div
          className="flex items-center gap-2 mb-3 p-2.5 rounded-xl"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <FaLock size={10} color="rgba(255,255,255,0.3)" />
          <div
            className="flex-1 relative h-2 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{
                width: "72%",
                background: `linear-gradient(90deg,${accent},#4f8ef7)`,
              }}
            />
            <div
              className="absolute top-0 right-0 h-full w-1/3"
              style={{
                background: "linear-gradient(90deg,transparent,#0f0f1f)",
              }}
            />
          </div>
          <span className="text-xs font-bold" style={{ color: accent }}>
            Top ?%
          </span>
        </div>
        <button
          className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 active:scale-95 transition-transform"
          style={{
            background: `linear-gradient(135deg,${accent},#4f8ef7)`,
            color: "#0a0a14",
            border: "none",
          }}
        >
          {copy.cta}
          <span
            className="text-xs font-black px-2.5 py-1 rounded-full"
            style={{ background: "rgba(0,0,0,0.2)", color: "#fff" }}
          >
            $4.99 once
          </span>
        </button>
        <div
          className="flex items-center justify-center gap-1.5 mt-2 text-xs"
          style={{ color: "rgba(255,255,255,0.22)" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full inline-block"
            style={{ background: "rgba(74,222,128,0.5)" }}
          />
          No subscription · one-time unlock
          <span
            className="w-1.5 h-1.5 rounded-full inline-block"
            style={{ background: "rgba(74,222,128,0.5)" }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FullUpgradeModal
───────────────────────────────────────────────────────────────────────────── */
function FullUpgradeModal({
  onUpgrade,
  onClose,
  formattedUsers,
  score,
  isPersonalBest,
  copy,
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);
  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 220);
  };
  const features = [
    { Icon: FaGlobe, label: "Global percentile rank" },
    { Icon: FaChartLine, label: "Reaction trend over time" },
    { Icon: FaEye, label: "Visual blind spot map" },
    { Icon: FaBolt, label: "Fatigue curve per game" },
    { Icon: FaBrain, label: "Brain age estimate" },
    { Icon: FaTrophy, label: "Country leaderboard rank" },
  ];
  const accent = copy?.accent || "#a78bfa";
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.25s ease",
      }}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm mx-auto"
        style={{
          transform: visible
            ? "translateY(0) scale(1)"
            : "translateY(50px) scale(0.94)",
          transition:
            "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease",
          opacity: visible ? 1 : 0,
        }}
      >
        <div
          className="rounded-t-2xl sm:rounded-2xl overflow-hidden"
          style={{
            background: "#0d0d1a",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            className="relative px-5 pt-5 pb-4"
            style={{
              background: "linear-gradient(135deg,#1a1040 0%,#0d1a2e 100%)",
            }}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 btn btn-xs btn-ghost btn-circle opacity-40 hover:opacity-100"
            >
              <IoClose size={16} />
            </button>
            <div className="flex items-end gap-3 mb-3">
              <div
                style={{
                  fontSize: 42,
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "-2px",
                  lineHeight: 1,
                }}
              >
                {score?.toLocaleString?.() ?? score}
              </div>
              {isPersonalBest && (
                <div
                  className="mb-1 flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-full"
                  style={{
                    background: "rgba(251,191,36,0.15)",
                    color: "#fbbf24",
                    border: "1px solid rgba(251,191,36,0.35)",
                  }}
                >
                  <FaTrophy size={10} /> Personal best
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-1.5 text-xs"
                style={{
                  color: "rgba(255,255,255,0.35)",
                  whiteSpace: "nowrap",
                }}
              >
                <FaLock size={10} /> Global rank
              </div>
              <div
                className="flex-1 relative h-2 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <div
                  className="absolute top-0 left-0 h-full rounded-full"
                  style={{
                    width: "68%",
                    background: `linear-gradient(90deg,${accent},#4f8ef7)`,
                  }}
                />
                <div
                  className="absolute top-0 right-0 h-full w-2/5"
                  style={{
                    background: "linear-gradient(90deg,transparent,#0d1a2e)",
                  }}
                />
              </div>
              <div
                className="text-xs font-bold"
                style={{ color: accent, whiteSpace: "nowrap" }}
              >
                Top ?%
              </div>
            </div>
          </div>
          <div className="px-5 py-4">
            <div
              className="font-black text-base mb-0.5"
              style={{ color: "#fff" }}
            >
              {copy?.headline || "See where you actually rank"}
            </div>
            <div
              className="text-xs mb-4"
              style={{ color: "rgba(255,255,255,0.38)" }}
            >
              {formattedUsers} sessions benchmarked — yours included
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {features.map(({ Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-xs rounded-lg px-3 py-2"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  <Icon size={12} color="rgba(255,255,255,0.4)" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                trackEvent("purchase_cta_clicked", {
                  product: "lifetime_pro",
                  price: 4.99,
                });
                onUpgrade?.();
              }}
              className="w-full font-black text-sm py-3.5 rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
              style={{
                background: `linear-gradient(135deg,${accent},#4f8ef7)`,
                color: "#0a0a14",
                border: "none",
              }}
            >
              {copy?.cta || "Unlock lifetime access"}
              <span
                className="text-xs font-black px-2.5 py-1 rounded-full"
                style={{ background: "rgba(0,0,0,0.18)", color: "#fff" }}
              >
                $4.99 once
              </span>
            </button>
            <div
              className="flex items-center justify-center gap-2 mt-2.5 text-xs"
              style={{ color: "rgba(255,255,255,0.22)" }}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: "rgba(74,222,128,0.5)" }}
              />
              No subscription · 700+ players unlocked this
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: "rgba(74,222,128,0.5)" }}
              />
            </div>
            <button
              onClick={handleClose}
              className="w-full mt-2 text-xs py-1.5 transition-colors"
              style={{
                color: "rgba(255,255,255,0.18)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              onMouseOver={(e) =>
                (e.target.style.color = "rgba(255,255,255,0.45)")
              }
              onMouseOut={(e) =>
                (e.target.style.color = "rgba(255,255,255,0.18)")
              }
            >
              Not now — keep playing free
            </button>
          </div>
        </div>
      </div>
    </div>
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
  dailyUsers = 1200,
}) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [insight, setInsight] = useState(null);
  const [deltas, setDeltas] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [upgradeMode, setUpgradeMode] = useState("none");
  const [upgradeCopy, setUpgradeCopy] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isPersonalBest, setIsPersonalBest] = useState(false);
  const [totalGames, setTotalGames] = useState(0);
  const [confettiMode, setConfettiMode] = useState("none");
  const [cardVisible, setCardVisible] = useState(false);

  const initRef = useRef(false);
  const confettiFiredRef = useRef(false);
  const formattedUsers = useMemo(
    () => dailyUsers.toLocaleString() + "+",
    [dailyUsers],
  );
  const dailyGames = getDailyGameCount();
  const dailyGamesRemaining = Math.max(0, DAILY_GOAL - dailyGames);
  const isComplete = dailyGamesRemaining === 0;

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setCardVisible(true), 30);
      return () => clearTimeout(t);
    } else {
      setCardVisible(false);
    }
  }, [visible]);

  useEffect(() => {
    if (!visible || initRef.current || !gameSummaryData) return;
    initRef.current = true;
    const history = loadHistory(user?.id);
    const score = gameSummaryData.score ?? 0;
    const prevBest = parseInt(localStorage.getItem(BEST_SCORE_KEY) || "0");
    const pb = score > prevBest;
    if (pb) localStorage.setItem(BEST_SCORE_KEY, score);
    setIsPersonalBest(pb);
    const dailyGames = incrementDailyGames();
    setTotalGames(dailyGames);
    const d = computeDeltas(gameSummaryData, history);
    setDeltas(d);
    const ins = buildInsight(gameSummaryData, history, pb);
    setInsight(ins);
    if (!isProUser) {
      const mode = getUpgradeMode({
        isPersonalBest: pb,
        insightType: ins.type,
        isComplete,
        totalGames: dailyGames,
      });
      setUpgradeMode(mode);
      setUpgradeCopy(getUpgradeCopy(pb, ins.type, isComplete));
    }
    const shouldConfetti =
      pb ||
      ins.type === "massive_positive" ||
      (ins.type === "positive" && (d?.scoreDelta ?? 0) > 10);
    if (shouldConfetti && !confettiFiredRef.current) {
      confettiFiredRef.current = true;
      const mode = pb ? "personal_best" : "normal";
      setConfettiMode(mode);
      setTimeout(() => setConfettiMode("none"), pb ? 5500 : 3800);
    }
  }, [visible, gameSummaryData, isProUser, isComplete, user]);

  useEffect(() => {
    if (!visible) {
      initRef.current = false;
      confettiFiredRef.current = false;
      setUpgradeMode("none");
      setShowUpgradeModal(false);
      setIsPersonalBest(false);
      setDeltas(null);
      setInsight(null);
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
    const h = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [visible, onClose]);

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

  const {
    score = 0,
    accuracy = 0,
    durationMs = 0,
    avgReactionTimeMs = 0,
  } = gameSummaryData;
  const timeSec = (durationMs / 1000).toFixed(2);

  /* ── DESKTOP: centred modal overlay ── */
  if (isDesktop) {
    return (
      <>
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          onClick={onClose}
        >
          <div
            className="relative bg-base-100 rounded-2xl p-5 w-full max-w-md shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{
              opacity: cardVisible ? 1 : 0,
              transform: cardVisible
                ? "translateY(0) scale(1)"
                : "translateY(20px) scale(0.96)",
              transition:
                "opacity 0.35s ease, transform 0.4s cubic-bezier(0.34,1.4,0.64,1)",
            }}
          >
            {confettiMode !== "none" && (
              <ConfettiCanvas intensity={confettiMode} />
            )}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 btn btn-sm btn-ghost btn-circle text-base-content/50 hover:text-base-content z-30"
            >
              <IoClose size={16} />
            </button>
            <NeuroCoachHeader user={user} onLogin={onLogin} />
            <DailyGoalBar
              gamesRemaining={gamesRemaining}
              REPORT_INTERVAL={REPORT_INTERVAL}
            />
            <StatsRow
              score={score}
              accuracy={accuracy}
              avgReactionTimeMs={avgReactionTimeMs}
              timeSec={timeSec}
              deltas={deltas}
            />
            <InsightBanner insight={insight} />
            <BrainReportCard
              onViewReport={onViewReport}
              gamesRemaining={gamesRemaining}
            />
            <RecommendedPlayButton
              recommendation={recommendation}
              onTryRecommendation={onTryRecommendation}
              onPlayAgain={onPlayAgain}
            />
            {!isProUser && (
              <SmartUpgradeBlock
                mode={upgradeMode}
                copy={upgradeCopy}
                onOpen={() => {
                  trackEvent("upgrade_offer_clicked", {
                    source: "smart_upgrade_block",
                    trigger: upgradeMode,
                  });
                  setShowUpgradeModal(true);
                }}
                isPersonalBest={isPersonalBest}
                insightType={insight?.type}
              />
            )}
            {!isProUser && upgradeMode === "none" && (
              <GlobalRankBar
                onUpgrade={() => {
                  trackEvent("upgrade_offer_clicked", {
                    source: "global_rank_bar",
                  });
                  setShowUpgradeModal(true);
                }}
                isProUser={isProUser}
              />
            )}
          </div>
        </div>
        {!isProUser && showUpgradeModal && (
          <FullUpgradeModal
            onUpgrade={onUpgrade}
            onClose={() => setShowUpgradeModal(false)}
            formattedUsers={formattedUsers}
            score={score}
            isPersonalBest={isPersonalBest}
            copy={upgradeCopy}
          />
        )}
      </>
    );
  }

  /* ── MOBILE: bottom sheet with max-height + scroll ── */
  return (
    <>
      {/* Dim backdrop — doesn't block taps if sheet not visible */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        style={{
          opacity: cardVisible ? 1 : 0,
          transition: "opacity 0.3s ease",
          pointerEvents: cardVisible ? "auto" : "none",
        }}
        onClick={onClose}
      />

      <div
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div
          className="relative bg-base-100 rounded-t-2xl border-t border-base-300 shadow-xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
          style={{
            /* KEY FIX: cap height to 88dvh so it never fills the full screen,
               and let the inner content scroll */
            maxHeight: "88dvh",
            opacity: cardVisible ? 1 : 0,
            transform: cardVisible ? "translateY(0)" : "translateY(100%)",
            transition:
              "opacity 0.35s ease, transform 0.4s cubic-bezier(0.32,0.72,0,1)",
          }}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-2.5 pb-1 flex-shrink-0">
            <div className="h-1 w-10 rounded-full bg-base-300" />
          </div>

          {confettiMode !== "none" && (
            <ConfettiCanvas intensity={confettiMode} />
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 btn btn-sm btn-ghost btn-circle text-base-content/50 hover:text-base-content z-30"
          >
            <IoClose size={16} />
          </button>

          {/* Scrollable content area */}
          <div className="overflow-y-auto overscroll-contain flex-1 px-4 pt-2 pb-5">
            <NeuroCoachHeader user={user} onLogin={onLogin} />
            <DailyGoalBar
              gamesRemaining={gamesRemaining}
              REPORT_INTERVAL={REPORT_INTERVAL}
            />
            <StatsRow
              score={score}
              accuracy={accuracy}
              avgReactionTimeMs={avgReactionTimeMs}
              timeSec={timeSec}
              deltas={deltas}
            />
            <InsightBanner insight={insight} />
            <BrainReportCard
              onViewReport={onViewReport}
              gamesRemaining={gamesRemaining}
            />
            <RecommendedPlayButton
              recommendation={recommendation}
              onTryRecommendation={onTryRecommendation}
              onPlayAgain={onPlayAgain}
            />
            {!isProUser && (
              <SmartUpgradeBlock
                mode={upgradeMode}
                copy={upgradeCopy}
                onOpen={() => {
                  trackEvent("upgrade_offer_clicked", {
                    source: "smart_upgrade_block",
                    trigger: upgradeMode,
                  });
                  setShowUpgradeModal(true);
                }}
                isPersonalBest={isPersonalBest}
                insightType={insight?.type}
              />
            )}
            {!isProUser && upgradeMode === "none" && (
              <GlobalRankBar
                onUpgrade={() => {
                  trackEvent("upgrade_offer_clicked", {
                    source: "global_rank_bar",
                  });
                  setShowUpgradeModal(true);
                }}
                isProUser={isProUser}
              />
            )}
          </div>
        </div>
      </div>

      {!isProUser && showUpgradeModal && (
        <FullUpgradeModal
          onUpgrade={onUpgrade}
          onClose={() => setShowUpgradeModal(false)}
          formattedUsers={formattedUsers}
          score={score}
          isPersonalBest={isPersonalBest}
          copy={upgradeCopy}
        />
      )}
    </>
  );
}
