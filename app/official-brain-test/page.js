import React from "react";
import OfcSchultetableTest from "../_components/OfficialSchultetableTest/OfcSchultetableTest";

export const metadata = {
  title: "Official Schulte Table Brain Test",
  description:
    "Take the official Schulte Table brain test — measure your reaction speed and focus, then see how your results compare to other players.",
  keywords: [
    "official Schulte Table test",
    "brain test",
    "reaction time test",
    "focus test",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Official Schulte Table Brain Test",
    description:
      "Measure your reaction speed and focus with the official Schulte Table brain test.",
    url: "https://www.schultetable.com/official-brain-test",
    siteName: "Schulte Table",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Official Schulte Table Brain Test",
    description:
      "Measure your reaction speed and focus with the official Schulte Table brain test.",
  },
  alternates: {
    canonical: "https://www.schultetable.com/official-brain-test",
  },
};

export default function page() {
  return <OfcSchultetableTest />;
}
