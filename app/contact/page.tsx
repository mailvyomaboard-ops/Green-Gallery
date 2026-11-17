"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { siteConfig } from "@/config/site";
import { LeadForm } from "@/components/LeadForm";
import { Compass, Building2, MessageSquare, ArrowUpRight, Phone, Mail, MapPin, Clock } from "lucide-react";

function ContactContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const serviceParam = searchParams.get("service") || "";

  const [inquiryType, setInquiryType] = useState<"consultation" | "quote" | "general">("consultation");
  const [selectedService, setSelectedService] = useState<string>(serviceParam);

  useEffect(() => {
    if (typeParam === "quote") {
      setInquiryType("quote");
    } else if (typeParam === "general") {
      setInquiryType("general");
    } else if (typeParam === "consultation") {
      setInquiryType("consultation");
    }

    if (serviceParam) {
      setSelectedService(serviceParam);
    }
  }, [typeParam, serviceParam]);

  return (
    <div className="w-full pb-20 px-3 sm:px-6 max-w-[1240px] mx-auto space-y-10">
      {/* Saturated Tropical Canopy Header */}
      <section className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-green-950 text-white p-8 sm:p-12 md:p-16 border border-green-800/40 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-green-300 text-xs font-bold uppercase tracking-wider">
            <span>Direct Project Desk · Pune</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Consultation &amp; Project Desk
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl leading-relaxed font-light">
            Book an on-site landscape assessment across Pune, request formal developer BOQ pricing, or discuss bulk plant supply staged from our Alandi depot.
          </p>
        </div>
      </section>

      {/* Main Two-Column Content */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form with 3 Explicit Pill Tabs */}
        <div className="lg:col-span-7 bg-white dark:bg-[#080A09] border border-green-900/10 dark:border-white/10 p-6 sm:p-8 md:p-10 rounded-3xl shadow-soft">
          <div className="mb-6">
            <span className="text-xs uppercase tracking-wider text-green-700 dark:text-green-400 font-bold block mb-1">
              Priority Booking
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-green-950 dark:text-white">
              {inquiryType === "consultation"
                ? "Book an On-Site Landscape Consultation"
                : inquiryType === "quote"
                ? "Request Project & BOQ Tender Quotation"
                : "General Inquiry & Plant Supply"}
            </h2>
            <p className="text-xs text-ink-500 dark:text-white/60 mt-1">
              Serving real estate builders, commercial facilities, housing societies, and residential estates across Pune.
            </p>
          </div>

          {/* 3 Explicit Pill Toggle Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 bg-cream-50 dark:bg-white/5 rounded-full mb-8 border border-green-900/10 dark:border-white/10">
            <button
              type="button"
              onClick={() => setInquiryType("consultation")}
              className={`py-2.5 px-3 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                inquiryType === "consultation"
                  ? "bg-green-950 dark:bg-green-600 text-white shadow"
                  : "text-ink-700 dark:text-white/70 hover:text-green-950 dark:hover:text-white hover:bg-white dark:hover:bg-white/10"
              }`}
            >
              <Compass className="w-3.5 h-3.5 shrink-0" />
              <span>Site Consultation</span>
            </button>
            <button
              type="button"
              onClick={() => setInquiryType("quote")}
              className={`py-2.5 px-3 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                inquiryType === "quote"
                  ? "bg-green-950 dark:bg-green-600 text-white shadow"
                  : "text-ink-700 dark:text-white/70 hover:text-green-950 dark:hover:text-white hover:bg-white dark:hover:bg-white/10"
              }`}
            >
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span>Project Quote</span>
            </button>
            <button
              type="button"
              onClick={() => setInquiryType("general")}
              className={`py-2.5 px-3 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                inquiryType === "general"
                  ? "bg-green-950 dark:bg-green-600 text-white shadow"
                  : "text-ink-700 dark:text-white/70 hover:text-green-950 dark:hover:text-white hover:bg-white dark:hover:bg-white/10"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              <span>Plant Enquiry</span>
            </button>
          </div>

          {/* Active Unified Form */}
          <LeadForm
            key={`${inquiryType}-${selectedService}`}
            formType={inquiryType}
            initialProjectType={selectedService}
            sourcePage={`/contact?type=${inquiryType}`}
          />
        </div>

        {/* Right Column: Address, Direct Dial, WhatsApp, Operating Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-[#080A09] border border-green-900/10 dark:border-white/10 p-6 sm:p-7 rounded-3xl space-y-4 shadow-soft">
            <h3 className="font-display text-xl font-bold text-green-950 dark:text-white border-b border-green-900/10 dark:border-white/10 pb-3">
              Operational Desk &amp; Direct Dial
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-ink-900 dark:text-white">
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-ink-500 dark:text-white/50 font-bold block">
                  Service Region
                </span>
                <p className="font-medium text-green-950 dark:text-white">
                  Pune, PCMC &amp; Surrounding Corridors
                </p>
                <p className="text-xs text-ink-500 dark:text-white/60">
                  On-site consultations available across Pune Municipal Corporation (PMC) and Pimpri-Chinchwad (PCMC) by prior appointment.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-ink-500 dark:text-white/50 font-bold block">
                  Logistical Staging Depot
                </span>
                <p className="leading-relaxed font-normal text-ink-700 dark:text-white/80">
                  {siteConfig.facilities.stagingWarehouse.location}
                </p>
                <p className="text-[11px] text-ink-500 dark:text-white/50 italic">
                  Operational staging and material depot. Not a public walk-in retail showroom.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-ink-500 dark:text-white/50 font-bold block">
                  Direct Phone / WhatsApp
                </span>
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="text-green-700 dark:text-green-400 font-bold text-sm block hover:underline"
                >
                  {siteConfig.contact.phoneDisplay}
                </a>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-ink-500 dark:text-white/50 font-bold block">
                  Email Desk
                </span>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-green-700 dark:text-green-400 underline font-medium block"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
            </div>

            {/* WhatsApp Business Action */}
            <div className="pt-3 border-t border-green-900/10 dark:border-white/10 space-y-3">
              <div className="bg-green-50 dark:bg-green-950/60 p-3.5 rounded-2xl border border-green-200 dark:border-green-800/40 text-xs text-green-950 dark:text-green-300 leading-relaxed font-light">
                <strong className="font-bold text-green-900 dark:text-green-200 block mb-0.5">
                  Direct WhatsApp Response:
                </strong>
                Our team reviews submissions promptly for site surveys, tree availability checks, and tender estimations.
              </div>

              <a
                href={`https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(
                  siteConfig.contact.whatsappDefaultMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[48px] px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm rounded-full shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Chat on WhatsApp ({siteConfig.contact.whatsappDisplay})</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full py-24 text-center text-sm text-ink-500">
          Loading consultation desk...
        </div>
      }
    >
      <ContactContent />
    </Suspense>
  );
}
