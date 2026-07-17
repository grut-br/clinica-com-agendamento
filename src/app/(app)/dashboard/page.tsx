import React from "react";
import type { Metadata } from "next";
import { getRecentAppointments, getUserProfile, getAllProfessionals, getActiveSpecialties } from "@/features/appointments/queries";
import { logoutAction } from "@/features/auth/actions";
import { InternalAppointmentDialog } from "@/features/appointments/components/internal-appointment-dialog";
import { SlotGeneratorDialog } from "@/features/appointments/components/slot-generator-dialog";
import { Clock3, CalendarDays, ClipboardCheck, ListTodo, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { ReceptionTriage } from "@/components/reception/reception-triage";
import { AppShellContent } from "@/components/layout/app-shell";

import { DoctorDashboard } from "@/features/appointments/components/doctor-dashboard";
import { getDoctorAppointments } from "@/features/appointments/queries";

export const metadata: Metadata = {
  title: "Central Operacional | Med Odonto",
  description: "Triagem e acompanhamento da agenda da clínica.",
};

// Garante que o Next.js não arme cache estático para a dashboard e sempre busque dados atualizados
export const revalidate = 0;

export default async function DashboardPage() {
  // 1. Controle de RBAC na entrada do Dashboard (Segurança)
  const profile = await getUserProfile();
  const role = profile?.role || "pending";

  // Se o usuário for um médico, renderiza a Área do Médico diretamente no Dashboard
  if (role === "doctor") {
    const professionalId = profile?.professional_id;
    const appointments = professionalId ? await getDoctorAppointments(professionalId) : [];
    
    // Busca dados complementares do profissional no servidor usando a lista unificada
    const professionalsList = await getAllProfessionals();
    const professional = professionalsList.find(p => p.id === professionalId);
    const doctorName = professional?.name || "Profissional de Saúde";

    return (
      <AppShellContent className="space-y-8">
        <DoctorDashboard doctorName={doctorName} appointments={appointments} />
      </AppShellContent>
    );
  }

  // Se a conta estiver pendente, exibe uma tela amigável impedindo a exposição de dados confidenciais
  if (role === "pending") {
    return (
      <AppShellContent className="flex min-h-[70vh] items-center justify-center">
        <Card className="w-full max-w-xl p-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-warning/12 text-warning" aria-hidden="true"><Clock3 className="h-7 w-7" /></div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Acesso pendente</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">Sua conta foi registrada e aguarda liberação pelo administrador da clínica.</p>
          <form action={logoutAction} className="mt-6"><Button variant="outline" type="submit">Sair da conta</Button></form>
        </Card>
      </AppShellContent>
    );
  }

  // 2. Busca agendamentos recentes e dados do calendário
  const [appointments, professionalsList, specialties] = await Promise.all([
    getRecentAppointments(),
    getAllProfessionals(),
    getActiveSpecialties()
  ]);

  const professionals = professionalsList.filter(p => p.is_active);

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const pendingCount = appointments.filter((appointment) => appointment.status === "pending").length;
  const confirmedTodayCount = appointments.filter((appointment) => appointment.status === "confirmed" && appointment.slot?.date === todayKey).length;
  const todayCount = appointments.filter((appointment) => appointment.slot?.date === todayKey).length;
  const upcomingCount = appointments.filter((appointment) => appointment.status === "confirmed" && Boolean(appointment.slot?.date && appointment.slot.date >= todayKey)).length;

  return (
    <AppShellContent className="space-y-8">
      <PageHeader
        eyebrow="Central operacional"
        title="Bom trabalho. Vamos organizar o dia."
        description="Resolva as pendências primeiro e acompanhe o que acontece na agenda da clínica."
        actions={(
          <>
            <Link href="/dashboard/agenda" className="ui-focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--component-control-radius)] border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted">Ver agenda <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            <InternalAppointmentDialog professionals={professionalsList} />
          </>
        )}
      />

      <section aria-labelledby="today-overview" className="space-y-4">
        <div className="flex items-center justify-between gap-4"><h2 id="today-overview" className="font-heading text-lg font-semibold text-foreground">Visão de hoje</h2><span className="text-sm text-muted-foreground">{today.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</span></div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Pendências" value={pendingCount} detail="aguardando decisão" icon={<ListTodo className="h-5 w-5" />} />
          <StatCard label="Confirmadas hoje" value={confirmedTodayCount} detail="consultas já confirmadas" icon={<ClipboardCheck className="h-5 w-5" />} />
          <StatCard label="Na agenda de hoje" value={todayCount} detail="todos os status" icon={<CalendarDays className="h-5 w-5" />} />
          <StatCard label="Próximas consultas" value={upcomingCount} detail="a partir de hoje" icon={<Clock3 className="h-5 w-5" />} />
        </div>
      </section>

      <ReceptionTriage initialAppointments={appointments} />

      <section aria-labelledby="quick-actions" className="space-y-4">
        <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Atalhos da operação</p><h2 id="quick-actions" className="mt-1 font-heading text-lg font-semibold text-foreground">Resolva o próximo passo</h2></div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="flex items-center justify-between gap-4 p-5 transition-colors hover:border-accent/50">
            <div><h3 className="font-heading font-semibold text-foreground">Organizar disponibilidade</h3><p className="mt-1 text-sm text-muted-foreground">Consulte a agenda ou gere novos horários.</p></div>
            <div className="flex shrink-0 items-center gap-2"><SlotGeneratorDialog specialties={specialties} professionals={professionals} /><Link href="/dashboard/agenda" aria-label="Abrir gerenciamento de agenda" className="ui-focus-ring inline-flex min-h-11 w-11 items-center justify-center rounded-[var(--component-control-radius)] border border-border text-foreground hover:bg-muted"><CalendarDays className="h-4 w-4" aria-hidden="true" /></Link></div>
          </Card>
          <Card className="flex items-center justify-between gap-4 p-5 transition-colors hover:border-accent/50">
            <div><h3 className="font-heading font-semibold text-foreground">Acompanhar a agenda</h3><p className="mt-1 text-sm text-muted-foreground">Consulte a disponibilidade por profissional e especialidade.</p></div>
            <Link href="/dashboard/agenda" aria-label="Abrir agenda da clínica" className="ui-focus-ring inline-flex min-h-11 items-center gap-2 rounded-[var(--component-control-radius)] border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted">Abrir agenda <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </Card>
        </div>
      </section>
    </AppShellContent>
  );
}
