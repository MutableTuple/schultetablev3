import React from "react";
import About from "../_components/About";

export const metadata = {
  title: "About Us",
  description:
    "Learn about SchulteTable.com – the ultimate platform for improving focus, reaction speed, and mental sharpness through interactive brain games.",
  keywords: [
    "About Schulte Table",
    "brain games",
    "focus training",
    "mental agility",
    "reaction speed",
    "Schulte Table app",
  ],
  openGraph: {
    title: "About Us - Schulte Table",
    description:
      "Discover the mission behind SchulteTable.com and how it helps users boost cognitive performance through scientifically-backed games.",
    url: "https://schultetable.com/about",
    siteName: "Schulte Table",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About SchulteTable.com",
    description:
      "Explore how Schulte Table helps users sharpen focus and improve mental performance through fun challenges.",
  },
};

export default function Page() {
  return (
    <div>
      <About />
    </div>
  );
}
