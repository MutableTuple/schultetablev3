import React from "react";
import GlobalLeaderboard from "../_components/Leaderboard/GlobalLeaderboard";
import { getCurrentUser } from "../_utils/getCurrentUser";
export const metadata = {
  title: "Global Leaderboard - Schulte Table",
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
    url: "https://schultetable.com/leaderboard",
    siteName: "Schulte Table",
    type: "website",
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
  return (
    <div>
      <GlobalLeaderboard />
    </div>
  );
}
