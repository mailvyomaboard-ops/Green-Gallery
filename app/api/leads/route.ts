import { NextRequest, NextResponse } from "next/server";
import { leadsRepo } from "@/lib/db";
import { siteConfig } from "@/config/site";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Anti-spam honeypot check
    if (body.website_hp || body.honeypot) {
      console.warn("Spam honeypot caught:", body);
      return NextResponse.json({ success: true, message: "Request received" });
    }

    // 2. Validation
    if (!body.name || !body.phone || !body.email) {
      return NextResponse.json(
        { error: "Name, phone, and email are required fields." },
        { status: 400 }
      );
    }

    // 3. Save to database
    const lead = leadsRepo.create({
      type: body.type || "consultation",
      name: body.name.trim(),
      phone: body.phone.trim(),
      email: body.email.trim(),
      clientType: body.clientType,
      projectType: body.projectType,
      siteLocation: body.siteLocation,
      approxArea: body.approxArea,
      preferredDate: body.preferredDate,
      preferredTimeSlot: body.preferredTimeSlot,
      notes: body.notes,
      company: body.company,
      projectName: body.projectName,
      city: body.city,
      projectStage: body.projectStage,
      scope: body.scope,
      budgetRange: body.budgetRange,
      timeline: body.timeline,
      drawingFileName: body.drawingFileName,
      message: body.message,
      sourcePage: body.sourcePage || "/unknown",
    });

    // 4. Log confirmation (In production, dispatches via Resend/SMTP to siteConfig.contact.salesEmail)
    console.log(`[Green Gallery Lead] New ${lead.type} from ${lead.name} (${lead.phone}). Notification queued for ${siteConfig.contact.salesEmail}`);

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: "Lead recorded and queued for senior horticultural review.",
    });
  } catch (error: any) {
    console.error("Failed to process lead:", error);
    return NextResponse.json(
      { error: "Server error processing lead. Please reach Shubham Batule directly via WhatsApp (+91 78230 80251)." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const leads = leadsRepo.getAll();
  return NextResponse.json({ leads });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ error: "Lead ID and status required" }, { status: 400 });
    }
    const updated = leadsRepo.updateStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, lead: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update lead" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Lead ID required" }, { status: 400 });
    }
    const success = leadsRepo.delete(id);
    if (!success) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Lead deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete lead" }, { status: 500 });
  }
}
