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

export default function PaymentLink({ user }) {
  const [isIndia, setIsIndia] = useState(null);
  const userId = user?.[0]?.id;

  useEffect(() => {
    const getRegion = async () => {
      try {
        const res = await fetch("/api/region");
        const data = await res.json();
        setIsIndia(data.isIndia);
      } catch {
        setIsIndia(false);
      }
    };
    getRegion();
  }, []);

  const INDIA_30 = "https://schultetable.lemonsqueezy.com/buy/470240d2-a5ee-4def-92c0-394c2ecf0579";
  const INDIA_LIFETIME = "https://schultetable.lemonsqueezy.com/buy/1d34e5e2-5140-4a77-b8ce-72f5615aea97";
  const GLOBAL_30 = "https://schultetable.lemonsqueezy.com/buy/a66627cf-a706-41aa-af08-5438b49b17e9";
  const GLOBAL_LIFETIME = "https://schultetable.lemonsqueezy.com/buy/a7ae0450-6c1d-4aa1-92c0-dfce4e3edf6e";

  if (isIndia === null) {
    return (
      <div className="flex flex-col gap-3 w-full">
        <div className="animate-pulse bg-base-200 h-36 rounded-xl" />
        <div className="animate-pulse bg-base-200 h-40 rounded-xl" />
      </div>
    );
  }

  const suffix = `?checkout[custom][user_id]=${userId}`;
  const url30 = (isIndia ? INDIA_30 : GLOBAL_30) + suffix;
  const urlLifetime = (isIndia ? INDIA_LIFETIME : GLOBAL_LIFETIME) + suffix;

  const price30 = isIndia ? "₹49" : "$0.99";
  const priceLifetime = isIndia ? "₹249" : "$4.99";
  const savingsNote = isIndia
    ? "Equivalent to ~5 months of the 30-day plan"
    : "Same price as ~5 months of the trial";

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* 30-day plan */}
      <div className="rounded-xl border border-base-300 bg-base-100 p-4">
        <p className="text-xs font-medium text-base-content/60 mb-1">Try Pro for 30 days</p>
        <p className="text-lg font-semibold text-base-content">
          {price30} <span className="text-sm font-normal text-base-content/50">· 30-day access</span>
        </p>
        <ul className="mt-3 mb-4 flex flex-col gap-1.5">
          {PERKS_30.map((perk) => (
            <li key={perk} className="flex items-center gap-2 text-xs text-base-content/70">
              <LuCheck className="w-3.5 h-3.5 text-success shrink-0" />
              {perk}
            </li>
          ))}
        </ul>
        <Link href={url30} target="_blank" rel="noopener noreferrer" className="block">
          <button className="btn btn-outline btn-sm w-full">
            Start 30-day access →
          </button>
        </Link>
      </div>

      {/* Lifetime plan */}
      <div className="rounded-xl border-2 border-primary bg-base-100 p-4">
        <span className="badge badge-primary badge-sm mb-2">Best value</span>
        <p className="text-xs font-medium text-base-content/60 mb-1">Unlock Pro forever</p>
        <p className="text-lg font-semibold text-base-content">
          {priceLifetime} <span className="text-sm font-normal text-base-content/50">· one-time</span>
        </p>
        <ul className="mt-3 mb-4 flex flex-col gap-1.5">
          {PERKS_LIFETIME.map((perk) => (
            <li key={perk} className="flex items-center gap-2 text-xs text-base-content/70">
              <LuCheck className="w-3.5 h-3.5 text-success shrink-0" />
              {perk}
            </li>
          ))}
        </ul>
        <Link href={urlLifetime} target="_blank" rel="noopener noreferrer" className="block">
          <button className="btn btn-primary btn-sm w-full">
            Get lifetime access →
          </button>
        </Link>
        <p className="text-[11px] text-center text-base-content/40 mt-2">{savingsNote}</p>
      </div>
    </div>
  );
}