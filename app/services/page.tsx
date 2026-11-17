"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig, ServiceItem } from "@/config/site";
import { ArrowRight, CheckCircle2, Sprout, ArrowUpRight } from "lucide-react";

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Commercial", "Residential", "Specialized", "Maintenance"];

  const filteredServices =
    activeCategory === "All"
      ? siteConfig.services
      : siteConfig.services.filter((s) => s.category === activeCategory);

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-green-700 dark:text-green-400">
          Comprehensive Landscaping Solutions
        </span>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-green-950 dark:text-white tracking-tight">
          Our Services &amp; Capabilities
        </h1>
        <p className="text-sm sm:text-base text-ink-700 dark:text-white/70 font-light leading-relaxed">
          From developer podium decks and corporate campuses to private residential sanctuaries and scheduled horticultural upkeep. Tailored specifically for Pune and Western Maharashtra’s unique climate.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeCategory === cat
                ? "bg-green-950 dark:bg-green-600 text-white shadow-sm"
                : "bg-white dark:bg-white/10 text-ink-700 dark:text-white/80 hover:bg-cream-100 dark:hover:bg-white/20 border border-green-900/10 dark:border-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredServices.map((service: ServiceItem) => (
          <div
            key={service.id}
            className="bg-white dark:bg-[#080A09] rounded-3xl p-6 border border-green-900/10 dark:border-white/10 shadow-soft hover:shadow-glow transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-5 bg-gradient-to-br from-green-950 via-[#0B2B1E] to-[#040E0A] p-5 flex flex-col justify-between border border-green-800/30">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-white/10 dark:bg-black/50 backdrop-blur-sm text-[10px] font-bold text-green-300 uppercase tracking-wider border border-white/15">
                    {service.category}
                  </span>
                  <span className="text-[10px] font-mono text-green-400 bg-green-950/80 px-2 py-0.5 rounded border border-green-500/30">
                    Pune Market Scope
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-green-400/80 uppercase tracking-wider block">Target Property</span>
                  <span className="text-xs font-semibold text-white/90 truncate block">{service.idealFor.split(',')[0]}</span>
                </div>
              </div>

              <h2 className="font-display text-2xl font-bold text-green-950 dark:text-white mb-2">
                {service.title}
              </h2>

              <p className="text-xs text-ink-700 dark:text-white/70 font-light leading-relaxed mb-4">
                {service.shortDescription}
              </p>

              {/* Highlights */}
              <div className="space-y-1.5 mb-6">
                {service.features.slice(0, 3).map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-ink-700 dark:text-white/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-cream-200 dark:border-white/10 flex items-center justify-between gap-3">
              <Link
                href={`/services/${service.slug}`}
                className="text-xs font-bold text-green-800 dark:text-green-300 hover:text-green-950 dark:hover:text-white flex items-center gap-1 group"
              >
                <span>Full Scope &amp; Deliverables</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href={`/contact?type=quote&service=${encodeURIComponent(service.title)}`}
                className="px-3.5 py-1.5 rounded-full bg-green-950 dark:bg-green-700 hover:bg-green-800 text-white text-[11px] font-semibold flex items-center gap-1 shadow-xs"
              >
                <span>Enquire</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Operational Assurance Banner */}
      <section className="bg-cream-100 dark:bg-[#080A09] rounded-3xl p-8 sm:p-10 border border-green-900/10 dark:border-white/10 mt-12">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <Sprout className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto" />
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-green-950 dark:text-white">
            Need a Custom Landscape Proposal?
          </h2>
          <p className="text-xs sm:text-sm text-ink-700 dark:text-white/70 leading-relaxed font-light">
            Whether preparing a formal Bill of Quantities (BOQ) for real estate tenders or transforming a private terrace, our team evaluates sun orientation, water quality, and civil interfaces to design a thriving landscape.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact?type=quote"
              className="px-6 py-3 bg-green-950 dark:bg-green-600 hover:bg-green-800 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow"
            >
              Request Project Quotation
            </Link>
            <Link
              href="/contact?type=consultation"
              className="px-6 py-3 bg-white dark:bg-white/10 text-green-950 dark:text-white hover:bg-cream-200 border border-green-900/10 text-xs font-bold uppercase tracking-wider rounded-full shadow-xs"
            >
              Schedule Site Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
