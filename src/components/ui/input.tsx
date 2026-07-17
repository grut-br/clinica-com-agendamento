import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Input({ className, type = "text", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        "ui-focus-ring flex min-h-11 w-full rounded-[var(--component-control-radius)] border border-border bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
}
