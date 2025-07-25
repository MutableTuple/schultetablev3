"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import RightDrawer from "./RightDrawer";

const SchulteTable = dynamic(() => import("./Schultetable/SchulteTable"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-40">
      <span className="loading loading-spinner loading-lg text-primary" />
    </div>
  ),
});

const GridAndDifficultySelector = dynamic(
  () => import("./GridAndDifficultySelector"),
  {
    ssr: false,
  }
);

const UserAvatar = dynamic(() => import("./UserAvatar"), { ssr: false });
const GoToLeaderboard = dynamic(() => import("./GoToLeaderboard"), {
  ssr: false,
});
const FloatingMenu = dynamic(() => import("./FloatingMenu"), { ssr: false });
// const PWAInstallButton = dynamic(() => import("./PWAInstallButton"), { ssr: false });

export default function HomeMain({ user, error }) {
  const [gridSize, setGridSize] = useState(3);
  const [difficulty, setDifficulty] = useState("Medium");
  const [gameStarted, setGameStarted] = useState(false);
  const [mode, setMode] = useState("number");

  return (
    <div className="drawer drawer-end lg:drawer-open min-h-screen">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      <GridAndDifficultySelector
        gridSize={gridSize}
        setGridSize={setGridSize}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        gameStarted={gameStarted}
        mode={mode}
        setMode={setMode}
      />

      <GoToLeaderboard />
      <UserAvatar user={user} />

      <div className="drawer-content relative p-4 flex items-center justify-center min-h-screen overflow-auto">
        <label
          htmlFor="my-drawer"
          className="btn btn-ghost btn-circle absolute top-4 right-4 z-50 drawer-button lg:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </label>

        <FloatingMenu />

        {/* ✅ Lazy loaded with spinner */}
        <SchulteTable
          gridSize={gridSize}
          difficulty={difficulty}
          gameStarted={gameStarted}
          setGameStarted={setGameStarted}
          user={user}
          mode={mode}
        />
      </div>

      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay" />
        <RightDrawer
          user={user}
          gridSize={gridSize}
          difficulty={difficulty}
          mode={mode}
        />
      </div>
    </div>
  );
}
