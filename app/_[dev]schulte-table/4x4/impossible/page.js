import { getCurrentUser } from "@/app/_utils/getCurrentUser";
import React from "react";
import Schulteboard3x3impossible from "./Schulteboard3x3impossible";
import Link from "next/link";

import SocialLinks from "../../SocialLinks";
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
  FaSkullCrossbones,
} from "react-icons/fa";
import AuthOptions from "../../AuthOptions";
import GameModesLinks from "../../GameModesLinks";

// ✅ SEO Meta for 3x3 Impossible Mode
export const metadata = {
  title: "Play 3x3 Schulte Table Impossible – Break Your Brain Limits",
  description:
    "Can you handle the impossible? 3x3 Schulte Table Impossible Mode pushes your reflexes and brain to the limit. Compete for the fastest time ever.",
  keywords: [
    "3x3 schulte table impossible",
    "impossible brain challenge",
    "ultra hard focus game",
    "schulte table insane mode",
    "mental reflex test",
    "impossible reaction game",
    "elite brain game",
    "speed training impossible",
  ],
  alternates: {
    canonical: "https://schultetable.com/schulte-table/3x3/impossible",
  },
};

export default async function Page() {
  const { user } = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Schulteboard3x3impossible />
      </main>

      {/* ✅ Responsive Footer */}
      <footer className="footer grid grid-cols-1 md:grid-cols-3 gap-8 p-10 bg-base-200 text-base-content">
        {/* ✅ Benefits Column */}
        <aside>
          <h2 className="footer-title">💀 Benefits of 3x3 Impossible Mode</h2>
          <ul className="space-y-2 text-sm leading-relaxed">
            <li className="flex items-start gap-2">
              <FaSkullCrossbones className="text-error mt-1" />
              For expert minds seeking near-impossible reaction challenges
            </li>
            <li className="flex items-start gap-2">
              <FaStopwatch className="text-warning mt-1" />
              Pushes short-term memory, precision, and micro-focus
            </li>
            <li className="flex items-start gap-2">
              <FaBrain className="text-purple-600 mt-1" />
              Trains lightning-fast decision making under intense stress
            </li>
            <li className="flex items-start gap-2">
              <FaMobileAlt className="text-accent mt-1" />
              Fully responsive – beat records from any device
            </li>
            <li className="flex items-start gap-2">
              <FaClock className="text-error mt-1" />
              <span>
                <strong>Impossible goal:</strong> Finish in{" "}
                <span className="font-semibold">under 1.5 seconds</span> – only
                pros can
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
