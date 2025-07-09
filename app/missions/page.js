import React from "react";
import MissionsHeader from "../_components/Missions/MissionsHeader";
import {
  getMissionByID,
  getUserMissionsCompletions,
} from "../_lib/data-service";
import MissionsCompletedByUsers from "../_components/Missions/MissionsCompletedByUsers";
import NotLoggedInModal from "../_components/Modals/NotLoggedInModal";
import { getCurrentUser } from "../_utils/getCurrentUser";

export default async function page() {
  const { user, err } = await getCurrentUser();
  const mission = await getMissionByID("7113a0c2-ce6d-4896-8260-9ca759bb512c");
  const mission_completions = await getUserMissionsCompletions();
  console.log("MISSIONS", mission);
  console.log("MISSIONS_COMPETSD", mission_completions);
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
