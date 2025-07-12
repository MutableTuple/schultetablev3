import { getCurrentUser } from "@/app/_utils/getCurrentUser";
import React from "react";
import Schulteboard4x4extreme from "./Schulteboard4x4extreme";
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

// ✅ SEO Meta for 4x4 Extreme Mode
export const metadata = {
  title: "Play 4x4 Schulte Table Extreme – Ultimate Reflex Challenge",
  description:
    "Push your limits with 4x4 Schulte Table Extreme Mode. A brutal brain exercise for those who crave speed, precision, and next-level focus under time pressure.",
  keywords: [
    "4x4 schulte table extreme",
    "hardest brain game",
    "ultimate reflex challenge",
    "high difficulty schulte table",
    "advanced mental training",
    "rapid number recognition",
    "fast thinking brain test",
    "focus challenge 4x4 grid",
  ],
  alternates: {
    canonical: "https://schultetable.com/schulte-table/4x4/extreme",
  },
};

export default async function Page() {
  const { user } = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Schulteboard4x4extreme />
      </main>

      {/* ✅ Footer */}
      <footer className="footer grid grid-cols-1 md:grid-cols-3 gap-8 p-10 bg-base-200 text-base-content">
        {/* ✅ Benefits */}
        <aside>
          <h2 className="footer-title">🔥 Benefits of 4x4 Extreme Mode</h2>
          <ul className="space-y-2 text-sm leading-relaxed">
            <li className="flex items-start gap-2">
              <FaFire className="text-error mt-1" />
              Designed for high-speed thinkers & brain athletes
            </li>
            <li className="flex items-start gap-2">
              <FaStopwatch className="text-warning mt-1" />
              Develops ultra-fast numeric recognition & mental agility
            </li>
            <li className="flex items-start gap-2">
              <FaBrain className="text-purple-600 mt-1" />
              Enhances neural speed under intense time constraints
            </li>
            <li className="flex items-start gap-2">
              <FaMobileAlt className="text-accent mt-1" />
              Fully responsive and optimized for mobile and desktop
            </li>
            <li className="flex items-start gap-2">
              <FaClock className="text-error mt-1" />
              <span>
                <strong>Extreme goal:</strong> Finish in{" "}
                <span className="font-semibold">under 7 seconds</span> – only
                pros will survive
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
                4x4 Classic Mode
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
