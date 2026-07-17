import React from "react";
import { getUserProfile } from "@/features/appointments/queries";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAllSpecialties, getAllExams } from "@/features/appointments/queries";
import { CatalogoTabs } from "@/features/appointments/components/catalogo-tabs";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Catálogo da Clínica | Med Odonto",
  description: "Gerenciamento de especialidades e exames do catálogo da Med Odonto.",
};

// Desabilita cache estático para manter os dados de catálogo sincronizados em tempo real
export const revalidate = 0;

export default async function CatalogoCmsPage() {
  const profile = await getUserProfile();
  const role = profile?.role || "pending";
  if (role === "doctor") {
    redirect("/dashboard");
  }

  // Carrega todas as especialidades e exames em paralelo no servidor (Vercel Best Practice)
  const [specialties, exams] = await Promise.all([
    getAllSpecialties(),
    getAllExams()
  ]);

  return (
    <div className="space-y-8 min-h-[80vh]">
      
      {/* Cabeçalho do CMS */}
      <PageHeader 
        title="Catálogo da Clínica"
        description="Módulo administrativo para gerenciar serviços, especialidades e exames exibidos no site e no agendamento."
      />

      {/* Abas e Listagem Interativa */}
      <CatalogoTabs specialties={specialties} exams={exams} />

    </div>
  );
}
