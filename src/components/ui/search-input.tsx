import { Search } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";

export function SearchInput({ "aria-label": ariaLabel = "Pesquisar", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="relative block w-full max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <Input aria-label={ariaLabel} className="pl-9" {...props} />
    </label>
  );
}
