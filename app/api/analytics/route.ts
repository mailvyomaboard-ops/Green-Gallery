import { NextRequest, NextResponse } from "next/server";
import { analyticsRepo } from "@/lib/db";

export async function GET() {
  try {
    const summary = analyticsRepo.getSummary();
    const recent = analyticsRepo.getRecentEvents(30);
    return NextResponse.json({ summary, recent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch analytics" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { path = "/", referrer = "", deviceType = "desktop", sessionId = "" } = body;

    const event = analyticsRepo.log({
      path,
      referrer,
      deviceType: deviceType === "mobile" || deviceType === "tablet" ? deviceType : "desktop",
      sessionId: sessionId || `anon-${Date.now()}`,
    });

    return NextResponse.json({ success: true, eventId: event.id });
  } catch (error: any) {
    // Non-blocking telemetry
    return NextResponse.json({ error: "Telemetry failed" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    analyticsRepo.clear();
    return NextResponse.json({ success: true, message: "Telemetry logs cleared" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to clear analytics" }, { status: 500 });
  }
}
