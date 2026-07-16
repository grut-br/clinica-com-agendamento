import { cn } from "@/lib/cn";

export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";

const tones: Record<StatusTone, string> = {
  success: "bg-success/12 text-success",
  warning: "bg-warning/14 text-warning",
  danger: "bg-danger/12 text-danger",
  info: "bg-info/12 text-info",
  neutral: "bg-muted text-muted-foreground",
};

export function StatusBadge({ label, tone = "neutral", className }: { label: string; tone?: StatusTone; className?: string }) {
  return <span className={cn("inline-flex min-h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold", tones[tone], className)}>{label}</span>;
}
