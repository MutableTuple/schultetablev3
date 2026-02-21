"use client";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { HiDocumentReport } from "react-icons/hi";
const GUEST_HISTORY_KEY = "schulte_history_guest";
const USER_HISTORY_KEY_PREFIX = "schulte_history_user_";
const REPORT_INTERVAL = 10;

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
  onLogin,
  onUpgrade,
  dailyUsers = 1200,
}) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [insight, setInsight] = useState("");
  const [recommendation, setRecommendation] = useState(null);

  const [isFirstShow, setIsFirstShow] = useState(true);

  const formattedUsers = useMemo(
    () => dailyUsers.toLocaleString() + "+",
    [dailyUsers],
  );

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

      const timer = setTimeout(() => {
        setIsFirstShow(false);
      }, 4000); // glow for 4 seconds

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

    setTimeout(() => {
      const history = getHistory();

      const previousGames = history.filter(
        (g) => g.completedAt !== gameSummaryData.completedAt,
      );

      if (!previousGames.length) {
        setInsight("🎯 First recorded game — baseline created");

        return;
      }

      const avgPrev =
        previousGames.reduce((a, g) => a + (g.avgReactionTimeMs || 0), 0) /
        previousGames.length;

      const diff =
        ((gameSummaryData.avgReactionTimeMs - avgPrev) / avgPrev) * 100;

      if (diff < -12)
        setInsight("🚀 Massive improvement. Your brain is adapting fast.");
      else if (diff < -6)
        setInsight("⚡ Noticeably faster reactions than usual.");
      else if (diff < -2) setInsight("📈 Slight improvement detected.");
      else if (diff > 12) setInsight("🧠 Slower responses. Possible fatigue.");
      else setInsight("🎯 Stable performance. Consistency is excellent.");
    }, 50);
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
    ? "relative bg-base-100 rounded-2xl shadow-2xl p-6 w-full max-w-md animate-scale-in border border-1"
    : "relative bg-base-100 rounded-2xl shadow-2xl p-4 animate-slide-up border border-1 ";

  return (
    <div className={containerStyle} onClick={isDesktop ? onClose : undefined}>
      <div className={cardStyle} onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 btn btn-circle btn-sm btn-ghost"
        >
          ✕
        </button>

        {/* Neuro Coach */}
        <div className="flex items-center gap-3 mb-4 ">
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
          <div className="mb-4 bg-gradient-to-r from-warning/20 to-secondary/20 border border-warning/30 rounded-xl p-3 flex items-center justify-between">
            <div className="text-xs">
              🧠 <b>{formattedUsers}</b> trained today
              <div className="opacity-70">
                Unlock brain age, focus & reaction analysis
              </div>
            </div>

            {!user ? (
              <Link href={"/login"}>
                <button className="btn btn-primary btn-xs">Login</button>
              </Link>
            ) : (
              <button
                onClick={onUpgrade}
                className="btn btn-warning btn-xs animate-pulse"
              >
                ⚡ Unlock PRO
              </button>
            )}
          </div>
        )}
        {/* Play */}
        <button
          className={`
    relative w-full mb-2 rounded-full font-semibold text-white
    px-6 py-3 transition-all duration-300
    bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500
    cursor-pointer
    hover:shadow-[0_10px_30px_rgba(59,130,246,0.6)]
    active:scale-95
    ${isFirstShow ? "animate-glow shadow-[0_0_25px_rgba(59,130,246,0.8)]" : ""}
  `}
          onClick={() =>
            recommendation
              ? onTryRecommendation?.(recommendation)
              : onPlayAgain()
          }
        >
          Recommended 👉 Play {recommendation?.grid}×{recommendation?.grid}
        </button>

        {/* Report */}
        <button
          disabled={gamesRemaining > 0}
          className={`
    relative w-full mb-2 rounded-full font-semibold text-white
    px-6 py-3 transition-all duration-300
    flex items-center justify-center gap-1
    ${
      gamesRemaining > 0
        ? "bg-gray-400 cursor-not-allowed opacity-60"
        : "bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500 hover:shadow-[0_10px_30px_rgba(34,197,94,0.6)] active:scale-95 cursor-pointer"
    }
  `}
          onClick={() => {
            if (gamesRemaining === 0) {
              onViewReport();
            }
          }}
        >
          <HiDocumentReport />
          {gamesRemaining > 0 ? "Locked Report" : "View Brain Report"}
        </button>
        {/* Performance */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-4 mb-3">
          <div className="text-2xl font-extrabold">Score: {score}</div>

          <div className="flex gap-2 mt-1">
            <span className="badge badge-primary badge-sm">
              {gridSize}×{gridSize}
            </span>

            <span className="badge badge-secondary badge-sm capitalize">
              {mode} mode
            </span>
          </div>

          <div className="text-xs opacity-70 mt-1">
            ⏱ {timeSec}s • 🎯 {accuracy}%
          </div>

          <div className="text-right mt-2">
            Avg Reaction: <b>{avgReactionTimeMs} ms</b>
          </div>
        </div>

        {/* Insight */}
        <div className="alert bg-base-200 text-sm mb-3">{insight}</div>

        {/* Brain Report */}
        <div className="bg-base-200 border border-base-300 rounded-xl p-3 text-center mb-3">
          {gamesRemaining > 0 ? (
            <div>
              <div className="font-semibold">
                🔒 {gamesRemaining} games to unlock full report
              </div>
              <div className="text-xs opacity-60 mt-1">
                Complete {REPORT_INTERVAL} games to unlock deep brain analytics
              </div>
            </div>
          ) : (
            <div className="text-green-600 font-semibold animate-pulse">
              🔓 Advanced Brain Report Unlocked!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
