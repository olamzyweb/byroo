import { ImageResponse } from "next/og";
import { createAdminClient } from "@/lib/supabase/admin";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OpenGraphImage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("profiles")
    .select("display_name, bio, avatar_url")
    .eq("username", username)
    .eq("onboarded", true)
    .maybeSingle();

  const displayName = profile?.display_name ?? username;
  const bio = profile?.bio ?? "Your business space online";
  const avatar = profile?.avatar_url ?? null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #f1f5ff 0%, #ffffff 55%, #ecfeff 100%)",
          color: "#0f172a",
          padding: "56px",
          fontFamily: "sans-serif",
          justifyContent: "space-between",
          alignItems: "stretch",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "72%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#3451d1" }}>Byroo</div>
            <div style={{ fontSize: 18, color: "#64748b" }}>Your business space online</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.05 }}>{displayName}</div>
            <div style={{ fontSize: 28, color: "#475569", lineHeight: 1.25, maxWidth: 760 }}>{bio.slice(0, 140)}</div>
          </div>
          <div style={{ fontSize: 24, color: "#64748b" }}>byroo.space/{username}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "24%" }}>
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt={displayName}
              style={{
                width: 220,
                height: 220,
                borderRadius: 999,
                objectFit: "cover",
                border: "8px solid rgba(255,255,255,0.95)",
                boxShadow: "0 20px 45px rgba(15,23,42,0.18)",
              }}
            />
          ) : (
            <div
              style={{
                width: 220,
                height: 220,
                borderRadius: 999,
                background: "linear-gradient(135deg, #3451d1, #0ea5e9)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 88,
                fontWeight: 700,
                boxShadow: "0 20px 45px rgba(15,23,42,0.18)",
              }}
            >
              {displayName.slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
