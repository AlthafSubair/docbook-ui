"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Stethoscope } from "lucide-react";
import Title from "@/app/components/ui/Title";
import Desc from "@/app/components/ui/Desc";
import { Button } from "@/app/components/ui/Button";

export interface ErrorAction {
  label: string;
  onClick?: () => void;
  href?: string;
}

export interface ErrorStateProps {
  illustration: string;
  illustrationAlt: string;
  badge?: string;
  title: string;
  description: string;
  primaryAction?: ErrorAction;
  secondaryAction?: ErrorAction;
  actions?: React.ReactNode;
  errorDigest?: string;
}

export function ErrorState({
  illustration,
  illustrationAlt,
  badge,
  title,
  description,
  primaryAction,
  secondaryAction,
  actions,
  errorDigest,
}: ErrorStateProps) {
  return (
    <div className="flex h-[100dvh] max-h-[100dvh] w-full flex-col justify-between items-center px-4 py-3 sm:px-8 sm:py-5 md:px-10 md:py-6 lg:px-12 lg:py-8 bg-background text-foreground select-none overflow-hidden">
      {/* Top Brand Bar */}
      <header className="flex w-full items-center justify-center sm:justify-start max-w-5xl shrink-0">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex size-8 sm:size-9 items-center justify-center rounded-xl bg-[image:var(--button-gradient)] text-white shadow-sm transition-transform duration-150 group-hover:scale-105">
            <Stethoscope className="size-4.5 sm:size-5 text-white" />
          </div>
          <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
            Doc<span className="bg-[image:var(--button-gradient)] bg-clip-text text-transparent">Book</span>
          </span>
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col items-center justify-center text-center my-auto py-2 sm:py-4 max-w-md w-full min-h-0">
        {/* Responsive Illustration */}
        <div className="relative flex items-center justify-center shrink-0 mb-2 sm:mb-3">
          <Image
            src={illustration}
            alt={illustrationAlt}
            width={360}
            height={360}
            priority
            className="w-44 sm:w-52 md:w-64 lg:w-72 h-auto max-h-[22dvh] sm:max-h-[25dvh] lg:max-h-[28vh] object-contain drop-shadow-sm transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>

        {/* Badge / Code */}
        {badge && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold bg-primary/10 text-primary border border-primary/20 tracking-wider uppercase mb-1.5 sm:mb-2">
            {badge}
          </span>
        )}

        {/* Text Details */}
        <div className="flex flex-col gap-1 sm:gap-1.5 w-full px-2">
          <Title className="text-lg sm:text-xl md:text-2xl text-center font-extrabold leading-tight">
            {title}
          </Title>
          <Desc className="text-center text-xs sm:text-sm text-secondary-text max-w-sm mx-auto leading-relaxed">
            {description}
          </Desc>
        </div>

        {/* Error Digest (only when present, helpful for debugging) */}
        {errorDigest && (
          <p className="mt-1.5 text-[10px] sm:text-[11px] font-mono text-tertiary-text/80 bg-slate-100 dark:bg-slate-800/40 px-2 py-0.5 rounded">
            Error ID: {errorDigest}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 w-full max-w-xs sm:max-w-sm mt-4 sm:mt-5 shrink-0">
          {actions ? (
            actions
          ) : (
            <>
              {primaryAction && (
                primaryAction.href ? (
                  <Link href={primaryAction.href} className="w-full sm:flex-1">
                    <Button className="w-full min-h-10 sm:min-h-11 text-sm">{primaryAction.label}</Button>
                  </Link>
                ) : (
                  <Button onClick={primaryAction.onClick} className="w-full sm:flex-1 min-h-10 sm:min-h-11 text-sm">
                    {primaryAction.label}
                  </Button>
                )
              )}

              {secondaryAction && (
                secondaryAction.href ? (
                  <Link href={secondaryAction.href} className="w-full sm:flex-1">
                    <Button variant="secondary" className="w-full min-h-10 sm:min-h-11 text-sm">
                      {secondaryAction.label}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={secondaryAction.onClick}
                    className="w-full sm:flex-1 min-h-10 sm:min-h-11 text-sm"
                  >
                    {secondaryAction.label}
                  </Button>
                )
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer Support Note */}
      <footer className="text-center text-[11px] sm:text-xs text-tertiary-text shrink-0 py-1">
        Need urgent assistance?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Contact DocBook Support
        </Link>
      </footer>
    </div>
  );
}

export default ErrorState;

