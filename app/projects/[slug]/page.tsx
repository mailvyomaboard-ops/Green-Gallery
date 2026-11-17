import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { initialProjects } from "@/lib/data";
import { projectsRepo } from "@/lib/db";
import {
  ArrowLeft,
  ArrowUpRight,
  MapPin,
  Calendar,
  Layers,
  Sprout,
  CheckCircle2,
  ChevronRight,
  Building2
} from "lucide-react";

export function generateStaticParams() {
  const projects = projectsRepo.getAll();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project =
    projectsRepo.getBySlug(slug) ||
    initialProjects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-ink-500 dark:text-white/60">
        <Link href="/" className="hover:text-green-950 dark:hover:text-white">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/projects" className="hover:text-green-950 dark:hover:text-white">Projects</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-green-950 dark:text-white font-semibold truncate">{project.title}</span>
      </nav>

      {/* Project Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-3.5 py-1 rounded-full bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span>{project.status || "COMPLETED"}</span>
          </span>
          <span className="px-3.5 py-1 rounded-full bg-white dark:bg-white/10 text-ink-700 dark:text-white/80 border border-green-900/10 text-xs font-medium uppercase tracking-wider">
            {project.category}
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-950 dark:text-white tracking-tight leading-tight">
          {project.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-ink-700 dark:text-white/70 pt-1">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-green-600" />
            <span>{project.location}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-green-600" />
            <span>Completed in {project.year}</span>
          </span>
          {project.clientName && (
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-green-600" />
              <span>Client: {project.clientName}</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Cover Showcase */}
      <div className="relative h-[380px] sm:h-[500px] md:h-[560px] w-full rounded-3xl overflow-hidden shadow-soft border border-green-900/10 dark:border-white/10 bg-green-950">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1240px) 100vw, 1240px"
        />
      </div>

      {/* Brief & Execution Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6 bg-white dark:bg-[#080A09] rounded-3xl p-6 sm:p-8 border border-green-900/10 dark:border-white/10 shadow-soft">
          <h2 className="font-display text-2xl font-bold text-green-950 dark:text-white">
            Project Overview &amp; Execution Brief
          </h2>
          <p className="text-sm sm:text-base text-ink-700 dark:text-white/80 font-light leading-relaxed whitespace-pre-line">
            {project.brief}
          </p>

          {/* Plant Palette */}
          {project.plantsUsed && project.plantsUsed.length > 0 && (
            <div className="pt-6 border-t border-cream-200 dark:border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-green-800 dark:text-green-400">
                <Sprout className="w-4 h-4" />
                <h3 className="font-display text-lg font-bold text-green-950 dark:text-white">
                  Botanical Palette &amp; Specimen Selections
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {project.plantsUsed.map((plant, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-ink-700 dark:text-white/80 bg-cream-50 dark:bg-white/5 p-2.5 rounded-xl border border-green-900/5 dark:border-white/5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                    <span>{plant}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-cream-100 dark:bg-[#080A09] rounded-3xl p-6 border border-green-900/10 dark:border-white/10 space-y-4">
            <h3 className="font-display text-lg font-bold text-green-950 dark:text-white">
              Services Delivered
            </h3>
            <ul className="space-y-2">
              {project.servicesUsed.map((s, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-ink-700 dark:text-white/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-green-900/10 dark:border-white/10">
              <Link
                href={`/contact?type=quote&service=${encodeURIComponent(project.title)}`}
                className="w-full py-3 bg-green-950 dark:bg-green-600 hover:bg-green-800 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow text-center flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Enquire Similar Project</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Visuals */}
      {project.images && project.images.length > 1 && (
        <div className="space-y-6">
          <h2 className="font-display text-2xl font-bold text-green-950 dark:text-white">
            Project Visual Gallery
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.images.slice(1).map((img, idx) => (
              <div
                key={idx}
                className="relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-soft border border-green-900/10 dark:border-white/10 group bg-green-950"
              >
                <Image
                  src={img.url}
                  alt={img.alt || project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 380px"
                />
                {img.caption && (
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white text-[11px] font-medium leading-tight">
                    {img.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
