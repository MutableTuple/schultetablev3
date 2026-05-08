"use client";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi"; // Logout icon
import { logout } from "@/app/_lib/logout";
import { logoutClient } from "@/app/_lib/logoutClient";

export default function LogoutBtn() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutClient(); // ✅ CLIENT logout

      toast.success("Logged out");

      router.push("/auth/login"); // ✅ redirect
      router.refresh();
    } catch (err) {
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
