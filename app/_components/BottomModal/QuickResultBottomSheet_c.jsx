"use client";
import Link from "next/link";
import { useEffect, useState, useMemo, useRef } from "react";
import { HiDocumentReport } from "react-icons/hi";
import { IoIosArrowRoundForward } from "react-icons/io";
import { PiConfettiFill } from "react-icons/pi";
import PerformanceInfo from "./PerformanceInfo";
import DynamicInsight from "./DynamicInsight";

/* ─────────────────────────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────────────────────────── */
const GUEST_HISTORY_KEY = "schulte_history_guest";
const USER_HISTORY_KEY_PREFIX = "schulte_history_user_";
const REPORT_INTERVAL = 10;

// Periodicity keys stored in localStorage
const GAMES_PLAYED_KEY = "schulte_games_played_total";
const BEST_SCORE_KEY = "schulte_best_score";
const LAST_MODAL_GAME_KEY = "schulte_last_modal_game";

/* ─────────────────────────────────────────────────────────────────────────────
   Smart modal visibility logic
   Rules:
     - Game 1 : never show (let them enjoy first game clean)
     - Personal best : always show (peak dopamine moment)
     - Every 3rd game (game 3, 6, 9…) : show full modal
     - All other games : show mini nudge only (1 line, not intrusive)
───────────────────────────────────────────────────────────────────────────── */
function getModalMode(score) {
  try {
    const total = parseInt(localStorage.getItem(GAMES_PLAYED_KEY) || "0") + 1;
    localStorage.setItem(GAMES_PLAYED_KEY, total);

    const prevBest = parseInt(localStorage.getItem(BEST_SCORE_KEY) || "0");
    const isPersonalBest = score > prevBest;
    if (isPersonalBest) localStorage.setItem(BEST_SCORE_KEY, score);

    if (total === 1) return "none";
    if (isPersonalBest) return "full";
    if (total % 3 === 0) return "full";
    return "mini";
  } catch {
    return "mini";
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   Spring physics
───────────────────────────────────────────────────────────────────────────── */
function springStep(pos, vel, target, stiffness = 160, damping = 20, mass = 1, dt = 1 / 60) {
  const force = -stiffness * (pos - target) - damping * vel;
  const acc = force / mass;
  const newVel = vel + acc * dt;
  const newPos = pos + newVel * dt;
  return [newPos, newVel];
}

/* ─────────────────────────────────────────────────────────────────────────────
   Confetti canvas
───────────────────────────────────────────────────────────────────────────── */
function ConfettiCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const W = canvas.width, H = canvas.height;
    const COLORS = ["#ff0080","#7928ca","#00c6ff","#00ff88","#ffdd00","#ff6b35","#c77dff","#48cae4"];
    const SHAPES = ["rect","circle","strip"];
    const particles = Array.from({ length: 120 }, (_, i) => {
      const fromLeft = i < 60;
      return {
        x: fromLeft ? W * 0.2 : W * 0.8, y: H * 0.5,
        vx: (Math.random() - (fromLeft ? 0.25 : 0.75)) * 15,
        vy: -(Math.random() * 10 + 5),
        rot: Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.28,
        w: Math.random() * 9 + 4, h: Math.random() * 5 + 3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        alpha: 1, gravity: 0.28 + Math.random() * 0.12,
      };
    });
    let raf, elapsed = 0, last = performance.now();
    const draw = (now) => {
      const dt = Math.min((now - last) / 16.67, 2);
      last = now; elapsed += dt * 16.67;
      ctx.clearRect(0, 0, W, H);
      let anyAlive = false;
      for (const p of particles) {
        p.vy += p.gravity * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.rotV * dt;
        if (elapsed > 2500) p.alpha = Math.max(0, p.alpha - 0.018 * dt);
        if (p.alpha > 0) anyAlive = true;
        ctx.save(); ctx.globalAlpha = p.alpha; ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.color;
        if (p.shape === "circle") { ctx.beginPath(); ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2); ctx.fill(); }
        else if (p.shape === "strip") { ctx.fillRect(-p.w / 2, -1.5, p.w, 3); }
        else { ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); }
        ctx.restore();
      }
      if (anyAlive) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:10, borderRadius:"inherit" }} />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Mini nudge — shown on most games, 1 line, non-intrusive
