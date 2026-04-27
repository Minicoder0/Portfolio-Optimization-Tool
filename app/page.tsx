import Link from "next/link";
import { TrendingUp, BarChart3, Lightbulb } from "lucide-react";

const conceptCards = [
  {
    icon: TrendingUp,
    title: "Smart Diversification",
    body: "Spread investments across assets to reduce overall risk without sacrificing return potential."
  },
  {
    icon: BarChart3,
    title: "Risk-Return Balance",
    body: "Find the optimal mix of stocks that maximizes return for every unit of risk you take."
  },
  {
    icon: Lightbulb,
    title: "Data-Driven Insights",
    body: "Powered by real market data and Markowitz optimization — no guesswork, just math."
  }
];

const steps = [
  { num: "1", title: "Pick Your Stocks", desc: "Search companies and build your portfolio universe." },
  { num: "2", title: "Set Parameters", desc: "Choose your date range and risk preferences." },
  { num: "3", title: "Get Optimized Weights", desc: "View allocation, charts, and save to history." }
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-4 py-24 text-center md:py-32">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[400px] w-[600px] rounded-full bg-emerald-500/5 blur-3xl" />
        </div>

        <div className="relative space-y-6">
          <h1 className="font-display text-5xl font-bold leading-tight text-white md:text-7xl">
            Build a Smarter Portfolio
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Harness Markowitz optimization to balance risk and return &mdash; no finance degree required.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link href="/signup" className="btn-primary text-base">
              Get Started
            </Link>
            <Link href="/dashboard" className="btn-secondary text-base">
              Open Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Concept cards */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="grid gap-5 md:grid-cols-3">
          {conceptCards.map((card) => (
            <article key={card.title} className="v2-card p-6 space-y-3">
              <card.icon className="h-6 w-6 text-emerald-400" />
              <h2 className="font-display text-lg font-semibold text-white">{card.title}</h2>
              <p className="text-sm leading-relaxed text-gray-400">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <h2 className="mb-10 text-center font-display text-3xl font-bold text-white">
          How It Works
        </h2>
        <div className="relative flex flex-col items-center gap-10 md:flex-row md:justify-center md:gap-0">
          {steps.map((step, index) => (
            <div key={step.num} className="relative flex flex-col items-center text-center md:flex-1">
              {/* Connector line between circles */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-[calc(50%+28px)] w-[calc(100%-56px)] border-t border-dashed border-gray-600" />
              )}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-emerald-500 font-display text-lg font-bold text-emerald-400 bg-[var(--surface)]  z-10">
                {step.num}
              </div>
              <h3 className="font-display text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 max-w-[200px] text-sm text-gray-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
