import React from "react";
import Link from "next/link";

export default function PlantCarePolicyPage() {
  return (
    <div className="w-full pb-20">
      <section className="bg-green-900 text-cream-50 py-12 px-4 sm:px-6 border-b border-green-700/50">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-2 text-xs text-cream-50/70 mb-2">
            <Link href="/" className="hover:text-cream-50">Home</Link>
            <span>/</span>
            <span className="text-gold-600">Pune Climate Care Manual</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-cream-50">
            Pune & Western Ghats Plant Care Manual
          </h1>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 max-w-3xl mx-auto space-y-8 text-sm text-ink-900 leading-relaxed">
        <div>
          <h2 className="text-xl font-serif font-semibold text-green-900 mb-2">1. The Pune Climate Profile</h2>
          <p>
            Pune sits at approximately 560 meters altitude on the Deccan plateau, experiencing dry subtropical winters, intense dry summer heat (March to May, reaching 38°C–41°C), and concentrated monsoon precipitation (June to September). Plants must be cultivated to withstand high transpiration in summer without waterlogging during torrential rains.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-serif font-semibold text-green-900 mb-2">2. Soil Aeration & Drainage</h2>
          <p>
            Native Pune soil is dominated by black cotton clay (vertisols), which swells excessively when wet and cracks when dry. Never plant container specimens directly in pure garden clay. Always blend in minimum 30% coarse horticultural perlite or washed river sand and 20% cocopeat fiber to maintain root respiration.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-serif font-semibold text-green-900 mb-2">3. Seasonal Watering Protocol</h2>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li><strong>Summer (March – May):</strong> Water container plants deeply in the early morning before 8:30 AM. Do not water during midday heat.</li>
            <li><strong>Monsoon (June – September):</strong> Ensure planter drainage holes are completely unobstructed. Clear saucers after continuous rains to prevent root rot.</li>
            <li><strong>Winter (October – February):</strong> Reduce watering frequency by 40%. Allow the top 2 inches of soil to dry completely before re-soaking.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-serif font-semibold text-green-900 mb-2">4. Pest Management</h2>
          <p>
            We advocate integrated biological pest prevention. Spray cold-pressed neem oil solution (5ml per liter of water with 2 drops of mild liquid soap) every 14 days during seasonal transitions to repel mealybugs, aphids, and spider mites.
          </p>
        </div>
      </section>
    </div>
  );
}
