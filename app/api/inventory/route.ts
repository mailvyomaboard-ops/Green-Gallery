import { NextRequest, NextResponse } from "next/server";
import { inventoryRepo } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";

export async function GET() {
  const items = inventoryRepo.getAll();
  return NextResponse.json({ items });
}

export async function PATCH(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, name, botanicalName, category, sizeOrHeight, potSize, quantityInStock, status, priceBand, price, image, description } = body;

    if (!id) {
      return NextResponse.json({ error: "Item ID is required." }, { status: 400 });
    }

    const updated = inventoryRepo.update(id, {
      ...(name && { name }),
      ...(botanicalName && { botanicalName }),
      ...(category && { category }),
      ...(sizeOrHeight && { sizeOrHeight }),
      ...(potSize && { potSize }),
      ...(quantityInStock !== undefined && { quantityInStock: Number(quantityInStock) }),
      ...(status && { status }),
      ...(priceBand && { priceBand }),
      ...(price !== undefined && { price: Number(price) }),
      ...(image !== undefined && { image }),
      ...(description !== undefined && { description }),
    });

    if (!updated) {
      return NextResponse.json({ error: "Inventory item not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update inventory" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (body.action === "bulk_csv" && Array.isArray(body.rows)) {
      const count = inventoryRepo.bulkUpdateFromCSV(body.rows);
      return NextResponse.json({ success: true, count });
    }

    if (!body.name || !body.botanicalName) {
      return NextResponse.json({ error: "Name and botanical name are required." }, { status: 400 });
    }

    const item = inventoryRepo.create({
      name: body.name,
      botanicalName: body.botanicalName,
      category: body.category || "Outdoor Plants",
      sizeOrHeight: body.sizeOrHeight || "Standard",
      potSize: body.potSize || "12-inch Pot",
      quantityInStock: Number(body.quantityInStock) || 0,
      status: body.quantityInStock > 0 ? "In Stock" : "Out of Stock",
      priceBand: body.priceBand || "Price on Request",
      price: body.price ? Number(body.price) : undefined,
      image: body.image || "",
      description: body.description || "",
      linkedProductId: body.linkedProductId,
    });

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create inventory item" }, { status: 500 });
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
      return NextResponse.json({ error: "Item ID is required." }, { status: 400 });
    }
    const success = inventoryRepo.delete(id);
    if (!success) {
      return NextResponse.json({ error: "Inventory item not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Inventory item deleted." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete item" }, { status: 500 });
  }
}
