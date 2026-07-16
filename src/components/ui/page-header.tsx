import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function PageHeader({ title, description, eyebrow, actions, className }: { title: string; description?: string; eyebrow?: string; actions?: ReactNode; className?: string }) {
  return (
    <header className={cn("flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent">{eyebrow}</p>}
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>}
    </header>
  );
}
