import React from "react";
import WhatsNewFeatures from "../_components/WhatsNewFeatures";

// ✅ SEO Metadata for Next.js App Router
export const metadata = {
  title: "What's New | Schulte Table App Updates",
  description:
    "Check out the latest features and improvements in the Schulte Table game, including global rankings, confetti effects, and mobile optimizations.",
  keywords: [
    "Schulte Table updates",
    "Schulte game features",
    "brain training",
    "focus exercise",
    "mental sharpness",
    "global leaderboard",
    "confetti animation",
    "game enhancements",
  ],
  openGraph: {
    title: "🚀 What's New in Schulte Table",
    description:
      "Explore new features like global confetti rankings, performance tracking, and mobile-friendly animations.",
    url: "https://www.schultetable.com/whats-new",
    siteName: "Schulte Table",
    images: [
      {
        url: "https://www.schultetable.com/og-image.png", // Replace with your actual image URL
        width: 1200,
        height: 630,
        alt: "Schulte Table What's New",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "🚀 What's New in Schulte Table",
    description:
      "See the latest updates: global top 3 leaderboard, smooth mobile confetti, and ranking messages.",
    images: ["https://www.schultetable.com/og-image.png"], // Replace this too
  },
};

export default function Page() {
  return (
    <div className="">
      <WhatsNewFeatures />
    </div>
  );
}
