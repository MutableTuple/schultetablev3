import { getCurrentUser } from "@/app/_utils/getCurrentUser";
import React from "react";
import Schulteboard3x3hard from "./Schulteboard3x3hard";
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
import Schulteboard3x3extreme from "../extreme/Schulteboard3x3extreme";

// ✅ SEO Meta for 3x3 Hard Mode
export const metadata = {
  title: "Play 3x3 Schulte Table Hard – Ultimate Brain Speed Challenge",
  description:
    "Take your focus and speed to the next level with 3x3 Hard Schulte Table mode. A fast-paced brain game designed to push your limits.",
  keywords: [
    "3x3 schulte table hard",
    "hard schulte table challenge",
    "advanced focus game",
    "brain speed training",
    "visual attention game",
    "reaction time brain game",
    "schulte table hard mode",
    "mental performance boost",
  ],
  alternates: {
    canonical: "https://schultetable.com/schulte-table/3x3/hard",
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
