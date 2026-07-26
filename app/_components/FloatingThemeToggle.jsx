"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FloatingThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // next-themes doesn't know the real theme until after hydration —
  // render a neutral placeholder first to avoid a light/dark flash mismatch.
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        aria-hidden
        className="fixed bottom-5 left-4 z-50 h-11 w-11 rounded-full border border-border bg-background shadow-lg animate-pulse"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      variant="outline"
      size="icon"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed bottom-5 left-4 z-50 h-11 w-11 rounded-full border-border bg-background shadow-lg overflow-hidden
        hover:border-primary/50 hover:shadow-primary/20 active:scale-90 transition-all"
    >
      <span className="relative flex items-center justify-center w-full h-full">
        <Sun
          className={`absolute h-5 w-5 text-amber-500 transition-all duration-300 ${
            isDark
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 rotate-90 scale-50"
          }`}
        />
        <Moon
          className={`absolute h-5 w-5 text-indigo-400 transition-all duration-300 ${
            isDark
              ? "opacity-0 -rotate-90 scale-50"
              : "opacity-100 rotate-0 scale-100"
          }`}
        />
      </span>
    </Button>
  );
}
