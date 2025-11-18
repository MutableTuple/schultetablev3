"use client";

import React, { useEffect, useState } from "react";
import { IoMdAnalytics } from "react-icons/io";
import { RiSecurePaymentLine } from "react-icons/ri";
import { AiFillThunderbolt } from "react-icons/ai";
import { GiProgression } from "react-icons/gi";
import { CgInsights } from "react-icons/cg";
import { IoSparkles } from "react-icons/io5";
import { BiSolidBadgeDollar } from "react-icons/bi";
export default function Pro({ user }) {
  const [isIndia, setIsIndia] = useState(null);
  const userId = user?.[0]?.id;

  // Load LemonSqueezy script
  useEffect(() => {
    if (window.LemonSqueezy) return;
    const s = document.createElement("script");
    s.src = "https://app.lemonsqueezy.com/js/lemon.js";
    s.async = true;
    s.onload = () => window.LemonSqueezy?.Setup?.();
    document.body.appendChild(s);
  }, []);

  // Detect Region
  useEffect(() => {
    let canceled = false;
    const detect = async () => {
      try {
        const res = await fetch("/api/region");
        const data = await res.json();
        if (!canceled) setIsIndia(Boolean(data.isIndia));
      } catch {
        if (!canceled) setIsIndia(false);
      }
    };
    detect();
    return () => (canceled = true);
  }, []);

  const PLANS = isIndia
    ? {
        region: "India",
        monthlyPrice: "₹49",
        lifetimePrice: "₹249",
        monthlySaved: "₹339/year vs monthly",
        lifetimeSaved: "Pay once, save ₹339 vs yearly",
        monthlyUrl:
          "https://schultetable.lemonsqueezy.com/buy/470240d2-a5ee-4def-92c0-394c2ecf0579",
        lifetimeUrl:
          "https://schultetable.lemonsqueezy.com/buy/1d34e5e2-5140-4a77-b8ce-72f5615aea97",
      }
    : {
        region: "Global",
        monthlyPrice: "$1.99",
        lifetimePrice: "$4.99",
        monthlySaved: "$7/year vs monthly",
        lifetimeSaved: "Pay once, save $7 vs yearly",
        monthlyUrl:
          "https://schultetable.lemonsqueezy.com/buy/a66627cf-a706-41aa-af08-5438b49b17e9",
        lifetimeUrl:
          "https://schultetable.lemonsqueezy.com/buy/a7ae0450-6c1d-4aa1-92c0-dfce4e3edf6e",
      };

  const checkout = (url) =>
    url.includes("?")
      ? `${url}&checkout[custom][user_id]=${userId}`
      : `${url}?checkout[custom][user_id]=${userId}`;

  if (isIndia === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <div className="badge badge-primary badge-lg mb-6">
            Pricing for {PLANS.region}
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Upgrade to <span className="text-primary">SchulteTable Pro</span>
          </h1>

          <p className="text-xl text-base-content/70 max-w-2xl mx-auto mb-8">
            Get deep analytics, personalized insights, and comprehensive
            performance tracking to accelerate your cognitive improvement.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                <AiFillThunderbolt />
              </span>
              <span>Instant Access</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                <RiSecurePaymentLine />
              </span>
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                <IoMdAnalytics />
              </span>
              <span>Advanced Analytics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 pb-16">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Free Plan */}
          <div className="card bg-base-100 border border-base-300 cursor-pointer hover:shadow-sm transition-shadow hover:shadow-xl transition-shadow">
            <div className="card-body">
              <h2 className="card-title text-2xl">Free</h2>
              <p className="text-base-content/60">Basic training features</p>

              <div className="my-6">
                <div className="text-5xl font-bold text-base-content mb-2">
                  $0
                  <span className="text-xl text-base-content/50 font-normal">
                    {" "}
                    forever
                  </span>
                </div>
                <div className="text-sm text-base-content/60">Current plan</div>
              </div>

              <div className="card-actions">
                <button className="btn btn-disabled w-full">
                  Your Current Plan
                </button>
              </div>

              <div className="divider">Includes</div>

              <ul className="space-y-2 text-sm">
                <Benefit text="Basic training mode" />
                <Benefit text="Standard game sessions" />
                <Benefit text="Simple time tracking" />
                <Benefit text="Basic statistics" />
              </ul>
            </div>
          </div>

          {/* Monthly Plan */}
          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body">
              <h2 className="card-title text-2xl">Monthly Pro</h2>
              <p className="text-base-content/60">Full features, flexible</p>

              <div className="my-6">
                <div className="text-5xl font-bold text-primary mb-2">
                  {PLANS.monthlyPrice}
                  <span className="text-xl text-base-content/50 font-normal">
                    {" "}
                    30 day pass
                  </span>
                </div>
                <div className="text-sm text-success font-medium">
                  {PLANS.monthlySaved}
                </div>
              </div>

              <div className="card-actions">
                <a
                  href={checkout(PLANS.monthlyUrl)}
                  target="_blank"
                  className="btn btn-outline btn-primary w-full"
                >
                  Upgrade to Monthly
                </a>
              </div>

              <div className="divider">Everything in Free, plus</div>

              <ul className="space-y-2 text-sm">
                <Benefit text="All Pro analytics features" />
                <Benefit text="Advanced performance insights" />
                <Benefit text="Detailed progress tracking" />
                <Benefit text="Priority support" />
              </ul>
            </div>
          </div>

          {/* Lifetime Plan */}
          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow border-2 border-primary relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="badge badge-primary badge-lg gap-2 font-bold">
                <span>
                  <BiSolidBadgeDollar />
                </span>{" "}
                BEST VALUE
              </div>
            </div>

            <div className="card-body">
              <h2 className="card-title text-2xl">Lifetime Pro</h2>
              <p className="text-base-content/60">Pay once, own forever</p>

              <div className="my-6">
                <div className="text-5xl font-bold text-primary mb-2">
                  {PLANS.lifetimePrice}
                  <span className="text-xl text-base-content/50 font-normal">
                    {" "}
                    one-time
                  </span>
                </div>
                <div className="text-sm text-success font-medium">
                  {PLANS.lifetimeSaved}
                </div>
              </div>

              <div className="card-actions">
                <a
                  href={checkout(PLANS.lifetimeUrl)}
                  target="_blank"
                  className="btn btn-primary w-full"
                >
                  Get Lifetime Access →
                </a>
              </div>

              <div className="divider">Everything in Free, plus</div>

              <ul className="space-y-2 text-sm">
                <Benefit text="All Pro features forever" />
                <Benefit text="All future updates included" />
                <Benefit text="Priority email support" />
                <Benefit text="Best value for money" highlighted />
              </ul>
            </div>
          </div>
        </div>

        {/* All Pro Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">
            Everything Included in Pro
          </h2>
          <p className="text-center text-base-content/70 mb-10 max-w-2xl mx-auto">
            Unlock the complete suite of advanced analytics and insights to
            maximize your training results
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Analytics Section */}
            <div className="card bg-base-100 border border-base-300 cursor-pointer hover:shadow-sm transition-shadow">
              <div className="card-body">
                <h3 className="card-title text-primary">
                  <span className="text-2xl mr-2">
                    <IoMdAnalytics />
                  </span>
                  Advanced Analytics
                </h3>
                <ul className="space-y-3 mt-4">
                  <Benefit text="Full brain performance report with detailed metrics" />
                  <Benefit text="Reaction time deep-analysis and speed tracking" />
                  <Benefit text="Accuracy percentage and error pattern analysis" />
                  <Benefit text="Consistency metrics across all sessions" />
                  <Benefit text="Fatigue detection and optimal timing insights" />
                  <Benefit text="Performance distribution charts and graphs" />
                </ul>
              </div>
            </div>

            {/* Progress Section */}
            <div className="card bg-base-100 border border-base-300 cursor-pointer hover:shadow-sm transition-shadow">
              <div className="card-body">
                <h3 className="card-title text-secondary">
                  <span className="text-2xl mr-2">
                    <GiProgression />
                  </span>
                  Progress Tracking
                </h3>
                <ul className="space-y-3 mt-4">
                  <Benefit text="10-game trend evolution map showing improvement" />
                  <Benefit text="Historical performance comparison" />
                  <Benefit text="Personal best tracking and milestones" />
                  <Benefit text="Week-over-week progress reports" />
                  <Benefit text="Visual timeline of your cognitive journey" />
                  <Benefit text="Goal setting and achievement tracking" />
                </ul>
              </div>
            </div>

            {/* Insights Section */}
            <div className="card bg-base-100 border border-base-300 cursor-pointer hover:shadow-sm transition-shadow">
              <div className="card-body">
                <h3 className="card-title text-accent">
                  <span className="text-2xl mr-2">
                    <CgInsights />
                  </span>
                  Detailed Insights
                </h3>
                <ul className="space-y-3 mt-4">
                  <Benefit text="Game-by-game breakdown with session details" />
                  <Benefit text="Pattern recognition in your performance" />
                  <Benefit text="Strength and weakness identification" />
                  <Benefit text="Personalized improvement recommendations" />
                  <Benefit text="Time-of-day performance analysis" />
                  <Benefit text="Cognitive load assessment per session" />
                </ul>
              </div>
            </div>

            {/* Extra Benefits */}
            <div className="card bg-base-100 border border-base-300 cursor-pointer hover:shadow-sm transition-shadow">
              <div className="card-body">
                <h3 className="card-title text-success">
                  <span className="text-2xl mr-2">
                    <IoSparkles />
                  </span>
                  Exclusive Benefits
                </h3>
                <ul className="space-y-3 mt-4">
                  <Benefit text="Priority email support with faster response times" />
                  <Benefit text="Export your data for external analysis" />
                  <Benefit text="Custom training difficulty recommendations" />
                  <Benefit text="Ad-free experience across all features" />
                  <Benefit text="Early access to new features and updates" />
                  <Benefit text="Dedicated dashboard for all your stats" />
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="card bg-gradient-to-br from-primary/20 to-secondary/20 shadow-xl">
          <div className="card-body items-center text-center py-12">
            <h3 className="card-title text-3xl mb-4">
              Ready to Unlock Your Full Potential?
            </h3>
            <p className="text-base-content/70 max-w-2xl mb-6">
              Join thousands of users who are improving their cognitive
              performance with Pro. Get instant access to all advanced analytics
              and insights right after purchase.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a
                href={checkout(PLANS.lifetimeUrl)}
                target="_blank"
                className="btn btn-primary btn-lg"
              >
                Get Lifetime Access — {PLANS.lifetimePrice}
              </a>
              <a
                href={checkout(PLANS.monthlyUrl)}
                target="_blank"
                className="btn btn-outline btn-lg"
              >
                Try Monthly — {PLANS.monthlyPrice}
              </a>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm text-base-content/60">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Secure checkout powered by LemonSqueezy
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Benefit({ text, highlighted }) {
  return (
    <li className="flex items-start gap-3">
      <svg
        className={`w-5 h-5 mt-0.5 flex-shrink-0 ${highlighted ? "text-secondary" : "text-success"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <span className={highlighted ? "font-semibold text-secondary" : ""}>
        {text}
      </span>
    </li>
  );
}
