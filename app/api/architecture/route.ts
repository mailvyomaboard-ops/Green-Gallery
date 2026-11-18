import { NextRequest, NextResponse } from "next/server";
import { architectureRepo } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";

/**
 * GET /api/architecture
 * Public endpoint to fetch all architecture & design showcase cards.
 * Time Complexity: O(N log N) sorted by order.
 */
export async function GET() {
  try {
    const cards = architectureRepo.list();
    return NextResponse.json({ success: true, cards });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch architecture cards" }, { status: 500 });
  }
}

/**
 * POST /api/architecture
 * Admin authenticated endpoint to create a new architecture & design showcase card.
 * Sanitizes input and validates required fields.
 */
export async function POST(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.title || body.title.trim().length === 0) {
      return NextResponse.json({ error: "Card title is required." }, { status: 400 });
    }

    const newCard = architectureRepo.create({
      title: body.title.trim(),
      subtitle: body.subtitle?.trim() || "",
      category: body.category || "Master Landscape Planning",
      image: body.image?.trim() || "",
      video: body.video?.trim() || "",
      description: body.description?.trim() || "",
      details: Array.isArray(body.details) ? body.details : body.details ? [body.details] : [],
      tags: Array.isArray(body.tags)
        ? body.tags
        : typeof body.tags === "string"
        ? body.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [],
      scaleArea: body.scaleArea?.trim() || "",
      featured: Boolean(body.featured),
      order: typeof body.order === "number" ? body.order : 0,
    });

    return NextResponse.json({ success: true, card: newCard });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create card" }, { status: 500 });
  }
}

/**
 * PUT /api/architecture
 * Admin authenticated endpoint to update an existing architecture & design showcase card.
 */
export async function PUT(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: "Card ID is required for update." }, { status: 400 });
    }

    const updates: any = {};
    if (body.title !== undefined) updates.title = body.title.trim();
    if (body.subtitle !== undefined) updates.subtitle = body.subtitle.trim();
    if (body.category !== undefined) updates.category = body.category;
    if (body.image !== undefined) updates.image = body.image.trim();
    if (body.video !== undefined) updates.video = body.video.trim();
    if (body.description !== undefined) updates.description = body.description.trim();
    if (body.scaleArea !== undefined) updates.scaleArea = body.scaleArea.trim();
    if (body.featured !== undefined) updates.featured = Boolean(body.featured);
    if (body.order !== undefined) updates.order = Number(body.order);
    if (body.details !== undefined) {
      updates.details = Array.isArray(body.details)
        ? body.details
        : typeof body.details === "string"
        ? body.details.split("\n").map((d: string) => d.trim()).filter(Boolean)
        : [];
    }
    if (body.tags !== undefined) {
      updates.tags = Array.isArray(body.tags)
        ? body.tags
        : typeof body.tags === "string"
        ? body.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [];
    }

    const updated = architectureRepo.update(body.id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Card not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, card: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update card" }, { status: 500 });
  }
}

/**
 * DELETE /api/architecture
 * Admin authenticated endpoint to remove an architecture card.
 */
export async function DELETE(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Card ID is required." }, { status: 400 });
    }

    const success = architectureRepo.delete(id);
    if (!success) {
      return NextResponse.json({ error: "Card not found or could not be deleted." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Card deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete card" }, { status: 500 });
  }
}
