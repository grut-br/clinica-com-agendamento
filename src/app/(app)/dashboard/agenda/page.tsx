import React from "react";
import { getUserProfile } from "@/features/appointments/queries";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SlotGeneratorForm } from "@/features/appointments/components/slot-generator-form";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Gerenciar Agenda | Med Odonto",
  description: "Gerador de horários e gestão de agenda da clínica.",
};

export const revalidate = 0;

export default async function AgendaPage() {
  const profile = await getUserProfile();
  const role = profile?.role || "pending";
  if (role === "doctor") {
    redirect("/dashboard");
  }

  const supabase = await createClient();

  // Busca especialidades e profissionais paralelamente no servidor (Vercel Best Practice)
  const [specialtiesRes, professionalsRes] = await Promise.all([
    supabase
      .from("specialties")
      .select("id, name, slug")
      .eq("is_active", true)
      .order("name", { ascending: true }),
    supabase
      .from("professionals")
      .select("id, name, specialty_id")
      .eq("is_active", true)
      .order("name", { ascending: true })
  ]);

  const specialties = specialtiesRes.data || [];
  const professionals = professionalsRes.data || [];

  return (
    <div className="space-y-8 min-h-[80vh]">
      
      {/* Cabeçalho */}
      <PageHeader 
        title="Gerenciamento de Agenda"
        description="Configuração de blocos de disponibilidade e geração de novos horários para consultas e exames."
      />

      {/* Abas de Navegação Rápida no Cabeçalho */}
      <div className="flex border-b border-border gap-6">
        <Link 
          href="/dashboard"
          className="pb-3 border-b-2 border-transparent text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border transition-all cursor-pointer"
        >
          Solicitações Pendentes
        </Link>
        <Link 
          href="/dashboard/agenda"
          className="pb-3 border-b-2 border-secondary text-sm font-bold text-foreground transition-all cursor-pointer"
        >
          Gerenciar Agenda
        </Link>
      </div>

      {/* Formulário do Gerador */}
      <div className="flex items-start justify-start">
        <SlotGeneratorForm specialties={specialties} professionals={professionals} />
      </div>

    </div>
  );
}
