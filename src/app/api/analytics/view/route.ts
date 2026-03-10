import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { recordProfileView } from "@/lib/analytics";

const schema = z.object({ profileUserId: z.string().uuid() });

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await recordProfileView({ profileUserId: parsed.data.profileUserId, request });
  return NextResponse.json({ ok: true });
}
