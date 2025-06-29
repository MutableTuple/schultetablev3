"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { IoChevronBackCircleSharp } from "react-icons/io5";
export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="btn rounded-full btn-sm flex items-center gap-2"
    >
      <IoChevronBackCircleSharp className="w-4 h-4" />
      Back
    </button>
  );
}
