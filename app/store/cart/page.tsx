"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart";
import { ArrowRight, ShoppingBag, ArrowUpRight } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal, gstAmount, deliveryFee, grandTotal } = useCart();
  const [pincode, setPincode] = useState("411033");
  const [pincodeCheckMessage, setPincodeCheckMessage] = useState("");

  const checkPincode = () => {
    if (/^41[12][0-9]{3}$/.test(pincode.trim())) {
      setPincodeCheckMessage("✓ Verified: Delivery available via Green Gallery Pune nursery vans.");
    } else {
      setPincodeCheckMessage("✕ Address is outside Pune metropolitan limits. Please submit a Project Quote for long-distance freight.");
    }
  };

  return (
    <div className="w-full pb-20 px-3 sm:px-6 max-w-[1240px] mx-auto space-y-10">
      {/* Saturated Header Banner */}
      <section className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-green-950 text-white p-8 sm:p-12 md:p-16 border border-green-800/40 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-green-300 text-xs font-bold uppercase tracking-wider mb-4">
            <span>Direct Nursery Dispatch</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Nursery Order Cart
          </h1>
          <p className="text-white/80 text-base sm:text-lg max-w-2xl leading-relaxed font-light mt-3">
            Review your selected specimen stock. Orders are prepared directly at our 14-acre Tathawade bays with specialized packaging.
          </p>
        </div>
      </section>

      {/* Cart Content */}
      <section>
        {items.length === 0 ? (
          <div className="bg-white border border-green-900/10 p-12 sm:p-16 text-center rounded-3xl shadow-soft max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-cream-50 text-green-950 flex items-center justify-center mx-auto mb-4 border border-green-900/10">
              <ShoppingBag className="w-8 h-8 text-green-900" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-green-950 mb-2">
              Your cart is currently empty
            </h2>
            <p className="text-sm text-ink-700 mb-6 max-w-md mx-auto font-light">
              Explore our collection of acclimatized specimen trees, indoor architectural plants, and handcrafted basalt planters.
            </p>
            <Link
              href="/store"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-green-950 hover:bg-green-800 text-white font-bold text-sm rounded-full shadow transition-all"
            >
              <span>Browse Nursery Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Items List */}
            <div className="lg:col-span-8 bg-white border border-green-900/10 rounded-3xl overflow-hidden shadow-soft divide-y divide-cream-200">
              <div className="p-5 sm:p-6 flex justify-between items-center bg-cream-50/80">
                <span className="text-xs uppercase tracking-wider font-bold text-green-950">
                  Order Items ({items.length})
                </span>
                <span className="text-xs text-ink-500 font-mono">Dispatched from Tathawade</span>
              </div>

              {items.map((item, idx) => (
                <div key={idx} className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 bg-cream-100 rounded-2xl overflow-hidden flex-shrink-0 border border-green-900/10">
                      <Image src={item.image} alt={item.productName} fill className="object-cover" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-green-950 text-base sm:text-lg">
                        {item.productName}
                      </h3>
                      {item.variantLabel && (
                        <p className="text-xs text-ink-500">{item.variantLabel}</p>
                      )}
                      <p className="text-xs font-bold text-green-700 mt-1">
                        ₹{item.unitPrice.toLocaleString("en-IN")} each
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:justify-end">
                    {/* Qty changer */}
                    <div className="flex items-center border border-green-900/15 rounded-full bg-cream-50 p-0.5">
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, -1)}
                        className="w-8 h-8 rounded-full hover:bg-white text-ink-900 text-sm font-bold flex items-center justify-center cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-xs font-bold text-green-950">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, 1)}
                        className="w-8 h-8 rounded-full hover:bg-white text-ink-900 text-sm font-bold flex items-center justify-center cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-display font-extrabold text-green-950 text-base sm:text-lg block">
                        ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.productId, item.variantId)}
                        className="text-[11px] text-red-700 hover:underline cursor-pointer font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary & Pincode Check */}
            <div className="lg:col-span-4 space-y-6">
              {/* Pincode eligibility checker */}
              <div className="bg-white border border-green-900/10 p-6 rounded-3xl shadow-soft space-y-3">
                <label className="block text-xs uppercase tracking-wider font-bold text-green-950">
                  Check Pune Delivery Pincode
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g. 411033"
                    className="flex-1 px-4 py-2 bg-cream-50 border border-green-900/10 rounded-full text-xs font-bold text-green-950 focus:outline-none"
                  />
                  <button
                    onClick={checkPincode}
                    className="px-4 py-2 bg-green-950 text-white text-xs font-bold rounded-full cursor-pointer hover:bg-green-800"
                  >
                    Verify
                  </button>
                </div>
                {pincodeCheckMessage && (
                  <p
                    className={`text-xs ${
                      pincodeCheckMessage.startsWith("✓") ? "text-green-800" : "text-red-700"
                    }`}
                  >
                    {pincodeCheckMessage}
                  </p>
                )}
              </div>

              {/* Invoice Breakdown */}
              <div className="bg-white border border-green-900/10 p-6 rounded-3xl shadow-soft space-y-4">
                <h3 className="font-display text-lg font-bold text-green-950 border-b border-green-900/10 pb-3">
                  Summary &amp; Estimated Invoice
                </h3>

                <div className="space-y-2.5 text-xs sm:text-sm text-ink-900">
                  <div className="flex justify-between">
                    <span className="text-ink-500 font-light">Plant Subtotal:</span>
                    <span className="font-bold">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-500 font-light">Applicable GST (18%):</span>
                    <span className="font-bold">₹{gstAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-500 font-light">Pune Local Delivery:</span>
                    <span className="font-bold">{deliveryFee === 0 ? "FREE (Orders ≥ ₹5,000)" : `₹${deliveryFee}`}</span>
                  </div>
                  <div className="pt-3 border-t border-green-900/10 flex justify-between font-display font-extrabold text-lg text-green-950">
                    <span>Total Payable:</span>
                    <span className="text-green-700">₹{grandTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/store/checkout"
                    className="w-full min-h-[48px] px-6 py-3.5 bg-green-950 hover:bg-green-800 text-white font-bold text-sm rounded-full shadow flex items-center justify-center gap-2 transition-all text-center"
                  >
                    <span>Proceed to Guest Checkout</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="text-[11px] text-ink-500 text-center leading-relaxed font-light">
                  GST invoice generated automatically on confirmation. Online payments powered by Razorpay (UPI, Netbanking, Cards) and COD for Pune.
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
