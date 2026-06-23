import Link from "next/link";
import { CSSProperties, ReactNode } from "react";

type Variant = "primary" | "accent" | "secondary" | "ghost" | "dark";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function Button({
  variant = "primary",
  size = "md",
  full = false,
  href,
  children,
  className = "",
  ...rest
}: CommonProps & {
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}) {
  const cls = [
    "us-btn",
    `us-btn--${size}`,
    `us-btn--${variant}`,
    full ? "us-btn--full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link href={href} className={cls} style={rest.style}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
