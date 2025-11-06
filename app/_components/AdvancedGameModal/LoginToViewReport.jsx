import Link from "next/link";
import React from "react";
import { HiOutlineDocumentReport } from "react-icons/hi";

export default function LoginToViewReport() {
  return (
    <div className="p-6 bg-base-200/80 border border-base-300 rounded-2xl text-center backdrop-blur-sm">
      <div className="flex items-center justify-center mb-3">
        <HiOutlineDocumentReport className="w-14 h-14 text-primary/90" />
      </div>

      <h2 className="text-lg font-semibold text-base-content mb-1">
        Log in to View Your Report
      </h2>

      <p className="text-sm text-base-content/60 mb-4 leading-relaxed">
        Unlock your personalized cognitive performance insights & detailed
        analysis.
      </p>

      <Link href="/login">
        <button className="btn btn-primary btn-sm w-full rounded-lg shadow-sm hover:shadow-md transition-all">
          Sign In to View Report
        </button>
      </Link>

      <p className="text-[11px] text-base-content/50 mt-3">
        It only takes a few seconds.
      </p>
    </div>
  );
}
