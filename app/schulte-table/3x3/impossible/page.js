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
    </div>
  );
}
