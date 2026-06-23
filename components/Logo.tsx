import { CSSProperties } from "react";

type LogoProps = {
  /** "key" deep green · "light" white · "ink" near-black */
  tone?: "key" | "light" | "ink";
  size?: number;
  withStudio?: boolean;
  className?: string;
  style?: CSSProperties;
};

const toneColor = {
  key: "var(--us-key)",
  light: "var(--us-white)",
  ink: "var(--us-ink)",
} as const;

/**
 * The wordmark: U-N-WRAPPING, struck through on "WRAPPING".
 * The strike is the brand's logo and its idea — the surface crossed out
 * so the truth beneath can be read.
 */
export function Logo({
  tone = "key",
  size = 22,
  withStudio = false,
  className,
  style,
}: LogoProps) {
  const color = toneColor[tone];
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        lineHeight: 1,
        color,
        ...style,
      }}
      aria-label="Unwrapping Studio"
    >
      <span
        style={{
          fontWeight: 800,
          fontSize: size,
          letterSpacing: "var(--ls-logo)",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        UN
        <span className="us-strike">WRAPPING</span>
      </span>
      {withStudio && (
        <span
          style={{
            marginTop: size * 0.34,
            fontSize: size * 0.42,
            fontWeight: 500,
            letterSpacing: "var(--ls-wide)",
            textTransform: "lowercase",
            opacity: 0.85,
          }}
        >
          studio
        </span>
      )}
    </span>
  );
}
