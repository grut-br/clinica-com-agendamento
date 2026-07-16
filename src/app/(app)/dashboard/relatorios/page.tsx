import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/features/appointments/queries";
import { getDashboardMetricsAction } from "@/features/reports/actions";
import { MetricsGrid } from "@/features/reports/components/metrics-grid";
import { PopularSpecialties } from "@/features/reports/components/popular-specialties";
import { AppointmentsChartClient } from "@/features/reports/components/appointments-chart-client";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Estatísticas da Operação | Med Odonto",
  description: "Relatórios e métricas de desempenho da clínica.",
};

// Desativa cache estático para a página de relatórios
export const revalidate = 0;

export default async function RelatoriosPage() {
  // 1. Controle de acesso (RBAC) - Apenas o Administrador pode visualizar dados executivos e financeiros
  const profile = await getUserProfile();
  const role = profile?.role || "pending";

  if (role !== "admin") {
    redirect("/dashboard");
  }

  // 2. Busca as métricas consolidadas por meio da Server Action
  const metrics = await getDashboardMetricsAction();

  return (
    <div className="space-y-8 min-h-[80vh]">
      
      {/* Cabeçalho da Página */}
      <PageHeader 
        eyebrow="Relatórios & Business Intelligence"
        title="Estatísticas da Operação"
        description="Visão gerencial consolidada sobre a volumetria de consultas, pacientes e faturamento."
      />

      {/* Grid de KPIs (Métricas Financeiras e Operacionais) */}
      <MetricsGrid metrics={metrics} />

      {/* Seção Gráfica Analítica (Layout Flex/Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Volumetria de Agendamentos (Gráfico de Barras) */}
        <div className="lg:col-span-2">
          <AppointmentsChartClient />
        </div>

        {/* Distribuição por Especialidade */}
        <div className="lg:col-span-1">
          <PopularSpecialties />
        </div>

      </div>

    </div>
  );
}
