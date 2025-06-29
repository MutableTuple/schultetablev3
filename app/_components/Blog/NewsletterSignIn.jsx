import React from "react";

export default function NewsletterSignIn() {
  return (
    <div className="bg-base-50 p-6 rounded-lg border border-base-300">
      <h3 className="text-lg font-semibold mb-3 text-base-content">
        Stay Updated
      </h3>
      <p className="text-sm text-base-content/70 mb-4">
        Get weekly brain training tips delivered to your inbox.
      </p>
      <div className="space-y-3">
        <input
          type="email"
          placeholder="Your email"
          className="input input-bordered input-sm w-full"
        />
        <button className="btn btn-primary btn-sm w-full">Subscribe</button>
      </div>
    </div>
  );
}
