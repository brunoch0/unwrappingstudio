export const GA_ID = "G-0RB5SS3VD3";

type Params = Record<string, unknown>;

/** Fire a GA4 event (no-op until gtag is loaded / on the server). */
export function track(event: string, params?: Params) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag === "function") {
    w.gtag("event", event, { ...getUtm(), ...(params ?? {}) });
  }
}

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];
const STORE_KEY = "uw_utm";

/** Capture UTM params from the URL into sessionStorage (first-touch per session). */
export function captureUtm() {
  if (typeof window === "undefined") return;
  try {
    const sp = new URLSearchParams(window.location.search);
    const found: Record<string, string> = {};
    for (const k of UTM_KEYS) {
      const v = sp.get(k);
      if (v) found[k] = v;
    }
    if (Object.keys(found).length && !sessionStorage.getItem(STORE_KEY)) {
      sessionStorage.setItem(STORE_KEY, JSON.stringify(found));
    }
  } catch {}
}

/** Read captured UTM params (for attaching to events / inquiries). */
export function getUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
