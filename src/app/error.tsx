"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log do erro no console em desenvolvimento
    console.error("[GLOBAL_APP_ERROR]:", error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-background px-6 py-12 text-center text-foreground">
      <div className="max-w-md space-y-6">
        
        {/* Ícone e Código de Erro */}
        <div className="flex flex-col items-center">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-danger/10 border border-danger/20 text-danger shadow-xs animate-bounce">
            <AlertTriangle className="h-12 w-12 text-danger" />
          </div>
          <span className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-danger">
            Erro 500 • Erro Interno
          </span>
        </div>

        {/* Textos Informativos */}
        <div className="space-y-2.5">
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Ocorreu um Erro Inesperado
          </h1>
          <p className="text-sm text-muted-foreground font-light leading-relaxed">
            Pedimos desculpas pelo transtorno. Um erro interno temporário impediu o processamento desta página. 
          </p>
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={reset}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-150 border border-border bg-transparent text-foreground px-4 text-sm hover:bg-muted w-full sm:w-auto cursor-pointer"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar Novamente
          </button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-150 bg-accent text-accent-foreground px-4 text-sm shadow-sm hover:bg-accent/90 w-full sm:w-auto text-center"
          >
            <Home className="mr-2 h-4 w-4" />
            Voltar ao Início
          </Link>
        </div>

      </div>
    </div>
  );
}
