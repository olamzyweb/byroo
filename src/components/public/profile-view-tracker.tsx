"use client";

import { useEffect } from "react";

export function ProfileViewTracker({ profileUserId }: { profileUserId: string }) {
  useEffect(() => {
    void fetch("/api/analytics/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileUserId }),
    });
  }, [profileUserId]);

  return null;
}
