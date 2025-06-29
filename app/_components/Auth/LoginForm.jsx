"use client";

import { Login } from "@/app/_lib/actions";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    const { user, session, error } = await Login(formData);

    setLoading(false);

    if (error) {
      setError(error);
      return;
    }

    setSuccess("Login successful! Redirecting...");
    setTimeout(() => {
      router.push("/");
    }, 1000);
  }

  return (
    <div className="min-h-screen flex pt-12 items-center justify-center p-4 bg-base-200 border border-base-300 ">
      <div className="w-full max-w-md">
        <div className="card bg-base-100  p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Welcome Back</h1>

          {error && (
            <div className="alert alert-error alert-soft mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>{" "}
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="alert alert-success alert-soft mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>{" "}
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text">Email Address</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="Enter your email"
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label" htmlFor="password">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                placeholder="Enter your password"
                className="input input-bordered w-full"
              />
            </div>
            <p className="text-xs text-blue-900 underline text-end">
              <Link href={"/forgot-password"}>forgot password?</Link>
            </p>
            <button
              type="submit"
              className="btn btn-soft btn-primary w-full mt-4"
              disabled={loading}
            >
              {loading && (
                <span className="loading loading-spinner loading-sm mr-2"></span>
              )}
              Sign In
            </button>
          </form>

          <p className="text-sm text-center mt-6">
            Don't have an account?{" "}
            <Link href="/auth/register" className="link link-primary">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
