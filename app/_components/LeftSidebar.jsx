"use client";

import React, { useState } from "react";

import { FiChevronUp, FiChevronDown, FiSettings } from "react-icons/fi";

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
          md:flex
          md:flex-col
          md:gap-3
          md:w-[300px]
          md:shrink-0
          md:sticky
          md:top-4
          md:self-start
          h-fit
        "
      >
        {/* USER */}
        <div
          className="
            border
            border-base-300
            bg-base-100
            p-3
          "
        >
          <UserAvatar user={user} />
        </div>

        {/* SETTINGS */}
        <div
          className="
            border
            border-base-300
            bg-base-100
            p-4
          "
        >
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

        {/* NAVIGATION */}
        <div className="flex flex-col gap-3">
          <GoToLeaderboard />

          <AnalyticsBtn />
        </div>
      </aside>

      {/* ───────────────── MOBILE DRAWER ───────────────── */}
      <div
        className="
          md:hidden
          fixed
          bottom-0
          inset-x-0
          z-50
        "
      >
        {/* BACKDROP */}
        {mobileOpen && (
          <button
            aria-label="Close settings"
            onClick={() => setMobileOpen(false)}
            className="
              fixed
              inset-0
              bg-black/40
            "
          />
        )}

        {/* DRAWER */}
        <div
          className={`
            relative
            border-t
            border-base-300
            bg-base-100
            transition-transform
            duration-300
            ease-in-out

            ${mobileOpen ? "translate-y-0" : "translate-y-[calc(100%-82px)]"}
          `}
        >
          {/* HANDLE */}
          <div className="flex justify-center pt-3 pb-1">
            <div
              className="
                h-1.5
                w-10
                bg-base-300
              "
            />
          </div>

          {/* TOGGLE BAR */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="
              flex
              w-full
              items-center
              justify-between
              px-4
              py-3
              transition-all
              hover:bg-base-200
              active:scale-[0.99]
            "
          >
            {/* LEFT */}
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  border
                  border-base-300
                  bg-base-200
                  text-primary
                "
              >
                <FiSettings size={20} />
              </div>

              <div className="text-left">
                <p className="text-sm font-semibold text-base-content">
                  Game Settings
                </p>

                <div
                  className="
                    mt-1.5
                    flex
                    flex-wrap
                    items-center
                    gap-1.5
                  "
                >
                  <span className="badge badge-primary badge-sm">
                    {gridSize}×{gridSize}
                  </span>

                  <span className="badge badge-secondary badge-sm capitalize">
                    {difficulty}
                  </span>

                  <span className="badge badge-accent badge-sm capitalize">
                    {mode}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                border
                border-base-300
                bg-base-200
              "
            >
              {mobileOpen ? (
                <FiChevronDown size={18} />
              ) : (
                <FiChevronUp size={18} />
              )}
            </div>
          </button>

          {/* CONTENT */}
          <div
            className={`
              transition-all
              duration-300

              ${mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"}
            `}
          >
            <div className="flex flex-col gap-3 px-4 pb-6 pt-2">
              {/* SETTINGS */}
              <div
                className="
                  border
                  border-base-300
                  bg-base-100
                  p-4
                "
              >
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

              {/* BUTTONS */}
              <div className="grid grid-cols-2 gap-3">
                <GoToLeaderboard />

                <AnalyticsBtn />
              </div>
            </div>

            <div className="h-safe-b" />
          </div>
        </div>
      </div>
    </>
  );
}
