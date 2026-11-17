/**
 * Server-Side Authentication & Session Management for GreenGallery Admin
 * Implements cryptographically signed, tamper-proof session tokens using HMAC-SHA256.
 * Zero external dependencies using Node.js crypto module.
 *
 * Algorithmic Complexity:
 * - Session Generation: O(1) HMAC-SHA256 digest
 * - Session Verification: O(1) Constant-time buffer comparison (prevents timing attacks)
 */

import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "gg_admin_session";
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

// Default fallback secret for development; in production, set ADMIN_SESSION_SECRET
const SECRET = process.env.ADMIN_SESSION_SECRET || "gg-pune-secure-admin-auth-token-key-2026";
const ADMIN_PASSWORD = process.env.ADMIN_PASSCODE || "PuneGreen2026";

export interface SessionPayload {
  role: "admin";
  issuedAt: number;
  expiresAt: number;
}

/**
 * Creates a cryptographically signed session token.
 * Token format: Base64Url(payload) + "." + HMAC_SHA256(Base64Url(payload), SECRET)
 */
export function createSessionToken(): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    role: "admin",
    issuedAt: now,
    expiresAt: now + SESSION_MAX_AGE_SECONDS,
  };

  const payloadString = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(payloadString)
    .digest("base64url");

  return `${payloadString}.${signature}`;
}

/**
 * Validates a session token using constant-time comparison.
 * Returns true if valid and unexpired; false otherwise.
 */
export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token || typeof token !== "string") return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payloadString, signature] = parts;

  // Recompute expected signature
  const expectedSignature = crypto
    .createHmac("sha256", SECRET)
    .update(payloadString)
    .digest("base64url");

  // Constant-time comparison to prevent timing attacks
  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expectedBuffer.length) {
    return false;
  }

  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return false;
  }

  // Check expiration
  try {
    const payload: SessionPayload = JSON.parse(
      Buffer.from(payloadString, "base64url").toString("utf-8")
    );
    const now = Math.floor(Date.now() / 1000);
    if (payload.expiresAt < now) {
      return false; // Expired
    }
    return payload.role === "admin";
  } catch {
    return false;
  }
}

/**
 * Verifies admin session from incoming NextRequest cookies or Authorization header.
 */
export function verifyAdminSession(req: NextRequest): boolean {
  // 1. Check HTTP-only cookie
  const cookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (cookie && verifySessionToken(cookie)) {
    return true;
  }

  // 2. Check Bearer token in Authorization header
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    if (verifySessionToken(token)) {
      return true;
    }
  }

  // 3. Allow passcode header for legacy CLI/scripts during transition if verified
  const passcodeHeader = req.headers.get("x-admin-passcode");
  if (passcodeHeader && verifyAdminPasscode(passcodeHeader)) {
    return true;
  }

  return false;
}

/**
 * Checks plaintext passcode using timing-safe comparison.
 */
export function verifyAdminPasscode(passcode: string): boolean {
  if (!passcode || typeof passcode !== "string") return false;
  const targetBuffer = Buffer.from(passcode);
  const validBuffer = Buffer.from(ADMIN_PASSWORD);

  if (targetBuffer.length !== validBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(targetBuffer, validBuffer);
}

/**
 * Attaches the admin session cookie to a NextResponse.
 */
export function attachSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: false, // Allows local development and proxy SSL termination
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

/**
 * Clears the admin session cookie from a NextResponse.
 */
export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
