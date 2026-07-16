import React from "react";
import { getUserProfile, getActiveSpecialties, getAllProfessionals } from "@/features/appointments/queries";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AgendaWorkspace } from "@/components/agenda/agenda-workspace";
import { ScheduleGenerator } from "@/components/agenda/schedule-generator";
import { AppShellContent } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Agenda da Clínica | Med Odonto",
  description: "Visualização e geração da grade de horários da clínica.",
};

export const revalidate = 0;

export default async function AgendaPage() {
  const profile = await getUserProfile();
  const role = profile?.role || "pending";
  if (role === "doctor") {
    redirect("/dashboard");
  }

  // Busca especialidades e profissionais paralelamente no servidor (Vercel Best Practice)
  const [specialties, professionalsList] = await Promise.all([
    getActiveSpecialties(),
    getAllProfessionals()
  ]);

  const professionals = professionalsList.filter(p => p.is_active);

  return (
    <AppShellContent className="space-y-10">
      <PageHeader
        eyebrow="Núcleo da operação"
        title="A agenda começa aqui."
        description="Encontre a grade certa, acompanhe os horários e mantenha a disponibilidade da clínica sob controle."
        actions={<Link href="/dashboard" className="ui-focus-ring inline-flex min-h-11 items-center justify-center rounded-[var(--component-control-radius)] border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted">Voltar para solicitações</Link>}
      />
      <AgendaWorkspace specialties={specialties} professionals={professionals} />
      <ScheduleGenerator specialties={specialties} professionals={professionals} />
    </AppShellContent>
  );
}
