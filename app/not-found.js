"use client";
import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 text-center px-4">
      <h1 className="text-5xl font-bold text-error">404 - Page Not Found</h1>
      <p className="mt-4 text-lg text-base-content">
        Oops! The page you&apos;re looking for doesn’t exist.
      </p>
      <Link href="/">
        <button className="mt-6 btn btn-primary">Go Home</button>
      </Link>
    </div>
  );
}
