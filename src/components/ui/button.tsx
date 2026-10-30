import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "group relative inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium tracking-tight transition-[transform,background-color,border-color,color,box-shadow] duration-300 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-ink hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-12px_var(--accent)]",
  secondary:
    "border border-line-strong bg-surface text-fg backdrop-blur hover:-translate-y-0.5 hover:border-accent/60",
  ghost: "text-fg-muted hover:text-fg",
};

export function buttonClass(variant: Variant = "primary", className = "") {
  return `${base} ${variants[variant]} ${className}`;
}

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
  external?: boolean;
} & Omit<ComponentProps<"a">, "href" | "className" | "children">;

/** Internal links use next/link; external ones open in a new tab safely. */
export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
  external,
  ...rest
}: ButtonLinkProps) {
  const cls = buttonClass(variant, className);
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}
