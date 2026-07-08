"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Stethoscope, User } from "lucide-react";

interface DoctorItem {
  id: string;
  name: string;
}

interface DoctorSelectorProps {
  doctors: DoctorItem[];
  selectedDoctorId?: string;
}

export function DoctorSelector({ doctors, selectedDoctorId }: DoctorSelectorProps) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) {
      router.push(`/dashboard/meus-atendimentos?doctorId=${val}`);
    } else {
      router.push("/dashboard/meus-atendimentos");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-md">
      <div className="flex items-center gap-2.5">
        <div className="h-10 w-10 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary shrink-0">
          <Stethoscope className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">Simulador de Login de Médico</h4>
          <p className="text-2xs text-zinc-400 font-light mt-0.5">
            Selecione um profissional para carregar a grade de atendimentos e evoluções clínicas dele.
          </p>
        </div>
      </div>

      <div className="relative min-w-[240px]">
        <select
          value={selectedDoctorId || ""}
          onChange={handleChange}
          className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-secondary/10 focus:border-secondary text-sm font-bold text-foreground cursor-pointer appearance-none"
        >
          <option value="" className="text-muted-foreground">-- Escolha um Profissional --</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id} className="text-foreground">
              {doc.name}
            </option>
          ))}
        </select>
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
          <User className="h-4.5 w-4.5" />
        </span>
      </div>
    </div>
  );
}
