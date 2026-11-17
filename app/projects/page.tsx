"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { initialProjects, clientsData } from "@/lib/data";
import { Project, ClientPartner } from "@/lib/types";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  MapPin,
  Calendar,
  Layers,
  Sprout,
  CheckCircle2
} from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [clients, setClients] = useState<ClientPartner[]>(clientsData);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.projects) && data.projects.length > 0) {
          setProjects(data.projects);
        }
      })
      .catch(() => {});

    fetch("/api/clients")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.clients) && data.clients.length > 0) {
          setClients(data.clients);
        }
      })
      .catch(() => {});
  }, []);

  const categories = [
    "All",
    "Residential",
    "Commercial",
    "Township and Large Developments",
    "Terrace and Vertical",
  ];

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-10 space-y-16">
      {/* Portfolio Header */}
      <div className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-green-950 text-white p-8 sm:p-12 md:p-16 border border-green-800/40 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-green-300 text-xs font-bold uppercase tracking-wider">
            <span>Western Maharashtra Landscape Portfolio</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Executed Projects &amp; Case Studies
          </h1>
          <p className="text-white/80 text-sm sm:text-base leading-relaxed font-light">
            Explore our curated landscaping case studies across Pune, PCMC, and Western Maharashtra. From podium decks and entrance avenues to private villa sanctuaries and urban terraces.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/contact?type=quote"
              className="px-6 py-3 bg-green-500 hover:bg-green-400 text-green-950 font-bold text-xs uppercase tracking-wider rounded-full shadow transition-all flex items-center gap-1.5"
            >
              <span>Discuss Your Project</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeCategory === cat
                ? "bg-green-950 dark:bg-green-600 text-white shadow-sm"
                : "bg-white dark:bg-white/10 text-ink-700 dark:text-white/80 hover:bg-cream-100 dark:hover:bg-white/20 border border-green-900/10 dark:border-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white dark:bg-[#080A09] rounded-3xl p-5 border border-green-900/10 dark:border-white/10 shadow-soft hover:shadow-glow transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Cover Image Deck */}
              <div className="relative h-60 w-full rounded-2xl overflow-hidden mb-4 bg-green-950">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 380px"
                />
                {/* Status Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-sm text-[10px] font-bold text-green-950 dark:text-green-300 uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span>{project.status || "COMPLETED"}</span>
                </div>

                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-green-950/80 backdrop-blur-sm text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
                  {project.category}
                </div>
              </div>

              {/* Meta info */}
              <div className="flex items-center gap-2 text-xs text-ink-500 dark:text-white/60 mb-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-green-600" />
                  {project.location}
                </span>
                <span>•</span>
                <span>{project.year}</span>
              </div>

              <h2 className="font-display text-xl font-bold text-green-950 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-2 mb-2">
                {project.title}
              </h2>

              <p className="text-xs text-ink-700 dark:text-white/70 font-light leading-relaxed line-clamp-3 mb-4">
                {project.brief}
              </p>

              {/* Plant highlights */}
              {project.plantsUsed && project.plantsUsed.length > 0 && (
                <div className="pt-2 border-t border-cream-200 dark:border-white/10 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 dark:text-green-400 block">
                    Key Flora
                  </span>
                  <p className="text-[11px] text-ink-500 dark:text-white/60 line-clamp-1 italic">
                    {project.plantsUsed.slice(0, 3).join(", ")}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-cream-200 dark:border-white/10 flex items-center justify-between">
              <Link
                href={`/projects/${project.slug}`}
                className="text-xs font-bold text-green-800 dark:text-green-300 hover:text-green-950 dark:hover:text-white flex items-center gap-1 group-hover:underline"
              >
                <span>View Full Case Study</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Developer Collaboration Profiles */}
      <section className="space-y-8 pt-8 border-t border-green-900/10 dark:border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-green-700 dark:text-green-400">
              Institutional Collaborations
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-green-950 dark:text-white mt-1">
              Developers &amp; Infrastructure Partners
            </h2>
            <p className="text-sm text-ink-700 dark:text-white/70 mt-2 max-w-2xl font-light">
              Collaborations across Western Pune, PCMC, and Eastern IT corridors for podium landscapes, avenue trees, and scheduled grounds maintenance.
            </p>
          </div>
          <Link
            href="/contact?type=quote"
            className="self-start sm:self-auto px-6 py-3 bg-green-950 dark:bg-green-600 hover:bg-green-800 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>Request Developer BOQ Quote</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <div
              key={client.id}
              className="bg-white dark:bg-[#080A09] border border-green-900/10 dark:border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-soft hover:shadow-glow transition-all"
            >
              <div>
                <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-white dark:bg-white/95 border border-green-900/10 flex items-center justify-center p-5 shadow-xs mb-5">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    fill
                    className="object-contain p-3"
                    sizes="320px"
                  />
                </div>

                <h3 className="font-display text-xl font-bold text-green-950 dark:text-white">
                  {client.name}
                </h3>
                {client.tagline && (
                  <p className="text-xs text-ink-500 dark:text-white/60 mt-1 font-light italic">
                    {client.tagline}
                  </p>
                )}
                <p className="text-xs text-ink-700 dark:text-white/70 font-light mt-3 leading-relaxed">
                  {client.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-cream-200 dark:border-white/10 flex items-center justify-between text-xs text-ink-500 dark:text-white/60">
                <span className="flex items-center gap-1 font-semibold text-green-800 dark:text-green-300">
                  <MapPin className="w-3.5 h-3.5" />
                  {client.city}
                </span>
                <Link
                  href="/contact?type=quote"
                  className="text-xs font-bold text-green-700 dark:text-green-400 hover:underline"
                >
                  Enquire Similar →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
