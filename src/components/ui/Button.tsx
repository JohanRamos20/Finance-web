import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
  variant?: ButtonVariant;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "border-accent text-accent hover:bg-accent/10 active:bg-accent/20",
  secondary: "border-divider text-text hover:bg-text/5 active:bg-text/10",
  danger:
    "border-accent-300 text-accent-300 hover:bg-accent-300/10 active:bg-accent-300/20",
};

export function Button({
  fullWidth,
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-1.5 rounded-md border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-45",
        VARIANT_CLASSES[variant],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    />
  );
}
