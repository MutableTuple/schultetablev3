"use client";
import Link from "next/link";
import { useEffect, useState, useMemo, useRef, use } from "react";
import { HiDocumentReport } from "react-icons/hi";
const GUEST_HISTORY_KEY = "schulte_history_guest";
const USER_HISTORY_KEY_PREFIX = "schulte_history_user_";
const REPORT_INTERVAL = 10;
import { IoIosArrowRoundForward } from "react-icons/io";
import { PiConfettiFill } from "react-icons/pi";
import PerformanceInfo from "./PerformanceInfo";
import DynamicInsight from "./DynamicInsight";
import IsProSell from "./IsProSell";

/* ─────────────────────────────────────────────────────────────────────────────
   Spring physics
   Simulates one step of a damped spring given current pos/vel toward a target.
   stiffness=160, damping=20 → responsive with a gentle natural overshoot.
───────────────────────────────────────────────────────────────────────────── */
function springStep(
  pos,
  vel,
  target,
  stiffness = 160,
  damping = 20,
  mass = 1,
  dt = 1 / 60,
) {
  const force = -stiffness * (pos - target) - damping * vel;
  const acc = force / mass;
  const newVel = vel + acc * dt;
  const newPos = pos + newVel * dt;
  return [newPos, newVel];
}

