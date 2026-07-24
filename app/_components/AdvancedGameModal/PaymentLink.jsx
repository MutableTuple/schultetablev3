"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LuCheck } from "react-icons/lu";

const PERKS_30 = [
  "See exactly which numbers slow you down",
  "Your personal improvement map",
  "Full cognitive breakdown after every session",
];

const PERKS_LIFETIME = [
  "Everything in 30 days, permanently",
  "Track your progress over months",
  "All future updates included",
];

function BuyLink({ href, className, children }) {
  const isExternal = href.startsWith("http");
  return isExternal ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function PaymentLink({ user, userId: userIdProp }) {
  const [isIndia, setIsIndia] = useState(null);
  const userId = userIdProp ?? user?.id;
  const isLoggedIn = Boolean(userId);

  useEffect(() => {
    let cancelled = false;
    const getRegion = async () => {
      try {
        const res = await fetch("/api/region");
        const data = await res.json();
        if (!cancelled) setIsIndia(Boolean(data.isIndia));
      } catch {
        if (!cancelled) setIsIndia(false);
      }
    };
    getRegion();
    return () => {
      cancelled = true;
    };
  }, []);

  const INDIA_30 =
    "https://schultetable.lemonsqueezy.com/buy/470240d2-a5ee-4def-92c0-394c2ecf0579";
  const INDIA_LIFETIME =
    "https://schultetable.lemonsqueezy.com/buy/1d34e5e2-5140-4a77-b8ce-72f5615aea97";
  const GLOBAL_30 =
    "https://schultetable.lemonsqueezy.com/buy/a66627cf-a706-41aa-af08-5438b49b17e9";
  const GLOBAL_LIFETIME =
    "https://schultetable.lemonsqueezy.com/buy/a7ae0450-6c1d-4aa1-92c0-dfce4e3edf6e";

  if (isIndia === null) {
    return (
      <div className="flex flex-col gap-3 w-full">
        <div className="animate-pulse bg-muted h-36 rounded-xl" />
        <div className="animate-pulse bg-muted h-40 rounded-xl" />
      </div>
    );
  }

  const buildCheckoutUrl = (baseUrl) => {
    if (!isLoggedIn) return "/auth/login";
    return baseUrl.includes("?")
      ? `${baseUrl}&checkout[custom][user_id]=${userId}`
      : `${baseUrl}?checkout[custom][user_id]=${userId}`;
  };

  const url30 = buildCheckoutUrl(isIndia ? INDIA_30 : GLOBAL_30);
  const urlLifetime = buildCheckoutUrl(
    isIndia ? INDIA_LIFETIME : GLOBAL_LIFETIME,
  );

  const price30 = isIndia ? "₹49" : "$0.99";
  const priceLifetime = isIndia ? "₹249" : "$4.99";
  const savingsNote = isIndia
    ? "Equivalent to ~5 months of the 30-day plan"
    : "Same price as ~5 months of the trial";

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* 30-day plan */}
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs font-medium text-muted-foreground mb-1">
          Try Pro for 30 days
        </p>
        <p className="text-lg font-semibold text-foreground">
          {price30}{" "}
          <span className="text-sm font-normal text-muted-foreground">
            · 30-day access
          </span>
        </p>
        <ul className="mt-3 mb-4 flex flex-col gap-1.5">
          {PERKS_30.map((perk) => (
            <li
              key={perk}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <LuCheck className="w-3.5 h-3.5 text-success shrink-0" />
              {perk}
            </li>
          ))}
        </ul>
        <BuyLink
          href={url30}
          className="flex items-center justify-center w-full rounded-lg border border-border text-foreground text-sm font-semibold py-2 hover:bg-muted transition-colors"
        >
          Start 30-day access →
        </BuyLink>
      </div>

      {/* Lifetime plan */}
      <div className="rounded-xl border-2 border-primary bg-card p-4">
        <span className="inline-block rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 mb-2">
          Best value
        </span>
        <p className="text-xs font-medium text-muted-foreground mb-1">
          Unlock Pro forever
        </p>
        <p className="text-lg font-semibold text-foreground">
          {priceLifetime}{" "}
          <span className="text-sm font-normal text-muted-foreground">
            · one-time
          </span>
        </p>
        <ul className="mt-3 mb-4 flex flex-col gap-1.5">
          {PERKS_LIFETIME.map((perk) => (
            <li
              key={perk}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <LuCheck className="w-3.5 h-3.5 text-success shrink-0" />
              {perk}
            </li>
          ))}
        </ul>
        <BuyLink
          href={urlLifetime}
          className="flex items-center justify-center w-full rounded-lg bg-primary text-primary-foreground text-sm font-semibold py-2 hover:bg-primary/90 transition-colors"
        >
          Get lifetime access →
        </BuyLink>
        <p className="text-[11px] text-center text-muted-foreground/70 mt-2">
          {savingsNote}
        </p>
      </div>
    </div>
  );
}
