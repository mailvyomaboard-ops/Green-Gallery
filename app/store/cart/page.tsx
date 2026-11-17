"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart";
import { ArrowRight, ShoppingBag, ArrowUpRight, MapPin } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();
  const [pincode, setPincode] = useState("411033");
  const [pincodeCheckMessage, setPincodeCheckMessage] = useState("");

  const checkPincode = () => {
    if (/^41[12][0-9]{3}$/.test(pincode.trim())) {
      setPincodeCheckMessage("✓ Direct staging delivery available across Pune & PCMC.");
    } else {
      setPincodeCheckMessage("ℹ Address appears outside Pune metropolitan limits. Dedicated site transport will be quoted.");
    }
  };

  return (
    <div className="w-full pb-20 px-3 sm:px-6 max-w-[1240px] mx-auto space-y-10">
      {/* Saturated Header Banner */}
      <section className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-green-950 text-white p-8 sm:p-12 md:p-16 border border-green-800/40 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-green-300 text-xs font-bold uppercase tracking-wider">
            <span>Plant Supply &amp; Staging</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Quotation &amp; Enquiry Basket
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl leading-relaxed font-light">
            Review your selected botanical specimens. Submitting this enquiry list generates a formal quotation with batch availability, root health verification, and Pune site delivery timelines.
          </p>
        </div>
      </section>

      {/* Cart Content */}
      <section>
        {items.length === 0 ? (
          <div className="bg-white dark:bg-[#080A09] border border-green-900/10 dark:border-white/10 p-12 sm:p-16 text-center rounded-3xl shadow-soft max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-cream-50 dark:bg-white/10 text-green-950 dark:text-white flex items-center justify-center mx-auto mb-4 border border-green-900/10">
              <ShoppingBag className="w-8 h-8 text-green-900 dark:text-green-300" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-green-950 dark:text-white mb-2">
              Your enquiry basket is empty
            </h2>
            <p className="text-sm text-ink-700 dark:text-white/70 mb-6 max-w-md mx-auto font-light">
              Explore our catalogue of acclimatized trees, indoor architectural plants, and planters.
            </p>
            <Link
              href="/plants"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-green-950 dark:bg-green-600 hover:bg-green-800 text-white font-bold text-sm rounded-full shadow transition-all"
            >
              <span>Browse Plant Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Items List */}
            <div className="lg:col-span-8 bg-white dark:bg-[#080A09] border border-green-900/10 dark:border-white/10 rounded-3xl overflow-hidden shadow-soft divide-y divide-cream-200 dark:divide-white/10">
              <div className="p-5 sm:p-6 flex justify-between items-center bg-cream-50/80 dark:bg-white/5">
                <span className="text-xs uppercase tracking-wider font-bold text-green-950 dark:text-white">
                  Enquiry Items ({items.length})
                </span>
                <span className="text-xs text-ink-500 dark:text-white/60 font-sans flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-green-600" />
                  Staged at Alandi Depot
                </span>
              </div>

              {items.map((item, idx) => (
                <div key={idx} className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 bg-cream-100 rounded-2xl overflow-hidden flex-shrink-0 border border-green-900/10">
                      <Image src={item.image} alt={item.productName} fill className="object-cover" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-green-950 dark:text-white text-base sm:text-lg">
                        {item.productName}
                      </h3>
                      {item.variantLabel && (
                        <p className="text-xs text-ink-500 dark:text-white/60">{item.variantLabel}</p>
                      )}
                      <p className="text-xs font-bold text-green-700 dark:text-green-400 mt-1">
                        Ref: ₹{item.unitPrice.toLocaleString("en-IN")} each
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:justify-end">
                    <div className="flex items-center border border-green-900/15 dark:border-white/10 rounded-full bg-cream-50 dark:bg-white/10 p-0.5">
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, -1)}
                        className="w-8 h-8 rounded-full hover:bg-white dark:hover:bg-white/20 text-ink-900 dark:text-white text-sm font-bold flex items-center justify-center cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-xs font-bold text-green-950 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, 1)}
                        className="w-8 h-8 rounded-full hover:bg-white dark:hover:bg-white/20 text-ink-900 dark:text-white text-sm font-bold flex items-center justify-center cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.productId, item.variantId)}
                      className="text-xs text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-4 bg-white dark:bg-[#080A09] border border-green-900/10 dark:border-white/10 rounded-3xl p-6 sm:p-7 shadow-soft space-y-6">
              <h3 className="font-display font-bold text-lg text-green-950 dark:text-white pb-3 border-b border-cream-200 dark:border-white/10">
                Quotation Summary
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between text-ink-700 dark:text-white/70">
                  <span>Estimated Total (Excl. Tax &amp; Freight)</span>
                  <span className="font-semibold text-green-950 dark:text-white">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-[11px] text-ink-500 dark:text-white/50 leading-relaxed font-light">
                  Exact delivery fees and volume discounts will be finalized upon reviewing site location and loading access.
                </p>
              </div>

              {/* Pincode Check */}
              <div className="pt-2 space-y-2">
                <label className="text-xs font-semibold text-green-950 dark:text-white block">
                  Verify Pune Delivery Area:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g. 411045"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-cream-50 dark:bg-white/10 border border-green-900/10 dark:border-white/10 text-xs text-green-950 dark:text-white focus:outline-none"
                  />
                  <button
                    onClick={checkPincode}
                    className="px-4 py-2 bg-cream-200 dark:bg-white/20 hover:bg-cream-300 text-green-950 dark:text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Check
                  </button>
                </div>
                {pincodeCheckMessage && (
                  <p className="text-xs text-green-800 dark:text-green-300 font-medium">
                    {pincodeCheckMessage}
                  </p>
                )}
              </div>

              <Link
                href="/store/checkout"
                className="w-full py-3.5 px-6 rounded-full bg-green-950 dark:bg-green-600 hover:bg-green-800 text-white font-bold text-xs uppercase tracking-wider shadow text-center flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Proceed to Request Quotation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
