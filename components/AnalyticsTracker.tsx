"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    // Do not track admin portal or internal routes
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    // Prevent duplicate logging on same route re-render
    if (lastPathRef.current === pathname) {
      return;
    }
    lastPathRef.current = pathname;

    try {
      // 1. Resolve or establish anonymous session ID
      let sessionId = "";
      if (typeof window !== "undefined" && window.sessionStorage) {
        sessionId = sessionStorage.getItem("gg_anon_sid") || "";
        if (!sessionId) {
          sessionId = `sid_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          sessionStorage.setItem("gg_anon_sid", sessionId);
        }
      }

      // 2. Classify device type
      const width = typeof window !== "undefined" ? window.innerWidth : 1200;
      let deviceType: "mobile" | "tablet" | "desktop" = "desktop";
      if (width < 768) {
        deviceType = "mobile";
      } else if (width < 1024) {
        deviceType = "tablet";
      }

      // 3. Telemetry payload
      const payload = {
        path: pathname,
        referrer: typeof document !== "undefined" ? document.referrer : "",
        deviceType,
        sessionId,
      };

      // 4. Non-blocking dispatch
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
        navigator.sendBeacon("/api/analytics", blob);
      } else {
        fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Ignore background telemetry errors
    }
  }, [pathname]);

  return null;
}
