import Link from "next/link";
import React from "react";

export default function About() {
  const features = [
    {
      icon: "🎯",
      title: "Improve Focus",
      description:
        "Train your attention span and concentration with scientifically-backed exercises",
    },
    {
      icon: "⚡",
      title: "Boost Speed",
      description:
        "Enhance your visual processing speed and reaction time through regular practice",
    },
    {
      icon: "🧠",
      title: "Enhance Memory",
      description:
        "Strengthen working memory and cognitive flexibility with targeted training",
    },
    {
      icon: "📚",
      title: "Better Reading",
      description:
        "Develop peripheral vision skills that directly improve reading speed and comprehension",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Active Users" },
    { number: "2M+", label: "Games Played" },
    { number: "85%", label: "Improvement Rate" },
    { number: "30+", label: "Countries" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero min-h-[60vh] bg-base-200">
        <div className="hero-content text-center max-w-4xl">
          <div>
            <div className="text-6xl mb-6"></div>
            <h1 className="text-5xl font-bold mb-6">About Schulte Table</h1>
            <p className="text-xl leading-relaxed max-w-3xl mx-auto opacity-80">
              We're on a mission to make brain training accessible, effective,
              and enjoyable. Our scientifically-designed Schulte Table exercises
              help thousands of people improve their cognitive abilities every
              day.
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="prose prose-lg max-w-none">
                <p className="mb-4 opacity-80">
                  The Schulte Table was originally developed by German
                  psychiatrist Walter Schulte in the 1960s as a tool for
                  studying attention and concentration. What started as a
                  clinical assessment tool has evolved into one of the most
                  effective brain training exercises available.
                </p>
                <p className="mb-4 opacity-80">
                  We discovered the incredible potential of this simple yet
                  powerful exercise and decided to bring it to the digital age.
                  Our platform combines the proven science of Schulte Tables
                  with modern technology to create an engaging, measurable brain
                  training experience.
                </p>
                <p className="opacity-80">
                  Today, we're proud to help people from all walks of
                  life—students, professionals, athletes, and lifelong
                  learners—unlock their cognitive potential through daily
                  practice.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-neutral rounded-2xl p-8 w-80 h-80 flex items-center justify-center">
                <div className="grid grid-cols-5 gap-2 text-center">
                  {Array.from({ length: 25 }, (_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 bg-neutral-content rounded-lg flex items-center justify-center text-sm font-semibold text-neutral"
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
      <section className="py-20 bg-base-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Schulte Tables Work</h2>
            <p className="text-xl opacity-70 max-w-2xl mx-auto">
              Backed by decades of research, Schulte Tables target key cognitive
              functions that impact your daily performance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="card-body text-center p-8">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="card-title text-xl justify-center mb-3">
                    {feature.title}
                  </h3>
                  <p className="opacity-70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-content">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">
            Trusted by Thousands Worldwide
          </h2>
          <div className="stats stats-vertical lg:stats-horizontal shadow-lg bg-primary-content text-primary w-full">
            {stats.map((stat, index) => (
              <div key={index} className="stat">
                <div className="stat-value text-primary">{stat.number}</div>
                <div className="stat-title text-primary opacity-70">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Our Mission</h2>
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body p-12">
              <blockquote className="text-xl leading-relaxed italic opacity-80">
                "To democratize cognitive enhancement by making proven brain
                training techniques accessible to everyone, everywhere. We
                believe that mental fitness should be as important as physical
                fitness, and that everyone deserves the tools to reach their
                cognitive potential."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="py-20 bg-base-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Meet the Team</h2>
            <p className="text-xl opacity-70">
              Passionate experts dedicated to cognitive enhancement
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Chen",
                role: "Cognitive Scientist",
                avatar: "👩‍🔬",
              },
              { name: "Alex Rivera", role: "Product Designer", avatar: "🎨" },
              { name: "Marcus Webb", role: "Software Engineer", avatar: "💻" },
            ].map((member, index) => (
              <div key={index} className="card bg-base-100 shadow-lg">
                <div className="card-body text-center">
                  <div className="avatar placeholder mb-4">
                    <div className="bg-neutral text-neutral-content rounded-full w-20 h-20 text-3xl flex items-center justify-center">
                      {member.avatar}
                    </div>
                  </div>
                  <h3 className="card-title justify-center">{member.name}</h3>
                  <p className="text-sm opacity-70">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 bg-accent text-accent-content">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Train Your Brain?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who are already improving their cognitive
            abilities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <button className="btn btn-primary btn-lg">
                Start Training Now
              </button>
            </Link>

            {/* <button className="btn btn-outline btn-lg text-accent-content border-accent-content hover:bg-accent-content hover:text-accent">
              Learn More
            </button> */}
          </div>
        </div>
      </section>
    </div>
  );
}
