import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { recordLinkClick } from "@/lib/analytics";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  linkId: z.string().uuid(),
  target: z.string().url(),
});

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const parsed = schema.safeParse({
    linkId: url.searchParams.get("linkId"),
    target: url.searchParams.get("target"),
  });

  if (!parsed.success) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const admin = createAdminClient();
  const { data: link } = await admin
    .from("links")
    .select("id, user_id")
    .eq("id", parsed.data.linkId)
    .single();

  if (link?.user_id) {
    await recordLinkClick({
      profileUserId: link.user_id as string,
      linkId: parsed.data.linkId,
      request,
    });
  }

  return NextResponse.redirect(parsed.data.target);
}
