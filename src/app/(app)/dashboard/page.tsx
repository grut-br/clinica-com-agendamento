import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getRecentAppointments, getUserProfile, getAllProfessionals } from "@/features/appointments/queries";
import { logoutAction } from "@/features/auth/actions";
import { DashboardAppointmentsList } from "@/features/appointments/components/dashboard-appointments-list";
import { InternalAppointmentDialog } from "@/features/appointments/components/internal-appointment-dialog";
import { Clock } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { createClient } from "@/lib/supabase/server";

import { DashboardTabsView } from "@/features/appointments/components/dashboard-tabs-view";
import { DashboardCalendarView } from "@/features/appointments/components/dashboard-calendar-view";
import { SlotGeneratorDialog } from "@/features/appointments/components/slot-generator-dialog";

export const metadata: Metadata = {
  title: "Painel de Agendamentos | Med Odonto",
  description: "Gerenciamento de consultas e exames da Med Odonto.",
};

// Garante que o Next.js não arme cache estático para a dashboard e sempre busque dados atualizados
export const revalidate = 0;

export default async function DashboardPage() {
  // 1. Controle de RBAC na entrada do Dashboard (Segurança)
  const profile = await getUserProfile();
  const role = profile?.role || "pending";

  // Se o usuário for um médico, redireciona diretamente para seus prontuários
  if (role === "doctor") {
    redirect("/dashboard/meus-atendimentos");
  }

  // Se a conta estiver pendente, exibe uma tela amigável impedindo a exposição de dados confidenciais
  if (role === "pending") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-card border border-border rounded-3xl max-w-xl mx-auto shadow-sm text-card-foreground transition-colors duration-300">
        <div className="h-16 w-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mb-5 border border-amber-500/25 animate-pulse">
          <Clock className="h-9 w-9" />
        </div>
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Acesso Pendente</h2>
        <p className="mt-2 text-muted-foreground text-sm font-light leading-relaxed max-w-sm">
          Sua conta foi registrada no sistema, mas está aguardando liberação por parte do administrador da clínica.
        </p>
        <p className="mt-1.5 text-muted-foreground/80 text-xs font-light leading-relaxed max-w-xs">
          Assim que seu perfil administrativo ou clínico for configurado, você terá acesso total à triagem operacional.
        </p>
        <form action={logoutAction} className="mt-8">
          <button 
            type="submit" 
            className="px-5 py-2.5 rounded-xl border border-border hover:bg-muted text-xs font-bold text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          >
            Sair da Conta
          </button>
        </form>
      </div>
    );
  }

  // 2. Busca agendamentos recentes e dados do calendário
  const supabase = await createClient();

  const [appointments, professionalsList, specialtiesRes, professionalsRes] = await Promise.all([
    getRecentAppointments(),
    getAllProfessionals(),
    supabase.from("specialties").select("id, name, slug").eq("is_active", true).order("name", { ascending: true }),
    supabase.from("professionals").select("id, name, specialty_id").eq("is_active", true).order("name", { ascending: true })
  ]);

  const specialties = specialtiesRes.data || [];
  const professionals = professionalsRes.data || [];

  return (
    <div className="space-y-8 min-h-[80vh]">
      
      {/* Cabeçalho do Painel */}
      <PageHeader 
        title="Painel de Agendamentos"
        description="Gerenciamento e triagem de pré-agendamentos da clínica. Confirme ou cancele as solicitações abaixo."
      >
        <InternalAppointmentDialog professionals={professionalsList} />
      </PageHeader>

      <DashboardTabsView 
        pendingAppointments={<DashboardAppointmentsList initialAppointments={appointments} />}
        calendarContent={<DashboardCalendarView specialties={specialties} professionals={professionals} />}
        generatorDialog={<SlotGeneratorDialog specialties={specialties} professionals={professionals} />}
      />
      
    </div>
  );
}
