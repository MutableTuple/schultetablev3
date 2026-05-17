"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GoogleButton from "../Button/GoogleButton";
import { supabase } from "@/app/_lib/supbaseClient";
import Image from "next/image";

export default function LoginForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    const { data: session } = await supabase.auth.getSession();
    // console.log("CLIENT SESSION:", session);

    setSuccess("Login successful!");
    await new Promise((r) => setTimeout(r, 100));
    router.replace("/my-profile");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-10 sm:py-12">
      <div className="w-full max-w-[22rem] sm:max-w-sm">
        <div className="card bg-base-100 border border-base-300 shadow-xl p-6 sm:p-8 md:p-10">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6 sm:mb-7">
            <Image
              src="/icons/icon-512.png"
              alt="SchulteTable.com"
              width={36}
              height={36}
              className="sm:w-10 sm:h-10"
            />
            <span
              className="text-base sm:text-[17px] font-bold tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              SchulteTable
            </span>
          </div>

          <div className="text-center mb-6 sm:mb-7">
            <h1
              className="text-xl sm:text-2xl font-bold tracking-tight mb-1"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm text-base-content/50">
              Sign in to continue your training
            </p>
          </div>

          {error && (
            <div className="alert alert-error alert-soft mb-4 sm:mb-5 text-xs sm:text-sm py-2.5 sm:py-3">
              <svg
                className="h-4 w-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <circle cx="12" cy="16" r="0.5" fill="currentColor" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success alert-soft mb-4 sm:mb-5 text-xs sm:text-sm py-2.5 sm:py-3">
              <svg
                className="h-4 w-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="form-control">
              <label className="label pb-1.5" htmlFor="email">
                <span className="label-text text-[10px] sm:text-xs font-medium tracking-widest uppercase text-base-content/40">
                  Email address
                </span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="you@example.com"
                className="input input-bordered w-full bg-base-200 focus:bg-base-100 transition-colors text-sm"
              />
            </div>

            <div className="form-control">
              <label className="label pb-1.5" htmlFor="password">
                <span className="label-text text-[10px] sm:text-xs font-medium tracking-widest uppercase text-base-content/40">
                  Password
                </span>
                <Link
                  href="/forgot-password"
                  className="label-text-alt text-xs text-base-content/40 hover:text-base-content transition-colors"
                >
                  Forgot password?
                </Link>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                placeholder="••••••••"
                className="input input-bordered w-full bg-base-200 focus:bg-base-100 transition-colors text-sm"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-2"
              disabled={loading}
            >
              {loading && (
                <span className="loading loading-spinner loading-sm" />
              )}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="divider text-xs text-base-content/30 my-4 sm:my-5">
            or continue with
          </div>

          <GoogleButton />

          <p className="text-center text-xs sm:text-sm text-base-content/50 mt-5 sm:mt-6">
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-base-content hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
