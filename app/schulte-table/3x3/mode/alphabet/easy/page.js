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
  title: { absolute: "Play 3x3 Alphabet Schulte Table – Letter Recognition" },
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
    canonical:
      "https://www.schultetable.com/schulte-table/3x3/mode/alphabet/easy",
  },
  openGraph: {
    title: "Play 3x3 Alphabet Schulte Table – Letter Recognition",
    description:
      "Play the 3x3 Alphabet Schulte Table online. Boost letter recognition, attention span, and scanning speed. Perfect for learners and beginners.",
    url: "https://www.schultetable.com/schulte-table/3x3/mode/alphabet/easy",
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
          Play 3x3 Alphabet Schulte Table – Easy Mode
        </h1>
      </header>
      <main className="flex-grow">
        <SchultetableAlphabet3x3Easy />
      </main>
    </div>
  );
}
