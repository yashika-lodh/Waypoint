import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "quiet" | "danger";
type Size = "md" | "sm";

const variants: Record<Variant, string> = {
  primary: "bg-[var(--wp-route)] text-[var(--wp-on-accent)] hover:brightness-110",
  quiet:
    "border border-[var(--wp-line)] bg-[var(--wp-surface)] text-[var(--wp-ink)] hover:border-[var(--wp-muted)]",
  danger: "text-[var(--wp-danger)] hover:bg-[var(--wp-danger-soft)]",
};

const sizes: Record<Size, string> = {
  md: "h-9 px-3.5 text-sm",
  sm: "h-7 px-2.5 text-[0.8125rem]",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  variant = "quiet",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center gap-1.5 rounded-md font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--wp-route)] disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}