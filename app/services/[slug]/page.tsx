import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Layers,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck
} from "lucide-react";

export function generateStaticParams() {
  return siteConfig.services.map((service) => ({
    slug: service.slug,
  }));
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = siteConfig.services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-ink-500 dark:text-white/60">
        <Link href="/" className="hover:text-green-950 dark:hover:text-white">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/services" className="hover:text-green-950 dark:hover:text-white">Services</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-green-950 dark:text-white font-semibold truncate">{service.title}</span>
      </nav>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-950/80 text-green-900 dark:text-green-300 text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span>{service.category} Service</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-950 dark:text-white tracking-tight leading-tight">
            {service.title}
          </h1>

          <p className="text-sm sm:text-base text-ink-700 dark:text-white/80 font-light leading-relaxed">
            {service.fullDescription}
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href={`/contact?type=quote&service=${encodeURIComponent(service.title)}`}
              className="px-6 py-3 bg-green-950 dark:bg-green-600 hover:bg-green-800 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow transition-all flex items-center gap-2"
            >
              <span>Request Quotation</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href={`/contact?type=consultation&service=${encodeURIComponent(service.title)}`}
              className="px-6 py-3 bg-white dark:bg-white/10 text-green-950 dark:text-white hover:bg-cream-100 font-semibold text-xs uppercase tracking-wider rounded-full border border-green-900/10 dark:border-white/15 transition-all"
            >
              <span>Book Site Visit</span>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="h-full min-h-[320px] sm:min-h-[380px] w-full rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-green-950 via-[#0B2B1E] to-[#040E0A] border border-green-800/40 shadow-soft flex flex-col justify-between text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold uppercase tracking-wider text-green-300 mb-4">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <span>Verified Execution Scope</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                Horticultural Deliverables
              </h3>
              <p className="text-xs text-white/70 font-light leading-relaxed">
                Every project is conditioned for Pune soil parameters, microclimates, and water hardness.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white text-xs">Target Properties</div>
                  <div className="text-[11px] text-white/60 font-light">{service.idealFor}</div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white text-xs">Alandi Staging Inspection</div>
                  <div className="text-[11px] text-white/60 font-light">Root health &amp; pest quarantine before delivery</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scope & Deliverables Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Scope of Work */}
        <div className="bg-white dark:bg-[#080A09] rounded-3xl p-6 sm:p-8 border border-green-900/10 dark:border-white/10 shadow-soft space-y-4">
          <div className="flex items-center gap-2 text-green-800 dark:text-green-400">
            <Layers className="w-5 h-5" />
            <h2 className="font-display text-xl font-bold text-green-950 dark:text-white">
              Scope of Work
            </h2>
          </div>
          <p className="text-xs text-ink-700 dark:text-white/70 font-light">
            Every step is managed with clear documentation and on-site oversight:
          </p>
          <ul className="space-y-3 pt-2">
            {service.scope.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink-700 dark:text-white/80 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Deliverables */}
        <div className="bg-white dark:bg-[#080A09] rounded-3xl p-6 sm:p-8 border border-green-900/10 dark:border-white/10 shadow-soft space-y-4">
          <div className="flex items-center gap-2 text-green-800 dark:text-green-400">
            <Sparkles className="w-5 h-5" />
            <h2 className="font-display text-xl font-bold text-green-950 dark:text-white">
              Key Deliverables
            </h2>
          </div>
          <p className="text-xs text-ink-700 dark:text-white/70 font-light">
            Tangible outcomes provided for your project records and handover:
          </p>
          <ul className="space-y-3 pt-2">
            {service.deliverables.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink-700 dark:text-white/80 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-4 border-t border-cream-200 dark:border-white/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-green-700 dark:text-green-400 block mb-1">
              Ideal For
            </span>
            <p className="text-xs text-ink-700 dark:text-white/80 font-light">
              {service.idealFor}
            </p>
          </div>
        </div>
      </div>

      {/* Service Specific FAQ */}
      {service.faq && service.faq.length > 0 && (
        <div className="bg-cream-100 dark:bg-[#080A09] rounded-3xl p-6 sm:p-8 border border-green-900/10 dark:border-white/10 space-y-6">
          <div className="flex items-center gap-2 text-green-900 dark:text-green-300">
            <HelpCircle className="w-5 h-5" />
            <h2 className="font-display text-xl sm:text-2xl font-bold text-green-950 dark:text-white">
              Service Questions Answered
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.faq.map((item, idx) => (
              <div key={idx} className="space-y-2 bg-white dark:bg-black/40 p-5 rounded-2xl border border-green-900/10 dark:border-white/10">
                <h3 className="font-semibold text-sm text-green-950 dark:text-white">
                  {item.q}
                </h3>
                <p className="text-xs text-ink-700 dark:text-white/70 font-light leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom CTA Card */}
      <div className="bg-[#11241a] text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="font-display text-2xl font-bold">
            Ready to initiate this project with GreenGallery?
          </h3>
          <p className="text-xs sm:text-sm text-white/70 font-light max-w-xl">
            Our operational team can schedule an on-site survey anywhere in Pune or review your project drawings directly.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/contact?type=quote&service=${encodeURIComponent(service.title)}`}
            className="px-6 py-3 bg-green-500 hover:bg-green-400 text-green-950 font-bold text-xs uppercase tracking-wider rounded-full shadow transition-all"
          >
            Request Quotation
          </Link>
          <a
            href={`https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(
              `Hello GreenGallery, I'm interested in your ${service.title} service...`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-medium text-xs uppercase tracking-wider rounded-full border border-white/20 transition-all"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
