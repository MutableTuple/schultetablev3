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
          <Link href="/schulte-table/4x4" className="link link-hover">
            4x4 Mode
          </Link>
        </li>
        <li>
          <Link href="/schulte-table/5x5" className="link link-hover">
            5x5 Mode
          </Link>
        </li>
        <li>
          <Link href="/schulte-table/printable" className="link link-hover">
            Printable Schulte Table
          </Link>
        </li>
      </ul>
    </nav>
  );
}
