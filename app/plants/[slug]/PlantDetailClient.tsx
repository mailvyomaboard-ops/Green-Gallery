"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, ProductVariant } from "@/lib/types";
import { siteConfig } from "@/config/site";
import { useCart } from "@/lib/cart";
import {
  Sun,
  Droplets,
  Ruler,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  ShoppingBag,
  ArrowUpRight,
  MapPin
} from "lucide-react";

export default function PlantDetailClient({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [selectedImage, setSelectedImage] = useState<string>(product.mainImage);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);
  const { addItem } = useCart();

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;

  const handleAddToList = () => {
    addItem(product, selectedVariant?.id, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  const whatsappMessage = `Hello GreenGallery, I would like to enquire about availability and quote for "${product.name}" (${selectedVariant ? selectedVariant.label : "Standard"}) for delivery in Pune.`;

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Product Specimen Showcase */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative min-h-[360px] sm:h-[480px] w-full rounded-3xl overflow-hidden shadow-soft border border-green-900/10 dark:border-white/10 bg-gradient-to-br from-green-950 via-[#0B2B1E] to-[#040E0A] p-6 sm:p-8 flex flex-col justify-between text-white">
            {selectedImage ? (
              <>
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 600px"
                />
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-sm text-xs font-bold text-green-950 dark:text-green-300 uppercase tracking-wider shadow-sm">
                  {product.stockLabel}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-green-300 border border-white/15">
                    {product.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-xs font-mono text-green-300 border border-green-500/30">
                    {product.stockLabel}
                  </span>
                </div>

                <div className="my-auto py-6">
                  <span className="text-xs font-mono text-green-400 uppercase tracking-widest block mb-2">Botanical Specimen Sheet</span>
                  <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white mb-1">
                    {product.name}
                  </h2>
                  <p className="text-sm text-white/70 italic font-mono mb-4">{product.botanicalName}</p>

                  <div className="grid grid-cols-2 gap-3 max-w-sm pt-4 border-t border-white/10 text-xs">
                    <div>
                      <span className="text-white/60 block text-[10px] uppercase font-mono">Height Profile</span>
                      <span className="font-semibold text-white">{product.careGuide.height}</span>
                    </div>
                    <div>
                      <span className="text-white/60 block text-[10px] uppercase font-mono">Size Category</span>
                      <span className="font-semibold text-white">{product.sizeCategory}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-green-300/80">
                  <span>Alandi Logistical Staging Depot</span>
                  <span>Pune &amp; PCMC Delivery</span>
                </div>
              </>
            )}
          </div>

          {/* Thumbnail gallery */}
          {product.images && product.images.filter(Boolean).length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    selectedImage === img
                      ? "border-green-600 scale-105"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`${product.name} view ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Plant Information & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-green-700 dark:text-green-400 block mb-1">
              {product.category}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-green-950 dark:text-white tracking-tight">
              {product.name}
            </h1>
            <p className="text-sm text-ink-500 dark:text-white/60 italic mt-0.5">
              {product.botanicalName}
            </p>
          </div>

          {/* Reference Pricing and Staging Note */}
          <div className="bg-cream-50 dark:bg-[#080A09] p-5 rounded-3xl border border-green-900/10 dark:border-white/10 space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-3xl font-extrabold text-green-950 dark:text-white">
                ₹{currentPrice.toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-ink-500 dark:text-white/60">
                (Indicative specimen rate · Bulk project rates available)
              </span>
            </div>
            <p className="text-xs text-ink-700 dark:text-white/70 font-light flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-green-600 shrink-0" />
              <span>Staged at Alandi depot for verified root vigour and pest health.</span>
            </p>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-ink-700 dark:text-white/80 font-light leading-relaxed">
            {product.description}
          </p>

          {/* Variants / Container Sizes */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-green-950 dark:text-white block">
                Select Grade / Container Size:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedVariant?.id === variant.id
                        ? "border-green-600 bg-green-50 dark:bg-green-950/60 text-green-950 dark:text-white shadow-xs"
                        : "border-green-900/10 dark:border-white/10 bg-white dark:bg-white/5 text-ink-700 dark:text-white/70 hover:bg-cream-50"
                    }`}
                  >
                    <div className="text-xs font-semibold">{variant.label}</div>
                    <div className="text-[11px] text-green-800 dark:text-green-300 font-bold mt-0.5">
                      ₹{variant.price.toLocaleString("en-IN")}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center border border-green-900/10 dark:border-white/10 rounded-full bg-white dark:bg-white/5 px-3 py-1.5 justify-between sm:justify-start gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-full bg-cream-100 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-green-950 dark:text-white"
              >
                -
              </button>
              <span className="text-xs font-bold text-green-950 dark:text-white min-w-[20px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-full bg-cream-100 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-green-950 dark:text-white"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToList}
              className="flex-1 py-3 px-6 rounded-full bg-green-950 dark:bg-green-600 hover:bg-green-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{addedNotice ? "Added to Enquiry List!" : "Add to Quotation List"}</span>
            </button>

            <a
              href={`https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-5 rounded-full bg-green-700 hover:bg-green-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>WhatsApp</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {addedNotice && (
            <div className="p-3 rounded-2xl bg-green-100 dark:bg-green-950 text-green-900 dark:text-green-300 text-xs flex items-center justify-between">
              <span>Item added to your enquiry basket.</span>
              <Link href="/store/cart" className="underline font-bold">
                Review Basket →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Horticultural Care & Specifications */}
      <div className="bg-white dark:bg-[#080A09] rounded-3xl p-6 sm:p-8 border border-green-900/10 dark:border-white/10 shadow-soft space-y-6">
        <h2 className="font-display text-2xl font-bold text-green-950 dark:text-white">
          Care Guide &amp; Microclimatic Needs
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-cream-50 dark:bg-white/5 border border-green-900/5 space-y-1">
            <div className="flex items-center gap-1.5 text-green-800 dark:text-green-400 font-semibold text-xs">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Light Requirement</span>
            </div>
            <p className="text-xs text-ink-700 dark:text-white/70 font-light leading-relaxed">
              {product.careGuide.light}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-cream-50 dark:bg-white/5 border border-green-900/5 space-y-1">
            <div className="flex items-center gap-1.5 text-green-800 dark:text-green-400 font-semibold text-xs">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span>Watering Schedule</span>
            </div>
            <p className="text-xs text-ink-700 dark:text-white/70 font-light leading-relaxed">
              {product.careGuide.water}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-cream-50 dark:bg-white/5 border border-green-900/5 space-y-1">
            <div className="flex items-center gap-1.5 text-green-800 dark:text-green-400 font-semibold text-xs">
              <Ruler className="w-4 h-4 text-green-600" />
              <span>Height &amp; Spread</span>
            </div>
            <p className="text-xs text-ink-700 dark:text-white/70 font-light leading-relaxed">
              {product.careGuide.height}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-cream-50 dark:bg-white/5 border border-green-900/5 space-y-1">
            <div className="flex items-center gap-1.5 text-green-800 dark:text-green-400 font-semibold text-xs">
              <Thermometer className="w-4 h-4 text-rose-500" />
              <span>Pune Climate Tolerance</span>
            </div>
            <p className="text-xs text-ink-700 dark:text-white/70 font-light leading-relaxed">
              {product.careGuide.temperature || "15°C to 40°C. Acclimatized for Western Maharashtra conditions."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
