import { NextRequest, NextResponse } from "next/server";
import { inventoryRepo } from "@/lib/db";

export async function GET() {
  const items = inventoryRepo.getAll();
  return NextResponse.json({ items });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, quantityInStock, status, priceBand } = body;

    if (!id) {
      return NextResponse.json({ error: "Item ID is required." }, { status: 400 });
    }

    const updated = inventoryRepo.update(id, {
      ...(quantityInStock !== undefined && { quantityInStock: Number(quantityInStock) }),
      ...(status && { status }),
      ...(priceBand && { priceBand }),
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
      linkedProductId: body.linkedProductId,
    });

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create inventory item" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
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
