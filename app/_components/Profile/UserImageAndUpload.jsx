"use client";
import React, { useState, useEffect, useMemo } from "react";
import { HiOutlineRefresh } from "react-icons/hi";
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
    return <div>Loading user...</div>;
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Profile Image</label>

      <div className="relative w-20 h-20 mb-2">
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-base-100 rounded-full z-10">
            <span className="loading loading-spinner text-warning"></span>
          </div>
        )}

        <img
          src={image || avatarUrl}
          alt="Avatar"
          className="w-full h-full object-cover rounded-full border shadow"
          onLoad={() => setIsImageLoading(false)}
          onError={() => setIsImageLoading(false)}
        />

        <button
          onClick={handleRefreshAvatar}
          disabled={cooldown}
          className={`absolute top-0 right-0 rounded-full p-1 shadow z-20 transition-transform duration-200 tooltip
          ${
            cooldown
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-white text-gray-700 hover:rotate-6"
          }`}
          data-tip="generate a random avatar"
          title="Refresh avatar"
        >
          <HiOutlineRefresh size={16} />
        </button>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="file-input file-input-bordered w-fit"
      />
    </div>
  );
}
