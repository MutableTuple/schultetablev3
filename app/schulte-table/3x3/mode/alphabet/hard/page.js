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
    canonical:
      "https://www.schultetable.com/schulte-table/3x3/mode/alphabet/hard",
  },
};

export default async function Page() {
  const { user } = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <SchultetableAlphabet3x3Hard />
      </main>
    </div>
  );
}
