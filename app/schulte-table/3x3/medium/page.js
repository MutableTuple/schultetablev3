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
  title: { absolute: "Play 3x3 Schulte Table Medium – Train Focus Under Pressure" },
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
  openGraph: {
    title: "Play 3x3 Schulte Table Medium – Train Focus Under Pressure",
    description:
      "Challenge your brain with the medium-level 3x3 Schulte Table. Improve attention, processing speed, and visual scanning with faster-paced gameplay.",
    url: "https://www.schultetable.com/schulte-table/3x3/medium",
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
          Play 3x3 Schulte Table Medium Mode
        </h1>
      </header>
      <main className="flex-grow">
        <Schulteboard3x3medium />
      </main>
    </div>
  );
}
