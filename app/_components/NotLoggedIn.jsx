import React from "react";
import Link from "next/link";

export default function NotLoggedIn() {
  return (
    <main className="min-h-screen bg-base-200 flex items-center justify-center px-6 py-10">
      <section className="w-full max-w-2xl text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-28 h-28 rounded-full bg-error/10 border border-error/20 flex items-center justify-center shadow-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-14 h-14 text-error"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 11V7m0 8h.01M6.3 19h11.4c1.5 0 2.4-1.6 1.7-2.9L13.7 5.8c-.8-1.4-2.6-1.4-3.4 0L4.6 16.1C3.9 17.4 4.8 19 6.3 19z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-5xl font-black leading-tight">
          You&apos;re not logged in
        </h1>

        <p className="mt-5 text-lg text-base-content/70 max-w-xl mx-auto">
          Sign in to view your profile, game history, rankings, brain reports,
          progress analytics, and premium features.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/login">
            <button className="btn btn-primary btn-lg px-10">
              Continue to Login
            </button>
          </Link>

          <Link href="/">
            <button className="btn btn-outline btn-lg px-10">
              Back to Home
            </button>
          </Link>
        </div>

        <div className="mt-14 stats stats-vertical sm:stats-horizontal shadow w-full bg-base-100">
          <div className="stat">
            <div className="stat-title">Access</div>
            <div className="stat-value text-primary text-2xl">Profile</div>
          </div>

          <div className="stat">
            <div className="stat-title">Track</div>
            <div className="stat-value text-secondary text-2xl">Progress</div>
          </div>

          <div className="stat">
            <div className="stat-title">Unlock</div>
            <div className="stat-value text-accent text-2xl">Reports</div>
          </div>
        </div>

        <p className="mt-8 text-sm text-base-content/50">
          Secure login with Google or Email
        </p>
      </section>
    </main>
  );
}