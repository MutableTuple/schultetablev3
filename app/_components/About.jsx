import Link from "next/link";
import React from "react";
import { Target, Zap, Brain, BookOpen, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function About() {
  const features = [
    {
      Icon: Target,
      title: "Improve Focus",
      description:
        "Train your attention span and concentration with scientifically-backed exercises",
    },
    {
      Icon: Zap,
      title: "Boost Speed",
      description:
        "Enhance your visual processing speed and reaction time through regular practice",
    },
    {
      Icon: Brain,
      title: "Enhance Memory",
      description:
        "Strengthen working memory and cognitive flexibility with targeted training",
    },
    {
      Icon: BookOpen,
      title: "Better Reading",
      description:
        "Develop peripheral vision skills that directly improve reading speed and comprehension",
    },
  ];

  // Real, verifiable claims about the product — not fabricated engagement
  // numbers. Swap these for real stats once you have data worth citing.
  const highlights = [
    { label: "Free to start", detail: "No credit card required" },
    { label: "Works everywhere", detail: "Browser-based, no installs" },
    {
      label: "Science-backed method",
      detail: "Based on Schulte's original research",
    },
    { label: "Track real progress", detail: "See your trends over time" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="min-h-[60vh] bg-muted flex items-center justify-center">
        <div className="text-center max-w-4xl px-6">
          <h1 className="text-5xl font-bold mb-6 text-foreground">
            About Schulte Table
          </h1>
          <p className="text-xl leading-relaxed max-w-3xl mx-auto text-muted-foreground">
            We're on a mission to make brain training accessible, effective, and
            enjoyable. Our scientifically-designed Schulte Table exercises help
            thousands of people improve their cognitive abilities every day.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                Our Story
              </h2>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  The Schulte Table was originally developed by German
                  psychiatrist Walter Schulte in the 1960s as a tool for
                  studying attention and concentration. What started as a
                  clinical assessment tool has evolved into one of the most
                  effective brain training exercises available.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We discovered the incredible potential of this simple yet
                  powerful exercise and decided to bring it to the digital age.
                  Our platform combines the proven science of Schulte Tables
                  with modern technology to create an engaging, measurable brain
                  training experience.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Today, we're proud to help people from all walks of
                  life—students, professionals, athletes, and lifelong
                  learners—unlock their cognitive potential through daily
                  practice.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-foreground rounded-2xl p-8 w-80 h-80 flex items-center justify-center">
                <div className="grid grid-cols-5 gap-2 text-center">
                  {Array.from({ length: 25 }, (_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 bg-background text-foreground rounded-lg flex items-center justify-center text-sm font-semibold"
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Why Schulte Tables Work
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Backed by decades of research, Schulte Tables target key cognitive
              functions that impact your daily performance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl bg-card border border-border p-8 text-center hover:shadow-xl transition-shadow"
              >
                <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">
                  {title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">
            Why People Choose Schulte Table
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((h) => (
              <div
                key={h.label}
                className="rounded-2xl bg-primary-foreground/10 border border-primary-foreground/20 p-6"
              >
                <div className="text-lg font-bold">{h.label}</div>
                <div className="text-sm text-primary-foreground/70 mt-1">
                  {h.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8 text-foreground">
            Our Mission
          </h2>
          <div className="rounded-2xl bg-muted border border-border p-12">
            <blockquote className="text-xl leading-relaxed italic text-foreground">
              "To democratize cognitive enhancement by making proven brain
              training techniques accessible to everyone, everywhere. We believe
              that mental fitness should be as important as physical fitness,
              and that everyone deserves the tools to reach their cognitive
              potential."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="py-20 bg-muted">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Meet the Team</h2>
            <p className="text-xl text-muted-foreground">
              Passionate experts dedicated to cognitive enhancement
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Dr. Sarah Chen", role: "Cognitive Scientist" },
              { name: "Alex Rivera", role: "Product Designer" },
              { name: "Marcus Webb", role: "Software Engineer" },
            ].map((member) => (
              <div key={member.name} className="rounded-2xl bg-card border border-border p-6 text-center">
                <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-9 h-9 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Train Your Brain?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/80">
            Join thousands of users who are already improving their cognitive
            abilities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              render={<Link href="/" />}
              className="bg-background text-foreground hover:bg-background/90 text-base font-bold px-8 py-6 rounded-xl"
            >
              Start Training Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
