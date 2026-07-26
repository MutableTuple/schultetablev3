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
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "About Us - Schulte Table",
    description:
      "Discover the mission behind SchulteTable.com and how it helps users boost cognitive performance through scientifically-backed games.",
    url: "https://www.schultetable.com/about",
    siteName: "Schulte Table",
    type: "website",
    images: [
      {
        url: "https://www.schultetable.com/og/about.png",
        width: 1200,
        height: 630,
        alt: "About SchulteTable",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About SchulteTable.com",
    description:
      "Explore how Schulte Table helps users sharpen focus and improve mental performance through fun challenges.",
    images: ["https://www.schultetable.com/og/about.png"],
  },
  alternates: {
    canonical: "https://www.schultetable.com/about",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About SchulteTable",
  description:
    "Learn about SchulteTable.com – the ultimate platform for improving focus, reaction speed, and mental sharpness through interactive brain games.",
  url: "https://www.schultetable.com/about",
  isPartOf: {
    "@type": "WebSite",
    name: "SchulteTable",
    url: "https://www.schultetable.com",
  },
};

export default function Page() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <About />
    </div>
  );
}
