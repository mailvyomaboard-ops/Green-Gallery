import React from "react";
import Link from "next/link";

export default function ReturnsPolicyPage() {
  return (
    <div className="w-full pb-20">
      <section className="bg-green-950 text-white py-12 px-4 sm:px-6 border-b border-green-800">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-2 text-xs text-white/70 mb-2">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-green-300">Replacement &amp; Return Terms</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
            Plant Inspection &amp; Replacement Policy
          </h1>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 max-w-3xl mx-auto space-y-8 text-xs sm:text-sm text-ink-900 dark:text-white/80 leading-relaxed font-light">
        <div>
          <h2 className="text-lg font-display font-bold text-green-950 dark:text-white mb-2">
            1. Site Inspection upon Unloading
          </h2>
          <p>
            Because plants are biological specimens sensitive to microclimate variations, we request that the client, site representative, or project manager inspect foliage vigour, trunk integrity, and root conditions at the moment of vehicle unloading.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-display font-bold text-green-950 dark:text-white mb-2">
            2. Transit Damage Protocol
          </h2>
          <p>
            If any plant specimen sustains significant physical damage, broken leader branches, or severe container breakage during transit, note the issue on the delivery challan immediately and photograph the affected plant. GreenGallery will arrange an appropriate replacement specimen from our staging facility.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-display font-bold text-green-950 dark:text-white mb-2">
            3. Establishment &amp; Maintenance Support
          </h2>
          <p>
            Long-term plant flourishing depends on proper watering, soil drainage, and adequate sunlight. GreenGallery provides full care orientation for all installations. Where formal ongoing garden maintenance contracts are executed, routine replacement of failed plants is provided in accordance with the specific maintenance agreement.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-display font-bold text-green-950 dark:text-white mb-2">
            4. Hardscape Planters &amp; Substrates
          </h2>
          <p>
            Non-living garden infrastructure, such as basalt finish planters, drainage mats, and unopened potting media sacks, may be returned or exchanged within 7 calendar days of receipt if found defective or uninstalled.
          </p>
        </div>
      </section>
    </div>
  );
}
