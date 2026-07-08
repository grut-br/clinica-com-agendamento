"use client";

import dynamic from "next/dynamic";
import React from "react";

// Wrapper de cliente para permitir ssr: false fora do Server Component (RelatoriosPage)
export const AppointmentsChartClient = dynamic(
  () => import("./appointments-chart").then((mod) => mod.AppointmentsChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[380px] w-full bg-card border border-border rounded-3xl animate-pulse flex items-center justify-center">
        <span className="text-sm text-muted-foreground font-light">Carregando dados analíticos...</span>
      </div>
    ),
  }
);
