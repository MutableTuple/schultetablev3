import React from "react";
import Link from "next/link";

export const metadata = {
  title: { absolute: "Play Schulte Table Online — All Modes & Difficulties" },
  description:
    "Play the Schulte Table online across every grid size, difficulty, and mode — numbers, alphabet, and more. Free brain training, no sign-up required.",
  alternates: {
    canonical: "https://www.schultetable.com/schulte-table",
  },
  openGraph: {
    title: "Play Schulte Table Online — All Modes & Difficulties",
    description:
      "Play the Schulte Table online across every grid size, difficulty, and mode. Free brain training, no sign-up required.",
    url: "https://www.schultetable.com/schulte-table",
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
};

const links = [
  { href: "/schulte-table/3x3", label: "3x3 Easy" },
  { href: "/schulte-table/3x3/medium", label: "3x3 Medium" },
  { href: "/schulte-table/3x3/hard", label: "3x3 Hard" },
  { href: "/schulte-table/3x3/extreme", label: "3x3 Extreme" },
  { href: "/schulte-table/3x3/impossible", label: "3x3 Impossible" },
  { href: "/schulte-table/3x3/mode", label: "3x3 Alphabet Modes" },
  { href: "/schulte-table/7x7", label: "7x7 Advanced" },
  { href: "/schulte-table/9x9", label: "9x9 Largest Grid" },
];

export default function page() {
  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-10 pb-16">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-center">
        Play Schulte Table Online
      </h1>
      <p className="text-sm text-muted-foreground mt-2 text-center max-w-lg">
        Choose a grid size, difficulty, or mode to start training your focus
        and mental speed — or jump into the full game with all options on the
        home page.
      </p>

      <div className="flex flex-wrap justify-center gap-3 mt-8 max-w-2xl">
        {links.map(({ href, label }) => (
          <Link key={href} href={href} className="btn btn-outline">
            {label}
          </Link>
        ))}
      </div>

      <Link href="/" className="btn btn-primary mt-8">
        Play the Full Game
      </Link>
    </div>
  );
}
