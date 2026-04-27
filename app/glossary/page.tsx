"use client";

import { useState } from "react";
import { Search } from "lucide-react";

const glossaryTerms = [
  { letter: "A", terms: [
    { name: "Alpha", definition: "Excess return of an investment relative to a benchmark index." },
    { name: "Asset Allocation", definition: "How your money is divided among different investment types." }
  ]},
  { letter: "C", terms: [
    { name: "Correlation", definition: "How closely two stocks move together. +1 = identical, -1 = opposite." },
    { name: "Covariance", definition: "A measure of how two stocks vary together over time." }
  ]},
  { letter: "D", terms: [
    { name: "Diversification", definition: "Spreading investments across assets to reduce overall risk." }
  ]},
  { letter: "E", terms: [
    { name: "Efficient Frontier", definition: "The set of portfolios offering the highest return for each risk level." },
    { name: "Expected Return", definition: "The average return you can anticipate from a portfolio based on historical data." }
  ]},
  { letter: "M", terms: [
    { name: "Markowitz Model", definition: "A mathematical framework for building portfolios that optimize the risk-return tradeoff." },
    { name: "Mean-Variance Optimization", definition: "The process of finding portfolio weights that minimize risk for a target return." }
  ]},
  { letter: "S", terms: [
    { name: "Sharpe Ratio", definition: "Measures risk-adjusted return. Higher = better performance per unit of risk." },
    { name: "Standard Deviation", definition: "A measure of how much returns vary from the average. Higher = more volatile." }
  ]},
  { letter: "V", terms: [
    { name: "Volatility", definition: "The degree to which an investment\u2019s price fluctuates over time." }
  ]},
  { letter: "W", terms: [
    { name: "Weight", definition: "The percentage of your total portfolio allocated to a specific stock." }
  ]}
];

export default function GlossaryPage() {
  const [search, setSearch] = useState("");

  const filteredSections = glossaryTerms
    .map((section) => ({
      ...section,
      terms: section.terms.filter(
        (term) =>
          term.name.toLowerCase().includes(search.toLowerCase()) ||
          term.definition.toLowerCase().includes(search.toLowerCase())
      )
    }))
    .filter((section) => section.terms.length > 0);

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-bold text-white">Glossary</h1>
        <p className="text-gray-400">Plain-English definitions of key portfolio terms</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
        <input
          className="input !pl-10"
          placeholder="Search terms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-10">
        {filteredSections.map((section) => (
          <div key={section.letter}>
            <div className="mb-4 flex items-center gap-3">
              <span className="font-display text-2xl font-bold text-emerald-400">{section.letter}</span>
              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {section.terms.map((term) => (
                <article key={term.name} className="v2-card p-5 space-y-2">
                  <h3 className="font-display font-semibold text-white">{term.name}</h3>
                  <p className="text-sm leading-relaxed text-gray-400">{term.definition}</p>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredSections.length === 0 && (
        <p className="text-center text-gray-500">No terms match your search.</p>
      )}
    </div>
  );
}
