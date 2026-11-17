import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { adminSettingsRepo } from "@/lib/db";

/**
 * GET /api/admin/settings
 * Retrieves sanitized administrative settings (sensitive credentials stripped).
 * Big-O: O(1)
 */
export async function GET(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const settings = adminSettingsRepo.getSanitized();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to load admin settings" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/settings
 * Updates non-credential configuration such as recovery email or security questions.
 * Big-O: O(1)
 */
export async function PATCH(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { securityQuestion, recoveryEmail } = body;

    const updated = adminSettingsRepo.update({
      ...(securityQuestion && { securityQuestion: String(securityQuestion).trim() }),
      ...(recoveryEmail && { recoveryEmail: String(recoveryEmail).trim() }),
    });

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      settings: adminSettingsRepo.getSanitized(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update admin settings" },
      { status: 500 }
    );
  }
}
