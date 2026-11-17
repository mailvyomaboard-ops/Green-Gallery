"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { siteConfig } from "@/config/site";
import { Check, ArrowRight, ArrowUpRight } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, gstAmount, deliveryFee, grandTotal, clearCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [address, setAddress] = useState("");
  const [punePincode, setPunePincode] = useState("411033");
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<any | null>(null);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) errs.name = "Full name is required.";
    if (!customerPhone.trim() || !/^[0-9+() -]{8,15}$/.test(customerPhone.trim())) {
      errs.phone = "Valid 10-digit phone number is required.";
    }
    if (!customerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
      errs.email = "Valid email address is required for invoice delivery.";
    }
    if (!address.trim()) errs.address = "Complete street address is required.";
    if (!/^41[12][0-9]{3}$/.test(punePincode.trim())) {
      errs.pincode = "Delivery is restricted to Pune (Pincode starting 411xxx or 412xxx).";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;
    if (items.length === 0) {
      setServerError("Cart is empty.");
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail,
          address,
          punePincode,
          items,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to process order.");
      }

      setOrderConfirmed(data.order);
      clearCart();
    } catch (err: any) {
      setServerError(err.message || "An unexpected error occurred during checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderConfirmed) {
    return (
      <div className="py-20 px-4 sm:px-6 max-w-2xl mx-auto">
        <div className="bg-white border border-green-900/10 p-8 sm:p-12 rounded-3xl shadow-soft text-center">
          <div className="w-16 h-16 bg-green-950 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow">
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <span className="text-xs uppercase tracking-wider text-green-700 font-bold block mb-1">
            Order Confirmed &amp; Logged
          </span>
          <h1 className="text-3xl font-display font-extrabold text-green-950 mb-2">
            Thank you, {orderConfirmed.customerName}
          </h1>
          <p className="text-sm text-ink-500 mb-6">
            Order Reference: <strong className="text-green-950">{orderConfirmed.orderNumber}</strong>
          </p>

          <div className="bg-cream-50 p-5 rounded-2xl border border-green-900/10 text-left text-xs sm:text-sm space-y-2.5 mb-6">
            <div className="flex justify-between">
              <span className="text-ink-500 font-light">Total Paid / COD Amount:</span>
              <span className="font-bold text-green-950">₹{orderConfirmed.total.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-500 font-light">Payment Status:</span>
              <span className="font-bold text-ink-900">{orderConfirmed.paymentStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-500 font-light">Delivery Address:</span>
              <span className="text-ink-900 font-medium text-right">{orderConfirmed.address}, Pune {orderConfirmed.punePincode}</span>
            </div>
          </div>

          <p className="text-xs text-ink-700 leading-relaxed mb-6 font-light">
            A copy of this GST invoice and delivery transit schedule has been queued for dispatch to <strong>{orderConfirmed.customerEmail}</strong>. Our Tathawade nursery logistics driver will contact you prior to arrival at {orderConfirmed.customerPhone}.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 bg-cream-50 hover:bg-cream-100 text-green-950 text-xs sm:text-sm font-bold rounded-full transition-all border border-green-900/10"
            >
              Return to Homepage
            </Link>
            <a
              href={`https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(
                `Hello Shubham Batule, I just placed Green Gallery order ${orderConfirmed.orderNumber} (₹${orderConfirmed.total}) for delivery in Pune. Could you confirm the dispatch date?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold rounded-full flex items-center justify-center gap-2 shadow"
            >
              <span>WhatsApp Shubham to Confirm</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-20 px-3 sm:px-6 max-w-[1240px] mx-auto space-y-10">
      <section className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-green-950 text-white p-8 sm:p-12 border border-green-800/40 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-green-300 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Direct Nursery Checkout</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Guest Checkout &amp; Delivery Verification
          </h1>
        </div>
      </section>

      <section>
        {items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-green-900/10 shadow-soft max-w-md mx-auto">
            <p className="text-lg font-display font-bold text-green-950 mb-4">Your cart is empty.</p>
            <Link href="/store" className="px-6 py-3 bg-green-950 text-white text-xs font-bold rounded-full">
              Browse Store
            </Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Guest Delivery Address */}
            <div className="lg:col-span-7 bg-white border border-green-900/10 p-6 sm:p-8 rounded-3xl shadow-soft space-y-5">
              <h2 className="text-xl font-display font-bold text-green-950 border-b border-green-900/10 pb-3">
                1. Delivery &amp; Contact Particulars
              </h2>

              {serverError && (
                <div className="p-3 bg-red-50 border border-red-300 text-red-800 text-xs rounded-2xl">
                  {serverError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-green-950 uppercase tracking-wider mb-1.5">
                  Recipient Full Name <span className="text-red-700">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Vikramaditya Bhosale"
                  className={`w-full px-4 py-3 bg-cream-50 border ${
                    errors.name ? "border-red-600" : "border-green-900/10 focus:border-green-600"
                  } rounded-full text-xs sm:text-sm text-ink-900 focus:outline-none`}
                />
                {errors.name && <p className="text-xs text-red-700 mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-green-950 uppercase tracking-wider mb-1.5">
                    Contact Phone <span className="text-red-700">*</span>
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. +91 98220 00000"
                    className={`w-full px-4 py-3 bg-cream-50 border ${
                      errors.phone ? "border-red-600" : "border-green-900/10 focus:border-green-600"
                    } rounded-full text-xs sm:text-sm text-ink-900 focus:outline-none`}
                  />
                  {errors.phone && <p className="text-xs text-red-700 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-green-950 uppercase tracking-wider mb-1.5">
                    Email for Invoice <span className="text-red-700">*</span>
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. contact@yourfirm.com"
                    className={`w-full px-4 py-3 bg-cream-50 border ${
                      errors.email ? "border-red-600" : "border-green-900/10 focus:border-green-600"
                    } rounded-full text-xs sm:text-sm text-ink-900 focus:outline-none`}
                  />
                  {errors.email && <p className="text-xs text-red-700 mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-green-950 uppercase tracking-wider mb-1.5">
                  Pune Street / Building / Estate Address <span className="text-red-700">*</span>
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Apartment/Villa No., Floor, Landmark, Wing..."
                  className={`w-full px-4 py-3 bg-cream-50 border ${
                    errors.address ? "border-red-600" : "border-green-900/10 focus:border-green-600"
                  } rounded-2xl text-xs sm:text-sm text-ink-900 focus:outline-none`}
                />
                {errors.address && <p className="text-xs text-red-700 mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-green-950 uppercase tracking-wider mb-1.5">
                  Pune Pincode (411xxx or 412xxx) <span className="text-red-700">*</span>
                </label>
                <input
                  type="text"
                  value={punePincode}
                  onChange={(e) => setPunePincode(e.target.value)}
                  placeholder="e.g. 411033"
                  className={`w-full px-4 py-3 bg-cream-50 border ${
                    errors.pincode ? "border-red-600" : "border-green-900/10 focus:border-green-600"
                  } rounded-full text-xs sm:text-sm text-ink-900 focus:outline-none`}
                />
                {errors.pincode && <p className="text-xs text-red-700 mt-1">{errors.pincode}</p>}
              </div>

              {/* Payment Method Selection */}
              <div className="pt-4">
                <h3 className="text-base font-display font-bold text-green-950 mb-3">
                  2. Select Payment Mode
                </h3>

                <div className="space-y-3">
                  <label
                    onClick={() => setPaymentMethod("razorpay")}
                    className={`flex items-start gap-3 p-4 border rounded-2xl text-xs sm:text-sm cursor-pointer transition-all ${
                      paymentMethod === "razorpay"
                        ? "bg-green-100/90 border-green-600 text-green-950 font-bold"
                        : "bg-cream-50 border-green-900/10 text-ink-900"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === "razorpay"}
                      onChange={() => setPaymentMethod("razorpay")}
                      className="accent-green-950 mt-0.5"
                    />
                    <div>
                      <span className="font-bold block">Razorpay (Live UPI, Cards, Netbanking)</span>
                      <span className="text-xs text-ink-500 font-light">Instant digital payment confirmation with GST invoice generation.</span>
                    </div>
                  </label>

                  <label
                    onClick={() => setPaymentMethod("cod")}
                    className={`flex items-start gap-3 p-4 border rounded-2xl text-xs sm:text-sm cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "bg-green-100/90 border-green-600 text-green-950 font-bold"
                        : "bg-cream-50 border-green-900/10 text-ink-900"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="accent-green-950 mt-0.5"
                    />
                    <div>
                      <span className="font-bold block">Cash on Delivery (Pune Metropolitan Limits Only)</span>
                      <span className="text-xs text-ink-500 font-light">Pay our nursery logistics driver via cash or UPI upon unloading.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Review & Confirmation */}
            <div className="lg:col-span-5 bg-white border border-green-900/10 p-6 sm:p-8 rounded-3xl shadow-soft space-y-4">
              <h2 className="text-xl font-display font-bold text-green-950 border-b border-green-900/10 pb-3">
                Order Review ({items.length} items)
              </h2>

              <div className="divide-y divide-cream-200 text-xs sm:text-sm max-h-60 overflow-y-auto pr-1">
                {items.map((it, idx) => (
                  <div key={idx} className="py-2.5 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-green-950">{it.productName}</span>
                      <span className="text-ink-500 block text-xs">
                        Qty: {it.quantity} × ₹{it.unitPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <span className="font-display font-bold text-green-950">
                      ₹{(it.unitPrice * it.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-green-900/10 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-500 font-light">Subtotal:</span>
                  <span className="font-bold">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-500 font-light">GST (18%):</span>
                  <span className="font-bold">₹{gstAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-500 font-light">Delivery in Pune:</span>
                  <span className="font-bold">{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
                </div>
                <div className="pt-3 border-t border-green-900/10 flex justify-between font-display font-extrabold text-lg text-green-950">
                  <span>Grand Total:</span>
                  <span className="text-green-700">₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full min-h-[48px] px-6 py-3.5 bg-green-950 hover:bg-green-800 text-white font-bold text-sm rounded-full shadow transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>
                  {isProcessing
                    ? "Processing Order..."
                    : paymentMethod === "cod"
                    ? "Confirm Cash on Delivery Order"
                    : `Pay ₹${grandTotal.toLocaleString("en-IN")} via Razorpay`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-ink-500 text-center leading-relaxed font-light">
                By placing this order, you accept the Green Gallery Pune delivery guarantee and plant acclimation policies.
              </p>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
