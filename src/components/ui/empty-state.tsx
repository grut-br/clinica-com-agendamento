import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function EmptyState({ 
  title, 
  description, 
  action, 
  icon, 
  className 
}: { 
  title: string; 
  description: string; 
  action?: ReactNode; 
  icon?: ReactNode; 
  className?: string;
}) {
  return (
    <section 
      className={cn(
        "flex min-h-72 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border/80 bg-card p-8 sm:p-12 text-center shadow-2xs transition-all duration-300 hover:border-border select-none animate-in fade-in zoom-in-95 duration-500", 
        className
      )} 
      aria-label={title}
    >
      {icon ? (
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/40 border border-border/60 text-muted-foreground shadow-2xs" aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <h3 className="font-heading text-base font-bold text-foreground tracking-tight">{title}</h3>
      <p className="mt-2.5 max-w-sm text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">{description}</p>
      {action && <div className="mt-6 animate-in slide-in-from-bottom-2 duration-300">{action}</div>}
    </section>
  );
}
