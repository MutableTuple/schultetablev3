import { getCurrentUser } from "@/app/_utils/getCurrentUser";
import React from "react";
import Schulteboard3x3 from "./Schulteboard3x3";
import Link from "next/link";
import {
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaSignInAlt,
  FaUserPlus,
  FaGamepad,
  FaCheckCircle,
  FaEye,
  FaBrain,
  FaMobileAlt,
  FaClock,
} from "react-icons/fa";

// ✅ SEO Meta
export const metadata = {
  title: { absolute: "Play 3x3 Schulte Table – Improve Focus & Concentration" },
  description:
    "Boost your brain with the 3x3 Schulte Table online game. Ideal for beginners to improve focus, attention span, and visual scanning. Play now!",
  keywords: [
    "3x3 schulte table",
    "easy schulte table game",
    "schulte table online",
    "brain training game",
    "focus exercise",
    "visual scanning practice",
    "beginner schulte table",
    "attention span training",
  ],
  alternates: {
    canonical: "https://www.schultetable.com/schulte-table/3x3",
  },
  openGraph: {
    title: "Play 3x3 Schulte Table – Improve Focus & Concentration",
    description:
      "Boost your brain with the 3x3 Schulte Table online game. Ideal for beginners to improve focus, attention span, and visual scanning.",
    url: "https://www.schultetable.com/schulte-table/3x3",
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
          Play 3x3 Schulte Table Online
        </h1>
      </header>
      <main className="flex-grow">
        <Schulteboard3x3 />
      </main>
    </div>
  );
}
