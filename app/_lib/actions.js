"use server";

import { addUsertoDB } from "./data-service";
import { supabase } from "./supabase";
import { setSession, getSession } from "./auth";
import { v4 as uuidv4 } from "uuid";

function generate6DigitToken() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Separated for clarity and safety
async function sendTokenToEmail(email, token) {
  // const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // if (!baseUrl) {
  //   console.error("Missing NEXT_PUBLIC_BASE_URL");
  //   return;
  // }

  try {
    const res = await fetch(`https://schultetable.com/api/send-verification`, {
      method: "POST",
      body: JSON.stringify({ email, token }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Verification email failed to send:", text);
    }
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

export async function RegisterUser(formData) {
  try {
    const fullName = formData.get("fullName");
    const suggestedUsername = formData.get("suggestedUsername");
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password || !fullName) {
      return { error: "Missing required fields" };
    }

    const avatarSeed = suggestedUsername || fullName || uuidv4().slice(0, 8);
    const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(avatarSeed)}`;
    const verificationToken = generate6DigitToken();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: fullName,
          image: avatarUrl,
        },
      },
    });

    if (error) {
      console.error("Supabase signUp error:", error.message);

      if (error.message.toLowerCase().includes("user already registered")) {
        return { error: "A user with this email already exists." };
      }

      return { error: error.message };
    }

    // Save additional user data
    try {
      await addUsertoDB(
        fullName,
        data.user.id,
        data.user.email,
        suggestedUsername,
        avatarUrl,
        verificationToken
      );
    } catch (err) {
      console.error("DB Error:", err);
      return { error: "Failed to save user to database" };
    }

    // Send email
    await sendTokenToEmail(data.user.email, verificationToken);

    // Store session
    if (data?.session) {
      await setSession(data.session);
    }

    return {
      user: data.user,
      session: data.session,
      message: "A 6-digit verification code has been sent to your email.",
    };
  } catch (err) {
    console.error("Unexpected registration error:", err);
    return { error: "Registration failed. Please try again." };
  }
}

export async function Login(formData) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error.message);
      return { error: error.message };
    }

    if (data?.session) {
      await setSession(data.session);
    }

    console.log("LOGIN SUCCESS", data);
    return { user: data.user, session: data.session };
  } catch (err) {
    console.error("Unexpected login error:", err);
    return { error: "Something went wrong. Please try again." };
  }
}
