"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, Pause, Maximize2, X, ChevronLeft, ChevronRight, Video, Camera, Sparkles, MapPin } from "lucide-react";

interface MediaImage {
  url: string;
  caption?: string;
  alt?: string;
}

interface ProjectMediaGalleryProps {
  title: string;
  location: string;
  coverImage: string;
  videoUrl?: string;
  images: MediaImage[];
}

export default function ProjectMediaGallery({
  title,
  location,
  coverImage,
  videoUrl,
  images,
}: ProjectMediaGalleryProps) {
  const [activeTab, setActiveTab] = useState<"photos" | "video">("photos");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Filter valid images and ensure coverImage is included if not in gallery
  const allImages = React.useMemo(() => {
    const list = images.filter((img) => Boolean(img.url));
    if (coverImage && !list.some((img) => img.url === coverImage)) {
      list.unshift({ url: coverImage, caption: `${title} - Cover Showcase`, alt: title });
    }
    return list;
  }, [images, coverImage, title]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % allImages.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + allImages.length) % allImages.length);
    }
  };

  return (
    <div className="space-y-6">
      {/* Media Type Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-green-900/10 dark:border-white/10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("photos")}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "photos"
                ? "bg-green-950 dark:bg-emerald-600 text-white shadow-md"
                : "bg-cream-100 dark:bg-white/10 text-ink-700 dark:text-white/70 hover:bg-cream-200 dark:hover:bg-white/20"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Photo Gallery ({allImages.length})</span>
          </button>

          {videoUrl && (
            <button
              onClick={() => setActiveTab("video")}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "video"
                  ? "bg-green-950 dark:bg-emerald-600 text-white shadow-md"
                  : "bg-cream-100 dark:bg-white/10 text-ink-700 dark:text-white/70 hover:bg-cream-200 dark:hover:bg-white/20"
              }`}
            >
              <Video className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Video Walkthrough</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-ink-500 dark:text-white/60">
          <MapPin className="w-3.5 h-3.5 text-emerald-500" />
          <span>Site Media: {location}</span>
        </div>
      </div>

      {/* VIDEO TAB VIEW */}
      {activeTab === "video" && videoUrl && (
        <div className="relative rounded-3xl overflow-hidden bg-black border border-green-900/20 dark:border-white/15 shadow-2xl group">
          <div className="relative w-full aspect-video max-h-[580px] flex items-center justify-center bg-black">
            <video
              src={videoUrl}
              poster={coverImage || allImages[0]?.url}
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-contain"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="p-4 sm:p-5 bg-gradient-to-t from-black via-black/90 to-black/70 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-white/10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>On-Site Video Walkthrough</span>
              </div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white">
                {title} — Botanical &amp; Architectural Video Tour
              </h3>
            </div>
            <span className="text-xs text-white/60 font-mono">
              Site Location: {location}
            </span>
          </div>
        </div>
      )}

      {/* PHOTOS TAB VIEW */}
      {activeTab === "photos" && (
        <div className="space-y-6">
          {/* Main Hero Photo Card */}
          <div
            onClick={() => openLightbox(0)}
            className="relative h-[320px] sm:h-[460px] md:h-[520px] w-full rounded-3xl overflow-hidden shadow-xl border border-green-900/10 dark:border-white/10 group cursor-pointer bg-green-950"
          >
            <Image
              src={allImages[0]?.url || coverImage}
              alt={allImages[0]?.alt || title}
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 1240px) 100vw, 1240px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

            {/* Overlaid Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-mono font-bold text-emerald-300 uppercase tracking-wider border border-white/15">
                Primary Showcase
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md text-[11px] font-mono text-white border border-emerald-500/30 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>{location}</span>
              </span>
            </div>

            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
              <div className="max-w-2xl text-white">
                <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold leading-tight text-white drop-shadow">
                  {title}
                </h3>
                {allImages[0]?.caption && (
                  <p className="text-xs sm:text-sm text-white/85 font-light mt-1 drop-shadow">
                    {allImages[0].caption}
                  </p>
                )}
              </div>

              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold shrink-0 group-hover:bg-white/30 transition-all border border-white/20">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Click to Expand</span>
              </div>
            </div>
          </div>

          {/* Secondary Thumbnail Grid */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {allImages.slice(1).map((img, idx) => (
                <div
                  key={idx + 1}
                  onClick={() => openLightbox(idx + 1)}
                  className="relative h-40 sm:h-48 rounded-2xl overflow-hidden shadow-soft border border-green-900/10 dark:border-white/10 group cursor-pointer bg-green-950"
                >
                  <Image
                    src={img.url}
                    alt={img.alt || `${title} photo ${idx + 2}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    sizes="(max-width: 768px) 50vw, 280px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                  <div className="absolute bottom-2 left-2 right-2 text-white text-[11px] font-medium line-clamp-1 leading-tight">
                    {img.caption || `Angle #${idx + 2}`}
                  </div>

                  <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-8"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            aria-label="Close image viewer"
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev button */}
          {allImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next button */}
          {allImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Lightbox Content Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center"
          >
            <div className="relative w-full h-[60vh] sm:h-[75vh]">
              <Image
                src={allImages[lightboxIndex]?.url}
                alt={allImages[lightboxIndex]?.alt || title}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            <div className="mt-3 text-center text-white space-y-1 max-w-2xl px-4">
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                Image {lightboxIndex + 1} of {allImages.length} · {location}
              </div>
              <p className="text-sm text-white/90 font-light">
                {allImages[lightboxIndex]?.caption || title}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
