import Link from "next/link";
import React from "react";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { Button } from "@/components/ui/button";

export default function LoginToViewReport() {
  return (
    <div className="p-6 bg-muted/80 border border-border rounded-2xl text-center backdrop-blur-sm">
      <div className="flex items-center justify-center mb-3">
        <HiOutlineDocumentReport className="w-14 h-14 text-primary/90" />
      </div>

      <h2 className="text-lg font-semibold text-foreground mb-1">
        Log in to View Your Report
      </h2>

      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        Unlock your personalized cognitive performance insights & detailed
        analysis.
      </p>

      <Button
        render={<Link href="/login" />}
        size="sm"
        className="w-full rounded-lg shadow-sm hover:shadow-md transition-all"
      >
        Sign In to View Report
      </Button>

      <p className="text-[11px] text-muted-foreground/70 mt-3">
        It only takes a few seconds.
      </p>
    </div>
  );
}
