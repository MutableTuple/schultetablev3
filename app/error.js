"use client";

import React from "react";
import { useRouter } from "next/navigation";

/* ======================
   ICON
====================== */
const AlertCircleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-7 h-7 text-error"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

/* ======================
   FRIENDLY MESSAGE HELPER
====================== */
const getFriendlyMessage = (message) => {
  if (!message) return "Something went wrong.";

  // Ensure safe string handling
  const msg = String(message).toLowerCase();

  if (msg.includes("logged in")) return "Please log in to continue.";

  if (msg.includes("pro")) return "Upgrade to Pro to access this feature.";

  if (msg.includes("does not belong"))
    return "You don't have access to this game.";

  if (msg.includes("no game found"))
    return "The game you're looking for doesn't exist.";

  return "Something went wrong.";
};

/* ======================
   ERROR PAGE
====================== */
export default function ErrorPage({ error }) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm p-10 max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center animate-pulse">
            <AlertCircleIcon />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl font-serif font-normal text-base-content leading-snug">
            {getFriendlyMessage(error?.message)}
          </h1>

          <p className="text-sm text-base-content/60 leading-relaxed">
            We hit an unexpected error. Try going back or refreshing — it
            usually clears things up.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => router.back()}
            className="btn btn-outline btn-sm rounded-lg px-5 font-medium"
          >
            Go back
          </button>

          <button
            onClick={() => window.location.reload()}
            className="btn btn-neutral btn-sm rounded-lg px-5 font-medium"
          >
            Refresh page
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-base-300 pt-4">
          <p className="text-xs text-base-content/40">
            Still having trouble?{" "}
            <a
              href="mailto:support@yourdomain.com"
              className="text-info hover:underline"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
