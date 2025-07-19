// app/schulte-table/missions/layout.js (or layout.tsx if using TypeScript)

import React from "react";
import Navbar from "../_components/Navbar";

// ✅ Modern Next.js SEO Metadata
export const metadata = {
  title: "Missions | Schulte Table",
  description:
    "Track your brain training missions and progress with SchulteTable.com. Boost your focus and memory daily.",
  keywords: [
    "Schulte Table Missions",
    "Schulte Table challenges",
    "brain training",
    "missions",
    "focus",
    "concentration",
  ],
  openGraph: {
    title: "Missions | Schulte Table",
    description:
      "Track your brain training missions and progress with SchulteTable.com.",
    url: "https://www.schultetable.com/missions",
    siteName: "SchulteTable",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://www.schultetable.com/og-image.jpg", // Replace with your actual image
        width: 1200,
        height: 630,
        alt: "Schulte Table Missions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Missions | Schulte Table",
    description:
      "Track your daily brain training missions on SchulteTable.com.",
    images: ["https://schultetable.com/og-image.jpg"], // Same image as OG
  },
};

export default function layout({ children }) {
  return (
    <div className="flex flex-col">
      <Navbar />
      {children}
    </div>
  );
}
