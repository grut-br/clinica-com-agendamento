"use client";

import { cn } from "@/lib/cn";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  "aria-label"?: string;
  className?: string;
}

export function Switch({ checked, onCheckedChange, disabled, className, "aria-label": ariaLabel }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "ui-focus-ring relative inline-flex h-6 w-11 shrink-0 rounded-full border border-transparent p-0.5 transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-accent" : "bg-muted",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-primary-foreground shadow-sm transition-transform duration-150",
          checked ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  );
}
