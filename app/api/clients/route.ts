import { NextRequest, NextResponse } from "next/server";
import { clientsRepo } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const clients = clientsRepo.getAll();
    return NextResponse.json({ clients });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch clients" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.name || !body.city) {
      return NextResponse.json({ error: "Client name and city are required." }, { status: 400 });
    }

    const slug = (body.name || "client")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newClient = clientsRepo.create({
      slug: body.slug || slug,
      name: body.name.trim(),
      tagline: body.tagline || "Real Estate & Infrastructure Partner",
      logo: body.logo || "/images/clients/silver-group.jpg",
      city: body.city.trim(),
      location: body.location || body.city.trim(),
      totalAreaHandled: body.totalAreaHandled || "25,000+ sq. ft.",
      projectCount: Number(body.projectCount) || 1,
      highlightProjects: Array.isArray(body.highlightProjects) ? body.highlightProjects : [body.highlightProjects || "Flagship Development"],
      scope: Array.isArray(body.scope) ? body.scope : ["Landscape Design and Installation"],
      description: body.description || "Trusted real estate development partner in Pune.",
      featuredProjectSlug: body.featuredProjectSlug,
      whatWeDid: Array.isArray(body.whatWeDid)
        ? body.whatWeDid
        : (typeof body.whatWeDid === "string" ? body.whatWeDid.split("\n").map((s: string) => s.trim()).filter(Boolean) : []),
      videoUrl: body.videoUrl || "",
      galleryImages: Array.isArray(body.galleryImages) ? body.galleryImages : [],
    });

    return NextResponse.json({ success: true, client: newClient });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create client" }, { status: 500 });
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
      return NextResponse.json({ error: "Client ID or slug is required." }, { status: 400 });
    }

    const updated = clientsRepo.update(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Client not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, client: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update client" }, { status: 500 });
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
      return NextResponse.json({ error: "Client ID is required." }, { status: 400 });
    }

    const success = clientsRepo.delete(id);
    if (!success) {
      return NextResponse.json({ error: "Client not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Client partner removed." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete client" }, { status: 500 });
  }
}
