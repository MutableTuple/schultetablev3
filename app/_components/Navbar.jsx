"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import LogoutBtn from "./Auth/LogoutBtn";
import { getCurrentUser } from "../_utils/getCurrentUser";
import {
  LayoutGrid,
  User,
  Info,
  HelpCircle,
  BookOpen,
  MessageCircleQuestion,
  LogIn,
  Menu,
  X,
  Zap,
  Sun,
  Moon,
  Swords,
} from "lucide-react";

const navLinks = [
  { label: "Play Now", href: "/", icon: Zap, highlight: true },
  { label: "Duels", href: "/duels", icon: Swords },
  { label: "My Profile", href: "/my-profile", icon: User },
  { label: "About", href: "/about", icon: Info },
  {
    label: "How to Play",
    href: "/how-to-play-schulte-table",
    icon: HelpCircle,
  },
  { label: "Blogs", href: "/blogs", icon: BookOpen },
  { label: "FAQ", href: "/faq", icon: MessageCircleQuestion },
];

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    getCurrentUser().then((res) => setCurrentUser(res.user));
  }, []);

  // close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <img
              src="https://hflzumrbjzkzofgzeyao.supabase.co/storage/v1/object/public/media//Logo.png"
              alt="SchulteTable"
              className="h-8 w-8 rounded-lg"
            />
            <span className="text-[15px] font-bold text-foreground tracking-tight hidden sm:block">
              SchulteTable
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ label, href, icon: Icon, highlight }) =>
              highlight ? (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-foreground text-background text-sm font-semibold hover:bg-foreground/85 transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              ) : (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              ),
            )}
          </nav>

          {/* ── Right side ── */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <LogoutBtn />
            ) : (
              <Link
                href="/auth/login"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted hover:border-foreground/30 transition-all"
              >
                <LogIn className="w-4 h-4" />
                Sign in
              </Link>
            )}

            <ThemeToggle />

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile dropdown ── */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-card px-4 py-3 space-y-1">
            {navLinks.map(({ label, href, icon: Icon, highlight }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors
                  ${
                    highlight
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            ))}

            {!currentUser && (
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Sign in
              </Link>
            )}

            {currentUser && (
              <div className="pt-1 border-t border-border mt-1">
                <LogoutBtn />
              </div>
            )}
          </div>
        )}
      </header>

      {/* spacer so content doesn't hide behind fixed navbar */}
      <div className="h-16" />
    </>
  );
}
