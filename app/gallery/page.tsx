"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { clientsData } from "@/lib/data";
import { siteConfig } from "@/config/site";
import { ClientPartner } from "@/lib/types";
import { ArrowUpRight } from "lucide-react";

export default function GalleryPage() {
  const [clients, setClients] = useState<ClientPartner[]>(clientsData);

  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.clients) && data.clients.length > 0) {
          setClients(data.clients);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="w-full pb-20 px-3 sm:px-6 max-w-[1240px] mx-auto space-y-12">
      {/* 
        1. Portfolio Hero Header: Saturated Tropical Canopy Container
      */}
      <section className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-green-950 text-white p-8 sm:p-12 md:p-16 border border-green-800/40 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-green-300 text-xs font-bold uppercase tracking-wider mb-4">
            <span>Western Maharashtra Civil Portfolios</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Developer Collaborations
          </h1>
          <p className="text-white/80 text-base sm:text-lg max-w-2xl leading-relaxed font-light mt-3 mb-8">
            Turnkey landscape architecture, structural podium planting, avenue trees, and acclimatized nursery supply for premier residential and commercial developments.
          </p>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10 max-w-3xl text-white">
            <div className="bg-white/5 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
              <div className="font-display text-2xl sm:text-3xl font-extrabold text-green-400">9+</div>
              <div className="text-xs text-white/70 font-medium mt-0.5">Developer Clients</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
              <div className="font-display text-2xl sm:text-3xl font-extrabold text-green-400">5.5L+</div>
              <div className="text-xs text-white/70 font-medium mt-0.5">Sq. Ft. Landscaped</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
              <div className="font-display text-2xl sm:text-3xl font-extrabold text-green-400">100%</div>
              <div className="text-xs text-white/70 font-medium mt-0.5">Civil Handover Rate</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
              <div className="font-display text-2xl sm:text-3xl font-extrabold text-green-400">Direct</div>
              <div className="text-xs text-white/70 font-medium mt-0.5">Founder Oversight</div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        2. Real Estate & Builder Clients Grid
      */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-green-700">
              Client Portfolio
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-green-950 mt-1">
              Developers &amp; Infrastructure Partners
            </h2>
            <p className="text-sm text-ink-700 mt-2 max-w-2xl font-light">
              Podium earth engineering, avenue tree plantations, and nursery supply delivered for established developers across Western Maharashtra.
            </p>
          </div>
          <Link
            href="/contact?type=quote"
            className="self-start sm:self-auto px-6 py-3 bg-green-950 hover:bg-green-800 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Request Developer Quote</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Dynamic Client Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => {
            return (
              <div
                key={client.id}
                className="group bg-white border border-green-900/10 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-green-600 transition-all duration-200 shadow-soft hover:shadow-glow"
              >
                <div>
                  {/* Client Logo Showcase Deck — Half Card Presentation */}
                  <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-white dark:bg-white/95 border border-green-900/10 flex items-center justify-center p-5 shadow-xs mb-5 group-hover:scale-[1.02] transition-transform">
                    <Image
                      src={client.logo}
                      alt={`${client.name} logo - Green Gallery Client`}
                      fill
                      className="object-contain p-2"
                      sizes="380px"
                    />
                  </div>

                  {/* Client Identity & Meta */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-display font-extrabold text-green-950 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors leading-snug">
                          {client.name}
                        </h3>
                        {client.tagline && (
                          <p className="text-xs text-ink-500 dark:text-white/60 italic mt-0.5 line-clamp-1 font-light">
                            {client.tagline}
                          </p>
                        )}
                      </div>
                      <span className="inline-block text-[11px] font-bold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-950/80 px-3 py-1 rounded-full border border-green-900/5 dark:border-white/10 shrink-0">
                        {client.city}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-ink-700 leading-relaxed font-light">
                    {client.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 
        3. Developer Consultation CTA Banner
      */}
      <section className="relative rounded-[2.5rem] overflow-hidden bg-green-950 p-10 sm:p-14 text-center text-white border border-green-800/40 shadow-2xl">
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-green-400 font-bold block mb-2">
            Developer &amp; Architect Engagement
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white mt-2 mb-4">
            Planning a Development in Pune?
          </h2>
          <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto mb-8 font-light">
            We review civil CAD files, audit podium dead-load tolerances, and prepare complete BOQs for phased plantation. Speak directly with Shubham Batule via WhatsApp Business for fast quotes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact?type=quote"
              className="w-full sm:w-auto min-h-[48px] px-8 py-3 bg-white hover:bg-cream-50 text-green-950 font-bold text-sm rounded-full cursor-pointer shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>Request a Project Quote</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <a
              href={`https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(
                "Hello Shubham Batule, I am a builder/developer in Pune and would like to schedule a site consultation with Green Gallery."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto min-h-[48px] px-6 py-3 border border-white/20 hover:bg-white/10 text-white font-semibold text-sm rounded-full flex items-center justify-center gap-2 transition-all"
            >
              <span>Chat on WhatsApp: {siteConfig.contact.whatsappDisplay}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
