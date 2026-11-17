import React from "react";
import Link from "next/link";

export default function PlantCarePolicyPage() {
  return (
    <div className="w-full pb-20">
      <section className="bg-green-950 text-white py-12 px-4 sm:px-6 border-b border-green-800">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-2 text-xs text-white/70 mb-2">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-green-300">Pune Climate Care Manual</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
            Pune &amp; Western Maharashtra Botanical Care Guide
          </h1>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 max-w-3xl mx-auto space-y-8 text-xs sm:text-sm text-ink-900 dark:text-white/80 leading-relaxed font-light">
        <div>
          <h2 className="text-lg font-display font-bold text-green-950 dark:text-white mb-2">
            1. The Pune Climate Profile
          </h2>
          <p>
            Pune sits at approximately 560 meters altitude on the Deccan plateau, experiencing dry subtropical winters, intense dry summer heat (March to May, reaching 38°C–41°C), and concentrated monsoon precipitation (June to September). Plants must be cultivated to withstand high transpiration in summer without waterlogging during torrential rains.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-display font-bold text-green-950 dark:text-white mb-2">
            2. Soil Aeration &amp; Drainage in Maharashtra
          </h2>
          <p>
            Native Pune soil is dominated by black cotton clay (vertisols), which swells excessively when wet and cracks when dry. Never plant container specimens directly in unamended heavy black clay. Always blend in minimum 30% coarse horticultural perlite or washed river sand and 20% cocopeat fiber with organic vermicompost to maintain vital root respiration.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-display font-bold text-green-950 dark:text-white mb-2">
            3. Seasonal Watering Protocol
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li><strong>Summer (March – May):</strong> Water container plants deeply in the early morning before 8:30 AM. Do not water during peak afternoon heat.</li>
            <li><strong>Monsoon (June – September):</strong> Ensure planter drainage holes are completely unobstructed. Clear saucers after continuous rains to prevent root rot.</li>
            <li><strong>Winter (October – February):</strong> Reduce watering frequency by 40%. Allow the top 2 inches of soil to dry moderately before re-soaking.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-display font-bold text-green-950 dark:text-white mb-2">
            4. Preventive Pest Management
          </h2>
          <p>
            We advocate integrated organic pest prevention. Spray cold-pressed neem oil solution (5ml per liter of water with 2 drops of mild liquid soap) every 14 days during seasonal transitions to repel mealybugs, aphids, and spider mites safely.
          </p>
        </div>
      </section>
    </div>
  );
}
