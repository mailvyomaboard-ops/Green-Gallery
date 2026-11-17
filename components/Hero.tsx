"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { defaultSiteContent, SiteContent } from "@/lib/types";
import { ArrowUpRight, ArrowDown, Sparkles } from "lucide-react";

export function Hero({ initialContent }: { initialContent?: SiteContent }) {
  const [content, setContent] = useState<SiteContent>(initialContent || defaultSiteContent);

  useEffect(() => {
    fetch("/api/cms")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.content) {
          setContent(data.content);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="px-3 sm:px-6 pt-2 pb-8 max-w-[1240px] mx-auto">
      {/* 
        Saturated Rainforest Canopy Hero Box:
        Rounded 3xl container framed in deep lush foliage with punchy bold typography (Reference Vibe)
      */}
      <div className="relative w-full min-h-[580px] sm:min-h-[640px] md:min-h-[720px] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-green-950 shadow-2xl flex flex-col justify-between p-6 sm:p-10 md:p-14 border border-green-800/40">
        {/* Saturated Lush Tropical Leaf Background with Dual Vignette */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={content.heroImage || "/images/courtyard-modern.jpg"}
            alt={content.heroHeadline || "Green Gallery - Precision Landscape Architecture and Specimen Nursery"}
            fill
            priority
            className="object-cover object-center scale-105"
            sizes="(max-width: 1240px) 100vw, 1240px"
          />
          {/* Heavy rich saturated emerald-to-forest gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#061A12]/80 via-[#0B2B1E]/65 to-[#061A12]/95" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0B2B1E]/40 to-[#061A12]/85" />
        </div>

        {/* Top Tag Pill */}
        <div className="relative z-10 flex items-center justify-between w-full">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-cream-50 text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>Living Architecture · Pune & Western Maharashtra</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-green-200/80 bg-black/20 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/10">
            <span>14-Acre Tathawade Bays</span>
          </div>
        </div>

        {/* Central Giant Punchy Headline (The "growth" Vibe) */}
        <div className="relative z-10 my-auto py-8 sm:py-12 max-w-4xl text-left">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-green-400 block mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-green-400" />
            {content.heroBadge || "Architectural Botanical Engineering"}
          </span>

          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight text-white leading-[0.92] mb-6 drop-shadow-md">
            {content.heroHeadline || "growth"}
          </h1>

          <p className="text-white/90 text-base sm:text-xl md:text-2xl font-normal max-w-2xl leading-relaxed drop-shadow">
            {content.heroDescription ||
              "Where architectural landscape master planning meets Western Maharashtra's premier 14-acre specimen nursery."}
          </p>
        </div>

        {/* Bottom Floating Island Controls (Inspired by Reference Image Hero Footprint) */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-4 border-t border-white/10">
          {/* Left Inset Card: 500+ Specimens Highlight */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 sm:p-4 rounded-2xl flex items-center gap-4 max-w-sm">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-green-900 border border-white/20 shrink-0">
              <Image
                src="/images/plants/areca-palm.jpg"
                alt="Acclimatized specimen palm"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="font-display font-bold text-white text-base sm:text-lg leading-tight">
                {content.heroStatCount || "500+ Specimens"}
              </div>
              <p className="text-white/70 text-xs font-light leading-snug mt-0.5">
                {content.heroStatLabel || "Acclimatized avenue trees & palms ready for direct site installation."}
              </p>
            </div>
          </div>

          {/* Right Action CTAs: Pill Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/store"
              className="flex-1 sm:flex-initial min-h-[48px] px-6 py-3 bg-white hover:bg-cream-50 text-green-950 font-bold text-sm rounded-full shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <span>{content.primaryButtonText || "Explore Specimen Store"}</span>
              <ArrowUpRight className="w-4 h-4 text-green-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <Link
              href="/contact?type=consultation"
              className="min-h-[48px] px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold text-sm rounded-full shadow-lg transition-all flex items-center justify-center gap-1.5"
            >
              <span>{content.secondaryButtonText || "Book Site Visit"}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
