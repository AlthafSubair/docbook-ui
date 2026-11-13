"use client";

import React, { useEffect } from "react";
import { Trash2, X, Loader2 } from "lucide-react";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Patient Profile?",
  description = "Are you sure you want to delete this profile? This action cannot be undone.",
  confirmText = "Delete Profile",
  cancelText = "Cancel",
  isLoading = false,
  children,
}) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-[340px] rounded-2xl bg-white p-5 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.22),0_4px_12px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col gap-3.5 animate-in zoom-in-95 duration-150 select-none">
        {/* Close X Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-3.5 top-3.5 size-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-40"
          aria-label="Close dialog"
        >
          <X className="size-4" />
        </button>

        {/* Top: Minimal Warning Icon */}
        <div className="size-11 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0 shadow-[0_0_14px_rgba(239,68,68,0.14)]">
          <Trash2 className="size-5 stroke-[2.2]" />
        </div>

        {/* Text Content */}
        <div className="flex flex-col gap-1">
          <h3
            id="confirm-modal-title"
            className="text-base font-bold text-slate-900 tracking-tight"
          >
            {title}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Optional Custom Content (e.g. Patient info preview) */}
        {children}

        {/* Bottom Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-10 px-3 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 h-10 px-3 rounded-xl font-semibold text-xs sm:text-sm text-white bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-sm shadow-red-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-70 active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
