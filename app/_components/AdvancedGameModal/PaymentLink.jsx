"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PaymentLink({ user }) {
  const [isIndia, setIsIndia] = useState(false);
  const userId = user?.[0]?.id;

  // Fetch region from API route
  useEffect(() => {
    const getRegion = async () => {
      try {
        const res = await fetch("/api/region");
        const data = await res.json();
        console.log("DATA", data);
        setIsIndia(data.isIndia);
      } catch (err) {
        console.log("Region detection failed, defaulting to global");
      }
    };

    getRegion();
  }, []);

  // Lemon Squeezy product URLs
  const INDIA_LIFETIME =
    "https://schultetable.lemonsqueezy.com/buy/1d34e5e2-5140-4a77-b8ce-72f5615aea97";

  const GLOBAL_LIFETIME =
    "https://schultetable.lemonsqueezy.com/buy/a7ae0450-6c1d-4aa1-92c0-dfce4e3edf6e";

  const selectedUrl = isIndia ? INDIA_LIFETIME : GLOBAL_LIFETIME;
  const displayPrice = isIndia
    ? "₹249 Lifetime Access"
    : "$4.99 Lifetime Access";

  return (
    <Link
      href={`${selectedUrl}?checkout[custom][user_id]=${userId}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <button
        className="btn btn-secondary w-full shadow-md hover:shadow-lg transition-all backdrop-blur-sm"
        onClick={() =>
          window.gtag?.("event", "click_unlock_full_report", {
            user_id: userId,
            region: isIndia ? "IN" : "GLOBAL",
          })
        }
      >
        Unlock Full Brain Report —{" "}
        <span className="font-bold">{displayPrice}</span> →
      </button>
    </Link>
  );
}
