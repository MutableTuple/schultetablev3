import { getCurrentUser } from "@/app/_utils/getCurrentUser";
import React from "react";
import Schulteboard7x7 from "./Schulteboard7x7";

export const metadata = {
  title: { absolute: "Play 7x7 Schulte Table – Advanced Focus Training" },
  description:
    "Play the 7x7 Schulte Table online — 49 tiles for advanced attention and peripheral vision training. Free, no sign-up required.",
  keywords: [
    "7x7 schulte table",
    "large schulte table",
    "advanced schulte table",
    "49 tile brain game",
    "schulte table big grid",
    "advanced focus training",
  ],
  alternates: {
    canonical: "https://www.schultetable.com/schulte-table/7x7",
  },
  openGraph: {
    title: "Play 7x7 Schulte Table – Advanced Focus Training",
    description:
      "Play the 7x7 Schulte Table online — 49 tiles for advanced attention and peripheral vision training.",
    url: "https://www.schultetable.com/schulte-table/7x7",
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
          Play the 7x7 Schulte Table Online
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          49 tiles — a genuine step up from the standard 5×5, for players
          who've outgrown the smaller grids.
        </p>
      </header>
      <main className="flex-grow">
        <Schulteboard7x7 user={user} />
      </main>
    </div>
  );
}
