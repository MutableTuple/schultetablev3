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
    </div>
  );
}
