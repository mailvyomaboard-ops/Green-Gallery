import { NextRequest, NextResponse } from "next/server";
import { reviewsRepo } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";

/**
 * GET /api/reviews
 * Returns reviews based on authorization and author identity:
 * - Admin receives all reviews (approved + pending visitor submissions).
 * - Public visitors receive all approved reviews PLUS any pending review authored by them (matching authorToken).
 * Time Complexity: O(N log N) sorted by creation date.
 */
export async function GET(req: NextRequest) {
  try {
    const isAdmin = verifyAdminSession(req);
    const { searchParams } = new URL(req.url);
    const authorToken = searchParams.get("authorToken") || req.headers.get("x-author-token") || undefined;

    const reviews = reviewsRepo.getAll(authorToken, isAdmin);
    return NextResponse.json({ success: true, reviews, isAdmin });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch reviews" }, { status: 500 });
  }
}

/**
 * POST /api/reviews
 * Creates a new review.
 * - If Admin: created as approved and verified.
 * - If Public Visitor: created as approved=false (pending moderation) and bound to their authorToken.
 */
export async function POST(req: NextRequest) {
  try {
    const isAdmin = verifyAdminSession(req);
    const body = await req.json();

    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json({ error: "Your name is required." }, { status: 400 });
    }

    if (!body.comment || body.comment.trim().length === 0) {
      return NextResponse.json({ error: "Review feedback message is required." }, { status: 400 });
    }

    const rating = Math.max(1, Math.min(5, Math.round(Number(body.rating) || 5)));

    const newReview = reviewsRepo.create({
      name: body.name.trim(),
      role: body.role?.trim() || "Client",
      company: body.company?.trim() || "",
      rating,
      comment: body.comment.trim(),
      project: body.project?.trim() || "Landscape & Botanical Services",
      date: body.date?.trim() || undefined,
      verified: isAdmin ? (body.verified !== undefined ? Boolean(body.verified) : true) : false,
      approved: isAdmin ? (body.approved !== undefined ? Boolean(body.approved) : true) : false,
      authorToken: isAdmin ? undefined : (body.authorToken || `vt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`),
    });

    return NextResponse.json({ success: true, review: newReview, isVisitorPending: !isAdmin });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to submit review" }, { status: 500 });
  }
}

/**
 * PATCH /api/reviews
 * Admin authenticated endpoint to edit review fields, toggle approval, or toggle verified status.
 */
export async function PATCH(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { searchParams } = new URL(req.url);
    const id = body.id || searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Review ID is required." }, { status: 400 });
    }

    // Toggle actions
    if (body.action === "toggleApproved" || searchParams.get("action") === "toggleApproved") {
      const updated = reviewsRepo.toggleApproved(id);
      if (!updated) return NextResponse.json({ error: "Review not found." }, { status: 404 });
      return NextResponse.json({ success: true, review: updated });
    }

    if (body.action === "toggleVerified" || searchParams.get("action") === "toggleVerified") {
      const updated = reviewsRepo.toggleVerified(id);
      if (!updated) return NextResponse.json({ error: "Review not found." }, { status: 404 });
      return NextResponse.json({ success: true, review: updated });
    }

    // Full review field update
    const { id: _, ...updates } = body;
    const updated = reviewsRepo.update(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Review not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, review: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update review" }, { status: 500 });
  }
}

/**
 * DELETE /api/reviews
 * Admin authenticated endpoint to delete a review.
 */
export async function DELETE(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Review ID is required." }, { status: 400 });
    }

    const success = reviewsRepo.delete(id);
    if (!success) {
      return NextResponse.json({ error: "Review not found or could not be deleted." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Review deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete review" }, { status: 500 });
  }
}
