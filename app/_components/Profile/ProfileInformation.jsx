"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UserImageAndUpload from "./UserImageAndUpload";
import Nationality from "./Nationality";

export default function ProfileInformation({ user }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [socialLink, setSocialLink] = useState("");
  const [bio, setBio] = useState("");
  const [nationality, setNationality] = useState("");
  const [countries, setCountries] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setName(user.name ?? "");
    setEmail(user.email ?? "");
    setSocialLink(user.social_link ?? "");
    setBio(user.bio ?? "");
    setNationality(user.nationality ?? "");

    fetch("https://restcountries.com/v3.1/all?fields=name")
      .then((r) => r.json())
      .then((data) =>
        setCountries(
          data.map((c) => c.name.common).sort((a, b) => a.localeCompare(b)),
        ),
      )
      .catch(() => toast.error("Failed to load countries"))
      .finally(() => setLoading(false));
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          name,
          socialLink,
          bio,
          nationality,
        }),
      });
      res.ok
        ? toast.success("Profile updated!")
        : toast.error("Failed to save profile");
    } catch {
      toast.error("Something went wrong");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-4 rounded-2xl ">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-base-200" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-32 bg-base-200 rounded-lg" />
            <div className="h-3 w-48 bg-base-200 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-base-200 rounded-xl" />
          ))}
          <div className="md:col-span-2 h-28 bg-base-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 sm:rounded-2xl rounded-none  ">
      {/* ── Avatar section ── */}
      <UserImageAndUpload
        user={user}
        image={
          user.image ||
          "https://api.dicebear.com/7.x/adventurer/svg?seed=abcd1234"
        }
      />

      {/* ── Section divider ── */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-base-300" />
        <span className="text-xs font-semibold text-base-content/30 uppercase tracking-widest">
          User Information
        </span>
        <div className="flex-1 h-px bg-base-300" />
      </div>

      {/* ── Form grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-base-content/40 uppercase tracking-wider">
            Display Name
          </label>
          <input
            className="input bg-base-200 border-base-300 rounded-xl focus:outline-none focus:border-base-content/20 w-full transition-colors"
            value={name}
            placeholder="Your name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-base-content/40 uppercase tracking-wider">
            Email
          </label>
          <div className="relative">
            <input
              className="input bg-base-200 border-base-300 rounded-xl w-full opacity-50 cursor-not-allowed pr-20"
              value={email}
              disabled
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 badge badge-xs bg-base-300 border-0 text-base-content/40 font-medium">
              locked
            </span>
          </div>
        </div>

        {/* X / Twitter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-base-content/40 uppercase tracking-wider">
            X (Twitter)
          </label>
          <div className="flex items-center bg-base-200 border border-base-300 rounded-xl overflow-hidden focus-within:border-base-content/20 transition-colors">
            <span className="px-3 text-sm text-base-content/30 font-medium select-none border-r border-base-300 h-full flex items-center py-3">
              x.com/
            </span>
            <input
              value={socialLink}
              type="text"
              className="flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-base-content/25"
              placeholder="yourhandle"
              onChange={(e) => setSocialLink(e.target.value)}
            />
          </div>
        </div>

        {/* Nationality */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-base-content/40 uppercase tracking-wider">
            Nationality
          </label>
          <Nationality
            nationality={nationality}
            countries={countries}
            setNationality={setNationality}
          />
        </div>

        {/* Bio */}
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-base-content/40 uppercase tracking-wider">
              Bio
            </label>
            <span className="text-xs text-base-content/25 tabular-nums">
              {bio.length}/200
            </span>
          </div>
          <textarea
            className="textarea bg-base-200 border-base-300 rounded-xl focus:outline-none focus:border-base-content/20 w-full md:w-1/2 resize-none transition-colors"
            rows={4}
            maxLength={200}
            placeholder="Tell people a little about yourself…"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
      </div>

      {/* ── Save bar ── */}
      <div className="flex items-center justify-between pt-4 border-t border-base-300">
        <p className="text-xs text-base-content/30">
          Changes are saved to your public profile
        </p>
        <button
          className="btn btn-primary rounded-xl px-6 font-semibold shadow-lg shadow-primary/20 transition-all duration-150 disabled:opacity-50"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <span className="loading loading-spinner loading-xs" />
              Saving…
            </span>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
}
