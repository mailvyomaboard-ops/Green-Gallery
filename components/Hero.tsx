"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { defaultSiteContent, SiteContent } from "@/lib/types";
import { ArrowUpRight, Sparkles, MapPin } from "lucide-react";

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
        Rounded 3xl container framed in deep lush foliage with punchy bold typography
      */}
      <div className="relative w-full min-h-[580px] sm:min-h-[640px] md:min-h-[720px] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-green-950 shadow-2xl flex flex-col justify-between p-6 sm:p-10 md:p-14 border border-green-800/40">
        {/* Saturated Lush Tropical Leaf Background with Dual Vignette */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={content.heroImage || "/images/hero-clean.webp"}
            alt={content.heroHeadline || "GreenGallery - Professional Landscape Services & Botanical Execution in Pune"}
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
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3 w-full text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-cream-50 text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>Landscape Architecture & Botanical Execution</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 text-xs font-sans text-green-200/90 bg-black/25 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/10">
            <MapPin className="w-3.5 h-3.5 text-green-400" />
            <span>Central Logistical Staging Depot</span>
          </div>
        </div>

        {/* Central Giant Punchy Headline */}
        <div className="relative z-10 my-auto py-8 sm:py-12 max-w-4xl text-center sm:text-left flex flex-col items-center sm:items-start mx-auto sm:mx-0">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-green-400 mb-3 flex items-center justify-center sm:justify-start gap-2">
            <Sparkles className="w-4 h-4 text-green-400" />
            {content.heroBadge && !content.heroBadge.toLowerCase().includes("pune")
              ? content.heroBadge
              : "Landscape Design & Botanical Execution"}
          </span>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.05] sm:leading-[0.95] mb-2 drop-shadow-md">
            {content.heroHeadline && content.heroHeadline.toLowerCase() !== "growth"
              ? content.heroHeadline
              : "Green Gallery"}
          </h1>

          <div className="text-base sm:text-xl md:text-2xl font-serif italic text-amber-200/90 font-light tracking-wide mb-5 drop-shadow">
            Cultivating Natural Elegance
          </div>

          <p className="text-white/90 text-sm sm:text-lg md:text-xl font-normal max-w-2xl leading-relaxed drop-shadow mx-auto sm:mx-0">
            {content.heroDescription ||
              "Masterful landscape design, precision plantation execution, and ongoing botanical care for prestigious developments, commercial campuses, and private sanctuaries."}
          </p>
        </div>

        {/* Bottom Floating Island Controls */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-5 sm:gap-6 pt-4 border-t border-white/10 w-full">
          {/* Left Inset Card: Operational Network */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 sm:p-4 rounded-2xl flex items-center gap-4 w-full sm:max-w-sm text-left">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-green-900 border border-white/20 shrink-0">
              <Image
                src="/images/frames/ezgif-frame-003.jpg"
                alt="Acclimatized specimen flora"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="font-display font-bold text-white text-sm sm:text-base leading-tight">
                {content.heroStatCount && !content.heroStatCount.includes("Pune")
                  ? content.heroStatCount
                  : "Turnkey Excellence"}
              </div>
              <p className="text-white/70 text-xs font-light leading-snug mt-0.5">
                {content.heroStatLabel ||
                  "Dedicated logistical staging, specimen nursery networks, and comprehensive site execution."}
              </p>
            </div>
          </div>

          {/* Right Action CTAs: Pill Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <Link
              href="/services"
              className="w-full sm:w-auto min-h-[46px] sm:min-h-[48px] px-6 py-3 bg-white hover:bg-cream-50 text-green-950 font-bold text-sm rounded-full shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <span>{content.primaryButtonText || "Explore Services"}</span>
              <ArrowUpRight className="w-4 h-4 text-green-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <Link
              href="/contact?type=consultation"
              className="w-full sm:w-auto min-h-[46px] sm:min-h-[48px] px-6 py-3 bg-green-700/80 hover:bg-green-600 text-white font-bold text-sm rounded-full border border-green-500/40 backdrop-blur-md transition-all flex items-center justify-center gap-2"
            >
              <span>{content.secondaryButtonText || "Book Consultation"}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
