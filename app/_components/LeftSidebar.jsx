"use client";

import React, { useState } from "react";
import { FiChevronUp, FiChevronDown, FiSettings, FiX } from "react-icons/fi";

import GridAndDifficultySelector from "./GridAndDifficultySelector";
import GoToLeaderboard from "./GoToLeaderboard";
import AnalyticsBtn from "./AnalyticsBtn";
import UserAvatar from "./UserAvatar";

export default function LeftSidebar({
  gridSize,
  setGridSize,
  difficulty,
  setDifficulty,
  gameStarted,
  mode,
  setMode,
  user,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ───────────────── DESKTOP SIDEBAR ───────────────── */}
      <aside
        className="
          hidden
          md:flex md:flex-col md:gap-3
          md:w-[300px] md:shrink-0
          md:sticky md:top-4 md:self-start
          h-fit
        "
      >
        <div className="border border-base-300 bg-base-100 p-3">
          <UserAvatar user={user} />
        </div>
        <div className="border border-base-300 bg-base-100 p-4">
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
        <div className="flex flex-col gap-3">
          <GoToLeaderboard />
          <AnalyticsBtn />
        </div>
      </aside>

      {/* ───────────────── MOBILE DRAWER ───────────────── */}
      <div className="md:hidden">
        {/* BACKDROP */}
        {mobileOpen && (
          <button
            aria-label="Close settings"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
        )}

        {/* FLOATING PILL — only visible when closed */}
        {!mobileOpen && (
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open settings"
            className="
              fixed bottom-5 right-4 z-50
              flex items-center gap-2
              rounded-full border border-base-300
              bg-base-100 px-4 py-2.5
              shadow-lg active:scale-95 transition-transform duration-150
            "
            style={{ paddingBottom: "max(10px, env(safe-area-inset-bottom))" }}
          >
            <FiSettings size={16} className="text-primary shrink-0" />
            <span className="text-xs font-semibold text-base-content">
              Settings
            </span>
            <div className="flex items-center gap-1 ml-1">
              <span className="badge badge-primary badge-xs">
                {gridSize}×{gridSize}
              </span>
              <span className="badge badge-secondary badge-xs capitalize">
                {difficulty}
              </span>
            </div>
            <FiChevronUp size={14} className="text-base-content/60 ml-1" />
          </button>
        )}

        {/* DRAWER SHEET */}
        {mobileOpen && (
          <div
            className="
              fixed bottom-0 inset-x-0 z-50
              rounded-t-2xl border-t border-base-300
              bg-base-100 shadow-2xl
              flex flex-col
              animate-slideUp
            "
            style={{
              maxHeight: "82dvh",
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
          >
            {/* DRAG HANDLE — never scrolls */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="h-1 w-10 rounded-full bg-base-300" />
            </div>

            {/* HEADER — never scrolls */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-base-200 flex-shrink-0">
              <div className="flex items-center gap-2">
                <FiSettings size={16} className="text-primary" />
                <span className="text-sm font-bold text-base-content">
                  Game Settings
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge badge-primary badge-sm">
                  {gridSize}×{gridSize}
                </span>
                <span className="badge badge-secondary badge-sm capitalize">
                  {difficulty}
                </span>
                <span className="badge badge-accent badge-sm capitalize">
                  {mode}
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="ml-1 flex h-8 w-8 items-center justify-center rounded-full border border-base-300 bg-base-200 active:scale-90 transition-transform"
                >
                  <FiX size={14} />
                </button>
              </div>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="overflow-y-auto overscroll-contain flex-1 flex flex-col gap-3 px-4 pt-4 pb-6">
              <div className="border border-base-300 bg-base-100 p-3">
                <UserAvatar user={user} />
              </div>
              <div className="border border-base-300 bg-base-100 p-4">
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
              <div className="grid grid-cols-2 gap-3">
                <GoToLeaderboard />
                <AnalyticsBtn />
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .animate-slideUp {
          animation: slideUp 0.25s cubic-bezier(0.32, 0.72, 0, 1) forwards;
        }
      `}</style>
    </>
  );
}
