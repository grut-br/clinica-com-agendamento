import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-foreground shadow-sm hover:bg-accent/90",
  secondary: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
  ghost: "text-foreground hover:bg-muted",
  danger: "bg-danger text-danger-foreground shadow-sm hover:bg-danger/90",
  outline: "border border-border bg-transparent text-foreground hover:bg-muted",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg" | "icon";
}

export function Button({ className, variant = "primary", size = "md", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "ui-focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--component-control-radius)] font-semibold transition-colors duration-150 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        size === "sm" && "px-3 text-sm",
        size === "md" && "px-4 text-sm",
        size === "lg" && "px-5 text-base",
        size === "icon" && "w-11 px-0",
        className,
      )}
      {...props}
    />
  );
}
