import React from "react";
import OfcSchultetableTest from "../_components/OfficialSchultetableTest/OfcSchultetableTest";
import { getCurrentUser } from "../_utils/getCurrentUser";

export const metadata = {
  title: { absolute: "Official Brain Test — 10 Rounds, One Full Report" },
  description:
    "Take the official Schulte Table Brain Test — 10 rounds across different grid sizes and difficulties to measure your focus and mental agility.",
  keywords: [
    "official Schulte Table test",
    "brain test",
    "reaction time test",
    "focus test",
    "cognitive assessment",
    "monthly brain report",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "The Brain Test — 10 Rounds, One Full Report",
    description:
      "10 rounds across different grid sizes, difficulties, and game modes. Measure your reaction speed, focus, and mental agility.",
    url: "https://www.schultetable.com/official-brain-test",
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
  twitter: {
    card: "summary_large_image",
    title: "The Brain Test — 10 Rounds, One Full Report",
    description:
      "10 rounds across different grid sizes, difficulties, and game modes. Measure your reaction speed, focus, and mental agility.",
  },
  alternates: {
    canonical: "https://www.schultetable.com/official-brain-test",
  },
};

export default async function page() {
  const { user } = await getCurrentUser();
  return <OfcSchultetableTest user={user} />;
}
