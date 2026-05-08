"use client";

import { useEffect } from "react";
import { supabase } from "@/app/_lib/supbaseClient";

export default function GoogleOneTap() {
  useEffect(() => {
    const init = async () => {
      // ✅ 1. Don't show if already logged in
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) return;

      // ✅ 2. Ensure Google script loaded
      if (!window.google) return;

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,

        callback: async (response) => {
          const { credential } = response;

          // 🔥 FIX: nonce mismatch issue
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: "google",
            token: credential,
            nonce: undefined, // ✅ CRITICAL FIX
          });

          if (error) {
            console.error("One Tap error:", error);
          } else {
            // ✅ better than redirect → keeps app state clean
            window.location.reload();
          }
        },
      });

      // ✅ optional: small delay (better UX)
      setTimeout(() => {
        window.google.accounts.id.prompt();
      }, 1000);
    };

    init();
  }, []);

  return null;
}
