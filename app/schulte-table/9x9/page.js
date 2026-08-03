import { getCurrentUser } from "@/app/_utils/getCurrentUser";
import React from "react";
import Schulteboard9x9 from "./Schulteboard9x9";

export const metadata = {
  title: { absolute: "Play 9x9 Schulte Table – The Largest Grid Online" },
  description:
    "Play the 9x9 Schulte Table online — 81 tiles, one of the largest Schulte grids available. Free peripheral vision and focus training.",
  keywords: [
    "9x9 schulte table",
    "biggest schulte table",
    "largest schulte table grid",
    "81 tile brain game",
    "expert schulte table",
    "extreme focus training",
  ],
  alternates: {
    canonical: "https://www.schultetable.com/schulte-table/9x9",
  },
  openGraph: {
    title: "Play 9x9 Schulte Table – The Largest Grid Online",
    description:
      "Play the 9x9 Schulte Table online — 81 tiles, one of the largest Schulte grids available.",
    url: "https://www.schultetable.com/schulte-table/9x9",
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

export default async function Page() {
  const { user } = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="text-center max-w-2xl mx-auto px-4 pt-4">
        <h1 className="text-lg sm:text-xl font-bold text-foreground">
          Play the 9x9 Schulte Table Online
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          81 tiles — the largest grid on SchulteTable.com, built for players
          who've mastered everything smaller.
        </p>
      </header>
      <main className="flex-grow">
        <Schulteboard9x9 user={user} />
      </main>
    </div>
  );
}
