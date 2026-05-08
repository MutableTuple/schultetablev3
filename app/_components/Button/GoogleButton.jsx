"use client";

import { supabase } from "@/app/_lib/supbaseClient";

export default function GoogleButton() {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
        flowType: "pkce",
      },
    });

    if (error) console.error(error);
  };

  return (
    <button
      onClick={handleLogin}
      className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-medium px-5 py-3 rounded-xl border border-gray-300 shadow-sm transition-all duration-200 active:scale-[0.98]"
    >
      {/* Google Logo */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        className="w-5 h-5"
      >
        <path
          fill="#FFC107"
          d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
        />
        <path
          fill="#FF3D00"
          d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"
        />
        <path
          fill="#4CAF50"
          d="M24 44c5.2 0 10-2 13.5-5.3l-6.2-5.1C29.3 36 26.8 37 24 37c-5.2 0-9.6-3.3-11.2-7.9l-6.5 5C9.7 39.6 16.3 44 24 44z"
        />
        <path
          fill="#1976D2"
          d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.3 5.4-6 6.9l6.2 5.1C39.2 36.4 44 31 44 24c0-1.3-.1-2.3-.4-3.5z"
        />
      </svg>

      <span>Continue with Google</span>
    </button>
  );
}