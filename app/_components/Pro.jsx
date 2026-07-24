"use client";

import React, { useEffect, useState } from "react";
import { IoMdAnalytics } from "react-icons/io";
import { RiSecurePaymentLine } from "react-icons/ri";
import { AiFillThunderbolt } from "react-icons/ai";
import { GiProgression } from "react-icons/gi";
import { CgInsights } from "react-icons/cg";
import { IoSparkles } from "react-icons/io5";
import { BiSolidBadgeDollar } from "react-icons/bi";
import { Check, Minus, Star, ShieldCheck, ChevronDown } from "lucide-react";

export default function Pro({ user }) {
  const [isIndia, setIsIndia] = useState(null);
  const userId = user?.id;
  const isLoggedIn = Boolean(userId);

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

  const buyHref = (url) => (isLoggedIn ? checkout(url) : "/auth/login");

  if (isIndia === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-success/10">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <div className="inline-block rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary mb-6">
            Pricing for {PLANS.region}
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            Upgrade to <span className="text-primary">SchulteTable Pro</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Get deep analytics, personalized insights, and comprehensive
            performance tracking to accelerate your cognitive improvement.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-foreground">
            <div className="flex items-center gap-2">
              <span className="text-2xl text-primary">
                <AiFillThunderbolt />
              </span>
              <span>Instant Access</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl text-primary">
                <RiSecurePaymentLine />
              </span>
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl text-primary">
                <IoMdAnalytics />
              </span>
              <span>Advanced Analytics</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-8 pb-16">
        {/* Pricing Cards — reordered on mobile so the recommended plan
            (Lifetime) shows first instead of last after two scrolls */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Free Plan */}
          <div className="order-3 md:order-1 rounded-2xl bg-card border border-border p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold text-foreground">Free</h2>
            <p className="text-muted-foreground">Basic training features</p>

            <div className="my-6">
              <div className="text-5xl font-bold text-foreground mb-2">
                $0
                <span className="text-xl text-muted-foreground font-normal">
                  {" "}
                  forever
                </span>
              </div>
              <div className="text-sm text-muted-foreground">Current plan</div>
            </div>

            <button
              disabled
              className="w-full rounded-xl bg-muted text-muted-foreground text-sm font-semibold py-2.5 cursor-not-allowed"
            >
              Your Current Plan
            </button>

            <Divider label="Includes" />

            <ul className="space-y-2 text-sm">
              <Benefit text="Basic training mode" />
              <Benefit text="Standard game sessions" />
              <Benefit text="Simple time tracking" />
              <Benefit text="Basic statistics" />
            </ul>
          </div>

          {/* Monthly Plan */}
          <div className="order-2 md:order-2 rounded-2xl bg-card border border-border p-6 shadow-xl hover:shadow-2xl transition-shadow">
            <h2 className="text-2xl font-bold text-foreground">Monthly Pro</h2>
            <p className="text-muted-foreground">Full features, flexible</p>

            <div className="my-6">
              <div className="text-5xl font-bold text-primary mb-2">
                {PLANS.monthlyPrice}
                <span className="text-xl text-muted-foreground font-normal">
                  {" "}
                  30 day pass
                </span>
              </div>
              <div className="text-sm text-success font-medium">
                {PLANS.monthlySaved}
              </div>
            </div>

            <BuyButton
              href={buyHref(PLANS.monthlyUrl)}
              className="flex w-full items-center justify-center rounded-xl border border-primary text-primary text-sm font-semibold py-2.5 hover:bg-primary/10 transition-colors"
            >
              Upgrade to Monthly
            </BuyButton>

            <Divider label="Everything in Free, plus" />

            <ul className="space-y-2 text-sm">
              <Benefit text="All Pro analytics features" />
              <Benefit text="Advanced performance insights" />
              <Benefit text="Detailed progress tracking" />
              <Benefit text="Priority support" />
            </ul>
          </div>

          {/* Lifetime Plan */}
          <div className="order-1 md:order-3 relative rounded-2xl bg-card border-2 border-primary p-6 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                <BiSolidBadgeDollar /> BEST VALUE
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground">Lifetime Pro</h2>
            <p className="text-muted-foreground">Pay once, own forever</p>

            <div className="my-6">
              <div className="text-5xl font-bold text-primary mb-2">
                {PLANS.lifetimePrice}
                <span className="text-xl text-muted-foreground font-normal">
                  {" "}
                  one-time
                </span>
              </div>
              <div className="text-sm text-success font-medium">
                {PLANS.lifetimeSaved}
              </div>
            </div>

            <BuyButton
              href={buyHref(PLANS.lifetimeUrl)}
              className="flex w-full items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-semibold py-2.5 hover:bg-primary/90 transition-colors"
            >
              Get Lifetime Access →
            </BuyButton>

            <Divider label="Everything in Free, plus" />

            <ul className="space-y-2 text-sm">
              <Benefit text="All Pro features forever" />
              <Benefit text="All future updates included" />
              <Benefit text="Priority email support" />
              <Benefit text="Best value for money" highlighted />
            </ul>
          </div>
        </div>

        {/* Comparison Table — scannable "what am I missing" is one of the
            highest-converting pricing page patterns */}
        <div className="mb-16">
          <SectionEyebrow Icon={IoMdAnalytics} label="Compare plans" />
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
            Free vs Pro, side by side
          </h2>
          <ComparisonTable />
        </div>

        {/* All Pro Features */}
        <div className="mb-16">
          <SectionEyebrow Icon={IoSparkles} label="Full feature set" />
          <h2 className="text-3xl font-bold text-center mb-4 text-foreground">
            Everything Included in Pro
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            Unlock the complete suite of advanced analytics and insights to
            maximize your training results
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              Icon={IoMdAnalytics}
              title="Advanced Analytics"
              colorClass="text-primary"
              items={[
                "Full brain performance report with detailed metrics",
                "Reaction time deep-analysis and speed tracking",
                "Accuracy percentage and error pattern analysis",
                "Consistency metrics across all sessions",
                "Fatigue detection and optimal timing insights",
                "Performance distribution charts and graphs",
              ]}
            />
            <FeatureCard
              Icon={GiProgression}
              title="Progress Tracking"
              colorClass="text-success"
              items={[
                "10-game trend evolution map showing improvement",
                "Historical performance comparison",
                "Personal best tracking and milestones",
                "Week-over-week progress reports",
                "Visual timeline of your cognitive journey",
                "Goal setting and achievement tracking",
              ]}
            />
            <FeatureCard
              Icon={CgInsights}
              title="Detailed Insights"
              colorClass="text-warning"
              items={[
                "Game-by-game breakdown with session details",
                "Pattern recognition in your performance",
                "Strength and weakness identification",
                "Personalized improvement recommendations",
                "Time-of-day performance analysis",
                "Cognitive load assessment per session",
              ]}
            />
            <FeatureCard
              Icon={IoSparkles}
              title="Exclusive Benefits"
              colorClass="text-primary"
              items={[
                "Priority email support with faster response times",
                "Export your data for external analysis",
                "Custom training difficulty recommendations",
                "Ad-free experience across all features",
                "Early access to new features and updates",
                "Dedicated dashboard for all your stats",
              ]}
            />
          </div>
        </div>

        {/* Reviews — PLACEHOLDER CONTENT, replace with real reviews before
            shipping. Fabricated testimonials presented as genuine would be
            dishonest; these exist purely to hold the layout. */}
        <div className="mb-16">
          <SectionEyebrow Icon={Star} label="What people say" />
          <h2 className="text-3xl font-bold text-center mb-10 text-foreground">
            Loved by people training their focus
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* TODO: swap these three for real, verified reviews */}
            <ReviewCard
              initials="AR"
              name="Alex R."
              quote="Finally something that actually shows me if I'm improving, not just another app to scroll through."
            />
            <ReviewCard
              initials="MK"
              name="Maya K."
              quote="The monthly report alone is worth it — I can see exactly where my focus is slipping."
            />
            <ReviewCard
              initials="JD"
              name="Jordan D."
              quote="Simple, honest, no fluff. Just real numbers on my progress."
            />
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <SectionEyebrow Icon={ChevronDown} label="Questions" />
          <h2 className="text-3xl font-bold text-center mb-10 text-foreground">
            Frequently asked questions
          </h2>
          <div className="max-w-2xl mx-auto space-y-3">
            <FaqItem
              q="Is the Lifetime plan really a one-time payment?"
              a="Yes — pay once and keep Pro access forever. No recurring charges."
            />
            <FaqItem
              q="What's the difference between Monthly and Lifetime?"
              a="Monthly Pro gives you 30 days of full access at a lower upfront cost. Lifetime Pro is a single payment that never expires."
            />
            <FaqItem
              q="Will I lose my Free plan progress if I upgrade?"
              a="No — all your existing game history and stats carry over. Pro unlocks the full analytics on top of what you've already played."
            />
            <FaqItem
              q="Which payment methods are supported?"
              a="Checkout is handled securely by LemonSqueezy, which supports major cards and regional payment methods depending on your location."
            />
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="rounded-2xl bg-gradient-to-br from-primary/15 via-card to-success/10 border border-border shadow-xl">
          <div className="flex flex-col items-center text-center py-12 px-6">
            <h3 className="text-3xl font-bold mb-4 text-foreground">
              Ready to Unlock Your Full Potential?
            </h3>
            <p className="text-muted-foreground max-w-2xl mb-6">
              Join thousands of users who are improving their cognitive
              performance with Pro. Get instant access to all advanced analytics
              and insights right after purchase.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <BuyButton
                href={buyHref(PLANS.lifetimeUrl)}
                className="flex items-center justify-center rounded-xl bg-primary text-primary-foreground text-base font-bold px-6 py-3.5 hover:bg-primary/90 transition-colors"
              >
                Get Lifetime Access — {PLANS.lifetimePrice}
              </BuyButton>
              <BuyButton
                href={buyHref(PLANS.monthlyUrl)}
                className="flex items-center justify-center rounded-xl border border-border text-foreground text-base font-bold px-6 py-3.5 hover:bg-muted transition-colors"
              >
                Try Monthly — {PLANS.monthlyPrice}
              </BuyButton>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="w-5 h-5" />
              Secure checkout powered by LemonSqueezy
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── helpers ────────────────────────────────────────────────────────────────

function BuyButton({ href, className, children }) {
  const isExternal = href.startsWith("http");
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={className}
    >
      {children}
    </a>
  );
}

