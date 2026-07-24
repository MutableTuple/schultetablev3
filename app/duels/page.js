import React from "react";
import { getCurrentUser } from "../_utils/getCurrentUser";
import Navbar from "../_components/Navbar";
import DuelsPage from "../_components/Duels/DuelsPage";

export const metadata = {
  // No manual "| Schulte Table" suffix — the root layout's title.template
  // already appends that.
  title: "Duels — Challenge Players Head-to-Head",
  description:
    "Challenge a friend by username, or get auto-matched with another player, for a head-to-head Schulte Table duel — same grid and difficulty, highest score wins.",
  keywords: [
    "schulte table duel",
    "1v1 brain game",
    "head to head reaction test",
    "challenge a friend",
    "brain training matchmaking",
    "schulte table multiplayer",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    // Relative — resolved against metadataBase in the root layout, same
    // pattern the root layout itself uses for "/".
    canonical: "/duels",
  },
  openGraph: {
    title: "Duels — Challenge Players Head-to-Head",
    description:
      "Challenge a friend by username or get auto-matched for a head-to-head Schulte Table duel. Same grid, same difficulty — highest score wins.",
    url: "https://www.schultetable.com/duels",
    siteName: "Schulte Table",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Schulte Table Duels",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Duels — Challenge Players Head-to-Head",
    description:
      "Challenge a friend or get auto-matched for a head-to-head Schulte Table duel.",
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Schulte Table Duels",
  description:
    "Challenge a friend by username, or get auto-matched with another player, for a head-to-head Schulte Table duel.",
  url: "https://www.schultetable.com/duels",
  applicationCategory: "GameApplication",
  operatingSystem: "Web",
  isPartOf: {
    "@type": "WebSite",
    name: "Schulte Table",
    url: "https://www.schultetable.com",
  },
};

export default async function Page() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <DuelsPage user={user} />
    </div>
  );
}
