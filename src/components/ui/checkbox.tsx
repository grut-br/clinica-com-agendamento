import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Checkbox({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      className={cn(
        "ui-focus-ring h-5 w-5 rounded border-border accent-[hsl(var(--accent))] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
