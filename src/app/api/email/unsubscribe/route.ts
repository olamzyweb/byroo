import { NextResponse } from "next/server";
import { verifyUnsubscribeToken } from "../../../../lib/email/token";
import { EmailPreferenceService } from "../../../../services/email-preference";

/**
 * GET: Verifies the unsubscribe token and returns the current preferences.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  const payload = verifyUnsubscribeToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }

  try {
    const preferences = await EmailPreferenceService.getPreferences(payload.userId);
    return NextResponse.json({
      success: true,
      email: payload.email,
      preferences,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST: Updates user email preferences.
 */
export async function POST(request: Request) {
  try {
    const { token, preferences } = await request.json();

    if (!token || !preferences) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const payload = verifyUnsubscribeToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    const updated = await EmailPreferenceService.updatePreferences(payload.userId, preferences);

    return NextResponse.json({
      success: true,
      preferences: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
