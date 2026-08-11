"use client";
import RightDrawer from "@/app/_components/RightDrawer";
import React, { useState } from "react";
import dynamic from "next/dynamic";

// ssr:false is required, not an optimisation. SchulteTable throws during a
// server render; importing it directly made Next discard this whole route's
// HTML and fall back to client rendering, so the page shipped no <h1> and no
// body copy to crawlers. Matches the pattern HomeMain already uses.
const SchulteTable = dynamic(() => import("@/app/_components/Schultetable/SchulteTable"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 items-center justify-center">
      <span className="loading loading-spinner loading-lg text-primary" />
    </div>
  ),
});
export default function Schulteboard3x3extreme({ user }) {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="drawer drawer-end lg:drawer-open min-h-screen">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div>
        <SchulteTable
          gridSize={3}
          difficulty={"Extreme"}
          gameStarted={gameStarted}
          setGameStarted={setGameStarted}
          user={user}
          mode={"number"}
        />
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <RightDrawer
          user={user}
          gridSize={3}
          difficulty={"Extreme"}
          mode={"number"}
        />
      </div>
    </div>
  );
}
