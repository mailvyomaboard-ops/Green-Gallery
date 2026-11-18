"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  Building2,
  Layers,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Play,
  Film,
  Camera,
  MessageSquare,
  Phone,
  Mail,
  Send,
  FileText,
  Maximize2,
  Calendar,
  Ruler,
  Clock,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { initialArchitectureCards } from "@/lib/data";
import { ArchitectureCard } from "@/lib/types";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function ArchitectureDesignPage() {
  const [cards, setCards] = useState<ArchitectureCard[]>(initialArchitectureCards);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeMediaTab, setActiveMediaTab] = useState<Record<string, "image" | "video">>({});
  const [isPlayingVideo, setIsPlayingVideo] = useState<Record<string, boolean>>({});

  // Form state
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    organization: "",
    role: "Architect / Consultant",
    projectType: "Podium & Deck Architecture",
    scaleArea: "",
    location: "",
    stage: "Planning & Concepts",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    fetch("/api/architecture")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.cards) && data.cards.length > 0) {
          setCards(data.cards);
        }
      })
      .catch(() => {});
  }, []);

  const categories = [
    "All",
    "Podium & Deck Architecture",
    "Master Landscape Planning",
    "3D Modeling & CAD",
    "Villa & Estate Architecture",
    "Biophilic Commercial Design",
  ];

  const filteredCards = selectedCategory === "All"
    ? cards
    : cards.filter((c) => c.category === selectedCategory);

  const toggleMediaTab = (cardId: string, tab: "image" | "video") => {
    setActiveMediaTab((prev) => ({ ...prev, [cardId]: tab }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "consultation",
          name: form.name,
          phone: form.phone,
          email: form.email,
          company: form.organization,
          clientType: form.role,
          projectType: `Architecture & Design: ${form.projectType}`,
          approxArea: form.scaleArea,
          siteLocation: form.location,
          projectStage: form.stage,
          message: form.message,
          sourcePage: "/architecture",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to send consultation inquiry. Please try WhatsApp directly.");
      }

      setSubmitSuccess(true);
      setForm({
        name: "",
        phone: "",
        email: "",
        organization: "",
        role: "Architect / Consultant",
        projectType: "Podium & Deck Architecture",
        scaleArea: "",
        location: "",
        stage: "Planning & Concepts",
        message: "",
      });
    } catch (err: any) {
      setSubmitError(err.message || "An error occurred while submitting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate customized WhatsApp consultation text
  const generateWhatsAppUrl = () => {
    const text = `Hello GreenGallery Architecture & Design Team,%0A%0AI'm interested in discussing an architectural landscape collaboration:%0A- Name: ${form.name || "Interested Client"}%0A- Organization: ${form.organization || "N/A"} (${form.role})%0A- Project Type: ${form.projectType}%0A- Approximate Scale: ${form.scaleArea || "To be discussed"}%0A- Location: ${form.location || "Pune / Maharashtra"}%0A- Scope Brief: ${encodeURIComponent(form.message || "Looking for conceptual architectural designs, 3D modeling, and execution.")}`;
    return `https://wa.me/917823080251?text=${text}`;
  };

  const instagramDmUrl = "https://ig.me/m/greengallery_landscaping";
  const instagramProfileUrl = siteConfig.social.instagram || "https://www.instagram.com/greengallery_landscaping/";

  return (
    <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-16 sm:space-y-24">
      {/* 1. ARCHITECTURAL HERO SECTION */}
      <section className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#05140D] via-[#0A2218] to-[#040E0A] text-white p-6 sm:p-12 md:p-16 border border-green-800/40 shadow-2xl">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(#2d6a4f_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        </div>

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-cream-50 text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-4 h-4 text-emerald-400 animate-spin-slow" />
            <span>Architecture, 3D Modeling & Civil Integration</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.08] drop-shadow-md">
            Where Living Flora Meets Structural Architecture
          </h1>

          <div className="text-base sm:text-xl md:text-2xl font-serif italic text-amber-200/90 font-light tracking-wide drop-shadow">
            Architectural Masterplans, Suspended Podiums &amp; 3D Environmental Design
          </div>

          <p className="text-white/85 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-3xl">
            We collaborate with architectural studios, principal structural consultants, and real estate developers to design and execute living botanical envelopes. From millimeter-precise CAD coordination and structural dead-load mitigation to kinetic water features and micro-forest wind corridors, Green Gallery engineers landscapes that elevate human habitation.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10 text-left">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="font-display text-xl sm:text-2xl font-black text-emerald-400">45k+ sq ft</div>
              <div className="text-[11px] text-white/70 font-mono uppercase tracking-wider">Podium Decks Engineered</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="font-display text-xl sm:text-2xl font-black text-amber-300">100%</div>
              <div className="text-[11px] text-white/70 font-mono uppercase tracking-wider">Civil &amp; MEP Coordinated</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="font-display text-xl sm:text-2xl font-black text-emerald-400">&lt; 350 kg/m²</div>
              <div className="text-[11px] text-white/70 font-mono uppercase tracking-wider">Lightweight Media Slabs</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="font-display text-xl sm:text-2xl font-black text-amber-300">RERA Ready</div>
              <div className="text-[11px] text-white/70 font-mono uppercase tracking-wider">Turnkey BOQ Integrity</div>
            </div>
          </div>

          {/* Quick Action Jump Links */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <a
              href="#connect-form"
              className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-green-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-glow transition-all flex items-center gap-2"
            >
              <span>Connect With Design Team</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={generateWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Direct WhatsApp Chat</span>
            </a>
            <a
              href={instagramProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-600/80 to-purple-600/80 hover:opacity-100 text-white font-semibold text-xs uppercase tracking-wider border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>Studio Reels &amp; DM</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC MULTIMEDIA SHOWCASE CARDS (IMG / VIDEO / TEXT) */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-green-900/10 dark:border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-green-700 dark:text-emerald-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Design Portfolios &amp; Master Models</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-950 dark:text-white tracking-tight">
              Architectural Design Showcase
            </h2>
            <p className="text-sm text-ink-700 dark:text-white/70 mt-2 font-light max-w-2xl leading-relaxed">
              Explore dynamic multi-format project studies combining high-resolution site photography, 3D video walkthroughs, and structural civil documentation.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-green-950 dark:bg-emerald-600 text-cream-50 shadow-sm"
                    : "bg-white dark:bg-[#121915] text-ink-700 dark:text-white/80 hover:bg-cream-100 dark:hover:bg-white/10 border border-green-900/10 dark:border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCards.map((card) => {
            const hasImage = Boolean(card.image && card.image.trim().length > 0);
            const hasVideo = Boolean(card.video && card.video.trim().length > 0);
            const activeTab = activeMediaTab[card.id] || (hasVideo && !hasImage ? "video" : "image");

            return (
              <article
                key={card.id}
                className="bg-white dark:bg-[#080D0A] rounded-3xl overflow-hidden border border-green-900/10 dark:border-white/10 shadow-soft hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Media Bay: Image, Video, or Toggle */}
                  {(hasImage || hasVideo) ? (
                    <div className="relative w-full h-64 sm:h-72 bg-black overflow-hidden">
                      {/* Media selector pill if both image & video exist */}
                      {hasImage && hasVideo && (
                        <div className="absolute top-3 right-3 z-30 flex items-center gap-1 bg-black/70 backdrop-blur-md p-1 rounded-full border border-white/20">
                          <button
                            onClick={() => toggleMediaTab(card.id, "image")}
                            className={`p-1.5 rounded-full text-xs transition-colors ${
                              activeTab === "image" ? "bg-emerald-500 text-green-950 font-bold" : "text-white/70 hover:text-white"
                            }`}
                            title="Show Still Image"
                          >
                            <Camera className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleMediaTab(card.id, "video")}
                            className={`p-1.5 rounded-full text-xs transition-colors ${
                              activeTab === "video" ? "bg-emerald-500 text-green-950 font-bold" : "text-white/70 hover:text-white"
                            }`}
                            title="Play Video Walkthrough"
                          >
                            <Film className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {/* Display Image */}
                      {activeTab === "image" && hasImage && (
                        <div className="relative w-full h-full">
                          <Image
                            src={card.image!}
                            alt={card.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, 420px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        </div>
                      )}

                      {/* Display Video */}
                      {(activeTab === "video" || !hasImage) && hasVideo && (
                        <div className="relative w-full h-full bg-black flex items-center justify-center">
                          {card.video?.includes("youtube.com") || card.video?.includes("youtu.be") || card.video?.includes("vimeo.com") ? (
                            <iframe
                              src={card.video}
                              title={card.title}
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <video
                              src={card.video}
                              controls
                              playsInline
                              preload="metadata"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      )}

                      {/* Category Badge & Scale */}
                      <div className="absolute bottom-3 left-3 z-20 flex flex-wrap items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full bg-green-950/90 text-emerald-300 text-[10px] font-mono font-bold uppercase tracking-wider border border-emerald-500/30 backdrop-blur-sm">
                          {card.category}
                        </span>
                        {card.scaleArea && (
                          <span className="px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] font-mono tracking-wider border border-white/20 backdrop-blur-sm">
                            {card.scaleArea}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Text-Only Architectural Manifesto Card Frame */
                    <div className="relative w-full p-6 bg-gradient-to-br from-green-950 via-[#0B2418] to-[#040E0A] text-white border-b border-green-800/30">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[10px] font-mono uppercase tracking-wider border border-white/20">
                          {card.category}
                        </span>
                        <Compass className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1">
                        Technical Manifesto &amp; Framework
                      </div>
                      {card.scaleArea && (
                        <span className="text-[11px] text-white/70 font-mono">
                          Scale: {card.scaleArea}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Text Content Bay */}
                  <div className="p-6 space-y-3">
                    <h3 className="font-display text-xl font-bold text-green-950 dark:text-white group-hover:text-green-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">
                      {card.title}
                    </h3>
                    {card.subtitle && (
                      <p className="text-xs text-amber-800 dark:text-amber-300/90 font-serif italic tracking-wide">
                        {card.subtitle}
                      </p>
                    )}
                    <p className="text-xs text-ink-700 dark:text-white/70 font-light leading-relaxed line-clamp-4">
                      {card.description}
                    </p>

                    {/* Technical details list */}
                    {card.details && card.details.length > 0 && (
                      <ul className="pt-2 space-y-1.5 border-t border-cream-200 dark:border-white/10 text-[11px] text-ink-600 dark:text-white/80">
                        {card.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Tags */}
                    {card.tags && card.tags.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-1.5">
                        {card.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-cream-100 dark:bg-white/5 text-ink-700 dark:text-white/60 border border-green-900/10 dark:border-white/10"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer CTA */}
                <div className="p-6 pt-0">
                  <a
                    href="#connect-form"
                    onClick={() => setForm((prev) => ({ ...prev, projectType: card.category, message: `I would like to consult with your architecture team about projects similar to "${card.title}".` }))}
                    className="w-full py-2.5 px-4 rounded-xl bg-cream-100 dark:bg-white/5 hover:bg-green-950 hover:text-white dark:hover:bg-emerald-600 text-green-950 dark:text-white text-xs font-semibold flex items-center justify-between border border-green-900/10 dark:border-white/10 transition-all group-hover:border-emerald-500/40"
                  >
                    <span>Request Consultation for this Scope</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 3. "CONNECT WITH US" ARCHITECTURE & DESIGN FORM */}
      <section id="connect-form" className="relative rounded-[2rem] sm:rounded-[2.5rem] bg-cream-50 dark:bg-[#07100B] border border-green-900/15 dark:border-white/10 p-6 sm:p-10 md:p-14 shadow-soft">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Connect & Studio Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-100 dark:bg-emerald-950/60 border border-green-800/20 text-green-900 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>Direct Studio Channel</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-green-950 dark:text-white tracking-tight">
              Connect With Our Architecture &amp; Design Studio
            </h2>

            <p className="text-sm text-ink-700 dark:text-white/70 font-light leading-relaxed">
              Whether you are an architectural firm planning a sustainable building envelope, a developer finalizing podium drawings, or a private client envisioning an estate sanctuary, our horticultural architects are ready to review your floor plans and technical schematics.
            </p>

            {/* Direct Connect Matrix Cards */}
            <div className="space-y-4 pt-2">
              {/* WhatsApp Card */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1812] border border-green-900/10 dark:border-white/10 shadow-xs flex flex-col justify-between space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-green-950 dark:text-white text-base">
                      Instant WhatsApp Studio Desk
                    </h3>
                    <p className="text-xs text-ink-600 dark:text-white/70">
                      Share PDF drawings, CAD layouts, and get direct voice/chat feedback with our lead director.
                    </p>
                  </div>
                </div>
                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open WhatsApp Consultation (+91 78230 80251)</span>
                </a>
              </div>

              {/* Instagram Card */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1812] border border-green-900/10 dark:border-white/10 shadow-xs flex flex-col justify-between space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500 shrink-0">
                    <InstagramIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-green-950 dark:text-white text-base">
                      GreenGallery Official Instagram
                    </h3>
                    <p className="text-xs text-ink-600 dark:text-white/70">
                      Watch live architectural execution reels, 3D renders, and send direct messages to our studio team.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href={instagramProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white font-semibold text-xs transition-all"
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                    <span>View @greengallery_landscaping</span>
                  </a>
                  <a
                    href={instagramDmUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white dark:bg-white/10 border border-green-900/15 dark:border-white/15 text-green-950 dark:text-white font-semibold text-xs hover:bg-cream-100 dark:hover:bg-white/20 transition-all"
                  >
                    <span>DM Floor Plans</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Direct Phone & Email */}
              <div className="p-4 rounded-2xl bg-cream-100/70 dark:bg-white/5 border border-green-900/10 dark:border-white/10 text-xs space-y-2">
                <div className="flex items-center gap-2 text-ink-800 dark:text-white">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Direct Studio Line: </span>
                  <a href={`tel:${siteConfig.contact.phone}`} className="font-bold underline hover:text-emerald-600">
                    {siteConfig.contact.phoneDisplay}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-ink-800 dark:text-white">
                  <Mail className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Studio Email: </span>
                  <a href={`mailto:${siteConfig.contact.email}`} className="font-bold underline hover:text-emerald-600">
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Consultation Request Form */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0A140F] p-6 sm:p-8 rounded-3xl border border-green-900/15 dark:border-white/10 shadow-sm space-y-6">
            <div>
              <h3 className="font-display text-2xl font-bold text-green-950 dark:text-white">
                Submit an Architectural Project Brief
              </h3>
              <p className="text-xs text-ink-600 dark:text-white/60 mt-1">
                Fill in the details below. Our technical landscape team responds within 24 business hours with BOQ and initial feasibility notes.
              </p>
            </div>

            {submitSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 text-emerald-900 dark:text-emerald-200 text-xs flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm">Consultation Request Received!</div>
                  <p className="mt-1">
                    Thank you, {form.name || "Architect"}. Our senior design team has logged your submission. You can also message us directly on WhatsApp to attach large CAD/PDF files.
                  </p>
                  <a
                    href={generateWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 font-bold text-emerald-700 dark:text-emerald-300 underline"
                  >
                    <span>Send PDF drawings on WhatsApp now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {submitError && (
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-500/40 text-red-900 dark:text-red-200 text-xs">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-green-950 dark:text-white mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ar. Vikram Sharma / Rahul Mehta"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-green-900/20 dark:border-white/10 bg-cream-50/50 dark:bg-black/30 text-xs text-ink-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-green-950 dark:text-white mb-1.5">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-green-900/20 dark:border-white/10 bg-cream-50/50 dark:bg-black/30 text-xs text-ink-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-green-950 dark:text-white mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="studio@architects.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-green-900/20 dark:border-white/10 bg-cream-50/50 dark:bg-black/30 text-xs text-ink-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-green-950 dark:text-white mb-1.5">
                    Organization / Firm / Client Role
                  </label>
                  <input
                    type="text"
                    placeholder="Sharma Design Studio / Real Estate Firm"
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-green-900/20 dark:border-white/10 bg-cream-50/50 dark:bg-black/30 text-xs text-ink-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-green-950 dark:text-white mb-1.5">
                    Project Scope
                  </label>
                  <select
                    value={form.projectType}
                    onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-green-900/20 dark:border-white/10 bg-cream-50/50 dark:bg-black/30 text-xs text-ink-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Podium & Deck Architecture">Podium &amp; Deck Architecture</option>
                    <option value="Master Landscape Planning">Master Landscape Planning</option>
                    <option value="3D Modeling & CAD">3D Modeling &amp; CAD</option>
                    <option value="Villa & Estate Architecture">Villa &amp; Estate Architecture</option>
                    <option value="Biophilic Commercial Design">Biophilic Commercial Design</option>
                    <option value="Urban Micro-Ecosystems">Urban Micro-Ecosystems</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-green-950 dark:text-white mb-1.5">
                    Approx. Scale / Area
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 25,000 sq ft / 2 Acres"
                    value={form.scaleArea}
                    onChange={(e) => setForm({ ...form, scaleArea: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-green-900/20 dark:border-white/10 bg-cream-50/50 dark:bg-black/30 text-xs text-ink-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-green-950 dark:text-white mb-1.5">
                    Project Stage
                  </label>
                  <select
                    value={form.stage}
                    onChange={(e) => setForm({ ...form, stage: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-green-900/20 dark:border-white/10 bg-cream-50/50 dark:bg-black/30 text-xs text-ink-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Planning & Concepts">Planning &amp; Concepts</option>
                    <option value="Civil Structure Ready">Civil Structure Ready</option>
                    <option value="Interior / Finishing Stage">Interior / Finishing Stage</option>
                    <option value="Existing Landscape Renovation">Existing Renovation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-green-950 dark:text-white mb-1.5">
                  Project Brief, Location &amp; Technical Requirements
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your site location, structural slab parameters, architectural vision, water sources, or target possession milestones..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-green-900/20 dark:border-white/10 bg-cream-50/50 dark:bg-black/30 text-xs text-ink-900 dark:text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-green-950 hover:bg-green-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "Submitting Brief..." : "Submit Architectural Brief"}</span>
                </button>

                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4 text-[#25D366]" />
                  <span>Prefer WhatsApp? Launch Pre-filled Chat</span>
                </a>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
