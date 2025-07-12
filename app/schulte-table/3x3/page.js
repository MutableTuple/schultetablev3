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
  title: "Play 3x3 Schulte Table Online – Improve Focus & Concentration",
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
    canonical: "https://schultetable.com/schulte-table/3x3",
  },
};

export default async function Page() {
  const { user } = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Schulteboard3x3 />
      </main>
    </div>
  );
}
