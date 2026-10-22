// src/app/components/ui/button.tsx
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const baseStyles = [
  // Layout and shape
  "group relative isolate inline-flex items-center justify-center",
  "rounded-lg border-2 border-transparent px-5 py-2 text-base font-medium",

  // Gradient painted behind the transparent border (always visible as the border)
  "bg-[image:var(--button-gradient)] bg-origin-border",

  // Inner fill layer (covers the padding area only, so the gradient border stays visible)
  "before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-white",
  "before:transition-opacity before:duration-200",

  // Interaction
  "transition-colors duration-200",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
  "disabled:cursor-not-allowed disabled:opacity-50",
].join(" ");

const labelBaseStyles =
  "relative inline-block bg-[image:var(--button-gradient)] bg-clip-text transition-colors duration-200";

const variantStyles: Record<ButtonVariant, { button: string; label: string }> = {
  primary: {
    // Fill hidden by default (gradient shows), white fill on hover
    button: "before:opacity-0 enabled:hover:before:opacity-100",
    // White text by default, gradient text on hover
    label: "text-white group-enabled:group-hover:text-transparent",
  },
  secondary: {
    // White fill by default, fill hidden on hover (gradient shows)
    button: "before:opacity-100 enabled:hover:before:opacity-0",
    // Gradient text by default, white text on hover
    label: "text-transparent group-enabled:group-hover:text-white",
  },
};

export function Button({
  children,
  variant = "primary",
  type = "button",
  className = "",
  ...props
}: ButtonProps) {
  const styles = variantStyles[variant];

  return (
    <button
      type={type}
      className={`${baseStyles} ${styles.button} ${className}`.trim()}
      {...props}
    >
      <span className={`${labelBaseStyles} ${styles.label}`}>{children}</span>
    </button>
  );
}