import type { ReactNode } from "react";
import { PageContainer } from "@/components/ui/page-container";
import { cn } from "@/lib/cn";

export function AppShell({ sidebar, topbar, children, footer, className }: { sidebar?: ReactNode; topbar?: ReactNode; children: ReactNode; footer?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex min-h-screen w-full bg-background text-foreground", className)}>
      {sidebar}
      <div className="flex min-w-0 flex-1 flex-col">
        {topbar}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
        {footer}
      </div>
    </div>
  );
}

export function AppShellSidebar({ children, className }: { children: ReactNode; className?: string }) {
  return <aside className={cn("hidden w-64 shrink-0 border-r border-border bg-surface lg:flex lg:flex-col", className)}>{children}</aside>;
}

export function AppShellTopbar({ children, className }: { children: ReactNode; className?: string }) {
  return <header className={cn("sticky top-0 z-10 flex min-h-16 items-center justify-between border-b border-border bg-surface/95 px-4 backdrop-blur-sm sm:px-6", className)}>{children}</header>;
}

export function AppShellContent({ children, className }: { children: ReactNode; className?: string }) {
  return <PageContainer className={cn("flex flex-col gap-8", className)}>{children}</PageContainer>;
}

export function AppShellFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <footer className={cn("border-t border-border bg-surface px-4 py-4 text-sm text-muted-foreground sm:px-6", className)}>{children}</footer>;
}
