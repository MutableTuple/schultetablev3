import Link from "next/link";
import React from "react";

export default function HowToPlay() {
  const steps = [
    {
      number: "1",
      title: "Position & Focus",
      description:
        "Sit comfortably and focus on the center of the table. Keep your eyes fixed on the center point without moving them around.",
      icon: "🎯",
      tip: "Maintain good posture and keep your screen at eye level",
    },
    {
      number: "2",
      title: "Find Numbers in Order",
      description:
        "Using only your peripheral vision, locate and click numbers in ascending order (1, 2, 3, 4, 5...) as quickly as possible.",
      icon: "🔢",
      tip: "Don't move your eyes - use your peripheral vision to spot numbers",
    },
    {
      number: "3",
      title: "Stay Focused",
      description:
        "Avoid distractions and maintain concentration throughout the entire exercise. Speed will improve with practice.",
      icon: "⚡",
      tip: "Start slow and gradually increase your speed over time",
    },
    {
      number: "4",
      title: "Practice Daily",
      description:
        "Regular practice is key to improving cognitive abilities. Aim for 5-10 minutes of daily training for best results.",
      icon: "📈",
      tip: "Track your progress and celebrate improvements",
    },
  ];

  const benefits = [
    {
      icon: "👁️",
      title: "Peripheral Vision",
      description:
        "Expand your visual field and improve awareness of your surroundings",
    },
    {
      icon: "🧠",
      title: "Concentration",
      description:
        "Strengthen your ability to maintain focus for extended periods",
    },
    {
      icon: "⚡",
      title: "Processing Speed",
      description:
        "Increase the speed at which your brain processes visual information",
    },
    {
      icon: "📖",
      title: "Reading Skills",
      description:
        "Improve reading speed and comprehension through enhanced visual skills",
    },
  ];

  const difficulty = [
    {
      level: "Beginner",
      grid: "3×3",
      time: "No time limit",
      badge: "badge-success",
    },
    {
      level: "Intermediate",
      grid: "5×5",
      time: "Under 60 seconds",
      badge: "badge-warning",
    },
    {
      level: "Advanced",
      grid: "7×7",
      time: "Under 120 seconds",
      badge: "badge-error",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero min-h-[50vh] bg-base-200">
        <div className="hero-content text-center max-w-4xl">
          <div>
            <div className="text-6xl mb-6 "></div>
            <h1 className="text-5xl font-bold mb-6">
              How to Play Schulte Table
            </h1>
            <p className="text-xl opacity-80 max-w-3xl mx-auto leading-relaxed">
              Master the art of cognitive training with our step-by-step guide.
              Learn the techniques used by professionals to enhance focus,
              speed, and mental clarity.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Quick Start Guide</h2>
            <p className="text-lg opacity-70">
              Follow these simple steps to begin your brain training journey
            </p>
          </div>

          <div className="grid gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="card bg-base-100 border border-base-300"
              >
                <div className="card-body">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-primary text-primary-content rounded-full flex items-center justify-center text-2xl font-bold">
                        {step.number}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{step.icon}</span>
                        <h3 className="text-xl font-bold">{step.title}</h3>
                      </div>
                      <p className="text-lg opacity-80 mb-3 leading-relaxed">
                        {step.description}
                      </p>
                      <div className="alert alert-info">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          className="stroke-current shrink-0 w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        <span className="text-sm">
                          <strong>Pro Tip:</strong> {step.tip}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Demo */}
      <section className="py-20 bg-base-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Visual Example</h2>
          <div className="card bg-base-100  max-w-md mx-auto">
            <div className="card-body">
              <h3 className="card-title justify-center mb-4">
                5×5 Schulte Table
              </h3>
              <div className="bg-neutral rounded-lg p-6">
                <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
                  {[
                    12, 7, 23, 3, 18, 9, 15, 1, 25, 11, 20, 4, 13, 8, 16, 24, 6,
                    19, 2, 22, 17, 10, 21, 14, 5,
                  ].map((num, i) => (
                    <div
                      key={i}
                      className={`w-10 h-10 bg-neutral-content text-neutral rounded-lg flex items-center justify-center text-sm font-semibold hover:bg-primary hover:text-primary-content transition-colors cursor-pointer ${num === 1 ? "ring-2 ring-primary" : ""}`}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-sm opacity-70 mt-4">
                Click the highlighted number (1) first, then find 2, 3, 4, etc.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Difficulty Levels */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Difficulty Levels</h2>
            <p className="text-lg opacity-70">
              Choose your challenge level and progress at your own pace
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 ">
            {difficulty.map((level, index) => (
              <div
                key={index}
                className="card bg-base-100 border border-base-300 "
              >
                <div className="card-body text-center">
                  <div className={`badge ${level.badge} mb-4`}>
                    {level.level}
                  </div>
                  <h3 className="card-title justify-center text-2xl mb-2">
                    {level.grid}
                  </h3>
                  <p className="text-sm opacity-70 mb-4">Grid Size</p>
                  <div className="divider"></div>
                  <p className="font-semibold">{level.time}</p>
                  <p className="text-sm opacity-70">Target Time</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-base-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Training Benefits</h2>
            <p className="text-lg opacity-70">
              Discover what regular Schulte Table practice can do for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="card bg-base-100 ">
                <div className="card-body text-center">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="card-title justify-center text-lg mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-sm opacity-70 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <div className="collapse collapse-plus bg-base-200">
              <input type="radio" name="faq-accordion" defaultChecked />
              <div className="collapse-title text-xl font-medium">
                How often should I practice?
              </div>
              <div className="collapse-content">
                <p className="opacity-70">
                  For best results, practice 5-10 minutes daily. Consistency is
                  more important than long sessions. Regular short practices
                  will yield better improvements than occasional long sessions.
                </p>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-200">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-xl font-medium">
                What if I can't find the next number?
              </div>
              <div className="collapse-content">
                <p className="opacity-70">
                  Don't worry! Take your time and keep your eyes focused on the
                  center. The number is there - use your peripheral vision to
                  scan the grid systematically. Speed will come with practice.
                </p>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-200">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-xl font-medium">
                How long before I see improvements?
              </div>
              <div className="collapse-content">
                <p className="opacity-70">
                  Most users notice improvements in focus and processing speed
                  within 1-2 weeks of regular practice. Significant improvements
                  in reading speed and peripheral vision typically occur after
                  4-6 weeks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-content">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Training?</h2>
          <p className="text-xl mb-8 opacity-90">
            Put your knowledge into practice and begin your cognitive
            enhancement journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <button className="btn btn-accent btn-lg">🎮 Play Now</button>
            </Link>
            <Link href="/about">
              <button className="btn btn-outline btn-lg text-primary-content border-primary-content hover:bg-primary-content hover:text-primary">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
