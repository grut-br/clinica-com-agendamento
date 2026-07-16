import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function StatCard({ label, value, detail, icon }: { label: string; value: string | number; detail?: string; icon?: ReactNode }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 font-heading text-3xl font-bold tracking-tight text-foreground">{value}</p>
          {detail && <p className="mt-1 text-xs text-muted-foreground">{detail}</p>}
        </div>
        {icon && <div className="rounded-lg bg-accent/10 p-2.5 text-accent" aria-hidden="true">{icon}</div>}
      </div>
    </Card>
  );
}
