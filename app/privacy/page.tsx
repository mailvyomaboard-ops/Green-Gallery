import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ShieldCheck, Mail, Phone } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full max-w-[900px] mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="space-y-3 border-b border-green-900/10 dark:border-white/10 pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-green-700 dark:text-green-400">
          Legal &amp; Data Protection
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-green-950 dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-xs text-ink-500 dark:text-white/60">
          Last Updated: November 2026 · GreenGallery Landscaping Services (Pune, Maharashtra)
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-ink-700 dark:text-white/80 leading-relaxed font-light">
        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-green-950 dark:text-white">
            1. Overview
          </h2>
          <p>
            GreenGallery (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates landscaping design, execution, plantation, and garden care services in Pune and Western Maharashtra. This Privacy Policy informs users of our policies regarding the collection, use, and disclosure of personal data when you interact with our website, request consultations, or submit quotation inquiries.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-green-950 dark:text-white">
            2. Information We Collect
          </h2>
          <p>
            When you complete an enquiry form, consultation booking, or quotation request on our website, we may collect:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Contact Details:</strong> Your full name, telephone / WhatsApp number, and email address.</li>
            <li><strong>Project Details:</strong> Property type (residential, commercial, bungalow, society), site location / pincode, approximate landscape area, and preferred consultation dates.</li>
            <li><strong>Technical Documents:</strong> Any architectural sketches, CAD files, or BOQ tender lists uploaded or transmitted for estimation.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-green-950 dark:text-white">
            3. How We Use Your Information
          </h2>
          <p>
            The information you provide is utilized strictly for legitimate business purposes:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Scheduling on-site landscape visits and horticultural surveys in Pune.</li>
            <li>Preparing and issuing itemized Bill of Quantities (BOQ) proposals.</li>
            <li>Coordinating delivery of botanical specimens and materials from our Alandi staging facility.</li>
            <li>Administering ongoing garden maintenance service schedules and log sheets.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-green-950 dark:text-white">
            4. Data Confidentiality &amp; Third Parties
          </h2>
          <p>
            We respect client confidentiality. We do not sell, rent, or trade your personal information or site architectural drawings to third-party marketers or brokers. Data is accessed solely by our internal operational team and authorized site supervisors for project execution.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-green-950 dark:text-white">
            5. Contact Us
          </h2>
          <p>
            If you have questions regarding this Privacy Policy or wish to request data updates or removal, please contact:
          </p>
          <div className="bg-cream-100 dark:bg-white/5 p-4 rounded-2xl border border-green-900/10 dark:border-white/10 space-y-1 text-xs">
            <p><strong>GreenGallery Landscaping Services</strong></p>
            <p>Email: <a href={`mailto:${siteConfig.contact.email}`} className="text-green-700 underline">{siteConfig.contact.email}</a></p>
            <p>Phone / WhatsApp: {siteConfig.contact.phoneDisplay}</p>
            <p>Primary Operating Market: Pune, Maharashtra, India</p>
          </div>
        </section>
      </div>
    </div>
  );
}
