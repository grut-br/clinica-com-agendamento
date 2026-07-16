import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function LoadingState({ label = "Carregando", children, className }: { label?: string; children?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex min-h-32 items-center justify-center gap-3 rounded-[var(--component-card-radius)] border border-border bg-surface p-6 text-sm text-muted-foreground", className)} role="status" aria-live="polite">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-muted border-t-accent" aria-hidden="true" />
      <span>{children || label}</span>
    </div>
  );
}
