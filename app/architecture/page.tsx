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
  ChevronRight,
  TreePine,
  Check,
  Shovel,
  Droplets,
  Flower2,
  Sun,
  Award,
  Users2,
  Warehouse,
  Briefcase
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
    serviceType: "Podium & Terrace Gardens",
    approxArea: "",
    location: "",
    stage: "Concept & Planning",
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
    "Podium & Terrace Gardens",
    "Water Features & Hardscape",
    "Villa & Residential Landscaping",
    "Sustainable Landscape Planning",
    "Commercial & Industrial Landscaping",
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
          clientType: form.organization ? "Organization / Firm" : "Individual Property Owner",
          projectType: `Architecture & Design: ${form.serviceType}`,
          approxArea: form.approxArea,
          siteLocation: form.location,
          projectStage: form.stage,
          message: form.message,
          sourcePage: "/architecture",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to send consultation inquiry. Please connect with us directly on WhatsApp.");
      }

      setSubmitSuccess(true);
      setForm({
        name: "",
        phone: "",
        email: "",
        organization: "",
        serviceType: "Podium & Terrace Gardens",
        approxArea: "",
        location: "",
        stage: "Concept & Planning",
        message: "",
      });
    } catch (err: any) {
      setSubmitError(err.message || "An error occurred while submitting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate customized WhatsApp consultation text
  const generateWhatsAppUrl = (customTopic?: string) => {
    const text = `Hello GreenGallery Landscape Team,%0A%0AI would like to discuss a landscape project:%0A- Name: ${form.name || "Prospective Client"}%0A- Organization: ${form.organization || "Individual Client"}%0A- Service: ${customTopic || form.serviceType}%0A- Approximate Area: ${form.approxArea || "To be confirmed"}%0A- Location: ${form.location || "Pune / Maharashtra"}%0A- Details: ${encodeURIComponent(form.message || "Looking for landscape planning, 3D design, plant supply, and execution.")}`;
    return `https://wa.me/917823080251?text=${text}`;
  };

  const instagramProfileUrl = siteConfig.social.instagram || "https://www.instagram.com/greengallery_landscaping/";
  const instagramDmUrl = "https://ig.me/m/greengallery_landscaping";

  return (
    <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION: GROUNDED & PROFESSIONAL POSITIONING */}
      <section className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#06170F] via-[#0B251A] to-[#04100A] text-white p-6 sm:p-12 md:p-16 border border-emerald-900/30 shadow-2xl">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(#2d6a4f_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        </div>

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-cream-50 text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Landscape Architecture, 3D Design &amp; Civil Coordination</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.08] drop-shadow-md">
            Where Nature Meets Thoughtful Design
          </h1>

          <div className="text-base sm:text-xl md:text-2xl font-serif italic text-amber-200/90 font-light tracking-wide drop-shadow">
            Integrated Landscape Planning, 3D Visualization &amp; Turnkey Execution
          </div>

          <p className="text-white/85 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-3xl">
            GreenGallery works with architects, developers, contractors and property owners to transform outdoor spaces into functional green environments. From podium gardens and terrace landscapes to commercial landscapes and botanical installations, we coordinate design, material selection, plantation and execution with attention to site conditions, drainage, irrigation and maintenance requirements.
          </p>

          {/* Core Philosophy Badge */}
          <div className="inline-flex items-center gap-2 text-xs font-mono font-medium tracking-widest text-emerald-300 uppercase py-1 px-3 rounded-lg bg-emerald-950/60 border border-emerald-500/30">
            <span>Design</span>
            <span className="text-emerald-500">•</span>
            <span>Coordinate</span>
            <span className="text-emerald-500">•</span>
            <span>Execute</span>
            <span className="text-emerald-500">•</span>
            <span>Maintain</span>
          </div>

          {/* Quick Metrics Bar: Grounded & Realistic */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10 text-left">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="font-display text-xl sm:text-2xl font-black text-emerald-400">100+</div>
              <div className="text-[11px] text-white/70 font-mono uppercase tracking-wider mt-0.5">Projects Executed Across Pune</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="font-display text-xl sm:text-2xl font-black text-amber-300">Civil &amp; Drip</div>
              <div className="text-[11px] text-white/70 font-mono uppercase tracking-wider mt-0.5">Irrigation Coordination</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="font-display text-xl sm:text-2xl font-black text-emerald-400">Lightweight</div>
              <div className="text-[11px] text-white/70 font-mono uppercase tracking-wider mt-0.5">Media Planning for Slabs</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="font-display text-xl sm:text-2xl font-black text-amber-300">Detailed BOQ</div>
              <div className="text-[11px] text-white/70 font-mono uppercase tracking-wider mt-0.5">Scope &amp; Plant Schedules</div>
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
              <span>Instagram Portfolio</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. WHAT WE ACTUALLY DELIVER: 6 TANGIBLE SERVICES */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Comprehensive Capabilities</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-950 dark:text-white tracking-tight">
            What We Actually Deliver
          </h2>
          <p className="text-sm sm:text-base text-ink-700 dark:text-white/70 font-light leading-relaxed">
            From preliminary concepts and 3D visualization to direct nursery plant sourcing, on-site execution, and ongoing maintenance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Service 1 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0A140F] border border-green-900/10 dark:border-white/10 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Shovel className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-green-950 dark:text-white">
              Turnkey Landscape Execution
            </h3>
            <p className="text-xs sm:text-sm text-ink-700 dark:text-white/70 leading-relaxed">
              Complete on-site execution for developers, corporate campuses, and private residences. We manage ground preparation, soil enrichment, specimen planting, natural stone stepping pathways, and peripheral fencing.
            </p>
            <div className="pt-2 border-t border-green-900/5 dark:border-white/5 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
              Ground Prep • Hardscape • Turnkey Planting
            </div>
          </div>

          {/* Service 2 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0A140F] border border-green-900/10 dark:border-white/10 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-green-950 dark:text-white">
              3D Landscape Design &amp; Planning
            </h3>
            <p className="text-xs sm:text-sm text-ink-700 dark:text-white/70 leading-relaxed">
              Comprehensive landscape masterplanning and realistic 3D visualizations. We help clients visualize spatial zoning, light patterns, plant palettes, and water feature integration before any physical work begins.
            </p>
            <div className="pt-2 border-t border-green-900/5 dark:border-white/5 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
              Spatial Zoning • 3D Renders • Plant Palettes
            </div>
          </div>

          {/* Service 3 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0A140F] border border-green-900/10 dark:border-white/10 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <TreePine className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-green-950 dark:text-white">
              Plantation &amp; Specimen Supply
            </h3>
            <p className="text-xs sm:text-sm text-ink-700 dark:text-white/70 leading-relaxed">
              Direct nursery sourcing of acclimatized mature trees, exotic palms, flowering shrubs, and groundcovers. We supply handpicked, healthy plant stock tailored to Pune's soil, sun orientation, and micro-climate.
            </p>
            <div className="pt-2 border-t border-green-900/5 dark:border-white/5 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
              Nursery Sourcing • Specimen Palms • Healthy Stock
            </div>
          </div>

          {/* Service 4 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0A140F] border border-green-900/10 dark:border-white/10 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-green-950 dark:text-white">
              Terrace &amp; Podium Gardens
            </h3>
            <p className="text-xs sm:text-sm text-ink-700 dark:text-white/70 leading-relaxed">
              Specialized elevated garden planning for residential podiums and penthouse terraces. Engineered with lightweight growing media, drainage cell layers, root barrier protection, and water-efficient drip irrigation.
            </p>
            <div className="pt-2 border-t border-green-900/5 dark:border-white/5 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
              Lightweight Soils • Drainage Cells • Root Protection
            </div>
          </div>

          {/* Service 5 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0A140F] border border-green-900/10 dark:border-white/10 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Flower2 className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-green-950 dark:text-white">
              Interior &amp; Balcony Plantscaping
            </h3>
            <p className="text-xs sm:text-sm text-ink-700 dark:text-white/70 leading-relaxed">
              Air-purifying botanical installations for luxury living rooms, corporate reception lobbies, and apartment balconies. We select low-light resilient varieties with premium self-watering or weather-resistant planters.
            </p>
            <div className="pt-2 border-t border-green-900/5 dark:border-white/5 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
              Indoor Flora • Architectural Planters • Low-Light Plants
            </div>
          </div>

          {/* Service 6 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0A140F] border border-green-900/10 dark:border-white/10 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-green-950 dark:text-white">
              Ongoing Maintenance &amp; AMC
            </h3>
            <p className="text-xs sm:text-sm text-ink-700 dark:text-white/70 leading-relaxed">
              Reliable scheduled garden maintenance contracts for housing societies, bungalows, and commercial facilities. Includes seasonal pruning, lawn mowing, organic pest prevention, fertilization, and drip network servicing.
            </p>
            <div className="pt-2 border-t border-green-900/5 dark:border-white/5 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
              Pruning &amp; Lawn Care • Organic Fertilizers • AMC Visits
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR EXECUTION PROCESS: 6 STEP ROADMAP */}
      <section className="p-8 sm:p-12 rounded-3xl bg-cream-50 dark:bg-[#08120B] border border-green-900/10 dark:border-white/10 space-y-8">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Structured Delivery Roadmap</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-green-950 dark:text-white tracking-tight">
            Our Execution Process
          </h2>
          <p className="text-xs sm:text-sm text-ink-700 dark:text-white/70 font-light leading-relaxed">
            A methodical, step-by-step workflow that ensures design integrity, smooth civil coordination, and healthy botanical longevity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0C1912] border border-green-900/10 dark:border-white/10 relative space-y-3">
            <div className="text-3xl font-display font-black text-emerald-600/30 dark:text-emerald-400/20">01</div>
            <h4 className="font-display font-bold text-green-950 dark:text-white text-base">
              Site Inspection &amp; Requirements Analysis
            </h4>
            <p className="text-xs text-ink-700 dark:text-white/70 leading-relaxed">
              We visit your property to evaluate sunlight patterns, wind exposure, soil quality, existing drainage channels, water sources, and civil structural parameters.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0C1912] border border-green-900/10 dark:border-white/10 relative space-y-3">
            <div className="text-3xl font-display font-black text-emerald-600/30 dark:text-emerald-400/20">02</div>
            <h4 className="font-display font-bold text-green-950 dark:text-white text-base">
              Landscape Planning &amp; 3D Visualization
            </h4>
            <p className="text-xs text-ink-700 dark:text-white/70 leading-relaxed">
              We translate your vision into spatial concept plans, botanical palettes, 3D renderings, and functional zoning diagrams for client and architect review.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0C1912] border border-green-900/10 dark:border-white/10 relative space-y-3">
            <div className="text-3xl font-display font-black text-emerald-600/30 dark:text-emerald-400/20">03</div>
            <h4 className="font-display font-bold text-green-950 dark:text-white text-base">
              Material Selection &amp; Itemized BOQ
            </h4>
            <p className="text-xs text-ink-700 dark:text-white/70 leading-relaxed">
              We provide a transparent, detailed Bill of Quantities with specified plant species, container sizes, soil volumes, irrigation hardware, and timeline milestones.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0C1912] border border-green-900/10 dark:border-white/10 relative space-y-3">
            <div className="text-3xl font-display font-black text-emerald-600/30 dark:text-emerald-400/20">04</div>
            <h4 className="font-display font-bold text-green-950 dark:text-white text-base">
              Site Preparation &amp; Civil Coordination
            </h4>
            <p className="text-xs text-ink-700 dark:text-white/70 leading-relaxed">
              We coordinate closely with site engineers to verify waterproofing integrity, place drainage cells and geotextile filters, and run irrigation plumbing conduits.
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0C1912] border border-green-900/10 dark:border-white/10 relative space-y-3">
            <div className="text-3xl font-display font-black text-emerald-600/30 dark:text-emerald-400/20">05</div>
            <h4 className="font-display font-bold text-green-950 dark:text-white text-base">
              Plantation &amp; Landscape Installation
            </h4>
            <p className="text-xs text-ink-700 dark:text-white/70 leading-relaxed">
              Our trained horticultural workforce delivers acclimatized plant specimens, enriches growing media, positions focal specimen trees, installs turf, and tests drip systems.
            </p>
          </div>

          {/* Step 6 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0C1912] border border-green-900/10 dark:border-white/10 relative space-y-3">
            <div className="text-3xl font-display font-black text-emerald-600/30 dark:text-emerald-400/20">06</div>
            <h4 className="font-display font-bold text-green-950 dark:text-white text-base">
              Maintenance &amp; Ongoing Support
            </h4>
            <p className="text-xs text-ink-700 dark:text-white/70 leading-relaxed">
              We hand over a comprehensive care schedule and offer scheduled AMC visits covering nutrient feeding, pest management, trimming, and irrigation adjustments.
            </p>
          </div>
        </div>
      </section>

      {/* 4. 3D LANDSCAPE CONCEPTS & DESIGN VISUALIZATIONS SHOWCASE */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-green-900/10 dark:border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Visual Concepts &amp; Planning Studies</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-950 dark:text-white tracking-tight">
              3D Landscape Concepts &amp; Design Studies
            </h2>
            <p className="text-sm text-ink-700 dark:text-white/70 mt-2 font-light max-w-2xl leading-relaxed">
              The following studies illustrate our 3D conceptual modeling, spatial zoning, and botanical layering methodologies prior to on-site execution.
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

        {/* Informative Concept Disclaimer Note */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300/60 dark:border-amber-700/40 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            <strong>Note on Design Studies:</strong> These project descriptions represent 3D design concepts and planning models. Final execution specifications are tailored to each site’s structural drawings, client preferences, and local civil conditions.
          </span>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCards.map((card) => {
            const hasVideo = Boolean(card.video && card.video.trim().length > 0);
            const activeTab = activeMediaTab[card.id] || "image";

            return (
              <div
                key={card.id}
                className="group rounded-3xl overflow-hidden bg-white dark:bg-[#0D1812] border border-green-900/15 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Media Container with Multi-tab switcher (Img / Video) */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
                    {/* Concept Study Badge */}
                    <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono uppercase tracking-wider text-amber-300">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>3D Concept Study</span>
                    </div>

                    {/* Scale Tag */}
                    {card.scaleArea && (
                      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 text-[10px] font-mono text-emerald-300">
                        <Ruler className="w-3 h-3" />
                        <span>{card.scaleArea}</span>
                      </div>
                    )}

                    {/* Media switcher pills if video exists */}
                    {hasVideo && (
                      <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1 p-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20">
                        <button
                          onClick={() => toggleMediaTab(card.id, "image")}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 transition-all ${
                            activeTab === "image" ? "bg-white text-black" : "text-white/70 hover:text-white"
                          }`}
                        >
                          <Camera className="w-3 h-3" />
                          <span>Image</span>
                        </button>
                        <button
                          onClick={() => toggleMediaTab(card.id, "video")}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 transition-all ${
                            activeTab === "video" ? "bg-emerald-500 text-green-950 font-bold" : "text-white/70 hover:text-white"
                          }`}
                        >
                          <Film className="w-3 h-3" />
                          <span>Video</span>
                        </button>
                      </div>
                    )}

                    {/* Media Display */}
                    {activeTab === "image" || !hasVideo ? (
                      <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-700">
                        <Image
                          src={card.image || "/images/frames/ezgif-frame-005.jpg"}
                          alt={card.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      </div>
                    ) : (
                      <div className="relative w-full h-full flex items-center justify-center bg-black">
                        <video
                          src={card.video}
                          controls
                          className="w-full h-full object-cover"
                          poster={card.image}
                        />
                      </div>
                    )}

                    {/* Category pill on bottom-left */}
                    <div className="absolute bottom-3 left-3 z-10">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-md text-white border border-white/20">
                        {card.category}
                      </span>
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <h3 className="font-display text-lg sm:text-xl font-bold text-green-950 dark:text-white leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {card.title}
                    </h3>

                    {card.subtitle && (
                      <div className="text-xs font-serif italic text-amber-700 dark:text-amber-300/80">
                        {card.subtitle}
                      </div>
                    )}

                    <p className="text-xs text-ink-700 dark:text-white/70 leading-relaxed font-light">
                      {card.description}
                    </p>

                    {/* Highlighted Scope Points */}
                    {card.details && card.details.length > 0 && (
                      <div className="pt-2 space-y-1.5 border-t border-green-900/10 dark:border-white/10">
                        {card.details.map((detail, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-[11px] text-ink-800 dark:text-white/80">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tags */}
                    {card.tags && card.tags.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-1.5">
                        {card.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-cream-100 dark:bg-white/5 text-green-900 dark:text-emerald-300 font-mono"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 sm:p-5 pt-0">
                  <a
                    href={generateWhatsAppUrl(card.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-green-900/5 hover:bg-emerald-500 dark:bg-white/5 dark:hover:bg-emerald-500 text-green-950 hover:text-green-950 dark:text-white dark:hover:text-green-950 font-bold text-xs uppercase tracking-wider border border-green-900/10 dark:border-white/10 hover:border-transparent transition-all flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:text-green-950" />
                    <span>Enquire About This Concept</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. WHY GREENGALLERY? (CORE COMPETITIVE ADVANTAGES) */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0B251A] to-[#04100A] text-white border border-emerald-900/40 shadow-xl space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-300">
            <Award className="w-3.5 h-3.5" />
            <span>Why Work With Us</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why GreenGallery?
          </h2>
          <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
            The benefits of choosing a dedicated design-to-execution landscaping partner.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="text-emerald-400 font-bold text-sm flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>One-Stop Landscape Solution</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              We handle every stage internally: concept planning, 3D visualization, plant sourcing, soil preparation, planting, and long-term maintenance.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="text-emerald-400 font-bold text-sm flex items-center gap-2">
              <Warehouse className="w-4 h-4 text-emerald-400" />
              <span>Direct Nursery Sourcing Network</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Direct access to leading plant nurseries across Maharashtra and India, ensuring healthy, well-rooted, and acclimatized specimens at competitive rates.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="text-emerald-400 font-bold text-sm flex items-center gap-2">
              <Sun className="w-4 h-4 text-emerald-400" />
              <span>Climate-Appropriate Botanical Selection</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              We recommend species that flourish in Pune's local soil types and temperature variations, avoiding high-mortality ornamental mismatches.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="text-emerald-400 font-bold text-sm flex items-center gap-2">
              <Users2 className="w-4 h-4 text-emerald-400" />
              <span>Experienced Site Execution Teams</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Our supervisors and planting teams understand site safety, clean execution, soil ratios, and smooth coordination with other on-site contractors.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="text-emerald-400 font-bold text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Design-to-Execution Coordination</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              No communication gap between what was rendered on screen and what gets planted on the ground. We execute strictly against agreed drawings and BOQs.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="text-emerald-400 font-bold text-sm flex items-center gap-2">
              <Flower2 className="w-4 h-4 text-emerald-400" />
              <span>Comprehensive Indoor &amp; Outdoor Scope</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              A single reliable vendor capable of managing sprawling commercial boulevards, elevated podium gardens, villa courtyards, and luxury interior plantscaping.
            </p>
          </div>
        </div>
      </section>

      {/* 6. CONNECT WITH GREENGALLERY: STUDIO & PROJECT ENQUIRY */}
      <section id="connect-form" className="space-y-8 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Studio Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                <Compass className="w-3.5 h-3.5" />
                <span>Get In Touch</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-green-950 dark:text-white tracking-tight">
                Connect With GreenGallery
              </h2>
              <p className="text-sm text-ink-700 dark:text-white/70 font-light leading-relaxed">
                Whether you're an architect planning a podium garden, a developer developing a commercial landscape, or a homeowner looking to transform your outdoor space, GreenGallery can help with landscape planning, 3D visualization, plantation selection and execution coordination.
              </p>
            </div>

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
                      WhatsApp Consultation Desk
                    </h3>
                    <p className="text-xs text-ink-600 dark:text-white/70">
                      Share site photos, floor plans, and get direct voice/chat feedback with our landscape design and execution team.
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
                      Instagram Portfolio
                    </h3>
                    <p className="text-xs text-ink-600 dark:text-white/70">
                      Follow our ongoing project site work, plant arrivals, terrace installations, and recent portfolio reels.
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
                    <span>DM on Instagram</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Direct Phone & Email */}
              <div className="p-4 rounded-2xl bg-cream-100/70 dark:bg-white/5 border border-green-900/10 dark:border-white/10 text-xs space-y-2">
                <div className="flex items-center gap-2 text-ink-800 dark:text-white">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Direct Line: </span>
                  <a href={`tel:${siteConfig.contact.phone}`} className="font-bold underline hover:text-emerald-600">
                    {siteConfig.contact.phoneDisplay}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-ink-800 dark:text-white">
                  <Mail className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Email: </span>
                  <a href={`mailto:${siteConfig.contact.email}`} className="font-bold underline hover:text-emerald-600">
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Project Enquiry Form */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0A140F] p-6 sm:p-8 rounded-3xl border border-green-900/15 dark:border-white/10 shadow-sm space-y-6">
            <div>
              <h3 className="font-display text-2xl font-bold text-green-950 dark:text-white">
                Landscape Project Enquiry
              </h3>
              <p className="text-xs text-ink-600 dark:text-white/60 mt-1">
                Share your requirements below. Our landscape design and execution team will respond promptly within 1 business day.
              </p>
            </div>

            {submitSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 text-emerald-900 dark:text-emerald-200 text-xs flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm">Inquiry Received Successfully!</div>
                  <p className="mt-1">
                    Thank you, {form.name || "Client"}. Our landscape team has logged your requirements and will reach out shortly. You can also message us directly on WhatsApp to share site photos or layout drawings.
                  </p>
                  <a
                    href={generateWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 font-bold text-emerald-700 dark:text-emerald-300 underline"
                  >
                    <span>Connect directly on WhatsApp now</span>
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
                    placeholder="e.g. Rahul Sharma"
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
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-green-900/20 dark:border-white/10 bg-cream-50/50 dark:bg-black/30 text-xs text-ink-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-green-950 dark:text-white mb-1.5">
                    Company / Organization (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Design Studio / Developer / Residence"
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-green-900/20 dark:border-white/10 bg-cream-50/50 dark:bg-black/30 text-xs text-ink-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-green-950 dark:text-white mb-1.5">
                    Type of Service Required
                  </label>
                  <select
                    value={form.serviceType}
                    onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-green-900/20 dark:border-white/10 bg-cream-50/50 dark:bg-black/30 text-xs text-ink-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Podium & Terrace Gardens">Podium &amp; Terrace Gardens</option>
                    <option value="Landscape Planning & Design">Landscape Planning &amp; Design</option>
                    <option value="3D Landscape Visualization">3D Landscape Visualization</option>
                    <option value="Villa & Residential Landscaping">Villa &amp; Residential Landscaping</option>
                    <option value="Commercial & Industrial Landscaping">Commercial &amp; Industrial Landscaping</option>
                    <option value="Interior & Balcony Gardens">Interior &amp; Balcony Gardens</option>
                    <option value="Plantation & Plant Supply">Plantation &amp; Plant Supply</option>
                    <option value="Garden Maintenance">Garden Maintenance</option>
                    <option value="Water Features & Hardscape">Water Features &amp; Hardscape</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-green-950 dark:text-white mb-1.5">
                    Approximate Project Area
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5,000 sq ft / 0.5 Acre"
                    value={form.approxArea}
                    onChange={(e) => setForm({ ...form, approxArea: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-green-900/20 dark:border-white/10 bg-cream-50/50 dark:bg-black/30 text-xs text-ink-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-green-950 dark:text-white mb-1.5">
                    Current Project Stage
                  </label>
                  <select
                    value={form.stage}
                    onChange={(e) => setForm({ ...form, stage: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-green-900/20 dark:border-white/10 bg-cream-50/50 dark:bg-black/30 text-xs text-ink-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Concept & Planning">Concept &amp; Planning</option>
                    <option value="Architectural Design Stage">Architectural Design Stage</option>
                    <option value="Civil Construction On-Site">Civil Construction On-Site</option>
                    <option value="Ready for Landscaping">Ready for Landscaping</option>
                    <option value="Renovation / Upgrade">Renovation / Upgrade</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-green-950 dark:text-white mb-1.5">
                  Project Location &amp; Requirements
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your site location in Pune/Maharashtra, landscape vision, existing site conditions, or special requirements..."
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
                  <span>{isSubmitting ? "Submitting Inquiry..." : "Submit Project Enquiry"}</span>
                </button>

                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4 text-[#25D366]" />
                  <span>Prefer WhatsApp? Chat Directly</span>
                </a>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
