"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { defaultSiteContent, SiteContent } from "@/lib/types";
import { ArrowUpRight, Sparkles, MapPin } from "lucide-react";

export function Hero({ initialContent }: { initialContent?: SiteContent }) {
  const [content, setContent] = useState<SiteContent>(initialContent || defaultSiteContent);
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    fetch("/api/cms")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.content) {
          setContent(data.content);
        }
      })
      .catch(() => {});

    // 120fps passive scroll listener using requestAnimationFrame
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Multi-plane parallax translations (Hardware-accelerated)
  const heroHeight = 750;
  const scrollProgress = Math.min(1, Math.max(0, scrollY / heroHeight));
  const bgTranslateY = scrollY * 0.18; // Plane 1: Background canopy
  const foliageTranslateY = scrollY * 0.32; // Plane 2: Floating leaf elements
  const heroScale = 1 - scrollProgress * 0.02; // Global subtle zoom-out
  const heroOpacity = 1 - scrollProgress * 0.15; // Focus fade

  return (
    <section ref={heroRef} className="px-3 sm:px-6 pt-2 pb-8 max-w-[1280px] mx-auto overflow-hidden">
      {/* 
        Saturated Rainforest Canopy Hero Box:
        Framed in deep lush foliage with natural spatial depth, graceful typography and 120fps motion
      */}
      <div
        style={{
          transform: `scale(${heroScale})`,
          opacity: heroOpacity,
          willChange: "transform, opacity",
        }}
        className="relative w-full min-h-[580px] sm:min-h-[640px] md:min-h-[700px] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-[#04110A] shadow-2xl flex flex-col justify-between p-6 sm:p-10 md:p-14 border border-emerald-500/25 transition-transform duration-75 ease-out"
      >
        {/* PLANE 1: PARALLAX BOTANICAL CANOPY BACKGROUND */}
        <div
          style={{
            transform: `translate3d(0, ${bgTranslateY}px, 0) scale(1.08)`,
            willChange: "transform",
          }}
          className="absolute inset-0 w-full h-[120%] -top-[10%] pointer-events-none transition-transform duration-75 ease-out"
        >
          <Image
            src={content.heroImage || "/images/hero-clean.webp"}
            alt={content.heroHeadline || "GreenGallery - Professional Landscape Services & Botanical Execution in Pune"}
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
          {/* Multi-layered cinematic rich emerald gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#030E07]/85 via-[#082216]/65 to-[#04110A]/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/15 via-[#061A12]/50 to-[#030E07]/90" />
        </div>

        {/* PLANE 2: DIFFERENTIAL PARALLAX LEAVES & AMBIENT SUNLIGHT RAYS */}
        <div
          style={{
            transform: `translate3d(0, ${foliageTranslateY}px, 0)`,
            willChange: "transform",
          }}
          className="absolute inset-0 pointer-events-none overflow-hidden z-10 opacity-75"
        >
          {/* Ambient Warm Sunlight Beam Drift */}
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-amber-400/20 via-emerald-500/10 to-transparent blur-3xl animate-light-beam" />

          {/* Floating Foliage Silhouette 1 (Top Right) */}
          <div className="absolute -top-12 -right-12 w-72 h-72 animate-botanical-sway text-emerald-400/15">
            <svg viewBox="0 0 200 200" fill="currentColor" className="w-full h-full drop-shadow-xl">
              <path d="M42.7,-72.1C54.9,-67.2,64.2,-55.8,71.2,-43.3C78.2,-30.8,82.8,-17.2,82.1,-3.9C81.4,9.4,75.4,22.4,68.4,34.8C61.4,47.2,53.4,59,42.2,66.8C31,74.6,16.5,78.4,2.2,75.1C-12.1,71.8,-26.2,61.4,-38.4,51.8C-50.6,42.2,-60.9,33.4,-68.8,21.9C-76.7,10.4,-82.2,-3.8,-79.8,-16.9C-77.4,-30,-67.1,-42,-55.1,-47.3C-43.1,-52.6,-29.4,-51.2,-17,-56.3C-4.6,-61.4,6.5,-73,19.2,-77.3C31.9,-81.6,46.2,-78.6,42.7,-72.1Z" transform="translate(100 100)" />
            </svg>
          </div>

          {/* Floating Foliage Silhouette 2 (Bottom Left) */}
          <div className="absolute -bottom-20 -left-16 w-80 h-80 animate-botanical-sway-slow text-emerald-600/10">
            <svg viewBox="0 0 200 200" fill="currentColor" className="w-full h-full">
              <path d="M45.7,-76.3C58.3,-71.4,67.1,-57.9,73.4,-43.8C79.7,-29.7,83.5,-15,82.2,-0.7C80.9,13.6,74.5,27.5,66.6,39.9C58.7,52.3,49.3,63.2,37.3,70.8C25.3,78.4,10.7,82.7,-3.7,88.4C-18.1,94.1,-32.3,101.2,-43.8,94.8C-55.3,88.4,-64.1,68.5,-71.2,51.1C-78.3,33.7,-83.7,18.8,-83.2,4.1C-82.7,-10.6,-76.3,-25.1,-68.1,-37.8C-59.9,-50.5,-49.9,-61.4,-37.8,-66.6C-25.7,-71.8,-11.5,-71.3,2.7,-75.4C16.9,-79.5,33.1,-81.2,45.7,-76.3Z" transform="translate(100 100)" />
            </svg>
          </div>

          {/* Micro Botanical Vein Mesh Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
        </div>

        {/* TOP STATUS BAR: DUAL PILLS */}
        <div
          className={`relative z-20 flex flex-col sm:flex-row items-center justify-between gap-3 w-full text-center sm:text-left transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          {/* Left Pill: Live Vitality Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-cream-50 text-xs font-semibold uppercase tracking-wider shadow-sm hover:border-emerald-400/50 transition-colors">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[11px] font-mono tracking-wider">
              {content.heroBadge && !content.heroBadge.toLowerCase().includes("pune")
                ? content.heroBadge
                : "Landscape Architecture & Botanical Execution"}
            </span>
          </div>

          {/* Right Pill: Staging Logistics Depot */}
          <div className="hidden sm:inline-flex items-center gap-2 text-xs font-sans text-emerald-200/90 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-500/20 shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
            <span className="font-mono text-[11px]">Central Staging Depot • Alandi, Pune</span>
          </div>
        </div>

        {/* CENTRAL SECTION: SPACIOUS ELEGANT BOTANICAL CORE */}
        <div
          className={`relative z-20 my-auto py-8 sm:py-12 max-w-4xl text-center sm:text-left flex flex-col items-center sm:items-start mx-auto sm:mx-0 transition-all duration-1000 delay-150 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* Botanical Insignia & Brand Tag */}
          <div className="flex items-center justify-center sm:justify-start gap-3.5 mb-5 group">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-amber-400/60 bg-[#08150E] shadow-2xl p-0.5 shrink-0 animate-pulse-glow transition-transform group-hover:scale-105 duration-300">
              <Image
                src="/images/emblem.jpg"
                alt="GreenGallery Insignia"
                fill
                className="object-cover rounded-full"
                priority
                sizes="56px"
              />
            </div>
            <div className="text-left">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
                <span>Cultivating Living Environments</span>
              </span>
              <span className="text-xs sm:text-sm text-amber-200/90 font-serif italic tracking-wide block">
                Turnkey Landscapes • Commercial &amp; Residential
              </span>
            </div>
          </div>

          {/* Main Display Headline: Modern Sans */}
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.02] sm:leading-[0.92] mb-3 drop-shadow-md">
            {content.heroHeadline && content.heroHeadline.toLowerCase() !== "growth"
              ? content.heroHeadline
              : "Green Gallery"}
          </h1>

          {/* Editorial Serif Subtitle (MAI style graceful italic) */}
          <div className="text-xl sm:text-3xl md:text-4xl font-serif italic text-amber-200/95 font-light tracking-wide mb-5 drop-shadow leading-snug">
            Living Architecture &amp; Botanical Precision
          </div>

          {/* Crisp Body Lead */}
          <p className="text-white/85 text-sm sm:text-base md:text-lg font-light max-w-2xl leading-relaxed drop-shadow mx-auto sm:mx-0">
            {content.heroDescription ||
              "From large-scale commercial developer podiums to private villa sanctuaries. We design, source, plant, and nurture enduring green environments across Pune and Maharashtra."}
          </p>
        </div>

        {/* BOTTOM CONTROLS & ACTION CTAS */}
        <div
          className={`relative z-20 flex flex-col sm:flex-row items-center sm:items-center justify-between gap-5 sm:gap-6 pt-5 border-t border-white/10 w-full transition-all duration-1000 delay-300 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Subtle Brand Tagline */}
          <div className="text-xs sm:text-sm font-serif italic text-amber-200/90 text-center sm:text-left">
            Cultivating living botanical environments across Pune &amp; Maharashtra
          </div>

          {/* Action CTAs: Apple/Linear-Styled Tactile Pill Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {/* Primary Action Button with Tactile Hover Lift & Glossy Sheen */}
            <Link
              href="/services"
              className="relative overflow-hidden group w-full sm:w-auto min-h-[48px] px-8 py-3 bg-white hover:bg-cream-50 active:scale-[0.98] text-green-950 font-bold text-xs uppercase tracking-wider rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2 border border-white/40"
            >
              {/* Glossy sweep effect */}
              <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000" />
              <span className="relative z-10">{content.primaryButtonText || "Explore Services"}</span>
              <ArrowUpRight className="relative z-10 w-4 h-4 text-green-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            {/* Secondary Consultation Button */}
            <Link
              href="/contact?type=consultation"
              className="relative overflow-hidden group w-full sm:w-auto min-h-[48px] px-8 py-3 bg-emerald-600/80 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider rounded-full border border-emerald-400/40 backdrop-blur-md shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span className="relative z-10">{content.secondaryButtonText || "Book Consultation"}</span>
            </Link>
          </div>
        </div>

        {/* AMBIENT SCROLL-DOWN INDICATOR */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center pointer-events-none opacity-60 hover:opacity-100 transition-opacity">
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1 bg-black/20 backdrop-blur-xs">
            <div className="w-1.5 h-2 rounded-full bg-emerald-400 animate-scroll-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
