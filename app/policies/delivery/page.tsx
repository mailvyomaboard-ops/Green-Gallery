import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function DeliveryPolicyPage() {
  return (
    <div className="w-full pb-20">
      <section className="bg-green-950 text-white py-12 px-4 sm:px-6 border-b border-green-800">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-2 text-xs text-white/70 mb-2">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-green-300">Pune Delivery &amp; Transit Terms</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
            Plant Delivery &amp; Logistics Policy
          </h1>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 max-w-3xl mx-auto space-y-8 text-xs sm:text-sm text-ink-900 dark:text-white/80 leading-relaxed font-light">
        <div>
          <h2 className="text-lg font-display font-bold text-green-950 dark:text-white mb-2">
            1. Geographic Service Coverage
          </h2>
          <p>
            GreenGallery coordinates direct site transport servicing Pune municipal zones (PMC) and Pimpri-Chinchwad (PCMC), as well as key development corridors including Hinjawadi, Baner, Balewadi, Wakad, Kharadi, Hadapsar, and Chakan. Specimen deliveries to Lonavala, Khandala, and surrounding rural estates are scheduled by prior consultation.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-display font-bold text-green-950 dark:text-white mb-2">
            2. Transit Care &amp; Staging
          </h2>
          <p>
            All botanical specimens and trees are inspected and conditioned at our Alandi logistics depot prior to dispatch. Foliage is netted to protect delicate branches during road transit, and root balls are pre-hydrated to minimize transplant shock upon arrival.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-display font-bold text-green-950 dark:text-white mb-2">
            3. Freight &amp; Delivery Commercials
          </h2>
          <p>
            Because living plants vary significantly in weight, pot size, and vehicle volume, delivery fees are calculated transparently and itemized on your project quotation based on delivery distance from our Alandi staging facility and truck capacity required.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-display font-bold text-green-950 dark:text-white mb-2">
            4. Site Offloading &amp; Access
          </h2>
          <p>
            Clients and site contractors must ensure vehicle access to the unloading area. For mature trees and large specimen orders, our logistics team coordinates delivery timing with your on-site civil team for efficient, safe placement.
          </p>
        </div>
      </section>
    </div>
  );
}
