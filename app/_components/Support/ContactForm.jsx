"use client";
import React, { useState } from "react";
import { supabase } from "@/app/_lib/supabase";
import ReCAPTCHA from "react-google-recaptcha";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    query: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [captcha, setCaptcha] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captcha) {
      setSuccess("Please verify that you're not a robot.");
      return;
    }

    setLoading(true);
    setSuccess(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase.from("SupportQueries").insert([
        {
          name: formData.name,
          user_email: formData.email,
          query: formData.query,
          user_id: user ? user.id : null,
        },
      ]);

      if (error) throw error;

      setSuccess("Your query has been submitted successfully!");
      setFormData({ name: "", email: "", query: "" });
      setCaptcha(null);
    } catch (err) {
      console.error(err.message);
      setSuccess("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-base-100  rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">
          Contact Support
        </h1>
        <p className="text-center text-base-content/70 mb-8">
          Have a question or need help with Schulte Table? Fill out the form
          below and we’ll get back to you soon.
        </p>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Name</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Message</span>
            </label>
            <textarea
              name="query"
              value={formData.query}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              placeholder="How can we help you?"
              rows={5}
              required
            ></textarea>
          </div>

          {/* reCAPTCHA */}
          <div className="form-control">
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
              onChange={(token) => setCaptcha(token)}
              onExpired={() => setCaptcha(null)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Send Message"}
          </button>
        </form>

        {/* Feedback */}
        {success && (
          <div className="alert alert-info mt-6">
            <span>{success}</span>
          </div>
        )}
      </div>
    </div>
  );
}
