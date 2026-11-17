"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useSiteContent } from "@/lib/useSiteContent";
import {
  Sprout,
  Building2,
  Users,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Layers,
  ArrowRight,
  ArrowUpRight,
  Clock,
  HeartHandshake
} from "lucide-react";

export default function AboutPage() {
  const { content } = useSiteContent();

  const values = [
    {
      title: "Climate-First Horticultural Engineering",
      desc: "Every plant palette and soil substrate is selected specifically for Pune’s dry winters, intense pre-monsoon heat, and seasonal monsoon deluges."
    },
    {
      title: "Transparent Commercials & BOQ Integrity",
      desc: "We provide itemized, honest Bill of Quantities (BOQ) with clear plant specifications, pot sizes, and labor schedules with zero hidden expenses."
    },
    {
      title: "Root Health & Post-Handover Care",
      desc: "A landscape succeeds only if it flourishes for decades. We ensure complete root acclimatization before planting and offer structured maintenance support."
    },
    {
      title: "Civil & MEP Coordination",
      desc: "We work hand-in-hand with structural engineers, project managers, and MEP contractors to ensure podium slab safety and flawless irrigation routing."
    }
  ];

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-10 space-y-16">
      {/* Hero Header */}
      <div className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-green-950 text-white p-8 sm:p-12 md:p-16 border border-green-800/40 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-green-300 text-xs font-bold uppercase tracking-wider">
            <span>{content.aboutBadge || "About GreenGallery"}</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            {content.aboutTitle || "Cultivating Pune’s Natural Landscape"}
          </h1>
          <p className="text-white/80 text-sm sm:text-base leading-relaxed font-light">
            {content.aboutDescription || "GreenGallery is a Pune-based landscape design, execution, plantation, and garden care company. We serve real estate developers, commercial campuses, housing societies, and private bungalow owners across Western Maharashtra."}
          </p>
        </div>
      </div>

      {/* Story & Philosophy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-5">
          <span className="text-xs font-bold uppercase tracking-widest text-green-700 dark:text-green-400 block">
            Our Purpose &amp; Craft
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-green-950 dark:text-white tracking-tight leading-tight">
            Bridging Architecture and Living Botanical Ecosystems
          </h2>
          <p className="text-sm text-ink-700 dark:text-white/80 font-light leading-relaxed">
            Modern urban architecture demands greenery that is as resilient as it is visually breathtaking. GreenGallery was founded to provide end-to-end horticultural capabilities in Pune—combining conceptual landscape design, structural civil coordination, nursery supply, and disciplined ongoing care.
          </p>
          <p className="text-sm text-ink-700 dark:text-white/80 font-light leading-relaxed">
            Whether engineering a 40,000 sq ft lightweight podium deck for a residential tower or crafting an intimate balcony garden in Baner, we approach each project with scientific rigor, native species respect, and transparent business ethics.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-green-900 dark:text-green-300">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Pune &amp; PCMC Primary Market</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-green-900 dark:text-green-300">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Commercial &amp; Residential Projects</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="h-full min-h-[320px] sm:min-h-[380px] w-full rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-green-950 via-[#0B2B1E] to-[#061A12] border border-green-800/40 shadow-soft flex flex-col justify-between text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold uppercase tracking-wider text-green-300 mb-4">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span>Operational Backbone</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                Pune Infrastructure Matrix
              </h3>
              <p className="text-xs text-white/70 font-light leading-relaxed">
                Structured for rapid material dispatch, direct acclimatization, and reliable site execution across Western Maharashtra.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                <MapPin className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white text-xs">Alandi Logistical Staging Depot</div>
                  <div className="text-[11px] text-white/60 font-light">Inventory sorting, pre-delivery acclimation &amp; civil dispatch</div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                <Building2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white text-xs">Old Mumbai–Pune Highway Setup</div>
                  <div className="text-[11px] text-white/60 font-light">Upcoming nursery and operations facility in active development</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Facilities & Operations Section */}
      <section className="bg-cream-100 dark:bg-[#080A09] rounded-3xl p-8 sm:p-12 border border-green-900/10 dark:border-white/10 space-y-8">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-green-700 dark:text-green-400 block mb-1">
            Operational Infrastructure
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-green-950 dark:text-white">
            Facilities &amp; Supply Network
          </h2>
          <p className="text-xs sm:text-sm text-ink-700 dark:text-white/70 font-light mt-1">
            Transparent disclosure of how GreenGallery manages logistics, staging, and procurement across Pune.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Facility 1: Alandi Staging Depot */}
          <div className="bg-white dark:bg-black/40 rounded-2xl p-6 border border-green-900/10 dark:border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-400">
              <MapPin className="w-5 h-5 text-green-600" />
              <h3 className="font-display text-lg font-bold text-green-950 dark:text-white">
                {content.aboutAlandiTitle || "Logistical Staging Depot — Alandi, Pune"}
              </h3>
            </div>
            <p className="text-xs text-ink-700 dark:text-white/70 font-light leading-relaxed">
              {content.aboutAlandiDescription || "Our operational warehouse and material staging facility is located at Alandi, Pune. This dedicated depot is used for batch receiving, soil conditioning, root ball stabilization, and dispatching bulk plant orders directly to active Pune construction and landscape sites."}
            </p>
            <div className="text-[11px] text-ink-500 dark:text-white/50 bg-cream-50 dark:bg-white/5 p-2.5 rounded-xl">
              <strong>Notice:</strong> Alandi is an operational logistics depot and staging area, not a public walk-in retail showroom.
            </div>
          </div>

          {/* Facility 2: Old Mumbai-Pune Highway Hub */}
          <div className="bg-white dark:bg-black/40 rounded-2xl p-6 border border-green-900/10 dark:border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-400">
              <Clock className="w-5 h-5 text-amber-500" />
              <h3 className="font-display text-lg font-bold text-green-950 dark:text-white">
                {content.aboutHighwayTitle || "Nursery & Office Hub — Old Mumbai–Pune Highway"}
              </h3>
            </div>
            <p className="text-xs text-ink-700 dark:text-white/70 font-light leading-relaxed">
              {content.aboutHighwayDescription || "A comprehensive new office and expansive botanical cultivation nursery is currently under active development along the Old Mumbai–Pune Highway corridor. This facility will significantly expand our propagation and specimen inventory capacity."}
            </p>
            <div className="text-[11px] text-ink-500 dark:text-white/50 bg-cream-50 dark:bg-white/5 p-2.5 rounded-xl">
              <strong>Status:</strong> Under active development. Staging and client deliveries are currently handled through our Alandi logistical depot.
            </div>
          </div>
        </div>
      </section>

      {/* Team & Operating Model */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#080A09] rounded-3xl p-6 border border-green-900/10 dark:border-white/10 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-display text-lg font-bold text-green-950 dark:text-white">
            {content.aboutTeamCount || "Core Professional Team (~9 Specialists)"}
          </h3>
          <p className="text-xs text-ink-700 dark:text-white/70 font-light leading-relaxed">
            {content.aboutTeamDescription || "Our operational core consists of approximately 9 dedicated landscaping professionals overseeing design alignment, soil preparation, planting supervision, and automated irrigation."}
          </p>
        </div>

        <div className="bg-white dark:bg-[#080A09] rounded-3xl p-6 border border-green-900/10 dark:border-white/10 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-display text-lg font-bold text-green-950 dark:text-white">
            Agile Site Labour Network
          </h3>
          <p className="text-xs text-ink-700 dark:text-white/70 font-light leading-relaxed">
            We maintain an extensive, flexible network of trained site laborers across Pune and PCMC to scale manpower rapidly for heavy soil movement, tree planting, and large-scale handovers.
          </p>
        </div>

        <div className="bg-white dark:bg-[#080A09] rounded-3xl p-6 border border-green-900/10 dark:border-white/10 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-display text-lg font-bold text-green-950 dark:text-white">
            Regional Grower Partnerships
          </h3>
          <p className="text-xs text-ink-700 dark:text-white/70 font-light leading-relaxed">
            Direct relationships with regional grower nurseries across Western Maharashtra ensure consistent access to healthy native trees, exotic shrubs, and groundcovers at competitive rates.
          </p>
        </div>
      </div>

      {/* Core Values Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl font-extrabold text-green-950 dark:text-white">
            Our Core Principles
          </h2>
          <p className="text-xs sm:text-sm text-ink-700 dark:text-white/70 mt-1 font-light">
            Standards that define every GreenGallery project.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {values.map((v, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#080A09] rounded-2xl p-6 border border-green-900/10 dark:border-white/10 shadow-soft space-y-2"
            >
              <h3 className="font-display text-base font-bold text-green-950 dark:text-white">
                {v.title}
              </h3>
              <p className="text-xs text-ink-700 dark:text-white/70 font-light leading-relaxed">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <div className="bg-[#11241a] text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="font-display text-2xl font-bold">
            Let’s discuss your landscape requirements.
          </h3>
          <p className="text-xs sm:text-sm text-white/70 font-light">
            Consultations, site visits, and project BOQ evaluations across Pune and PCMC.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="px-6 py-3 bg-green-500 hover:bg-green-400 text-green-950 font-bold text-xs uppercase tracking-wider rounded-full shadow transition-all"
          >
            Contact GreenGallery
          </Link>
          <a
            href={siteConfig.social.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-medium text-xs uppercase tracking-wider rounded-full border border-white/20 transition-all"
          >
            WhatsApp Desk
          </a>
        </div>
      </div>
    </div>
  );
}
