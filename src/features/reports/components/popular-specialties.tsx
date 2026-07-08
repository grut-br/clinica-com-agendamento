"use client";

import React from "react";
import { Flame, Sparkles } from "lucide-react";

export function PopularSpecialties() {
  const specialties = [
    { name: "Odontologia Clínica", share: 45, count: 64, color: "bg-emerald-500" },
    { name: "Ortodontia", share: 28, count: 40, color: "bg-blue-500" },
    { name: "Implantodontia", share: 15, count: 21, color: "bg-amber-500" },
    { name: "Odontopediatria", share: 12, count: 17, color: "bg-rose-500" },
  ];

  return (
    <div className="bg-card border border-border rounded-3xl shadow-xs p-6 sm:p-8 flex flex-col justify-between text-card-foreground w-full h-full transition-colors duration-300">
      <div className="space-y-1 mb-6">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Flame className="h-5 w-5 text-secondary animate-pulse" />
          Especialidades Populares
        </h3>
        <p className="text-xs text-muted-foreground font-light">
          Divisão de atendimentos realizados por especialidade clínica.
        </p>
      </div>

      <div className="space-y-5 flex-1 flex flex-col justify-center">
        {specialties.map((spec, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
              <span className="text-foreground flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${spec.color}`} />
                {spec.name}
              </span>
              <span className="text-foreground font-bold">
                {spec.count} <span className="text-muted-foreground font-light text-2xs">({spec.share}%)</span>
              </span>
            </div>
            {/* Barra de Progresso */}
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${spec.color} transition-all duration-500`}
                style={{ width: `${spec.share}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border flex items-center gap-2 text-2xs text-muted-foreground font-light leading-relaxed">
        <Sparkles className="h-4 w-4 text-secondary shrink-0" />
        <span>Odontologia Clínica continua sendo o principal motor operacional da Med Odonto este mês.</span>
      </div>
    </div>
  );
}
