import { getCurrentUser } from "@/app/_utils/getCurrentUser";
import React from "react";
import Link from "next/link";
import SocialLinks from "@/app/_[dev]schulte-table/SocialLinks";
import AuthOptions from "@/app/_[dev]schulte-table/AuthOptions";
import {
  FaSignInAlt,
  FaUserPlus,
  FaCheckCircle,
  FaEye,
  FaBrain,
  FaMobileAlt,
  FaClock,
} from "react-icons/fa";
import GameModesLinks from "@/app/_[dev]schulte-table/GameModesLinks";
import SchultetableAlphabet3x3Easy from "./SchultetableAlphabet3x3Easy";

// ✅ SEO Meta for 3x3 Alphabet Easy Mode
export const metadata = {
  title: "Play 3x3 Alphabet Schulte Table – Train Letter Recognition & Focus",
  description:
    "Play the 3x3 Alphabet Schulte Table online. Boost letter recognition, attention span, and scanning speed. Perfect for learners and brain training beginners.",
  keywords: [
    "3x3 alphabet schulte table",
    "alphabet schulte game",
    "letter focus game",
    "visual scanning alphabet",
    "letter recognition practice",
    "alphabet training game",
    "beginner schulte table letters",
    "brain game with letters",
  ],
  alternates: {
    canonical: "https://schultetable.com/schulte-table/3x3/mode/alphabet",
  },
};

export default async function Page() {
  const { user } = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <SchultetableAlphabet3x3Easy />
      </main>

      {/* ✅ Responsive Footer */}
      <footer className="footer grid grid-cols-1 md:grid-cols-3 gap-8 p-10 bg-base-200 text-base-content">
        {/* ✅ Benefits Column */}
        <aside>
          <h2 className="footer-title">🔤 Benefits of Alphabet Mode</h2>
          <ul className="space-y-2 text-sm leading-relaxed">
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-success mt-1" />
              Improves visual letter recognition and scanning skills
            </li>
            <li className="flex items-start gap-2">
              <FaBrain className="text-purple-600 mt-1" />
              Strengthens memory, sequencing, and learning attention
            </li>
            <li className="flex items-start gap-2">
              <FaEye className="text-info mt-1" />
              Trains alphabet order focus and eye movement control
            </li>
            <li className="flex items-start gap-2">
              <FaMobileAlt className="text-accent mt-1" />
              Works on all devices – great for kids & adults alike
            </li>
            <li className="flex items-start gap-2">
              <FaClock className="text-error mt-1" />
              <span>
                <strong>Goal:</strong> Tap A-Z in order in{" "}
                <span className="font-semibold">under 6 seconds</span>!
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
