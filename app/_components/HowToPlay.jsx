import Link from "next/link";
import React from "react";
import {
  Target,
  Hash,
  Zap,
  TrendingUp,
  Eye,
  Brain,
  BookOpen,
  Info,
  Gamepad2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HowToPlay() {
  const steps = [
    {
      number: "1",
      title: "Position & Focus",
      description:
        "Sit comfortably and focus on the center of the table. Keep your eyes fixed on the center point without moving them around.",
      Icon: Target,
      tip: "Maintain good posture and keep your screen at eye level",
    },
    {
      number: "2",
      title: "Find Numbers in Order",
      description:
        "Using only your peripheral vision, locate and click numbers in ascending order (1, 2, 3, 4, 5...) as quickly as possible.",
      Icon: Hash,
      tip: "Don't move your eyes - use your peripheral vision to spot numbers",
    },
    {
      number: "3",
      title: "Stay Focused",
      description:
        "Avoid distractions and maintain concentration throughout the entire exercise. Speed will improve with practice.",
      Icon: Zap,
      tip: "Start slow and gradually increase your speed over time",
    },
    {
      number: "4",
      title: "Practice Daily",
      description:
        "Regular practice is key to improving cognitive abilities. Aim for 5-10 minutes of daily training for best results.",
      Icon: TrendingUp,
      tip: "Track your progress and celebrate improvements",
    },
  ];

  const benefits = [
    {
      Icon: Eye,
      title: "Peripheral Vision",
      description:
        "Expand your visual field and improve awareness of your surroundings",
    },
    {
      Icon: Brain,
      title: "Concentration",
      description:
        "Strengthen your ability to maintain focus for extended periods",
    },
    {
      Icon: Zap,
      title: "Processing Speed",
      description:
        "Increase the speed at which your brain processes visual information",
    },
    {
      Icon: BookOpen,
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
      colorClass: "bg-success/15 text-success",
    },
    {
      level: "Intermediate",
      grid: "5×5",
      time: "Under 60 seconds",
      colorClass: "bg-warning/15 text-warning",
    },
    {
      level: "Advanced",
      grid: "7×7",
      time: "Under 120 seconds",
      colorClass: "bg-destructive/15 text-destructive",
    },
  ];

  const faqs = [
    {
      q: "How often should I practice?",
      a: "For best results, practice 5-10 minutes daily. Consistency is more important than long sessions. Regular short practices will yield better improvements than occasional long sessions.",
    },
    {
      q: "What if I can't find the next number?",
      a: "Don't worry! Take your time and keep your eyes focused on the center. The number is there - use your peripheral vision to scan the grid systematically. Speed will come with practice.",
    },
    {
      q: "How long before I see improvements?",
      a: "Most users notice improvements in focus and processing speed within 1-2 weeks of regular practice. Significant improvements in reading speed and peripheral vision typically occur after 4-6 weeks.",
    },
  ];

  const demoGrid = [
    12, 7, 23, 3, 18, 9, 15, 1, 25, 11, 20, 4, 13, 8, 16, 24, 6, 19, 2, 22, 17,
    10, 21, 14, 5,
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="min-h-[50vh] bg-muted flex items-center justify-center">
        <div className="text-center max-w-4xl px-6">
          <h1 className="text-5xl font-bold mb-6 text-foreground">
            How to Play Schulte Table
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Master the art of cognitive training with our step-by-step guide.
            Learn the techniques used by professionals to enhance focus, speed,
            and mental clarity.
          </p>
        </div>
      </div>

      {/* Quick Start */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              Quick Start Guide
            </h2>
            <p className="text-lg text-muted-foreground">
              Follow these simple steps to begin your brain training journey
            </p>
          </div>

          <div className="grid gap-8">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl bg-card border border-border p-6"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <step.Icon className="w-6 h-6 text-primary" />
                      <h3 className="text-xl font-bold text-foreground">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-lg text-muted-foreground mb-3 leading-relaxed">
                      {step.description}
                    </p>
                    <div className="flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/8 px-4 py-3">
                      <Info className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-sm text-foreground">
                        <strong>Pro Tip:</strong> {step.tip}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Demo */}
      <section className="py-20 bg-muted">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8 text-foreground">
            Visual Example
          </h2>
          <div className="rounded-2xl bg-card border border-border max-w-md mx-auto p-6">
            <h3 className="text-lg font-bold mb-4 text-foreground">
              5×5 Schulte Table
            </h3>
            <div className="bg-foreground rounded-lg p-6">
              <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
                {demoGrid.map((num, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 bg-background text-foreground rounded-lg flex items-center justify-center text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer ${
                      num === 1 ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Click the highlighted number (1) first, then find 2, 3, 4, etc.
            </p>
          </div>
        </div>
      </section>

      {/* Difficulty Levels */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              Difficulty Levels
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose your challenge level and progress at your own pace
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {difficulty.map((level) => (
              <div
                key={level.level}
                className="rounded-2xl bg-card border border-border p-6 text-center"
              >
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-bold mb-4 ${level.colorClass}`}
                >
                  {level.level}
                </span>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {level.grid}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">Grid Size</p>
                <div className="h-px bg-border my-3" />
                <p className="font-semibold text-foreground">{level.time}</p>
                <p className="text-sm text-muted-foreground">Target Time</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-muted">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              Training Benefits
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover what regular Schulte Table practice can do for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl bg-card border border-border p-6 text-center"
              >
                <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <benefit.Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                name="faq"
                className="group rounded-xl border border-border bg-card px-5 py-4"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none text-xl font-medium text-foreground">
                  {faq.q}
                  <span className="text-primary text-2xl leading-none transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Training?</h2>
          <p className="text-xl mb-8 text-primary-foreground/80">
            Put your knowledge into practice and begin your cognitive
            enhancement journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              render={<Link href="/" />}
              className="bg-background text-foreground hover:bg-background/90 text-base font-bold px-8 py-6 rounded-xl flex items-center gap-2"
            >
              <Gamepad2 className="w-5 h-5" />
              Play Now
            </Button>
            <Button
              render={<Link href="/about" />}
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary text-base font-bold px-8 py-6 rounded-xl"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
