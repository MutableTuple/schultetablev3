"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Swords } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FloatingDuelButton() {
  const pathname = usePathname();
  if (pathname?.startsWith("/duels")) return null;

  return (
    <Button
      render={<Link href="/duels" aria-label="Duels" />}
      nativeButton={false}
      variant="outline"
      size="icon"
      className="fixed bottom-5 right-4 z-50 h-11 w-11 rounded-full border-border bg-background shadow-lg active:scale-95 transition-transform"
    >
      <Swords className="h-5 w-5 text-primary" />
    </Button>
  );
}
