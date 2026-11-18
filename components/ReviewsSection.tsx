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
  Sparkles,
  UserCheck
} from "lucide-react";
import { Review } from "@/lib/types";
import { initialReviews } from "@/lib/data";

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [visitorToken, setVisitorToken] = useState<string>("");
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
    // 1. Initialize or load unique visitor token from localStorage
    let token = "";
    try {
      token = localStorage.getItem("gg_visitor_token") || "";
      if (!token) {
        token = `vt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem("gg_visitor_token", token);
      }
      setVisitorToken(token);
    } catch {}

    // 2. Fetch reviews from API passing the visitor's authorToken
    const url = token ? `/api/reviews?authorToken=${encodeURIComponent(token)}` : "/api/reviews";
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.reviews) && data.reviews.length > 0) {
          // Merge with any locally saved pending reviews as offline fallback
          try {
            const localSaved: Review[] = JSON.parse(localStorage.getItem("gg_my_reviews") || "[]");
            const combined = [...data.reviews];
            localSaved.forEach((localRev) => {
              if (!combined.some((r) => r.id === localRev.id)) {
                combined.unshift(localRev);
              }
            });
            setReviews(combined);
          } catch {
            setReviews(data.reviews);
          }
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
      setSubmitError("Please provide your name and review message.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const currentToken = visitorToken || `vt_${Date.now()}`;
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          role: role.trim() || "Visitor",
          company: company.trim() || undefined,
          rating,
          comment: comment.trim(),
          project: project.trim() || "Landscape & Botanical Services",
          authorToken: currentToken,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit review.");
      }

      // Prepend the new review into reviews state for this visitor
      setReviews((prev) => [data.review, ...prev.filter((r) => r.id !== data.review.id)]);

      // Save to visitor's localStorage
      try {
        const existing = JSON.parse(localStorage.getItem("gg_my_reviews") || "[]");
        localStorage.setItem("gg_my_reviews", JSON.stringify([data.review, ...existing]));
      } catch {}

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

  // Duplicate items for continuous seamless loop
  const marqueeItems = [...reviews, ...reviews];

  return (
    <section className="relative w-full py-10 sm:py-16 border-t border-green-900/10 dark:border-white/10 overflow-hidden">
      {/* Dynamic Keyframes for 120fps GPU infinite marquee */}
      <style jsx global>{`
        @keyframes infiniteReviewsScroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .reviews-marquee-track {
          display: flex;
          width: max-content;
          animation: infiniteReviewsScroll 48s linear infinite;
          will-change: transform;
        }
        .reviews-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
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
              className="px-4 py-2.5 rounded-full bg-green-950 hover:bg-green-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow-glow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Leave a Review</span>
            </button>
          </div>
        </div>
      </div>

      {/* INFINITE SIDE-SCROLLING MARQUEE CONTAINER */}
      <div
        ref={scrollRef}
        className="w-full overflow-x-auto py-2 no-scrollbar cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="reviews-marquee-track gap-6 px-4">
          {marqueeItems.map((rev, idx) => {
            const isMyReview = Boolean(
              rev.authorToken && visitorToken && rev.authorToken === visitorToken
            );

            return (
              <div
                key={`${rev.id}-${idx}`}
                className={`w-[320px] sm:w-[390px] shrink-0 bg-white/90 dark:bg-[#07130D] rounded-3xl p-6 sm:p-7 border ${
                  isMyReview
                    ? "border-amber-500/60 shadow-amber-500/10 shadow-lg ring-1 ring-amber-400/40"
                    : "border-green-900/10 dark:border-white/10 shadow-soft hover:shadow-glow"
                } transition-all duration-300 flex flex-col justify-between group select-none`}
              >
                <div>
                  {/* Header: Stars + Verified / Author Badge */}
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

                    {isMyReview ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-400/40 font-bold">
                        <UserCheck className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        <span>Your Review</span>
                      </span>
                    ) : rev.verified ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-medium">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Verified Client</span>
                      </span>
                    ) : null}
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
            );
          })}
        </div>
      </div>

      {/* Helper Bar */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 mt-3 flex items-center justify-between text-[11px] text-ink-500 dark:text-white/50">
        <span>Hover over any review card to pause infinite scroll</span>
        <span>{reviews.length} total client reviews</span>
      </div>

      {/* =================================================================== */}
      {/* PUBLIC REVIEW SUBMISSION MODAL                                      */}
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
                    Your review has been received and added immediately to your personal rotation on this device!
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
                        className={`w-7 h-7 ${
                          star <= (hoverRating || rating)
                            ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                            : "fill-gray-200 text-gray-200 dark:fill-gray-800 dark:text-gray-800"
                        } transition-colors`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                    {hoverRating || rating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-green-950 dark:text-white mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kulkarni"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-green-900/20 dark:border-white/10 bg-cream-50/50 dark:bg-black/30 text-xs text-ink-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-green-950 dark:text-white mb-1.5">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Villa Owner / Project Lead"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-green-900/20 dark:border-white/10 bg-cream-50/50 dark:bg-black/30 text-xs text-ink-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Company / Society & Project */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-green-950 dark:text-white mb-1.5">
                    Company / Society / Estate
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Baner Hills Estate"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-green-900/20 dark:border-white/10 bg-cream-50/50 dark:bg-black/30 text-xs text-ink-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-green-950 dark:text-white mb-1.5">
                    Project Scope Handled
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Terrace Garden Execution"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-green-900/20 dark:border-white/10 bg-cream-50/50 dark:bg-black/30 text-xs text-ink-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-green-950 dark:text-white mb-1.5">
                  Your Review &amp; Feedback *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share details of your experience with GreenGallery's team, plant quality, scheduling, or landscape execution..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-green-900/20 dark:border-white/10 bg-cream-50/50 dark:bg-black/30 text-xs text-ink-900 dark:text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              <div className="p-3 rounded-xl bg-cream-100/60 dark:bg-white/5 border border-green-900/10 dark:border-white/10 text-[11px] text-ink-600 dark:text-white/60">
                Notice: Your review will be immediately visible to you in the side-scroller on this device, and sent to GreenGallery operations for editorial verification.
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs text-ink-600 dark:text-white/70 hover:bg-cream-100 dark:hover:bg-white/10 font-medium transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-full bg-green-950 hover:bg-green-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "Submitting..." : "Submit Review"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
