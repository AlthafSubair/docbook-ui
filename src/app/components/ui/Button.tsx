// src/app/components/ui/Button.tsx
import type { ButtonHTMLAttributes } from "react";
import { Spinner } from "./Spinner";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  isLoading?: boolean;
};

const baseStyles = [
  // Layout and shape
  "group relative isolate inline-flex items-center justify-center gap-2",
  "min-h-12 rounded-xl overflow-hidden border-2 border-transparent px-5 py-2.5 text-base font-semibold cursor-pointer",

  // Gradient painted behind the transparent border (always visible as the border)
  "bg-[image:var(--button-gradient)] bg-origin-border",

  // Inner fill layer (covers the padding area only, so the gradient border stays visible)
  "before:absolute before:inset-0 before:-z-10 before:rounded-[10px] before:bg-white",
  "before:transition-opacity before:duration-200",

  // Interaction
  "transition-all duration-150",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
  "enabled:active:scale-[0.99] enabled:active:opacity-95",
  "disabled:cursor-not-allowed disabled:opacity-50",
].join(" ");

const labelBaseStyles =
  "relative inline-block bg-[image:var(--button-gradient)] bg-clip-text transition-colors duration-200";

const variantStyles: Record<ButtonVariant, { button: string; label: string; spinner: string }> = {
  primary: {
    // Fill hidden by default (gradient shows), white fill on hover
    button: "before:opacity-0 enabled:hover:before:opacity-100",
    // White text by default, gradient text on hover
    label: "text-white group-enabled:group-hover:text-transparent",
    spinner: "text-white group-enabled:group-hover:text-primary",
  },
  secondary: {
    // White fill by default, fill hidden on hover (gradient shows)
    button: "before:opacity-100 enabled:hover:before:opacity-0",
    // Gradient text by default, white text on hover
    label: "text-transparent group-enabled:group-hover:text-white",
    spinner: "text-primary group-enabled:group-hover:text-white",
  },
};

export function Button({
  children,
  variant = "primary",
  type = "button",
  className = "",
  isLoading = false,
  disabled = false,
  ...props
}: ButtonProps) {
  const styles = variantStyles[variant];
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading}
      className={`${baseStyles} ${styles.button} ${isLoading ? "cursor-wait" : ""} ${className}`.trim()}
      {...props}
    >
      {isLoading && <Spinner size="sm" className={styles.spinner} />}
      <span className={`${labelBaseStyles} ${styles.label}`}>{children}</span>
    </button>
  );
}