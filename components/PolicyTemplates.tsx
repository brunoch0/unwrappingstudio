export const POLICY = [
  {
    eyebrow: "Shipping",
    title: "Where it goes, how long it takes",
    lines: [
      "Currently shipping to the UAE and KSA, with more Gulf countries opening as demand grows.",
      "Expect 7–14 working days. Customs and air schedules can add time; tracking is shared once it ships.",
      "Shipping cost is confirmed per order by weight, volume, and destination.",
    ],
  },
  {
    eyebrow: "Duties & taxes",
    title: "No surprises at the door",
    lines: [
      "Customs or VAT may apply on arrival, charged by your local authority or courier — not by us.",
      "Amounts shown are estimates, not final, and are usually paid on delivery.",
      "We tell you upfront when a piece is likely to carry a duty.",
    ],
  },
  {
    eyebrow: "Returns & exchange",
    title: "If it isn't right",
    lines: [
      "Returns accepted within 7 days of delivery for unused items in original condition.",
      "Made-to-order, hygiene, and final-sale pieces are marked and excluded.",
      "Steps are simple: request → approval → ship back → inspection → refund.",
    ],
  },
];

export function PolicyTemplates({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`grid gap-6 ${compact ? "md:grid-cols-1" : "md:grid-cols-3"}`}>
      {POLICY.map((b) => (
        <div
          key={b.eyebrow}
          className="rounded-[var(--radius-md)] border border-[var(--border-hair)] bg-[var(--surface-card)] p-6 shadow-[var(--shadow-xs)]"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[var(--ls-label)] text-[var(--us-sub-700)]">
            {b.eyebrow}
          </span>
          <h3 className="mt-2 text-[18px] font-semibold text-[var(--text-strong)]">
            {b.title}
          </h3>
          <ul className="mt-4 space-y-3">
            {b.lines.map((l) => (
              <li
                key={l}
                className="flex gap-2.5 text-[14px] leading-relaxed text-[var(--text-body)]"
              >
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--us-sub)]" />
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
