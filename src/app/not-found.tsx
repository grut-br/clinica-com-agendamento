"use client";

import React from "react";
import Link from "next/link";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-background px-6 py-12 text-center text-foreground">
      <div className="max-w-md space-y-6">
        
        {/* Ícone e Código de Erro */}
        <div className="flex flex-col items-center">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-muted/30 border border-border text-foreground shadow-xs animate-pulse">
            <FileQuestion className="h-12 w-12 text-secondary animate-in zoom-in duration-300" />
          </div>
          <span className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-accent">
            Erro 404 • Não Encontrado
          </span>
        </div>

        {/* Textos Informativos */}
        <div className="space-y-2.5">
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Página Não Encontrada
          </h1>
          <p className="text-sm text-muted-foreground font-light leading-relaxed">
            Não conseguimos localizar o endereço solicitado. Verifique se digitou o caminho correto ou retorne à página principal.
          </p>
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => window.history.back()}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-150 border border-border bg-transparent text-foreground px-4 text-sm hover:bg-muted w-full sm:w-auto cursor-pointer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar Página
          </button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-150 bg-accent text-accent-foreground px-4 text-sm shadow-sm hover:bg-accent/90 w-full sm:w-auto text-center"
          >
            <Home className="mr-2 h-4 w-4" />
            Página Inicial
          </Link>
        </div>

      </div>
    </div>
  );
}
