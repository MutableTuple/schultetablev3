import React from "react";
import Link from "next/link";

export const metadata = {
  title: { absolute: "3x3 Schulte Table Game Modes" },
  description:
    "Choose a 3x3 Schulte Table game mode — alphabet recognition at easy, medium, or hard difficulty.",
  alternates: {
    canonical: "https://www.schultetable.com/schulte-table/3x3/mode",
  },
  openGraph: {
    title: "3x3 Schulte Table Game Modes",
    description:
      "Choose a 3x3 Schulte Table game mode — alphabet recognition at easy, medium, or hard difficulty.",
    url: "https://www.schultetable.com/schulte-table/3x3/mode",
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

const modes = [
  { href: "/schulte-table/3x3/mode/alphabet/easy", label: "Alphabet – Easy" },
  {
    href: "/schulte-table/3x3/mode/alphabet/medium",
    label: "Alphabet – Medium",
  },
  { href: "/schulte-table/3x3/mode/alphabet/hard", label: "Alphabet – Hard" },
];

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-center">
        Select a 3x3 Schulte Table Mode
      </h1>
      <p className="text-sm text-muted-foreground mt-2 text-center max-w-md">
        Pick a difficulty to practice the alphabet version of the 3x3 Schulte
        Table.
      </p>
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        {modes.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="btn btn-outline"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
