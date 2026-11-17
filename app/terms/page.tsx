import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function TermsOfServicePage() {
  return (
    <div className="w-full max-w-[900px] mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="space-y-3 border-b border-green-900/10 dark:border-white/10 pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-green-700 dark:text-green-400">
          Commercial Terms &amp; Conditions
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-green-950 dark:text-white">
          Terms of Service
        </h1>
        <p className="text-xs text-ink-500 dark:text-white/60">
          Last Updated: November 2026 · GreenGallery Landscaping Services (Pune, Maharashtra)
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-ink-700 dark:text-white/80 leading-relaxed font-light">
        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-green-950 dark:text-white">
            1. Scope &amp; Proposals
          </h2>
          <p>
            All landscape design, execution, plantation, and garden care services performed by GreenGallery are governed by the specific project contract, formal Bill of Quantities (BOQ), and accepted commercial proposal. Website descriptions represent general service capabilities and indicative rates; finalized commercials depend on site surveys, soil depth, species sizes, and access logistics.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-green-950 dark:text-white">
            2. Site Readiness &amp; Utilities
          </h2>
          <p>
            Client or principal civil contractor is responsible for ensuring:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Unobstructed site access for material unloading and soil staging.</li>
            <li>Adequate, clean water supply for initial rootball soaking and ongoing irrigation.</li>
            <li>Completion of structural waterproofing and drainage outlets prior to podium or terrace soil filling.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-green-950 dark:text-white">
            3. Plant Material &amp; Establishment
          </h2>
          <p>
            Living plants are biological specimens subject to environmental factors beyond human control. While GreenGallery verifies vigorous root systems and healthy foliage prior to dispatch from our Alandi staging depot, post-transplant flourishing requires adherence to our care orientation guidelines and timely watering. Where maintenance agreements are in effect, replacement terms are governed by the maintenance contract.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-green-950 dark:text-white">
            4. Phased Milestone Deliveries
          </h2>
          <p>
            For real estate developments and large commercial complexes, deliveries are structured in phases aligned with civil tower handover schedules. Staged payments correspond to verified milestone completions as specified in the agreed project contract.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-green-950 dark:text-white">
            5. Jurisdiction
          </h2>
          <p>
            Any disputes arising in connection with services rendered by GreenGallery shall be subject to the exclusive jurisdiction of the competent courts in Pune, Maharashtra, India.
          </p>
        </section>
      </div>
    </div>
  );
}
