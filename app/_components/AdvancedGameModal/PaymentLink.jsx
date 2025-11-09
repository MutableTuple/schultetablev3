import Link from "next/link";
import React from "react";

export default function PaymentLink({ user, userId }) {
  return (
    <Link
      href={`https://schultetable.lemonsqueezy.com/buy/a7ae0450-6c1d-4aa1-92c0-dfce4e3edf6e?checkout[custom][user_id]=${user[0]?.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className=""
    >
      <button
        className="btn btn-secondary w-full shadow-md hover:shadow-lg transition-all backdrop-blur-sm"
        onClick={() =>
          window.gtag?.("event", "click_unlock_full_report", {
            user_id: userId,
            source: "cognitive_report",
          })
        }
      >
        Unlock Full Brain Report —{" "}
        <span className="font-bold">$4.99 Lifetime Access</span> →
      </button>
    </Link>
  );
}
