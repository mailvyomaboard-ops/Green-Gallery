"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { clientsData } from "@/lib/data";
import { ClientPartner } from "@/lib/types";
import { useSiteContent } from "@/lib/useSiteContent";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  MapPin,
  CheckCircle2,
  MessageSquare,
  Sparkles
} from "lucide-react";

export default function ProjectsPage() {
  const { content } = useSiteContent();
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
    <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Clean, Premium Header */}
      <div className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-green-950 text-white p-8 sm:p-12 md:p-16 border border-green-800/40 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-green-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-green-400" />
            <span>{content.projectsPageBadge || "Pune & PCMC Landscape Portfolio"}</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            {content.projectsPageTitle || "Our Projects & Collaborations"}
          </h1>
          <p className="text-white/80 text-sm sm:text-base leading-relaxed font-light">
            {content.projectsPageDescription || "Turnkey landscape design, podium plantations, avenue tree supply, and grounds maintenance executed for leading developers and private clients across Pune."}
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/contact?type=quote"
              className="px-6 py-3 bg-green-500 hover:bg-green-400 text-green-950 font-bold text-xs uppercase tracking-wider rounded-full shadow transition-all flex items-center gap-1.5"
            >
              <span>Discuss Your Project</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/services"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider rounded-full transition-all border border-white/20"
            >
              <span>Explore Services</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Projects Grid: Pure, Clean, Authentic Project Collaborations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {clients.map((project, idx) => (
          <div
            key={project.id}
            className="bg-white dark:bg-[#080A09] rounded-3xl p-4 sm:p-5 border border-green-900/10 dark:border-white/10 shadow-soft hover:shadow-glow transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              {/* Top Half: Dedicated 50% Image Showcase Bay */}
              <div className="relative w-full h-48 sm:h-52 rounded-2xl bg-white dark:bg-white/95 border border-green-900/10 flex items-center justify-center p-6 overflow-hidden group-hover:scale-[1.02] transition-transform duration-300 shadow-xs mb-4">
                <Image
                  src={project.logo}
                  alt={project.name}
                  fill
                  className="object-contain p-3"
                  sizes="(max-width: 768px) 100vw, 360px"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-green-950/80 backdrop-blur-sm text-[10px] font-mono font-bold text-green-300 uppercase tracking-wider border border-white/10">
                  Project #{idx + 1}
                </div>
              </div>

              {/* Location Pill */}
              <div className="flex items-center gap-1.5 text-xs text-ink-500 dark:text-white/60 mb-2">
                <MapPin className="w-3.5 h-3.5 text-green-600 shrink-0" />
                <span className="font-medium text-green-900 dark:text-green-300">{project.city}</span>
              </div>

              {/* Project Title */}
              <h2 className="font-display text-xl font-bold text-green-950 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-1 mb-1">
                {project.name}
              </h2>

              {/* Tagline */}
              {project.tagline && (
                <p className="text-xs text-ink-500 dark:text-white/60 italic line-clamp-1 mb-2 font-light">
                  {project.tagline}
                </p>
              )}

              {/* Scope Description */}
              <p className="text-xs text-ink-700 dark:text-white/70 font-light leading-relaxed line-clamp-3 mb-4">
                {project.description}
              </p>

              {/* Highlights / Scope pills */}
              {project.scope && project.scope.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-cream-200 dark:border-white/10">
                  {project.scope.slice(0, 2).map((item, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-cream-100 dark:bg-white/10 text-green-950 dark:text-green-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Project Action */}
            <div className="pt-4 mt-4 border-t border-cream-200 dark:border-white/10 flex items-center justify-between">
              <Link
                href={`/contact?type=quote&service=${encodeURIComponent(project.name)}`}
                className="text-xs font-bold text-green-800 dark:text-green-300 hover:text-green-950 dark:hover:text-white flex items-center gap-1.5 group-hover:underline"
              >
                <span>Request Project Proposal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Conversion Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-green-950 via-[#0B2B1E] to-[#061A12] p-8 sm:p-12 text-white border border-green-800/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs uppercase tracking-widest text-green-400 font-bold">
            Start Your Landscape Execution
          </span>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Have an upcoming project in Pune or PCMC?
          </h3>
          <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed">
            Our team assists real estate builders, architects, and private clients with BOQ validation, site visits, and direct specimen dispatch from our Alandi staging depot.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <Link
            href="/contact?type=quote"
            className="px-6 py-3 bg-green-500 hover:bg-green-400 text-green-950 font-bold text-xs uppercase tracking-wider rounded-full shadow transition-all flex items-center gap-1.5"
          >
            <span>Book Consultation</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <a
            href="https://wa.me/917823080251?text=Hello%20GreenGallery%2C%20I%20am%20interested%20in%20your%20landscape%20services..."
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow transition-all flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
