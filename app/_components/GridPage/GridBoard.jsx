"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import RightDrawer from "@/app/_components/RightDrawer";

/**
 * ssr:false is load-bearing, not an optimisation.
 *
 * SchulteTable cannot render on the server — importing it directly makes the
 * server render throw, and Next then discards the *entire* route's HTML and
 * falls back to client rendering. The symptom is invisible in a browser and
 * fatal for SEO: `curl /schulte-table/7x7` returned zero <h1> tags and zero
 * body copy, with all content buried in the RSC flight payload instead of the
 * HTML. That has been true of every grid page (/3x3, /7x7, /9x9) since they
 * were built.
 *
 * The homepage never had the bug because HomeMain already loads SchulteTable
 * this way. This mirrors that. With it, the page's header, SEO copy and
 * JSON-LD server-render normally and only the board hydrates on the client.
 */
const SchulteTable = dynamic(
  () => import("@/app/_components/Schultetable/SchulteTable"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    ),
  },
);

/**
 * Generic playable board for the per-size landing pages.
 *
 * Replaces the copy-pasted Schulteboard3x3 / Schulteboard7x7 / Schulteboard9x9
 * wrappers, which were identical apart from a hardcoded gridSize. The old
 * `_4x4` variant had drifted furthest — it imported
 * `_components/Schultetable-COPY`, a directory that no longer exists, which is
 * why the folder had to be renamed to a non-routable `_4x4` to keep the build
 * green. One component means that can't happen again.
 *
 * gridSize/difficulty/mode are stateful here (not fixed props) so the sidebar
 * controls stay functional on these pages — the previous wrappers passed
 * constants with no setters, so changing grid size from the drawer silently
 * did nothing.
 */
export default function GridBoard({ user, initialSize, initialDifficulty = "Easy" }) {
  const [gameStarted, setGameStarted] = useState(false);
  const [gridSize, setGridSize] = useState(initialSize);
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [mode, setMode] = useState("number");

  return (
    <div className="drawer drawer-end lg:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <SchulteTable
          gridSize={gridSize}
          setGridSize={setGridSize}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          mode={mode}
          setMode={setMode}
          gameStarted={gameStarted}
          setGameStarted={setGameStarted}
          user={user}
        />
      </div>
      <div className="drawer-side z-[60]">
        <label htmlFor="my-drawer" className="drawer-overlay" />
        <RightDrawer
          user={user}
          gridSize={gridSize}
          setGridSize={setGridSize}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          mode={mode}
          setMode={setMode}
          gameStarted={gameStarted}
        />
      </div>
    </div>
  );
}
