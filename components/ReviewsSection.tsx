"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  CheckCircle2,
  Plus,
  X,
  Send,
  Building2,
  Quote,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { Review } from "@/lib/types";
import { initialReviews } from "@/lib/data";

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Form state
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [project, setProject] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviews(data.reviews);
        }
      })
      .catch(() => {});
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      setSubmitError("Please provide your name and review comment.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          role: role.trim() || "Client",
          company: company.trim() || undefined,
          rating,
          comment: comment.trim(),
          project: project.trim() || "Landscape & Botanical Services",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit review.");
      }

      // Optimistically add new review to start of list
      setReviews((prev) => [data.review, ...prev]);
      setSubmitSuccess(true);
      setName("");
      setRole("");
      setCompany("");
      setRating(5);
      setProject("");
      setComment("");

      // Auto close after 2.5 seconds
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(false);
      }, 2500);
    } catch (err: any) {
      setSubmitError(err.message || "An error occurred while submitting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative w-full py-8 sm:py-12 border-t border-green-900/10 dark:border-white/10">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-green-700 dark:text-emerald-400 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Verified Client Experiences &amp; Endorsements</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-green-950 dark:text-white tracking-tight">
              What Our Clients Say
            </h2>
            <p className="text-sm text-ink-700 dark:text-white/70 mt-1 font-light max-w-xl">
              Authentic feedback from real estate developers, principal architects, villa sanctuary owners, and housing societies across Western Maharashtra.
            </p>
          </div>

          {/* Action Controls: Side-Scroll Arrows + Leave a Review Button */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {/* Scroll Navigation Arrows */}
            <div className="flex items-center gap-1.5 mr-1">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Scroll left"
                className="w-9 h-9 rounded-full bg-white dark:bg-[#121915] border border-green-900/15 dark:border-white/10 flex items-center justify-center text-green-950 dark:text-white hover:bg-cream-100 dark:hover:bg-white/10 shadow-xs transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Scroll right"
                className="w-9 h-9 rounded-full bg-white dark:bg-[#121915] border border-green-900/15 dark:border-white/10 flex items-center justify-center text-green-950 dark:text-white hover:bg-cream-100 dark:hover:bg-white/10 shadow-xs transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Leave a Review Trigger Button */}
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(true);
                setSubmitSuccess(false);
                setSubmitError("");
              }}
              className="px-4 py-2.5 rounded-full bg-green-950 hover:bg-green-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Leave a Review</span>
            </button>
          </div>
        </div>

        {/* Horizontal Side-Scroller Carousel */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-5 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="w-[300px] sm:w-[380px] shrink-0 snap-start bg-white dark:bg-[#07110B] rounded-3xl p-6 sm:p-7 border border-green-900/10 dark:border-white/10 shadow-soft hover:shadow-glow transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header: Stars + Verified Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= rev.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-gray-200 text-gray-200 dark:fill-gray-800 dark:text-gray-800"
                        }`}
                      />
                    ))}
                  </div>

                  {rev.verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Verified Client</span>
                    </span>
                  )}
                </div>

                {/* Project Tag if provided */}
                {rev.project && (
                  <div className="mb-3">
                    <span className="text-[10px] font-mono text-emerald-800 dark:text-emerald-300 font-semibold bg-cream-100 dark:bg-white/5 px-2.5 py-1 rounded-md border border-green-900/10 dark:border-white/10 block truncate">
                      {rev.project}
                    </span>
                  </div>
                )}

                {/* Review Quote Text */}
                <p className="text-xs sm:text-sm text-ink-800 dark:text-white/85 leading-relaxed font-light italic mb-5">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              {/* Reviewer Bio & Date */}
              <div className="pt-4 border-t border-cream-200 dark:border-white/10 flex items-center justify-between gap-3">
                <div className="truncate">
                  <div className="font-display font-bold text-sm text-green-950 dark:text-white truncate">
                    {rev.name}
                  </div>
                  <div className="text-[11px] text-ink-600 dark:text-white/60 truncate">
                    {rev.role}
                    {rev.company ? ` · ${rev.company}` : ""}
                  </div>
                </div>

                {rev.date && (
                  <span className="text-[10px] font-mono text-ink-400 dark:text-white/40 shrink-0">
                    {rev.date}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom helper prompt */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-ink-500 dark:text-white/50 px-1">
          <span>← Swipe or scroll horizontally to explore all client reviews →</span>
          <span>{reviews.length} total reviews verified</span>
        </div>
      </div>

      {/* =================================================================== */}
      {/* PUBLIC REVIEW SUBMISSION MODAL ("ANYONE CAN PLACE A REVIEW THERE")    */}
      {/* =================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#07130D] border border-green-900/15 dark:border-emerald-500/25 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-green-900/10 dark:border-white/10 mb-5">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold">
                  Client Feedback
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-green-950 dark:text-white">
                  Share Your Experience
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-cream-100 dark:bg-white/10 flex items-center justify-center text-ink-600 dark:text-white hover:bg-cream-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitSuccess && (
              <div className="mb-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 text-xs flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm">Thank You for Your Feedback!</div>
                  <p className="mt-0.5">
                    Your review has been published and added to our client showcase.
                  </p>
                </div>
              </div>
            )}

            {submitError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-500/30 text-red-900 dark:text-red-200 text-xs">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating Picker */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-green-950 dark:text-white mb-2">
                  Your Rating *
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 cursor-pointer focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= (hoverRating || rating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-gray-200 text-gray-300 dark:fill-gray-800 dark:text-gray-700"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 ml-2">
                    {rating} out of 5 Stars
                  </span>
                </div>
              </div>

              {/* Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-green-950 dark:text-white mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-green-900/15 dark:border-white/10 bg-cream-50/50 dark:bg-black/30 text-xs text-ink-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-green-950 dark:text-white mb-1">
                    Role / Capacity
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Villa Owner / Principal Architect"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-green-900/15 dark:border-white/10 bg-cream-50/50 dark:bg-black/30 text-xs text-ink-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Organization & Project Scope */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-green-950 dark:text-white mb-1">
                    Company / Society / Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Koregaon Park / Baner Society"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-green-900/15 dark:border-white/10 bg-cream-50/50 dark:bg-black/30 text-xs text-ink-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-green-950 dark:text-white mb-1">
                    Project / Service Availed
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Podium Landscape / Villa Garden"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-green-900/15 dark:border-white/10 bg-cream-50/50 dark:bg-black/30 text-xs text-ink-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-green-950 dark:text-white mb-1">
                  Your Review &amp; Feedback *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share your experience working with Green Gallery regarding design quality, plant health, timely execution, and ongoing care..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-green-900/15 dark:border-white/10 bg-cream-50/50 dark:bg-black/30 text-xs text-ink-900 dark:text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-ink-500 dark:text-white/60 hover:text-ink-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-full bg-green-950 hover:bg-green-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-glow transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "Submitting..." : "Publish Review"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
