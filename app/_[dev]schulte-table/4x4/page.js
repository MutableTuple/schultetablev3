import { getCurrentUser } from "@/app/_utils/getCurrentUser";
import React from "react";
import Schulteboard4x4 from "./Schulteboard4x4";
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
} from "react-icons/fa";

// ✅ SEO Meta for 4x4 Easy Mode
export const metadata = {
  title: "Play 4x4 Schulte Table – Easy Mode for Better Focus & Vision",
  description:
    "Challenge your focus and boost cognitive agility with the 4x4 Schulte Table (Easy Mode). A perfect step up from 3x3 for training visual scanning and mental alertness.",
  keywords: [
    "4x4 schulte table easy",
    "schulte table 4x4 mode",
    "intermediate brain training",
    "visual scanning 4x4 grid",
    "easy 4x4 schulte challenge",
    "attention training game",
    "cognitive focus improvement",
    "mental agility for beginners",
  ],
  alternates: {
    canonical: "https://schultetable.com/schulte-table/4x4/easy",
  },
};

export default async function Page() {
  const { user } = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Schulteboard4x4 />
      </main>

      {/* ✅ Footer */}
      <footer className="footer grid grid-cols-1 md:grid-cols-3 gap-8 p-10 bg-base-200 text-base-content">
        {/* ✅ Benefits */}
        <aside>
          <h2 className="footer-title">🧠 Why Try 4x4 Easy Mode?</h2>
          <ul className="space-y-2 text-sm leading-relaxed">
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-success mt-1" />A smooth jump from
              3x3 for sharpening reaction and accuracy
            </li>
            <li className="flex items-start gap-2">
              <FaEye className="text-info mt-1" />
              Boosts eye movement control across larger grids
            </li>
            <li className="flex items-start gap-2">
              <FaBrain className="text-warning mt-1" />
              Strengthens spatial awareness and numeric sequencing
            </li>
            <li className="flex items-start gap-2">
              <FaMobileAlt className="text-accent mt-1" />
              Works perfectly on mobile, tablet, or desktop devices
            </li>
            <li className="flex items-start gap-2">
              <FaClock className="text-error mt-1" />
              <span>
                <strong>Goal:</strong> Tap 1–16 in{" "}
                <span className="font-semibold">under 10 seconds</span>
              </span>
            </li>
          </ul>
        </aside>

        {/* ✅ Game Modes */}
        <nav>
          <h2 className="footer-title">🎮 Game Modes</h2>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/schulte-table/3x3" className="link link-hover">
                3x3 Easy Mode
              </Link>
            </li>
            <li>
              <Link href="/schulte-table/3x3/hard" className="link link-hover">
                3x3 Hard Mode
              </Link>
            </li>
            <li>
              <Link href="/schulte-table/4x4" className="link link-hover">
                4x4 Classic Mode
              </Link>
            </li>
            <li>
              <Link href="/schulte-table/5x5" className="link link-hover">
                5x5 Expert Mode
              </Link>
            </li>
            <li>
              <Link href="/schulte-table/printable" className="link link-hover">
                Printable Schulte Tables
              </Link>
            </li>
          </ul>
        </nav>

        {/* ✅ Account + Social */}
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
