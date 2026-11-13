"use client";

import React from "react";

export interface OptionItem<T = string> {
  value: T;
  label?: React.ReactNode;
  disabled?: boolean;
}

export type OptionType<T = string> = T | OptionItem<T>;

export interface OptionButtonProps {
  isSelected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md";
  hasError?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Reusable single option button with DocBook input-matched border styling
 * and full gradient background on selection.
 */
export function OptionButton({
  isSelected = false,
  onClick,
  size = "md",
  hasError = false,
  disabled = false,
  className = "",
  children,
}: OptionButtonProps) {
  const sizeStyles =
    size === "sm"
      ? "h-8.5 px-1.5 text-xs rounded-xl"
      : "h-12 px-3 text-xs sm:text-sm rounded-xl";

  const stateStyles = isSelected
    ? "bg-[image:var(--button-gradient)] bg-origin-border bg-no-repeat text-white border-transparent shadow-[0_2px_10px_rgba(0,0,255,0.32)]"
    : hasError
      ? "bg-white border-red-500 text-red-600 shadow-[0_2px_8px_rgba(239,68,68,0.25)] hover:border-red-600"
      : "bg-white border-primary/50 text-slate-700 shadow-[0_2px_8px_rgba(0,0,255,0.15)] hover:border-primary hover:shadow-[0_2px_8px_rgba(0,0,255,0.25)] hover:text-primary";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`border-2 font-semibold transition-[border-color,box-shadow,transform,background-color,color] duration-150 text-center cursor-pointer select-none flex items-center justify-center outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed ${sizeStyles} ${stateStyles} ${className}`.trim()}
    >
      {children}
    </button>
  );
}

export interface OptionSelectorProps<T extends string = string> {
  /** Optional label text above the selector */
  label?: string;
  /** List of selectable options (strings or { value, label } items) */
  options: readonly OptionType<T>[];
  /** Currently selected value */
  value: T | "" | undefined;
  /** Callback fired when an option is selected */
  onChange: (value: T) => void;
  /** Error message to display beneath the options */
  error?: string;
  /** Size variant: "sm" (compact, e.g. h-8) or "md" (default, e.g. h-11) */
  size?: "sm" | "md";
  /** Grid layout classes (defaults to "grid-cols-3 gap-1") */
  gridClassName?: string;
  /** Optional container class */
  className?: string;
  /** Disable all options */
  disabled?: boolean;
}

/**
 * Reusable multi-option picker component matching DocBook input styling
 * and full gradient background on selection.
 */
export function OptionSelector<T extends string = string>({
  label,
  options,
  value,
  onChange,
  error,
  size = "md",
  gridClassName = "grid-cols-3 gap-1",
  className = "",
  disabled = false,
}: OptionSelectorProps<T>) {
  return (
    <div className={`flex flex-col gap-2 ${className}`.trim()}>
      {label && (
        <label className="text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}

      <div className={`grid ${gridClassName}`}>
        {options.map((opt) => {
          const itemVal = (
            typeof opt === "object" && opt !== null ? opt.value : opt
          ) as T;
          const itemLabel = (
            typeof opt === "object" && opt !== null
              ? opt.label ?? opt.value
              : opt
          ) as React.ReactNode;
          const itemDisabled =
            disabled ||
            (typeof opt === "object" && opt !== null ? opt.disabled : false);
          const isSelected = value === itemVal;

          return (
            <OptionButton
              key={itemVal}
              isSelected={isSelected}
              onClick={() => onChange(itemVal)}
              size={size}
              hasError={Boolean(error && !isSelected)}
              disabled={itemDisabled}
            >
              {itemLabel}
            </OptionButton>
          );
        })}
      </div>

      {error && (
        <p className="text-[11px] font-medium text-red-500 animate-in fade-in duration-150">
          {error}
        </p>
      )}
    </div>
  );
}

export default OptionSelector;

