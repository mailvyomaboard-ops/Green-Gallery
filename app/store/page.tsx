"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { initialProducts } from "@/lib/data";
import { useCart } from "@/lib/cart";
import { ArrowRight, ShoppingBag, Check } from "lucide-react";

const CATEGORIES = [
  "All Categories",
  "Indoor Plants",
  "Outdoor Plants",
  "Trees and Palms",
  "Shrubs and Hedges",
  "Planters and Pots",
  "Soil and Care Products",
] as const;

const LIGHT_REQUIREMENTS = [
  "All Light Conditions",
  "Full Sun",
  "Partial Shade",
  "Bright Indirect / Shade",
] as const;

export default function StoreCatalogPage() {
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [selectedLight, setSelectedLight] = useState<string>("All Light Conditions");
  const [maxPrice, setMaxPrice] = useState<number>(15000);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.botanicalName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All Categories" || product.category === selectedCategory;

      const matchesLight =
        selectedLight === "All Light Conditions" || product.lightRequirement === selectedLight;

      const matchesPrice = product.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesLight && matchesPrice;
    });
  }, [searchQuery, selectedCategory, selectedLight, maxPrice]);

  const handleQuickAdd = (product: (typeof initialProducts)[0], e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      productId: product.id,
      variantId: product.variants[0]?.id,
      productName: product.name,
      variantLabel: product.variants[0]?.label || "Standard",
      unitPrice: product.variants[0]?.price || product.price,
      quantity: 1,
      image: product.mainImage,
    });

    setAddedToast(product.name);
    setTimeout(() => setAddedToast(null), 2500);
  };

  return (
    <div className="w-full pb-20 px-3 sm:px-6 max-w-[1240px] mx-auto space-y-10">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-24 right-6 z-50 bg-green-950 text-white px-5 py-3 rounded-full shadow-2xl text-xs sm:text-sm flex items-center gap-2 border border-green-600 animate-fadeIn">
          <Check className="w-4 h-4 text-green-400" />
          <span>Added <strong>{addedToast}</strong> to cart.</span>
          <Link href="/store/cart" className="underline font-bold ml-2 text-green-300">
            View Cart
          </Link>
        </div>
      )}

      {/* Saturated Botanical Hero Banner */}
      <section className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-green-950 text-white p-8 sm:p-12 md:p-16 border border-green-800/40 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-green-300 text-xs font-bold uppercase tracking-wider mb-4">
            <span>Alandi Logistical Staging &amp; Supply</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Specimen Nursery Store
          </h1>
          <p className="text-white/80 text-base sm:text-lg max-w-2xl leading-relaxed font-light mt-3">
            Acclimatized specimen trees, architectural indoor foliage, handcrafted basalt planters, and specialized potting substrates. Doorstep delivery across Pune.
          </p>
        </div>
      </section>

      {/* Main Catalog View with Sidebar Filters */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Filter Sidebar in Rounded White Card */}
        <aside className="lg:col-span-3 bg-white border border-green-900/10 p-6 rounded-3xl space-y-6 shadow-soft">
          <div>
            <h3 className="font-display text-base font-bold text-green-950 mb-3">Search Catalog</h3>
            <input
              type="text"
              placeholder="Search plant or botanical..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 bg-cream-50 border border-green-900/10 rounded-full text-xs sm:text-sm text-ink-900 focus:border-green-600 focus:outline-none"
            />
          </div>

          {/* Category Filter Pills */}
          <div>
            <h3 className="font-display text-base font-bold text-green-950 mb-3">Categories</h3>
            <div className="space-y-1.5 text-xs sm:text-sm">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`block w-full text-left px-3.5 py-2 rounded-full transition-all cursor-pointer font-medium ${
                    selectedCategory === cat
                      ? "bg-green-950 text-white font-bold shadow-xs"
                      : "text-ink-700 hover:text-green-950 hover:bg-cream-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Light Requirement Filter */}
          <div>
            <h3 className="font-display text-base font-bold text-green-950 mb-3">Sunlight</h3>
            <div className="space-y-1.5 text-xs sm:text-sm">
              {LIGHT_REQUIREMENTS.map((light) => (
                <button
                  key={light}
                  onClick={() => setSelectedLight(light)}
                  className={`block w-full text-left px-3.5 py-2 rounded-full transition-all cursor-pointer font-medium ${
                    selectedLight === light
                      ? "bg-green-950 text-white font-bold shadow-xs"
                      : "text-ink-700 hover:text-green-950 hover:bg-cream-50"
                  }`}
                >
                  {light}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-display text-base font-bold text-green-950">Price Ceiling</h3>
              <span className="text-xs font-bold text-green-700">₹{maxPrice.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min="500"
              max="15000"
              step="250"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-green-950 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-ink-500 mt-1 font-mono">
              <span>₹500</span>
              <span>₹15,000+</span>
            </div>
          </div>

          {/* Reset Filters */}
          {(selectedCategory !== "All Categories" ||
            selectedLight !== "All Light Conditions" ||
            searchQuery ||
            maxPrice < 15000) && (
            <button
              onClick={() => {
                setSelectedCategory("All Categories");
                setSelectedLight("All Light Conditions");
                setSearchQuery("");
                setMaxPrice(15000);
              }}
              className="w-full py-2.5 text-xs font-bold text-red-700 hover:bg-red-50 border border-red-200 rounded-full cursor-pointer transition-colors"
            >
              Reset All Filters
            </button>
          )}
        </aside>

        {/* Right Column: Products Grid */}
        <div className="lg:col-span-9">
          <div className="flex items-center justify-between mb-6 text-xs text-ink-500 px-1">
            <span className="font-bold text-green-950">Showing {filteredProducts.length} specimens</span>
            <span>All stock staged &amp; conditioned for Pune climate</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-green-900/10 p-12 text-center rounded-3xl shadow-soft">
              <p className="text-lg font-display font-bold text-green-950 mb-2">No matching nursery specimens found.</p>
              <p className="text-sm text-ink-500 mb-4 font-light">Try relaxing your search keywords or filter settings.</p>
              <button
                onClick={() => {
                  setSelectedCategory("All Categories");
                  setSelectedLight("All Light Conditions");
                  setSearchQuery("");
                  setMaxPrice(15000);
                }}
                className="px-6 py-2.5 bg-green-950 text-white text-xs font-bold rounded-full cursor-pointer hover:bg-green-800"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <Link
                  key={prod.id}
                  href={`/store/${prod.slug}`}
                  className="group bg-white border border-green-900/10 rounded-3xl p-4 sm:p-5 overflow-hidden flex flex-col justify-between hover:border-green-600 transition-all shadow-soft hover:shadow-glow"
                >
                  <div>
                    <div className="relative h-56 w-full rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-green-950 via-[#0B2B1E] to-[#040E0A] p-4 flex flex-col justify-between text-white border border-green-800/30">
                      {prod.mainImage ? (
                        <>
                          <Image
                            src={prod.mainImage}
                            alt={prod.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                            loading="lazy"
                          />
                          <div
                            className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-3 py-1 rounded-full shadow-xs uppercase tracking-wider ${
                              prod.stockQuantity > 10
                                ? "bg-white/95 text-green-950"
                                : prod.stockQuantity > 0
                                ? "bg-amber-100 text-amber-900"
                                : "bg-red-100 text-red-900"
                            }`}
                          >
                            {prod.stockLabel}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-1 rounded-full bg-white/10 text-[10px] font-mono text-green-300 border border-white/10">
                              {prod.category}
                            </span>
                            <span className="text-[10px] font-mono text-green-400 bg-green-950/80 px-2 py-0.5 rounded border border-green-500/30">
                              Alandi Depot
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-green-400 uppercase tracking-wider block">Acclimatized Palette</span>
                            <span className="text-sm font-bold text-white truncate block">{prod.name}</span>
                            <span className="text-xs text-white/60 italic block mt-0.5">{prod.botanicalName}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="px-1">
                      <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest block mb-1">
                        {prod.category}
                      </span>
                      <h2 className="text-lg font-display font-bold text-green-950 group-hover:text-green-700 transition-colors line-clamp-1">
                        {prod.name}
                      </h2>
                      <p className="text-xs italic text-ink-500 mb-2">{prod.botanicalName}</p>

                      <div className="text-xs text-ink-500 line-clamp-2 font-light">
                        {prod.description}
                      </div>
                    </div>
                  </div>

                  <div className="p-1 pt-4 mt-4 border-t border-cream-200/60 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-ink-500 block">Nursery Price</span>
                      <span className="font-display font-extrabold text-green-950 text-base">
                        ₹{prod.price.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleQuickAdd(prod, e)}
                      disabled={!prod.inStock}
                      className="min-h-[38px] px-4 py-1.5 bg-green-950 hover:bg-green-700 text-white text-xs font-bold rounded-full transition-all cursor-pointer disabled:opacity-40 flex items-center gap-1.5 shadow"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{prod.inStock ? "Add" : "Out"}</span>
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