function Divider({ label }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {label}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function SectionEyebrow({ Icon, label }) {
  return (
    <div className="flex justify-center mb-3">
      <div className="flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
        <Icon size={12} />
        {label}
      </div>
    </div>
  );
}

function FeatureCard({ Icon, title, colorClass, items }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-6 hover:shadow-sm transition-shadow">
      <h3 className={`flex items-center gap-2 text-xl font-bold ${colorClass}`}>
        <Icon className="text-2xl" />
        {title}
      </h3>
      <ul className="space-y-3 mt-4">
        {items.map((text) => (
          <Benefit key={text} text={text} />
        ))}
      </ul>
    </div>
  );
}

function Benefit({ text, highlighted }) {
  return (
    <li className="flex items-start gap-3">
      <Check
        className={`w-5 h-5 mt-0.5 flex-shrink-0 ${highlighted ? "text-primary" : "text-success"}`}
        strokeWidth={2.5}
      />
      <span
        className={`text-sm ${highlighted ? "font-semibold text-primary" : "text-foreground"}`}
      >
        {text}
      </span>
    </li>
  );
}

const comparisonRows = [
  { label: "Basic training modes", free: true, pro: true },
  { label: "Standard game sessions", free: true, pro: true },
  { label: "Simple time tracking", free: true, pro: true },
  { label: "Full game history (unlimited)", free: false, pro: true },
  { label: "Global percentile ranking", free: false, pro: true },
  { label: "Advanced brain performance report", free: false, pro: true },
  { label: "Progress trend & consistency tracking", free: false, pro: true },
  { label: "Personalized insights", free: false, pro: true },
  { label: "Monthly report delivered to you", free: false, pro: true },
  { label: "Ad-free experience", free: false, pro: true },
  { label: "Priority support", free: false, pro: true },
];

function ComparisonTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="grid grid-cols-[1fr_auto_auto] items-center border-b border-border bg-muted px-5 py-3 text-sm font-bold text-foreground">
        <span>Feature</span>
        <span className="w-16 text-center">Free</span>
        <span className="w-16 text-center text-primary">Pro</span>
      </div>
      {comparisonRows.map((row, i) => (
        <div
          key={row.label}
          className={`grid grid-cols-[1fr_auto_auto] items-center px-5 py-3 text-sm ${
            i !== comparisonRows.length - 1 ? "border-b border-border" : ""
          }`}
        >
          <span className="text-foreground">{row.label}</span>
          <span className="w-16 flex justify-center">
            {row.free ? (
              <Check className="w-4 h-4 text-success" />
            ) : (
              <Minus className="w-4 h-4 text-muted-foreground/40" />
            )}
          </span>
          <span className="w-16 flex justify-center">
            {row.pro ? (
              <Check className="w-4 h-4 text-primary" />
            ) : (
              <Minus className="w-4 h-4 text-muted-foreground/40" />
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

function ReviewCard({ initials, name, quote }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-6">
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={14} className="fill-warning text-warning" />
        ))}
      </div>
      <p className="text-sm text-foreground leading-relaxed mb-4">"{quote}"</p>
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">
          {initials}
        </div>
        <span className="text-sm font-semibold text-foreground">{name}</span>
      </div>
    </div>
  );
}

function FaqItem({ q, a }) {
  return (
    <details className="group rounded-xl border border-border bg-card px-5 py-4">
      <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-semibold text-foreground">
        {q}
        <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{a}</p>
    </details>
  );
}
