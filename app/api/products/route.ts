import { NextRequest, NextResponse } from "next/server";
import { productsRepo } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const products = productsRepo.getAll();
    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.name || !body.category) {
      return NextResponse.json({ error: "Product name and category are required." }, { status: 400 });
    }

    const slug = (body.slug || body.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newProd = productsRepo.create({
      slug,
      name: body.name.trim(),
      botanicalName: body.botanicalName || "",
      category: body.category,
      lightRequirement: body.lightRequirement || "Bright Indirect / Shade",
      sizeCategory: body.sizeCategory || "Medium (1 - 3 ft)",
      price: Number(body.price) || 0,
      stockLabel: body.stockLabel || "In Stock",
      inStock: body.inStock !== undefined ? Boolean(body.inStock) : true,
      stockQuantity: Number(body.stockQuantity) || 10,
      bulkThreshold: Number(body.bulkThreshold) || 20,
      mainImage: body.mainImage || "",
      images: Array.isArray(body.images) ? body.images : (body.mainImage ? [body.mainImage] : []),
      description: body.description || "",
      careGuide: body.careGuide || { light: "Indirect Sun", water: "Moderate", height: "3 ft" },
      variants: Array.isArray(body.variants) ? body.variants : [],
      deliveryNote: body.deliveryNote || "Dispatched from Alandi logistics depot across Pune & PCMC.",
      isFeatured: Boolean(body.isFeatured),
    });

    return NextResponse.json({ success: true, product: newProd });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
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
      return NextResponse.json({ error: "Product ID or slug is required." }, { status: 400 });
    }

    const updated = productsRepo.update(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update product" }, { status: 500 });
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
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    const success = productsRepo.delete(id);
    if (!success) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product deleted." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete product" }, { status: 500 });
  }
}
