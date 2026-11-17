import { NextRequest, NextResponse } from "next/server";
import { siteContentRepo } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const content = siteContentRepo.get();
    return NextResponse.json({ content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch site content" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = siteContentRepo.update(body);
    return NextResponse.json({ success: true, content: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update site content" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  return POST(req);
}
