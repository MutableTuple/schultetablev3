"use client";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { logout } from "@/app/_lib/auth";
import { FiLogOut } from "react-icons/fi"; // Logout icon

export default function LogoutBtn() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out");
      router.refresh(); // or use router.push("/login")
    } catch (err) {
      // console.error("Logout failed:", err);
      toast.error("Something went wrong");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="btn btn-ghost text-error tooltip tooltip-bottom"
      data-tip="Logout"
    >
      <FiLogOut className="text-xl" />
    </button>
  );
}
