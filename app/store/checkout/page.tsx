"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { siteConfig } from "@/config/site";
import { Check, ArrowRight, ArrowUpRight, MapPin, Send } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [address, setAddress] = useState("");
  const [punePincode, setPunePincode] = useState("411033");
  const [notes, setNotes] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [quotationSubmitted, setQuotationSubmitted] = useState<any | null>(null);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) errs.name = "Full name is required.";
    if (!customerPhone.trim() || !/^[0-9+() -]{8,15}$/.test(customerPhone.trim())) {
      errs.phone = "Valid contact phone number is required.";
    }
    if (!customerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
      errs.email = "Valid email address is required for sending the quotation.";
    }
    if (!address.trim()) errs.address = "Site or delivery address is required.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;
    if (items.length === 0) {
      setServerError("Your quotation basket is empty.");
      return;
    }

    setIsProcessing(true);

    try {
      const itemsBreakdown = items
        .map((i) => `${i.productName} (${i.variantLabel || "Standard"}) x ${i.quantity} @ ₹${i.unitPrice}`)
        .join("\n");

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "quote",
          name: customerName,
          phone: customerPhone,
          email: customerEmail,
          siteLocation: `${address}, Pune - ${punePincode}`,
          clientType: "Plant Supply & Procurement",
          projectType: "Specimen Plant Supply",
          notes: `Requested Items:\n${itemsBreakdown}\n\nClient Notes:\n${notes}\n\nEstimated Item Subtotal: ₹${subtotal}`,
          sourcePage: "/store/checkout",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit quotation enquiry.");
      }

      setQuotationSubmitted({
        leadId: data.leadId,
        name: customerName,
        phone: customerPhone,
        itemsCount: items.length,
      });
      clearCart();
    } catch (err: any) {
      setServerError(err.message || "An unexpected error occurred while submitting your enquiry.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (quotationSubmitted) {
    const whatsappMsg = `Hello GreenGallery, I submitted a plant quotation request (Enquiry Ref: ${quotationSubmitted.leadId}) for ${quotationSubmitted.itemsCount} specimen batches. Please provide availability and commercial terms.`;

    return (
      <div className="py-20 px-4 sm:px-6 max-w-2xl mx-auto">
        <div className="bg-white dark:bg-[#080A09] border border-green-900/10 dark:border-white/10 p-8 sm:p-12 rounded-3xl shadow-soft text-center space-y-4">
          <div className="w-16 h-16 bg-green-950 dark:bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 shadow">
            <Check className="w-8 h-8 text-green-400 dark:text-white" />
          </div>
          <span className="text-xs uppercase tracking-wider text-green-700 dark:text-green-400 font-bold block">
            Quotation Request Received
          </span>
          <h1 className="text-3xl font-display font-extrabold text-green-950 dark:text-white">
            Thank you, {quotationSubmitted.name}
          </h1>
          <p className="text-xs text-ink-500 dark:text-white/60">
            Enquiry Reference: <strong className="text-green-950 dark:text-white">{quotationSubmitted.leadId}</strong>
          </p>
          <p className="text-xs sm:text-sm text-ink-700 dark:text-white/80 font-light leading-relaxed max-w-md mx-auto">
            Our nursery logistics desk in Pune is checking current rootstock availability at our Alandi facility. We will transmit an itemized quotation with freight details to your phone and email.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <a
              href={`https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-green-700 hover:bg-green-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow"
            >
              <span>Follow Up via WhatsApp</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <Link
              href="/plants"
              className="px-6 py-3 rounded-full bg-cream-100 dark:bg-white/10 text-green-950 dark:text-white hover:bg-cream-200 text-xs font-semibold uppercase tracking-wider"
            >
              Return to Catalogue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-20 px-3 sm:px-6 max-w-[1000px] mx-auto space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-green-700 dark:text-green-400">
          Formal Project Quotation
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-green-950 dark:text-white tracking-tight">
          Request Plant Quotation &amp; Availability
        </h1>
        <p className="text-xs sm:text-sm text-ink-700 dark:text-white/70 font-light leading-relaxed">
          Provide your delivery location and contact details. Our team will verify root health, batch quantities, and transit arrangements before issuing an itemized quotation.
        </p>
      </div>

      <div className="bg-white dark:bg-[#080A09] rounded-3xl p-6 sm:p-10 border border-green-900/10 dark:border-white/10 shadow-soft">
        <form onSubmit={handleSubmitQuotation} className="space-y-6">
          {serverError && (
            <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
              {serverError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-green-950 dark:text-white block mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className={`w-full px-4 py-3 rounded-2xl bg-cream-50 dark:bg-white/5 border ${
                  errors.name ? "border-red-500" : "border-green-900/10 dark:border-white/10"
                } text-xs text-green-950 dark:text-white focus:outline-none`}
              />
              {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-green-950 dark:text-white block mb-1.5">
                Contact Phone / WhatsApp *
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className={`w-full px-4 py-3 rounded-2xl bg-cream-50 dark:bg-white/5 border ${
                  errors.phone ? "border-red-500" : "border-green-900/10 dark:border-white/10"
                } text-xs text-green-950 dark:text-white focus:outline-none`}
              />
              {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-green-950 dark:text-white block mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="name@domain.com"
                className={`w-full px-4 py-3 rounded-2xl bg-cream-50 dark:bg-white/5 border ${
                  errors.email ? "border-red-500" : "border-green-900/10 dark:border-white/10"
                } text-xs text-green-950 dark:text-white focus:outline-none`}
              />
              {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-green-950 dark:text-white block mb-1.5">
                Pune Area / Pincode
              </label>
              <input
                type="text"
                value={punePincode}
                onChange={(e) => setPunePincode(e.target.value)}
                placeholder="e.g. 411045 (Baner)"
                className="w-full px-4 py-3 rounded-2xl bg-cream-50 dark:bg-white/5 border border-green-900/10 dark:border-white/10 text-xs text-green-950 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-green-950 dark:text-white block mb-1.5">
              Site Delivery Address *
            </label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Building name, landmark, road name..."
              className={`w-full px-4 py-3 rounded-2xl bg-cream-50 dark:bg-white/5 border ${
                errors.address ? "border-red-500" : "border-green-900/10 dark:border-white/10"
              } text-xs text-green-950 dark:text-white focus:outline-none`}
            />
            {errors.address && <p className="text-[11px] text-red-500 mt-1">{errors.address}</p>}
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-green-950 dark:text-white block mb-1.5">
              Special Handling, Crane Unloading or Staging Instructions (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Needs elevator access delivery, or staged delivery across two civil handover phases..."
              className="w-full px-4 py-3 rounded-2xl bg-cream-50 dark:bg-white/5 border border-green-900/10 dark:border-white/10 text-xs text-green-950 dark:text-white focus:outline-none"
            />
          </div>

          {/* Items Summary Strip */}
          <div className="p-4 rounded-2xl bg-cream-50 dark:bg-white/5 border border-green-900/10 dark:border-white/10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-green-950 dark:text-white block">
              Enquiry Items Summary ({items.length} items)
            </span>
            <ul className="text-xs text-ink-700 dark:text-white/70 space-y-1">
              {items.map((item, i) => (
                <li key={i} className="flex justify-between">
                  <span>{item.productName} ({item.variantLabel || "Standard"}) x {item.quantity}</span>
                  <span className="font-semibold text-green-950 dark:text-white">Ref: ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 px-8 rounded-full bg-green-950 dark:bg-green-600 hover:bg-green-800 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isProcessing ? "Submitting Request..." : "Submit Quotation Request"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
