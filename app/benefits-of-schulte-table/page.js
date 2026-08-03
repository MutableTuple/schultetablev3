import Link from "next/link";
import React from "react";
import Benefits from "../_components/Benefits";

export const metadata = {
  title: { absolute: "Schulte Table Benefits - Proven Brain Training Results" },
  description:
    "Discover the scientifically-proven benefits of Schulte Table training: improved focus, reading speed, peripheral vision, and cognitive performance.",
  keywords: [
    "schulte table benefits",
    "brain training benefits",
    "cognitive enhancement",
    "improve focus",
    "reading speed training",
    "peripheral vision exercise",
    "mental processing speed",
    "concentration improvement",
    "visual perception training",
    "cognitive training results",
  ],
  openGraph: {
    title: "Schulte Table Benefits - Proven Brain Training Results",
    description:
      "Unlock your cognitive potential with Schulte Table training. Backed by research, proven to improve focus, reading speed, and mental clarity.",
    url: "https://www.schultetable.com/benefits-of-schulte-table",
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
    title: "Schulte Table Benefits - Transform Your Mind",
    description:
      "Research-backed cognitive training that improves focus, reading speed, and mental performance. Start your brain training journey today.",
  },
  alternates: {
    canonical: "https://www.schultetable.com/benefits-of-schulte-table",
  },
};

export default function Page() {
  return <Benefits />;
}
