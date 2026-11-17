"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

const TOTAL_FRAMES = 20;

export function ScrollVideoScrubber() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  // Preload all 20 frames from ezgif sequence
  useEffect(() => {
    let count = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new window.Image();
      const paddedIndex = String(i).padStart(3, "0");
      img.src = `/images/frames/ezgif-frame-${paddedIndex}.jpg`;
      img.onload = () => {
        count++;
        setLoadedCount(count);
        // Paint immediately when first frame finishes
        if (i === 1 && canvasRef.current) {
          drawFrame(img);
        }
      };
      images.push(img);
    }

    imagesRef.current = images;
  }, []);

  // Frame drawing helper on Canvas with aspect-ratio cover
  const drawFrame = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const imgRatio = img.naturalWidth / img.naturalHeight || 16 / 9;
    const canvasRatio = canvasWidth / canvasHeight;

    let renderWidth = canvasWidth;
    let renderHeight = canvasHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      renderHeight = canvasWidth / imgRatio;
      offsetY = (canvasHeight - renderHeight) / 2;
    } else {
      renderWidth = canvasHeight * imgRatio;
      offsetX = (canvasWidth - renderWidth) / 2;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
  };

  // Resize listener for Retina / HiDPI crispness
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = (canvas.parentElement?.clientWidth || window.innerWidth) * dpr;
      canvas.height = (canvas.parentElement?.clientHeight || window.innerHeight) * dpr;

      const activeImg = imagesRef.current[currentFrameIndex];
      if (activeImg && activeImg.complete) {
        drawFrame(activeImg);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentFrameIndex]);

  // Scroll listener tracking percentage progress through the container
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) {
            ticking = false;
            return;
          }

          const rect = containerRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const totalScrollDistance = rect.height - windowHeight;

          if (totalScrollDistance <= 0) {
            ticking = false;
            return;
          }

          // Progress from 0 to 1
          const scrolledPastTop = -rect.top;
          const progress = Math.min(1, Math.max(0, scrolledPastTop / totalScrollDistance));
          const targetFrame = Math.min(
            TOTAL_FRAMES - 1,
            Math.floor(progress * (TOTAL_FRAMES - 1))
          );

          setCurrentFrameIndex(targetFrame);

          const img = imagesRef.current[targetFrame];
          if (img && img.complete) {
            drawFrame(img);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dynamic titles adapting to the scrubbed frame
  let stageTitle = "Precision Landscape Architecture";
  let stageSubtitle = "Acclimatized botanical stock cultivated in our Tathawade nursery for Western Ghats durability.";
  if (currentFrameIndex >= 7 && currentFrameIndex < 14) {
    stageTitle = "Architectural Foliage & Terrain Shaping";
    stageSubtitle = "Sculpted earth berms, basalt retaining planters, and grand access avenue canopy trees.";
  } else if (currentFrameIndex >= 14) {
    stageTitle = "Living Estates Engineered to Endure";
    stageSubtitle = "Turnkey vegetative installation with automated microclimate fertigation for premier developers.";
  }

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[260vh] bg-green-900 border-b border-green-700/40"
      aria-label="Cinematic Landscape Parallax Sequence"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Instant Fallback Frame 1 to guarantee 0ms blank screen */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/frames/ezgif-frame-001.jpg"
            alt="Green Gallery Landscape Parallax Hero"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>

        {/* HTML5 Canvas rendering 120fps smooth video scrubbing */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 via-green-900/35 to-green-900/60 pointer-events-none" />

        {/* Central Brand Hero Typography (prominently visible at start of sequence) */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl px-4 text-center z-10 transition-opacity duration-500 pointer-events-none ${
            currentFrameIndex > 4 ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream-50/15 border border-cream-50/25 text-cream-50 text-xs tracking-wider uppercase mb-5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-gold-600 animate-pulse" />
            <span>Landscape Architecture & Specimen Nursery · Pune</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold tracking-tight text-cream-50 leading-[0.95] drop-shadow-md mb-5">
            Green Gallery
          </h1>

          <p className="text-cream-50/95 text-lg sm:text-xl md:text-2xl font-light max-w-2xl mx-auto leading-relaxed mb-8 drop-shadow">
            {siteConfig.tagline}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto">
            <Link
              href="/contact?type=consultation"
              className="w-full sm:w-auto min-h-[52px] px-8 py-3.5 bg-cream-50 hover:bg-cream-200 text-green-900 font-medium text-base rounded-brand shadow-lg transition-colors cursor-pointer flex items-center justify-center"
            >
              Book a Site Consultation
            </Link>
            <Link
              href="/gallery"
              className="w-full sm:w-auto min-h-[52px] px-8 py-3.5 border border-cream-50 hover:bg-cream-50/15 text-cream-50 font-medium text-base rounded-brand transition-colors cursor-pointer flex items-center justify-center backdrop-blur-sm"
            >
              View Our Work
            </Link>
          </div>
        </div>

        {/* Narrative Card Overlay (advances dynamically as user scrubs through frames) */}
        <div className="absolute bottom-10 inset-x-4 sm:inset-x-8 max-w-[1200px] mx-auto pointer-events-none z-10 flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
          <div className="bg-green-900/90 backdrop-blur-md border border-green-700/60 p-5 sm:p-7 rounded-brand max-w-xl shadow-2xl">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs uppercase tracking-widest text-gold-600 font-semibold">
                Landscape In Motion
              </span>
              <span className="text-xs text-cream-50/50">
                · Frame {currentFrameIndex + 1} of {TOTAL_FRAMES}
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-cream-50 leading-tight mb-1.5">
              {stageTitle}
            </h2>
            <p className="text-cream-50/80 text-xs sm:text-sm leading-relaxed">
              {stageSubtitle}
            </p>
          </div>

          {/* Interactive Scroll Cue */}
          <div className="hidden sm:flex items-center gap-3 px-4 py-2.5 bg-cream-50/15 backdrop-blur-md border border-cream-50/25 rounded-full text-cream-50 text-xs tracking-wider uppercase shadow-md">
            <span>Scroll down to explore landscape</span>
            <svg className="w-4 h-4 animate-bounce text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        {/* Loading badge if buffering */}
        {loadedCount < TOTAL_FRAMES && (
          <div className="absolute top-6 right-6 z-20 px-3 py-1 bg-green-900/80 backdrop-blur-sm text-cream-50/70 text-[11px] rounded-full border border-green-700/50">
            Buffering sequence: {loadedCount}/{TOTAL_FRAMES}
          </div>
        )}
      </div>
    </section>
  );
}
