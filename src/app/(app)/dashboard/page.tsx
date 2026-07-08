import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getRecentAppointments, getUserProfile, getAllProfessionals } from "@/features/appointments/queries";
import { logoutAction } from "@/features/auth/actions";
import { DashboardAppointmentsList } from "@/features/appointments/components/dashboard-appointments-list";
import { InternalAppointmentDialog } from "@/features/appointments/components/internal-appointment-dialog";
import { Clock } from "lucide-react";

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

  // 2. Busca agendamentos recentes para a recepção/administração
  const appointments = await getRecentAppointments();
  const professionals = await getAllProfessionals();

  return (
    <div className="space-y-8 min-h-[80vh]">
      
      {/* Cabeçalho do Painel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Painel de Agendamentos
          </h1>
          <p className="text-muted-foreground font-light">
            Gerenciamento e triagem de pré-agendamentos da clínica. Confirme ou cancele as solicitações abaixo.
          </p>
        </div>
        <div className="shrink-0">
          <InternalAppointmentDialog professionals={professionals} />
        </div>
      </div>

      {/* Abas de Navegação Rápida no Cabeçalho */}
      <div className="flex border-b border-border gap-6">
        <Link 
          href="/dashboard"
          className="pb-3 border-b-2 border-secondary text-sm font-bold text-foreground transition-all cursor-pointer"
        >
          Solicitações Pendentes
        </Link>
        <Link 
          href="/dashboard/agenda"
          className="pb-3 border-b-2 border-transparent text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border transition-all cursor-pointer"
        >
          Gerenciar Agenda
        </Link>
      </div>

      {/* Catálogo com Filtro de Status Interativo e Triagem Reativa */}
      <DashboardAppointmentsList initialAppointments={appointments} />
      
    </div>
  );
}
