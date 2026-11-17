import { NextRequest, NextResponse } from "next/server";
import { maintenanceRepo } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const packages = maintenanceRepo.getAll();
    return NextResponse.json({ packages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch maintenance packages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.name || !body.type) {
      return NextResponse.json({ error: "Package name and type are required." }, { status: 400 });
    }

    const newPkg = maintenanceRepo.create({
      name: body.name.trim(),
      target: body.target || "Properties in Pune",
      frequency: body.frequency || "Scheduled Visits",
      highlights: Array.isArray(body.highlights) ? body.highlights : (body.highlights ? [body.highlights] : []),
      ctaText: body.ctaText || "Enquire Now",
      type: body.type || "Residential",
      image: body.image || "/images/hero-clean.webp",
      priceNote: body.priceNote || "Custom proposal on request",
    });

    return NextResponse.json({ success: true, package: newPkg });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create maintenance package" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ error: "Package ID is required." }, { status: 400 });
    }

    const updated = maintenanceRepo.update(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Maintenance package not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, package: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update package" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Package ID is required." }, { status: 400 });
    }

    const success = maintenanceRepo.delete(id);
    if (!success) {
      return NextResponse.json({ error: "Maintenance package not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Maintenance package deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete package" }, { status: 500 });
  }
}
