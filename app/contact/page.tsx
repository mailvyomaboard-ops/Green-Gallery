"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { siteConfig } from "@/config/site";
import { LeadForm } from "@/components/LeadForm";
import { Compass, Building2, MessageSquare, ArrowUpRight } from "lucide-react";

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
      {/* 
        Saturated Tropical Canopy Header (Reference Banner Vibe)
      */}
      <section className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-green-950 text-white p-8 sm:p-12 md:p-16 border border-green-800/40 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-green-300 text-xs font-bold uppercase tracking-wider mb-4">
            <span>Direct Technical Desk</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Consultation &amp; Project Desk
          </h1>
          <p className="text-white/80 text-base sm:text-lg max-w-2xl leading-relaxed font-light mt-3">
            Book an on-site landscape evaluation, schedule a private walk of our 14-acre Tathawade cultivation bays, or submit CAD drawings for formal BOQ tender estimation.
          </p>
        </div>
      </section>

      {/* Main Two-Column Content */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form with 3 Explicit Pill Tabs */}
        <div className="lg:col-span-7 bg-white border border-green-900/10 p-6 sm:p-8 md:p-10 rounded-3xl shadow-soft">
          <div className="mb-6">
            <span className="text-xs uppercase tracking-wider text-green-700 font-bold block mb-1">
              Priority Booking
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-green-950">
              {inquiryType === "consultation"
                ? "Book an On-Site Landscape Consultation"
                : inquiryType === "quote"
                ? "Request Commercial Project & Tender Quote"
                : "General Inquiry & Nursery Visit"}
            </h2>
            <p className="text-xs text-ink-500 mt-1">
              {siteConfig.contact.responseGuarantee}
            </p>
          </div>

          {/* 3 Explicit Pill Toggle Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 bg-cream-50 rounded-full mb-8 border border-green-900/10">
            <button
              type="button"
              onClick={() => setInquiryType("consultation")}
              className={`py-2.5 px-3 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                inquiryType === "consultation"
                  ? "bg-green-950 text-white shadow"
                  : "text-ink-700 hover:text-green-950 hover:bg-white"
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
                  ? "bg-green-950 text-white shadow"
                  : "text-ink-700 hover:text-green-950 hover:bg-white"
              }`}
            >
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span>Developer Quote</span>
            </button>
            <button
              type="button"
              onClick={() => setInquiryType("general")}
              className={`py-2.5 px-3 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                inquiryType === "general"
                  ? "bg-green-950 text-white shadow"
                  : "text-ink-700 hover:text-green-950 hover:bg-white"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              <span>General Message</span>
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

        {/* Right Column: Address, Direct Dial, WhatsApp, Hours, Google Map */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Contact Desk */}
          <div className="bg-white border border-green-900/10 p-6 sm:p-7 rounded-3xl space-y-4 shadow-soft">
            <h3 className="font-display text-xl font-bold text-green-950 border-b border-green-900/10 pb-3">
              Founder &amp; Technical Desk
            </h3>

            <div className="space-y-3.5 text-sm text-ink-900">
              <div>
                <span className="text-xs uppercase tracking-wider text-ink-500 font-bold block">Founder &amp; Owner</span>
                <p className="font-display font-bold text-green-950 mt-0.5 text-base">Shubham Batule</p>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider text-ink-500 font-bold block">14-Acre Nursery Bays</span>
                <p className="leading-relaxed font-normal text-ink-700 mt-0.5">
                  {siteConfig.contact.address.line1}<br />
                  {siteConfig.contact.address.line2}<br />
                  {siteConfig.contact.address.city}, {siteConfig.contact.address.state} {siteConfig.contact.address.pincode}
                </p>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider text-ink-500 font-bold block">Operating Hours</span>
                <p className="mt-0.5 font-medium text-ink-900">{siteConfig.contact.businessHours.weekdays}</p>
                <p className="text-xs text-ink-500">{siteConfig.contact.businessHours.sunday}</p>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider text-ink-500 font-bold block">Email Inquiries</span>
                <a href={`mailto:${siteConfig.contact.salesEmail}`} className="text-green-700 underline font-medium block">
                  {siteConfig.contact.salesEmail}
                </a>
              </div>
            </div>

            {/* WhatsApp Business Action */}
            <div className="pt-3 border-t border-green-900/10 space-y-3">
              <div className="bg-green-50 p-3.5 rounded-2xl border border-green-200 text-xs text-green-950 leading-relaxed font-light">
                <strong className="font-bold text-green-900 block mb-0.5">WhatsApp-First Direct Desk:</strong>
                Shubham Batule reviews submissions promptly for on-site visits and fast quotation schedules.
              </div>

              <a
                href={`https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(
                  "Hello Shubham Batule, I would like to book a site consultation for my landscape project in Pune."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[48px] px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm rounded-full shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Chat on WhatsApp Business ({siteConfig.contact.whatsappDisplay})</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Embedded Google Map */}
          <div className="bg-white border border-green-900/10 rounded-3xl overflow-hidden shadow-soft">
            <div className="p-4 bg-cream-50 border-b border-green-900/10 text-xs font-bold text-green-950 flex justify-between items-center">
              <span>Pune Nursery Location Map</span>
              <a
                href={siteConfig.contact.address.googleBusinessProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 hover:underline flex items-center gap-1"
              >
                <span>Open in Maps</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="h-64 w-full bg-cream-100">
              <iframe
                title="Green Gallery Nursery Location"
                src={siteConfig.contact.address.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
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
