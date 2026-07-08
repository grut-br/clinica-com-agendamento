import React from "react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SchedulingForm } from "@/features/appointments/components/scheduling-form";

export const metadata: Metadata = {
  title: "Agendar Consulta | Med Odonto",
  description: "Escolha o profissional, data e horário para realizar sua consulta em poucos cliques.",
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

  const supabase = await createClient();

  // Busca especialidades ativas ordenadas por nome
  const { data: specialtiesData } = await supabase
    .from("specialties")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name", { ascending: true });

  const specialties = specialtiesData || [];

  // Encontra a especialidade inicial correspondente ao slug da URL
  const initialSpecialty = specialties.find((s) => s.slug === slug) || specialties[0];

  return (
    <div className="flex-1 bg-slate-50 min-h-[85vh] py-12 sm:py-16">
      <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        
        {/* Título do Fluxo de Agendamento */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
            Agendamento de Consultas
          </h1>
          <p className="mt-3 text-sm text-zinc-550 font-light leading-relaxed">
            Siga as etapas abaixo para selecionar sua especialidade, escolher o melhor horário e preencher seus dados de contato.
          </p>
        </div>

        {/* Card Branco Centralizado com o Formulário Interativo */}
        <main className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 rounded-3xl p-6 sm:p-8 md:p-10 max-w-2xl mx-auto">
          <SchedulingForm 
            specialties={specialties} 
            initialSpecialtyId={initialSpecialty?.id || ""} 
          />
        </main>

      </div>
    </div>
  );
}
