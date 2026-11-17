import { NextRequest, NextResponse } from "next/server";
import { verifyRecoveryCredential } from "@/lib/auth";
import { adminSettingsRepo } from "@/lib/db";

/**
 * POST /api/admin/settings/recover-passcode
 * Emergency recovery endpoint to reset administrator passcode when previous passcode is forgotten.
 * Verifies registered security answer, administrator email, or master emergency recovery key.
 * Big-O: O(1) constant time with timing-attack prevention.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recoveryCredential, newPasscode, confirmPasscode } = body;

    if (!recoveryCredential || !newPasscode || !confirmPasscode) {
      return NextResponse.json(
        { error: "Recovery credential, new passcode, and confirmation are required." },
        { status: 400 }
      );
    }

    // 1. Verify recovery credential in constant time
    if (!verifyRecoveryCredential(String(recoveryCredential))) {
      // 400ms delay to thwart automated recovery guessing
      await new Promise((resolve) => setTimeout(resolve, 400));
      return NextResponse.json(
        { error: "Invalid recovery credential or security answer." },
        { status: 401 }
      );
    }

    // 2. Confirm matching
    if (newPasscode !== confirmPasscode) {
      return NextResponse.json(
        { error: "New passcode and confirmation do not match." },
        { status: 400 }
      );
    }

    // 3. Complexity check
    const cleanNewPass = String(newPasscode).trim();
    if (cleanNewPass.length < 6) {
      return NextResponse.json(
        { error: "New passcode must be at least 6 characters in length." },
        { status: 400 }
      );
    }

    // 4. Update persistent storage
    adminSettingsRepo.update({ passcode: cleanNewPass });

    return NextResponse.json({
      success: true,
      message: "Passcode successfully reset. You may now log in with your new passcode.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process recovery request" },
      { status: 500 }
    );
  }
}
