
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg px-5 py-2 text-md font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50";
  const variantStyles = {
    primary:
      "bg-gradient-to-r from-[#0000FF] to-[#000099] text-white hover:brightness-110 active:brightness-90",
    secondary:
      "border-2 border-transparent [background:linear-gradient(white,white)_padding-box,var(--button-gradient)_border-box] text-primary hover:[background:var(--button-gradient)] hover:text-white ",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
