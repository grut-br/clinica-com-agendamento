import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/features/appointments/queries";
import { getClinicSettings } from "@/features/clinic/queries";
import { ClinicSettingsForm } from "@/features/clinic/components/clinic-settings-form";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Configurações da Clínica | Med Odonto",
  description: "Gerencie os dados institucionais, aparência e notificações do sistema.",
};

// Garante que a página sempre busque os dados mais recentes do banco
export const revalidate = 0;

export default async function ConfiguracoesPage() {
  // 1. Controle de acesso (RBAC) - Apenas Administradores e Recepcionistas podem alterar configurações
  const profile = await getUserProfile();
  const role = profile?.role || "pending";

  if (role !== "admin") {
    redirect("/dashboard");
  }

  // 2. Busca as configurações da clínica cadastradas no banco de dados
  const settings = await getClinicSettings();

  return (
    <div className="space-y-8 min-h-[80vh]">
      
      {/* Cabeçalho Principal */}
      <PageHeader 
        eyebrow="Configurações do Sistema"
        title="Brand Identity & Configurações"
        description="Gerencie a identidade visual, dados institucionais e alertas de atendimento da clínica."
      />

      {/* Formulário com subdivisão de abas */}
      <ClinicSettingsForm initialSettings={settings} />

    </div>
  );
}
