import Link from "next/link";
import React from "react";
import HowToPlay from "../_components/HowToPlay";

export const metadata = {
  title: "How to Play Schulte Table - Boost Focus Fast",
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
  openGraph: {
    title: "How to Play Schulte Table - Boost Focus Fast",
    description:
      "Step-by-step guide to mastering the Schulte Table game. Train your brain and sharpen your focus.",
    url: "https://schultetable.com/how-to-play-schulte-table",
    siteName: "Schulte Table",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Play Schulte Table",
    description:
      "Improve your focus and speed with our simple Schulte Table guide. Great for students and professionals.",
  },
};

export default function Page() {
  return <HowToPlay />;
}
