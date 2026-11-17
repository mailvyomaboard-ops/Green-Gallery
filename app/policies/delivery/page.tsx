import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function DeliveryPolicyPage() {
  return (
    <div className="w-full pb-20">
      <section className="bg-green-900 text-cream-50 py-12 px-4 sm:px-6 border-b border-green-700/50">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-2 text-xs text-cream-50/70 mb-2">
            <Link href="/" className="hover:text-cream-50">Home</Link>
            <span>/</span>
            <span className="text-gold-600">Pune Delivery & Transit Terms</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-cream-50">
            Nursery Delivery & Transit Policy
          </h1>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 max-w-3xl mx-auto space-y-8 text-sm text-ink-900 leading-relaxed">
        <div>
          <h2 className="text-xl font-serif font-semibold text-green-900 mb-2">1. Regional Geographic Coverage</h2>
          <p>
            Green Gallery operates a dedicated fleet of temperature-stabilized nursery trucks servicing Pune metropolitan areas (Pincodes 411001 to 411060 and 412xxx). Specimen deliveries to Lonavala, Khandala, Nashik, and Mumbai MMR are scheduled weekly under custom logistics contracts.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-serif font-semibold text-green-900 mb-2">2. Transit Care & Root-Ball Protection</h2>
          <p>
            All specimen trees and architectural plants are conditioned in our Tathawade holding bays 48 hours prior to dispatch. Foliage is netted to prevent wind shear during highway transit, and root balls are pre-hydrated with mycorrhizal solution to eliminate shock upon unloading.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-serif font-semibold text-green-900 mb-2">3. Freight Fees & Free Delivery Threshold</h2>
          <p>
            Orders valued at ₹5,000 or above receive free white-glove doorstep delivery within Pune city limits. Orders below this threshold incur a flat ₹350 handling fee to cover specialized plant transport packaging.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-serif font-semibold text-green-900 mb-2">4. Heavy Specimen & Crane Logistics</h2>
          <p>
            For specimen palms and mature trees exceeding 8 feet or 250 kilograms, Green Gallery coordinates flatbed crane positioning and certified rigging crews. Site structural clearance and approach roads must be confirmed prior to dispatch date.
          </p>
        </div>
      </section>
    </div>
  );
}
