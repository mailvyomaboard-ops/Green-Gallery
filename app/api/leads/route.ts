import { NextRequest, NextResponse } from "next/server";
import { leadsRepo } from "@/lib/db";
import { siteConfig } from "@/config/site";
import { verifyAdminSession } from "@/lib/auth";

// Simple in-memory rate-limiter for public lead submissions (O(1) Map lookup)
const ipRateMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 6; // Max 6 submissions per IP per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipRateMap.get(ip);
  if (!entry) {
    ipRateMap.set(ip, { count: 1, lastReset: now });
    return false;
  }
  if (now - entry.lastReset > RATE_LIMIT_WINDOW_MS) {
    ipRateMap.set(ip, { count: 1, lastReset: now });
    return false;
  }
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  entry.count += 1;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown-ip";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many submission attempts. Please try again after a few minutes." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 1. Anti-spam honeypot check
    if (body.website_hp || body.honeypot) {
      console.warn("Spam honeypot caught:", body);
      return NextResponse.json({ success: true, message: "Enquiry received." });
    }

    // 2. Strict Input Validation & Length Limits
    const name = String(body.name || "").trim().substring(0, 100);
    const phone = String(body.phone || "").trim().substring(0, 30);
    const email = String(body.email || "").trim().toLowerCase().substring(0, 100);

    if (!name || !phone || !email) {
      return NextResponse.json(
        { error: "Name, phone number, and email address are required fields." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // 3. Save to database
    const lead = leadsRepo.create({
      type: body.type || "consultation",
      name,
      phone,
      email,
      clientType: body.clientType,
      projectType: body.projectType ? String(body.projectType).substring(0, 100) : undefined,
      siteLocation: body.siteLocation ? String(body.siteLocation).substring(0, 150) : undefined,
      approxArea: body.approxArea ? String(body.approxArea).substring(0, 50) : undefined,
      preferredDate: body.preferredDate ? String(body.preferredDate).substring(0, 50) : undefined,
      preferredTimeSlot: body.preferredTimeSlot,
      notes: body.notes ? String(body.notes).substring(0, 1000) : undefined,
      company: body.company ? String(body.company).substring(0, 100) : undefined,
      projectName: body.projectName ? String(body.projectName).substring(0, 100) : undefined,
      city: body.city ? String(body.city).substring(0, 50) : undefined,
      projectStage: body.projectStage,
      scope: Array.isArray(body.scope) ? body.scope.map((s: any) => String(s).substring(0, 100)) : undefined,
      budgetRange: body.budgetRange ? String(body.budgetRange).substring(0, 50) : undefined,
      timeline: body.timeline ? String(body.timeline).substring(0, 50) : undefined,
      drawingFileName: body.drawingFileName ? String(body.drawingFileName).substring(0, 200) : undefined,
      message: body.message ? String(body.message).substring(0, 2000) : undefined,
      sourcePage: body.sourcePage ? String(body.sourcePage).substring(0, 100) : "/contact",
    });

    console.log(`[GreenGallery Lead] New ${lead.type} from ${lead.name} (${lead.phone}). Queued for review.`);

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: "Your enquiry has been received. Our horticultural team in Pune will connect with you shortly.",
    });
  } catch (error: any) {
    console.error("Failed to process lead:", error);
    return NextResponse.json(
      { error: "Server error processing enquiry. Please contact GreenGallery directly via WhatsApp (+91 78230 80251)." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const leads = leadsRepo.getAll();
  return NextResponse.json({ leads });
}

export async function PATCH(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status, note, followUpDate } = body;
    if (!id || !status) {
      return NextResponse.json({ error: "Lead ID and status required" }, { status: 400 });
    }
    const updated = leadsRepo.updateStatus(id, status, note, followUpDate);
    if (!updated) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, lead: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update lead" }, { status: 500 });
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
