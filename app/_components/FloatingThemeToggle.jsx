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
      <Button
        variant="outline"
        size="icon"
        aria-hidden
        className="fixed bottom-5 left-4 z-50 h-11 w-11 rounded-full border-border bg-background shadow-lg"
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
      className="fixed bottom-5 left-4 z-50 h-11 w-11 rounded-full border-border bg-background shadow-lg active:scale-95 transition-transform"
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-accent" />
      ) : (
        <Moon className="h-5 w-5 text-secondary" />
      )}
    </Button>
  );
}
