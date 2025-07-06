import { getCurrentUser } from "@/app/_utils/getCurrentUser";
import React from "react";
import Schulteboard3x3extreme from "./Schulteboard3x3extreme";
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
  FaFire,
} from "react-icons/fa";

// ✅ SEO Meta for 3x3 Extreme Mode
export const metadata = {
  title: "Play 3x3 Schulte Table Extreme – Insane Focus & Reflex Challenge",
  description:
    "Ready for the ultimate brain test? Try 3x3 Extreme Schulte Table mode – built for pros who want to max out speed, reaction, and visual memory. Beat the impossible.",
  keywords: [
    "3x3 schulte table extreme",
    "extreme brain game",
    "focus speed challenge",
    "insane schulte table mode",
    "rapid attention training",
    "schulte table advanced",
    "reflex training game",
    "mental agility test",
  ],
  alternates: {
    canonical: "https://schultetable.com/schulte-table/3x3/extreme",
  },
};

export default async function Page() {
  const { user } = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Schulteboard3x3extreme />
      </main>

      {/* ✅ Responsive Footer */}
      <footer className="footer grid grid-cols-1 md:grid-cols-3 gap-8 p-10 bg-base-200 text-base-content">
        {/* ✅ Benefits Column */}
        <aside>
          <h2 className="footer-title">🔥 Benefits of 3x3 Extreme Mode</h2>
          <ul className="space-y-2 text-sm leading-relaxed">
            <li className="flex items-start gap-2">
              <FaFire className="text-error mt-1" />
              Hardcore mode for elite users and competitive players
            </li>
            <li className="flex items-start gap-2">
              <FaStopwatch className="text-warning mt-1" />
              Trains peak visual scanning, short-term memory, and speed
            </li>
            <li className="flex items-start gap-2">
              <FaBrain className="text-purple-600 mt-1" />
              Enhances rapid mental coordination under pressure
            </li>
            <li className="flex items-start gap-2">
              <FaMobileAlt className="text-accent mt-1" />
              Mobile-first experience for lightning-fast gaming anywhere
            </li>
            <li className="flex items-start gap-2">
              <FaClock className="text-error mt-1" />
              <span>
                <strong>Extreme goal:</strong> Finish in{" "}
                <span className="font-semibold">under 8.5 seconds</span> – only
                for the fastest minds
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
