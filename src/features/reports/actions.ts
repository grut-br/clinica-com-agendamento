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

  // 1. Total de agendamentos
  const { count: appointmentsCount } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true });

  const totalAppointments = appointmentsCount || 0;

  // 2. Taxa de cancelamento
  const { count: cancelledCount } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true })
    .eq("status", "cancelled");

  const cancellationRate = totalAppointments > 0 
    ? Math.round(((cancelledCount || 0) / totalAppointments) * 100)
    : 0;

  // 3. Novos pacientes (Total de cadastrados)
  const { count: patientsCount } = await supabase
    .from("patients")
    .select("*", { count: "exact", head: true });

  const newPatients = patientsCount || 0;

  // 4. Receita estimada (Baseada em consultas confirmadas ou concluídas a R$ 150 cada)
  const { count: activeCount } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true })
    .in("status", ["confirmed", "completed"]);

  const estimatedRevenue = (activeCount || 0) * 150;

  return {
    totalAppointments,
    cancellationRate,
    newPatients,
    estimatedRevenue,
    growthPercentage: {
      appointments: 12,
      cancellation: -8,
      patients: 15,
      revenue: 18,
    },
  };
}
