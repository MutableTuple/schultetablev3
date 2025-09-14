"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaExclamationCircle } from "react-icons/fa";
export default function ErrorPage({ error }) {
  const router = useRouter();

  useEffect(() => {
    // console.error("App Error:", error);
  }, [error]);

  // Define friendly messages for specific errors
  const getFriendlyMessage = (message) => {
    if (!message) return "Something went wrong. Please try again.";

    if (message.includes("logged in")) return "Please log in to continue.";
    if (message.includes("Pro"))
      return "Upgrade to Pro to access this feature.";
    if (message.includes("does not belong"))
      return "You don't have access to this game.";
    if (message.includes("No game found"))
      return "The game you're looking for doesn't exist.";

    return "Something went wrong. Please try again.";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 text-center px-4">
      <div className="max-w-md space-y-6">
        <div className="flex justify-center">
          <FaExclamationCircle className="w-16 h-16 text-error" />
        </div>

        <h1 className="text-4xl font-bold text-error">
          {getFriendlyMessage(error?.message)}
        </h1>

        <p className="text-base text-base-content/70">something went wrong</p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.back()}
            className="btn btn-outline btn-primary"
          >
            Go Back
          </button>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Refresh Page
          </button>
        </div>

        <p className="text-xs text-base-content/50">
          Still having trouble? Contact support for help.
        </p>
      </div>
    </div>
  );
}
