"use client";
import { useState } from "react";

export default function VerifyModal({ userId, open, setOpen }) {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("/api/verify-token", {
      method: "POST",
      body: JSON.stringify({ userId, token }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (result.success) {
      setStatus("✅ Email verified! Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 2000);
    } else {
      setStatus("❌ Invalid or expired token.");
    }
  }

  return (
    <>
      <input
        type="checkbox"
        id="verify-modal"
        className="modal-toggle"
        checked={open}
        onChange={() => setOpen(false)}
      />
      <div className="modal">
        <div className="modal-box space-y-4">
          <h3 className="font-bold text-lg">Verify your email</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              maxLength={6}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter 6-digit code"
              className="input input-bordered w-full"
              required
            />
            <button type="submit" className="btn btn-primary w-full">
              Verify
            </button>
          </form>
          {status && <p className="text-sm text-center">{status}</p>}
          <div className="modal-action">
            <label
              htmlFor="verify-modal"
              className="btn"
              onClick={() => setOpen(false)}
            >
              Close
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