───────────────────────────────────────────────────────────────────────────── */
function MiniNudge({ onUpgrade, isPersonalBest }) {
  return (
    <div
      onClick={onUpgrade}
      className="mt-3 flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer group"
      style={{
        background: isPersonalBest
          ? "linear-gradient(90deg, rgba(74,222,128,0.08), rgba(74,222,128,0.04))"
          : "rgba(124,58,237,0.08)",
        border: isPersonalBest ? "1px solid rgba(74,222,128,0.2)" : "1px solid rgba(124,58,237,0.2)",
      }}
    >
      <span className="text-xs" style={{ color: isPersonalBest ? "#4ade80" : "#a78bfa" }}>
        {isPersonalBest ? "🏆 Personal best! See your global rank" : "🔒 Your global rank is hidden"}
      </span>
      <span
        className="text-xs font-semibold px-2 py-0.5 rounded-full transition-opacity group-hover:opacity-80"
        style={{
          background: isPersonalBest ? "rgba(74,222,128,0.15)" : "rgba(124,58,237,0.2)",
          color: isPersonalBest ? "#4ade80" : "#c084fc",
          border: isPersonalBest ? "1px solid rgba(74,222,128,0.3)" : "1px solid rgba(124,58,237,0.3)",
        }}
      >
        Unlock $4.99 →
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Full upgrade modal — shown every 3rd game or on personal best
───────────────────────────────────────────────────────────────────────────── */
function FullUpgradeModal({ onUpgrade, onClose, formattedUsers, score, isPersonalBest }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const features = [
    { icon: "🌍", label: "Global percentile rank" },
    { icon: "📈", label: "Reaction trend over time" },
    { icon: "👁", label: "Visual blind spot map" },
    { icon: "⚡", label: "Fatigue curve per game" },
    { icon: "🧠", label: "Brain age estimate" },
    { icon: "🏆", label: "Country leaderboard rank" },
  ];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s ease",
      }}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm mx-auto"
        style={{
          transform: visible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.97)",
          transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease",
          opacity: visible ? 1 : 0,
        }}
      >
        <div
          className="rounded-t-2xl sm:rounded-2xl overflow-hidden"
          style={{ background: "#0d0d1a", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {/* Top gradient band */}
          <div
            className="relative px-5 pt-5 pb-4"
            style={{ background: "linear-gradient(135deg, #1a1040 0%, #0d1a2e 100%)" }}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 btn btn-xs btn-ghost btn-circle opacity-50 hover:opacity-100"
            >
              ✕
            </button>

            {/* Score display */}
            <div className="flex items-end gap-3 mb-3">
              <div style={{ fontSize: 40, fontWeight: 700, color: "#fff", letterSpacing: "-1.5px", lineHeight: 1 }}>
                {score?.toLocaleString?.() ?? score}
              </div>
              {isPersonalBest && (
                <div
                  className="mb-1 text-xs font-semibold px-2 py-1 rounded-full"
                  style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.3)" }}
                >
                  🏆 Personal best
                </div>
              )}
            </div>

            {/* Blurred rank bar */}
            <div className="flex items-center gap-3">
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>
                🔒 Global rank
              </div>
              <div className="flex-1 relative h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div
                  className="absolute top-0 left-0 h-full rounded-full"
                  style={{ width: "68%", background: "linear-gradient(90deg, #7c3aed, #4f8ef7)" }}
                />
                {/* blur fade on right to suggest hidden content */}
                <div
                  className="absolute top-0 right-0 h-full w-2/5"
                  style={{ background: "linear-gradient(90deg, transparent, #0d1a2e)" }}
                />
              </div>
              <div className="text-xs font-semibold" style={{ color: "#a78bfa", whiteSpace: "nowrap" }}>
                Top ?%
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-5 py-4">
            <div className="font-bold text-base mb-0.5" style={{ color: "#fff" }}>
              See where you actually rank
            </div>
            <div className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
              {formattedUsers} sessions benchmarked — yours included
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {features.map((f) => (
                <div
                  key={f.label}
                  className="flex items-center gap-2 text-xs rounded-lg px-3 py-2"
                  style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.65)" }}
                >
                  <span>{f.icon}</span>
                  <span>{f.label}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={onUpgrade}
              className="w-full font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #4f8ef7)",
                color: "#fff",
                border: "none",
              }}
            >
              Unlock lifetime access
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                $4.99 once
              </span>
            </button>

            {/* Social proof + dismiss */}
            <div
              className="flex items-center justify-center gap-1.5 mt-2.5 text-xs"
              style={{ color: "rgba(255,255,255,0.25)" }}
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
              style={{ color: "rgba(255,255,255,0.2)", background: "none", border: "none", cursor: "pointer" }}
              onMouseOver={(e) => (e.target.style.color = "rgba(255,255,255,0.45)")}
              onMouseOut={(e) => (e.target.style.color = "rgba(255,255,255,0.2)")}
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
  const [insight, setInsight] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [isFirstShow, setIsFirstShow] = useState(true);
  const [insightType, setInsightType] = useState("neutral");

  // Upgrade modal state
  const [upgradeModalMode, setUpgradeModalMode] = useState("none"); // "none" | "mini" | "full"
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isPersonalBest, setIsPersonalBest] = useState(false);
  const modalModeDeterminedRef = useRef(false);

  // Spring bar
  const [displayProgress, setDisplayProgress] = useState(0);
  const springState = useRef({ pos: 0, vel: 0 });
  const animFrameRef = useRef(null);

  // Confetti
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiFiredRef = useRef(false);

  const formattedUsers = useMemo(() => dailyUsers.toLocaleString() + "+", [dailyUsers]);

  const progress = Math.min(100, Math.max(0, ((REPORT_INTERVAL - gamesRemaining) / REPORT_INTERVAL) * 100));
  const completed = REPORT_INTERVAL - gamesRemaining;
  const isComplete = gamesRemaining === 0;

  /* ── Determine upgrade modal mode once per visible=true ── */
  useEffect(() => {
    if (!visible || isProUser || modalModeDeterminedRef.current) return;
    modalModeDeterminedRef.current = true;

    const score = gameSummaryData?.score ?? 0;
    const prevBest = parseInt(localStorage.getItem(BEST_SCORE_KEY) || "0");
    const pb = score > prevBest;
    setIsPersonalBest(pb);

    const mode = getModalMode(score);
    setUpgradeModalMode(mode);
  }, [visible, isProUser, gameSummaryData]);

  /* Reset on close */
  useEffect(() => {
    if (!visible) {
      modalModeDeterminedRef.current = false;
      setUpgradeModalMode("none");
      setShowUpgradeModal(false);
      setIsPersonalBest(false);
      springState.current = { pos: 0, vel: 0 };
      confettiFiredRef.current = false;
      setDisplayProgress(0);
      setShowConfetti(false);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }
  }, [visible]);

  /* ── Spring bar animation ── */
  useEffect(() => {
    if (!visible) return;
    const startDelay = setTimeout(() => {
      const target = progress;
      const tick = () => {
        const { pos, vel } = springState.current;
        const [newPos, newVel] = springStep(pos, vel, target);
        springState.current = { pos: newPos, vel: newVel };
        setDisplayProgress(newPos);
        if (isComplete && !confettiFiredRef.current && newPos >= target * 0.97) {
          confettiFiredRef.current = true;
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 4000);
        }
        const settled = Math.abs(newPos - target) < 0.05 && Math.abs(newVel) < 0.05;
        if (!settled) animFrameRef.current = requestAnimationFrame(tick);
        else { setDisplayProgress(target); springState.current = { pos: target, vel: 0 }; }
      };
      animFrameRef.current = requestAnimationFrame(tick);
    }, 300);
    return () => { clearTimeout(startDelay); if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, [visible, progress, isComplete]);

  /* ── Desktop detect ── */
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ── ESC close ── */
  useEffect(() => {
    if (!visible) return;
    const handleKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [visible, onClose]);

  useEffect(() => {
    if (recommendation) {
      setIsFirstShow(true);
      const timer = setTimeout(() => setIsFirstShow(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [recommendation]);

  /* ── History helpers ── */
  const getHistory = () => {
    try {
      if (user?.id) {
        const key = `${USER_HISTORY_KEY_PREFIX}${user.id}`;
        const history = JSON.parse(localStorage.getItem(key) || "[]");
        if (history.length) return history;
      }
      const guestHistory = JSON.parse(localStorage.getItem(GUEST_HISTORY_KEY) || "[]");
      if (guestHistory.length) return guestHistory;
      return JSON.parse(localStorage.getItem("schulte_last_10_games") || "[]");
    } catch { return []; }
  };

  /* ── Insight calculation ── */
  useEffect(() => {
    if (!gameSummaryData || !visible) return;
    const timer = setTimeout(() => {
      const history = getHistory();
      const previousGames = history.filter((g) => g.completedAt !== gameSummaryData.completedAt);
      if (!previousGames.length) { setInsight("🎯 First recorded game — baseline created"); setInsightType("neutral"); return; }
      const avgPrev = previousGames.reduce((a, g) => a + (g.avgReactionTimeMs || 0), 0) / previousGames.length;
      if (!avgPrev || isNaN(avgPrev)) { setInsight("🎯 Not enough data yet — keep playing!"); setInsightType("neutral"); return; }
      const diff = ((gameSummaryData.avgReactionTimeMs - avgPrev) / avgPrev) * 100;
      if (diff < -12) { setInsight("🚀 Massive improvement. Your brain is adapting fast."); setInsightType("positive"); }
      else if (diff < -6) { setInsight("⚡ Noticeably faster reactions than usual."); setInsightType("positive"); }
      else if (diff < -2) { setInsight("📈 Slight improvement detected."); setInsightType("positive"); }
      else if (diff > 12) { setInsight("🧠 Slower responses. Possible fatigue."); setInsightType("negative"); }
      else if (diff > 6) { setInsight("😐 Slight slowdown compared to usual."); setInsightType("negative"); }
      else { setInsight("🎯 Stable performance. Consistency is excellent."); setInsightType("neutral"); }
    }, 50);
    return () => clearTimeout(timer);
  }, [gameSummaryData, visible]);

  /* ── Recommendation logic ── */
  useEffect(() => {
    if (!visible) return;
    const pool = isDesktop
      ? [{ grid: 4, mode: "alphabet" }, { grid: 5, mode: "maths" }, { grid: 6, mode: "number" }]
      : [{ grid: 3, mode: "alphabet" }, { grid: 4, mode: "number" }];
    setRecommendation(pool[Math.floor(Math.random() * pool.length)]);
  }, [visible, isDesktop]);

  if (!visible || !gameSummaryData) return null;

  const {
    score = 0, accuracy = 0, durationMs = 0,
    avgReactionTimeMs = 0, gridSize = "?", mode = "number",
  } = gameSummaryData;

  const timeSec = (durationMs / 1000).toFixed(2);

  const containerStyle = isDesktop
    ? "fixed inset-0 flex items-center justify-center bg-black/50 z-50"
    : "fixed bottom-0 left-0 right-0 z-50 px-4 pb-4";

  const cardStyle = isDesktop
    ? "relative bg-base-100 p-6 w-full max-w-md animate-scale-in"
    : "relative bg-base-100 rounded-2xl p-4 animate-slide-up border border-1";

  const barGradient =
    displayProgress < 30 ? "linear-gradient(120deg, #ff0080, #7928ca)"
    : displayProgress < 60 ? "linear-gradient(120deg, #c020c8, #2060e8)"
    : displayProgress < 85 ? "linear-gradient(120deg, #7928ca, #00c6ff)"
    : "linear-gradient(120deg, #00c6ff, #00ff88)";

  const barGlow =
    displayProgress < 70 ? "0 0 25px rgba(120,0,255,0.4)" : "0 0 30px rgba(0,255,150,0.6)";

  const barClip = isComplete ? "none" : "polygon(0 0, 96% 0, 100% 100%, 0% 100%)";

  return (
    <>
      <div className={containerStyle} onClick={isDesktop ? onClose : undefined}>
        <div className={cardStyle} onClick={(e) => e.stopPropagation()}>

          {/* Close */}
          <button onClick={onClose} className="absolute top-3 right-3 btn btn-sm btn-ghost rounded-none">✕</button>

          {/* Neuro Coach header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="avatar online">
              <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Brainy" alt="Neuro Coach" />
              </div>
            </div>
            <div>
              <div className="font-bold leading-tight">Neuro Coach</div>
              <div className="text-xs opacity-60">Analyzing your brain performance…</div>
            </div>

            {/* Login nudge for guests — compact, top right area */}
            {!user && (
              <button
                onClick={onLogin}
                className="ml-auto btn btn-xs btn-outline btn-primary rounded-full text-xs"
              >
                Login to save
              </button>
            )}
          </div>

          {/* Performance stats */}
          <PerformanceInfo
            score={score}
            timeSec={timeSec}
            accuracy={accuracy}
            mode={mode}
            gridSize={gridSize}
            avgReactionTimeMs={avgReactionTimeMs}
          />

          {/* Play again button */}
          <button
            className={`
              relative w-full mb-2 rounded-none font-semibold
              flex gap-2 justify-center items-center
              px-6 py-3 transition-all duration-300
              cursor-pointer active:scale-95
              ${isFirstShow
                ? "bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white"
                : "bg-gradient-to-r hover:bg-base-200 from-blue-500 via-cyan-500 to-blue-600 text-white"
              }
            `}
            onClick={() => recommendation ? onTryRecommendation?.(recommendation) : onPlayAgain()}
          >
            Recommended <IoIosArrowRoundForward />
            Play {recommendation?.grid}×{recommendation?.grid}
          </button>

          <DynamicInsight
            gamesRemaining={gamesRemaining}
            REPORT_INTERVAL={REPORT_INTERVAL}
            insightType={insightType}
          />

          {/* Brain Report button */}
          <button
            disabled={gamesRemaining > 0}
            className={`
              relative w-full mb-2 font-semibold text-white
              px-6 py-3 transition-all duration-300
              flex items-center justify-center gap-1
              ${gamesRemaining > 0
                ? "bg-gray-400 cursor-not-allowed opacity-60"
                : "bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500 active:scale-95 cursor-pointer"
              }
            `}
            onClick={() => { if (gamesRemaining === 0) onViewReport(); }}
          >
            <HiDocumentReport />
            {gamesRemaining > 0 ? "Brain Report Locked 🔒" : "View My Brain Report"}
          </button>

          {/* Progress bar */}
          <div className="w-full mt-3">
            <div className="relative h-14 bg-black overflow-hidden border border-white/10 rounded-md">
              {showConfetti && <ConfettiCanvas />}
              <div
                className="absolute top-0 left-0 h-full animate-gradient-slide"
                style={{
                  width: `${displayProgress}%`,
                  transition: "none",
                  clipPath: barClip,
                  backgroundImage: barGradient,
                  backgroundSize: "200% 200%",
                  backgroundRepeat: "no-repeat",
                  boxShadow: barGlow,
                }}
              />
              <div
                className="absolute top-0 h-full w-3 bg-white/50 blur-md"
                style={{ left: `calc(${displayProgress}% - 6px)`, transition: "none", opacity: isComplete ? 0 : 1 }}
              />
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="shine" />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center leading-tight" style={{ zIndex: 11 }}>
                <span className="text-white font-bold tracking-wider text-sm md:text-base drop-shadow-[0_0_10px_rgba(0,0,0,0.9)]">
                  {gamesRemaining > 0
                    ? progress > 80 ? "🔥 FINAL PUSH" : progress > 50 ? "⚡ KEEP GOING" : "🚀 START STRONG"
                    : "🎉 UNLOCKED"}
                </span>
                <span className="text-[10px] md:text-xs text-white/70">
                  {completed}/{REPORT_INTERVAL} COMPLETED
                </span>
              </div>
            </div>
          </div>

          {/* ── Smart upgrade section ── */}
          {!isProUser && upgradeModalMode === "mini" && (
            <MiniNudge
              onUpgrade={() => setShowUpgradeModal(true)}
              isPersonalBest={isPersonalBest}
            />
          )}

          {/* Trigger full modal automatically for game 3/6/9 and personal bests */}
          {!isProUser && upgradeModalMode === "full" && !showUpgradeModal && (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="mt-3 w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-3 active:scale-95 transition-transform"
              style={{
                background: isPersonalBest
                  ? "linear-gradient(135deg, #064e3b, #065f46)"
                  : "linear-gradient(135deg, #1e1040, #1a2a4a)",
                border: isPersonalBest ? "1px solid rgba(74,222,128,0.3)" : "1px solid rgba(124,58,237,0.3)",
                color: isPersonalBest ? "#4ade80" : "#a78bfa",
              }}
            >
              {isPersonalBest ? "🏆 Personal best — see your global rank" : "🔒 Unlock your full Brain Report"}
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: isPersonalBest ? "rgba(74,222,128,0.2)" : "rgba(124,58,237,0.25)",
                  border: isPersonalBest ? "1px solid rgba(74,222,128,0.3)" : "1px solid rgba(124,58,237,0.3)",
                }}
              >
                $4.99
              </span>
            </button>
          )}

        </div>
      </div>

      {/* Full upgrade modal overlay — rendered outside bottom sheet */}
      {!isProUser && showUpgradeModal && (
        <FullUpgradeModal
          onUpgrade={onUpgrade}
          onClose={() => setShowUpgradeModal(false)}
          formattedUsers={formattedUsers}
          score={score}
          isPersonalBest={isPersonalBest}
        />
      )}
    </>
  );
}