"use client";
import React, { useState, useEffect, useMemo } from "react";
import { HiOutlineRefresh } from "react-icons/hi";
import toast from "react-hot-toast";
import { supabase } from "@/app/_lib/supabase";

export default function UserImageAndUpload({ user }) {
  const [image, setImage] = useState("");
  const [avatarSeed, setAvatarSeed] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    const existingImage = user?.[0]?.image || "";
    if (existingImage) {
      setImage(existingImage);
    } else {
      const newSeed = Math.random().toString(36).substring(2, 10);
      setAvatarSeed(newSeed);
    }
  }, [user]);

  const avatarUrl = useMemo(
    () => `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`,
    [avatarSeed]
  );

  const handleRefreshAvatar = async () => {
    const newSeed = Math.random().toString(36).substring(2, 10);
    const newAvatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${newSeed}`;

    setIsImageLoading(true);
    setAvatarSeed(newSeed);
    setImage(newAvatarUrl);
    toast.success("New avatar generated!");

    const { error: updateError } = await supabase
      .from("User")
      .update({ image: newAvatarUrl })
      .eq("id", user?.[0]?.id);

    if (updateError) {
      toast.error("Failed to update avatar in DB");
      console.error(updateError.message);
    } else {
      toast.success("New avatar saved to profile!");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.split(".").pop();
    const filePath = `media/${user?.[0]?.id}_${Date.now()}.${fileExt}`;

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
    toast.success("Image uploaded successfully!");

    const { error: updateError } = await supabase
      .from("User")
      .update({ image: imageUrl })
      .eq("id", user?.[0]?.id);

    if (updateError) {
      toast.error("Failed to update user image in database");
      console.error(updateError.message);
    } else {
      toast.success("Image saved to profile!");
    }
  };
  if (!user || !user[0]) {
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
        />

        <button
          onClick={handleRefreshAvatar}
          className="absolute top-0 right-0 bg-white text-gray-700 rounded-full p-1 shadow hover:rotate-2 transition-transform duration-200 z-20 tooltip"
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
