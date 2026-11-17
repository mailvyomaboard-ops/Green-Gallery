"use client";

import React, { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export function TopSceneryHero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
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

  return (
    <div className="relative w-full overflow-hidden bg-green-900 border-b border-green-700/40 select-none">
      {/* 
        Layered Nature Scenery Box (Multi-layer Parallax ready):
        Currently configured with lush botanical layers and SVG foliage silhouettes 
        moving at differential rates (0.15x, 0.35x, 0.55x) for an immersive depth "woosh" effect.
        The user can easily plug in their external PNG layer assets when provided.
      */}
      <div className="relative min-h-[620px] md:min-h-[740px] flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden">
        {/* Parallax Layer 1: Sky & Atmosphere Gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#162e20] via-[#1F3D2B] to-[#122419] pointer-events-none"
          style={{ transform: `translate3d(0, ${scrollY * 0.1}px, 0)` }}
        />

        {/* Parallax Layer 2: Deep Canopy Silhouettes & Sun Rays */}
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 20%, rgba(227, 235, 221, 0.15) 0%, transparent 65%)`,
            transform: `translate3d(0, ${scrollY * 0.2}px, 0)`,
          }}
        />

        {/* Parallax Layer 3: Distant Western Ghats Mountain & Tree Crests */}
        <div
          className="absolute inset-x-0 bottom-0 h-80 opacity-40 pointer-events-none"
          style={{
            transform: `translate3d(0, ${scrollY * 0.3}px, 0)`,
          }}
        >
          <svg className="w-full h-full text-[#14291c] preserve-3d" viewBox="0 0 1440 320" fill="currentColor">
            <path d="M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,181.3C672,181,768,203,864,197.3C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
        </div>

        {/* Parallax Layer 4: Mid-ground Specimen Palms & Canopy Leaves */}
        <div
          className="absolute inset-x-0 bottom-0 h-64 opacity-50 pointer-events-none"
          style={{
            transform: `translate3d(0, ${scrollY * 0.45}px, 0)`,
          }}
        >
          <svg className="w-full h-full text-[#0d1a12]" viewBox="0 0 1440 260" fill="currentColor">
            <path d="M0,128L60,144C120,160,240,192,360,192C480,192,600,160,720,160C840,160,960,192,1080,186.7C1200,181,1320,139,1380,117.3L1440,96L1440,260L1380,260C1320,260,1200,260,1080,260C960,260,840,260,720,260C600,260,480,260,360,260C240,260,120,260,60,260L0,260Z" />
          </svg>
        </div>

        {/* Foreground Content: Green Gallery in prominent Cormorant Garamond */}
        <div
          className="relative z-10 text-center max-w-4xl mx-auto py-12"
          style={{
            transform: `translate3d(0, ${scrollY * 0.18}px, 0)`,
          }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-100/10 border border-green-100/20 text-cream-50/90 text-xs tracking-wider uppercase mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-gold-600 animate-pulse" />
            <span>Landscaping Architecture & Specimen Nursery · Pune</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold tracking-tight text-cream-50 leading-[0.95] drop-shadow-sm mb-6">
            Green Gallery
          </h1>

          <p className="text-cream-50/90 text-lg sm:text-xl md:text-2xl font-light max-w-2xl mx-auto leading-relaxed mb-8">
            {siteConfig.tagline}
          </p>

          {/* Primary Action Button (Header & Hero lead button) + Secondary View Our Work */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact?type=consultation"
              className="w-full sm:w-auto min-h-[52px] px-8 py-3.5 bg-cream-50 hover:bg-cream-200 text-green-900 font-medium text-base rounded-brand shadow-md transition-colors cursor-pointer flex items-center justify-center"
            >
              Book a Site Consultation
            </Link>
            <Link
              href="/gallery"
              className="w-full sm:w-auto min-h-[52px] px-8 py-3.5 border border-cream-50/50 hover:border-cream-50 text-cream-50 hover:bg-cream-50/10 font-medium text-base rounded-brand transition-colors text-center flex items-center justify-center"
            >
              View Our Work
            </Link>
          </div>
        </div>

        {/* Parallax Layer 5: Foreground Arching Palm & Fern Fronds */}
        <div
          className="absolute inset-x-0 bottom-0 h-32 opacity-70 pointer-events-none"
          style={{
            transform: `translate3d(0, ${scrollY * 0.65}px, 0)`,
          }}
        >
          <div className="w-full h-full bg-gradient-to-t from-green-900 to-transparent" />
        </div>
      </div>

      {/* Brief descriptive strip below hero stating who Green Gallery is */}
      <div className="bg-green-900/95 border-t border-green-700/50 py-10 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="text-cream-50/90 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto font-light">
            Green Gallery designs and installs landscapes, adds foliage to building projects, and supplies specimen plants to builders, architects and private estate owners across Pune, Mumbai, Nashik and Lonavala.
          </p>
        </div>
      </div>
    </div>
  );
}
