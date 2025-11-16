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

  // 🌐 TEST MODE CHECKOUT URLS (CORRECTED)
  const INDIA_LIFETIME_TEST =
    "https://schultetable.lemonsqueezy.com/buy/d73e877b-7b15-4813-b958-1fdd4bd07212?test=1";

  const GLOBAL_LIFETIME_TEST =
    "https://schultetable.lemonsqueezy.com/buy/f8eb6dde-bf7a-4f7e-912e-8b29fcc1490b?test=1";

  // Select correct URL
  const selectedUrl = isIndia ? INDIA_LIFETIME_TEST : GLOBAL_LIFETIME_TEST;

  const displayPrice = isIndia
    ? "₹249 Lifetime Access (TEST)"
    : "$4.99 Lifetime Access (TEST)";

  return (
    <Link
      href={`${selectedUrl}&checkout[custom][user_id]=${userId}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <button className="btn btn-secondary w-full shadow-md">
        Unlock Full Brain Report —{" "}
        <span className="font-bold">{displayPrice}</span> →
      </button>
    </Link>
  );
}
