import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPasscode, createSessionToken, attachSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { passcode, password } = body;
    const inputPasscode = passcode || password || "";

    if (!verifyAdminPasscode(inputPasscode)) {
      // Artificial delay to prevent brute-force attacks
      await new Promise((resolve) => setTimeout(resolve, 300));
      return NextResponse.json(
        { success: false, message: "Invalid administrative credentials" },
        { status: 401 }
      );
    }

    const token = createSessionToken();
    const response = NextResponse.json({
      success: true,
      message: "Authentication successful",
      role: "admin",
      token,
    });

    attachSessionCookie(response, token);
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Authentication request failed" },
      { status: 400 }
    );
  }
}
