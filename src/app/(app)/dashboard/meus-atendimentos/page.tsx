import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getDoctorAppointments, getUserProfile } from "@/features/appointments/queries";
import { DoctorAppointmentsList } from "@/features/appointments/components/doctor-appointments-list";
import { Stethoscope, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Meus Atendimentos | Med Odonto",
  description: "Visão do profissional de saúde para prontuários e evolução clínica de pacientes.",
};

export const revalidate = 0;

export default async function MeusAtendimentosPage() {
  // Recupera o perfil do usuário ativo (RBAC) no servidor
  const profile = await getUserProfile();
  const role = profile?.role || "pending";

  if (role !== "doctor") {
    redirect("/dashboard");
  }

  const professionalId = profile?.professional_id;

  // Busca os atendimentos confirmados do médico logado
  const appointments = professionalId ? await getDoctorAppointments(professionalId) : [];

  return (
    <div className="space-y-8 min-h-[80vh]">
      
      {/* Cabeçalho Principal */}
      <PageHeader 
        title="Painel de Atendimento Médico"
        description="Acompanhe sua agenda de consultas confirmadas do dia e realize a evolução clínica e prontuário de pacientes."
      />

      {/* Conteúdo Dinâmico */}
      <div className="space-y-6">
        {professionalId ? (
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-secondary" />
              Agenda do Dia
            </h3>
            <DoctorAppointmentsList appointments={appointments} />
          </div>
        ) : (
          <div className="p-12 text-center bg-zinc-900 border border-zinc-800 rounded-3xl text-zinc-400 font-light text-sm shadow-md max-w-xl mx-auto flex flex-col items-center justify-center">
            <AlertCircle className="h-12 w-12 text-amber-500 mb-4 animate-pulse" />
            <h3 className="text-base font-bold text-white">Vínculo Clínico Inexistente</h3>
            <p className="text-xs text-zinc-450 font-light mt-2 leading-relaxed max-w-xs">
              Sua conta de acesso não está vinculada a um perfil médico no Corpo Clínico. Entre em contato com o administrador do painel para associar seu cadastro.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
