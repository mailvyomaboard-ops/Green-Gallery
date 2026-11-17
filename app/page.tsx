"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  Building2,
  Sprout,
  ShieldCheck,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  TreePine,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { initialProducts, testimonials, clientsData } from "@/lib/data";
import { Hero } from "@/components/Hero";
import { ClientPartner, SiteContent, defaultSiteContent } from "@/lib/types";

export default function HomePage() {
  const [clients, setClients] = useState<ClientPartner[]>(clientsData);
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(1); // 2nd open by default like in reference

  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.clients) && data.clients.length > 0) {
          setClients(data.clients);
        }
      })
      .catch(() => {});

    fetch("/api/cms")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.content) {
          setSiteContent(data.content);
        }
      })
      .catch(() => {});
  }, []);

  // 3 Featured products from the store (matching 3-column reference layout)
  const featuredProducts = initialProducts.slice(0, 3);

  const faqs = [
    {
      title: "Ordering for Nursery Site Delivery?",
      content:
        "We operate dedicated hydraulic crane trucks across Pune, PCMC, Lonavala, and Mumbai. Specimen trees and palms arrive pre-staged in specialized root balls to ensure zero transplant shock.",
    },
    {
      title: "Potting & Engineered Soil Substrate Services",
      content:
        "We formulate custom lightweight soil matrices tailored for podium gardens and terrace dead-load limits. Includes micro-drip fertigation integration, porous volcanic perlite, and slow-release organic nutrients.",
    },
    {
      title: "Do we supply wholesale stock to real estate developers?",
      content:
        "Yes. We support formal BOQ estimation, phased delivery matching tower handover milestones, and wholesale commercial price schedules for developers and PMC contractors.",
    },
    {
      title: "Ordering for Nursery Bay Inspection?",
      content:
        "Clients and landscape architects are welcome to tag and inspect trees directly at our 14-acre Tathawade bays before site dispatch. Schedule with Shubham Batule via WhatsApp.",
    },
  ];

  return (
    <div className="w-full space-y-16 sm:space-y-24">
      {/* 
        1. Saturated Botanical Hero (Exact Reference Image 1 Vibe)
      */}
      <Hero initialContent={siteContent} />

      {/* 
        2. Curated Specimen Stock (Reference "New Plants" 3-Column Layout)
      */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-950 tracking-tight">
              Curated Specimen Stock
            </h2>
            <p className="text-sm text-ink-700 mt-2 font-light max-w-xl">
              Acclimatized indoor and outdoor foliage conditioned at our Tathawade bays for Pune & Mumbai environments.
            </p>
          </div>
          <Link
            href="/store"
            className="text-xs uppercase tracking-wider font-bold text-green-700 hover:text-green-950 flex items-center gap-1.5 self-start sm:self-auto bg-white px-5 py-2.5 rounded-full border border-green-900/10 shadow-sm"
          >
            <span>View All Store Items</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3 Clean Rounded Cards with Circular Dark Arrow Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map((prod) => (
            <Link
              key={prod.id}
              href={`/store/${prod.slug}`}
              className="bg-white rounded-3xl p-4 sm:p-5 border border-green-900/10 shadow-soft hover:shadow-glow transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-cream-100 mb-4">
                  <Image
                    src={prod.mainImage}
                    alt={prod.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-bold text-green-950 uppercase tracking-wider shadow-sm">
                    {prod.stockLabel}
                  </div>
                </div>

                <div className="px-1">
                  <span className="text-[11px] font-bold text-green-600 uppercase tracking-widest block mb-1">
                    {prod.category}
                  </span>
                  <h3 className="font-display text-xl font-bold text-green-950 group-hover:text-green-700 transition-colors">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-ink-500 italic mt-0.5">{prod.botanicalName}</p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-cream-200/60 flex items-center justify-between px-1">
                <div>
                  <span className="text-xs text-ink-500 block">Nursery Specimen</span>
                  <span className="font-display font-extrabold text-lg text-green-950">
                    ₹{prod.price.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="w-9 h-9 rounded-full bg-green-950 text-white flex items-center justify-center group-hover:bg-green-700 transition-colors shadow">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 
        3. "Quality Plants & Curated Execution" Island Accordions (Interactive Services & Nursery Logistics)
      */}
      <section className="max-w-[1000px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-950 tracking-tight">
            Quality Plants &amp; Curated Execution
          </h2>
          <p className="text-sm text-ink-700 mt-2 font-light max-w-lg mx-auto">
            We offer a carefully coordinated suite of landscape and nursery services so every plant flourishes long past handover.
          </p>
        </div>

        {/* 4 Rounded Island Accordion Cards (Exact Reference Image Footprint) */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-green-900/10 shadow-soft overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-6 sm:p-7 flex items-center justify-between gap-4 text-left cursor-pointer focus:outline-none"
                >
                  <span className="font-display text-lg sm:text-xl font-bold text-green-950">
                    {faq.title}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-full border border-green-900/15 flex items-center justify-center shrink-0 transition-transform ${
                      isOpen ? "rotate-180 bg-green-950 text-white" : "bg-cream-50 text-green-950"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 sm:px-7 pb-6 pt-1 text-sm sm:text-base text-ink-700 leading-relaxed font-light border-t border-green-900/5">
                    {faq.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 
        7. Developer Collaborations: Continuous Infinite Side-Scrolling Loop
      */}
      <section className="bg-white border-y border-green-900/10 py-12 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-[1240px] mx-auto mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-green-700">
              Developer Collaborations
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-green-950 mt-0.5">
              Trusted by Pune&apos;s Leading Real Estate Developers
            </h2>
          </div>
          <Link
            href="/gallery"
            className="text-xs uppercase tracking-wider font-bold text-green-700 hover:text-green-950 flex items-center gap-1.5 self-start sm:self-auto bg-cream-50 px-4 py-2 rounded-full border border-green-900/10"
          >
            <span>Explore Developer Portfolios</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Marquee Track with edge fade masks */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute left-0 inset-y-0 w-24 bg-gradient-to-r from-white dark:from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 inset-y-0 w-24 bg-gradient-to-l from-white dark:from-black to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee-left marquee-pause flex gap-6 py-4">
            {[...clients, ...clients, ...clients].map((client, idx) => (
              <Link
                key={`client-loop-${client.id}-${idx}`}
                href="/gallery"
                className="w-[280px] sm:w-[320px] h-[320px] sm:h-[340px] shrink-0 bg-cream-50 dark:bg-[#080A09] border border-green-900/10 dark:border-white/10 hover:border-green-600 dark:hover:border-green-400 rounded-3xl p-3.5 flex flex-col justify-between transition-all duration-300 hover:shadow-soft group cursor-pointer"
                title={`${client.name} - ${client.tagline}`}
              >
                {/* Top Half of Card: Dedicated 50% Image Showcase Bay */}
                <div className="relative w-full h-[155px] sm:h-[165px] rounded-2xl bg-white dark:bg-white/95 border border-green-900/10 flex items-center justify-center p-4 overflow-hidden group-hover:scale-[1.02] transition-transform shadow-xs">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    fill
                    className="object-contain p-2"
                    sizes="320px"
                  />
                </div>

                {/* Bottom Half of Card: 50% Information & Developer Meta */}
                <div className="flex-1 flex flex-col justify-between pt-3 px-1.5 pb-1">
                  <div>
                    <h3 className="text-base sm:text-lg font-display font-extrabold text-green-950 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors truncate leading-tight">
                      {client.name}
                    </h3>
                    {client.tagline && (
                      <p className="text-xs text-ink-500 dark:text-white/60 line-clamp-2 mt-1.5 font-light leading-relaxed">
                        {client.tagline}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-green-900/10 dark:border-white/10 mt-auto">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-800 dark:text-green-300 bg-green-100 dark:bg-green-950/80 px-2.5 py-1 rounded-full border border-green-900/5 dark:border-white/10 truncate max-w-[190px]">
                      {client.city}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-cream-100 dark:bg-white/10 text-green-950 dark:text-white flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors shrink-0">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 
        8. Dual-Row Continuous Visual Archive: Executed Works & Specimen Flora
      */}
      <section className="py-16 bg-cream-50/70 border-t border-green-900/10 overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-green-700">
              Visual Archive &amp; Specimen Flora
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-green-950 mt-1">
              Executed Projects &amp; Acclimatized Flora
            </h2>
          </div>
          <Link
            href="/gallery"
            className="text-xs font-bold uppercase tracking-wider text-green-700 hover:text-green-950 flex items-center gap-1"
          >
            <span>Explore Complete Gallery</span>
            <span>→</span>
          </Link>
        </div>

        {/* Row 1: Executed Landscape Works (Continuous Leftward Scroll) */}
        <div className="relative w-full overflow-hidden mb-5">
          <div className="absolute left-0 inset-y-0 w-20 bg-gradient-to-r from-cream-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 inset-y-0 w-20 bg-gradient-to-l from-cream-50 to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee-left animate-marquee-slow marquee-pause flex gap-5">
            {[
              ...(siteContent.showcaseRow1 || defaultSiteContent.showcaseRow1),
              ...(siteContent.showcaseRow1 || defaultSiteContent.showcaseRow1),
              ...(siteContent.showcaseRow1 || defaultSiteContent.showcaseRow1),
            ].map((item, idx) => (
              <div
                key={`works-loop-${item.id}-${idx}`}
                className="relative w-[300px] sm:w-[360px] h-52 shrink-0 rounded-3xl overflow-hidden bg-green-950 border border-green-900/20 group shadow-soft cursor-pointer"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  sizes="360px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061A12] via-[#0B2B1E]/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-green-300 block mb-0.5">
                    {item.subtitle}
                  </span>
                  <h4 className="font-display text-base font-bold text-white truncate leading-snug">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Specimen Flora & Nursery Stock (Continuous Rightward Scroll) */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute left-0 inset-y-0 w-20 bg-gradient-to-r from-cream-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 inset-y-0 w-20 bg-gradient-to-l from-cream-50 to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee-right animate-marquee-slow marquee-pause flex gap-5">
            {[
              ...(siteContent.showcaseRow2 || defaultSiteContent.showcaseRow2),
              ...(siteContent.showcaseRow2 || defaultSiteContent.showcaseRow2),
              ...(siteContent.showcaseRow2 || defaultSiteContent.showcaseRow2),
            ].map((item, idx) => (
              <div
                key={`flora-loop-${item.id}-${idx}`}
                className="relative w-[300px] sm:w-[360px] h-52 shrink-0 rounded-3xl overflow-hidden bg-green-950 border border-green-900/20 group shadow-soft cursor-pointer"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  sizes="360px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061A12] via-[#0B2B1E]/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-green-300 block mb-0.5">
                    {item.subtitle}
                  </span>
                  <h4 className="font-display text-base font-bold text-white truncate leading-snug">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        9. Saturated Tropical Banner (Exact Reference Image "Join the community!" Banner)
      */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 pb-8">
        <div className="relative rounded-[2.5rem] overflow-hidden bg-green-950 p-10 sm:p-14 md:p-16 text-center text-white border border-green-800/40 shadow-2xl">
          {/* Saturated Tropical Foliage Background */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <Image
              src="/images/courtyard-modern.jpg"
              alt="Lush tropical leaves background"
              fill
              className="object-cover object-center opacity-30 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#061A12]/90 via-[#0B2B1E]/80 to-[#061A12]/95" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-green-400 block mb-2">
              {siteContent.bannerBadge || "Start Your Botanical Transformation"}
            </span>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
              {siteContent.bannerHeadline || "Build with Green Gallery"}
            </h2>
            <p className="text-white/80 text-sm sm:text-base font-light mb-8 max-w-xl mx-auto">
              {siteContent.bannerDescription ||
                "Review CAD drawings with our landscape directors, reserve specimen trees from our 14-acre bays, or request formal developer BOQ pricing."}
            </p>

            {/* Floating Action Pill Bar (Exact Reference Social / Action Pill Bar) */}
            <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-full border border-white/20 inline-flex flex-wrap items-center justify-center gap-2 max-w-full">
              <Link
                href="/contact?type=consultation"
                className="px-6 py-3 bg-white text-green-950 hover:bg-cream-50 font-bold text-xs uppercase tracking-wider rounded-full shadow transition-all"
              >
                Site Consultation
              </Link>
              <Link
                href="/contact?type=quote"
                className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow transition-all"
              >
                Developer Quote
              </Link>
              <Link
                href="/store"
                className="px-6 py-3 bg-transparent hover:bg-white/15 text-white font-semibold text-xs uppercase tracking-wider rounded-full transition-all"
              >
                Nursery Store
              </Link>
              <a
                href={`https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(
                  "Hello Shubham Batule, I would like to discuss a landscape consultation with Green Gallery."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-transparent hover:bg-white/15 text-green-300 font-semibold text-xs uppercase tracking-wider rounded-full transition-all"
              >
                WhatsApp Desk
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
