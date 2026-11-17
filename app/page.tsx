"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Sprout,
  ShieldCheck,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  TreePine,
  Layers,
  Clock,
  MapPin,
  FileText,
  HeartHandshake,
  Droplets
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { initialProducts, clientsData } from "@/lib/data";
import { Hero } from "@/components/Hero";
import { ClientPartner, SiteContent, defaultSiteContent } from "@/lib/types";

export default function HomePage() {
  const [clients, setClients] = useState<ClientPartner[]>(clientsData);
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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

  const featuredProducts = initialProducts.slice(0, 3);

  const truthfulFaqs = [
    {
      title: "Where does GreenGallery operate and where are your facilities?",
      content:
        "GreenGallery delivers turnkey landscape architecture and botanical execution across premier residential and commercial developments. Our primary operational headquarters and dedicated logistical staging depot are established in Alandi, Pune for receiving, conditioning, and dispatching healthy plant batches to active job sites. Additionally, a new dedicated nursery hub along the Old Mumbai–Pune Highway is currently in active development."
    },
    {
      title: "How do you coordinate with builders, developers, and project architects?",
      content:
        "We coordinate closely with your civil contractors, MEP engineers, and project managers. We review landscape drawings, provide transparent itemized Bill of Quantities (BOQ) documentation, verify podium slab load capacities with lightweight media, and schedule staged deliveries aligned with your RERA tower possession milestones."
    },
    {
      title: "Can residential customers book balcony, terrace, or bungalow garden projects?",
      content:
        "Absolutely. While we execute large commercial and podium projects, residential gardens are an essential part of our craft. We design private villa grounds, courtyard plantings, and compact balcony/terrace gardens utilizing lightweight planters, automated micro-drip watering, and weather-resilient foliage."
    },
    {
      title: "Do you offer post-handover garden maintenance contracts?",
      content:
        "Yes. A landscape's long-term health depends on consistent horticultural care. We provide structured weekly, bi-weekly, or monthly maintenance plans covering lawn mowing, organic fertilization, seasonal pruning, pest prevention, and irrigation checkups."
    }
  ];

  return (
    <div className="w-full space-y-16 sm:space-y-24">
      {/* 1. Saturated Botanical Hero */}
      <Hero initialContent={siteContent} />

      {/* 2. Core Operational Capabilities & Service Pillars */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-green-700 dark:text-green-400 block mb-1">
              End-to-End Solutions
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-950 dark:text-white tracking-tight">
              {siteContent.servicesSectionTitle || "Comprehensive Landscaping & Botanical Services"}
            </h2>
            <p className="text-sm text-ink-700 dark:text-white/70 mt-2 font-light max-w-2xl leading-relaxed">
              {siteContent.servicesSectionSubtitle || "From large-scale commercial campuses and developer podiums to private bungalow sanctuaries and urban balcony greening."}
            </p>
          </div>
          <Link
            href="/services"
            className="text-xs uppercase tracking-wider font-bold text-green-800 dark:text-green-300 hover:text-green-950 dark:hover:text-white flex items-center gap-1.5 self-start sm:self-auto bg-white dark:bg-white/10 px-5 py-2.5 rounded-full border border-green-900/10 dark:border-white/15 shadow-sm"
          >
            <span>View All 10 Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 6 High-Impact Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteConfig.services.slice(0, 6).map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="bg-white dark:bg-[#080A09] rounded-3xl p-6 border border-green-900/10 dark:border-white/10 shadow-soft hover:shadow-glow transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-5 bg-gradient-to-br from-green-950 via-[#0B2B1E] to-[#040E0A] p-5 flex flex-col justify-between border border-green-800/30 group-hover:border-green-500/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-white/10 dark:bg-black/50 backdrop-blur-sm text-[10px] font-bold text-green-300 uppercase tracking-wider border border-white/15">
                      {service.category}
                    </span>
                    <span className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
                      <Sparkles className="w-4 h-4" />
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-green-400/80 uppercase tracking-wider block">Target Portfolio</span>
                    <span className="text-xs font-semibold text-white/90 truncate block">{service.idealFor.split(',')[0]}</span>
                  </div>
                </div>

                <h3 className="font-display text-xl font-bold text-green-950 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs text-ink-700 dark:text-white/70 mt-2 font-light leading-relaxed line-clamp-3">
                  {service.shortDescription}
                </p>
              </div>

              <div className="pt-4 mt-5 border-t border-cream-200 dark:border-white/10 flex items-center justify-between">
                <span className="text-xs font-semibold text-green-800 dark:text-green-400">
                  Learn Scope &amp; Details
                </span>
                <div className="w-8 h-8 rounded-full bg-green-950 dark:bg-green-700 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Developer & Builder Solutions (B2B Priority Section) */}
      <section className="bg-[#11241a] text-white py-16 px-4 sm:px-6">
        <div className="max-w-[1240px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-green-600/30 text-green-300 text-xs font-semibold uppercase tracking-wider border border-green-500/30">
                <Building2 className="w-3.5 h-3.5" />
                <span>{siteContent.b2bBadge || "Commercial & Real Estate Solutions"}</span>
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                {siteContent.b2bSectionTitle || "Turnkey Foliage & Landscaping for Developers"}
              </h2>
              <p className="text-white/80 text-sm sm:text-base font-light leading-relaxed">
                {siteContent.b2bSectionDescription || "We bridge the gap between architectural plans and living green reality. Our team handles complex podium slab loading calculations, sub-slab drainage coordination, staged tower handover planting, and large-scale specimen procurement from our Alandi staging depot."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-white">Full BOQ Coordination</h4>
                    <p className="text-xs text-white/70 mt-1 font-light">Itemized species, rates, and schedule validation.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-white">Podium &amp; Slab Drainage</h4>
                    <p className="text-xs text-white/70 mt-1 font-light">Engineered lightweight media and root protection.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-white">Phased Tower Deliveries</h4>
                    <p className="text-xs text-white/70 mt-1 font-light">Supply aligned with RERA possession dates.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-white">Alandi Staging Hub</h4>
                    <p className="text-xs text-white/70 mt-1 font-light">Acclimatized plants conditioned before dispatch.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <Link
                  href="/contact?type=quote&service=commercial"
                  className="px-6 py-3 bg-green-500 hover:bg-green-400 text-green-950 font-bold text-xs uppercase tracking-wider rounded-full shadow-lg transition-all flex items-center gap-2"
                >
                  <span>Request Project Tender Quote</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/projects"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider rounded-full transition-all border border-white/20"
                >
                  <span>View Project Case Studies</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="h-[380px] sm:h-[450px] w-full rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-green-950 via-[#0B2B1E] to-[#061A12] border border-white/15 shadow-2xl flex flex-col justify-between text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-72 h-72 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-wider text-green-300 mb-3">
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    <span>Commercial Deliverables</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white mb-2">
                    Developer Handover Matrix
                  </h3>
                  <p className="text-xs text-white/70 font-light leading-relaxed">
                    Designed to integrate seamlessly with civil schedules, MEP conduits, and handover deadlines.
                  </p>
                </div>

                <div className="space-y-2.5 pt-3 border-t border-white/10 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-green-400 shrink-0" />
                    <span className="text-white/90 text-xs font-medium">Lightweight engineered podium soil matrices</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                    <Droplets className="w-4 h-4 text-green-400 shrink-0" />
                    <span className="text-white/90 text-xs font-medium">Automated drip irrigation &amp; STP water integration</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
                    <span className="text-white/90 text-xs font-medium">Alandi staging depot quality hold &amp; batch inspection</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-green-300/80">
                  <span>Turnkey Botanical Capabilities</span>
                  <span className="font-mono text-white/90 font-bold">+91 78230 80251</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Five-Step Structured Process */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-green-700 dark:text-green-400 block mb-1">
            Methodical Delivery
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-950 dark:text-white tracking-tight">
            {siteContent.processSectionTitle || "How GreenGallery Delivers"}
          </h2>
          <p className="text-sm text-ink-700 dark:text-white/70 mt-2 font-light max-w-xl mx-auto leading-relaxed">
            {siteContent.processSectionSubtitle || "Our disciplined, 5-stage project framework guarantees transparent commercials, healthy plants, and timely handover."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {siteConfig.workflowSteps.map((step) => (
            <div
              key={step.step}
              className="bg-white dark:bg-[#080A09] rounded-3xl p-6 border border-green-900/10 dark:border-white/10 shadow-soft flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 font-display font-extrabold text-base flex items-center justify-center mb-4">
                  0{step.step}
                </div>
                <h3 className="font-display text-lg font-bold text-green-950 dark:text-white mb-1">
                  {step.title}
                </h3>
                <span className="text-[11px] font-semibold text-green-700 dark:text-green-400 block mb-2">
                  {step.tagline}
                </span>
                <p className="text-xs text-ink-700 dark:text-white/70 font-light leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Developer Collaborations: Continuous Infinite Side-Scrolling Loop */}
      <section className="bg-white dark:bg-black border-y border-green-900/10 dark:border-white/10 py-12 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-[1240px] mx-auto mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-green-700 dark:text-green-400">
              Developer Collaborations
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-green-950 dark:text-white mt-0.5">
              Projects &amp; Developer Collaborations
            </h2>
          </div>
          <Link
            href="/projects"
            className="text-xs uppercase tracking-wider font-bold text-green-800 dark:text-green-300 hover:text-green-950 dark:hover:text-white flex items-center gap-1.5 self-start sm:self-auto bg-cream-50 dark:bg-white/10 px-4 py-2 rounded-full border border-green-900/10 dark:border-white/10"
          >
            <span>Explore Project Showcase</span>
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
                href="/projects"
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

      {/* 6. Plant Supply & Staging Preview */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-green-700 dark:text-green-400 block mb-1">
              Direct Botanical Supply
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-950 dark:text-white tracking-tight">
              Curated Specimen Catalogue
            </h2>
            <p className="text-sm text-ink-700 dark:text-white/70 mt-2 font-light max-w-xl leading-relaxed">
              Acclimatized indoor and outdoor foliage, avenue trees, and planters staged through our Alandi logistics depot.
            </p>
          </div>
          <Link
            href="/plants"
            className="text-xs uppercase tracking-wider font-bold text-green-800 dark:text-green-300 hover:text-green-950 dark:hover:text-white flex items-center gap-1.5 self-start sm:self-auto bg-white dark:bg-white/10 px-5 py-2.5 rounded-full border border-green-900/10 dark:border-white/15 shadow-sm"
          >
            <span>Explore Plant Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map((prod) => (
            <Link
              key={prod.id}
              href={`/plants/${prod.slug}`}
              className="bg-white dark:bg-[#080A09] rounded-3xl p-5 border border-green-900/10 dark:border-white/10 shadow-soft hover:shadow-glow transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-60 sm:h-64 w-full rounded-2xl overflow-hidden bg-gradient-to-br from-green-950 via-[#0B2B1E] to-[#040E0A] p-5 flex flex-col justify-between text-white border border-green-800/30 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-white/10 text-[10px] font-mono text-green-300 border border-white/10">
                      {prod.category}
                    </span>
                    <span className="text-[10px] font-mono text-green-400 bg-green-950/80 px-2 py-0.5 rounded border border-green-500/30">
                      Alandi Staging
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-green-400 uppercase tracking-wider block">Acclimatized Palette</span>
                    <span className="text-sm font-bold text-white truncate block">{prod.name}</span>
                    <span className="text-xs text-white/60 italic block mt-0.5">{prod.botanicalName}</span>
                  </div>
                </div>

                <div className="px-1">
                  <span className="text-[11px] font-bold text-green-700 dark:text-green-400 uppercase tracking-widest block mb-1">
                    {prod.category}
                  </span>
                  <h3 className="font-display text-xl font-bold text-green-950 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-ink-500 dark:text-white/50 italic mt-0.5">{prod.botanicalName}</p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-cream-200 dark:border-white/10 flex items-center justify-between px-1">
                <div>
                  <span className="text-xs text-ink-500 dark:text-white/60 block">Reference Price</span>
                  <span className="font-display font-extrabold text-lg text-green-950 dark:text-white">
                    ₹{prod.price.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 text-xs font-semibold">
                  <span>Enquire</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. Truthful FAQs Island Accordions */}
      <section className="max-w-[1000px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-green-700 dark:text-green-400 block mb-1">
            Clear Answers
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-950 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-ink-700 dark:text-white/70 mt-2 font-light max-w-lg mx-auto">
            Everything you need to know about our landscaping execution, plant staging, and maintenance services.
          </p>
        </div>

        <div className="space-y-4">
          {truthfulFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#080A09] rounded-3xl border border-green-900/10 dark:border-white/10 shadow-soft overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-6 sm:p-7 flex items-center justify-between gap-4 text-left cursor-pointer focus:outline-none"
                >
                  <span className="font-display text-lg sm:text-xl font-bold text-green-950 dark:text-white">
                    {faq.title}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-full border border-green-900/15 dark:border-white/20 flex items-center justify-center shrink-0 transition-transform ${
                      isOpen ? "rotate-180 bg-green-950 dark:bg-green-600 text-white" : "bg-cream-50 dark:bg-white/10 text-green-950 dark:text-white"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 sm:px-7 pb-6 pt-1 text-sm sm:text-base text-ink-700 dark:text-white/80 leading-relaxed font-light border-t border-green-900/5 dark:border-white/10">
                    {faq.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. Conversion Banner */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 pb-8">
        <div className="relative rounded-[2.5rem] overflow-hidden bg-green-950 p-10 sm:p-14 md:p-16 text-center text-white border border-green-800/40 shadow-2xl">
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-[#061A12] via-[#0B2B1E] to-[#040E0A]" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-green-400 block mb-2">
              Transform Your Space
            </span>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
              Partner with GreenGallery
            </h2>
            <p className="text-white/80 text-sm sm:text-base font-light mb-8 max-w-xl mx-auto leading-relaxed">
              Schedule an on-site consultation, request formal developer BOQ pricing, or discuss bespoke garden design with our operational team.
            </p>

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
                Project BOQ Quote
              </Link>
              <Link
                href="/plants"
                className="px-6 py-3 bg-transparent hover:bg-white/15 text-white font-semibold text-xs uppercase tracking-wider rounded-full transition-all"
              >
                Plant Catalogue
              </Link>
              <a
                href={siteConfig.social.whatsappLink}
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
