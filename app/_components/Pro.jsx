"use client";
import Link from "next/link";
import React, { useEffect } from "react";

export default function Pro({ user }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.lemonsqueezy.com/js/lemon.js";
    script.async = true;
    script.onload = () => {
      if (window.LemonSqueezy) {
        window.LemonSqueezy.Setup();
      }
    };
    document.body.appendChild(script);
  }, []);
  return (
    <div className="min-h-screen bg-base-200 py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-base-content">
      {/* Header */}
      <div className="text-center max-w-4xl mb-8 sm:mb-10 lg:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
          Unlock Your Brain's Full Potential
        </h1>
        <p className="text-sm sm:text-base lg:text-lg opacity-70 px-2">
          Upgrade to{" "}
          <span className="text-primary font-semibold">SchulteTable Pro</span>{" "}
          for a faster, smarter, and more personalized brain training
          experience.
        </p>
      </div>

      {/* Plans */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Free Plan */}
        <div className="card w-full bg-base-100 shadow-sm border border-primary">
          <div className="card-body p-4 sm:p-6">
            <span className="badge badge-xs badge-neutral mb-2">Free Plan</span>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
              <h2 className="text-2xl sm:text-3xl font-bold">Free</h2>
              <span className="text-lg sm:text-xl mt-1 sm:mt-0">$0/mo</span>
            </div>
            <ul className="mt-4 sm:mt-6 flex flex-col gap-3 text-xs sm:text-sm">
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4 me-2 mt-0.5 flex-shrink-0 text-success"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Access to basic 3x3 and 4x4 tables</span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4 me-2 mt-0.5 flex-shrink-0 text-success"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Limited score tracking</span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4 me-2 mt-0.5 flex-shrink-0 text-success"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Ads shown occasionally</span>
              </li>
              <li className="opacity-50 flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4 me-2 mt-0.5 flex-shrink-0 text-base-content/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span className="line-through">
                  Advanced statistics & performance insights
                </span>
              </li>
              <li className="opacity-50 flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4 me-2 mt-0.5 flex-shrink-0 text-base-content/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span className="line-through">
                  Personal leaderboard tracking
                </span>
              </li>
              <li className="opacity-50 flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4 me-2 mt-0.5 flex-shrink-0 text-base-content/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span className="line-through">
                  Premium themes & animations
                </span>
              </li>
            </ul>
            <div className="mt-6">
              <button className="btn btn-outline btn-block text-sm sm:text-base">
                Current Plan
              </button>
            </div>
          </div>
        </div>

        {/* Pro Plan */}
        <div className="card w-full bg-base-100 shadow-sm border border-primary">
          <div className="card-body p-4 sm:p-6">
            <span className="badge badge-xs badge-warning mb-2">
              Most Popular
            </span>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
              <h2 className="text-2xl sm:text-3xl font-bold">Premium</h2>
              <span className="text-lg sm:text-xl mt-1 sm:mt-0">
                $19.99/lifetime
              </span>
            </div>
            <ul className="mt-4 sm:mt-6 flex flex-col gap-3 text-xs sm:text-sm">
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4 me-2 mt-0.5 flex-shrink-0 text-success"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Access to all game modes</span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4 me-2 mt-0.5 flex-shrink-0 text-success"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Track Response time between each click</span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4 me-2 mt-0.5 flex-shrink-0 text-success"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Advanced statistics & performance tracking</span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4 me-2 mt-0.5 flex-shrink-0 text-success"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Customizable difficulty presets</span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4 me-2 mt-0.5 flex-shrink-0 text-success"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Ad-free uninterrupted gameplay</span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4 me-2 mt-0.5 flex-shrink-0 text-success"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Exclusive Pro-only leaderboard</span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4 me-2 mt-0.5 flex-shrink-0 text-success"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Priority support</span>
              </li>
            </ul>
            <div className="mt-6">
              <Link
                href={`https://schultetable.lemonsqueezy.com/buy/a7ae0450-6c1d-4aa1-92c0-dfce4e3edf6e?checkout[custom][user_id]=${user[0]?.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-block text-sm sm:text-base"
              >
                Get it now! (limited time offer)
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
