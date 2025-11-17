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

  // INDIA TEST
  const INDIA_30_TEST =
    "https://schultetable.lemonsqueezy.com/buy/694744?test=1";
  const INDIA_LIFETIME_TEST =
    "https://schultetable.lemonsqueezy.com/buy/694745?test=1";

  // GLOBAL TEST
  const GLOBAL_30_TEST =
    "https://schultetable.lemonsqueezy.com/buy/694746?test=1";
  const GLOBAL_LIFETIME_TEST =
    "https://schultetable.lemonsqueezy.com/buy/560289?test=1";

  // Pick link by region
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
      <Link href={selected30} target="_blank">
        <button className="btn btn-secondary w-full shadow-md">
          Unlock Pro — <span className="font-bold">{price30}</span> →
        </button>
      </Link>

      <Link href={selectedLifetime} target="_blank">
        <button className="btn btn-primary w-full shadow-md">
          Unlock Pro Forever —{" "}
          <span className="font-bold">{priceLifetime}</span> →
        </button>
      </Link>
    </div>
  );
}
