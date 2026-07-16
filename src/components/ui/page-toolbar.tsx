import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function PageToolbar({ children, className, "aria-label": ariaLabel = "Ferramentas da página" }: { children: ReactNode; className?: string; "aria-label"?: string }) {
  return <div role="toolbar" aria-label={ariaLabel} className={cn("flex flex-col gap-3 rounded-[var(--component-card-radius)] border border-border bg-surface p-3 sm:flex-row sm:flex-wrap sm:items-center", className)}>{children}</div>;
}
