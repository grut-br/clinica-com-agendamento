import React from "react";
import { getUserProfile } from "@/features/appointments/queries";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAllProfessionals, getAllSpecialties } from "@/features/appointments/queries";
import { ProfessionalsManager } from "@/features/appointments/components/professionals-manager";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Corpo Clínico | Med Odonto",
  description: "Gerenciamento de médicos, dentistas e terapeutas parceiros da Med Odonto.",
};

// Desabilita cache estático para manter dados em tempo real
export const revalidate = 0;

export default async function ProfissionaisCmsPage() {
  const profile = await getUserProfile();
  const role = profile?.role || "pending";
  if (role === "doctor") {
    redirect("/dashboard");
  }

  // Carrega profissionais e especialidades de forma paralela no servidor (Vercel Best Practice)
  const [professionals, specialties] = await Promise.all([
    getAllProfessionals(),
    getAllSpecialties()
  ]);

  return (
    <div className="space-y-8 min-h-[80vh]">
      
      {/* Cabeçalho do CMS */}
      <PageHeader 
        eyebrow="Administração"
        title="Corpo Clínico (CMS)"
        description="Módulo administrativo para gerenciar profissionais de saúde, registros de classe e áreas de atendimento."
      />

      {/* Gerenciador Operacional */}
      <ProfessionalsManager 
        professionals={professionals} 
        specialties={specialties} 
      />

    </div>
  );
}