/* ─────────────────────────────────────────────────────────────────────────────
   Confetti canvas — bursts from both sides, fades out, self-destructs at 4 s
───────────────────────────────────────────────────────────────────────────── */
function ConfettiCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const W = canvas.width;
    const H = canvas.height;

    const COLORS = [
      "#ff0080",
      "#7928ca",
      "#00c6ff",
      "#00ff88",
      "#ffdd00",
      "#ff6b35",
      "#c77dff",
      "#48cae4",
    ];
    const SHAPES = ["rect", "circle", "strip"];

    // 120 particles bursting from top-left and top-right areas
    const particles = Array.from({ length: 120 }, (_, i) => {
      const fromLeft = i < 60;
      return {
        x: fromLeft ? W * 0.2 : W * 0.8,
        y: H * 0.5,
        vx: (Math.random() - (fromLeft ? 0.25 : 0.75)) * 15,
        vy: -(Math.random() * 10 + 5),
        rot: Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.28,
        w: Math.random() * 9 + 4,
        h: Math.random() * 5 + 3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        alpha: 1,
        gravity: 0.28 + Math.random() * 0.12,
      };
    });

    let raf;
    let elapsed = 0;
    let last = performance.now();

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
        if (elapsed > 2500) p.alpha = Math.max(0, p.alpha - 0.018 * dt);
        if (p.alpha > 0) anyAlive = true;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "strip") {
          ctx.fillRect(-p.w / 2, -1.5, p.w, 3);
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      }

      if (anyAlive) raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 10,
        borderRadius: "inherit",
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main component — only the bar section + spring/confetti logic changed
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

  // ── Spring-animated bar ───────────────────────────────────────────────────
  const [displayProgress, setDisplayProgress] = useState(0);
  const springState = useRef({ pos: 0, vel: 0 });
  const animFrameRef = useRef(null);

  // ── Confetti (fires once per completion event) ────────────────────────────
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiFiredRef = useRef(false);
  // ─────────────────────────────────────────────────────────────────────────

  const formattedUsers = useMemo(
    () => dailyUsers.toLocaleString() + "+",
    [dailyUsers],
  );

  const progress = Math.min(
    100,
    Math.max(0, ((REPORT_INTERVAL - gamesRemaining) / REPORT_INTERVAL) * 100),
  );
  const completed = REPORT_INTERVAL - gamesRemaining;
  const isComplete = gamesRemaining === 0;

  /* ===========================================
     Spring animation + confetti trigger
  =========================================== */
  useEffect(() => {
    if (!visible) {
      // Full reset when sheet hides so next open re-animates from zero
      springState.current = { pos: 0, vel: 0 };
      confettiFiredRef.current = false;
      setDisplayProgress(0);
      setShowConfetti(false);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    // Brief pause so the modal entrance animation is visible first
    const startDelay = setTimeout(() => {
      const target = progress;

      const tick = () => {
        const { pos, vel } = springState.current;
        const [newPos, newVel] = springStep(pos, vel, target);
        springState.current = { pos: newPos, vel: newVel };

        setDisplayProgress(newPos);

        // Trigger confetti exactly once when the bar lands near 100 %
        if (
          isComplete &&
          !confettiFiredRef.current &&
          newPos >= target * 0.97
        ) {
          confettiFiredRef.current = true;
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 4000);
        }

        // Settle check — stop rAF when motion is imperceptible
        const settled =
          Math.abs(newPos - target) < 0.05 && Math.abs(newVel) < 0.05;
        if (!settled) {
          animFrameRef.current = requestAnimationFrame(tick);
        } else {
          setDisplayProgress(target);
          springState.current = { pos: target, vel: 0 };
        }
      };

      animFrameRef.current = requestAnimationFrame(tick);
    }, 300);

    return () => {
      clearTimeout(startDelay);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [visible, progress, isComplete]);

  /* ===========================================
     Detect desktop
  =========================================== */
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ===========================================
     ESC close
  =========================================== */
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

  /* ===========================================
     Get history
  =========================================== */
  const getHistory = () => {
    try {
      if (user?.id) {
        const key = `${USER_HISTORY_KEY_PREFIX}${user.id}`;
        const history = JSON.parse(localStorage.getItem(key) || "[]");
        if (history.length) return history;
      }
      const guestHistory = JSON.parse(
        localStorage.getItem(GUEST_HISTORY_KEY) || "[]",
      );
      if (guestHistory.length) return guestHistory;
      const oldHistory = JSON.parse(
        localStorage.getItem("schulte_last_10_games") || "[]",
      );
      return oldHistory;
    } catch {
      return [];
    }
  };

  /* ===========================================
     Insight calculation
  =========================================== */
  useEffect(() => {
    if (!gameSummaryData || !visible) return;
    const timer = setTimeout(() => {
      const history = getHistory();
      const previousGames = history.filter(
        (g) => g.completedAt !== gameSummaryData.completedAt,
      );
      if (!previousGames.length) {
        setInsight("🎯 First recorded game — baseline created");
        setInsightType("neutral");
        return;
      }
      const avgPrev =
        previousGames.reduce((a, g) => a + (g.avgReactionTimeMs || 0), 0) /
        previousGames.length;
      if (!avgPrev || isNaN(avgPrev)) {
        setInsight("🎯 Not enough data yet — keep playing!");
        setInsightType("neutral");
        return;
      }
      const diff =
        ((gameSummaryData.avgReactionTimeMs - avgPrev) / avgPrev) * 100;
      if (diff < -12) {
        setInsight("🚀 Massive improvement. Your brain is adapting fast.");
        setInsightType("positive");
      } else if (diff < -6) {
        setInsight("⚡ Noticeably faster reactions than usual.");
        setInsightType("positive");
      } else if (diff < -2) {
        setInsight("📈 Slight improvement detected.");
        setInsightType("positive");
      } else if (diff > 12) {
        setInsight("🧠 Slower responses. Possible fatigue.");
        setInsightType("negative");
      } else if (diff > 6) {
        setInsight("😐 Slight slowdown compared to usual.");
        setInsightType("negative");
      } else {
        setInsight("🎯 Stable performance. Consistency is excellent.");
        setInsightType("neutral");
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [gameSummaryData, visible]);

  /* ===========================================
     Recommendation logic
  =========================================== */
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
    gridSize = "?",
    mode = "number",
  } = gameSummaryData;

  const timeSec = (durationMs / 1000).toFixed(2);

  const containerStyle = isDesktop
    ? "fixed inset-0 flex items-center justify-center bg-black/50 z-50"
    : "fixed bottom-0 left-0 right-0 z-50 px-4 pb-4";

  const cardStyle = isDesktop
    ? "relative bg-base-100 p-6 w-full max-w-md animate-scale-in"
    : "relative bg-base-100 rounded-2xl p-4 animate-slide-up border border-1";

  // ── Bar visuals driven by live displayProgress ────────────────────────────
  const barGradient =
    displayProgress < 30
      ? "linear-gradient(120deg, #ff0080, #7928ca)"
      : displayProgress < 60
        ? "linear-gradient(120deg, #c020c8, #2060e8)"
        : displayProgress < 85
          ? "linear-gradient(120deg, #7928ca, #00c6ff)"
          : "linear-gradient(120deg, #00c6ff, #00ff88)";

  const barGlow =
    displayProgress < 70
      ? "0 0 25px rgba(120,0,255,0.4)"
      : "0 0 30px rgba(0,255,150,0.6)";

  // Full rectangle when done; slanted parallelogram while filling
  const barClip = isComplete
    ? "none"
    : "polygon(0 0, 96% 0, 100% 100%, 0% 100%)";
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className={containerStyle} onClick={isDesktop ? onClose : undefined}>
      <div className={cardStyle} onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 btn btn-sm btn-ghost rounded-none"
        >
          ✕
        </button>

        {/* Neuro Coach */}
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
            <div className="font-bold leading-tight">Neuro Coach</div>
            <div className="text-xs opacity-60">
              Analyzing your brain performance…
            </div>
          </div>
        </div>

        {/* PRO section */}
        {!isProUser && (
     <IsProSell formattedUsers={formattedUsers} user={user} onUpgrade={onUpgrade}/>
        )}

        {/* Performance */}
        <PerformanceInfo
          score={score}
          timeSec={timeSec}
          accuracy={accuracy}
          mode={mode}
          gridSize={gridSize}
          avgReactionTimeMs={avgReactionTimeMs}
        />

        {/* Play */}
        <button
          className={`
            relative w-full mb-2 rounded-none font-semibold
            flex gap-2 justify-center items-center
            px-6 py-3 transition-all duration-300
            cursor-pointer active:scale-95
            ${
              isFirstShow
                ? "bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white"
                : "bg-gradient-to-r hover:bg-base-200 from-blue-500 via-cyan-500 to-blue-600 text-white"
            }
          `}
          onClick={() =>
            recommendation
              ? onTryRecommendation?.(recommendation)
              : onPlayAgain()
          }
        >
          Recommended <IoIosArrowRoundForward />
          Play {recommendation?.grid}×{recommendation?.grid}
        </button>
        <DynamicInsight
          gamesRemaining={gamesRemaining}
          REPORT_INTERVAL={REPORT_INTERVAL}
          insightType={insightType}
        />
        {/* Report */}
        <button
          disabled={gamesRemaining > 0}
          className={`
            relative w-full mb-2 font-semibold text-white
            px-6 py-3 transition-all duration-300
            flex items-center justify-center gap-1
            ${
              gamesRemaining > 0
                ? "bg-gray-400 cursor-not-allowed opacity-60"
                : "bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500 active:scale-95 cursor-pointer"
            }
          `}
          onClick={() => {
            if (gamesRemaining === 0) onViewReport();
          }}
        >
          <HiDocumentReport />
          {gamesRemaining > 0
            ? "Brain Report Locked 🔒"
            : "View My Brain Report"}
        </button>

        {/* ── PROGRESS BAR ──────────────────────────────────────────────────── */}
        <div className="w-full mt-3">
          {/*
            overflow-hidden keeps the confetti canvas clipped to the bar shape.
            `relative` is required so the absolute-positioned canvas and fills
            are scoped to this container.
          */}
          <div className="relative h-14 bg-black overflow-hidden border border-white/10 rounded-md">
            {/* 🎊 CONFETTI — mounted only when complete, unmounts after 4 s */}
            {showConfetti && <ConfettiCanvas />}

            {/* 🔥 PROGRESS FILL — spring drives width frame-by-frame */}
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

            {/* ⚡ EDGE GLOW */}
            <div
              className="absolute top-0 h-full w-3 bg-white/50 blur-md"
              style={{
                left: `calc(${displayProgress}% - 6px)`,
                transition: "none",
                opacity: isComplete ? 0 : 1,
              }}
            />

            {/* ✨ SHINE */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="shine" />
            </div>

            {/* 🧠 TEXT — z-index above confetti canvas */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center leading-tight"
              style={{ zIndex: 11 }}
            >
              <span className="text-white font-bold tracking-wider text-sm md:text-base drop-shadow-[0_0_10px_rgba(0,0,0,0.9)]">
                {gamesRemaining > 0
                  ? progress > 80
                    ? "🔥 FINAL PUSH"
                    : progress > 50
                      ? "⚡ KEEP GOING"
                      : "🚀 START STRONG"
                  : "🎉 UNLOCKED"}
              </span>
              <span className="text-[10px] md:text-xs text-white/70">
                {completed}/{REPORT_INTERVAL} COMPLETED
              </span>
            </div>
          </div>
        </div>
        {/* ─────────────────────────────────────────────────────────────────── */}
      </div>
    </div>
  );
}
