// src/app/components/ui/input.tsx
"use client";

import { forwardRef, useId, useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  /** Visible label rendered above the field. */
  label?: string;
  /** Icon shown on the left (any ReactNode, e.g. an inline SVG or lucide icon). */
  icon?: ReactNode;
  /** Error message. Turns the field red and is announced to screen readers. */
  error?: string;
  /** Helper text shown below the field when there is no error. */
  helperText?: string;
  /** Show the eye toggle when type="password". Defaults to true. */
  showPasswordToggle?: boolean;
  /** Extra classes for the outer wrapper (label + field + messages). */
  containerClassName?: string;
};

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {off ? (
        <>
          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
          <path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
          <path d="m2 2 20 20" />
        </>
      ) : (
        <>
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    icon,
    error,
    helperText,
    type = "text",
    showPasswordToggle = true,
    id,
    disabled,
    className = "",
    containerClassName = "",
    "aria-describedby": ariaDescribedBy,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPassword = type === "password";
  const hasToggle = isPassword && showPasswordToggle;
  const resolvedType = isPassword && isPasswordVisible ? "text" : type;

  const message = error ?? helperText;
  const describedBy =
    [ariaDescribedBy, message ? messageId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  const fieldStyles = [
    "flex items-center gap-3 rounded-xl border-2 bg-white px-4 py-3",
    "transition-[border-color,box-shadow] duration-200",
    error
      ? "border-red-500 shadow-[0_2px_8px_rgba(239,68,68,0.3)] focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.25)]"
      : "border-primary/50 shadow-[0_2px_8px_rgba(0,0,255,0.25)] focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(0,0,255,0.2)]",
    disabled ? "cursor-not-allowed opacity-50" : "",
  ].join(" ");

  return (
    <div className={`flex flex-col gap-2 ${containerClassName}`.trim()}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-secondary-text"
        >
          {label}
        </label>
      )}

      <div className={fieldStyles}>
        {icon && (
          <span
            className="flex shrink-0 items-center text-primary [&>svg]:size-5"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          type={resolvedType}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`min-w-0 flex-1 bg-transparent text-base text-secondary-text outline-none placeholder:text-tertiary-text disabled:cursor-not-allowed ${className}`.trim()}
          {...props}
        />

        {hasToggle && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            disabled={disabled}
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            aria-pressed={isPasswordVisible}
            className="flex shrink-0 items-center rounded text-tertiary-text transition-colors duration-200 hover:text-secondary-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed"
          >
            <EyeIcon off={isPasswordVisible} />
          </button>
        )}
      </div>

      {message && (
        <p
          id={messageId}
          role={error ? "alert" : undefined}
          className={`text-sm ${error ? "text-red-600" : "text-tertiary-text"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
});