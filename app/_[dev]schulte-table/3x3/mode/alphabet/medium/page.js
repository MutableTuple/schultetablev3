import { getCurrentUser } from "@/app/_utils/getCurrentUser";
import React from "react";
import Link from "next/link";
import SocialLinks from "@/app/schulte-table/SocialLinks";
import AuthOptions from "@/app/schulte-table/AuthOptions";
import {
  FaSignInAlt,
  FaUserPlus,
  FaCheckCircle,
  FaEye,
  FaBrain,
  FaMobileAlt,
  FaClock,
} from "react-icons/fa";
import GameModesLinks from "@/app/schulte-table/GameModesLinks";
import SchultetableAlphabet3x3Medium from "./SchultetableAlphabet3x3Medium";

// ✅ SEO Meta for 3x3 Alphabet Medium Mode
export const metadata = {
  title: "Play 3x3 Alphabet Schulte Table – Medium Mode Brain Game",
  description:
    "Train your brain with the 3x3 Alphabet Schulte Table (Medium Mode). Enhance focus, letter recognition, and scanning speed with this fun, timed challenge.",
  keywords: [
    "3x3 alphabet schulte table medium",
    "alphabet brain game",
    "letter recognition challenge",
    "schulte table medium difficulty",
    "alphabet order training",
    "visual scanning speed game",
    "focus improvement game",
    "medium level brain exercise",
  ],
  alternates: {
    canonical:
      "https://schultetable.com/schulte-table/3x3/mode/alphabet/medium",
  },
};

export default async function Page() {
  const { user } = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <SchultetableAlphabet3x3Medium />
      </main>

      {/* ✅ Responsive Footer */}
      <footer className="footer grid grid-cols-1 md:grid-cols-3 gap-8 p-10 bg-base-200 text-base-content">
        {/* ✅ Benefits Column */}
        <aside>
          <h2 className="footer-title">🔤 Benefits of Medium Alphabet Mode</h2>
          <ul className="space-y-2 text-sm leading-relaxed">
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-success mt-1" />
              Designed to boost cognitive flexibility and visual attention
            </li>
            <li className="flex items-start gap-2">
              <FaBrain className="text-purple-600 mt-1" />
              Trains sequencing, short-term memory, and quick decisions
            </li>
            <li className="flex items-start gap-2">
              <FaEye className="text-info mt-1" />
              Improves eye movement speed for faster scanning
            </li>
            <li className="flex items-start gap-2">
              <FaMobileAlt className="text-accent mt-1" />
              Fully responsive – perfect for mobile and desktop users
            </li>
            <li className="flex items-start gap-2">
              <FaClock className="text-error mt-1" />
              <span>
                <strong>Goal:</strong> Complete the alphabet sequence in{" "}
                <span className="font-semibold">under 5.5 seconds</span>
              </span>
            </li>
          </ul>
        </aside>

        {/* ✅ Game Modes Column */}
        <GameModesLinks />

        {/* ✅ Account + Social Column */}
        <nav>
          <h2 className="footer-title">👤 Account</h2>
          <AuthOptions user={user} />

          <h2 className="footer-title mt-6">🌐 Follow Us</h2>
          <SocialLinks />
        </nav>
      </footer>
    </div>
  );
}
