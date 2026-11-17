import React from "react";
import Link from "next/link";

export default function ReturnsPolicyPage() {
  return (
    <div className="w-full pb-20">
      <section className="bg-green-900 text-cream-50 py-12 px-4 sm:px-6 border-b border-green-700/50">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-2 text-xs text-cream-50/70 mb-2">
            <Link href="/" className="hover:text-cream-50">Home</Link>
            <span>/</span>
            <span className="text-gold-600">Replacement & Return Policy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-cream-50">
            Nursery Replacement & Return Policy
          </h1>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 max-w-3xl mx-auto space-y-8 text-sm text-ink-900 leading-relaxed">
        <div>
          <h2 className="text-xl font-serif font-semibold text-green-900 mb-2">1. Living Specimen Inspection at Unloading</h2>
          <p>
            Because plants are living biological specimens sensitive to microclimate variation, we require that the recipient or site engineer inspect foliage, stems, and container integrity at the exact moment of nursery vehicle unloading.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-serif font-semibold text-green-900 mb-2">2. Immediate Transit Damage Replacement</h2>
          <p>
            If any specimen suffers broken primary branches, damaged container walls, or severe root exposure during transit, notify the driver immediately and photograph the issue. Green Gallery will arrange an identical replacement from our Tathawade bays within 48 hours at zero cost.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-serif font-semibold text-green-900 mb-2">3. 14-Day Post-Installation Survival Guarantee</h2>
          <p>
            All specimen trees and container plants installed directly by Green Gallery horticultural crews carry a 14-day survival guarantee. If a plant exhibits terminal shock despite following provided watering schedules, our senior arborist will conduct a site visit and replace the specimen free of charge.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-serif font-semibold text-green-900 mb-2">4. Planters, Substrates & Hardware</h2>
          <p>
            Handcrafted basalt GFRC planters, drainage hardware, and unopened soil substrate sacks may be returned within 7 calendar days of receipt for a full refund or exchange, provided items remain in unused condition.
          </p>
        </div>
      </section>
    </div>
  );
}
