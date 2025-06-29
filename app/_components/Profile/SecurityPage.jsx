"use client";
import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { supabase } from "@/app/_lib/supabase";
import toast, { Toaster } from "react-hot-toast";
import { getSession } from "@/app/_lib/auth";

export default function SecurityPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const session = await getSession();
      const user = session?.user?.value ? JSON.parse(session.user.value) : null;
      const email = user?.email || user?.identities?.[0]?.email;

      if (!email) {
        toast.error("Could not fetch user email");
        return;
      }

      const { data: signInData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password: currentPassword,
        });

      if (loginError) {
        toast.error("Incorrect current password");
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        toast.error(updateError.message);
      } else {
        toast.success("Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <div className="">
        <div className=" bg-base-100 ">
          <div className="">
            <h3 className="text-sm mb-6">Change Password</h3>
            {/* Form wrapper to disable browser autofill */}
            <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Current Password
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="current_pass_custom"
                      autoComplete="new-password"
                      className="input input-bordered pr-12"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div className="form-control flex flex-col">
                  <label className="label">
                    <span className="label-text font-medium">New Password</span>
                  </label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    className="input input-bordered"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="form-control flex flex-col">
                  <label className="label">
                    <span className="label-text font-medium">
                      Confirm New Password
                    </span>
                  </label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    className="input input-bordered"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <button
                  className="btn btn-primary btn-soft"
                  type="button"
                  onClick={handleUpdatePassword}
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
