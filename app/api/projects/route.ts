import { NextRequest, NextResponse } from "next/server";
import { projectsRepo } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const projects = projectsRepo.getAll();
    return NextResponse.json({ projects });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.title || !body.category) {
      return NextResponse.json({ error: "Project title and category are required." }, { status: 400 });
    }

    const slug = (body.slug || body.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newProject = projectsRepo.create({
      slug,
      title: body.title.trim(),
      category: body.category,
      location: body.location || "Pune, Maharashtra",
      year: Number(body.year) || new Date().getFullYear(),
      areaSqFt: Number(body.areaSqFt) || 5000,
      clientName: body.clientName,
      clientLogo: body.clientLogo,
      coverImage: body.coverImage || "",
      images: Array.isArray(body.images) ? body.images : (body.coverImage ? [
        { url: body.coverImage, caption: body.title, alt: body.title }
      ] : []),
      brief: body.brief || "",
      plantsUsed: Array.isArray(body.plantsUsed) ? body.plantsUsed : [],
      servicesUsed: Array.isArray(body.servicesUsed) ? body.servicesUsed : ["Landscape Design and Installation"],
      isFeatured: Boolean(body.isFeatured),
      status: body.status || "COMPLETED",
    });

    return NextResponse.json({ success: true, project: newProject });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create project" }, { status: 500 });
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
      return NextResponse.json({ error: "Project ID or slug is required." }, { status: 400 });
    }

    const updated = projectsRepo.update(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, project: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update project" }, { status: 500 });
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
      return NextResponse.json({ error: "Project ID is required." }, { status: 400 });
    }

    const success = projectsRepo.delete(id);
    if (!success) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Project deleted." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete project" }, { status: 500 });
  }
}
