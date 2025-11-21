"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RegisterUser } from "@/app/_lib/actions";
import { supabase } from "@/app/_lib/supabase"; // ← your supabase instance
import VerifyModal from "./VerifyModal";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export default function RegisterForm() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState({ success: null, message: "" });
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  // Live check for suggested username
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (fullName.trim().length > 0) {
        const { data, error } = await supabase.rpc("get_available_username", {
          p_name: fullName,
        });
        if (data) setUsername(data);
      }
    }, 400); // Debounce delay

    return () => clearTimeout(timeout);
  }, [fullName]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target);

    // ⛔ NEW: ensure passwords match
    if (formData.get("password") !== formData.get("confirm-password")) {
      setStatus({ success: false, message: "Passwords do not match." });
      setLoading(false);
      return;
    }

    // ⛔ NEW: ensure captcha was solved
    if (!captchaToken) {
      setStatus({ success: false, message: "Please verify you're human." });
      setLoading(false);
      return;
    }

    // ⛔ NEW: append captcha token
    formData.append("captchaToken", captchaToken);

    // existing line — keep it
    formData.append("suggestedUsername", username);

    const response = await RegisterUser(formData);

    if (response.error) {
      setStatus({ success: false, message: response.error });
    } else {
      setStatus({ success: true, message: response.message });
      setUserId(response.user.id);
      setShowModal(true);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="w-full max-w-md">
        <div className="card bg-base-100 border border-base-300 p-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            Create Your Account
          </h1>

          {status.message && (
            <div
              className={`alert alert-soft shadow-sm mb-4 ${
                status.success ? "alert-success" : "alert-error"
              }`}
            >
              <span>{status.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label htmlFor="name" className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                id="name"
                name="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="input input-bordered w-full"
                placeholder="Enter your full name"
              />
            </div>

            {/* Show suggested username */}
            {username && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username (suggested)</span>
                </label>
                <input
                  type="text"
                  value={username}
                  disabled
                  className="input input-bordered w-full bg-base-200"
                />
              </div>
            )}

            <div className="form-control">
              <label htmlFor="email" className="label">
                <span className="label-text">Email Address</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="input input-bordered w-full"
                placeholder="Enter your email"
              />
            </div>

            <div className="form-control">
              <label htmlFor="password" className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="input input-bordered w-full"
                placeholder="Create a password"
              />
            </div>

            <div className="form-control">
              <label htmlFor="confirm-password" className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                id="confirm-password"
                name="confirm-password"
                required
                className="input input-bordered w-full"
                placeholder="Confirm your password"
              />
            </div>
            <HCaptcha
              sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY}
              onVerify={(token) => setCaptchaToken(token)}
            />

            <input type="hidden" name="captchaToken" value={captchaToken} />
            <button
              type="submit"
              className="btn btn-primary w-full mt-4"
              disabled={loading}
            >
              {loading && (
                <span className="loading loading-spinner loading-sm mr-2"></span>
              )}
              Create Account
            </button>
          </form>

          <p className="text-sm text-center mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="link link-primary">
              Sign in
            </Link>
          </p>

          {userId && (
            <VerifyModal
              userId={userId}
              open={showModal}
              setOpen={setShowModal}
            />
          )}
        </div>
      </div>
    </div>
  );
}
