import Link from "next/link";
import React from "react";

export default function GameModesLinks() {
  return (
    <nav>
      <h2 className="footer-title">🎮 Game Modes</h2>
      {/* Placeholder to replace with a <GameModeNav /> component later */}
      <ul className="space-y-1 text-sm">
        <li>
          <Link href="/schulte-table/3x3" className="link link-hover">
            3x3 Easy Mode
          </Link>
        </li>
        <li>
          <Link href="/schulte-table/3x3/medium" className="link link-hover">
            3x3 Medium Mode
          </Link>
        </li>
        <li>
          <Link href="/schulte-table/3x3/hard" className="link link-hover">
            3x3 Hard Mode
          </Link>
        </li>
        <li>
          <Link href="/schulte-table/3x3/extreme" className="link link-hover">
            3x3 Extreme Mode
          </Link>
        </li>
        <li>
          <Link
            href="/schulte-table/3x3/impossible"
            className="link link-hover"
          >
            3x3 Impossible Mode
          </Link>
        </li>
        <li>
          <Link href="/" className="link link-hover">
            4x4–6x6 Grids (Play Now)
          </Link>
        </li>
        <li>
          <Link href="/schulte-table/7x7" className="link link-hover">
            7x7 Advanced
          </Link>
        </li>
        <li>
          <Link href="/schulte-table/9x9" className="link link-hover">
            9x9 Largest Grid
          </Link>
        </li>
      </ul>
    </nav>
  );
}
