import { NextRequest, NextResponse } from "next/server";
import { servicesRepo } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const services = servicesRepo.getAll();
    return NextResponse.json({ services });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.title || !body.category) {
      return NextResponse.json({ error: "Service title and category are required." }, { status: 400 });
    }

    const slug = (body.slug || body.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newService = servicesRepo.create({
      slug: body.slug || slug,
      title: body.title.trim(),
      category: body.category || "Commercial",
      shortDescription: body.shortDescription || "",
      fullDescription: body.fullDescription || body.shortDescription || "",
      features: Array.isArray(body.features) ? body.features : (body.features ? [body.features] : []),
      scope: Array.isArray(body.scope) ? body.scope : (body.scope ? [body.scope] : []),
      deliverables: Array.isArray(body.deliverables) ? body.deliverables : (body.deliverables ? [body.deliverables] : []),
      idealFor: body.idealFor || "Properties in Pune and PCMC",
      image: body.image || "/images/frames/ezgif-frame-001.jpg",
      faq: Array.isArray(body.faq) ? body.faq : [],
    });

    return NextResponse.json({ success: true, service: newService });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create service" }, { status: 500 });
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
      return NextResponse.json({ error: "Service ID or slug is required." }, { status: 400 });
    }

    const updated = servicesRepo.update(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Service not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, service: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update service" }, { status: 500 });
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
      return NextResponse.json({ error: "Service ID is required." }, { status: 400 });
    }

    const success = servicesRepo.delete(id);
    if (!success) {
      return NextResponse.json({ error: "Service not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Service deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete service" }, { status: 500 });
  }
}
