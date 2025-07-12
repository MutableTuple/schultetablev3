import { getCurrentUser } from "@/app/_utils/getCurrentUser";
import React from "react";
import Schulteboard3x3extreme from "./Schulteboard3x3extreme";
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
  FaFire,
} from "react-icons/fa";

// ✅ SEO Meta for 3x3 Extreme Mode
export const metadata = {
  title: "Play 3x3 Schulte Table Extreme – Insane Focus & Reflex Challenge",
  description:
    "Ready for the ultimate brain test? Try 3x3 Extreme Schulte Table mode – built for pros who want to max out speed, reaction, and visual memory. Beat the impossible.",
  keywords: [
    "3x3 schulte table extreme",
    "extreme brain game",
    "focus speed challenge",
    "insane schulte table mode",
    "rapid attention training",
    "schulte table advanced",
    "reflex training game",
    "mental agility test",
  ],
  alternates: {
    canonical: "https://schultetable.com/schulte-table/3x3/extreme",
  },
};

export default async function Page() {
  const { user } = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Schulteboard3x3extreme />
      </main>
    </div>
  );
}
