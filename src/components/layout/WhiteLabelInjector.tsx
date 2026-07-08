"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

/**
 * WhiteLabelInjector
 * 
 * Componente cliente responsável por aplicar as cores personalizadas
 * do White-Label em tempo real APENAS no Modo Claro.
 * 
 * No Modo Escuro, todas as variáveis inline são removidas,
 * mantendo a base neutra (zinco/preto) intocável e padronizada.
 * 
 * As cores são lidas do localStorage e injetadas como variáveis CSS
 * no document.documentElement.style.
 */
export function WhiteLabelInjector() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // Só executa no client-side
    if (typeof window === "undefined") return;

    const root = document.documentElement;

    if (resolvedTheme === "light") {
      // Lê as cores salvas no localStorage (definidas pelo painel de Configurações > Aparência)
      const savedPrimary = localStorage.getItem("clinic_primary_color_hsl");
      const savedAccent = localStorage.getItem("clinic_accent_color_hsl");
      const savedBackground = localStorage.getItem("clinic_background_color_hsl");

      // Injeta APENAS se existirem valores salvos (nunca sobrescreve os defaults sem necessidade)
      if (savedPrimary) {
        root.style.setProperty("--primary", savedPrimary);
        // Foreground do primário: se a cor for escura, usa branco; se clara, usa escuro
        root.style.setProperty("--primary-foreground", "210 40% 98%");
      }

      if (savedAccent) {
        root.style.setProperty("--accent", savedAccent);
        root.style.setProperty("--accent-foreground", "210 40% 98%");
      }

      if (savedBackground) {
        root.style.setProperty("--background", savedBackground);
        root.style.setProperty("--card", savedBackground);
      }
    } else {
      // MODO ESCURO: Remove TODAS as variáveis inline para blindar a base neutra
      root.style.removeProperty("--primary");
      root.style.removeProperty("--primary-foreground");
      root.style.removeProperty("--accent");
      root.style.removeProperty("--accent-foreground");
      root.style.removeProperty("--background");
      root.style.removeProperty("--card");
    }
  }, [resolvedTheme]);

  // Componente invisível — apenas efeito colateral
  return null;
}
