"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PaymentLink({ user }) {
  const [isIndia, setIsIndia] = useState(false);
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
      }
    };

    getRegion();
  }, []);

  // 🌐 TEST MODE CHECKOUT URLS (ALL 4 PRODUCTS)
  // INDIA
  const INDIA_30_TEST =
    "https://schultetable.lemonsqueezy.com/buy/da963873-e5af-4eca-98d3-5372b43d2b94?test=1";

  const INDIA_LIFETIME_TEST =
    "https://schultetable.lemonsqueezy.com/buy/d73e877b-7b15-4813-b958-1fdd4bd07212?test=1";

  // GLOBAL
  const GLOBAL_30_TEST =
    "https://schultetable.lemonsqueezy.com/buy/6f0853e5-b4c8-4db3-a68c-8324a06f49d9?test=1";

  const GLOBAL_LIFETIME_TEST =
    "https://schultetable.lemonsqueezy.com/buy/f8eb6dde-bf7a-4f7e-912e-8b29fcc1490b?test=1";

  // Pick correct plans based on region
  const selected30 =
    (isIndia ? INDIA_30_TEST : GLOBAL_30_TEST) +
    `&checkout[custom][user_id]=${userId}`;

  const selectedLifetime =
    (isIndia ? INDIA_LIFETIME_TEST : GLOBAL_LIFETIME_TEST) +
    `&checkout[custom][user_id]=${userId}`;

  // Display Prices
  const price30 = isIndia
    ? "₹49 for 30 Days (TEST)"
    : "$0.99 for 30 Days (TEST)";
  const priceLifetime = isIndia
    ? "₹249 Lifetime (TEST)"
    : "$4.99 Lifetime (TEST)";

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* 30 Days Button */}
      <Link href={selected30} target="_blank" rel="noopener noreferrer">
        <button className="btn btn-secondary w-full shadow-md">
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
