"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/app/_lib/supabase";
import toast, { Toaster } from "react-hot-toast";

// Map theme keys to prettier display names
const themeMap = {
  light: "Sunny Day",
  dark: "Midnight",
  cupcake: "Sweet Cupcake",
  bumblebee: "Bee Bright",
  emerald: "Green Gem",
  corporate: "Office Vibes",
  synthwave: "Retro Neon",
  retro: "Old School",
  cyberpunk: "Blade Mode",
  valentine: "Lover's Dream",
  halloween: "Spooky",
  garden: "Nature Bloom",
  forest: "Deep Forest",
  aqua: "Ocean Vibe",
  lofi: "Lo-Fi Chill",
  pastel: "Soft Tones",
  fantasy: "Magic Mist",
  wireframe: "Bare Bones",
  black: "Pitch Black",
  luxury: "Gold Luxe",
  dracula: "Vamp Vibe",
  cmyk: "Print Mode",
  autumn: "Fall Leaves",
  business: "CEO Style",
  acid: "Toxic Bright",
  lemonade: "Citrus Pop",
  night: "Night Owl",
  coffee: "Cafe Mood",
  winter: "Snowy Day",
  silk: "Silky Smooth",
};

export default function PersonalizationPage({ user }) {
  const [activeTheme, setActiveTheme] = useState("");
  const [loading, setLoading] = useState(true);
  const mostPopularTheme = "luxury"; // Change this to your most popular theme key
  // Fetch user theme from DB or fallback to localStorage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const { data, error } = await supabase
          .from("User")
          .select("selected_theme")
          .eq("id", user[0].id)
          .single();

        if (error) throw error;

        const savedTheme =
          data?.theme || localStorage.getItem("theme") || "light";
        setActiveTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
      } catch (err) {
        toast.error("Failed to load theme from database.");
        const fallback = localStorage.getItem("theme") || "light";
        setActiveTheme(fallback);
        document.documentElement.setAttribute("data-theme", fallback);
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, [user]);

  const handleThemeChange = async (theme) => {
    try {
      setActiveTheme(theme);
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);

      const { error } = await supabase
        .from("User")
        .update({ selected_theme: theme })
        .eq("id", user[0].id);

      if (error) throw error;

      toast.success(`Theme changed to ${themeMap[theme]}`);
    } catch (err) {
      toast.error("Failed to update theme.");
    }
  };

  if (loading) {
    return (
      <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton h-20 rounded-lg w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="">
      <h2 className="text-base mb-6"> Choose Your Theme</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.entries(themeMap).map(([key, name]) => (
          <div
            key={key}
            data-theme={key}
            className={`border-2 rounded-lg p-4 flex items-center justify-between transition-all duration-300 cursor-pointer ${
              activeTheme === key
                ? "border-warning scale-105"
                : "border-base-300"
            }`}
            onClick={() => handleThemeChange(key)}
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{name}</p>
                {key === mostPopularTheme && (
                  <span className="badge badge-warning badge-xs text-xs">
                    Most Popular
                  </span>
                )}
              </div>
              <p className="text-xs opacity-70 capitalize">{key}</p>
            </div>
            <input
              type="radio"
              name="theme"
              className="radio radio-warning"
              checked={activeTheme === key}
              readOnly
            />
          </div>
        ))}
      </div>
    </div>
  );
}
