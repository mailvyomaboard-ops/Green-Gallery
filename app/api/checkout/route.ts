import { NextRequest, NextResponse } from "next/server";
import { ordersRepo } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      address,
      punePincode,
      items,
      paymentMethod,
    } = body;

    // 1. Validation
    if (!customerName || !customerPhone || !customerEmail || !address || !punePincode) {
      return NextResponse.json(
        { error: "Customer name, phone, email, address, and pincode are required." },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    // 2. Validate Pune pincode (Pune pincodes start with 411 or 412)
    const isPunePincode = /^41[12][0-9]{3}$/.test(punePincode.trim());
    if (!isPunePincode) {
      return NextResponse.json(
        {
          error:
            "Online nursery checkout is currently restricted to Pune metropolitan addresses (Pincodes starting with 411xxx or 412xxx). For out-of-station or bulk deliveries, please submit a Project Quote.",
        },
        { status: 400 }
      );
    }

    // 3. Compute totals
    const subtotal = items.reduce(
      (sum: number, it: any) => sum + Number(it.unitPrice) * Number(it.quantity),
      0
    );
    const gstAmount = Math.round(subtotal * 0.18);
    const deliveryFee = subtotal >= 5000 ? 0 : 350;
    const total = subtotal + gstAmount + deliveryFee;

    // 4. Create Order
    const order = ordersRepo.create({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      address: address.trim(),
      punePincode: punePincode.trim(),
      items,
      subtotal,
      gstAmount,
      deliveryFee,
      total,
      paymentMethod: paymentMethod === "cod" ? "cod" : "razorpay",
      paymentStatus: paymentMethod === "cod" ? "Pending COD Verification" : "Paid",
      razorpayPaymentId:
        paymentMethod === "razorpay" ? `pay_test_${Date.now()}` : undefined,
    });

    console.log(`[Green Gallery Order] Created order ${order.orderNumber} for ₹${order.total}`);

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: error.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
