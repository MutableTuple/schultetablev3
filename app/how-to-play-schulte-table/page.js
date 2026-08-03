import Link from "next/link";
import React from "react";
import HowToPlay from "../_components/HowToPlay";

export const metadata = {
  title: { absolute: "How to Play Schulte Table - Boost Focus Fast" },
  description:
    "Learn how to play the Schulte Table game to improve your concentration, visual perception, and mental speed. Step-by-step guide for all levels.",
  keywords: [
    "how to play schulte table",
    "schulte table instructions",
    "brain focus game",
    "mental training",
    "visual scanning",
    "cognitive speed",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "How to Play Schulte Table - Boost Focus Fast",
    description:
      "Step-by-step guide to mastering the Schulte Table game. Train your brain and sharpen your focus.",
    url: "https://www.schultetable.com/how-to-play-schulte-table",
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
    title: "How to Play Schulte Table",
    description:
      "Improve your focus and speed with our simple Schulte Table guide. Great for students and professionals.",
  },
  alternates: {
    canonical: "https://www.schultetable.com/how-to-play-schulte-table",
  },
};

export default function Page() {
  return <HowToPlay />;
}
