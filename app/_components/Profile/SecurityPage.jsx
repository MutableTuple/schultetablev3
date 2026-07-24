"use client";
import React, { useState } from "react";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { supabase } from "@/app/_lib/supabase";
import toast, { Toaster } from "react-hot-toast";
import { getSession } from "@/app/_lib/auth";

function PasswordInput({
  label,
  value,
  onChange,
  show,
  onToggle,
  name,
  autoComplete,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2.5 pr-11 text-sm text-foreground bg-background border border-border rounded-xl outline-none focus:border-primary focus:ring-0 transition-colors placeholder:text-muted-foreground/50"
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

export default function SecurityPage() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const session = await getSession();
      const user = session?.user?.value ? JSON.parse(session.user.value) : null;
      const email = user?.email || user?.identities?.[0]?.email;

      if (!email) {
        toast.error("Could not fetch user email");
        return;
      }

      const { error: loginError } = await supabase.auth.signInWithPassword({
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
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="p-4 sm:p-6 space-y-4 max-w-2xl">
        {/* ── Card ── */}
        <div className="bg-card border border-border rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
              <Lock className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Change Password
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Update your account password below.
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            autoComplete="off"
            onSubmit={(e) => e.preventDefault()}
            className="px-6 py-6 space-y-4"
          >
            <PasswordInput
              label="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              show={showCurrent}
              onToggle={() => setShowCurrent((v) => !v)}
              name="current_password"
              autoComplete="current-password"
            />
            <PasswordInput
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              show={showNew}
              onToggle={() => setShowNew((v) => !v)}
              name="new_password"
              autoComplete="new-password"
            />
            <PasswordInput
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              show={showConfirm}
              onToggle={() => setShowConfirm((v) => !v)}
              name="confirm_password"
              autoComplete="new-password"
            />
          </form>
        </div>

        {/* ── Save footer ── */}
        <div className="bg-card border border-border rounded-3xl px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Ready to save?
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Make sure your new password is at least 6 characters.
            </p>
          </div>
          <button
            type="button"
            onClick={handleUpdatePassword}
            disabled={
              loading || !currentPassword || !newPassword || !confirmPassword
            }
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold hover:bg-foreground/85 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            <ShieldCheck className="w-4 h-4" />
            {loading ? "Updating…" : "Update Password"}
          </button>
        </div>
      </div>
    </>
  );
}
