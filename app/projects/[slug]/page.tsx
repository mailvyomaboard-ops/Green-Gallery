import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { initialProjects, clientsData } from "@/lib/data";
import { projectsRepo, clientsRepo } from "@/lib/db";
import ProjectMediaGallery from "@/components/ProjectMediaGallery";
import {
  MapPin,
  Calendar,
  Layers,
  Sprout,
  CheckCircle2,
  ChevronRight,
  Building2,
  ArrowUpRight,
  MessageSquare,
  Sparkles,
  Award
} from "lucide-react";

export function generateStaticParams() {
  const projects = projectsRepo.getAll();
  const clients = clientsRepo.getAll();
  const allSlugs = new Set<string>();

  projects.forEach((p) => allSlugs.add(p.slug));
  clients.forEach((c) => {
    allSlugs.add(c.slug);
    if (c.featuredProjectSlug) allSlugs.add(c.featuredProjectSlug);
  });

  return Array.from(allSlugs).map((slug) => ({
    slug,
  }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1. Direct project lookup
  let project = projectsRepo.getBySlug(slug) || initialProjects.find((p) => p.slug === slug);

  // 2. Client lookup fallback
  const client = clientsRepo.getBySlug(slug) || clientsData.find((c) => c.slug === slug);

  if (!project && client && client.featuredProjectSlug) {
    project = projectsRepo.getBySlug(client.featuredProjectSlug) || initialProjects.find((p) => p.slug === client.featuredProjectSlug);
  }

  // 3. Synthesize if only client exists
  if (!project && client) {
    project = {
      id: client.id,
      slug: client.slug,
      title: `${client.name} — Landscape Portfolio`,
      category: "Township and Large Developments",
      location: client.location || client.city,
      year: 2024,
      areaSqFt: 45000,
      clientName: client.name,
      clientLogo: client.logo,
      coverImage: client.logo || "/images/frames/ezgif-frame-001.jpg",
      videoUrl: client.videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-top-aerial-shot-of-a-luxury-pool-and-palm-trees-42218-large.mp4",
      brief: client.description,
      whatWeDid: client.whatWeDid || [
        "Turnkey master landscape architecture and botanical zone execution.",
        "Engineered structural soil profiling with automated drip irrigation.",
        "Specimen shade trees and avenue palms sourced from Alandi staging depot.",
        "Post-installation botanical health monitoring and maintenance."
      ],
      plantsUsed: ["Terminalia mantaly", "Foxtail Palms", "Plumeria obtusa", "Bermuda Turf"],
      servicesUsed: client.scope || ["Landscape Design and Installation", "Project Foliage for Builders"],
      status: "COMPLETED",
      images: (client.galleryImages && client.galleryImages.length > 0)
        ? client.galleryImages.map((img, i) => ({ url: img, caption: `${client.name} execution frame ${i + 1}`, alt: client.name }))
        : [
            { url: client.logo, caption: `${client.name} portfolio cover`, alt: client.name },
            { url: "/images/frames/ezgif-frame-001.jpg", caption: "Podium avenue palm installation", alt: "Avenue Palms" },
            { url: "/images/frames/ezgif-frame-003.jpg", caption: "Central landscaped grounds", alt: "Central Grounds" }
          ]
    };
  }

  if (!project) {
    notFound();
  }

  // Fallback "whatWeDid" if none specified
  const executionPoints = (project.whatWeDid && project.whatWeDid.length > 0)
    ? project.whatWeDid
    : [
        "Turnkey master landscape architecture and CAD civil structural coordination.",
        "Engineered lightweight soil formulation tailored to structural load boundaries.",
        "Specimen mature canopy trees and acclimatized avenue palms sourced from Alandi depot.",
        "Automated pressure-compensating micro-drip irrigation running on building STP water.",
        "Natural stone hardscape integration, stepping pavers, and boundary acoustic green buffer.",
        "Scheduled post-handover horticultural monitoring and soil enrichment."
      ];

  const whatsappInquiryUrl = `https://wa.me/917823080251?text=${encodeURIComponent(
    `Hello GreenGallery team, I am inquiring regarding the landscape execution for "${project.title}" in ${project.location}. I have a similar project in Pune and would like to discuss feasibility.`
  )}`;

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-ink-500 dark:text-white/60">
        <Link href="/" className="hover:text-green-950 dark:hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/projects" className="hover:text-green-950 dark:hover:text-white transition-colors">Projects &amp; Collaborations</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-green-950 dark:text-white font-semibold truncate max-w-[280px] sm:max-w-md">
          {project.title}
        </span>
      </nav>

      {/* Project Header Banner */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{project.status || "COMPLETED"}</span>
          </span>
          <span className="px-3.5 py-1 rounded-full bg-white dark:bg-white/10 text-ink-800 dark:text-white/80 border border-green-900/10 text-xs font-medium uppercase tracking-wider">
            {project.category}
          </span>
          {project.areaSqFt && (
            <span className="px-3.5 py-1 rounded-full bg-cream-100 dark:bg-white/5 text-ink-800 dark:text-emerald-300 border border-green-900/10 text-xs font-mono font-semibold">
              {project.areaSqFt.toLocaleString("en-IN")} Sq. Ft.
            </span>
          )}
        </div>

        <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black text-green-950 dark:text-white tracking-tight leading-[1.12]">
          {project.title}
        </h1>

        {/* Site Location & Key Metadata Strip */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-ink-700 dark:text-white/80 pt-1">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-950 dark:text-emerald-200 font-semibold">
            <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Site Location: {project.location}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Year of Execution: {project.year}</span>
          </div>

          {project.clientName && (
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Client Partner: <strong>{project.clientName}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* MULTIMEDIA BAY: Video Walkthrough & Interactive Photo Gallery */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
              Visual Documentation
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-green-950 dark:text-white">
              Photos &amp; Video Walkthrough
            </h2>
          </div>
          <span className="text-xs text-ink-500 dark:text-white/60 hidden sm:inline">
            Interactive multi-angle case documentation
          </span>
        </div>

        <ProjectMediaGallery
          title={project.title}
          location={project.location}
          coverImage={project.coverImage}
          videoUrl={project.videoUrl}
          images={project.images || []}
        />
      </section>

      {/* CORE SPECIFICATION: "WHAT WE DID FOR THEM" */}
      <section className="rounded-3xl bg-gradient-to-br from-green-950 via-[#072418] to-[#04120C] text-white p-6 sm:p-10 md:p-12 border border-green-800/40 shadow-2xl space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Execution Scope Profile</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white">
            What We Did For Them
          </h2>
          <p className="text-sm sm:text-base text-white/80 font-light max-w-3xl leading-relaxed">
            From technical civil load engineering to micro-climate flora curation, here is the exact scope executed by GreenGallery for {project.clientName || project.title} at {project.location}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {executionPoints.map((point, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/40 backdrop-blur-xs transition-all duration-300 flex items-start gap-4 group"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-green-950 transition-colors">
                #{String(idx + 1).padStart(2, "0")}
              </div>
              <p className="text-xs sm:text-sm text-white/90 font-light leading-relaxed">
                {point}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* BRIEF & BOTANICAL PALETTE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8 bg-white dark:bg-[#080A09] rounded-3xl p-6 sm:p-8 border border-green-900/10 dark:border-white/10 shadow-soft">
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-bold text-green-950 dark:text-white">
              Project Narrative &amp; Overview
            </h3>
            <p className="text-sm sm:text-base text-ink-700 dark:text-white/80 font-light leading-relaxed whitespace-pre-line">
              {project.brief}
            </p>
          </div>

          {/* Plant Palette */}
          {project.plantsUsed && project.plantsUsed.length > 0 && (
            <div className="pt-6 border-t border-cream-200 dark:border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
                <Sprout className="w-5 h-5 text-emerald-600" />
                <h4 className="font-display text-xl font-bold text-green-950 dark:text-white">
                  Botanical Palette &amp; Specimen Selections
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.plantsUsed.map((plant, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 text-xs text-ink-800 dark:text-white/90 bg-cream-50 dark:bg-white/5 p-3 rounded-xl border border-green-900/5 dark:border-white/5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium">{plant}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info & Action Bay */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-cream-100/70 dark:bg-[#080A09] rounded-3xl p-6 border border-green-900/10 dark:border-white/10 space-y-5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
                Project Profile
              </span>
              <h4 className="font-display text-lg font-bold text-green-950 dark:text-white mt-0.5">
                Execution Deliverables
              </h4>
            </div>

            <ul className="space-y-2.5">
              {project.servicesUsed.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-ink-700 dark:text-white/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-green-900/10 dark:border-white/10 text-xs space-y-2">
              <div className="flex justify-between text-ink-700 dark:text-white/70">
                <span>Site Location:</span>
                <strong className="text-green-950 dark:text-white">{project.location}</strong>
              </div>
              <div className="flex justify-between text-ink-700 dark:text-white/70">
                <span>Total Scale:</span>
                <strong className="text-green-950 dark:text-white">{project.areaSqFt.toLocaleString("en-IN")} sq. ft.</strong>
              </div>
              <div className="flex justify-between text-ink-700 dark:text-white/70">
                <span>Completion:</span>
                <strong className="text-green-950 dark:text-white">{project.year}</strong>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <Link
                href={`/contact?type=quote&service=${encodeURIComponent(project.title)}`}
                className="w-full py-3 bg-green-950 hover:bg-green-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow text-center flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Enquire Similar Project</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>

              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow text-center flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Discuss On WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
