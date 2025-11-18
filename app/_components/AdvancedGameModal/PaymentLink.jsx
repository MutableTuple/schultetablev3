"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PaymentLink({ user }) {
  const [isIndia, setIsIndia] = useState(null); // null = loading state
  const userId = user?.[0]?.id;

  // Fetch region
  useEffect(() => {
    const getRegion = async () => {
      try {
        const res = await fetch("/api/region");
        const data = await res.json();
        setIsIndia(data.isIndia);
      } catch (err) {
        console.log("Region detection failed");
        setIsIndia(false); // fallback to global
      }
    };

    getRegion();
  }, []);

  // Real LIVE product URLs
  const INDIA_30 =
    "https://schultetable.lemonsqueezy.com/buy/da963873-e5af-4eca-98d3-5372b43d2b94";
  const INDIA_LIFETIME =
    "https://schultetable.lemonsqueezy.com/buy/d73e877b-7b15-4813-b958-1fdd4bd07212";

  const GLOBAL_30 =
    "https://schultetable.lemonsqueezy.com/buy/6f0853e5-b4c8-4db3-a68c-8324a06f49d9";
  const GLOBAL_LIFETIME =
    "https://schultetable.lemonsqueezy.com/buy/f8eb6dde-bf7a-4f7e-912e-8b29fcc1490b";

  // If region not loaded yet → show loader
  if (isIndia === null) {
    return (
      <div className="flex flex-col gap-3 w-full">
        <div className="animate-pulse bg-base-300 h-12 rounded-xl"></div>
        <div className="animate-pulse bg-base-300 h-12 rounded-xl"></div>
      </div>
    );
  }

  // Pick correct plans based on region
  const selected30 =
    (isIndia ? INDIA_30 : GLOBAL_30) + `?checkout[custom][user_id]=${userId}`;

  const selectedLifetime =
    (isIndia ? INDIA_LIFETIME : GLOBAL_LIFETIME) +
    `?checkout[custom][user_id]=${userId}`;

  // Display Prices
  const price30 = isIndia ? "₹49 for 30 Days" : "$0.99 for 30 Days";
  const priceLifetime = isIndia ? "₹249 Lifetime" : "$4.99 Lifetime";

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* 30 Days Button */}
      <Link href={selected30} target="_blank" rel="noopener noreferrer">
        <button className="btn bg-transparent border-2 border-primary w-full shadow-md">
          Unlock Pro — <span className="font-bold">{price30}</span> →
        </button>
      </Link>

      {/* Lifetime Button */}
      <Link href={selectedLifetime} target="_blank" rel="noopener noreferrer">
        <button className="btn btn-primary w-full shadow-md">
          Unlock Pro Forever —{" "}
          <span className="font-bold">{priceLifetime}</span> →
        </button>
      </Link>
    </div>
  );
}
