import React from "react";
import { Smile } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[85vh] w-full flex-col items-center justify-center bg-background text-foreground transition-all duration-300">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        {/* Pulsing Logo Circle */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md animate-bounce">
          <Smile className="h-9 w-9 text-secondary" />
        </div>
        
        {/* Loading text with high tracking */}
        <div className="flex flex-col items-center gap-1.5 mt-2">
          <span className="text-2xs font-black uppercase tracking-[0.2em] text-accent">
            Med Odonto
          </span>
          <p className="text-xs text-muted-foreground font-medium">
            Carregando informações essenciais...
          </p>
        </div>
      </div>
    </div>
  );
}
