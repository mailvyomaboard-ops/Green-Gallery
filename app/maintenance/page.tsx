"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { MaintenancePackageItem } from "@/lib/types";
import { initialMaintenancePackages } from "@/lib/data";
import { useSiteContent } from "@/lib/useSiteContent";
import {
  Scissors,
  Droplets,
  Sprout,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  Building2,
  Home,
  Briefcase,
  ArrowRight,
  ArrowUpRight
} from "lucide-react";

export default function MaintenancePage() {
  const { content } = useSiteContent();
  const [packages, setPackages] = useState<MaintenancePackageItem[]>(initialMaintenancePackages);

  useEffect(() => {
    fetch("/api/maintenance")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.packages) && data.packages.length > 0) {
          setPackages(data.packages);
        }
      })
      .catch(() => {});
  }, []);

  const maintenanceFeatures = [
    {
      icon: Scissors,
      title: "Horticultural Pruning & Trimming",
      desc: "Seasonal canopy thinning, structural shaping, dead-wood removal, and hedge topiary manicuring."
    },
    {
      icon: Sprout,
      title: "Lawn Management & Aeration",
      desc: "Regular mowing, turf de-thatching, hollow-tine aeration, and organic top-dressing for dense green coverage."
    },
    {
      icon: Droplets,
      title: "Irrigation Inspection & Tuning",
      desc: "Routine calibration of automated drip timers, unclogging emitters, leak repairs, and seasonal cycle adjustments."
    },
    {
      icon: ShieldAlert,
      title: "Organic Pest & Disease Control",
      desc: "Preventive neem-oil foliar sprays, beneficial soil bio-agents, and non-toxic treatments safe for residents and pets."
    }
  ];

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-10 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-green-700 dark:text-green-400">
          {content.maintenanceBadge || "Horticultural Longevity"}
        </span>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-green-950 dark:text-white tracking-tight">
          {content.maintenanceTitle || "Garden Maintenance & Plant Care"}
        </h1>
        <p className="text-sm sm:text-base text-ink-700 dark:text-white/70 font-light leading-relaxed">
          {content.maintenanceDescription || "A great landscape is cultivated, not just planted. GreenGallery provides disciplined, scheduled maintenance programs tailored for Pune’s soil, water minerals, and seasonal climate swings."}
        </p>
      </div>

      {/* Core Protocols Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {maintenanceFeatures.map((feat, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-[#080A09] rounded-3xl p-6 border border-green-900/10 dark:border-white/10 shadow-soft space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 flex items-center justify-center">
              <feat.icon className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-green-950 dark:text-white">
              {feat.title}
            </h3>
            <p className="text-xs text-ink-700 dark:text-white/70 font-light leading-relaxed">
              {feat.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Package Options */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl font-extrabold text-green-950 dark:text-white">
            Tailored Maintenance Packages
          </h2>
          <p className="text-xs sm:text-sm text-ink-700 dark:text-white/70 mt-1 font-light">
            Select the contract model best suited to your property scale.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {packages.map((pkg, idx) => {
            const IconComponent =
              pkg.type === "Residential"
                ? Home
                : pkg.type === "Society"
                ? Building2
                : Briefcase;

            return (
              <div
                key={pkg.id || idx}
                className="bg-white dark:bg-[#080A09] rounded-3xl p-6 sm:p-7 border border-green-900/10 dark:border-white/10 shadow-soft hover:shadow-glow transition-all flex flex-col justify-between group"
              >
                <div>
                  {pkg.image && (
                    <div className="relative h-44 sm:h-48 w-full rounded-2xl overflow-hidden mb-5 bg-gradient-to-br from-green-950 via-[#0B2B1E] to-[#040E0A] border border-green-800/30">
                      <Image
                        src={pkg.image}
                        alt={pkg.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-70"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-green-300 uppercase tracking-wider border border-white/15">
                        {pkg.type}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-9 h-9 rounded-2xl bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 flex items-center justify-center shrink-0">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 dark:text-green-400 block">
                        {pkg.type} AMC
                      </span>
                      <h3 className="font-display text-lg font-bold text-green-950 dark:text-white">
                        {pkg.name}
                      </h3>
                    </div>
                  </div>

                  <div className="text-xs text-ink-500 dark:text-white/60 mb-4 pb-3 border-b border-cream-200 dark:border-white/10 space-y-1">
                    <p><strong>Target:</strong> {pkg.target}</p>
                    <p><strong>Cadence:</strong> {pkg.frequency}</p>
                    {pkg.priceNote && <p className="text-green-800 dark:text-green-300 font-medium"><strong>Pricing:</strong> {pkg.priceNote}</p>}
                  </div>

                  <div className="space-y-2.5 mb-6">
                    {pkg.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-ink-700 dark:text-white/80">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/contact?type=quote&service=${encodeURIComponent(pkg.name)}`}
                  className="w-full py-3 bg-green-950 dark:bg-green-600 hover:bg-green-800 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow text-center flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>{pkg.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Society Committee Callout */}
      <div className="bg-[#11241a] text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left max-w-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-green-400 block">
            Cooperative Housing Societies
          </span>
          <h3 className="font-display text-2xl font-bold">
            Need a Formal Proposal for Your Society Committee?
          </h3>
          <p className="text-xs sm:text-sm text-white/70 font-light">
            We provide structured, itemized proposals ready for society AGM or managing committee review, with transparent gardener wages, consumable allocations, and supervisor visit schedules.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/contact?type=quote&service=Apartment+and+Housing+Society+Gardens"
            className="px-6 py-3 bg-green-500 hover:bg-green-400 text-green-950 font-bold text-xs uppercase tracking-wider rounded-full shadow transition-all"
          >
            Request Committee Proposal
          </Link>
          <a
            href={siteConfig.social.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider rounded-full border border-white/20 transition-all"
          >
            WhatsApp Discussion
          </a>
        </div>
      </div>
    </div>
  );
}
