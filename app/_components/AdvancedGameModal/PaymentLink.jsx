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
    "https://schultetable.lemonsqueezy.com/buy/470240d2-a5ee-4def-92c0-394c2ecf0579";
  const INDIA_LIFETIME =
    "https://schultetable.lemonsqueezy.com/buy/1d34e5e2-5140-4a77-b8ce-72f5615aea97";

  const GLOBAL_30 =
    "https://schultetable.lemonsqueezy.com/buy/a66627cf-a706-41aa-af08-5438b49b17e9";
  const GLOBAL_LIFETIME =
    "https://schultetable.lemonsqueezy.com/buy/a7ae0450-6c1d-4aa1-92c0-dfce4e3edf6e";

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
