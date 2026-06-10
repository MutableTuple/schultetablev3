"use server";

import { createUserClient } from "./supabaseServer";
import { v4 as uuidv4 } from "uuid";

function generate6DigitToken() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendTokenToEmail(email, token) {
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
      console.error("Verification email failed:", text);
    }
  } catch (err) {
    console.error("Error sending email:", err);
  }
}
export async function RegisterUser(formData) {
  try {
    const supabase = await createUserClient();

    // =========================
    // CAPTCHA
    // =========================
    const captchaToken = formData.get("captchaToken");

    if (!captchaToken) {
      return { error: "Captcha token missing." };
    }

    const verifyCaptcha = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `response=${captchaToken}&secret=${process.env.HCAPTCHA_SECRET}`,
    });

    const captchaResult = await verifyCaptcha.json();

    if (!captchaResult.success) {
      console.error("Captcha failed:", captchaResult);
      return { error: "Captcha verification failed." };
    }

    // =========================
    // FORM DATA
    // =========================
    const fullName = formData.get("fullName")?.toString().trim();
    const suggestedUsername = formData
      .get("suggestedUsername")
      ?.toString()
      .trim();
    const email = formData.get("email")?.toString().trim().toLowerCase();
    const password = formData.get("password")?.toString();

    if (!email || !password || !fullName) {
      return { error: "Missing required fields." };
    }

    const avatarSeed = suggestedUsername || fullName || uuidv4().slice(0, 8);

    const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
      avatarSeed,
    )}`;

    const verificationToken = generate6DigitToken();

    // =========================
    // SIGNUP
    // =========================
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

    console.log("SIGNUP DATA:", data);
    console.log("SIGNUP ERROR:", error);

    if (error) {
      console.error("Signup error:", error);

      if (error.message?.toLowerCase().includes("already registered")) {
        return { error: "User already exists." };
      }

      return { error: error.message };
    }

    if (!data?.user) {
      console.error("No user returned from signup:", data);
      return { error: "Failed to create user." };
    }

    console.log("SUPABASE USER ID:", data.user.id);
    console.log("SUPABASE EMAIL:", data.user.email);

    // =========================
    // CHECK EXISTING USER
    // =========================
    const { data: existingUser } = await supabase
      .from("User")
      .select("id")
      .eq("id", data.user.id)
      .maybeSingle();

    console.log("EXISTING USER:", existingUser);

    // =========================
    // UPSERT USER
    // =========================
    const { error: dbError } = await supabase.from("User").upsert(
      {
        id: data.user.id,
        name: fullName,
        email: data.user.email,
        username: suggestedUsername,
        image: avatarUrl,
        verification_token: verificationToken,
      },
      {
        onConflict: "id",
      },
    );

    if (dbError) {
      console.error("DB ERROR:", dbError);
      return {
        error: dbError.message || "Failed to save user.",
      };
    }

    console.log("USER SAVED SUCCESSFULLY");

    // =========================
    // EMAIL
    // =========================
    await sendTokenToEmail(data.user.email, verificationToken);

    return {
      user: data.user,
      message: "Verification code sent to email.",
    };
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    return {
      error: err instanceof Error ? err.message : "Registration failed.",
    };
  }
}
export async function Login(formData) {
  try {
    const supabase = await createUserClient();

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

    // ✅ NO setSession needed anymore

    return {
      user: data.user,
      message: "Login successful",
    };
  } catch (err) {
    console.error("Login error:", err);
    return { error: "Something went wrong" };
  }
}
