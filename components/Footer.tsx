import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-[var(--surface-darkest)] text-white">
      <div className="us-glitter-wrap relative mx-auto max-w-[1200px] px-5 py-16 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo tone="light" size={24} withStudio />
            <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-[var(--text-on-dark-mut)]">
              A curation shop from Unwrapping Studio — seeing beyond the surface,
              for the Gulf. Seoul &amp; Dubai.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[var(--ls-label)] text-[var(--us-sub)]">
              Explore
            </h4>
            <ul className="mt-4 space-y-2.5 text-[14px] text-[var(--text-on-dark-mut)]">
              <li><Link href="/" className="hover:text-white">Studio</Link></li>
              <li><Link href="/shop" className="hover:text-white">Shop</Link></li>
              <li><Link href="/shop#collections" className="hover:text-white">Collections</Link></li>
              <li><Link href="/shop#shipping" className="hover:text-white">Shipping &amp; duties</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[var(--ls-label)] text-[var(--us-sub)]">
              Connect
            </h4>
            <ul className="mt-4 space-y-2.5 text-[14px] text-[var(--text-on-dark-mut)]">
              <li>
                <a
                  href="https://instagram.com/unwrapping_objects"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  @unwrapping_objects ↗
                </a>
              </li>
              <li>
                <a href="https://unwrappingstudio.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  unwrappingstudio.com ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-[var(--border-on-dark)] pt-6 text-[12px] text-[var(--text-on-dark-mut)] sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Unwrapping Studio. All rights reserved.</span>
          <span className="uppercase tracking-[var(--ls-label)]">
            The moment before clarity aligns
          </span>
        </div>
      </div>
    </footer>
  );
}
