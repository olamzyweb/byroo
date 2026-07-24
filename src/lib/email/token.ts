import crypto from "crypto";
import { emailConfig } from "./config";

/**
 * Generates a secure, cryptographically signed token for unsubscribe links.
 * The token contains the userId, email, and a secure HMAC signature.
 */
export function generateUnsubscribeToken(userId: string, email: string): string {
  const secret = emailConfig.tokenSecret;
  const hash = crypto
    .createHmac("sha256", secret)
    .update(`${userId}:${email}`)
    .digest("hex");

  const payload = {
    userId,
    email,
    hash,
    t: Date.now(),
  };

  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

/**
 * Decrypts and validates an unsubscribe token, checking signature integrity.
 * Returns the decoded userId and email if verification succeeds, or null if invalid.
 */
export function verifyUnsubscribeToken(token: string): { userId: string; email: string } | null {
  try {
    const payloadJson = Buffer.from(token, "base64url").toString("utf8");
    const payload = JSON.parse(payloadJson);

    if (!payload.userId || !payload.email || !payload.hash) {
      return null;
    }

    const expectedHash = crypto
      .createHmac("sha256", emailConfig.tokenSecret)
      .update(`${payload.userId}:${payload.email}`)
      .digest("hex");

    // Timing-safe comparison to prevent timing attacks
    const bufferHash = Buffer.from(payload.hash);
    const bufferExpected = Buffer.from(expectedHash);

    if (bufferHash.length !== bufferExpected.length) {
      return null;
    }

    if (crypto.timingSafeEqual(bufferHash, bufferExpected)) {
      return {
        userId: payload.userId,
        email: payload.email,
      };
    }

    return null;
  } catch (error) {
    console.error("❌ Failed to verify unsubscribe token:", error);
    return null;
  }
}
