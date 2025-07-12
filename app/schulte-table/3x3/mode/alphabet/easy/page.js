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
    </div>
  );
}
