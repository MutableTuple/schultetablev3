"use client";
import React, { useState, useEffect, useMemo } from "react";
import { HiOutlineRefresh } from "react-icons/hi";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/app/_lib/supabase";

export default function UserImageAndUpload({ user }) {
  const [image, setImage] = useState("");
  const [avatarSeed, setAvatarSeed] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  useEffect(() => {
    if (!user) return;

    const existingImage = user.image;

    if (existingImage) {
      setIsImageLoading(true);
      setImage(existingImage);
    } else {
      const newSeed = Math.random().toString(36).substring(2, 10);
      setIsImageLoading(true);
      setAvatarSeed(newSeed);
    }
  }, [user]);

  const avatarUrl = useMemo(
    () => `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`,
    [avatarSeed],
  );

  const updateUserImageInDB = async (imageUrl) => {
    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          image: imageUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error || "Failed to update image");
        return false;
      }

      return true;
    } catch (err) {
      toast.error("Server error while updating image");
      return false;
    }
  };

  const startCooldown = () => {
    setCooldown(true);
    setTimeout(() => {
      setCooldown(false);
    }, 5000);
  };

  const handleRefreshAvatar = async () => {
    if (cooldown) {
      toast.error("Please wait 5 seconds before generating another avatar.");
      return;
    }

    const newSeed = Math.random().toString(36).substring(2, 10);
    const newAvatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${newSeed}`;

    setIsImageLoading(true);
    setAvatarSeed(newSeed);
    setImage(newAvatarUrl);

    const success = await updateUserImageInDB(newAvatarUrl);

    if (success) {
      toast.success("New avatar saved to profile!");
      startCooldown();
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.split(".").pop();
    const filePath = `${user?.id}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      toast.error("Image upload failed");
      console.error(uploadError.message);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("media")
      .getPublicUrl(filePath);

    const imageUrl = publicUrlData.publicUrl;

    setIsImageLoading(true);
    setImage(imageUrl);

    const success = await updateUserImageInDB(imageUrl);

    if (success) {
      toast.success("Image uploaded and saved to profile!");
    }
  };

  if (!user) {
    return <div className="text-muted-foreground">Loading user...</div>;
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
      {/* Avatar */}
      <div className="relative">
        {isImageLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-full bg-background/80 backdrop-blur">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        )}

        <img
          src={image || avatarUrl}
          alt="Avatar"
          onLoad={() => setIsImageLoading(false)}
          onError={() => setIsImageLoading(false)}
          className="h-28 w-28 rounded-full border border-border object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1">
        <h3 className="text-2xl font-semibold text-foreground">
          {user.name || "Unnamed User"}
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Upload a custom profile picture or generate a random avatar.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <label className="inline-flex items-center gap-2 rounded-xl border border-input bg-background px-4 py-2 text-sm font-medium text-foreground cursor-pointer hover:bg-muted transition-colors">
            Upload Photo
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>

          <button
            onClick={handleRefreshAvatar}
            disabled={cooldown}
            className="inline-flex items-center gap-2 rounded-xl border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <HiOutlineRefresh />
            {cooldown ? "Please wait..." : "Random Avatar"}
          </button>
        </div>
      </div>
    </div>
  );
}
