import React from "react";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotLoggedInProfile() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background px-4 text-center">
      <div className="flex flex-col items-center gap-5 max-w-sm">
        <span className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
          <LogIn className="w-6 h-6 text-muted-foreground" />
        </span>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            You&apos;re not logged in
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Please log in to view your profile.
          </p>
        </div>
        <Button render={<Link href="/auth/login" />}>Go to Login</Button>
      </div>
    </div>
  );
}
