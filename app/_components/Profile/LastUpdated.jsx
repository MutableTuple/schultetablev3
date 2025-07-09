import { formatDistanceToNow } from "date-fns";
import React from "react";

export default function LastUpdated({ user }) {
  return (
    <div className="mt-4 text-sm text-base-content/70 italic">
      Updated once every hour. Last updated &mdash;{" "}
      <span>
        {user[0]?.last_updated
          ? formatDistanceToNow(new Date(user[0].last_updated), {
              addSuffix: true,
            })
          : "unknown"}
      </span>
    </div>
  );
}
