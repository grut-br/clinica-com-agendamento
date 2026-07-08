"use client";

import dynamic from "next/dynamic";
import React from "react";

// Wrapper de cliente para permitir ssr: false fora do Server Component (Topbar)
export const ThemeToggleClient = dynamic(
  () => import("./ThemeToggle").then((mod) => mod.ThemeToggle),
  {
    ssr: false,
    loading: () => (
      <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-zinc-800/40 animate-pulse shrink-0" />
    ),
  }
);
