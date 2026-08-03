import React from "react";
import GlobalLeaderboard from "../_components/Leaderboard/GlobalLeaderboard";
import { getCurrentUser } from "../_utils/getCurrentUser";
export const metadata = {
  title: { absolute: "Global Leaderboard - Schulte Table" },
  description:
    "Check out the top players on the global Schulte Table leaderboard. See who’s got the fastest times and best accuracy.",
  keywords: [
    "Schulte Table",
    "Leaderboard",
    "Top players",
    "Brain game",
    "Speed training",
  ],
  openGraph: {
    title: "Global Leaderboard - Schulte Table",
    description: "Top Schulte Table players ranked by speed and accuracy.",
    url: "https://www.schultetable.com/leaderboard",
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
    title: "Global Leaderboard - Schulte Table",
    description: "Explore the top ranked Schulte Table players globally.",
  },
  alternates: {
    canonical: "https://www.schultetable.com/leaderboard",
  },
};

export default async function page() {
  const { user, error } = await getCurrentUser();

  return (
    <div>
      <h1 className="sr-only">Global Schulte Table Leaderboard</h1>
      <GlobalLeaderboard user={user} />
    </div>
  );
}
