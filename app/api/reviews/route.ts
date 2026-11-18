import { NextRequest, NextResponse } from "next/server";
import { reviewsRepo } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";

/**
 * GET /api/reviews
 * Returns all client reviews.
 * Time Complexity: O(N log N) sorted by date.
 */
export async function GET() {
  try {
    const reviews = reviewsRepo.getAll();
    return NextResponse.json({ success: true, reviews });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch reviews" }, { status: 500 });
  }
}

/**
 * POST /api/reviews
 * Public endpoint allowing anyone to submit feedback / review.
 * Enforces sanitization and validation on incoming fields.
 */
export async function POST(req: NextRequest) {
  try {
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
      project: body.project?.trim() || "",
    });

    return NextResponse.json({ success: true, review: newReview });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to submit review" }, { status: 500 });
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

/**
 * PATCH /api/reviews
 * Admin authenticated endpoint to toggle verified status.
 */
export async function PATCH(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Review ID is required." }, { status: 400 });
    }

    const updated = reviewsRepo.toggleVerified(id);
    if (!updated) {
      return NextResponse.json({ error: "Review not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, review: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update review" }, { status: 500 });
  }
}
