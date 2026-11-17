import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminSession,
  verifyAdminPasscode,
  createSessionToken,
  attachSessionCookie,
} from "@/lib/auth";
import { adminSettingsRepo } from "@/lib/db";

/**
 * POST /api/admin/settings/change-passcode
 * Securely changes the administrator passcode with mandatory verification of previous passcode.
 * Big-O: O(1) constant time with timing-attack prevention.
 */
export async function POST(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { currentPasscode, newPasscode, confirmPasscode } = body;

    // 1. Validate presence
    if (!currentPasscode || !newPasscode || !confirmPasscode) {
      return NextResponse.json(
        { error: "Current passcode, new passcode, and confirmation are required." },
        { status: 400 }
      );
    }

    // 2. Cryptographic timing-safe verification of previous passcode
    if (!verifyAdminPasscode(String(currentPasscode))) {
      // 400ms computational delay to defeat brute-force dictionary attacks
      await new Promise((resolve) => setTimeout(resolve, 400));
      return NextResponse.json(
        { error: "Previous passcode is incorrect. Please check your credentials." },
        { status: 401 }
      );
    }

    // 3. Confirm matching
    if (newPasscode !== confirmPasscode) {
      return NextResponse.json(
        { error: "New passcode and confirmation do not match." },
        { status: 400 }
      );
    }

    // 4. Validate complexity
    const cleanNewPass = String(newPasscode).trim();
    if (cleanNewPass.length < 6) {
      return NextResponse.json(
        { error: "New passcode must be at least 6 characters in length." },
        { status: 400 }
      );
    }

    if (cleanNewPass === String(currentPasscode).trim()) {
      return NextResponse.json(
        { error: "New passcode cannot be identical to the previous passcode." },
        { status: 400 }
      );
    }

    // 5. Update persistent store
    adminSettingsRepo.update({ passcode: cleanNewPass });

    // 6. Issue refreshed secure session token
    const token = createSessionToken();
    const response = NextResponse.json({
      success: true,
      message: "Admin passcode changed successfully.",
      lastPasscodeChange: new Date().toISOString(),
    });
    attachSessionCookie(response, token);

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to change passcode" },
      { status: 500 }
    );
  }
}
