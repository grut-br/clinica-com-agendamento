"use client";

import React from "react";
import { Menu } from "lucide-react";

export function MobileMenuTrigger() {
  const handleToggle = () => {
    // Despacha um evento global que a MobileSidebar escutará para se abrir
    window.dispatchEvent(new CustomEvent("toggle-mobile-sidebar"));
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label="Abrir menu"
      className="md:hidden p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}
