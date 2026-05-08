"use client";
import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 px-6 text-center">
      {/* Big 404 */}
      <div className="relative mb-6 select-none">
        <span
          className="block font-black leading-none tracking-tight text-base-content"
          style={{
            fontSize: "clamp(96px, 20vw, 148px)",
            letterSpacing: "-4px",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          404+-
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-error align-super ml-1 animate-pulse" />
        </span>
        {/* Shadow echo */}
        <span
          className="absolute inset-0 text-base-content/10 pointer-events-none"
          aria-hidden
          style={{
            fontSize: "clamp(96px, 20vw, 148px)",
            fontWeight: 800,
            letterSpacing: "-4px",
            transform: "translate(4px, 4px)",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          404
        </span>
      </div>

      {/* Pill tag */}
      <span className="mb-4 inline-block rounded-full border border-base-300 px-4 py-1 text-xs font-medium uppercase tracking-widest text-base-content/50">
        Page not found
      </span>

      {/* Copy */}
      <h1
        className="mb-2 text-2xl font-bold text-base-content"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        You've wandered off the map.
      </h1>
      <p className="mb-8 max-w-sm text-sm leading-relaxed text-base-content/60">
        This page doesn't exist — it may have been moved, deleted, or never
        existed at all.
      </p>

      {/* Primary CTA */}
      <Link href="/">
        <button className="btn btn-neutral rounded-full px-6 gap-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9.5L8 4.5l5 5" />
            <path d="M8 4.5v8M5 13h6" />
          </svg>
          Take me home
        </button>
      </Link>

      {/* Divider */}
      <div className="my-6 flex w-full max-w-xs items-center gap-3">
        <span className="flex-1 border-t border-base-300" />
        <span className="text-xs text-base-content/30">
          or try one of these
        </span>
        <span className="flex-1 border-t border-base-300" />
      </div>

      {/* Secondary links */}
      <div className="flex gap-6 text-sm text-base-content/50">
        <Link
          href="/dashboard"
          className="hover:text-base-content transition-colors"
        >
          Dashboard
        </Link>
        <Link
          href="/support"
          className="hover:text-base-content transition-colors"
        >
          Support
        </Link>
        <button
          onClick={() => history.back()}
          className="hover:text-base-content transition-colors"
        >
          Go back
        </button>
      </div>
    </div>
  );
}
