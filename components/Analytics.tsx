"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { captureUtm, track } from "@/lib/analytics";

/** Captures UTM params and sends GA4 page_view on client navigations. */
export function Analytics() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    captureUtm();
    if (first.current) {
      first.current = false; // initial page_view is sent by gtag config
      return;
    }
    track("page_view", { page_path: pathname });
  }, [pathname]);

  return null;
}
