"use client";

import React, { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  FileBarChart,
  Settings,
  ChevronDown,
  Shuffle,
  Clock,
  Grid3x3,
  Target,
  Star,
  LayoutDashboard,
  FileText,
  Check,
  BadgeCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

import GamePlayedCount from "./GamePlayedCount";
import UserLargeScreenStat from "./UserLargeScreenStat";
import NotLoggedInRightDrawerNotif from "./NotLoggedInRightDrawerNotif";
import GridAndDifficultySelector from "./GridAndDifficultySelector";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

const RANDOM_MODES = ["number", "word", "alphabet", "emoji", "maths"];
const RANDOM_DIFFICULTIES = ["Easy", "Medium", "Hard", "Extreme", "Impossible"];

function DashedLabel({ children }) {
  return (
    <div className="flex items-center gap-2 my-3">
      <span className="flex-1 border-t border-dashed border-border" />
      <span className="text-[11px] text-muted-foreground whitespace-nowrap">
        {children}
      </span>
      <span className="flex-1 border-t border-dashed border-border" />
    </div>
  );
}

// SchulteTable already writes the finished game to localStorage
// (schulte_history_user_{id} / schulte_history_guest) synchronously
// before "game-finished" fires — map that shape onto the old
// UniversalGameStats row shape so GamePlayedCount/UserLargeScreenStat
// don't need to change.
function normalizeLocalGame(g) {
  if (!g) return null;
  return {
    time_taken: (g.durationMs / 1000).toFixed(2),
    grid_size: g.gridSize,
    difficulty: g.difficulty,
    total_wrong_click: g.mistakes,
    total_right_click: g.totalTiles,
    score: g.score,
  };
}

function readLastLocalGame(userId) {
  if (typeof window === "undefined") return null;
  try {
    const key = userId
      ? `schulte_history_user_${userId}`
      : "schulte_history_guest";
    const history = JSON.parse(localStorage.getItem(key) || "[]");
    return normalizeLocalGame(history[0] ?? null);
  } catch {
    return null;
  }
}

export default function RightDrawer({
  user,
  gridSize,
  setGridSize,
  difficulty,
  setDifficulty,
  mode,
  setMode,
  gameStarted,
}) {
  const userId = user?.id;
  const isPro = user?.is_pro_user;

  const [userData, setUserData] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [settingsOpen, setSettingsOpen] = useState(true);

  // Instant, local read — no network round trip, no loading state needed.
  const loadFromLocal = useCallback(() => {
    setUserData(userId ? readLastLocalGame(userId) : null);
  }, [userId]);

  useEffect(() => {
    loadFromLocal();

    window.addEventListener("game-finished", loadFromLocal);
    return () => window.removeEventListener("game-finished", loadFromLocal);
  }, [loadFromLocal]);

  const totalGames =
    userData?.total_games_played || userData?.games_played || 0;
  const requiredGames = 25;
  const progressPercentage = Math.min((totalGames / requiredGames) * 100, 100);
  const reportUnlocked = totalGames >= requiredGames;

  useEffect(() => {
    if (reportUnlocked) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [reportUnlocked]);

  const lastGame = userData;

  const tabClass = (active) =>
    cn(
      "flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-none",
      active
        ? "bg-[var(--ink)] text-background"
        : "bg-muted text-muted-foreground",
    );

  const statBlocks = [
    { label: "Time taken", icon: Clock },
    { label: "Grid", icon: Grid3x3 },
    { label: "Accuracy", icon: Target },
    { label: "Score", icon: Star },
  ];

  const handleRandomCombo = () => {
    const randomMode =
      RANDOM_MODES[Math.floor(Math.random() * RANDOM_MODES.length)];
    const gridPool = randomMode === "alphabet" ? [3, 4, 5] : [3, 4, 5, 6];
    const randomGrid = gridPool[Math.floor(Math.random() * gridPool.length)];
    const randomDifficulty =
      RANDOM_DIFFICULTIES[
        Math.floor(Math.random() * RANDOM_DIFFICULTIES.length)
      ];

    setMode(randomMode);
    setGridSize(randomGrid);
    setDifficulty(randomDifficulty);
  };

  return (
    <div className="relative flex min-h-full w-[320px] flex-col border-l border-border bg-background text-foreground">
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}

      {/* TABS */}
      <div className="grid grid-cols-2 gap-2 p-3">
        <button
          onClick={() => setActiveTab("overview")}
          className={tabClass(activeTab === "overview")}
        >
          <LayoutDashboard size={13} />
          Overview
        </button>
        <button
          onClick={() => setActiveTab("report")}
          className={tabClass(activeTab === "report")}
        >
          <FileText size={13} />
          Last Game Report
        </button>
      </div>

      {activeTab === "overview" ? (
        <>
          <UserAvatar user={user} />

          {/* SETTINGS DROPDOWN */}
          <div>
            <button
              onClick={() => setSettingsOpen((o) => !o)}
              className="w-full flex items-center justify-between px-4 py-3"
            >
              <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                <Settings size={14} />
                Game settings
              </span>
              <ChevronDown
                size={14}
                className={cn(
                  "text-muted-foreground transition-transform duration-200",
                  settingsOpen && "rotate-180",
                )}
              />
            </button>

            {settingsOpen && (
              <div
                className={cn(
                  "px-4 pb-4 transition-opacity duration-300",
                  gameStarted && "pointer-events-none opacity-30",
                )}
              >
                <div className="mt-4">
                  <GridAndDifficultySelector
                    gridSize={gridSize}
                    setGridSize={setGridSize}
                    difficulty={difficulty}
                    setDifficulty={setDifficulty}
                    gameStarted={gameStarted}
                    mode={mode}
                    setMode={setMode}
                  />
                </div>

                <button
                  onClick={handleRandomCombo}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-none bg-[var(--ink)] text-background"
                >
                  <Shuffle size={14} />
                  Try Random Combo
                </button>
              </div>
            )}
          </div>
          {/* 
          <div className="px-4 pb-2">
            {userData ? (
              <GamePlayedCount userData={userData} mode={mode} user={user} />
            ) : (
              <div className="grid grid-cols-4 gap-2 text-center">
                {statBlocks.map(({ label, icon: Icon }) => (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <Icon size={14} className="text-muted-foreground" />
                    <p className="text-sm font-bold">—</p>
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            )}
          </div> */}

          <div className="px-4">
            <DashedLabel>Brain Report</DashedLabel>
          </div>

          <div className="px-4 pb-4">
            {userId &&
              (isPro ? (
                <div className="relative overflow-hidden bg-[var(--ink)] text-background rounded-none border border-primary/25 p-4">
                  {/* shine sweep — reuses your existing .shine / @keyframes shineMove */}
                  <div className="shine pointer-events-none" />

                  <div className="relative flex gap-3 mb-3">
                    <div className="w-10 h-10 rounded-none bg-primary/15 flex items-center justify-center shrink-0">
                      <FileBarChart size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold leading-snug mb-1">
                        See My Monthly Brain Report
                      </p>
                      <p className="text-[11px] text-background/60">
                        See if your mind is getting sharper — or getting lost in
                        the scroll.
                      </p>
                    </div>
                  </div>

                  <Button
                    render={<Link href="/monthly-brain-report" />}
                    className="relative w-full py-2 text-xs font-bold rounded-none bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    View My Report
                  </Button>
                </div>
              ) : (
                <div className="relative overflow-hidden bg-[var(--ink)] text-background rounded-none border border-primary/25 p-4">
                  {/* shine sweep — reuses your existing .shine / @keyframes shineMove */}
                  <div className="shine pointer-events-none" />

                  <div className="relative flex gap-3 mb-3">
                    <div className="w-10 h-10 rounded-none bg-primary/15 flex items-center justify-center shrink-0">
                      <FileBarChart size={18} className="text-primary" />
                    </div>
                    <div>
                      <div className="flex flex-col gap-2 mb-1">
                        <p className="text-sm font-bold leading-snug">
                          Your Full Brain Report Is Waiting, Stay Among the Top
                          1%
                        </p>
                        <span className="bg-primary w-fit flex items-center gap-1 text-primary-foreground text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-none shrink-0">
                          <BadgeCheck size={11} className="shrink-0" />
                          Pro
                        </span>
                      </div>
                      <p className="text-[11px] text-background/60">
                        See if your mind is getting sharper — or getting lost in
                        the scroll.
                      </p>
                    </div>
                  </div>

                  {/* feature ticks */}
                  <ul className="relative space-y-1.5 mb-4">
                    {[
                      "Full month performance breakdown",
                      "Personalized AI insights on your progress",
                      "Proof you're training, not scrolling",
                    ].map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-[11px] text-background/75"
                      >
                        <Check size={12} className="text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Button
                    render={<Link href="/monthly-brain-report" />}
                    className="relative w-full py-2 text-xs font-bold rounded-none bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Unlock with Pro
                  </Button>
                </div>
              ))}
          </div>
          {!userId && (
            <div className="px-4 pb-4">
              <NotLoggedInRightDrawerNotif />
            </div>
          )}
        </>
      ) : (
        <div className="px-4 py-6">
          {lastGame ? (
            <UserLargeScreenStat
              gridSize={gridSize}
              difficulty={difficulty}
              mode={mode}
              user={user}
            />
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              Play a game to see your last report.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
