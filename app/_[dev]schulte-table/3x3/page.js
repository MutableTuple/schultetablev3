import { getCurrentUser } from "@/app/_utils/getCurrentUser";
import React from "react";
import Schulteboard3x3 from "./Schulteboard3x3";
import Link from "next/link";
import {
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaSignInAlt,
  FaUserPlus,
  FaGamepad,
  FaCheckCircle,
  FaEye,
  FaBrain,
  FaMobileAlt,
  FaClock,
} from "react-icons/fa";

// ✅ SEO Meta
export const metadata = {
  title: "Play 3x3 Schulte Table Online – Improve Focus & Concentration",
  description:
    "Boost your brain with the 3x3 Schulte Table online game. Ideal for beginners to improve focus, attention span, and visual scanning. Play now!",
  keywords: [
    "3x3 schulte table",
    "easy schulte table game",
    "schulte table online",
    "brain training game",
    "focus exercise",
    "visual scanning practice",
    "beginner schulte table",
    "attention span training",
  ],
  alternates: {
    canonical: "https://schultetable.com/schulte-table/3x3",
  },
};

export default async function Page() {
  const { user } = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Schulteboard3x3 />
      </main>

      {/* ✅ Responsive DaisyUI Footer */}
      <footer className="footer grid grid-cols-1 md:grid-cols-3 gap-8 p-10 bg-base-200 text-base-content">
        <aside>
          <h2 className="footer-title">🧠 Benefits of 3x3 Easy Mode</h2>
          <ul className="space-y-2 text-sm leading-relaxed">
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-success mt-1" />
              Perfect for beginners new to Schulte Table brain training
            </li>
            <li className="flex items-start gap-2">
              <FaEye className="text-info mt-1" />
              Enhances visual scanning and number recognition
            </li>
            <li className="flex items-start gap-2">
              <FaBrain className="text-warning mt-1" />
              Improves attention span, mental speed, and focus
            </li>
            <li className="flex items-start gap-2">
              <FaMobileAlt className="text-accent mt-1" />
              Fully responsive: play on mobile, tablet, or desktop
            </li>
            <li className="flex items-start gap-2">
              <FaClock className="text-error mt-1" />
              <span>
                <strong>Goal:</strong> Complete the 3x3 Schulte Table in under{" "}
                <span className="font-semibold">5 seconds</span> – based on
                average training benchmarks
              </span>
            </li>
          </ul>
        </aside>
        {/* Game Modes Column */}
        <nav>
          <h2 className="footer-title">🎮 Game Modes</h2>
          <ul className="space-y-1 text-sm">
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
        {/* Account & Socials Column */}
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
