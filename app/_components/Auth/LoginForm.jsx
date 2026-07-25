"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import GoogleButton from "../Button/GoogleButton";
import { supabase } from "@/app/_lib/supbaseClient";

export default function LoginForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

    setSuccess("Login successful!");
    await new Promise((r) => setTimeout(r, 100));
    router.replace("/my-profile");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4 py-10 sm:py-12">
      <div className="w-full max-w-[22rem] sm:max-w-sm">
        <div className="rounded-2xl bg-card border border-border shadow-xl p-6 sm:p-8 md:p-10">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6 sm:mb-7">
            <Image
              src="/icons/icon-512.png"
              alt="SchulteTable.com"
              width={36}
              height={36}
              className="sm:w-10 sm:h-10"
            />
            <span className="text-base sm:text-[17px] font-bold tracking-tight text-foreground">
              SchulteTable
            </span>
          </div>

          <div className="text-center mb-6 sm:mb-7">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-1 text-foreground">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Sign in to continue your training
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-xs sm:text-sm text-destructive mb-4 sm:mb-5">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-xl border border-success/20 bg-success/10 px-3 py-2.5 text-xs sm:text-sm text-success mb-4 sm:mb-5">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block pb-1.5 text-[10px] sm:text-xs font-medium tracking-widest uppercase text-muted-foreground"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2.5 text-sm text-foreground bg-background border border-border rounded-xl outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between pb-1.5">
                <label
                  htmlFor="password"
                  className="text-[10px] sm:text-xs font-medium tracking-widest uppercase text-muted-foreground"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pl-9 pr-11 py-2.5 text-sm text-foreground bg-background border border-border rounded-xl outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold py-2.5 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4 sm:my-5">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">
              or continue with
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <GoogleButton />

          <p className="text-center text-xs sm:text-sm text-muted-foreground mt-5 sm:mt-6">
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-foreground hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
