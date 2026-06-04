"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/_lib/supbaseClient";

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
  const router = useRouter();
  const mountedRef = useRef(true);
  const retryRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;

    const initOneTap = async () => {
      // Already signed in — bail out
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session || !mountedRef.current) return;

      // google script not loaded yet — retry in 500ms
      if (!window.google?.accounts?.id) {
        retryRef.current = setTimeout(initOneTap, 500);
        return;
      }

      const { rawNonce, hashedNonce } = await generateNonce();
      if (!mountedRef.current) return;

      window.google.accounts.id.cancel();

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        // Keep FedCM off — it conflicts with popups and browser extensions
        use_fedcm_for_prompt: false,
        auto_select: false,
        cancel_on_tap_outside: true,
        nonce: hashedNonce,

        callback: async (response) => {
          if (!response?.credential) return;

          const { error } = await supabase.auth.signInWithIdToken({
            provider: "google",
            token: response.credential,
            nonce: rawNonce,
          });

          if (error) {
            console.error("Google One Tap error:", error.message);
            return;
          }

          if (mountedRef.current) {
            // Soft navigation — no hard reload, preserves React state
            router.refresh();
          }
        },
      });

      // prompt() can silently fail if:
      //   - user previously dismissed (cooldown period)
      //   - browser is blocking third-party cookies
      //   - another prompt is already open
      // The notification callback lets us log the reason in dev
      window.google.accounts.id.prompt((notification) => {
        if (process.env.NODE_ENV === "development") {
          if (notification.isNotDisplayed()) {
            console.info(
              "[OneTap] not displayed:",
              notification.getNotDisplayedReason(),
            );
          } else if (notification.isSkippedMoment()) {
            console.info("[OneTap] skipped:", notification.getSkippedReason());
          }
        }
      });
    };

    initOneTap();

    return () => {
      mountedRef.current = false;
      clearTimeout(retryRef.current);
      window.google?.accounts?.id?.cancel();
    };
  }, [router]);

  return null;
}
