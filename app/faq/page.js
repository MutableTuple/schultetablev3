// app/faq/page.jsx (Next.js 13+ App Router)
// If using Pages Router, adjust import paths accordingly

import React from "react";
import Navbar from "../_components/Navbar";
import Head from "next/head";
import Link from "next/link";

export default function FAQPage() {
  const faqList = [
    {
      question: "What is the Schulte Table and how does it help?",
      answer:
        "The Schulte Table is a simple grid-based exercise used to train attention, peripheral vision, and reading speed. Players find numbers or letters in a randomized grid as quickly as possible, improving focus and cognitive speed with regular practice.",
    },
    {
      question: "How do I play the online Schulte Table game?",
      answer:
        "Open the game, choose a grid size (e.g., 5x5), and tap or click the numbers in order from 1 to N as fast as you can. Use the timer to track progress and try to beat your best time. Mobile and desktop controls are supported.",
    },
    {
      question: "Is the Schulte Table suitable for kids?",
      answer:
        "Yes — the game is suitable for children and adults. For kids, start with smaller grid sizes and shorter practice sessions, then gradually increase difficulty as focus improves.",
    },
    {
      question: "How often should I practice to see results?",
      answer:
        "Practice 10–15 minutes per day, 3–5 times a week. Many users report measurable improvements in attention and reading speed within 2–4 weeks.",
    },
    {
      question: "Do I need to download anything?",
      answer:
        "No. The game runs in your browser — no downloads required. It works on most modern mobile and desktop browsers.",
    },
    {
      question: "Can I time my sessions and compare results?",
      answer:
        "Yes. The game includes a built-in timer and a simple results area for tracking best times and mistakes. You can also export or screenshot your best runs for comparison.",
    },
    {
      question: "Are the results guaranteed?",
      answer:
        "No cognitive improvement can be guaranteed, but the Schulte Table is a well-known attention exercise. Consistent, focused practice combined with healthy habits (sleep, hydration) typically produces the best gains.",
    },
    {
      question: "Can teachers or therapists use this in a classroom?",
      answer:
        "Absolutely. The Schulte Table can be used as a short classroom exercise or warm-up to sharpen attention. Use group challenges or timed sessions to increase engagement.",
    },
  ];

  // JSON-LD: FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqList.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  // JSON-LD: App Schema
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Schulte Table — Focus Trainer",
    url: "https://www.schultetable.com/",
    description:
      "A fast, free Schulte Table game for improving attention, peripheral awareness, and reading speed. Play in-browser on desktop or mobile; includes timer and scoring.",
    applicationCategory: "Game",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <Head>
        <title>Frequently Asked Questions | Schulte Table Game</title>
        <meta
          name="description"
          content="Get answers to common questions about the Schulte Table, how to play, benefits, and tips for improving focus and speed."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
        />
      </Head>

      <main className="min-h-screen bg-base-200 text-base-content">
        <Navbar />

        <section id="faq" className="container mx-auto max-w-6xl p-4 sm:p-6">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base opacity-70 mt-2">
            Common questions about the Schulte Table, practice tips, and game
            usage.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="btn rounded-full btn-sm flex items-center gap-2 bg-black text-white"
            >
              Play a 4x4 medium (most played)
            </Link>
            <Link
              href="/blogs"
              className="btn rounded-full btn-sm flex items-center gap-2"
            >
              Read Related Articles
            </Link>
          </div>
          <div className="mt-6 grid gap-4">
            {faqList.map((f, i) => (
              <details
                key={i}
                className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box"
              >
                <summary className="collapse-title text-base sm:text-lg font-medium">
                  {f.question}
                </summary>
                <div className="collapse-content">
                  <p className="text-sm sm:text-base opacity-90">{f.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
