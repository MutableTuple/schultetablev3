"use server";
import { supabase } from "./supabase";
import { cookies } from "next/headers"; // Import Next.js cookies API

// Function to store the full session object in cookies
export async function setSession(session) {
  const cookieStore = cookies();

  if (session) {
    console.log("Setting session:", session); // Log the session object to verify structure

    if (session.access_token && session.refresh_token && session.user) {
      await cookieStore.set("sb-access-token", session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        path: "/",
      });

      await cookieStore.set("sb-refresh-token", session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        path: "/",
      });

      await cookieStore.set("sb-user", JSON.stringify(session.user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        path: "/",
      });
    } else {
      console.error("Invalid session data", session); // Log any session data that's invalid
    }
  } else {
    await cookieStore.delete("sb-access-token");
    await cookieStore.delete("sb-refresh-token");
    await cookieStore.delete("sb-user");
  }
}
export async function logout() {
  const cookieStore = cookies();

  await cookieStore.delete("sb-access-token");
  await cookieStore.delete("sb-refresh-token");
  await cookieStore.delete("sb-user");

  return { message: "Logged out" };
}
// Function to get the session data from cookies
export async function getSession() {
  const cookieStore = cookies();

  const access_token = cookieStore.get("sb-access-token");
  const refresh_token = cookieStore.get("sb-refresh-token");
  const user = cookieStore.get("sb-user");

  return {
    access_token,
    refresh_token,
    user: user,
  };
}
