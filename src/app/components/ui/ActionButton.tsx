"use client";

import React from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ActionButtonVariant = "danger" | "default" | "primary";

export interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  label?: string;
  variant?: ActionButtonVariant;
}

const variantStyles: Record<ActionButtonVariant, string> = {
  danger: "text-slate-400 hover:text-red-600 active:text-red-700 hover:bg-red-50 active:bg-red-100",
  default: "text-slate-400 hover:text-slate-700 active:text-slate-900 hover:bg-slate-100 active:bg-slate-200",
  primary: "text-primary hover:text-primary-dark hover:bg-blue-50 active:bg-blue-100",
};

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  children,
  variant = "danger",
  type = "button",
  className = "",
  ...props
}) => {
  const content = label || children;
  const paddingClass = content ? "py-1 px-1.5 rounded-md" : "p-1.5 rounded-lg";

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-1 text-[11px] leading-none font-medium transition-colors cursor-pointer select-none ${paddingClass} ${variantStyles[variant]} ${className}`.trim()}
      {...props}
    >
      {icon && <span className="shrink-0 flex items-center justify-center">{icon}</span>}
      {content && <span className="leading-none pt-[0.5px]">{content}</span>}
    </button>
  );
};

export default ActionButton;
