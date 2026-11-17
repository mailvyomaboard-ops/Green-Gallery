"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { initialProducts } from "@/lib/data";
import { Product } from "@/lib/types";
import {
  Search,
  Filter,
  ArrowRight,
  Sun,
  ShieldCheck,
  ShoppingBag,
  Info,
  MapPin,
  Sparkles
} from "lucide-react";
import { useCart } from "@/lib/cart";

export default function PlantsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { addItem } = useCart();
  const [enquiryAdded, setEnquiryAdded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch(() => {});
  }, []);

  const categories = [
    "All",
    "Indoor Plants",
    "Outdoor Plants",
    "Trees and Palms",
    "Shrubs and Hedges",
    "Planters and Pots",
    "Soil and Care Products",
  ];

  const filtered = products.filter((p) => {
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.botanicalName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddToEnquiry = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    addItem(product);
    setEnquiryAdded(product.id);
    setTimeout(() => setEnquiryAdded(null), 2000);
  };

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-green-700 dark:text-green-400">
          Botanical Supply &amp; Staging
        </span>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-green-950 dark:text-white tracking-tight">
          Plant &amp; Specimen Catalogue
        </h1>
        <p className="text-sm sm:text-base text-ink-700 dark:text-white/70 font-light leading-relaxed">
          Acclimatized indoor and outdoor specimens, architectural avenue trees, and engineered soil mixes. Staged at our Alandi logistics depot and delivered across Pune &amp; PCMC.
        </p>

        {/* Operational Notice Box */}
        <div className="inline-flex items-center gap-2 p-3 rounded-2xl bg-cream-100 dark:bg-white/5 border border-green-900/10 dark:border-white/10 text-xs text-ink-700 dark:text-white/80">
          <MapPin className="w-4 h-4 text-green-600 shrink-0" />
          <span>
            <strong>Enquiry-First Catalogue:</strong> Add specimens to your quotation list to receive batch availability, delivery timelines, and volume rates.
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-[#080A09] p-4 rounded-3xl border border-green-900/10 dark:border-white/10 shadow-soft">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plant or botanical name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-cream-50 dark:bg-white/5 border border-green-900/10 dark:border-white/10 text-xs text-green-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-600/30"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-green-950 dark:bg-green-600 text-white shadow-xs"
                  : "bg-cream-50 dark:bg-white/5 text-ink-700 dark:text-white/70 hover:bg-cream-100 dark:hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((prod) => (
          <Link
            key={prod.id}
            href={`/plants/${prod.slug}`}
            className="bg-white dark:bg-[#080A09] rounded-3xl p-4 border border-green-900/10 dark:border-white/10 shadow-soft hover:shadow-glow transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-60 w-full rounded-2xl overflow-hidden mb-3 bg-cream-100">
                <Image
                  src={prod.mainImage}
                  alt={prod.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
                />
                <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-sm text-[9px] font-bold text-green-950 dark:text-green-300 uppercase tracking-wider shadow-sm">
                  {prod.stockLabel}
                </div>
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 dark:text-green-400 block mb-0.5">
                {prod.category}
              </span>
              <h3 className="font-display text-base font-bold text-green-950 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-1">
                {prod.name}
              </h3>
              <p className="text-[11px] text-ink-500 dark:text-white/50 italic line-clamp-1 mb-2">
                {prod.botanicalName}
              </p>

              <div className="flex items-center gap-2 text-[11px] text-ink-500 dark:text-white/60 pt-1">
                <span className="flex items-center gap-1">
                  <Sun className="w-3 h-3 text-amber-500" />
                  {prod.lightRequirement}
                </span>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-cream-200 dark:border-white/10 flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] text-ink-500 dark:text-white/50 block">Ref. Rate</span>
                <span className="font-display font-extrabold text-sm text-green-950 dark:text-white">
                  ₹{prod.price.toLocaleString("en-IN")}
                </span>
              </div>

              <button
                onClick={(e) => handleAddToEnquiry(e, prod)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  enquiryAdded === prod.id
                    ? "bg-green-600 text-white"
                    : "bg-green-100 dark:bg-green-950 text-green-900 dark:text-green-300 hover:bg-green-950 hover:text-white"
                }`}
                title="Add to quotation enquiry list"
              >
                <ShoppingBag className="w-3 h-3" />
                <span>{enquiryAdded === prod.id ? "Added!" : "Add to List"}</span>
              </button>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-cream-50 dark:bg-white/5 rounded-3xl p-8">
          <p className="text-sm text-ink-500 dark:text-white/60">No plant specimens match your filter criteria.</p>
        </div>
      )}
    </div>
  );
}
