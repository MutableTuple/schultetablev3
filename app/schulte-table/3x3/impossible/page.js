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
  title: { absolute: "Play 3x3 Schulte Table Impossible – Break Your Brain Limits" },
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
    canonical: "https://www.schultetable.com/schulte-table/3x3/impossible",
  },
  openGraph: {
    title: "Play 3x3 Schulte Table Impossible – Break Your Brain Limits",
    description:
      "Can you handle the impossible? 3x3 Schulte Table Impossible Mode pushes your reflexes and brain to the limit. Compete for the fastest time ever.",
    url: "https://www.schultetable.com/schulte-table/3x3/impossible",
    siteName: "Schulte Table",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Schulte Table Training Interface",
      },
    ],
  },
};

export default async function Page() {
  const { user } = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="text-center max-w-2xl mx-auto px-4 pt-4">
        <h1 className="text-lg sm:text-xl font-bold text-foreground">
          Play 3x3 Schulte Table Impossible Mode
        </h1>
      </header>
      <main className="flex-grow">
        <Schulteboard3x3impossible />
      </main>
    </div>
  );
}
