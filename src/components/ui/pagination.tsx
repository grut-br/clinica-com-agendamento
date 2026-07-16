"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function Pagination({ page, totalPages, onPageChange, className }: { page: number; totalPages: number; onPageChange: (page: number) => void; className?: string }) {
  return (
    <nav aria-label="Paginação" className={cn("flex items-center justify-between gap-4", className)}>
      <span className="text-sm text-muted-foreground">Página {page} de {totalPages}</span>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Anterior</Button>
        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Próxima</Button>
      </div>
    </nav>
  );
}
