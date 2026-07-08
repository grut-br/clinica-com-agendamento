"use server";

import { createClient } from "@/lib/supabase/server";

export interface DashboardMetrics {
  totalAppointments: number;
  cancellationRate: number;
  newPatients: number;
  estimatedRevenue: number;
  growthPercentage: {
    appointments: number;
    cancellation: number;
    patients: number;
    revenue: number;
  };
}

/**
 * Server Action mockada para retornar estatísticas e KPIs operacionais da clínica.
 */
export async function getDashboardMetricsAction(): Promise<DashboardMetrics> {
  const supabase = await createClient();

  // Busca dados reais das tabelas (atualmente vazio)
  const { count: appointmentsCount } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true });

  const totalAppointments = appointmentsCount || 0;

  return {
    totalAppointments,
    cancellationRate: 0,
    newPatients: 0,
    estimatedRevenue: 0,
    growthPercentage: {
      appointments: 0,
      cancellation: 0,
      patients: 0,
      revenue: 0,
    },
  };
}
