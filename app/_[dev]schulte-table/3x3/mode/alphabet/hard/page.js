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
import SchultetableAlphabet3x3Hard from "./SchultetableAlphabet3x3Hard";

// ✅ SEO Meta for 3x3 Alphabet Hard Mode
export const metadata = {
  title: "Play 3x3 Alphabet Schulte Table – Hard Mode Challenge",
  description:
    "Take on the 3x3 Alphabet Schulte Table (Hard Mode) to test your memory, visual tracking, and letter speed recognition under pressure. Try to beat your best time!",
  keywords: [
    "3x3 alphabet schulte table hard",
    "hard alphabet brain game",
    "letter recognition under pressure",
    "fast visual scanning letters",
    "alphabet order game hard",
    "focus and memory alphabet game",
    "advanced brain challenge",
    "alphabet schulte table hard mode",
  ],
  alternates: {
    canonical: "https://schultetable.com/schulte-table/3x3/mode/alphabet/hard",
  },
};

export default async function Page() {
  const { user } = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <SchultetableAlphabet3x3Hard />
      </main>

      {/* ✅ Responsive Footer */}
      <footer className="footer grid grid-cols-1 md:grid-cols-3 gap-8 p-10 bg-base-200 text-base-content">
        {/* ✅ Benefits Column */}
        <aside>
          <h2 className="footer-title">🔤 Benefits of Hard Alphabet Mode</h2>
          <ul className="space-y-2 text-sm leading-relaxed">
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-success mt-1" />
              For users ready to level up their focus and mental speed
            </li>
            <li className="flex items-start gap-2">
              <FaBrain className="text-purple-600 mt-1" />
              Enhances short-term memory, sequencing, and precision
            </li>
            <li className="flex items-start gap-2">
              <FaEye className="text-info mt-1" />
              Trains faster eye tracking and attention to letter patterns
            </li>
            <li className="flex items-start gap-2">
              <FaMobileAlt className="text-accent mt-1" />
              Smooth gameplay on all screen sizes – mobile or desktop
            </li>
            <li className="flex items-start gap-2">
              <FaClock className="text-error mt-1" />
              <span>
                <strong>Challenge:</strong> Complete A–Z in{" "}
                <span className="font-semibold">under 4.5 seconds</span>!
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
