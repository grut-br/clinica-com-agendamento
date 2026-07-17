import React from "react";
import type { Metadata } from "next";
import { SchedulingForm } from "@/features/appointments/components/scheduling-form";
import { getActiveSpecialties } from "@/features/appointments/queries";

export const metadata: Metadata = {
  title: "Agendar Consulta | Med Odonto",
  description: "Agende sua consulta de forma simples e rápida.",
};

export const revalidate = 0;

interface AgendarPageProps {
  params: Promise<{
    especialidade: string;
  }>;
}

export default async function AgendarPage({ params }: AgendarPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.especialidade;

  const specialties = await getActiveSpecialties();
  const initialSpecialty = specialties.find((s) => s.slug === slug) || specialties[0];

  return (
    <div className="flex-1 bg-surface min-h-[90vh] py-8 sm:py-12">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6">
        
        {/* Introdução Objetiva */}
        <header className="mb-8 text-center sm:text-left">
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Agendamento de Consultas
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl">
            Escolha a especialidade, o melhor horário e confirme sua reserva rapidamente.
          </p>
        </header>

        {/* Formulário Principal */}
        <main className="bg-background shadow-sm border border-border rounded-2xl p-5 sm:p-8">
          <SchedulingForm 
            specialties={specialties} 
            initialSpecialtyId={initialSpecialty?.id || ""} 
          />
        </main>

      </div>
    </div>
  );
}
