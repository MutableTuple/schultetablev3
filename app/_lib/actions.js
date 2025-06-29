"use server";
import { addUsertoDB } from "./data-service";
import { supabase } from "./supabase";
import { setSession, getSession } from "./auth"; // Import session handler
import { v4 as uuidv4 } from "uuid"; // npm install uuid (if not already)

function generate6DigitToken() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function RegisterUser(formData) {
  const fullName = formData.get("fullName");
  const suggestedUsername = formData.get("suggestedUsername");

  const avatarSeed = suggestedUsername || fullName || uuidv4().slice(0, 8);
  const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
    avatarSeed
  )}`;

  const verificationToken = generate6DigitToken();

  const { data, error } = await supabase.auth.signUp({
    email: formData.get("email"),
    password: formData.get("password"),
    options: {
      data: {
        display_name: fullName,
        image: avatarUrl,
      },
    },
  });

  if (error) return { error };

  await addUsertoDB(
    fullName,
    data.user.id,
    data.user.email,
    suggestedUsername,
    avatarUrl,
    verificationToken // 👈 pass the token
  );

  // TODO: Send email here with SendGrid/SMTP
  async function sendTokenToEmail(email, token) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    await fetch(`${baseUrl}/api/send-verification`, {
      method: "POST",
      body: JSON.stringify({ email, token }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  await sendTokenToEmail(data.user.email, verificationToken);

  if (data?.session) await setSession(data.session);

  return {
    user: data.user,
    session: data.session,
    message: "A 6-digit verification code has been sent to your email.",
  };
}

export async function Login(formData) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (error) {
      console.error("Login error:", error.message);
      return { error: error.message };
    }

    if (data?.session) {
      await setSession(data.session); // Store full session in cookies
    }

    console.log("LOGIN SUCCESS", data);
    return { user: data.user, session: data.session };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { error: "Something went wrong. Please try again." };
  }
}
