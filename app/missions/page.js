import React from "react";
import MissionsHeader from "../_components/Missions/MissionsHeader";
import {
  getMissionByID,
  getUserMissionsCompletions,
} from "../_lib/data-service";
import MissionsCompletedByUsers from "../_components/Missions/MissionsCompletedByUsers";
import NotLoggedInModal from "../_components/Modals/NotLoggedInModal";
import { getCurrentUser } from "../_utils/getCurrentUser";

export const metadata = {
  title: "Schulte Table Missions",
  description:
    "Join Schulte Table Missions to improve your cognitive skills and focus. Track progress, earn rewards, and compete globally.",
  keywords: [
    "Schulte Table Missions",
    "brain training challenges",
    "focus games",
    "cognitive skill development",
    "mental performance improvement",
    "Schulte Table progress",
  ],
  openGraph: {
    title: "Schulte Table Missions",
    description:
      "Take part in our interactive Missions to enhance focus and memory. Compete with others and track your achievements.",
    url: "https://schultetable.com/missions", // update if route is different
    siteName: "Schulte Table",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Join Schulte Table Missions",
    description:
      "Unlock brain training goals and track your performance with Schulte Table Missions.",
  },
  alternates: {
    canonical: "https://www.schultetable.com/missions",
  },
};

export default async function page() {
  const { user, err } = await getCurrentUser();
  const mission = await getMissionByID("7113a0c2-ce6d-4896-8260-9ca759bb512c");
  const mission_completions = await getUserMissionsCompletions();

  return (
    <div>
      <NotLoggedInModal
        user={user}
        message="Please log in to participate in Missions. We'd love to see you join and earn rewards!"
        loginUrl="/auth/login"
        buttonText="Sign In"
        showLater={true}
      />

      <MissionsHeader
        mission={mission}
        mission_completions={mission_completions}
      />
      <div className="flex justify-center min-w-full">
        <MissionsCompletedByUsers
          mission_completions={mission_completions}
          mission={mission}
        />
      </div>
    </div>
  );
}
