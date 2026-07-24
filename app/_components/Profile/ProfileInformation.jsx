"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import UserImageAndUpload from "./UserImageAndUpload";
import Nationality from "./Nationality";

const COUNTRIES_CACHE_KEY = "schulte_countries_cache_v1";

function useCountries() {
  const [countries, setCountries] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const cached = localStorage.getItem(COUNTRIES_CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (countries.length) return;

    fetch("https://restcountries.com/v3.1/all?fields=name")
      .then((r) => r.json())
      .then((data) => {
        const sorted = data
          .map((c) => c.name.common)
          .sort((a, b) => a.localeCompare(b));
        setCountries(sorted);
        try {
          localStorage.setItem(COUNTRIES_CACHE_KEY, JSON.stringify(sorted));
        } catch {}
      })
      .catch(() => toast.error("Failed to load countries"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return countries;
}

export default function ProfileInformation({ user }) {
  const [name, setName] = useState(user.name ?? "");
  const [email] = useState(user.email ?? "");
  const [socialLink, setSocialLink] = useState(user.social_link ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [nationality, setNationality] = useState(user.nationality ?? "");
  const [saving, setSaving] = useState(false);
  const countries = useCountries();

  const handleSave = async () => {
    setSaving(true);

    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          name,
          socialLink,
          bio,
          nationality,
        }),
      });

      if (res.ok) {
        toast.success("Profile updated!");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch {
      toast.error("Something went wrong.");
    }

    setSaving(false);
  };

  const inputClass =
    "w-full h-11 rounded-2xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-ring disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-4 lg:p-8">
      {/* Avatar Card */}
      <section className="rounded-2xl border border-border  p-6">
        <UserImageAndUpload
          user={user}
          image={
            user.image ||
            "https://api.dicebear.com/7.x/adventurer/svg?seed=abcd1234"
          }
        />
      </section>

      {/* Information Card */}
      <section className="rounded-2xl border border-border ">
        <div className="border-b border-border px-6 py-5">
          <h2 className="text-xl font-semibold text-foreground">
            Personal Information
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Update the information visible on your public profile.
          </p>
        </div>

        <div className="p-6">
          <div className="grid gap-6 xl:grid-cols-2">
            {/* Display Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Display Name
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={inputClass}
              />
            </div>
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Email Address
              </label>

              <div className="relative">
                <input
                  value={email}
                  disabled
                  className={`${inputClass} pr-24`}
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                  Locked
                </span>
              </div>
            </div>
            {/* X / Twitter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                X (Twitter)
              </label>

              <div className="flex h-11 items-center overflow-hidden rounded-2xl border border-input bg-background">
                <span className="border-r border-input bg-muted px-4 text-sm text-muted-foreground">
                  x.com/
                </span>

                <input
                  value={socialLink}
                  onChange={(e) => setSocialLink(e.target.value)}
                  placeholder="yourhandle"
                  className="h-full flex-1 bg-transparent px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
            </div>
            {/* Nationality */}
            <div className="space-y-2">
              <Nationality
                nationality={nationality}
                countries={countries}
                setNationality={setNationality}
              />
            </div>
            {/* Bio */}
            <div className="space-y-2 xl:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Bio
                </label>

                <span className="text-xs text-muted-foreground/70">
                  {bio.length}/200
                </span>
              </div>

              <textarea
                rows={5}
                maxLength={200}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell people a little about yourself..."
                className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-ring"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Save Bar */}
      <div className="sticky bottom-0 z-30 -mx-4  /90 px-4 py-4 backdrop-blur lg:-mx-8 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-foreground">Ready to save?</p>

            <p className="text-sm text-muted-foreground">
              These changes will be reflected on your public profile.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 h-11 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60 disabled:pointer-events-none"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
