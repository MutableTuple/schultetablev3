import { getCurrentUser } from "@/app/_utils/getCurrentUser";
import React from "react";
import Schulteboard3x3medium from "./Schulteboard3x3medium";
import Link from "next/link";
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
} from "react-icons/fa";

// ✅ SEO Meta for 3x3 Medium Mode
export const metadata = {
  title: "Play 3x3 Schulte Table Medium – Train Focus Under Pressure",
  description:
    "Challenge your brain with the medium-level 3x3 Schulte Table. Improve attention, processing speed, and visual scanning with faster-paced gameplay.",
  keywords: [
    "3x3 schulte table medium",
    "schulte table brain game",
    "medium difficulty schulte table",
    "attention training",
    "visual scanning speed",
    "mental sharpness game",
    "brain focus game",
    "schulte table timer challenge",
  ],
  alternates: {
    canonical: "https://www.schultetable.com/schulte-table/3x3/medium",
  },
};

export default async function Page() {
  const { user } = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Schulteboard3x3medium />
      </main>
    </div>
  );
}
