"use client";

import { useEffect } from "react";
import { supabase } from "@/app/_lib/supbaseClient";

// Generate a random nonce and return both raw and hashed (base64) versions
async function generateNonce() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const rawNonce = btoa(String.fromCharCode(...array));

  const encoder = new TextEncoder();
  const data = encoder.encode(rawNonce);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashedNonce = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return { rawNonce, hashedNonce };
}

export default function GoogleOneTap() {
  useEffect(() => {
    const initOneTap = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) return;
      if (!window.google) return;

      const { rawNonce, hashedNonce } = await generateNonce();

      window.google.accounts.id.cancel();

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        use_fedcm_for_prompt: false,
        auto_select: false,
        nonce: hashedNonce, // 👈 hashed nonce goes to Google

        callback: async (response) => {
          const { credential } = response;

          const { error } = await supabase.auth.signInWithIdToken({
            provider: "google",
            token: credential,
            nonce: rawNonce, // 👈 raw nonce goes to Supabase
          });

          if (error) {
            console.error("One Tap error:", error);
          } else {
            window.location.href = "/";
          }
        },
      });

      window.google.accounts.id.prompt();
    };

    initOneTap();

    return () => {
      window.google?.accounts.id.cancel();
    };
  }, []);

  return null;
}
