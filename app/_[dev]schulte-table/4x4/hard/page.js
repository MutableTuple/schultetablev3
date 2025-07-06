import { getCurrentUser } from "@/app/_utils/getCurrentUser";
import React from "react";
import Schulteboard4x4hard from "./Schulteboard4x4hard";
import Link from "next/link";
import {
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaSignInAlt,
  FaUserPlus,
  FaCheckCircle,
  FaEye,
  FaBrain,
  FaMobileAlt,
  FaClock,
  FaStopwatch,
} from "react-icons/fa";

// ✅ SEO Meta for 4x4 Hard Mode
export const metadata = {
  title: "Play 4x4 Schulte Table Hard – Sharpen Focus & Mental Agility",
  description:
    "Challenge your cognitive speed with 4x4 Schulte Table Hard Mode. Designed for advanced users, this brain game boosts visual scanning, focus, and reaction time.",
  keywords: [
    "4x4 schulte table hard",
    "hard focus game",
    "advanced schulte table",
    "visual speed brain training",
    "hardcore brain challenge",
    "cognitive speed exercise",
    "4x4 brain grid game",
    "mental focus improvement",
  ],
  alternates: {
    canonical: "https://schultetable.com/schulte-table/4x4/hard",
  },
};

export default async function Page() {
  const { user } = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Schulteboard4x4hard />
      </main>

      {/* ✅ Responsive Footer */}
      <footer className="footer grid grid-cols-1 md:grid-cols-3 gap-8 p-10 bg-base-200 text-base-content">
        {/* ✅ Benefits Column */}
        <aside>
          <h2 className="footer-title">🧠 Benefits of 4x4 Hard Mode</h2>
          <ul className="space-y-2 text-sm leading-relaxed">
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-success mt-1" />
              Pushes working memory, reaction speed, and laser focus
            </li>
            <li className="flex items-start gap-2">
              <FaStopwatch className="text-warning mt-1" />
              Increases cognitive stamina in high-speed decision-making
            </li>
            <li className="flex items-start gap-2">
              <FaEye className="text-info mt-1" />
              Enhances eye tracking and spatial scanning accuracy
            </li>
            <li className="flex items-start gap-2">
              <FaMobileAlt className="text-accent mt-1" />
              Optimized for mobile, tablet, and desktop gameplay
            </li>
            <li className="flex items-start gap-2">
              <FaClock className="text-error mt-1" />
              <span>
                <strong>Goal:</strong> Complete the grid in{" "}
                <span className="font-semibold">under 10 seconds</span> for
                elite status
              </span>
            </li>
          </ul>
        </aside>

        {/* ✅ Game Modes Column */}
        <nav>
          <h2 className="footer-title">🎮 Game Modes</h2>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/schulte-table/3x3" className="link link-hover">
                3x3 Easy Mode
              </Link>
            </li>
            <li>
              <Link
                href="/schulte-table/3x3/medium"
                className="link link-hover"
              >
                3x3 Medium Mode
              </Link>
            </li>
            <li>
              <Link href="/schulte-table/3x3/hard" className="link link-hover">
                3x3 Hard Mode
              </Link>
            </li>
            <li>
              <Link
                href="/schulte-table/4x4/extreme"
                className="link link-hover"
              >
                4x4 Extreme Mode
              </Link>
            </li>
            <li>
              <Link href="/schulte-table/5x5" className="link link-hover">
                5x5 Pro Mode
              </Link>
            </li>
            <li>
              <Link href="/schulte-table/printable" className="link link-hover">
                Printable Tables
              </Link>
            </li>
          </ul>
        </nav>

        {/* ✅ Account + Social Column */}
        <nav>
          <h2 className="footer-title">👤 Account</h2>
          <ul className="space-y-1 text-sm">
            {!user ? (
              <>
                <li>
                  <Link
                    href="/login"
                    className="link link-hover flex items-center gap-1"
                  >
                    <FaSignInAlt /> Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="link link-hover flex items-center gap-1"
                  >
                    <FaUserPlus /> Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="text-green-600 text-sm">
                  Logged in as {user.email}
                </li>
                <li>
                  <Link href="/dashboard" className="link link-hover">
                    Dashboard
                  </Link>
                </li>
              </>
            )}
          </ul>

          <h2 className="footer-title mt-6">🌐 Follow Us</h2>
          <div className="flex gap-4 text-xl mt-2">
            <Link
              href="https://twitter.com/yourhandle"
              target="_blank"
              className="link link-hover"
            >
              <FaTwitter />
            </Link>
            <Link
              href="https://instagram.com/yourhandle"
              target="_blank"
              className="link link-hover"
            >
              <FaInstagram />
            </Link>
            <Link
              href="https://youtube.com/yourhandle"
              target="_blank"
              className="link link-hover"
            >
              <FaYoutube />
            </Link>
          </div>
        </nav>
      </footer>
    </div>
  );
}
