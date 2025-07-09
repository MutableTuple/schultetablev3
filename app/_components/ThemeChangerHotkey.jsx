"use client";
import React, { useEffect } from "react";
import { supabase } from "@/app/_lib/supabase";
import toast from "react-hot-toast";

// Theme mapping for hotkeys 1-5
const themeHotkeyMap = {
  1: "light", // Key "1"
  2: "dark", // Key "2"
  3: "luxury", // Key "3"
  4: "synthwave", // Key "4"
  5: "pastel", // Key "5"
};

// Display name mapping
const themeMap = {
  light: "Sunny Day",
  dark: "Midnight",
  luxury: "Gold Luxe",
  synthwave: "Retro Neon",
  pastel: "Soft Tones",
};

export default function ThemeChangerHotkey({ user }) {
  useEffect(() => {
    const handleKeyPress = async (e) => {
      const key = e.key;
      if (!themeHotkeyMap[key]) return;

      const selectedTheme = themeHotkeyMap[key];

      try {
        // Update theme on DOM
        document.documentElement.setAttribute("data-theme", selectedTheme);

        // Update localStorage
        localStorage.setItem("theme", selectedTheme);

        // Update in Supabase
        const { error } = await supabase
          .from("User")
          .update({ selected_theme: selectedTheme })
          .eq("id", user[0].id);

        if (error) throw error;

        toast.success(`Theme changed to ${themeMap[selectedTheme]}`);
      } catch (err) {
        toast.error("Failed to update theme.");
      }
    };

    // Attach global listener
    window.addEventListener("keydown", handleKeyPress);

    // Clean up on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [user]);

  return null;
}
