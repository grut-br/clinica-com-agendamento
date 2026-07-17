"use client";

import type { ReactNode } from "react";
import { PageToolbar } from "@/components/ui/page-toolbar";
import { SearchInput } from "@/components/ui/search-input";

export function TableToolbar({ onSearch, filters, bulkActions, actions, placeholder = "Pesquisar" }: { onSearch?: (value: string) => void; filters?: ReactNode; bulkActions?: ReactNode; actions?: ReactNode; placeholder?: string }) {
  return (
    <PageToolbar aria-label="Ferramentas da tabela">
      {onSearch && <SearchInput placeholder={placeholder} onChange={(event) => onSearch(event.target.value)} />}
      {filters && <div className="flex flex-wrap items-center gap-2">{filters}</div>}
      {bulkActions && <div className="flex flex-wrap items-center gap-2 sm:ml-auto">{bulkActions}</div>}
      {actions && <div className="flex flex-wrap items-center gap-2 sm:ml-auto">{actions}</div>}
    </PageToolbar>
  );
}
