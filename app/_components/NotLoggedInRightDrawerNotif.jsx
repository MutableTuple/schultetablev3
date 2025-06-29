import Link from "next/link";
import React from "react";

export default function NotLoggedInRightDrawerNotif() {
  return (
    <div className="flex flex-col items-center justify-center text-center bg-base-300/80 border border-base-300  rounded-md px-4 py-6 w-full">
      <p className="font-semibold text-base mb-3">
        Sign in to see your personalized stats
      </p>

      <ul className="space-y-2 text-sm text-gray-600">
        {[
          "Track your progress",
          "View past performance",
          "Get insights",
          "See advanced data & graphs",
          "Get on the leaderboard",
          "& much more to fit here",
        ].map((text, idx) => (
          <li key={idx} className="flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>{text}</span>
          </li>
        ))}
      </ul>

      <Link href="/auth/login">
        <span className="btn btn-sm btn-primary mt-4">Sign In</span>
      </Link>
    </div>
  );
}
