"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { initialProducts } from "@/lib/data";
import { siteConfig } from "@/config/site";
import { useCart } from "@/lib/cart";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const product = initialProducts.find(
    (p) => p.slug === resolvedParams.id || p.id === resolvedParams.id
  );

  if (!product) {
    notFound();
  }

  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0] || null);
  const [activeImage, setActiveImage] = useState(product.mainImage);
  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState(false);

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const isBulkOrder = quantity >= product.bulkThreshold;

  const handleAddToCart = () => {
    if (isBulkOrder) {
      router.push(
        `/contact?type=quote&service=${encodeURIComponent(
          `Bulk Plant Supply: ${quantity}x ${product.name}`
        )}`
      );
      return;
    }

    addToCart({
      productId: product.id,
      variantId: selectedVariant?.id,
      productName: product.name,
      variantLabel: selectedVariant?.label,
      unitPrice: currentPrice,
      quantity,
      image: product.mainImage,
    });

    setToastMessage(true);
    setTimeout(() => setToastMessage(false), 2500);
  };

  const whatsappMessage = `Hello GreenGallery, I am inquiring about the ${product.name} (${product.botanicalName}) listed on your catalogue. Is this specimen currently available for site delivery in Pune?`;

  return (
    <div className="w-full pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 z-50 bg-green-900 text-cream-50 px-5 py-3 rounded-brand shadow-xl text-xs sm:text-sm flex items-center gap-2 animate-fadeIn">
          <svg className="w-4 h-4 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span>Added {quantity} × <strong>{product.name}</strong> to cart.</span>
          <Link href="/store/cart" className="underline font-semibold ml-2 text-gold-600">
            View Cart
          </Link>
        </div>
      )}

      {/* Breadcrumb Header */}
      <section className="bg-green-900 text-cream-50 py-10 px-4 sm:px-6 border-b border-green-700/50">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-2 text-xs text-cream-50/70">
            <Link href="/" className="hover:text-cream-50">Home</Link>
            <span>/</span>
            <Link href="/store" className="hover:text-cream-50">Store</Link>
            <span>/</span>
            <span className="text-gold-600">{product.name}</span>
          </div>
        </div>
      </section>

      {/* Main Product Showcase */}
      <section className="py-12 px-4 sm:px-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative min-h-[420px] sm:h-[500px] w-full bg-gradient-to-br from-green-950 via-[#0B2B1E] to-[#040E0A] p-6 sm:p-8 rounded-3xl overflow-hidden border border-green-900/10 shadow-soft flex flex-col justify-between text-white">
              {activeImage ? (
                <>
                  <Image
                    src={activeImage}
                    alt={product.name}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute top-4 left-4 bg-green-950 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
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
                    <h2 className="text-3xl font-display font-extrabold text-white mb-1">
                      {product.name}
                    </h2>
                    <p className="text-sm text-white/70 italic font-mono mb-4">{product.botanicalName}</p>

                    <div className="grid grid-cols-2 gap-4 max-w-sm pt-4 border-t border-white/10 text-xs">
                      <div>
                        <span className="text-white/60 block text-[10px] uppercase font-mono">Sunlight Spec</span>
                        <span className="font-semibold text-white">{product.lightRequirement}</span>
                      </div>
                      <div>
                        <span className="text-white/60 block text-[10px] uppercase font-mono">Staging Location</span>
                        <span className="font-semibold text-white">Alandi Logistical Depot</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-green-300/80">
                    <span>Pune &amp; PCMC Direct Supply</span>
                    <span className="font-mono text-white/90 font-bold">+91 78230 80251</span>
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.filter(Boolean).length > 1 && (
              <div className="flex items-center gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                      activeImage === img ? "border-green-600 scale-95" : "border-cream-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`${product.name} view ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Spec Sheet, Pricing & Ordering */}
          <div className="lg:col-span-6 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-green-900/10 shadow-soft">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-green-700">
                {product.category} · {product.sizeCategory}
              </span>
              <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-green-950 mt-1">
                {product.name}
              </h1>
              <p className="text-base italic text-ink-500 mt-0.5">{product.botanicalName}</p>
            </div>

            {/* Price display */}
            <div className="bg-cream-50 p-5 rounded-2xl border border-green-900/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-ink-500 block font-bold uppercase tracking-wider">Unit Price (excl. 18% GST)</span>
                <span className="font-display text-3xl font-extrabold text-green-950">
                  ₹{currentPrice.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="text-right text-xs text-ink-500">
                <span className="font-bold text-green-950 block">
                  {product.stockQuantity > 0 ? `${product.stockQuantity} specimens in nursery` : "Out of Stock"}
                </span>
                <span>Alandi staging depot</span>
              </div>
            </div>

            {/* Short Description */}
            <p className="text-sm text-ink-700 leading-relaxed font-light">
              {product.description}
            </p>

            {/* Variants Selector */}
            {product.variants.length > 0 && (
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-green-950 mb-2">
                  Select Container / Specimen Size
                </label>
                <div className="space-y-2">
                  {product.variants.map((v) => (
                    <label
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`flex items-center justify-between p-3.5 border rounded-2xl text-xs sm:text-sm cursor-pointer transition-all ${
                        selectedVariant?.id === v.id
                          ? "bg-green-100/90 border-green-600 text-green-950 font-bold"
                          : "bg-cream-50 border-green-900/10 text-ink-900 hover:border-green-600/40"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="product_variant"
                          checked={selectedVariant?.id === v.id}
                          onChange={() => setSelectedVariant(v)}
                          className="accent-green-950 w-4 h-4"
                        />
                        <span>{v.label}</span>
                      </div>
                      <span className="font-bold">₹{v.price.toLocaleString("en-IN")}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Bulk Threshold Notice */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase tracking-wider font-bold text-green-950">
                  Quantity Required
                </label>
                {quantity >= product.bulkThreshold && (
                  <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-0.5 rounded-full">
                    Bulk Project Order Threshold Reached (≥ {product.bulkThreshold} units)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border border-green-900/15 rounded-full bg-cream-50 overflow-hidden p-0.5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full hover:bg-white text-ink-900 text-base font-bold flex items-center justify-center cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-14 text-center text-sm font-bold text-green-950 bg-transparent focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full hover:bg-white text-ink-900 text-base font-bold flex items-center justify-center cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <div className="flex-1">
                  {isBulkOrder ? (
                    <Link
                      href={`/contact?type=quote&service=${encodeURIComponent(
                        `Bulk Plant Supply: ${quantity}x ${product.name}`
                      )}`}
                      className="w-full min-h-[48px] px-6 py-3 bg-green-950 hover:bg-green-800 text-white font-bold text-xs sm:text-sm rounded-full shadow cursor-pointer inline-flex items-center justify-center text-center"
                    >
                      Request Bulk Project Quote (Wholesale Rate)
                    </Link>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      disabled={!product.inStock}
                      className="w-full min-h-[48px] px-6 py-3 bg-green-950 hover:bg-green-700 text-white font-bold text-xs sm:text-sm rounded-full shadow cursor-pointer disabled:opacity-40"
                    >
                      {product.inStock ? `Add to Cart — ₹${(currentPrice * quantity).toLocaleString("en-IN")}` : "Currently Out of Stock"}
                    </button>
                  )}
                </div>
              </div>

              {isBulkOrder && (
                <p className="text-xs text-ink-500 mt-2 font-light">
                  Orders of 25+ specimens receive commercial developer pricing, phased nursery staging, and freight dispatch. Bulk quotes are not paid online.
                </p>
              )}
            </div>

            {/* Direct WhatsApp Consultation */}
            <div>
              <a
                href={`https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[44px] px-6 py-2.5 border border-green-950 text-green-950 hover:bg-green-50 font-bold text-xs rounded-full flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Chat with GreenGallery on WhatsApp</span>
              </a>
            </div>

            {/* Delivery Note */}
            <div className="p-4 bg-cream-50 border border-green-900/10 rounded-2xl text-xs text-ink-700 space-y-1">
              <span className="font-bold text-green-950 block">Pune Metropolitan Delivery Guarantee:</span>
              <p className="font-light">{product.deliveryNote}</p>
            </div>
          </div>
        </div>

        {/* Botanical Care Guide */}
        <div className="mt-16 pt-12 border-t border-cream-200">
          <h2 className="text-2xl font-serif font-semibold text-green-900 mb-6">
            Botanical Care & Cultivation Guide
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-cream-50 border border-cream-200 p-6 rounded-brand">
              <span className="text-xs uppercase tracking-wider font-semibold text-green-700 block mb-2">
                Sunlight & Placement
              </span>
              <p className="text-sm text-ink-900">{product.careGuide.light}</p>
            </div>

            <div className="bg-cream-50 border border-cream-200 p-6 rounded-brand">
              <span className="text-xs uppercase tracking-wider font-semibold text-green-700 block mb-2">
                Watering Schedule
              </span>
              <p className="text-sm text-ink-900">{product.careGuide.water}</p>
            </div>

            <div className="bg-cream-50 border border-cream-200 p-6 rounded-brand">
              <span className="text-xs uppercase tracking-wider font-semibold text-green-700 block mb-2">
                Height & Growth Habit
              </span>
              <p className="text-sm text-ink-900">{product.careGuide.height}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
