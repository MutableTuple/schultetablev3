import React from "react";

export default function ProUpgradeModal({ onClose }) {
  return (
    <div className="modal modal-open">
      <div className="modal-box bg-base-100">
        <h3 className="font-bold text-lg">🚀 Unlock Pro Mode!</h3>
        <p className="py-2">
          You’ve completed a bunch of games. Upgrade to Pro for advanced stats,
          training modes, and more!
        </p>
        <div className="modal-action">
          <button onClick={onClose} className="btn btn-ghost">
            Maybe Later
          </button>
          <a
            href="https://store.lemonsqueezy.com/checkout/YOUR_PRODUCT_ID"
            className="btn btn-primary"
            target="_blank"
          >
            Go Pro
          </a>
        </div>
      </div>
    </div>
  );
}
