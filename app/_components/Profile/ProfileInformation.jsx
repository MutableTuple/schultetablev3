"use client";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import UserImageAndUpload from "./UserImageAndUpload";
import { supabase } from "@/app/_lib/supabase";
import Nationality from "./Nationality";

export default function ProfileInformation({ user }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [socialLink, setSocialLink] = useState("");
  const [bio, setBio] = useState("");
  const [nationality, setNationality] = useState("");
  const [countries, setCountries] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true); // <-- NEW

  useEffect(() => {
    // Simulate loading state
    if (user && user[0]) {
      setName(user[0].name);
      setEmail(user[0].email);
      setSocialLink(user[0].social_link);
      setBio(user[0].bio);
      setNationality(user[0].nationality);
    }

    fetch("https://restcountries.com/v3.1/all?fields=name")
      .then((res) => res.json())
      .then((data) => {
        const countryNames = data
          .map((country) => country.name.common)
          .sort((a, b) => a.localeCompare(b));
        setCountries(countryNames);
      })
      .catch(() => toast.error("Failed to load countries"))
      .finally(() => setLoading(false)); // <-- Set loading false
  }, []);

  const handleSave = async () => {
    setSaving(true);

    const { error } = await supabase
      .from("User")
      .update({
        name,
        social_link: socialLink,
        bio,
        nationality,
      })
      .eq("id", user[0].id);

    if (error) {
      toast.error("Failed to save profile");
      console.error(error);
    } else {
      toast.success("Profile updated successfully!");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-base-300 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-base-300 rounded"></div>
          ))}
          <div className="md:col-span-2 h-24 bg-base-300 rounded"></div>
        </div>
        <div className="mt-6 text-right">
          <div className="btn btn-warning px-6 opacity-50 pointer-events-none">
            Saving...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100">
      <UserImageAndUpload
        user={user}
        image={"https://api.dicebear.com/7.x/adventurer/svg?seed=abcd1234"}
      />
      <div className="divider opacity-25">User Information</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            className="input input-bordered w-full"
            value={email}
            disabled
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Social Link</label>
          <input
            className="input input-bordered w-full"
            value={socialLink}
            onChange={(e) => setSocialLink(e.target.value)}
            placeholder="https://twitter.com/yourhandle"
          />
        </div>

        <Nationality
          nationality={nationality}
          countries={countries}
          setNationality={setNationality}
        />

        <div className="md:col-span-2 md:w-1/2 w-full">
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            className="textarea textarea-bordered w-full"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 text-right">
        <button
          className="btn btn-warning px-6"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
