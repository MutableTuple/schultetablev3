import React from "react";
import Report from "../_components/PDFReport/Report";
import { getCurrentUser } from "../_utils/getCurrentUser";
import Navbar from "../_components/Navbar";

export const metadata = {
  // No manual "| Schulte Table" suffix — the root layout's title.template
  // already appends that. Adding it here would double it up.
  title: { absolute: "Monthly Brain Report" },
  description:
    "Track your reaction time, consistency, and focus trends over time with a personalized Monthly Brain Report.",
  keywords: [
    "monthly brain report",
    "cognitive performance tracker",
    "reaction time trends",
    "focus tracking",
    "brain training report",
    "mental performance tracker",
    "schulte table report",
  ],
  authors: [{ name: "SchulteTable.com" }],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.schultetable.com/monthly-brain-report",
  },
  openGraph: {
    title: "Monthly Brain Report — Track Your Cognitive Performance",
    description:
      "See your reaction time, consistency, and focus trends over the last month. Free preview available.",
    url: "https://www.schultetable.com/monthly-brain-report",
    siteName: "Schulte Table",
    type: "website",
    images: [
      {
        url: "/og/monthly-brain-report.png",
        width: 1200,
        height: 630,
        alt: "Schulte Table Monthly Brain Report preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Monthly Brain Report — Track Your Cognitive Performance",
    description:
      "See your reaction time, consistency, and focus trends over the last month.",
    images: ["/og/monthly-brain-report.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Schulte Table Monthly Brain Report",
  description:
    "A personalized monthly report tracking reaction time, consistency, and focus trends from Schulte Table brain training sessions.",
  url: "https://www.schultetable.com/monthly-brain-report",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  isPartOf: {
    "@type": "WebSite",
    name: "Schulte Table",
    url: "https://www.schultetable.com",
  },
};

export default async function page() {
  const user = await getCurrentUser();
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <Report user={user} />
    </div>
  );
}
